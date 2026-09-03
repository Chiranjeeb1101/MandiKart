/**
 * MandiKart Canonical Order Status Labels
 * Strictly synchronized with 00_PROJECT_MASTER_GUIDE.md §3 Table
 */
import { OrderStatus, PickupStatus, VehicleStatus, DriverStatus } from '../types';

export const ORDER_STATUS_LOGISTICS_LABELS: Record<OrderStatus, string> = {
  PLACED: 'Order Received',
  CONFIRMED: 'Pickup Required',
  PICKUP_SCHEDULED: 'Vehicle/Driver Assigned',
  PICKUP_IN_PROGRESS: 'Pickup In Progress',
  COLLECTED: 'Collected (Hub Staging)',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed (Settled)',
  CANCELLED: 'Cancelled',
  FAILED: 'Fulfillment Failed',
  DISPUTED: 'Disputed (Hold)',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string; dot: string }> = {
  PLACED: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
  CONFIRMED: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  PICKUP_SCHEDULED: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    dot: 'bg-purple-400',
  },
  PICKUP_IN_PROGRESS: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-400',
  },
  COLLECTED: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    dot: 'bg-cyan-400',
  },
  IN_TRANSIT: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  DELIVERED: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-300',
    border: 'border-teal-500/20',
    dot: 'bg-teal-300',
  },
  COMPLETED: {
    bg: 'bg-emerald-600/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-300',
  },
  CANCELLED: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    dot: 'bg-slate-400',
  },
  FAILED: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    dot: 'bg-rose-400',
  },
  DISPUTED: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
};

export const PICKUP_STATUS_LABELS: Record<PickupStatus, { label: string; color: string; badgeClass: string }> = {
  CONFIRMED: { label: 'Pending Assignment', color: '#f59e0b', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  PICKUP_SCHEDULED: { label: 'Assigned / Scheduled', color: '#818cf8', badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  PICKUP_IN_PROGRESS: { label: 'Driver Approaching', color: '#38bdf8', badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  COLLECTED: { label: 'Collected from Farm', color: '#34d399', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  FAILED: { label: 'Pickup Failed', color: '#f87171', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
};

export const VEHICLE_STATUS_CONFIG: Record<VehicleStatus, { label: string; badge: string; dot: string }> = {
  IDLE: { label: 'Idle / Available', badge: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' },
  ASSIGNED: { label: 'Assigned to Route', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' },
  IN_TRANSIT: { label: 'On Route / Moving', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse' },
  MAINTENANCE: { label: 'In Maintenance', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' },
};

export const DRIVER_STATUS_CONFIG: Record<DriverStatus, { label: string; badge: string }> = {
  AVAILABLE: { label: 'Available for Dispatch', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  ON_DUTY: { label: 'On Duty / In Transit', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  OFF_DUTY: { label: 'Off Duty', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
};
