"use strict";
/**
 * MandiKart — Firebase Admin SDK Initialization & Client Factory
 * Powers server-side operations:
 *  - Firebase Cloud Messaging (FCM v1) mobile device push notifications
 *  - Server-side Firebase ID token verification
 *  - High-privilege Firestore / RTDB operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseAdmin = getFirebaseAdmin;
exports.getFirebaseMessaging = getFirebaseMessaging;
exports.getFirebaseAuth = getFirebaseAuth;
exports.isFirebaseAdminInitialized = isFirebaseAdminInitialized;
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const auth_1 = require("firebase-admin/auth");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let adminApp = null;
function findServiceAccountPath() {
    const customPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const candidatePaths = [];
    if (customPath) {
        candidatePaths.push(path_1.default.resolve(process.cwd(), customPath));
        candidatePaths.push(path_1.default.resolve(__dirname, '../../../../', customPath));
        candidatePaths.push(path_1.default.resolve(__dirname, '../../../', customPath));
    }
    // Common relative root paths
    candidatePaths.push(path_1.default.resolve(process.cwd(), 'serviceAccountKey.json'), path_1.default.resolve(process.cwd(), '../serviceAccountKey.json'), path_1.default.resolve(process.cwd(), '../../serviceAccountKey.json'), path_1.default.resolve(__dirname, '../../../../serviceAccountKey.json'), path_1.default.resolve(__dirname, '../../../serviceAccountKey.json'));
    for (const p of candidatePaths) {
        if (fs_1.default.existsSync(p)) {
            return p;
        }
    }
    return null;
}
function getFirebaseAdmin() {
    if (adminApp) {
        return adminApp;
    }
    const existingApps = (0, app_1.getApps)();
    if (existingApps.length > 0) {
        adminApp = existingApps[0];
        return adminApp;
    }
    const keyPath = findServiceAccountPath();
    if (keyPath) {
        try {
            const raw = fs_1.default.readFileSync(keyPath, 'utf8');
            const serviceAccount = JSON.parse(raw);
            adminApp = (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(serviceAccount),
                projectId: serviceAccount.project_id || 'mandikart-d95d3',
            });
            console.log(`🔥 [FIREBASE-ADMIN] Initialized with Service Account: ${serviceAccount.client_email}`);
            return adminApp;
        }
        catch (err) {
            console.warn(`⚠️ [FIREBASE-ADMIN] Failed to initialize service account from ${keyPath}:`, err.message);
        }
    }
    return null;
}
function getFirebaseMessaging() {
    const app = getFirebaseAdmin();
    if (app) {
        return (0, messaging_1.getMessaging)(app);
    }
    return null;
}
function getFirebaseAuth() {
    const app = getFirebaseAdmin();
    if (app) {
        return (0, auth_1.getAuth)(app);
    }
    return null;
}
function isFirebaseAdminInitialized() {
    return (0, app_1.getApps)().length > 0;
}
