/**
 * MandiKart — Global Audit Logger
 * Every state-changing and admin action writes through this function.
 */
import { UserRole } from '@mandikart/shared-types';
export interface AuditLogEntry {
    actorId: string;
    role: UserRole;
    action: string;
    resourceType: 'ORDER' | 'PRODUCT' | 'FARMER' | 'BUYER' | 'USER' | 'LOGISTICS' | 'PAYMENT' | 'DISPUTE';
    resourceId: string;
    metadata?: Record<string, any>;
}
export declare function auditLog(entry: AuditLogEntry): Promise<void>;
