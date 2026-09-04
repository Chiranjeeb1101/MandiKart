/**
 * MandiKart — Multi-Channel Notification Engine
 * Handles In-App notification feeds and Mobile Phone Push/Pop notifications (Expo / FCM).
 */

import { UserRole, NotificationItem, NotificationType, DevicePushTokenRecord } from '@mandikart/shared-types';
import { getFirebaseMessaging } from '../firebase/admin.js';

// In-memory notification feeds (userId -> NotificationItem[])
const inAppNotifications = new Map<string, NotificationItem[]>();

// Registered device push tokens (userId -> DevicePushTokenRecord)
const devicePushTokens = new Map<string, DevicePushTokenRecord>();

export class NotificationService {
  /**
   * Registers an Expo / FCM push notification token for a user's phone.
   */
  static registerDeviceToken(params: {
    userId: string;
    role: UserRole;
    token: string;
    deviceType?: 'android' | 'ios' | 'web';
  }): DevicePushTokenRecord {
    const record: DevicePushTokenRecord = {
      id: `dev_${Date.now()}_${params.userId.slice(-4)}`,
      userId: params.userId,
      role: params.role,
      token: params.token,
      deviceType: params.deviceType || 'android',
      lastSeenAt: new Date().toISOString(),
    };

    devicePushTokens.set(params.userId, record);
    console.log(`📱 [DEVICE-TOKEN] Registered ${record.deviceType} push token for ${params.role} (${params.userId})`);
    return record;
  }

  /**
   * Dispatches a notification:
   * 1. Saves to persistent in-app feed.
   * 2. Fires real-time mobile push/pop notification to the user's phone if a device token exists.
   */
  static async sendNotification(params: {
    userId: string;
    role: UserRole;
    title: string;
    body: string;
    type: NotificationType;
    metadata?: Record<string, any>;
    sendPush?: boolean;
  }): Promise<{ inApp: NotificationItem; pushSent: boolean; pushResponse?: any }> {
    const now = new Date().toISOString();
    const notification: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: params.userId,
      role: params.role,
      title: params.title,
      body: params.body,
      type: params.type,
      metadata: params.metadata,
      isRead: false,
      createdAt: now,
    };

    // 1. In-App feed insertion
    const userFeed = inAppNotifications.get(params.userId) || [];
    userFeed.unshift(notification);
    inAppNotifications.set(params.userId, userFeed);

    console.log(`🔔 [IN-APP-NOTIF] [${params.type}] To ${params.role} (${params.userId}): "${params.title}" - ${params.body}`);

    // 2. Mobile Phone Push/Pop Notification
    let pushSent = false;
    let pushResponse: any = null;

    if (params.sendPush !== false) {
      const device = devicePushTokens.get(params.userId);
      if (device && device.token) {
        try {
          pushResponse = await this.dispatchPhonePushNotification({
            pushToken: device.token,
            title: params.title,
            body: params.body,
            data: {
              type: params.type,
              notificationId: notification.id,
              ...params.metadata,
            },
          });
          pushSent = true;
          console.log(`🚀 [PUSH-POPUP-SENT] Mobile push pop sent to ${device.deviceType} phone (Token: ${device.token.slice(0, 15)}...)`);
        } catch (err) {
          console.warn(`⚠️ [PUSH-ERROR] Failed to send push popup:`, (err as Error).message);
        }
      }
    }

    return { inApp: notification, pushSent, pushResponse };
  }

  /**
   * Retrieves in-app notification feed and unread count for a user.
   */
  static listNotifications(params: {
    userId: string;
    limit?: number;
    offset?: number;
  }): { items: NotificationItem[]; unreadCount: number; total: number } {
    const feed = inAppNotifications.get(params.userId) || [];
    const limit = params.limit || 20;
    const offset = params.offset || 0;

    const unreadCount = feed.filter((n) => !n.isRead).length;
    const items = feed.slice(offset, offset + limit);

    return {
      items,
      unreadCount,
      total: feed.length,
    };
  }

  /**
   * Marks a single notification as read.
   */
  static markAsRead(notificationId: string, userId: string): boolean {
    const feed = inAppNotifications.get(userId) || [];
    const item = feed.find((n) => n.id === notificationId);
    if (item) {
      item.isRead = true;
      return true;
    }
    return false;
  }

  /**
   * Marks all notifications as read for a user.
   */
  static markAllAsRead(userId: string): number {
    const feed = inAppNotifications.get(userId) || [];
    let count = 0;
    for (const item of feed) {
      if (!item.isRead) {
        item.isRead = true;
        count++;
      }
    }
    return count;
  }

  /**
   * Dispatches push payload to phone via Firebase Cloud Messaging (FCM) or Expo Push API.
   */
  private static async dispatchPhonePushNotification(payload: {
    pushToken: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }): Promise<any> {
    // 1. If Firebase Admin SDK is initialized and token is a native FCM device registration token
    const messaging = getFirebaseMessaging();
    if (messaging && !payload.pushToken.startsWith('ExponentPushToken[')) {
      try {
        const stringifiedData: Record<string, string> = {};
        if (payload.data) {
          for (const [k, v] of Object.entries(payload.data)) {
            stringifiedData[k] = String(v);
          }
        }

        const messageId = await messaging.send({
          token: payload.pushToken,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: stringifiedData,
          android: {
            priority: 'high',
            notification: {
              channelId: 'mandikart_orders',
              sound: 'default',
            },
          },
        });

        return { status: 'fcm_sent', messageId };
      } catch (err: any) {
        console.warn(`[NotificationService] FCM direct send failed, checking fallbacks:`, err.message);
      }
    }

    // 2. Expo Push Notification Service (for Expo managed mobile apps)
    if (payload.pushToken.startsWith('ExponentPushToken[')) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: payload.pushToken,
          sound: 'default',
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          priority: 'high',
          channelId: 'mandikart_orders',
        }),
      });

      return await response.json();
    }

    return { status: 'mock_sent', recipient: payload.pushToken };
  }
}
