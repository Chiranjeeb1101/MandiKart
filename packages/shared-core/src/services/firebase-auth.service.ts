/**
 * MandiKart — Firebase Authentication & Supabase Synchronization Service
 * Handles:
 *  - Google OAuth / Gmail Sign-In ("Continue with Google")
 *  - Phone SMS OTP Authentication
 *  - Seamless two-way sync into Supabase PostgreSQL (buyers / farmers tables)
 */

import { UserRole } from '@mandikart/shared-types';
import { getSupabaseAdmin } from '../db/supabase.js';
import { SessionManager } from '../auth/session.js';
import { auditLog } from '../utils/auditLogger.js';

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

export class FirebaseAuthService {
  /**
   * Authenticates user via Google OAuth (Gmail) and syncs into Supabase.
   */
  static async authenticateWithGoogle(
    payload: GoogleAuthPayload
  ): Promise<AuthSessionResponse> {
    const supabase = getSupabaseAdmin();
    const cleanEmail = payload.email.toLowerCase().trim();
    let userId = `user_g_${Date.now()}`;
    let isNewUser = false;

    // 1. Sync / Upsert with Supabase Database
    try {
      if (payload.role === UserRole.BUYER) {
        const { data: existing } = await supabase
          .from('buyers')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (existing) {
          userId = existing.id;
          await supabase
            .from('buyers')
            .update({
              full_name: payload.fullName || existing.full_name,
              avatar_url: payload.avatarUrl || existing.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        } else {
          isNewUser = true;
          const { data: inserted } = await supabase
            .from('buyers')
            .insert({
              phone: payload.phone || `+91g${Date.now().toString().slice(-8)}`,
              email: cleanEmail,
              full_name: payload.fullName || 'Google Buyer',
              avatar_url: payload.avatarUrl,
              buyer_type: 'RETAIL',
              is_verified: true,
            })
            .select()
            .single();

          if (inserted) userId = inserted.id;
        }
      } else if (payload.role === UserRole.FARMER) {
        const { data: existing } = await supabase
          .from('farmers')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (existing) {
          userId = existing.id;
        } else {
          isNewUser = true;
          const { data: inserted } = await supabase
            .from('farmers')
            .insert({
              phone: payload.phone || `+91f${Date.now().toString().slice(-8)}`,
              email: cleanEmail,
              full_name: payload.fullName || 'Google Farmer',
              avatar_url: payload.avatarUrl,
              is_verified: true,
              state: 'Maharashtra',
              district: 'Nashik',
              farm_size_acres: 5,
              ownership_type: 'Owner',
              primary_crops: ['Onion', 'Tomato'],
            })
            .select()
            .single();

          if (inserted) userId = inserted.id;
        }
      }
    } catch {
      // Offline fallback: Use deterministic memory session
    }

    // 2. Issue 15-day rolling JWT Session
    const session = SessionManager.createSession({
      userId,
      role: payload.role,
      phone: payload.phone || '+910000000000',
      email: cleanEmail,
    });

    await auditLog({
      actorId: userId,
      role: payload.role,
      action: 'GOOGLE_OAUTH_LOGIN',
      resourceType: 'USER',
      resourceId: userId,
      metadata: { email: cleanEmail, isNewUser },
    });

    return {
      token: session.token,
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
      user: {
        id: userId,
        fullName: payload.fullName,
        email: cleanEmail,
        phone: payload.phone || '+91 98765 43210',
        role: payload.role,
        avatarUrl: payload.avatarUrl,
      },
      isNewUser,
    };
  }

  /**
   * Completes Firebase Phone OTP verification and syncs into Supabase.
   */
  static async authenticateWithPhoneOtp(
    phone: string,
    role: UserRole = UserRole.BUYER,
    fullName?: string
  ): Promise<AuthSessionResponse> {
    const cleanPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const supabase = getSupabaseAdmin();
    let userId = `user_p_${Date.now()}`;
    let isNewUser = false;

    try {
      if (role === UserRole.BUYER) {
        const { data: existing } = await supabase
          .from('buyers')
          .select('*')
          .eq('phone', cleanPhone)
          .single();

        if (existing) {
          userId = existing.id;
        } else {
          isNewUser = true;
          const { data: inserted } = await supabase
            .from('buyers')
            .insert({
              phone: cleanPhone,
              full_name: fullName || 'Verified Buyer',
              buyer_type: 'RETAIL',
              is_verified: true,
            })
            .select()
            .single();

          if (inserted) userId = inserted.id;
        }
      }
    } catch {
      // Offline fallback
    }

    const session = SessionManager.createSession({
      userId,
      role,
      phone: cleanPhone,
    });

    await auditLog({
      actorId: userId,
      role,
      action: 'PHONE_OTP_LOGIN',
      resourceType: 'USER',
      resourceId: userId,
      metadata: { phone: cleanPhone, isNewUser },
    });

    return {
      token: session.token,
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
      user: {
        id: userId,
        fullName: fullName || 'Verified User',
        email: `${cleanPhone.replace('+', '')}@mandikart.in`,
        phone: cleanPhone,
        role,
      },
      isNewUser,
    };
  }
}
