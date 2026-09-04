/**
 * MandiKart — Frontend Supabase Client with Realtime WebSocket Support
 * Enables zero-battery push subscriptions for live order tracking & delivery status.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://keietktvnoyzexcmydyf.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_I4ozxsLK7m6R2hBCEjlAvQ_fJDOrF1O';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
