import { Router, Request, Response } from 'express';
import { requireAuth, requireIdempotency, NotificationService } from '@mandikart/shared-core';
import { DeviceTokenSchema, UserRole } from '@mandikart/shared-types';

export const notificationRouter = Router();

// Flexible auth helper to allow guest / demo preview and mock tokens without 401 blocker
const flexibleAuth = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'farmer_ramesh_01', role: UserRole.FARMER, phone: '9876543210' } as any;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (token === 'mock_farmer_token_01' || token === 'guest' || !token) {
    req.user = { id: 'farmer_ramesh_01', role: UserRole.FARMER, phone: '9876543210' } as any;
    return next();
  }
  return requireAuth(req, res, next);
};

// 1. List In-App notifications with unread counter
notificationRouter.get('/', flexibleAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const offset = Math.max(0, Number(req.query.offset || 0));

  const result = NotificationService.listNotifications({ userId, limit, offset });

  res.status(200).json({
    data: result.items,
    meta: {
      unreadCount: result.unreadCount,
      total: result.total,
      limit,
      offset,
    },
    error: null,
  });
});

// 2. Mark single notification as read
notificationRouter.patch('/:id/read', flexibleAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const notificationId = String(req.params.id);

  const success = NotificationService.markAsRead(notificationId, userId);
  res.status(200).json({
    data: { id: notificationId, isRead: true, success },
    meta: null,
    error: null,
  });
});

// 3. Mark all notifications as read
notificationRouter.patch('/read-all', flexibleAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const count = NotificationService.markAllAsRead(userId);

  res.status(200).json({
    data: { markedReadCount: count, message: 'All notifications marked as read' },
    meta: null,
    error: null,
  });
});

// 4. Register mobile phone push token for native push popup notifications
notificationRouter.post('/device-token', flexibleAuth, requireIdempotency, (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const role = req.user?.role || UserRole.FARMER;

  const parse = DeviceTokenSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({
      data: null,
      meta: null,
      error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid push token' },
    });
    return;
  }

  const record = NotificationService.registerDeviceToken({
    userId,
    role,
    token: parse.data.token,
    deviceType: parse.data.deviceType,
  });

  res.status(200).json({
    data: {
      ...record,
      message: 'Mobile push token registered. Pop-up notifications enabled for this phone.',
    },
    meta: null,
    error: null,
  });
});

// 5. Test push notification trigger
notificationRouter.post('/test-push', flexibleAuth, async (req: Request, res: Response) => {
  const userId = req.user?.id || 'farmer_ramesh_01';
  const role = req.user?.role || UserRole.FARMER;
  const { title, body } = req.body;

  const result = await NotificationService.sendNotification({
    userId,
    role,
    title: title || 'New Order Received! 🌾',
    body: body || 'Buyer Amit Grocery Mart placed an order for 500kg Red Onion.',
    type: 'ORDER_UPDATE',
    metadata: { orderId: 'ord_101', amount: 13250 },
    sendPush: true,
  });

  res.status(201).json({
    data: {
      notification: result.inApp,
      pushSent: result.pushSent,
      message: 'In-app notification created and phone push popup dispatched.',
    },
    meta: null,
    error: null,
  });
});
