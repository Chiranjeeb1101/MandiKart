import { Vibration, Platform } from 'react-native';

export interface MobileNotificationPayload {
  title: string;
  body: string;
  code?: string;
  phone?: string;
}

type NotificationListener = (payload: MobileNotificationPayload) => void;
const listeners: NotificationListener[] = [];

export function subscribeToLocalNotifications(listener: NotificationListener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

/**
 * Dispatches an immediate mobile notification banner with native phone vibration.
 * Safe for Expo Go and all platforms without native push build requirements.
 */
export async function sendLocalOtpNotification(code: string, phone: string): Promise<void> {
  try {
    // Vibrate device like an incoming SMS
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 250, 150, 250]);
    } else if (Platform.OS === 'ios') {
      Vibration.vibrate();
    }

    const payload: MobileNotificationPayload = {
      title: 'MandiKart Security Code 📱',
      body: `Your MandiKart verification OTP is ${code}. Valid for 5 minutes. Do not share with anyone.`,
      code,
      phone,
    };

    // Notify active UI listeners (e.g. top banner)
    listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch {}
    });
  } catch (err) {
    console.log('[sendLocalOtpNotification] Note:', err);
  }
}
