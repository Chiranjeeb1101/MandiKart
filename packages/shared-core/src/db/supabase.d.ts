/**
 * MandiKart — Centralized Supabase Client Factory
 * Single client initialization logic shared across all 4 services.
 */
import { SupabaseClient } from '@supabase/supabase-js';
export declare function getSupabaseClient(): SupabaseClient;
export declare function getSupabaseAdmin(): SupabaseClient;
