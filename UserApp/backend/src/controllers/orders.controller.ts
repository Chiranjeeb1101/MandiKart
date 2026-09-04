/**
 * MandiKart — UserApp Orders Controller
 */

import { Request, Response } from 'express';
import { BuyerOrderService } from '../services/order.service.js';
import { getSupabaseAdmin, NotificationService } from '@mandikart/shared-core';
import { UserRole } from '@mandikart/shared-types';

export class BuyerOrdersController {
  static async placeOrder(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const { items, deliveryAddress, targetBuyerType } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'At least one item is required' },
      });
      return;
    }

    const result = await BuyerOrderService.placeOrder({
      buyerId,
      items,
      deliveryAddress: deliveryAddress || '123 Market Road, Mumbai',
      targetBuyerType,
    });

    if (!result.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'ORDER_CREATION_FAILED', message: result.error || 'Failed to place order' },
      });
      return;
    }

    // 1. Notify Buyer with in-app + phone push popup
    NotificationService.sendNotification({
      userId: buyerId,
      role: UserRole.BUYER,
      title: 'Order Placed! 🛒',
      body: `Your order #${result.order.orderNumber} for ₹${result.order.totalAmount} has been placed successfully.`,
      type: 'ORDER_UPDATE',
      metadata: { orderId: result.order.id, orderNumber: result.order.orderNumber },
      sendPush: true,
    }).catch((e) => console.error('Buyer notification error:', e));

    // 2. Notify Farmer with in-app + phone push popup
    NotificationService.sendNotification({
      userId: result.order.farmerId || 'farmer_ramesh_01',
      role: UserRole.FARMER,
      title: 'New Order Received! 🌾',
      body: `New order #${result.order.orderNumber} placed by buyer. Review and accept lot.`,
      type: 'ORDER_UPDATE',
      metadata: { orderId: result.order.id, orderNumber: result.order.orderNumber },
      sendPush: true,
    }).catch((e) => console.error('Farmer notification error:', e));

    res.status(201).json({
      data: result.order,
      meta: null,
      error: null,
    });
  }

  static async listOrders(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'b1111111-1111-1111-1111-111111111111';
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      res.status(200).json({
        data: [
          {
            id: 'ord_101',
            orderNumber: 'MK-ORD-2026-9041',
            status: 'CONFIRMED',
            totalAmount: 13250,
            deliveryOtp: '719284',
            items: [
              { cropName: 'Red Onion', grade: 'A', quantity: 500, unit: 'kg', pricePerUnit: 26.5 },
            ],
            driverName: 'Santosh Shinde',
            driverPhone: '+91 9844001122',
            createdAt: new Date().toISOString(),
          },
        ],
        meta: { total: 1 },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      let { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`buyer_id.eq.${buyerId},buyer_id.eq.b1111111-1111-1111-1111-111111111111`)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({
          data: null,
          meta: null,
          error: { code: 'ORDERS_FETCH_ERROR', message: error.message },
        });
        return;
      }

      res.status(200).json({
        data: data || [],
        meta: { total: (data || []).length },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'ORDERS_ERROR', message: (err as Error).message },
      });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    const orderId = String(req.params.id);
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .maybeSingle();

      if (error || !data) {
        res.status(404).json({
          data: null,
          meta: null,
          error: { code: 'ORDER_NOT_FOUND', message: error?.message || 'Order not found' },
        });
        return;
      }

      res.status(200).json({
        data,
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'ORDER_FETCH_ERROR', message: (err as Error).message },
      });
    }
  }

  static async confirmDelivery(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const orderId = String(req.params.id);
    const { deliveryOtp } = req.body;

    if (!deliveryOtp) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'Delivery OTP is required' },
      });
      return;
    }

    const result = await BuyerOrderService.confirmDelivery(orderId, buyerId, deliveryOtp);

    if (!result.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'DELIVERY_CONFIRM_FAILED', message: result.error || 'Failed to confirm delivery' },
      });
      return;
    }

    res.status(200).json({
      data: { orderId, status: 'DELIVERED', message: result.message },
      meta: null,
      error: null,
    });
  }

  static async raiseDispute(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const orderId = String(req.params.id);
    const { reason, category, evidenceNotes } = req.body;

    if (!reason) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'Dispute reason is required' },
      });
      return;
    }

    const result = await BuyerOrderService.raiseDispute(orderId, buyerId, reason, category, evidenceNotes);

    if (!result.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'DISPUTE_FAILED', message: result.error || 'Failed to raise dispute' },
      });
      return;
    }

    res.status(200).json({
      data: {
        orderId,
        status: 'DISPUTED',
        disputeId: result.disputeId,
        message: 'Dispute registered. Escrow settlement frozen pending quality review.',
      },
      meta: null,
      error: null,
    });
  }
}
