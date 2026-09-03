import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { BuyerNegotiationsController } from '../controllers/negotiations.controller.js';

export const negotiationsRouter = Router();

negotiationsRouter.post('/', requireAuth, requireIdempotency, BuyerNegotiationsController.submitOffer);
