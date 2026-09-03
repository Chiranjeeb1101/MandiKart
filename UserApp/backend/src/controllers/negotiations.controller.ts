/**
 * MandiKart — UserApp Negotiations Controller
 * Handles buyer price offers, negotiation tracking, and responses to farmer counter-offers.
 */

import { Request, Response } from 'express';
import { UserRole, OrderStatus } from '@mandikart/shared-types';
import { auditLog, getSupabaseAdmin } from '@mandikart/shared-core';
import { BuyerOrderService } from '../services/order.service.js';

// In-memory store for mock mode
const mockNegotiations: any[] = [
  {
    id: 'neg_101',
    productId: 'prod_1',
    cropName: 'Red Onion',
    farmerId: 'farmer_ramesh_01',
    farmerName: 'Ramesh Patil',
    buyerId: 'buyer_default_01',
    originalPrice: 26.5,
    offeredPrice: 24.0,
    counterPrice: 24.5,
    quantity: 200,
    unit: 'kg',
    status: 'COUNTER_OFFERED', // PENDING_FARMER | COUNTER_OFFERED | ACCEPTED | REJECTED | ORDERED
    remarks: 'Seeking regular weekly supply for restaurant chain.',
    history: [
      { sender: 'BUYER', price: 24.0, text: 'Can we settle at ₹24/kg for 200kg?', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { sender: 'FARMER', price: 24.5, text: 'Best I can do is ₹24.50/kg for Grade A sort.', timestamp: new Date(Date.now() - 1800000).toISOString() },
    ],
    updatedAt: new Date().toISOString(),
  }
];

export class BuyerNegotiationsController {
  static async listNegotiations(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      const items = mockNegotiations.filter((n) => n.buyerId === buyerId);
      res.status(200).json({
        data: items,
        meta: { total: items.length },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('negotiations')
        .select('*, products(crop_name, base_price_per_unit, images), farmers(full_name)')
        .eq('buyer_id', buyerId)
        .order('updated_at', { ascending: false });

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'NEGOTIATION_FETCH_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: { total: data.length }, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'NEGOTIATION_ERROR', message: (err as Error).message } });
    }
  }

  static async submitOffer(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const { productId, cropName, farmerId, farmerName, originalPrice, offeredPrice, quantity, unit, remarks } = req.body;

    if (!productId || !offeredPrice || !quantity) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'productId, offeredPrice, and quantity are required' },
      });
      return;
    }

    const negotiationId = `neg_${Date.now()}`;
    const newNeg = {
      id: negotiationId,
      productId,
      cropName: cropName || 'Produce',
      farmerId: farmerId || 'farmer_ramesh_01',
      farmerName: farmerName || 'Ramesh Patil',
      buyerId,
      originalPrice: Number(originalPrice) || Number(offeredPrice) * 1.1,
      offeredPrice: Number(offeredPrice),
      counterPrice: null,
      quantity: Number(quantity),
      unit: unit || 'kg',
      status: 'PENDING_FARMER',
      remarks: remarks || null,
      history: [
        { sender: 'BUYER', price: Number(offeredPrice), text: remarks || `Offer of ₹${offeredPrice}/${unit || 'kg'} submitted.`, timestamp: new Date().toISOString() }
      ],
      updatedAt: new Date().toISOString(),
    };

    mockNegotiations.unshift(newNeg);

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: 'SUBMIT_PRICE_OFFER',
      resourceType: 'PRODUCT',
      resourceId: productId,
      metadata: { offeredPrice, quantity },
    });

    res.status(201).json({
      data: newNeg,
      meta: null,
      error: null,
    });
  }

  static async respondToCounterOffer(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const negotiationId = String(req.params.id);
    const { action, counterPrice, remarks } = req.body; // action: 'ACCEPT' | 'REJECT' | 'COUNTER'

    if (!action || !['ACCEPT', 'REJECT', 'COUNTER'].includes(action)) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: "action must be 'ACCEPT', 'REJECT', or 'COUNTER'" },
      });
      return;
    }

    const target = mockNegotiations.find((n) => n.id === negotiationId && n.buyerId === buyerId);
    if (!target) {
      res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: 'Negotiation not found' },
      });
      return;
    }

    if (action === 'ACCEPT') {
      target.status = 'ACCEPTED';
      target.history.push({
        sender: 'BUYER',
        price: target.counterPrice || target.offeredPrice,
        text: remarks || 'Buyer accepted the counter-offer.',
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'REJECT') {
      target.status = 'REJECTED';
      target.history.push({
        sender: 'BUYER',
        price: null,
        text: remarks || 'Buyer declined the counter-offer.',
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'COUNTER') {
      if (!counterPrice) {
        res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'VALIDATION_ERROR', message: 'counterPrice is required for COUNTER action' },
        });
        return;
      }
      target.offeredPrice = Number(counterPrice);
      target.status = 'PENDING_FARMER';
      target.history.push({
        sender: 'BUYER',
        price: Number(counterPrice),
        text: remarks || `Counter offer of ₹${counterPrice} proposed.`,
        timestamp: new Date().toISOString(),
      });
    }

    target.updatedAt = new Date().toISOString();

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: `NEGOTIATION_${action}`,
      resourceType: 'PRODUCT',
      resourceId: negotiationId,
      metadata: { action, counterPrice },
    });

    res.status(200).json({
      data: target,
      meta: null,
      error: null,
    });
  }

  static async convertToOrder(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const negotiationId = String(req.params.id);
    const { deliveryAddress } = req.body;

    const target = mockNegotiations.find((n) => n.id === negotiationId && n.buyerId === buyerId);
    if (!target) {
      res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: 'Negotiation not found' },
      });
      return;
    }

    if (target.status !== 'ACCEPTED') {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'INVALID_STATUS', message: 'Only accepted negotiations can be converted to an order' },
      });
      return;
    }

    const agreedPrice = target.counterPrice || target.offeredPrice;
    const orderResult = await BuyerOrderService.placeOrder({
      buyerId,
      items: [
        {
          productId: target.productId,
          cropName: target.cropName,
          grade: 'A',
          quantity: target.quantity,
          unit: target.unit,
          pricePerUnit: agreedPrice,
        }
      ],
      deliveryAddress: deliveryAddress || '123 Market Road, Pune',
      targetBuyerType: target.quantity >= 100 ? 'BULK' : 'RETAIL',
    });

    if (!orderResult.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'ORDER_CREATION_FAILED', message: orderResult.error || 'Failed to place order' },
      });
      return;
    }

    target.status = 'ORDERED';
    target.orderId = orderResult.order.id;
    target.updatedAt = new Date().toISOString();

    res.status(201).json({
      data: {
        negotiation: target,
        order: orderResult.order,
      },
      meta: null,
      error: null,
    });
  }
}
