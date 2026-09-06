/**
 * MandiKart — Shared Order Registry
 * Enables immediate cross-backend order synchronization across microservices
 * with persistent cross-process disk synchronization.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface RegisteredOrder {
  id: string;
  orderNumber: string;
  farmerId: string;
  farmerName: string;
  farmerCode?: string;
  farmerPhone?: string;
  farmerLocation?: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  buyerPhone?: string;
  buyerLocation?: string;
  cropName: string;
  produceName?: string;
  category?: string;
  qualityGrade: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  totalPrice: number;
  status: string; // 'PLACED' | 'CONFIRMED' | 'PICKUP_SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'DISPUTED'
  escrowStatus: string; // 'HELD_IN_ESCROW' | 'RELEASED_TO_FARMER' | 'REFUNDED_TO_BUYER' | 'PARTIAL_SPLIT'
  mandiName?: string;
  district?: string;
  deliveryAddress?: string;
  logisticsPartner?: string;
  logisticsTrackingId?: string;
  estimatedDelivery?: string;
  imageUrl?: string;
  createdAt: string;
  timestamp: string;
  items?: any[];
  [key: string]: any;
}

const CACHE_FILE = path.join(os.tmpdir(), 'mandikart_shared_orders.json');

const DEFAULT_ORDERS: RegisteredOrder[] = [
  {
    id: 'ORD-9401',
    orderNumber: '#MK-9401',
    farmerId: 'frm-101',
    farmerName: 'Ramesh Patel',
    farmerCode: 'FMR-8921',
    farmerPhone: '+91 98230 41122',
    farmerLocation: 'Nashik, Maharashtra',
    buyerId: 'byr-301',
    buyerName: 'Vikram Mehta',
    buyerCompany: 'BigBasket Wholesale Hub',
    buyerPhone: '+91 91234 56789',
    buyerLocation: 'Thane, Mumbai',
    cropName: 'Tomatoes (Hybrid Grade A)',
    produceName: 'Tomatoes (Hybrid Grade A)',
    category: 'Vegetables',
    qualityGrade: 'GRADE_A',
    quantityKg: 1500,
    pricePerKg: 32,
    totalAmount: 48000,
    totalPrice: 48000,
    status: 'PLACED',
    escrowStatus: 'HELD_IN_ESCROW',
    mandiName: 'Nashik Main Mandi',
    district: 'Nashik',
    deliveryAddress: 'Cold Storage Hub #4, Thane West, Mumbai',
    logisticsPartner: 'AgroTruck Logistics',
    logisticsTrackingId: 'TRK-9401-MH',
    estimatedDelivery: 'Tomorrow, 10:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ORD-9402',
    orderNumber: '#MK-9402',
    farmerId: 'frm-101',
    farmerName: 'Ramesh Patel',
    farmerCode: 'FMR-8921',
    farmerPhone: '+91 98230 41122',
    farmerLocation: 'Nashik, Maharashtra',
    buyerId: 'byr-302',
    buyerName: 'Pooja Deshmukh',
    buyerCompany: 'FreshPicks Supermarket',
    buyerPhone: '+91 98221 34567',
    buyerLocation: 'Pune, Maharashtra',
    cropName: 'Red Onion (Nashik Export)',
    produceName: 'Red Onion (Nashik Export)',
    category: 'Vegetables',
    qualityGrade: 'PREMIUM',
    quantityKg: 2000,
    pricePerKg: 28,
    totalAmount: 56000,
    totalPrice: 56000,
    status: 'IN_TRANSIT',
    escrowStatus: 'HELD_IN_ESCROW',
    mandiName: 'Nashik Main Mandi',
    district: 'Nashik',
    deliveryAddress: 'FreshPicks Central Depot, Hadapsar, Pune',
    logisticsPartner: 'ReeferExpress Fleet',
    logisticsTrackingId: 'TRK-9402-MH',
    estimatedDelivery: 'Today, 06:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ORD-9403',
    orderNumber: '#MK-9403',
    farmerId: 'frm-102',
    farmerName: 'Suresh Patil',
    farmerCode: 'FMR-5412',
    farmerPhone: '+91 94220 88990',
    farmerLocation: 'Nagpur, Maharashtra',
    buyerId: 'byr-303',
    buyerName: 'Sunil Verma',
    buyerCompany: 'Citrus Juice Exports',
    buyerPhone: '+91 98111 22334',
    buyerLocation: 'JNPT Port, Navi Mumbai',
    cropName: 'Nagpur Oranges (Sweet Mandarin)',
    produceName: 'Nagpur Oranges (Sweet Mandarin)',
    category: 'Fruits',
    qualityGrade: 'GRADE_A',
    quantityKg: 3000,
    pricePerKg: 45,
    totalAmount: 135000,
    totalPrice: 135000,
    status: 'COMPLETED',
    escrowStatus: 'RELEASED_TO_FARMER',
    mandiName: 'Nagpur Cotton & Orange Mandi',
    district: 'Nagpur',
    deliveryAddress: 'Cold Berth Terminal #2, JNPT, Navi Mumbai',
    logisticsPartner: 'AgroTruck Logistics',
    logisticsTrackingId: 'TRK-9403-MH',
    estimatedDelivery: 'Delivered',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'ORD-9404',
    orderNumber: '#MK-9404',
    farmerId: 'frm-103',
    farmerName: 'Baldev Singh',
    farmerCode: 'FMR-3190',
    farmerPhone: '+91 97180 12345',
    farmerLocation: 'Karnal, Haryana',
    buyerId: 'byr-304',
    buyerName: 'Rajinder Kumar',
    buyerCompany: 'Punjab Mills & Grocers',
    buyerPhone: '+91 98770 99887',
    buyerLocation: 'Delhi Azadpur APMC',
    cropName: 'Golden Sharbati Wheat',
    produceName: 'Golden Sharbati Wheat',
    category: 'Grains',
    qualityGrade: 'PREMIUM',
    quantityKg: 4000,
    pricePerKg: 30,
    totalAmount: 120000,
    totalPrice: 120000,
    status: 'PLACED',
    escrowStatus: 'HELD_IN_ESCROW',
    mandiName: 'Karnal Grain Market',
    district: 'Karnal',
    deliveryAddress: 'Shed #14, Azadpur Mandi, Delhi',
    logisticsPartner: 'NorthLogistics Corp',
    logisticsTrackingId: 'TRK-9404-DL',
    estimatedDelivery: 'Tomorrow, 04:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  }
];

function readFromDisk(): RegisteredOrder[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  writeToDisk(DEFAULT_ORDERS);
  return DEFAULT_ORDERS;
}

function writeToDisk(orders: RegisteredOrder[]): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch {}
}

export class OrderRegistryService {
  static registerOrder(order: RegisteredOrder): void {
    const list = readFromDisk();
    const existingIndex = list.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...order };
    } else {
      list.unshift(order);
    }
    writeToDisk(list);
  }

  static updateOrder(id: string, updates: Partial<RegisteredOrder>): RegisteredOrder | undefined {
    const list = readFromDisk();
    const index = list.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      writeToDisk(list);
      return list[index];
    }
    return undefined;
  }

  static getRegisteredOrders(): RegisteredOrder[] {
    return readFromDisk();
  }

  static getOrderById(id: string): RegisteredOrder | undefined {
    const list = readFromDisk();
    return list.find((o) => o.id === id || o.orderNumber === id);
  }
}
