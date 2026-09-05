"use strict";
/**
 * MandiKart — Canonical Order State Machine Engine
 * Single authoritative source across all 4 backends.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_TRANSITION_GRAPH = void 0;
exports.canTransition = canTransition;
const shared_types_1 = require("@mandikart/shared-types");
// Canonical transition graph mapped from 00_PROJECT_MASTER_GUIDE.md
exports.ORDER_TRANSITION_GRAPH = {
    [shared_types_1.OrderStatus.PLACED]: {
        [shared_types_1.OrderStatus.CONFIRMED]: [shared_types_1.UserRole.FARMER, shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.CANCELLED]: [shared_types_1.UserRole.BUYER, shared_types_1.UserRole.FARMER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.CONFIRMED]: {
        [shared_types_1.OrderStatus.PICKUP_SCHEDULED]: [shared_types_1.UserRole.FARMER, shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.CANCELLED]: [shared_types_1.UserRole.BUYER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.PICKUP_SCHEDULED]: {
        [shared_types_1.OrderStatus.PICKUP_IN_PROGRESS]: [shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.CANCELLED]: [shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.PICKUP_IN_PROGRESS]: {
        [shared_types_1.OrderStatus.COLLECTED]: [shared_types_1.UserRole.FARMER, shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.FAILED]: [shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.COLLECTED]: {
        [shared_types_1.OrderStatus.IN_TRANSIT]: [shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.IN_TRANSIT]: {
        [shared_types_1.OrderStatus.DELIVERED]: [shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.FAILED]: [shared_types_1.UserRole.LOGISTICS_DRIVER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.DELIVERED]: {
        [shared_types_1.OrderStatus.COMPLETED]: [shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.DISPUTED]: [shared_types_1.UserRole.BUYER, shared_types_1.UserRole.FARMER, shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.DISPUTED]: {
        [shared_types_1.OrderStatus.COMPLETED]: [shared_types_1.UserRole.ADMIN],
        [shared_types_1.OrderStatus.CANCELLED]: [shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.FAILED]: {
        [shared_types_1.OrderStatus.PICKUP_SCHEDULED]: [shared_types_1.UserRole.ADMIN], // retry scheduling
        [shared_types_1.OrderStatus.CANCELLED]: [shared_types_1.UserRole.ADMIN],
    },
    [shared_types_1.OrderStatus.COMPLETED]: {},
    [shared_types_1.OrderStatus.CANCELLED]: {},
};
function canTransition(currentStatus, targetStatus, role) {
    const allowedTransitions = exports.ORDER_TRANSITION_GRAPH[currentStatus];
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
