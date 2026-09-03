/**
 * MandiKart — User Consent, Cookies & App Permissions Service
 * Records and enforces legal acceptance of Terms, Privacy Policy, Cookies & Device Permissions.
 */

import { Response } from 'express';
import { UserRole, ConsentInput, ConsentRecord } from '@mandikart/shared-types';
import { CONSTANTS } from '@mandikart/shared-config';
import { auditLog } from '../utils/auditLogger.js';

// In-memory consent store (backed by database table in production)
const consentStore = new Map<string, ConsentRecord>();

export class ConsentService {
  /**
   * Records user agreement to terms, privacy, cookie sessions, and app permissions.
   */
  static async recordConsent(params: {
    userId: string;
    role: UserRole;
    input: ConsentInput;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ConsentRecord> {
    const now = new Date().toISOString();
    const record: ConsentRecord = {
      id: `cst_${Date.now()}_${params.userId.slice(-4)}`,
      userId: params.userId,
      role: params.role,
      hasAcceptedConsent: true,
      requiresConsent: false,
      termsAndConditions: params.input.termsAndConditions,
      privacyPolicy: params.input.privacyPolicy,
      cookiesConsent: params.input.cookiesConsent,
      permissions: {
        location: params.input.permissions?.location ?? false,
        camera: params.input.permissions?.camera ?? false,
        notifications: params.input.permissions?.notifications ?? false,
        storage: params.input.permissions?.storage ?? false,
      },
      version: params.input.version || '1.0',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      acceptedAt: now,
      updatedAt: now,
    };

    consentStore.set(params.userId, record);

    await auditLog({
      actorId: params.userId,
      role: params.role,
      action: 'ACCEPT_TERMS_AND_PERMISSIONS',
      resourceType: 'USER',
      resourceId: record.id,
      metadata: {
        version: record.version,
        cookies: record.cookiesConsent,
        permissions: record.permissions,
      },
    });

    return record;
  }

  /**
   * Retrieves the current consent and permission acceptance status for a user.
   */
  static getConsentStatus(userId: string, role: UserRole): ConsentRecord {
    const existing = consentStore.get(userId);
    if (existing) {
      return existing;
    }

    // Default status: User has NOT yet accepted terms & permissions!
    const now = new Date().toISOString();
    return {
      id: `cst_pending_${userId}`,
      userId,
      role,
      hasAcceptedConsent: false,
      requiresConsent: true,
      termsAndConditions: false,
      privacyPolicy: false,
      cookiesConsent: false,
      permissions: {
        location: false,
        camera: false,
        notifications: false,
        storage: false,
      },
      version: '1.0',
      acceptedAt: null,
      updatedAt: now,
    };
  }

  /**
   * Quick boolean check to verify if a user has completed consent onboarding.
   */
  static hasUserConsented(userId: string): boolean {
    const existing = consentStore.get(userId);
    return Boolean(existing && existing.hasAcceptedConsent && existing.termsAndConditions && existing.privacyPolicy);
  }

  /**
   * Helper to write a secure 15-day cookie session for web & hybrid clients.
   */
  static setSessionCookie(res: Response, token: string): void {
    const maxAgeMs = CONSTANTS.SESSION_TTL_SECONDS * 1000;
    res.cookie('mks_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAgeMs,
      path: '/',
    });
  }

  /**
   * Clears session cookie on logout.
   */
  static clearSessionCookie(res: Response): void {
    res.clearCookie('mks_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }
}
