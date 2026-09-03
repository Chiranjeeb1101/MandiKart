import { Router, Request, Response } from 'express';
import { requireAuth, requireIdempotency, NotificationService } from '@mandikart/shared-core';
import { DeviceTokenSchema, UserRole } from '@mandikart/shared-types';

export const notificationRouter = Router();

notificationRouter.get('/', requireAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
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

notificationRouter.patch('/:id/read', requireAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
  const notificationId = String(req.params.id);

  const success = NotificationService.markAsRead(notificationId, userId);
  res.status(200).json({
    data: { id: notificationId, isRead: true, success },
    meta: null,
    error: null,
  });
});

notificationRouter.patch('/read-all', requireAuth, (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
  const count = NotificationService.markAllAsRead(userId);

  res.status(200).json({
    data: { markedReadCount: count, message: 'All notifications marked as read' },
    meta: null,
    error: null,
  });
});

notificationRouter.post('/device-token', requireAuth, requireIdempotency, (req: Request, res: Response) => {
  const userId = req.user?.id || 'buyer_default_01';
  const role = req.user?.role || UserRole.BUYER;

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
      message: 'Mobile push token registered. Pop-up notifications enabled for buyer.',
    },
    meta: null,
    error: null,
  });
});
