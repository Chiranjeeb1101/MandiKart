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
  farmerPhone?: string;
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
  status?: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';
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

export function getCropImageUrl(cropName: string = '', category: string = ''): string {
  const name = (cropName || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (name.includes('tomato')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('onion')) {
    return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('potato') || name.includes('alu') || name.includes('aloo')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('wheat') || name.includes('gehu')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('rice') || name.includes('paddy') || name.includes('chawal')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('corn') || name.includes('maize') || name.includes('makka')) {
    return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('chilli') || name.includes('chili') || name.includes('mirchi')) {
    return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('garlic') || name.includes('lahsun')) {
    return 'https://images.unsplash.com/photo-1615477550926-25ccbf3a9ec1?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('ginger') || name.includes('adrak')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('apple') || name.includes('seb')) {
    return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('mango') || name.includes('aam')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('orange') || name.includes('santre') || name.includes('santra')) {
    return 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('carrot') || name.includes('gajar')) {
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80';
  }
  if (name.includes('cabbage') || name.includes('cauliflower') || name.includes('gobi')) {
    return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=80';
  }
  if (cat.includes('fruit')) {
    return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80';
  }
  if (cat.includes('grain') || cat.includes('cereal') || cat.includes('pulse')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80';
}

export class ProductRegistryService {
  static registerProduct(product: RegisteredProduct): void {
    if (!product.images || product.images.length === 0 || !product.images[0]) {
      product.images = [getCropImageUrl(product.cropName, product.category)];
    }
    const list = readFromDisk();
    const existingIndex = list.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...product };
    } else {
      list.unshift(product);
    }
    writeToDisk(list);
  }

  static updateProductStatus(id: string, status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED'): void {
    const list = readFromDisk();
    const existingIndex = list.findIndex((p) => p.id === id);
    if (existingIndex >= 0) {
      list[existingIndex].status = status;
      list[existingIndex].isActive = status === 'ACTIVE';
    } else {
      list.unshift({
        id,
        farmerId: 'unknown',
        farmerName: 'Farmer',
        location: 'Mandi Area',
        cropName: 'Produce',
        grade: 'A',
        category: 'Vegetables',
        totalQuantity: 0,
        availableQuantity: 0,
        quantityUnit: 'kg',
        basePricePerUnit: 0,
        minOrderQuantity: 1,
        targetBuyer: 'BOTH',
        images: [],
        isActive: status === 'ACTIVE',
        status,
        createdAt: new Date().toISOString(),
      });
    }
    writeToDisk(list);
  }

  static getRegisteredProducts(): RegisteredProduct[] {
    const list = readFromDisk();
    return list.map(p => {
      if (!p.images || p.images.length === 0 || !p.images[0]) {
        p.images = [getCropImageUrl(p.cropName, p.category)];
      }
      return p;
    });
  }

  static getProductById(id: string): RegisteredProduct | undefined {
    const list = readFromDisk();
    const p = list.find((item) => item.id === id);
    if (p && (!p.images || p.images.length === 0 || !p.images[0])) {
      p.images = [getCropImageUrl(p.cropName, p.category)];
    }
    return p;
  }
}
