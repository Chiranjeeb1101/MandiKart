import { Router, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../middlewares/errorHandler.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { assertValidTransition, getNextAllowedStatuses } from '../services/orderStateMachine.js';
import { Order, OrderStatus } from '../types/index.js';

export const ordersRouter = Router();

// In-memory demo orders store
let demoOrders: Order[] = [
  {
    id: 'ORD-2026-0891',
    buyerId: 'buyer-001',
    farmerId: 'farmer-demo-001',
    productId: 'prod-001',
    cropName: 'Nashik Red Onion',
    quantityKg: 1500,
    pricePerKg: 24,
    totalGrossAmount: 36000,
    transportDeduction: 1500,
    mandiFeeDeduction: 540,
    netPayableAmount: 33960,
    status: 'PICKUP_SCHEDULED',
    pickupToken: 'MK-PK-7821',
    pickupScheduledDate: '2026-09-04T10:00:00Z',
    deliveryAddress: 'APMC Yard, Vashi, Navi Mumbai',
    isBulk: false,
    createdAt: '2026-09-01T08:30:00Z',
    updatedAt: '2026-09-01T11:00:00Z',
  },
  {
    id: 'ORD-2026-0842',
    buyerId: 'buyer-002',
    farmerId: 'farmer-demo-001',
    productId: 'prod-002',
    cropName: 'Hybrid Tomato',
    quantityKg: 500,
    pricePerKg: 32,
    totalGrossAmount: 16000,
    transportDeduction: 800,
    mandiFeeDeduction: 240,
    netPayableAmount: 14960,
    status: 'COMPLETED',
    pickupToken: 'MK-PK-4119',
    deliveryAddress: 'Blinkit Hub, Pune',
    isBulk: false,
    createdAt: '2026-08-28T09:15:00Z',
    updatedAt: '2026-08-30T16:45:00Z',
  },
];

/**
 * GET /api/v1/orders - Get orders for the logged-in farmer
 */
ordersRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const farmerOrders = demoOrders.filter(
    (o) => o.farmerId === (req.user?.id || 'farmer-demo-001')
  );

  const filtered = status
    ? farmerOrders.filter((o) => o.status.toLowerCase() === status.toLowerCase())
    : farmerOrders;

  return sendSuccess(res, filtered, {
    total: filtered.length,
  });
});

/**
 * GET /api/v1/orders/:id - Get specific order details
 */
ordersRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const order = demoOrders.find((o) => o.id === id);

  if (!order) {
    return sendError(res, 'Order not found', 404, 'NOT_FOUND');
  }

  return sendSuccess(res, {
    order,
    nextAllowedStatuses: getNextAllowedStatuses(order.status),
  });
});

const transitionSchema = z.object({
  nextStatus: z.custom<OrderStatus>(),
  note: z.string().optional(),
});

/**
 * POST /api/v1/orders/:id/transition - Safe state machine transition
 */
ordersRouter.post('/:id/transition', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const parse = transitionSchema.safeParse(req.body);

  if (!parse.success) {
    return sendError(res, 'Valid nextStatus is required', 400, 'VALIDATION_ERROR');
  }

  const orderIndex = demoOrders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return sendError(res, 'Order not found', 404, 'NOT_FOUND');
  }

  const order = demoOrders[orderIndex];

  try {
    assertValidTransition(order.status, parse.data.nextStatus);

    order.status = parse.data.nextStatus;
    order.updatedAt = new Date().toISOString();
    demoOrders[orderIndex] = order;

    return sendSuccess(res, {
      order,
      message: `Order status updated to ${order.status}`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return sendError(res, error.message, 400, 'INVALID_TRANSITION');
  }
});
