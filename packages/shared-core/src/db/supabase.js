"use strict";
/**
 * MandiKart — Centralized Supabase Client Factory
 * Single client initialization logic shared across all 4 services.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClient = getSupabaseClient;
exports.getSupabaseAdmin = getSupabaseAdmin;
const supabase_js_1 = require("@supabase/supabase-js");
const shared_config_1 = require("@mandikart/shared-config");
let clientInstance = null;
let adminClientInstance = null;
function getSupabaseClient() {
    if (!clientInstance) {
        const env = (0, shared_config_1.getValidatedEnv)();
        clientInstance = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return clientInstance;
}
function getSupabaseAdmin() {
    if (!adminClientInstance) {
        const env = (0, shared_config_1.getValidatedEnv)();
        adminClientInstance = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return adminClientInstance;
}
