/**
 * MandiKart — Canonical Enums
 * Authoritative source across all 4 backends and shared libraries.
 */

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  PICKUP_IN_PROGRESS = 'PICKUP_IN_PROGRESS',
  COLLECTED = 'COLLECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  DISPUTED = 'DISPUTED',
}

export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  LOGISTICS_DRIVER = 'LOGISTICS_DRIVER',
  ADMIN = 'ADMIN',
}

export enum ProduceGrade {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum BuyerTarget {
  RETAIL = 'RETAIL',
  BULK = 'BULK',
  BOTH = 'BOTH',
}

export enum QuantityUnit {
  KG = 'kg',
  QUINTAL = 'quintal',
  CRATE = 'crate',
  TONNE = 'tonne',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED_REFUND = 'RESOLVED_REFUND',
  RESOLVED_SETTLED = 'RESOLVED_SETTLED',
  REJECTED = 'REJECTED',
}
