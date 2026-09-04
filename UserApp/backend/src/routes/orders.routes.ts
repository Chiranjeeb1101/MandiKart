import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { BuyerOrdersController } from '../controllers/orders.controller.js';

export const ordersRouter = Router();

ordersRouter.post('/', requireAuth, requireIdempotency, BuyerOrdersController.placeOrder);
ordersRouter.get('/', requireAuth, BuyerOrdersController.listOrders);
ordersRouter.get('/:id', requireAuth, BuyerOrdersController.getOrderById);
ordersRouter.post('/:id/confirm-delivery', requireAuth, requireIdempotency, BuyerOrdersController.confirmDelivery);
ordersRouter.post('/:id/dispute', requireAuth, requireIdempotency, BuyerOrdersController.raiseDispute);
