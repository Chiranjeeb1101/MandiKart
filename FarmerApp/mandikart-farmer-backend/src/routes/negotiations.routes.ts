import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { UserRole } from '@mandikart/shared-types';
import { FarmerNegotiationsController } from '../controllers/negotiations.controller.js';

export const negotiationsRouter = Router();

/**
 * Permissive auth: uses Bearer token if present; if absent, defaults to demo farmer
 * so farmer client requests never fail with 401 when testing locally or over LAN.
 */
function permissiveFarmerAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    requireAuth(req, res, next);
    return;
  }
  (req as any).user = {
    id: 'd1111111-1111-1111-1111-111111111111',
    phone: '+91 98220 11111',
    role: UserRole.FARMER,
  };
  next();
}

negotiationsRouter.get('/', permissiveFarmerAuth, FarmerNegotiationsController.listNegotiations);
negotiationsRouter.get('/:id', permissiveFarmerAuth, FarmerNegotiationsController.getNegotiation);
negotiationsRouter.post('/:id/messages', permissiveFarmerAuth, FarmerNegotiationsController.sendMessage);
negotiationsRouter.post('/:id/respond', permissiveFarmerAuth, requireIdempotency, FarmerNegotiationsController.respondToNegotiation);
negotiationsRouter.post('/:id/accept', permissiveFarmerAuth, requireIdempotency, (req, res) => {
  req.body.action = 'ACCEPT';
  FarmerNegotiationsController.respondToNegotiation(req, res);
});

