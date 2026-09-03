/**
 * MandiKart Farmer Backend — Domain Types & Contracts
 * Strictly typed definitions aligning with 00_PROJECT_MASTER_GUIDE.md
 */

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'PICKUP_IN_PROGRESS'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'DISPUTED';

export type QualityGrade = 'A' | 'B' | 'C';

export type ProduceStatus = 'AVAILABLE' | 'LISTED' | 'PARTIALLY_SOLD' | 'SOLD';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  district: string;
  state: string;
  farmerType: string;
  experience: string;
  crops: string[];
  isVerified: boolean;
  fpoId?: string | null;
  createdAt: string;
}

export interface Product {
  id: string;
  farmerId: string;
  cropName: string;
  quantityKg: number;
  availableQuantityKg: number;
  expectedPricePerKg: number;
  qualityGrade: QualityGrade;
  harvestDate?: string;
  status: ProduceStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  productId: string;
  cropName: string;
  quantityKg: number;
  pricePerKg: number;
  totalGrossAmount: number;
  transportDeduction: number;
  mandiFeeDeduction: number;
  netPayableAmount: number;
  status: OrderStatus;
  pickupToken?: string;
  pickupScheduledDate?: string;
  deliveryAddress: string;
  isBulk: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponseEnvelope<T> {
  data: T | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  } | null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  } | null;
}
