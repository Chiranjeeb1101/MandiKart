/**
 * MandiKart — Shared Negotiation Registry
 * Enables immediate cross-backend negotiation synchronization across microservices
 * with persistent cross-process disk synchronization.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { OrderRegistryService } from './order-registry.service.js';
import { OrderStatus } from '@mandikart/shared-types';

export type NegotiationMessageType = 'TEXT' | 'OFFER' | 'SYSTEM' | 'ORDER_EVENT';
export type NegotiationSenderRole = 'BUYER' | 'FARMER' | 'SYSTEM';

export interface NegotiationMessageItem {
  id: string;
  negotiationId: string;
  senderId: string;
  senderRole: NegotiationSenderRole;
  senderName: string;
  messageType: NegotiationMessageType;
  text: string;
  price?: number;
  quantity?: number;
  unit?: string;
  totalAmount?: number;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'COUNTERED';
  orderId?: string;
  orderNumber?: string;
  timestamp: string;
  isRead?: boolean;
}

export interface RegisteredNegotiation {
  id: string;
  productId: string;
  cropName: string;
  cropImage?: string;
  grade?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  farmerLocation?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerCompany?: string;
  originalPrice: number;
  offeredPrice: number;
  counterPrice?: number | null;
  quantity: number;
  unit: string;
  status: 'PENDING_FARMER' | 'COUNTER_OFFERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  remarks?: string | null;
  orderId?: string | null;
  orderNumber?: string | null;
  messages: NegotiationMessageItem[];
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
    cropImage: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
    grade: 'A',
    farmerId: 'd1111111-1111-1111-1111-111111111111',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Nashik, Maharashtra',
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
    messages: [
      {
        id: 'msg_1',
        negotiationId: 'neg_101',
        senderId: 'buyer_mumbai_retail_04',
        senderRole: 'BUYER',
        senderName: 'Vikram Mehta',
        messageType: 'OFFER',
        text: 'Initial Offer: ₹25.00/kg for 500 kg',
        price: 25.0,
        quantity: 500,
        unit: 'kg',
        totalAmount: 12500,
        offerStatus: 'COUNTERED',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'msg_1_text',
        negotiationId: 'neg_101',
        senderId: 'buyer_mumbai_retail_04',
        senderRole: 'BUYER',
        senderName: 'Vikram Mehta',
        messageType: 'TEXT',
        text: 'Hello Ramesh ji, can you supply 500kg at ₹25/kg with farmgate pickup?',
        timestamp: new Date(Date.now() - 7190000).toISOString(),
      },
      {
        id: 'msg_2',
        negotiationId: 'neg_101',
        senderId: 'd1111111-1111-1111-1111-111111111111',
        senderRole: 'FARMER',
        senderName: 'Ramesh Patel',
        messageType: 'OFFER',
        text: 'Counter-Offer: ₹26.50/kg for 500 kg',
        price: 26.5,
        quantity: 500,
        unit: 'kg',
        totalAmount: 13250,
        offerStatus: 'PENDING',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg_2_text',
        negotiationId: 'neg_101',
        senderId: 'd1111111-1111-1111-1111-111111111111',
        senderRole: 'FARMER',
        senderName: 'Ramesh Patel',
        messageType: 'TEXT',
        text: 'This is premium Grade A cured onion. Best counter offer is ₹26.50/kg.',
        timestamp: new Date(Date.now() - 3590000).toISOString(),
      },
    ],
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
        // Ensure every item has messages array
        return parsed.map((item) => ({
          ...item,
          messages: Array.isArray(item.messages) ? item.messages : (item.history || []).map((h: any, idx: number) => ({
            id: h.id || `msg_mig_${idx}`,
            negotiationId: item.id,
            senderId: h.sender === 'BUYER' ? item.buyerId : item.farmerId,
            senderRole: (h.sender ? h.sender.toUpperCase() : 'BUYER') as NegotiationSenderRole,
            senderName: h.senderName || (h.sender === 'BUYER' ? item.buyerName : item.farmerName),
            messageType: h.price ? 'OFFER' : 'TEXT',
            text: h.text || h.message || '',
            price: h.price || h.pricePerKg,
            quantity: h.quantityKg || item.quantity,
            unit: item.unit || 'kg',
            totalAmount: (h.price || h.pricePerKg || item.offeredPrice) * (h.quantityKg || item.quantity),
            timestamp: h.timestamp || item.createdAt,
          })),
        }));
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
    if (!neg.messages) neg.messages = [];
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

  static addMessage(negotiationId: string, message: NegotiationMessageItem): RegisteredNegotiation | undefined {
    const list = readFromDisk();
    const index = list.findIndex((n) => n.id === negotiationId);
    if (index === -1) return undefined;

    const neg = list[index];
    if (!neg.messages) neg.messages = [];

    // Duplicate protection by message id
    if (!neg.messages.some((m) => m.id === message.id)) {
      neg.messages.push(message);
    }

    if (!neg.history) neg.history = [];
    neg.history.push({
      id: message.id,
      sender: message.senderRole === 'BUYER' ? 'BUYER' : 'FARMER',
      senderName: message.senderName,
      price: message.price,
      pricePerKg: message.price,
      quantityKg: message.quantity,
      text: message.text,
      message: message.text,
      timestamp: message.timestamp,
    });

    neg.updatedAt = message.timestamp;
    writeToDisk(list);
    return neg;
  }

  /**
   * Atomic offer acceptance: accepts the active deal, creates the confirmed order in OrderRegistryService,
   * and appends system/order events to the conversation.
   */
  static acceptNegotiation(
    id: string,
    actorRole: 'BUYER' | 'FARMER',
    actorId: string,
    actorName: string,
    deliveryAddress?: string
  ): { negotiation: RegisteredNegotiation; order: any } | undefined {
    const target = this.getNegotiationById(id);
    if (!target) return undefined;

    const finalPrice = target.counterPrice || target.offeredPrice;
    const finalQty = target.quantity;
    const totalAmount = Math.round(finalPrice * finalQty);
    const orderNumber = `MK-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord_neg_${Date.now()}`;
    const pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Create order in OrderRegistryService
    const createdOrder = {
      id: orderId,
      orderNumber,
      farmerId: target.farmerId || 'd1111111-1111-1111-1111-111111111111',
      farmerName: target.farmerName || 'Ramesh Patel',
      farmerPhone: target.farmerPhone || '+91 98220 11111',
      farmerLocation: target.farmerLocation || 'Nashik, Maharashtra',
      buyerId: target.buyerId || 'buyer_default_01',
      buyerName: target.buyerName || 'MandiKart Buyer',
      buyerPhone: target.buyerPhone || '+91 98765 43210',
      cropName: target.cropName,
      produceName: target.cropName,
      category: 'Vegetables',
      qualityGrade: target.grade || 'GRADE_A',
      quantityKg: finalQty,
      pricePerKg: finalPrice,
      totalAmount,
      totalPrice: totalAmount,
      status: OrderStatus.CONFIRMED,
      escrowStatus: 'HELD_IN_ESCROW',
      deliveryAddress: deliveryAddress || 'Selected Delivery Location',
      pickupOtp,
      deliveryOtp,
      imageUrl: target.cropImage,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      items: [
        {
          id: `item_${orderId}_0`,
          productId: target.productId,
          cropName: target.cropName,
          grade: target.grade || 'A',
          quantity: finalQty,
          unit: target.unit || 'kg',
          pricePerUnit: finalPrice,
          subtotal: totalAmount,
        },
      ],
    };

    OrderRegistryService.registerOrder(createdOrder);

    // 2. Mark previous offers as ACCEPTED
    target.messages?.forEach((m) => {
      if (m.messageType === 'OFFER' && m.offerStatus === 'PENDING') {
        m.offerStatus = 'ACCEPTED';
      }
    });

    // 3. Add system messages
    const now = new Date().toISOString();
    const systemMsg: NegotiationMessageItem = {
      id: `msg_sys_acc_${Date.now()}`,
      negotiationId: id,
      senderId: actorId,
      senderRole: actorRole,
      senderName: actorName,
      messageType: 'SYSTEM',
      text: `${actorName} accepted the offer of ₹${finalPrice}/${target.unit || 'kg'}.`,
      timestamp: now,
    };

    const orderMsg: NegotiationMessageItem = {
      id: `msg_ord_evt_${Date.now() + 1}`,
      negotiationId: id,
      senderId: 'system',
      senderRole: 'SYSTEM',
      senderName: 'MandiKart System',
      messageType: 'ORDER_EVENT',
      text: `Order #${orderNumber} has been successfully created! Both parties can track logistics in Orders.`,
      orderId,
      orderNumber,
      totalAmount,
      timestamp: new Date(Date.now() + 50).toISOString(),
    };

    if (!target.messages) target.messages = [];
    target.messages.push(systemMsg, orderMsg);

    if (!target.history) target.history = [];
    target.history.push({
      id: systemMsg.id,
      sender: actorRole,
      senderName: actorName,
      price: finalPrice,
      pricePerKg: finalPrice,
      quantityKg: finalQty,
      text: systemMsg.text,
      message: systemMsg.text,
      timestamp: now,
    });

    target.status = 'ACCEPTED';
    target.orderId = orderId;
    target.orderNumber = orderNumber;
    target.updatedAt = now;

    this.updateNegotiation(id, target);

    return {
      negotiation: target,
      order: createdOrder,
    };
  }

  /**
   * Counter negotiation offer: creates a new immutable structured offer message.
   */
  static counterNegotiation(
    id: string,
    actorRole: 'BUYER' | 'FARMER',
    actorId: string,
    actorName: string,
    counterPrice: number,
    counterQty: number,
    message?: string
  ): RegisteredNegotiation | undefined {
    const target = this.getNegotiationById(id);
    if (!target) return undefined;

    // Mark previous pending offers as COUNTERED
    target.messages?.forEach((m) => {
      if (m.messageType === 'OFFER' && m.offerStatus === 'PENDING') {
        m.offerStatus = 'COUNTERED';
      }
    });

    const now = new Date().toISOString();
    const offerMsg: NegotiationMessageItem = {
      id: `msg_off_${Date.now()}`,
      negotiationId: id,
      senderId: actorId,
      senderRole: actorRole,
      senderName: actorName,
      messageType: 'OFFER',
      text: `Counter-Offer: ₹${counterPrice}/${target.unit || 'kg'} for ${counterQty} ${target.unit || 'kg'}`,
      price: counterPrice,
      quantity: counterQty,
      unit: target.unit || 'kg',
      totalAmount: Math.round(counterPrice * counterQty),
      offerStatus: 'PENDING',
      timestamp: now,
    };

    if (!target.messages) target.messages = [];
    target.messages.push(offerMsg);

    if (message && message.trim()) {
      target.messages.push({
        id: `msg_txt_${Date.now() + 2}`,
        negotiationId: id,
        senderId: actorId,
        senderRole: actorRole,
        senderName: actorName,
        messageType: 'TEXT',
        text: message.trim(),
        timestamp: new Date(Date.now() + 50).toISOString(),
      });
    }

    target.counterPrice = counterPrice;
    target.quantity = counterQty;
    target.status = 'COUNTER_OFFERED';
    target.updatedAt = now;

    this.updateNegotiation(id, target);
    return target;
  }

  /**
   * Reject negotiation offer
   */
  static rejectNegotiation(
    id: string,
    actorRole: 'BUYER' | 'FARMER',
    actorId: string,
    actorName: string,
    reason?: string
  ): RegisteredNegotiation | undefined {
    const target = this.getNegotiationById(id);
    if (!target) return undefined;

    // Mark pending offers as REJECTED
    target.messages?.forEach((m) => {
      if (m.messageType === 'OFFER' && m.offerStatus === 'PENDING') {
        m.offerStatus = 'REJECTED';
      }
    });

    const now = new Date().toISOString();
    const rejectMsg: NegotiationMessageItem = {
      id: `msg_rej_${Date.now()}`,
      negotiationId: id,
      senderId: actorId,
      senderRole: actorRole,
      senderName: actorName,
      messageType: 'SYSTEM',
      text: `Offer declined by ${actorName}${reason ? `: "${reason}"` : '.'}`,
      timestamp: now,
    };

    if (!target.messages) target.messages = [];
    target.messages.push(rejectMsg);

    target.status = 'REJECTED';
    target.updatedAt = now;

    this.updateNegotiation(id, target);
    return target;
  }
}
