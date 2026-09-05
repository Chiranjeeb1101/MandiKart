"use strict";
/**
 * MandiKart — Unified Firebase Configuration & Client Wrapper
 * Supports Firebase Free Tier (Spark Plan):
 *  - Phone Auth (10,000 free SMS/mo + unlimited test numbers)
 *  - Google OAuth / Gmail Sign-In
 *  - Firebase Cloud Messaging (FCM - unlimited free push notifications)
 *  - Realtime Database / Firestore for high-frequency live GPS driver tracking
 *  - Firebase Analytics & Crashlytics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseConfig = getFirebaseConfig;
exports.isFirebaseConfigured = isFirebaseConfigured;
function getFirebaseConfig() {
    return {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyDemoMandiKartKey1234567890',
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || 'mandikart-app.firebaseapp.com',
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'mandikart-app',
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || 'mandikart-app.appspot.com',
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '1029384756',
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '1:1029384756:web:abcdef12345678',
        databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || 'https://mandikart-app-default-rtdb.firebaseio.com',
    };
}
function isFirebaseConfigured() {
    const config = getFirebaseConfig();
    return !config.apiKey.includes('DemoMandiKartKey');
}
