"use strict";
/**
 * MandiKart — Global Audit Logger
 * Every state-changing and admin action writes through this function.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
const supabase_js_1 = require("../db/supabase.js");
async function auditLog(entry) {
    const timestamp = new Date().toISOString();
    console.log(`📝 [AUDIT] [${timestamp}] ${entry.role} (${entry.actorId}) -> ${entry.action} on ${entry.resourceType}:${entry.resourceId}`);
    try {
        const supabase = (0, supabase_js_1.getSupabaseAdmin)();
        await supabase.from('audit_log').insert({
            actor_id: entry.actorId,
            role: entry.role,
            action: entry.action,
            resource_type: entry.resourceType,
            resource_id: entry.resourceId,
            metadata: entry.metadata || {},
            created_at: timestamp,
        });
    }
    catch (err) {
        // Non-blocking fallback to avoid breaking transactions if audit table has latency
        console.warn('⚠️ [AUDIT] Database write skipped (fallback to process log):', err.message);
    }
}
