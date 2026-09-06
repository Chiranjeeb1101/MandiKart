import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { FarmerNegotiationsController } from '../controllers/negotiations.controller.js';

export const negotiationsRouter = Router();

negotiationsRouter.get('/', requireAuth, FarmerNegotiationsController.listNegotiations);
negotiationsRouter.get('/:id', requireAuth, FarmerNegotiationsController.getNegotiation);
negotiationsRouter.post('/:id/messages', requireAuth, FarmerNegotiationsController.sendMessage);
negotiationsRouter.post('/:id/respond', requireAuth, requireIdempotency, FarmerNegotiationsController.respondToNegotiation);
negotiationsRouter.post('/:id/accept', requireAuth, requireIdempotency, (req, res) => {
  req.body.action = 'ACCEPT';
  FarmerNegotiationsController.respondToNegotiation(req, res);
});
