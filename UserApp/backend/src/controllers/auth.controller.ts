/**
 * MandiKart — UserApp Auth Controller (Buyers)
 * Issues 15-day rolling session tokens and sliding renewal.
 */

import { Request, Response } from 'express';
import { UserRole } from '@mandikart/shared-types';
import { auditLog, SessionManager } from '@mandikart/shared-core';

export class BuyerAuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'Phone number is required' },
      });
      return;
    }

    const cleanPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const buyerId = `buyer_${Date.now()}`;

    // 15-day rolling session
    const session = SessionManager.createSession({
      userId: buyerId,
      role: UserRole.BUYER,
      phone: cleanPhone,
    });

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: 'BUYER_LOGIN',
      resourceType: 'USER',
      resourceId: buyerId,
    });

    res.status(200).json({
      data: {
        token: session.token,
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
        buyer: {
          id: buyerId,
          fullName: 'Amit Grocery Mart',
          phone: cleanPhone,
          buyerType: 'RETAIL',
          city: 'Mumbai',
          state: 'Maharashtra',
          role: 'BUYER',
        },
      },
      meta: null,
      error: null,
    });
  }

  static async refreshSession(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        data: null,
        meta: null,
        error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' },
      });
      return;
    }
    const token = authHeader.split(' ')[1];
    const result = SessionManager.refreshSession(token);
    if (!result.success) {
      res.status(401).json({
        data: null,
        meta: null,
        error: { code: 'SESSION_EXPIRED', message: result.error || 'Session expired. Please log in again.' },
      });
      return;
    }
    res.status(200).json({
      data: {
        token: result.token,
        expiresAt: result.expiresAt,
        message: '15-day session successfully extended.',
      },
      meta: null,
      error: null,
    });
  }
}
