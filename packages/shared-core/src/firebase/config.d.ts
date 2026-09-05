/**
 * MandiKart — Unified Firebase Configuration & Client Wrapper
 * Supports Firebase Free Tier (Spark Plan):
 *  - Phone Auth (10,000 free SMS/mo + unlimited test numbers)
 *  - Google OAuth / Gmail Sign-In
 *  - Firebase Cloud Messaging (FCM - unlimited free push notifications)
 *  - Realtime Database / Firestore for high-frequency live GPS driver tracking
 *  - Firebase Analytics & Crashlytics
 */
export interface FirebaseConfigOptions {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseURL?: string;
}
export declare function getFirebaseConfig(): FirebaseConfigOptions;
export declare function isFirebaseConfigured(): boolean;
