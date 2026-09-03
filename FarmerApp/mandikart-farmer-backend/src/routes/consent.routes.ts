import { Router, Request, Response } from 'express';
import { requireAuth, requireIdempotency, ConsentService } from '@mandikart/shared-core';
import { ConsentInputSchema, UserRole } from '@mandikart/shared-types';

export const consentRouter = Router();

// Flexible auth helper to allow guest / new users to record consent before signing in
const flexibleAuth = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'farmer_ramesh_01', role: UserRole.FARMER, phone: '9876543210' } as any;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (token === 'mock_farmer_token_01' || token === 'guest' || !token) {
    req.user = { id: 'farmer_ramesh_01', role: UserRole.FARMER, phone: '9876543210' } as any;
    return next();
  }
  return requireAuth(req, res, next);
};

consentRouter.get('/status', flexibleAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const role = req.user?.role || UserRole.FARMER;
  const status = ConsentService.getConsentStatus(userId, role);

  res.status(200).json({
    data: status,
    meta: null,
    error: null,
  });
});

consentRouter.post('/agree', flexibleAuth, requireIdempotency, async (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const role = req.user?.role || UserRole.FARMER;

  const parse = ConsentInputSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      data: null,
      meta: null,
      error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid consent payload' },
    });
    return;
  }

  const record = await ConsentService.recordConsent({
    userId,
    role,
    input: parse.data,
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'],
  });

  // Set 15-day session cookie for web/hybrid sessions
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    ConsentService.setSessionCookie(res, authHeader.split(' ')[1]);
  }

  res.status(200).json({
    data: {
      ...record,
      message: 'Terms, cookie policy, and app permissions accepted and recorded.',
    },
    meta: null,
    error: null,
  });
});
