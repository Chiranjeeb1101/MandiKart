import { Router, Request, Response } from 'express';
import { requireAuth, requireIdempotency, ConsentService } from '@mandikart/shared-core';
import { ConsentInputSchema, UserRole } from '@mandikart/shared-types';

export const consentRouter = Router();

consentRouter.get('/status', requireAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
  const role = req.user?.role || UserRole.BUYER;
  const status = ConsentService.getConsentStatus(userId, role);

  res.status(200).json({
    data: status,
    meta: null,
    error: null,
  });
});

consentRouter.post('/agree', requireAuth, requireIdempotency, async (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
  const role = req.user?.role || UserRole.BUYER;

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
