/**
 * MandiKart — Global Audit Logger
 * Every state-changing and admin action writes through this function.
 */

import { getSupabaseAdmin } from '../db/supabase.js';
import { UserRole } from '@mandikart/shared-types';

export interface AuditLogEntry {
  actorId: string;
  role: UserRole;
  action: string;
  resourceType: 'ORDER' | 'PRODUCT' | 'FARMER' | 'BUYER' | 'USER' | 'LOGISTICS' | 'PAYMENT' | 'DISPUTE';
  resourceId: string;
  metadata?: Record<string, any>;
}

export async function auditLog(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`📝 [AUDIT] [${timestamp}] ${entry.role} (${entry.actorId}) -> ${entry.action} on ${entry.resourceType}:${entry.resourceId}`);

  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('audit_log').insert({
      actor_id: entry.actorId,
      role: entry.role,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      metadata: entry.metadata || {},
      created_at: timestamp,
    });
  } catch (err) {
    // Non-blocking fallback to avoid breaking transactions if audit table has latency
    console.warn('⚠️ [AUDIT] Database write skipped (fallback to process log):', (err as Error).message);
  }
}
