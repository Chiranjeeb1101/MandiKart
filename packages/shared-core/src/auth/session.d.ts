/**
 * MandiKart — 15-Day Rolling Session Manager
 * Cryptographic HMAC-signed session tokens with 15-day sliding inactivity expiration.
 */
import { UserRole } from '@mandikart/shared-types';
export interface SessionPayload {
    sessionId: string;
    userId: string;
    role: UserRole;
    phone?: string;
    email?: string;
    issuedAt: number;
    lastActivityAt: number;
    expiresAt: number;
}
export interface SessionRecord {
    sessionId: string;
    userId: string;
    role: UserRole;
    phone?: string;
    email?: string;
    lastActivityAt: number;
    expiresAt: number;
}
export declare class SessionManager {
    /**
     * Issues a brand new 15-day session for a user upon login or OTP verification.
     */
    static createSession(params: {
        userId: string;
        role: UserRole;
        phone?: string;
        email?: string;
    }): {
        token: string;
        sessionId: string;
        expiresAt: string;
    };
    /**
     * Validates token and extends sliding 15-day window if within validity.
     * If > 15 days elapsed since last activity, rejects as expired.
     */
    static validateAndTouch(token: string): {
        valid: boolean;
        session?: SessionRecord;
        error?: string;
        renewed?: boolean;
    };
    /**
     * Explicitly refresh an active session token to extend its client-side TTL.
     */
    static refreshSession(token: string): {
        success: boolean;
        token?: string;
        expiresAt?: string;
        error?: string;
    };
    /**
     * Terminate session upon user logout.
     */
    static revokeSession(sessionId: string): void;
}
