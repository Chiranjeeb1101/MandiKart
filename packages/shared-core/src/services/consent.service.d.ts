/**
 * MandiKart — User Consent, Cookies & App Permissions Service
 * Records and enforces legal acceptance of Terms, Privacy Policy, Cookies & Device Permissions.
 */
import { Response } from 'express';
import { UserRole, ConsentInput, ConsentRecord } from '@mandikart/shared-types';
export declare class ConsentService {
    /**
     * Records user agreement to terms, privacy, cookie sessions, and app permissions.
     */
    static recordConsent(params: {
        userId: string;
        role: UserRole;
        input: ConsentInput;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ConsentRecord>;
    /**
     * Retrieves the current consent and permission acceptance status for a user.
     */
    static getConsentStatus(userId: string, role: UserRole): ConsentRecord;
    /**
     * Quick boolean check to verify if a user has completed consent onboarding.
     */
    static hasUserConsented(userId: string): boolean;
    /**
     * Helper to write a secure 15-day cookie session for web & hybrid clients.
     */
    static setSessionCookie(res: Response, token: string): void;
    /**
     * Clears session cookie on logout.
     */
    static clearSessionCookie(res: Response): void;
}
