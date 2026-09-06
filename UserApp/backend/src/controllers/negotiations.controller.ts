/**
 * MandiKart — UserApp Negotiations Controller
 * Handles buyer price offers, negotiation tracking, and responses to farmer counter-offers.
 */

import { Request, Response } from 'express';
import { UserRole, OrderStatus } from '@mandikart/shared-types';
import { auditLog, getSupabaseAdmin, NegotiationRegistryService } from '@mandikart/shared-core';
import { BuyerOrderService } from '../services/order.service.js';

export class BuyerNegotiationsController {
  static async listNegotiations(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const regList = NegotiationRegistryService.getRegisteredNegotiations();
    const items = regList.filter((n) => !buyerId || n.buyerId === buyerId || buyerId.includes('buyer'));
    res.status(200).json({
      data: items,
      meta: { total: items.length },
      error: null,
    });
  }

  static async submitOffer(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const { productId, cropName, farmerId, farmerName, buyerName, originalPrice, offeredPrice, quantity, unit, remarks } = req.body;

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
      farmerId: farmerId || 'd1111111-1111-1111-1111-111111111111',
      farmerName: farmerName || 'Ramesh Patel',
      buyerId,
      buyerName: buyerName || 'MandiKart Buyer',
      originalPrice: Number(originalPrice) || Number(offeredPrice) * 1.1,
      offeredPrice: Number(offeredPrice),
      counterPrice: null,
      quantity: Number(quantity),
      unit: unit || 'kg',
      status: 'PENDING_FARMER' as const,
      remarks: remarks || null,
      history: [
        {
          id: `msg_${Date.now()}`,
          sender: 'BUYER' as const,
          senderName: buyerName || 'MandiKart Buyer',
          price: Number(offeredPrice),
          pricePerKg: Number(offeredPrice),
          quantityKg: Number(quantity),
          text: remarks || `Offer of ₹${offeredPrice}/${unit || 'kg'} submitted for ${quantity} ${unit || 'kg'}.`,
          message: remarks || `Offer of ₹${offeredPrice}/${unit || 'kg'} submitted for ${quantity} ${unit || 'kg'}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    NegotiationRegistryService.registerNegotiation(newNeg as any);

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

    const target = NegotiationRegistryService.getNegotiationById(negotiationId);
    if (!target) {
      res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: 'Negotiation not found' },
      });
      return;
    }

    const history = target.history || [];
    let newStatus = target.status;
    let newOfferedPrice = target.offeredPrice;

    if (action === 'ACCEPT') {
      newStatus = 'ACCEPTED';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'BUYER',
        senderName: 'MandiKart Buyer',
        price: target.counterPrice || target.offeredPrice,
        pricePerKg: target.counterPrice || target.offeredPrice,
        text: remarks || 'Buyer accepted the negotiation offer.',
        message: remarks || 'Buyer accepted the negotiation offer.',
        timestamp: new Date().toISOString(),
      });
    } else if (action === 'REJECT') {
      newStatus = 'REJECTED';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'BUYER',
        senderName: 'MandiKart Buyer',
        text: remarks || 'Buyer declined the counter-offer.',
        message: remarks || 'Buyer declined the counter-offer.',
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
      newOfferedPrice = Number(counterPrice);
      newStatus = 'PENDING_FARMER';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'BUYER',
        senderName: 'MandiKart Buyer',
        price: Number(counterPrice),
        pricePerKg: Number(counterPrice),
        text: remarks || `Counter offer of ₹${counterPrice}/kg proposed by buyer.`,
        message: remarks || `Counter offer of ₹${counterPrice}/kg proposed by buyer.`,
        timestamp: new Date().toISOString(),
      });
    }

    const updated = NegotiationRegistryService.updateNegotiation(negotiationId, {
      status: newStatus as any,
      offeredPrice: newOfferedPrice,
      history,
      updatedAt: new Date().toISOString(),
    });

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: `NEGOTIATION_${action}`,
      resourceType: 'PRODUCT',
      resourceId: negotiationId,
      metadata: { action, counterPrice },
    });

    res.status(200).json({
      data: updated || target,
      meta: null,
      error: null,
    });
  }

  static async convertToOrder(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const negotiationId = String(req.params.id);
    const { deliveryAddress } = req.body;

    const target = NegotiationRegistryService.getNegotiationById(negotiationId);
    if (!target) {
      res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: 'Negotiation not found' },
      });
      return;
    }

    const agreedPrice = target.counterPrice || target.offeredPrice;
    const orderResult = await BuyerOrderService.placeOrder({
      buyerId: target.buyerId || buyerId,
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

    const updated = NegotiationRegistryService.updateNegotiation(negotiationId, {
      status: 'ACCEPTED',
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      data: {
        negotiation: updated || target,
        order: orderResult.order,
      },
      meta: null,
      error: null,
    });
  }
}
