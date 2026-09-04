/**
 * MandiKart — Firebase Admin SDK Initialization & Client Factory
 * Powers server-side operations:
 *  - Firebase Cloud Messaging (FCM v1) mobile device push notifications
 *  - Server-side Firebase ID token verification
 *  - High-privilege Firestore / RTDB operations
 */

import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { getAuth, Auth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let adminApp: App | null = null;

function findServiceAccountPath(): string | null {
  const customPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const candidatePaths: string[] = [];

  if (customPath) {
    candidatePaths.push(path.resolve(process.cwd(), customPath));
    candidatePaths.push(path.resolve(__dirname, '../../../../', customPath));
    candidatePaths.push(path.resolve(__dirname, '../../../', customPath));
  }

  // Common relative root paths
  candidatePaths.push(
    path.resolve(process.cwd(), 'serviceAccountKey.json'),
    path.resolve(process.cwd(), '../serviceAccountKey.json'),
    path.resolve(process.cwd(), '../../serviceAccountKey.json'),
    path.resolve(__dirname, '../../../../serviceAccountKey.json'),
    path.resolve(__dirname, '../../../serviceAccountKey.json')
  );

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

export function getFirebaseAdmin(): App | null {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0]!;
    return adminApp;
  }

  const keyPath = findServiceAccountPath();
  if (keyPath) {
    try {
      const raw = fs.readFileSync(keyPath, 'utf8');
      const serviceAccount = JSON.parse(raw);

      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'mandikart-d95d3',
      });

      console.log(`🔥 [FIREBASE-ADMIN] Initialized with Service Account: ${serviceAccount.client_email}`);
      return adminApp;
    } catch (err: any) {
      console.warn(`⚠️ [FIREBASE-ADMIN] Failed to initialize service account from ${keyPath}:`, err.message);
    }
  }

  return null;
}

export function getFirebaseMessaging(): Messaging | null {
  const app = getFirebaseAdmin();
  if (app) {
    return getMessaging(app);
  }
  return null;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseAdmin();
  if (app) {
    return getAuth(app);
  }
  return null;
}

export function isFirebaseAdminInitialized(): boolean {
  return getApps().length > 0;
}
