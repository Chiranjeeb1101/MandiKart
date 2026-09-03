import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { BuyerNegotiationsController } from '../controllers/negotiations.controller.js';

export const negotiationsRouter = Router();

negotiationsRouter.get('/', requireAuth, BuyerNegotiationsController.listNegotiations);
negotiationsRouter.post('/', requireAuth, requireIdempotency, BuyerNegotiationsController.submitOffer);
negotiationsRouter.post('/offer', requireAuth, requireIdempotency, BuyerNegotiationsController.submitOffer);
negotiationsRouter.post('/:id/respond', requireAuth, requireIdempotency, BuyerNegotiationsController.respondToCounterOffer);
negotiationsRouter.post('/:id/convert-to-order', requireAuth, requireIdempotency, BuyerNegotiationsController.convertToOrder);
