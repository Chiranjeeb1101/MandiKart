// ─────────────────────────────────────────────
// MandiKart UserApp — Shared Type Definitions
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  imageUrl?: string;
  productCount?: number;
}

export interface Farmer {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  state: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  totalProducts: number;
  memberSince: string;
  about?: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  images: string[];
  price: number; // per unit
  unit: string; // kg, dozen, piece, etc.
  minOrder: number;
  stock: number;
  category: string;
  categoryId: string;
  farmer: Farmer;
  rating: number;
  reviewCount: number;
  description: string;
  isFreshDeal?: boolean;
  isOrganic?: boolean;
  discount?: number; // percentage
  tags?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  placedAt: string;
  estimatedDelivery?: string;
  farmer: Farmer;
  trackingSteps?: TrackingStep[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  priceAtOrder: number;
}

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'WALLET';

export interface Review {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  rating: number;
  comment: string;
  createdAt: string;
  productId?: string;
  farmerId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'product';
  productRef?: Pick<Product, 'id' | 'name' | 'imageUrl' | 'price' | 'unit'>;
}

export interface Notification {
  id: string;
  type: 'ORDER' | 'PROMOTION' | 'SYSTEM' | 'CHAT';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  actionId?: string; // e.g. orderId for ORDER type
}
