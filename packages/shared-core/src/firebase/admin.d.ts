/**
 * MandiKart — Firebase Admin SDK Initialization & Client Factory
 * Powers server-side operations:
 *  - Firebase Cloud Messaging (FCM v1) mobile device push notifications
 *  - Server-side Firebase ID token verification
 *  - High-privilege Firestore / RTDB operations
 */
import { App } from 'firebase-admin/app';
import { Messaging } from 'firebase-admin/messaging';
import { Auth } from 'firebase-admin/auth';
export declare function getFirebaseAdmin(): App | null;
export declare function getFirebaseMessaging(): Messaging | null;
export declare function getFirebaseAuth(): Auth | null;
export declare function isFirebaseAdminInitialized(): boolean;
