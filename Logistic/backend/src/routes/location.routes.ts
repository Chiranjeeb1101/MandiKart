import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { locationRateLimit, generalRateLimit } from '../middleware/rateLimit.middleware.js';
import { updateLocationSchema } from '../validators/location.validator.js';
import { LogisticLocationController } from '../controllers/location.controller.js';

export const locationRouter = Router();

locationRouter.post('/update',       locationRateLimit, requireAuth, validate(updateLocationSchema), LogisticLocationController.updateLocation);
locationRouter.get('/:driverId',     generalRateLimit,  requireAuth, LogisticLocationController.getLocation);

