/**
 * MandiKart — Firebase Authentication & Supabase Synchronization Service
 * Handles:
 *  - Google OAuth / Gmail Sign-In ("Continue with Google")
 *  - Phone SMS OTP Authentication
 *  - Seamless two-way sync into Supabase PostgreSQL (buyers / farmers tables)
 */
import { UserRole } from '@mandikart/shared-types';
export interface GoogleAuthPayload {
    email: string;
    fullName: string;
    avatarUrl?: string;
    idToken?: string;
    role: UserRole;
    phone?: string;
}
export interface AuthSessionResponse {
    token: string;
    sessionId: string;
    expiresAt: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: UserRole;
        avatarUrl?: string;
    };
    isNewUser: boolean;
}
export declare class FirebaseAuthService {
    /**
     * Authenticates user via Google OAuth (Gmail) and syncs into Supabase.
     */
    static authenticateWithGoogle(payload: GoogleAuthPayload): Promise<AuthSessionResponse>;
    /**
     * Completes Firebase Phone OTP verification and syncs into Supabase.
     */
    static authenticateWithPhoneOtp(phone: string, role?: UserRole, fullName?: string): Promise<AuthSessionResponse>;
}
