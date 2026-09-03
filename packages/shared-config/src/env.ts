/**
 * MandiKart — Global Environment Schema & Validator
 * Enforces fail-fast at boot if essential secrets are missing.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('*'),
  SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY: z.string().min(1).default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('placeholder-service-key'),
  JWT_SECRET: z.string().min(16).default('mandikart-secure-jwt-secret-key-32chars!'),
  PII_ENCRYPTION_KEY: z.string().min(32).default('mandikart-32-char-encryption-key!'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function getValidatedEnv(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.issues.forEach((issue) => {
      console.error(`   ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Invalid environment configuration');
  }
  return result.data;
}
