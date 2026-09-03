/**
 * MandiKart — Canonical Core Interfaces & Standard API Envelope
 */

import { OrderStatus, UserRole, ProduceGrade, BuyerTarget, QuantityUnit } from '../enums/orderStatus.js';

// Standard API Response Envelope
export interface ApiResponse<T = any> {
  data: T | null;
  meta: ApiMeta | null;
  error: ApiError | null;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  timestamp?: string;
  [key: string]: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// User & Farmer Entities
export interface User {
  id: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface Farmer {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  preferredLanguage: string;
  avatarUrl?: string | null;
  aadhaarLast4?: string | null;
  isVerified: boolean;
  state: string;
  district: string;
  taluka?: string | null;
  village?: string | null;
  farmSizeAcres: number;
  ownershipType: string;
  primaryCrops: string[];
  upiId?: string | null;
  bankAccountLast4?: string | null;
  bankIfsc?: string | null;
  bankAccountName?: string | null;
  fpoId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Product Entity
export interface Product {
  id: string;
  farmerId: string;
  cropName: string;
  cropVariety?: string | null;
  grade: ProduceGrade;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  quantityUnit: QuantityUnit | string;
  basePricePerUnit: number;
  minOrderQuantity: number;
  targetBuyer: BuyerTarget;
  images: string[];
  pickupAddress?: string | null;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  isActive: boolean;
  harvestDate?: string | null;
  shelfLifeDays: number;
  createdAt: string;
  updatedAt: string;
}

// Order & Order Item Entities
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  cropName: string;
  grade: ProduceGrade;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  farmerId: string;
  buyerId: string;
  buyerName?: string;
  buyerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  platformFee: number;
  farmerPayoutAmount: number;
  pickupOtp?: string | null;
  deliveryOtp?: string | null;
  pickupScheduledAt?: string | null;
  driverId?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  vehicleNumber?: string | null;
  cancellationReason?: string | null;
  disputeReason?: string | null;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy: string;
  role: UserRole;
  remarks?: string | null;
  createdAt: string;
}

// Market Price Entity
export interface MarketPrice {
  id: string;
  state: string;
  district: string;
  marketMandiName: string;
  commodity: string;
  variety?: string | null;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  createdAt: string;
}

// Negotiation Entity
export interface Negotiation {
  id: string;
  orderId?: string | null;
  productId: string;
  buyerId: string;
  farmerId: string;
  originalPrice: number;
  offeredPrice: number;
  counterPrice?: number | null;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

// User Consent, Cookies & App Permissions
export interface AppPermissions {
  location: boolean;
  camera: boolean;
  notifications: boolean;
  storage?: boolean;
}

export interface ConsentInput {
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  cookiesConsent: boolean;
  permissions?: AppPermissions;
  version?: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  role: UserRole;
  hasAcceptedConsent: boolean;
  requiresConsent: boolean;
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  cookiesConsent: boolean;
  permissions: AppPermissions;
  version: string;
  ipAddress?: string;
  userAgent?: string;
  acceptedAt?: string | null;
  updatedAt: string;
}

// In-App and Push Notifications
export type NotificationType = 'ORDER_UPDATE' | 'PRICE_ALERT' | 'NEGOTIATION' | 'SYSTEM';

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  body: string;
  type: NotificationType;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface DevicePushTokenRecord {
  id: string;
  userId: string;
  role: UserRole;
  token: string;
  deviceType: 'android' | 'ios' | 'web';
  lastSeenAt: string;
}

export * from './location.types.js';


