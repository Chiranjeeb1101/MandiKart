import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { generalRateLimit } from '../middleware/rateLimit.middleware.js';
import { LogisticNotificationsController } from '../controllers/notifications.controller.js';

export const notificationsRouter = Router();

notificationsRouter.get('/',             generalRateLimit, requireAuth, LogisticNotificationsController.getNotifications);
notificationsRouter.patch('/:id/read',   generalRateLimit, requireAuth, LogisticNotificationsController.markAsRead);
notificationsRouter.post('/send-push',   generalRateLimit, requireAuth, LogisticNotificationsController.sendPush);

