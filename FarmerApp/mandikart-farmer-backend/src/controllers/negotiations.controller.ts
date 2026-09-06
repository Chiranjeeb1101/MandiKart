/**
 * MandiKart — Farmer App Negotiations Controller
 * Handles farmer viewing and responding to buyer price negotiations.
 */

import { Request, Response } from 'express';
import { NegotiationRegistryService, OrderRegistryService, auditLog } from '@mandikart/shared-core';
import { UserRole, OrderStatus } from '@mandikart/shared-types';

export class FarmerNegotiationsController {
  static async listNegotiations(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'd1111111-1111-1111-1111-111111111111';
    const list = NegotiationRegistryService.getRegisteredNegotiations();
    const filtered = list.filter((n) => !n.farmerId || n.farmerId === farmerId || n.farmerId === 'farmer_ramesh_01' || farmerId.includes('d1111111'));
    res.status(200).json({
      data: filtered,
      meta: { total: filtered.length },
      error: null,
    });
  }

  static async respondToNegotiation(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'd1111111-1111-1111-1111-111111111111';
    const id = String(req.params.id);
    const { action, counterPrice, counterQty, message, rejectionReason } = req.body;

    const target = NegotiationRegistryService.getNegotiationById(id);
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
    let finalPrice = target.counterPrice || target.offeredPrice;
    let finalQty = target.quantity;

    if (action === 'ACCEPT') {
      newStatus = 'ACCEPTED';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'FARMER',
        senderName: 'Farmer (You)',
        price: finalPrice,
        pricePerKg: finalPrice,
        quantityKg: finalQty,
        text: message || `Offer of ₹${finalPrice}/${target.unit || 'kg'} accepted! Order generated.`,
        message: message || `Offer of ₹${finalPrice}/${target.unit || 'kg'} accepted! Order generated.`,
        timestamp: new Date().toISOString(),
      });

      // Automatically generate real order in OrderRegistryService
      const totalAmount = finalPrice * finalQty;
      const orderNumber = `MK-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const orderId = `ord_neg_${Date.now()}`;

      OrderRegistryService.registerOrder({
        id: orderId,
        orderNumber,
        farmerId: target.farmerId || 'd1111111-1111-1111-1111-111111111111',
        farmerName: target.farmerName || 'Ramesh Patel',
        farmerPhone: '+91 98220 11111',
        farmerLocation: 'Nashik, Maharashtra',
        buyerId: target.buyerId || 'buyer_default_01',
        buyerName: target.buyerName || 'MandiKart Buyer',
        buyerPhone: target.buyerPhone || '+91 98765 43210',
        cropName: target.cropName,
        produceName: target.cropName,
        category: 'Vegetables',
        qualityGrade: 'GRADE_A',
        quantityKg: finalQty,
        pricePerKg: finalPrice,
        totalAmount,
        totalPrice: totalAmount,
        status: OrderStatus.CONFIRMED,
        escrowStatus: 'HELD_IN_ESCROW',
        deliveryAddress: 'Selected Delivery Location',
        pickupOtp,
        deliveryOtp,
        imageUrl: target.history?.[0]?.text ? '' : undefined,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        items: [
          {
            id: `item_${orderId}_0`,
            productId: target.productId,
            cropName: target.cropName,
            grade: 'A',
            quantity: finalQty,
            unit: target.unit || 'kg',
            pricePerUnit: finalPrice,
            subtotal: totalAmount,
          },
        ],
      });
    } else if (action === 'REJECT' || action === 'DECLINE') {
      newStatus = 'REJECTED';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'FARMER',
        senderName: 'Farmer (You)',
        text: rejectionReason || message || 'Offer declined by farmer.',
        message: rejectionReason || message || 'Offer declined by farmer.',
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
      finalPrice = Number(counterPrice);
      if (counterQty) finalQty = Number(counterQty);
      newStatus = 'COUNTER_OFFERED';
      history.push({
        id: `msg_${Date.now()}`,
        sender: 'FARMER',
        senderName: 'Farmer (You)',
        price: finalPrice,
        pricePerKg: finalPrice,
        quantityKg: finalQty,
        text: message || `Counter offer: ₹${finalPrice}/${target.unit || 'kg'} for ${finalQty} ${target.unit || 'kg'}.`,
        message: message || `Counter offer: ₹${finalPrice}/${target.unit || 'kg'} for ${finalQty} ${target.unit || 'kg'}.`,
        timestamp: new Date().toISOString(),
      });
    }

    const updated = NegotiationRegistryService.updateNegotiation(id, {
      status: newStatus as any,
      counterPrice: finalPrice,
      quantity: finalQty,
      history,
      remarks: message || target.remarks,
      updatedAt: new Date().toISOString(),
    });

    await auditLog({
      actorId: farmerId,
      role: UserRole.FARMER,
      action: `FARMER_NEGOTIATION_${action}`,
      resourceType: 'PRODUCT',
      resourceId: id,
      metadata: { action, counterPrice: finalPrice },
    });

    res.status(200).json({
      data: updated || target,
      meta: null,
      error: null,
    });
  }
}
