/**
 * MandiKart — Canonical Order Status Labels & Colors (Buyer App)
 * Source of truth: 00_PROJECT_MASTER_GUIDE.md §3
 * Never inline status strings in UI components; always import from here.
 */

import { OrderStatus } from '../types';
import { Colors } from '../theme';

export interface StatusConfig {
  label: string;
  stepNumber: number;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  description: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PLACED: {
    label: 'Order Placed',
    stepNumber: 1,
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    iconName: 'receipt-outline',
    description: 'Order placed and sent to farm partner for acceptance.',
  },
  CONFIRMED: {
    label: 'Confirmed',
    stepNumber: 2,
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    iconName: 'checkmark-circle-outline',
    description: 'Farm confirmed produce availability and accepted order.',
  },
  PICKUP_SCHEDULED: {
    label: 'Packed & Ready',
    stepNumber: 3,
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    iconName: 'cube-outline',
    description: 'Produce harvested, graded, packed, and awaiting logistics pickup.',
  },
  PICKUP_IN_PROGRESS: {
    label: 'Driver Arriving at Farm',
    stepNumber: 3,
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    iconName: 'bicycle-outline',
    description: 'MandiKart delivery vehicle assigned and arriving at farm.',
  },
  COLLECTED: {
    label: 'Out for Delivery (Prep)',
    stepNumber: 4,
    badgeBg: '#E0E7FF',
    badgeText: '#4338CA',
    iconName: 'archive-outline',
    description: 'Produce collected from farm and sorted for dispatch.',
  },
  IN_TRANSIT: {
    label: 'Out for Delivery',
    stepNumber: 5,
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    iconName: 'navigate-outline',
    description: 'Order is on the way to your delivery address.',
  },
  DELIVERED: {
    label: 'Delivered',
    stepNumber: 6,
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
    iconName: 'home-outline',
    description: 'Delivered safely with secure OTP verification.',
  },
  COMPLETED: {
    label: 'Completed',
    stepNumber: 7,
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
    iconName: 'shield-checkmark-outline',
    description: 'Order completed and payment settled to farmer.',
  },
  CANCELLED: {
    label: 'Cancelled',
    stepNumber: 0,
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    iconName: 'close-circle-outline',
    description: 'Order was cancelled.',
  },
  FAILED: {
    label: 'Delivery Failed',
    stepNumber: 0,
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    iconName: 'alert-circle-outline',
    description: 'Delivery partner could not complete handover.',
  },
  DISPUTED: {
    label: 'Dispute Raised',
    stepNumber: 0,
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    iconName: 'warning-outline',
    description: 'Under review by MandiKart dispute resolution desk.',
  },
  // Legacy aliases
  PENDING: {
    label: 'Order Placed',
    stepNumber: 1,
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    iconName: 'receipt-outline',
    description: 'Awaiting farm acceptance.',
  },
  PROCESSING: {
    label: 'Packed & Ready',
    stepNumber: 3,
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    iconName: 'cube-outline',
    description: 'Produce harvested & packed.',
  },
  DISPATCHED: {
    label: 'Out for Delivery',
    stepNumber: 5,
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    iconName: 'navigate-outline',
    description: 'Order in transit to your address.',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    stepNumber: 5,
    badgeBg: '#F3E8FF',
    badgeText: '#7E22CE',
    iconName: 'navigate-outline',
    description: 'Arriving soon.',
  },
  RETURNED: {
    label: 'Returned',
    stepNumber: 0,
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    iconName: 'return-up-back-outline',
    description: 'Order returned.',
  },
};

export function getStatusConfig(status: OrderStatus | string): StatusConfig {
  const normalized = (status || 'PLACED').toUpperCase() as OrderStatus;
  return ORDER_STATUS_CONFIG[normalized] || ORDER_STATUS_CONFIG.PLACED;
}
