import { Request, Response } from 'express';
import { getSupabaseAdmin } from '@mandikart/shared-core';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const isMockEnv = () =>
  !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

// ─── Expo Push Notification Helper ───────────────────────────────────────────
/**
 * Sends a push notification via Expo's push API.
 * @param pushToken  The driver's Expo push token (stored in profiles table)
 * @param title      Notification title
 * @param body       Notification body
 * @param data       Optional extra data payload
 */
const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data: Record<string, any> = {}
): Promise<void> => {
  if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
    console.warn('[Push] Invalid or missing Expo push token — skipping push notification.');
    return;
  }

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        channelId: 'mandikart-logistics',
      }),
    });

    const result = await res.json() as any;
    if (result?.data?.status === 'error') {
      console.error('[Push] Expo returned error:', result.data.message);
    } else {
      console.log(`[Push] Notification sent: "${title}"`);
    }
  } catch (err) {
    console.error('[Push] Failed to send notification:', (err as Error).message);
  }
};

// ─── Controller ───────────────────────────────────────────────────────────────
export class LogisticNotificationsController {
  // ─── GET /notifications ──────────────────────────────────────────────────
  static async getNotifications(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';

    if (isMockEnv()) {
      res.status(200).json({
        data: [
          {
            id: 'notif_001',
            type: 'NEW_ORDER',
            title: 'New Pickup Assigned',
            message: 'You have been assigned a new pickup from Palsan Village, Nashik.',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif_002',
            type: 'SYSTEM_ALERT',
            title: 'Route Update',
            message: 'Heavy traffic reported on Mumbai-Pune Expressway. Consider alternate route.',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'notif_003',
            type: 'EARNINGS',
            title: 'Payout Processed',
            message: '₹5,400 has been transferred to your registered bank account.',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ],
        meta: { total: 3, unread: 1 },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', driverId)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          data: null, meta: null,
          error: { code: 'NOTIFICATIONS_ERROR', message: error.message },
        });
        return;
      }

      const unreadCount = (data || []).filter((n: any) => !n.is_read).length;
      res.status(200).json({
        data,
        meta: { total: data.length, unread: unreadCount },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null, meta: null,
        error: { code: 'NOTIFICATIONS_ERROR', message: (err as Error).message },
      });
    }
  }

  // ─── PATCH /notifications/:id/read ──────────────────────────────────────
  static async markAsRead(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';
    const notificationId = req.params.id;

    if (isMockEnv()) {
      res.status(200).json({
        data: {
          id: notificationId === 'all' ? null : notificationId,
          isRead: true,
          affected: notificationId === 'all' ? 'all' : 1,
        },
        meta: null,
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();

      // Single query handles both "mark one" and "mark all" cases
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', driverId);

      if (notificationId !== 'all') {
        query = query.eq('id', notificationId);
      }

      const { data, error } = await query.select();

      if (error) {
        res.status(500).json({
          data: null, meta: null,
          error: { code: 'NOTIFICATIONS_UPDATE_ERROR', message: error.message },
        });
        return;
      }

      res.status(200).json({ data, meta: { affected: data.length }, error: null });
    } catch (err) {
      res.status(500).json({
        data: null, meta: null,
        error: { code: 'NOTIFICATIONS_UPDATE_ERROR', message: (err as Error).message },
      });
    }
  }

  // ─── POST /notifications/send-push (internal use by other services) ──────
  static async sendPush(req: Request, res: Response): Promise<void> {
    const { pushToken, title, body, data } = req.body;

    if (!title || !body) {
      res.status(400).json({
        data: null, meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'title and body are required' },
      });
      return;
    }

    await sendPushNotification(pushToken, title, body, data || {});

    res.status(200).json({
      data: { sent: true },
      meta: null,
      error: null,
    });
  }
}

// ─── Re-export helper for use by other controllers ────────────────────────────
export { sendPushNotification };

