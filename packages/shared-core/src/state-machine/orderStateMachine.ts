/**
 * MandiKart — Canonical Order State Machine Engine
 * Single authoritative source across all 4 backends.
 */

import { OrderStatus, UserRole } from '@mandikart/shared-types';

export interface TransitionRule {
  allowedNextStates: OrderStatus[];
  allowedRoles: UserRole[];
}

// Canonical transition graph mapped from 00_PROJECT_MASTER_GUIDE.md
export const ORDER_TRANSITION_GRAPH: Record<OrderStatus, Partial<Record<OrderStatus, UserRole[]>>> = {
  [OrderStatus.PLACED]: {
    [OrderStatus.CONFIRMED]: [UserRole.FARMER, UserRole.ADMIN],
    [OrderStatus.CANCELLED]: [UserRole.BUYER, UserRole.FARMER, UserRole.ADMIN],
  },
  [OrderStatus.CONFIRMED]: {
    [OrderStatus.PICKUP_SCHEDULED]: [UserRole.FARMER, UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
    [OrderStatus.CANCELLED]: [UserRole.BUYER, UserRole.ADMIN],
  },
  [OrderStatus.PICKUP_SCHEDULED]: {
    [OrderStatus.PICKUP_IN_PROGRESS]: [UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
    [OrderStatus.CANCELLED]: [UserRole.ADMIN],
  },
  [OrderStatus.PICKUP_IN_PROGRESS]: {
    [OrderStatus.COLLECTED]: [UserRole.FARMER, UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
    [OrderStatus.FAILED]: [UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
  },
  [OrderStatus.COLLECTED]: {
    [OrderStatus.IN_TRANSIT]: [UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
  },
  [OrderStatus.IN_TRANSIT]: {
    [OrderStatus.DELIVERED]: [UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
    [OrderStatus.FAILED]: [UserRole.LOGISTICS_DRIVER, UserRole.ADMIN],
  },
  [OrderStatus.DELIVERED]: {
    [OrderStatus.COMPLETED]: [UserRole.ADMIN],
    [OrderStatus.DISPUTED]: [UserRole.BUYER, UserRole.FARMER, UserRole.ADMIN],
  },
  [OrderStatus.DISPUTED]: {
    [OrderStatus.COMPLETED]: [UserRole.ADMIN],
    [OrderStatus.CANCELLED]: [UserRole.ADMIN],
  },
  [OrderStatus.FAILED]: {
    [OrderStatus.PICKUP_SCHEDULED]: [UserRole.ADMIN], // retry scheduling
    [OrderStatus.CANCELLED]: [UserRole.ADMIN],
  },
  [OrderStatus.COMPLETED]: {},
  [OrderStatus.CANCELLED]: {},
};

export function canTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  role: UserRole
): { valid: boolean; reason?: string } {
  const allowedTransitions = ORDER_TRANSITION_GRAPH[currentStatus];

  if (!allowedTransitions) {
    return { valid: false, reason: `Unknown current order status: ${currentStatus}` };
  }

  const allowedRoles = allowedTransitions[targetStatus];
  if (!allowedRoles) {
    const validTargets = Object.keys(allowedTransitions).join(', ') || 'None (Terminal state)';
    return {
      valid: false,
      reason: `Illegal state transition from ${currentStatus} to ${targetStatus}. Valid next states: [${validTargets}]`,
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      valid: false,
      reason: `Role '${role}' is not authorized to transition order from ${currentStatus} to ${targetStatus}. Authorized roles: [${allowedRoles.join(', ')}]`,
    };
  }

  return { valid: true };
}
