/**
 * MandiKart — Orders Routes (Explicit action-based endpoints)
 */

import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { OrdersController } from '../controllers/orders.controller.js';

export const ordersRouter = Router();

ordersRouter.get('/', requireAuth, OrdersController.listOrders);
ordersRouter.post('/:id/accept', requireAuth, requireIdempotency, OrdersController.acceptOrder);
ordersRouter.post('/:id/reject', requireAuth, requireIdempotency, OrdersController.rejectOrder);
ordersRouter.post('/:id/ready-for-pickup', requireAuth, requireIdempotency, OrdersController.readyForPickup);
ordersRouter.post('/:id/verify-pickup', requireAuth, requireIdempotency, OrdersController.verifyPickup);
ordersRouter.post('/:id/negotiate', requireAuth, requireIdempotency, OrdersController.negotiate);
