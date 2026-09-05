import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { generalRateLimit } from '../middleware/rateLimit.middleware.js';
import { LogisticEarningsController } from '../controllers/earnings.controller.js';

export const earningsRouter = Router();

earningsRouter.get('/summary', generalRateLimit, requireAuth, LogisticEarningsController.getEarningsSummary);
earningsRouter.get('/payouts', generalRateLimit, requireAuth, LogisticEarningsController.getPayoutHistory);

