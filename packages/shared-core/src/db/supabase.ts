/**
 * MandiKart — Centralized Supabase Client Factory
 * Single client initialization logic shared across all 4 services.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getValidatedEnv } from '@mandikart/shared-config';

let clientInstance: SupabaseClient | null = null;
let adminClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    const env = getValidatedEnv();
    clientInstance = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return clientInstance;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClientInstance) {
    const env = getValidatedEnv();
    adminClientInstance = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return adminClientInstance;
}
