import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { generalRateLimit, strictRateLimit } from '../middleware/rateLimit.middleware.js';
import { verifyPickupSchema, completeDeliverySchema, reportIssueSchema } from '../validators/tasks.validator.js';
import { LogisticTasksController } from '../controllers/tasks.controller.js';

export const tasksRouter = Router();

tasksRouter.get('/available',                  generalRateLimit, requireAuth, LogisticTasksController.getAvailableTasks);
tasksRouter.post('/:orderId/start-pickup',     generalRateLimit, requireAuth, LogisticTasksController.startPickup);
tasksRouter.post('/:orderId/verify-pickup',    generalRateLimit, requireAuth, validate(verifyPickupSchema), LogisticTasksController.verifyPickup);
tasksRouter.post('/:orderId/start-transit',    generalRateLimit, requireAuth, LogisticTasksController.startTransit);
tasksRouter.post('/:orderId/complete-delivery',generalRateLimit, requireAuth, validate(completeDeliverySchema), LogisticTasksController.completeDelivery);
tasksRouter.post('/:orderId/cancel',           strictRateLimit,  requireAuth, LogisticTasksController.cancelTask);
tasksRouter.post('/:orderId/report-issue',     strictRateLimit,  requireAuth, validate(reportIssueSchema), LogisticTasksController.reportIssue);
tasksRouter.post('/:orderId/transfer',         generalRateLimit, requireAuth, LogisticTasksController.transferTask);
tasksRouter.post('/create-order',              generalRateLimit, LogisticTasksController.createRealOrder);

