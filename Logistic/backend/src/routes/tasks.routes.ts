import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { LogisticTasksController } from '../controllers/tasks.controller.js';

export const tasksRouter = Router();

tasksRouter.get('/available', requireAuth, LogisticTasksController.getAvailableTasks);
tasksRouter.post('/:orderId/start-pickup', requireAuth, requireIdempotency, LogisticTasksController.startPickup);
tasksRouter.post('/:orderId/verify-pickup', requireAuth, requireIdempotency, LogisticTasksController.verifyPickup);
tasksRouter.post('/:orderId/start-transit', requireAuth, requireIdempotency, LogisticTasksController.startTransit);
tasksRouter.post('/:orderId/complete-delivery', requireAuth, requireIdempotency, LogisticTasksController.completeDelivery);
