import { OrderStatus } from '../types/index.js';

/**
 * Valid transitions according to 00_PROJECT_MASTER_GUIDE & 02_BACKEND_DEV_GUIDE
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PICKUP_SCHEDULED', 'CANCELLED'],
  PICKUP_SCHEDULED: ['PICKUP_IN_PROGRESS', 'CANCELLED', 'DISPUTED'],
  PICKUP_IN_PROGRESS: ['COLLECTED', 'FAILED', 'DISPUTED'],
  COLLECTED: ['IN_TRANSIT', 'DISPUTED'],
  IN_TRANSIT: ['DELIVERED', 'DISPUTED', 'FAILED'],
  DELIVERED: ['COMPLETED', 'DISPUTED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: ['DISPUTED'],
  DISPUTED: ['CONFIRMED', 'CANCELLED', 'COMPLETED'],
};

/**
 * Validates whether an order can transition from current to next status.
 */
export function canTransition(current: OrderStatus, next: OrderStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[current];
  return !!allowed && allowed.includes(next);
}

/**
 * Returns allowed next statuses for a given state.
 */
export function getNextAllowedStatuses(current: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[current] || [];
}

/**
 * Asserts valid transition or throws clear error.
 */
export function assertValidTransition(current: OrderStatus, next: OrderStatus): void {
  if (!canTransition(current, next)) {
    throw new Error(
      `Invalid order state transition from '${current}' to '${next}'. Allowed next states: ${
        ALLOWED_TRANSITIONS[current]?.join(', ') || 'none'
      }`
    );
  }
}
