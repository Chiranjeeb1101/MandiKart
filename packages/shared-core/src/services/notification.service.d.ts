/**
 * MandiKart — Multi-Channel Notification Engine
 * Handles In-App notification feeds and Mobile Phone Push/Pop notifications (Expo / FCM).
 */
import { UserRole, NotificationItem, NotificationType, DevicePushTokenRecord } from '@mandikart/shared-types';
export declare class NotificationService {
    /**
     * Registers an Expo / FCM push notification token for a user's phone.
     */
    static registerDeviceToken(params: {
        userId: string;
        role: UserRole;
        token: string;
        deviceType?: 'android' | 'ios' | 'web';
    }): DevicePushTokenRecord;
    /**
     * Dispatches a notification:
     * 1. Saves to persistent in-app feed.
     * 2. Fires real-time mobile push/pop notification to the user's phone if a device token exists.
     */
    static sendNotification(params: {
        userId: string;
        role: UserRole;
        title: string;
        body: string;
        type: NotificationType;
        metadata?: Record<string, any>;
        sendPush?: boolean;
    }): Promise<{
        inApp: NotificationItem;
        pushSent: boolean;
        pushResponse?: any;
    }>;
    /**
     * Retrieves in-app notification feed and unread count for a user.
     */
    static listNotifications(params: {
        userId: string;
        limit?: number;
        offset?: number;
    }): {
        items: NotificationItem[];
        unreadCount: number;
        total: number;
    };
    /**
     * Marks a single notification as read.
     */
    static markAsRead(notificationId: string, userId: string): boolean;
    /**
     * Marks all notifications as read for a user.
     */
    static markAllAsRead(userId: string): number;
    /**
     * Dispatches push payload to phone via Firebase Cloud Messaging (FCM) or Expo Push API.
     */
    private static dispatchPhonePushNotification;
}
