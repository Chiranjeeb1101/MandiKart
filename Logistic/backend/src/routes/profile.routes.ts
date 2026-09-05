import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { generalRateLimit } from '../middleware/rateLimit.middleware.js';
import { LogisticProfileController } from '../controllers/profile.controller.js';

export const profileRouter = Router();

profileRouter.get('/',  generalRateLimit, requireAuth, LogisticProfileController.getProfile);
profileRouter.put('/',  generalRateLimit, requireAuth, LogisticProfileController.updateProfile);

