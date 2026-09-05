/**
 * MandiKart Farmer App — Firebase Client SDK Configuration & Initialization
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
  browserLocalPersistence,
  // @ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyC4iATiCmjUbOFcSOmGcmd1JPRrryq7ZZ0',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mandikart-abe46.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'mandikart-abe46',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mandikart-abe46.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '329155349072',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    '1:329155349072:web:bb7323ed1498523b2e9f55',
};

// Singleton App Instance
export const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Singleton Auth with AsyncStorage persistence on Native, browserLocalPersistence on Web
let firebaseAuthInstance: Auth;
try {
  if (Platform.OS === 'web') {
    firebaseAuthInstance = getAuth(firebaseApp);
  } else {
    firebaseAuthInstance = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch {
  firebaseAuthInstance = getAuth(firebaseApp);
}

export const firebaseAuth = firebaseAuthInstance;
