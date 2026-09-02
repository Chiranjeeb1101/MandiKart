/**
 * MandiKart — Core Domain Types
 *
 * Strict TypeScript interfaces for the entire farmer journey.
 * No `any`. Shared types organised in one place.
 */

// ── Farmer ─────────────────────────────────────────────────

export interface Farmer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  profileImageUrl?: string;
  language: 'en' | 'hi' | 'mr';
  isFPOMember: boolean;
  fpoId?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface FPO {
  id: string;
  name: string;
  registrationNumber: string;
  location: Location;
  memberCount: number;
  contactPhone: string;
}

// ── Farm ───────────────────────────────────────────────────

export interface FarmDetails {
  id: string;
  farmerId: string;
  farmName?: string;
  location: Location;
  areaInAcres: number;
  crops: string[];
  irrigationType?: 'rainfed' | 'irrigated' | 'mixed';
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  district?: string;
  state?: string;
  pincode?: string;
}

// ── Produce ────────────────────────────────────────────────

export type ProduceStatus = 'available' | 'listed' | 'partially_sold' | 'sold';
export type QualityGrade = 'A' | 'B' | 'C';

export interface Produce {
  id: string;
  farmerId: string;
  cropName: string;
  cropCategory: string;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  availableFrom: string;
  availableTo?: string;
  status: ProduceStatus;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Market ─────────────────────────────────────────────────

export interface MarketPrice {
  cropName: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  date: string;
  source?: string;
}

export type DemandLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface MarketDemand {
  cropName: string;
  region: string;
  demandLevel: DemandLevel;
  lastUpdated: string;
}

// ── Buyer ──────────────────────────────────────────────────

export interface Buyer {
  id: string;
  name: string;
  businessName?: string;
  location: Location;
  isVerified: boolean;
  rating?: number;
  completedOrders?: number;
  profileImageUrl?: string;
}

export interface BuyerRequirement {
  buyerId: string;
  cropName: string;
  quantityMin: number;
  quantityMax: number;
  qualityGrade: QualityGrade;
  pricePerUnit: number;
  unit: string;
  demandLevel: DemandLevel;
  availableFrom: string;
  availableTo?: string;
}

// ── Selling Options & Matching ─────────────────────────────

export interface SellingOption {
  id: string;
  buyer: Buyer;
  requirement: BuyerRequirement;
  pricePerUnit: number;
  estimatedTransportCostPerUnit: number;
  estimatedOtherCostsPerUnit: number;
  estimatedNetReturnPerUnit: number;
  totalEstimatedGross: number;
  totalEstimatedTransport: number;
  totalEstimatedOtherCosts: number;
  totalEstimatedNetReturn: number;
  distanceKm: number;
  matchPercentage: number;
  matchReasons: MatchReason[];
  isRecommended: boolean;
  recommendationReasons?: string[];
}

export interface MatchReason {
  factor: string;
  matches: boolean;
  description: string;
}

// ── Purchase Request ───────────────────────────────────────

export type PurchaseRequestStatus =
  | 'draft'
  | 'sent'
  | 'buyer_reviewing'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface PurchaseRequest {
  id: string;
  farmerId: string;
  buyerId: string;
  buyer: Buyer;
  produceId: string;
  cropName: string;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  pricePerUnit: number;
  estimatedGrossValue: number;
  estimatedTransportCost: number;
  estimatedOtherCosts: number;
  estimatedNetReturn: number;
  pickupLocation: Location;
  message?: string;
  status: PurchaseRequestStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Order ──────────────────────────────────────────────────

export type OrderStatus =
  | 'confirmed'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'payment_processing'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Order {
  id: string;
  purchaseRequestId: string;
  farmerId: string;
  buyerId: string;
  buyer: Buyer;
  cropName: string;
  quantity: number;
  unit: string;
  qualityGrade: QualityGrade;
  pricePerUnit: number;
  grossValue: number;
  transportCost: number;
  otherCosts: number;
  netReturn: number;
  status: OrderStatus;
  pickup?: PickupInfo;
  delivery?: DeliveryInfo;
  payment?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

// ── Pickup / Logistics ─────────────────────────────────────

export type PickupStatus = 'scheduled' | 'waiting' | 'accepted' | 'rejected' | 'completed';

export interface PickupInfo {
  collectionCentre?: string;
  location: Location;
  scheduledDate: string;
  scheduledTime: string;
  token?: string;
  status: PickupStatus;
}

export interface DeliveryInfo {
  pickupLocation: Location;
  deliveryLocation: Location;
  distanceKm: number;
  estimatedDeliveryDate?: string;
  status: 'picked_up' | 'in_transit' | 'delivered';
}

// ── Payment ────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PaymentInfo {
  id: string;
  orderId: string;
  grossValue: number;
  transportDeduction: number;
  otherDeductions: number;
  netAmount: number;
  status: PaymentStatus;
  paidAt?: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayments: number;
  completedTransactions: number;
}

export interface Transaction {
  id: string;
  orderId: string;
  cropName: string;
  buyerName: string;
  amount: number;
  type: 'credit' | 'debit';
  status: PaymentStatus;
  date: string;
}

// ── Notification ───────────────────────────────────────────

export type NotificationType =
  | 'order_update'
  | 'price_alert'
  | 'buyer_request'
  | 'payment'
  | 'general';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
