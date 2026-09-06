/**
 * MandiKart — Shared Negotiation Registry
 * Enables immediate cross-backend negotiation synchronization across microservices
 * with persistent cross-process disk synchronization.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface RegisteredNegotiation {
  id: string;
  productId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerCompany?: string;
  originalPrice: number;
  offeredPrice: number;
  counterPrice?: number | null;
  quantity: number;
  unit: string;
  status: 'PENDING_FARMER' | 'COUNTER_OFFERED' | 'ACCEPTED' | 'REJECTED';
  remarks?: string | null;
  history: Array<{
    id?: string;
    sender: 'BUYER' | 'FARMER' | 'buyer' | 'farmer';
    senderName?: string;
    price?: number;
    pricePerKg?: number;
    quantityKg?: number;
    text?: string;
    message?: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const CACHE_FILE = path.join(os.tmpdir(), 'mandikart_shared_negotiations.json');

const DEFAULT_NEGOTIATIONS: RegisteredNegotiation[] = [
  {
    id: 'neg_101',
    productId: 'prod_garwa_onion_101',
    cropName: 'Red Onion (Nashik Export Grade)',
    farmerId: 'd1111111-1111-1111-1111-111111111111',
    farmerName: 'Ramesh Patel',
    buyerId: 'buyer_mumbai_retail_04',
    buyerName: 'Vikram Mehta (BigBasket Hub)',
    buyerPhone: '+91 98200 11223',
    buyerCompany: 'BigBasket Wholesale',
    originalPrice: 28.0,
    offeredPrice: 25.0,
    counterPrice: 26.5,
    quantity: 500,
    unit: 'kg',
    status: 'COUNTER_OFFERED',
    remarks: 'Inquiring for bulk weekly supply to Mumbai hub.',
    history: [
      {
        id: 'msg_1',
        sender: 'BUYER',
        senderName: 'Vikram Mehta',
        price: 25.0,
        text: 'Hello Ramesh ji, can you supply 500kg at ₹25/kg with farmgate pickup?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'msg_2',
        sender: 'FARMER',
        senderName: 'Ramesh Patel',
        price: 26.5,
        text: 'This is premium Grade A cured onion. Best counter offer is ₹26.50/kg.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

function readFromDisk(): RegisteredNegotiation[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  writeToDisk(DEFAULT_NEGOTIATIONS);
  return DEFAULT_NEGOTIATIONS;
}

function writeToDisk(items: RegisteredNegotiation[]): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch {}
}

export class NegotiationRegistryService {
  static registerNegotiation(neg: RegisteredNegotiation): void {
    const list = readFromDisk();
    const existingIndex = list.findIndex((n) => n.id === neg.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...neg };
    } else {
      list.unshift(neg);
    }
    writeToDisk(list);
  }

  static updateNegotiation(id: string, updates: Partial<RegisteredNegotiation>): RegisteredNegotiation | undefined {
    const list = readFromDisk();
    const index = list.findIndex((n) => n.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      writeToDisk(list);
      return list[index];
    }
    return undefined;
  }

  static getRegisteredNegotiations(): RegisteredNegotiation[] {
    return readFromDisk();
  }

  static getNegotiationById(id: string): RegisteredNegotiation | undefined {
    const list = readFromDisk();
    return list.find((n) => n.id === id);
  }
}
