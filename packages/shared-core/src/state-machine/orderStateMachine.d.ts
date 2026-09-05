/**
 * MandiKart — Canonical Order State Machine Engine
 * Single authoritative source across all 4 backends.
 */
import { OrderStatus, UserRole } from '@mandikart/shared-types';
export interface TransitionRule {
    allowedNextStates: OrderStatus[];
    allowedRoles: UserRole[];
}
export declare const ORDER_TRANSITION_GRAPH: Record<OrderStatus, Partial<Record<OrderStatus, UserRole[]>>>;
export declare function canTransition(currentStatus: OrderStatus, targetStatus: OrderStatus, role: UserRole): {
    valid: boolean;
    reason?: string;
};
