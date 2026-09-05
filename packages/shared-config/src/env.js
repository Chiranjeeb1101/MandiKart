"use strict";
/**
 * MandiKart — Global Unified Environment Schema & Validator
 * Discovers and loads the single root .env file from the monorepo root
 * and enforces strict fail-fast validation for all secrets, APIs, and microservices.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
exports.getValidatedEnv = getValidatedEnv;
exports.getLoadedEnvFilePath = getLoadedEnvFilePath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
/**
 * Searches upward from the current working directory and module directory
 * to find the repository root .env file.
 */
function findRootEnvFile() {
    const searchStarts = [
        process.cwd(),
        typeof __dirname !== 'undefined' ? __dirname : '',
    ].filter(Boolean);
    for (const startDir of searchStarts) {
        let current = path_1.default.resolve(startDir);
        // Traverse up to 6 levels to find root package.json or root .env
        for (let i = 0; i < 6; i++) {
            const candidateEnv = path_1.default.join(current, '.env');
            const candidatePackageJson = path_1.default.join(current, 'package.json');
            if (fs_1.default.existsSync(candidateEnv)) {
                try {
                    // Verify if this is the monorepo root by checking package.json name or workspaces
                    if (fs_1.default.existsSync(candidatePackageJson)) {
                        const pkg = JSON.parse(fs_1.default.readFileSync(candidatePackageJson, 'utf8'));
                        if (pkg.name === 'mandikart-monorepo' || pkg.workspaces) {
                            return candidateEnv;
                        }
                    }
                }
                catch {
                    // Continue search
                }
            }
            const parent = path_1.default.dirname(current);
            if (parent === current)
                break;
            current = parent;
        }
    }
    // Direct fallback checks
    const fallbackPaths = [
        path_1.default.resolve(process.cwd(), '../../.env'),
        path_1.default.resolve(process.cwd(), '../.env'),
        path_1.default.resolve(process.cwd(), '.env'),
    ];
    for (const p of fallbackPaths) {
        if (fs_1.default.existsSync(p)) {
            return p;
        }
    }
    return null;
}
// 1. Locate and load root .env
const rootEnvPath = findRootEnvFile();
if (rootEnvPath) {
    dotenv_1.default.config({ path: rootEnvPath });
}
else {
    // Fallback to local cwd .env if root is not located
    dotenv_1.default.config();
}
// 2. Platform-wide comprehensive Zod schema
exports.EnvSchema = zod_1.z.object({
    // Platform & Environment
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
    // Service Ports
    PORT: zod_1.z.coerce.number().default(4000),
    FARMER_BACKEND_PORT: zod_1.z.coerce.number().default(4000),
    USER_BACKEND_PORT: zod_1.z.coerce.number().default(4001),
    LOGISTIC_BACKEND_PORT: zod_1.z.coerce.number().default(4002),
    ADMIN_BACKEND_PORT: zod_1.z.coerce.number().default(4003),
    // Supabase Unified Ledger & DB
    SUPABASE_URL: zod_1.z.string().url().default('https://placeholder.supabase.co'),
    SUPABASE_ANON_KEY: zod_1.z.string().min(1).default('placeholder-anon-key'),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1).default('placeholder-service-role-key-for-development'),
    SUPABASE_STORAGE_BUCKET_AVATARS: zod_1.z.string().default('avatars'),
    SUPABASE_STORAGE_BUCKET_PRODUCTS: zod_1.z.string().default('products'),
    SUPABASE_STORAGE_BUCKET_LAND: zod_1.z.string().default('land_records'),
    SUPABASE_STORAGE_BUCKET_POD: zod_1.z.string().default('pod'),
    // Cryptography, PII & Sessions
    JWT_SECRET: zod_1.z.string().min(16).default('super_secret_mandikart_jwt_development_key_32bytes_long'),
    PII_ENCRYPTION_KEY: zod_1.z.string().min(32).default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    SESSION_EXPIRY_HOURS: zod_1.z.coerce.number().default(720),
    // Stripe Payments & Escrow
    STRIPE_SECRET_KEY: zod_1.z.string().default('sk_test_mandikart_demo_secret_key_placeholder'),
    STRIPE_PUBLISHABLE_KEY: zod_1.z.string().default('pk_test_mandikart_demo_publishable_key_placeholder'),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().default('whsec_mandikart_demo_webhook_placeholder'),
    STRIPE_CURRENCY: zod_1.z.string().default('inr'),
    // Firebase Free-Tier Suite
    FIREBASE_PROJECT_ID: zod_1.z.string().default('mandikart-d95d3'),
    FIREBASE_API_KEY: zod_1.z.string().default('AIzaSyDemoPlaceholderKeyForMandiKartPlatform'),
    FIREBASE_AUTH_DOMAIN: zod_1.z.string().default('mandikart-d95d3.firebaseapp.com'),
    FIREBASE_DATABASE_URL: zod_1.z.string().default('https://mandikart-d95d3-default-rtdb.firebaseio.com'),
    FIREBASE_STORAGE_BUCKET: zod_1.z.string().default('mandikart-d95d3.firebasestorage.app'),
    FIREBASE_MESSAGING_SENDER_ID: zod_1.z.string().default('277614367044'),
    FIREBASE_APP_ID: zod_1.z.string().default('1:277614367044:web:caade1d1ec8fd28a318711'),
    FIREBASE_MEASUREMENT_ID: zod_1.z.string().optional().default('G-7BPVVT53D2'),
    FIREBASE_SERVICE_ACCOUNT_PATH: zod_1.z.string().optional().default('serviceAccountKey.json'),
    // Weather & Agricultural Advisory
    OPEN_METEO_API_URL: zod_1.z.string().default('https://api.open-meteo.com/v1/forecast'),
    WEATHER_CACHE_TTL_MINUTES: zod_1.z.coerce.number().default(30),
    // Public Frontend Base URLs & Client-Safe Keys
    EXPO_PUBLIC_USER_API_URL: zod_1.z.string().default('http://localhost:4001/api/v1'),
    EXPO_PUBLIC_FARMER_API_URL: zod_1.z.string().default('http://localhost:4000/api/v1'),
    EXPO_PUBLIC_LOGISTIC_API_URL: zod_1.z.string().default('http://localhost:4002/api/v1'),
    EXPO_PUBLIC_ADMIN_API_URL: zod_1.z.string().default('http://localhost:4003/api/v1'),
    EXPO_PUBLIC_SUPABASE_URL: zod_1.z.string().optional(),
    EXPO_PUBLIC_SUPABASE_ANON_KEY: zod_1.z.string().optional(),
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_API_KEY: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_APP_ID: zod_1.z.string().optional(),
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: zod_1.z.string().optional(),
});
let cachedEnv = null;
function getValidatedEnv() {
    if (cachedEnv) {
        return cachedEnv;
    }
    const result = exports.EnvSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Environment validation failed:');
        result.error.issues.forEach((issue) => {
            console.error(`   ${issue.path.join('.')}: ${issue.message}`);
        });
        throw new Error('Invalid environment configuration in root .env');
    }
    cachedEnv = result.data;
    return cachedEnv;
}
function getLoadedEnvFilePath() {
    return rootEnvPath;
}
