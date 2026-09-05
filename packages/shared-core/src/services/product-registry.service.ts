/**
 * MandiKart — Shared Produce Registry
 * Enables immediate cross-backend discovery of produce listings across microservices
 * with persistent cross-process disk synchronization.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface RegisteredProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  location: string;
  cropName: string;
  cropVariety?: string;
  grade: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity?: number;
  quantityUnit: string;
  basePricePerUnit: number;
  minOrderQuantity: number;
  targetBuyer: string;
  images: string[];
  pickupAddress?: string;
  shelfLifeDays?: number;
  isActive: boolean;
  createdAt: string;
  [key: string]: any;
}

const CACHE_FILE = path.join(os.tmpdir(), 'mandikart_shared_products.json');

function readFromDisk(): RegisteredProduct[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(content) || [];
    }
  } catch {}
  return [];
}

function writeToDisk(products: RegisteredProduct[]): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch {}
}

export class ProductRegistryService {
  static registerProduct(product: RegisteredProduct): void {
    const list = readFromDisk();
    const existingIndex = list.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      list[existingIndex] = product;
    } else {
      list.unshift(product);
    }
    writeToDisk(list);
  }

  static getRegisteredProducts(): RegisteredProduct[] {
    return readFromDisk();
  }

  static getProductById(id: string): RegisteredProduct | undefined {
    const list = readFromDisk();
    return list.find((p) => p.id === id);
  }
}
