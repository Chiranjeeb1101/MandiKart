/**
 * MandiKart Farmer — Firebase Phone & Google Authentication Service
 * 
 * Manages:
 *  - Firebase Phone Number SMS OTP dispatch (10,000 free verifications/month)
 *  - Firebase Confirmation Code verification
 *  - Two-way sync with MandiKart Node.js backend -> Supabase PostgreSQL DB
 */

import {
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
  User,
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { firebaseAuth } from './firebaseConfig';
import { apiClient } from './apiClient';
import { useAuthStore } from '@/store/authStore';
import { promptGoogleSignIn } from './googleAuth';

export interface FirebaseOtpDispatchResult {
  success: boolean;
  confirmationResult?: ConfirmationResult;
  verificationId?: string;
  simulatedCode?: string;
  message?: string;
  error?: string;
}

export interface FirebaseSyncResult {
  success: boolean;
  token?: string;
  farmer?: any;
  error?: string;
}

// Global reference to active confirmation session
let activeConfirmationResult: ConfirmationResult | null = null;
let activeVerificationId: string | null = null;

export const firebaseAuthService = {
  /**
   * Initializes or returns invisible/modal RecaptchaVerifier for Phone Auth.
   */
  getRecaptchaVerifier: (containerId = 'recaptcha-container'): RecaptchaVerifier | null => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }
        return new RecaptchaVerifier(firebaseAuth, containerId, {
          size: 'invisible',
          callback: () => {},
        });
      } catch (err: any) {
        console.warn('[Firebase Recaptcha] Error initializing RecaptchaVerifier:', err?.message);
      }
    }
    return null;
  },

  /**
   * Sends 6-digit SMS OTP to Indian mobile number (+91XXXXXXXXXX) via Firebase Phone Auth.
   */
  sendPhoneOtp: async (
    rawPhone: string,
    appVerifier?: any
  ): Promise<FirebaseOtpDispatchResult> => {
    try {
      const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10);
      if (!cleanDigits || cleanDigits.length < 10) {
        return { success: false, error: 'Please enter a valid 10-digit mobile number' };
      }
      const formattedPhone = `+91${cleanDigits}`;

      // 1. If running on Web with RecaptchaVerifier
      if (Platform.OS === 'web') {
        const verifier = appVerifier || firebaseAuthService.getRecaptchaVerifier();
        if (verifier) {
          const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, verifier);
          activeConfirmationResult = confirmation;
          activeVerificationId = confirmation.verificationId;
          return {
            success: true,
            confirmationResult: confirmation,
            verificationId: confirmation.verificationId,
            message: `OTP sent via Firebase SMS to ${formattedPhone}`,
          };
        }
      }

      // 2. Fallback / Native Dispatch via MandiKart Backend OtpService Bridge
      // (This guarantees 100% uptime in Expo Go without reCAPTCHA webview freezes)
      const res: any = await apiClient.post('/auth/send-otp', {
        phone: cleanDigits,
        channel: 'SMS',
      });

      if (res?.data?.status === 'SUCCESS' || res?.data?.success) {
        return {
          success: true,
          simulatedCode: res.data?.simulatedCode || '',
          verificationId: `mk_bridge_${Date.now()}`,
          message: res.data?.message || `Verification code sent to ${formattedPhone}`,
        };
      }

      return {
        success: false,
        error: res?.error?.message || 'Failed to dispatch SMS verification code.',
      };
    } catch (err: any) {
      console.warn('[Firebase Auth] sendPhoneOtp caught error:', err?.message);
      return {
        success: false,
        error: err?.message || 'Failed to connect with SMS verification service.',
      };
    }
  },

  /**
   * Verifies the 6-digit OTP code and syncs the Farmer into Supabase PostgreSQL.
   */
  verifyOtpAndSync: async (
    phone: string,
    code: string,
    fullName?: string,
    verificationId?: string
  ): Promise<FirebaseSyncResult> => {
    try {
      const cleanDigits = phone.replace(/\D/g, '').slice(-10);
      const formattedPhone = `+91${cleanDigits}`;
      let firebaseUid = `fb_${Date.now()}`;
      let idToken: string | undefined = undefined;

      // 1. Try confirming with active Firebase ConfirmationResult if available
      if (activeConfirmationResult) {
        try {
          const userCredential = await activeConfirmationResult.confirm(code);
          const user = userCredential.user;
          firebaseUid = user.uid;
          idToken = await user.getIdToken();
        } catch (confirmErr: any) {
          console.warn('[Firebase Auth] Direct confirmation notice:', confirmErr?.message);
        }
      }

      // 2. Sync / Upsert with MandiKart Node.js Backend -> Supabase Database
      const syncPayload = {
        phone: formattedPhone,
        code,
        fullName: fullName || `Farmer ${cleanDigits.slice(-4)}`,
        firebaseUid,
        idToken,
      };

      const res: any = await apiClient.post('/auth/firebase-sync', syncPayload).catch(async () => {
        // Fallback to standard verify-otp endpoint if sync route is in flight
        return await apiClient.post('/auth/verify-otp', {
          phone: cleanDigits,
          otp: code,
          fullName,
        });
      });

      if (res?.data?.token && res?.data?.farmer) {
        const { setAuthenticated, setPhoneNumber, setUser } = useAuthStore.getState();
        setAuthenticated(res.data.token, res.data.farmer);
        setPhoneNumber(formattedPhone);
        setUser({
          id: res.data.farmer.id,
          name: res.data.farmer.fullName || fullName || `Farmer`,
          fullName: res.data.farmer.fullName || fullName || `Farmer`,
          phone: formattedPhone,
          isVerified: true,
          role: 'FARMER',
          state: res.data.farmer.state || 'Maharashtra',
          district: res.data.farmer.district || 'Nashik',
          village: res.data.farmer.village,
          farmSizeAcres: res.data.farmer.farmSizeAcres,
        });

        return {
          success: true,
          token: res.data.token,
          farmer: res.data.farmer,
        };
      }

      return {
        success: false,
        error: res?.error?.message || 'Verification failed. Please check the code.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to verify code and sync with database.',
      };
    }
  },

  /**
   * Universal helper to sync any Firebase user profile with MandiKart backend -> Supabase DB.
   */
  syncUserWithBackend: async (payload: {
    firebaseUid: string;
    email?: string;
    fullName?: string;
    avatarUrl?: string;
    idToken?: string;
    phone?: string;
  }): Promise<FirebaseSyncResult> => {
    try {
      const res: any = await apiClient.post('/auth/firebase-sync', payload);

      if (res?.data?.token && res?.data?.farmer) {
        const { setAuthenticated, setPhoneNumber, setUser } = useAuthStore.getState();
        setAuthenticated(res.data.token, res.data.farmer);
        const validPhone =
          res.data.farmer.phone && !res.data.farmer.phone.includes('9876543210')
            ? res.data.farmer.phone
            : (payload.phone || '');
        if (validPhone) {
          setPhoneNumber(validPhone);
        }
        setUser({
          id: res.data.farmer.id,
          name: res.data.farmer.fullName || payload.fullName || 'Farmer',
          fullName: res.data.farmer.fullName || payload.fullName || 'Farmer',
          email: res.data.farmer.email || payload.email,
          avatarUri: res.data.farmer.avatarUrl || payload.avatarUrl,
          phone: validPhone,
          isVerified: true,
          role: 'FARMER',
          state: res.data.farmer.state || 'Maharashtra',
          district: res.data.farmer.district || 'Nashik',
          village: res.data.farmer.village,
          farmSizeAcres: res.data.farmer.farmSizeAcres,
        });

        return {
          success: true,
          token: res.data.token,
          farmer: res.data.farmer,
        };
      }

      return {
        success: false,
        error: res?.error?.message || 'Failed to synchronize farmer profile.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error while synchronizing with database.',
      };
    }
  },

  /**
   * Signs in with Google via Firebase Authentication on Web & Mobile,
   * automatically syncing farmer account into Supabase PostgreSQL.
   */
  signInWithGoogleFirebase: async (pendingPhone?: string): Promise<FirebaseSyncResult> => {
    try {
      // 1. Web Flow: Native Firebase signInWithPopup
      if (Platform.OS === 'web') {
        try {
          const provider = new GoogleAuthProvider();
          provider.addScope('email');
          provider.addScope('profile');
          const userCred = await signInWithPopup(firebaseAuth, provider);
          const fbUser = userCred.user;
          const idToken = await fbUser.getIdToken();

          return await firebaseAuthService.syncUserWithBackend({
            firebaseUid: fbUser.uid,
            email: fbUser.email || undefined,
            fullName: fbUser.displayName || undefined,
            avatarUrl: fbUser.photoURL || undefined,
            idToken,
            phone: pendingPhone || fbUser.phoneNumber || undefined,
          });
        } catch (popupErr: any) {
          if (
            popupErr.code === 'auth/popup-closed-by-user' ||
            popupErr.code === 'auth/cancelled-popup-request'
          ) {
            return { success: false, error: 'Google sign-in was cancelled.' };
          }
          console.warn('[Firebase Web Google Auth] Notice:', popupErr.message);
        }
      }

      // 2. Native Mobile Flow (Expo Go / Standalone on Android & iOS):
      // Launch Google OAuth dialog and bridge credentials into Firebase
      const googleRes = await promptGoogleSignIn(pendingPhone);
      if (googleRes.error === 'REDIRECTING') {
        return { success: false, error: 'REDIRECTING' };
      }

      if (!googleRes.success || !googleRes.user) {
        return {
          success: false,
          error: googleRes.error || 'Google sign-in was cancelled.',
        };
      }

      let firebaseUid = `fb_${Date.now()}`;
      let idToken = googleRes.user.idToken;

      // Attempt to link credentials with Firebase client session
      if (googleRes.user.idToken) {
        try {
          const credential = GoogleAuthProvider.credential(googleRes.user.idToken);
          const userCred = await signInWithCredential(firebaseAuth, credential);
          firebaseUid = userCred.user.uid;
          idToken = await userCred.user.getIdToken();
        } catch (fbErr: any) {
          console.warn('[Firebase Auth] Linking Google credential note:', fbErr?.message);
        }
      }

      // Sync user profile directly into Supabase DB
      return await firebaseAuthService.syncUserWithBackend({
        firebaseUid,
        email: googleRes.user.email,
        fullName: googleRes.user.fullName,
        avatarUrl: googleRes.user.avatarUrl,
        idToken,
        phone: pendingPhone,
      });
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'An error occurred during Google sign-in.',
      };
    }
  },
};
