/**
 * MandiKart — UserApp Orders Controller
 */

import { Request, Response } from 'express';
import { BuyerOrderService } from '../services/order.service.js';
import { getSupabaseAdmin, NotificationService, OrderRegistryService } from '@mandikart/shared-core';
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
      deliveryAddress: deliveryAddress || 'Selected Delivery Location',
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

    await NotificationService.sendNotification({
      userId: buyerId,
      role: UserRole.BUYER,
      title: 'Order Confirmed! 📦',
      body: `Your order #${result.order.orderNumber} for ${items.length} produce batch(es) is placed successfully.`,
      type: 'ORDER_UPDATE',
    });

    res.status(201).json({
      data: result.order,
      meta: null,
      error: null,
    });
  }

  static async listOrders(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'b1111111-1111-1111-1111-111111111111';
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    // 1. Retrieve cross-app registered orders
    const regOrders = OrderRegistryService.getRegisteredOrders();
    // Filter out generic initial demo seeds (ORD-9401, ORD-9402, etc) unless specifically placed by this user,
    // or if the user has created real orders (ord_* or MK-ORD-*).
    const realUserOrders = regOrders.filter((r: any) => {
      // If order is specifically associated with this buyer OR placed dynamically (id starts with ord_ or orderNumber starts with MK-ORD-)
      if (r.id?.startsWith('ord_') || r.orderNumber?.startsWith('MK-ORD-')) return true;
      if (r.buyerId === buyerId) return true;
      return false;
    });

    const mappedReg = (realUserOrders.length > 0 ? realUserOrders : regOrders).map((r: any) => ({
      id: r.id,
      orderNumber: r.orderNumber || `#MK-${r.id}`,
      status: r.status || 'PLACED',
      totalAmount: r.totalAmount || r.totalPrice || 1000,
      deliveryOtp: r.deliveryOtp || '719284',
      pickupOtp: r.pickupOtp || '482910',
      items: r.items || [
        { cropName: r.cropName || r.produceName || 'Fresh Produce', grade: 'A', quantity: r.quantityKg || 10, unit: 'kg', pricePerUnit: r.pricePerKg || 30 }
      ],
      deliveryAddress: r.deliveryAddress || 'Pune, Maharashtra',
      driverName: r.driverName || 'Santosh Shinde',
      driverPhone: r.driverPhone || '+91 9844001122',
      createdAt: r.createdAt || r.timestamp || new Date().toISOString(),
    }));

    if (isMock) {
      res.status(200).json({
        data: mappedReg,
        meta: { total: mappedReg.length },
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

      let finalData = mappedReg;
      if (!error && data && data.length > 0) {
        const mappedDb = data.map((d: any) => ({
          id: d.id,
          orderNumber: d.order_number || `#MK-${d.id.slice(0, 5)}`,
          status: d.status || 'PLACED',
          totalAmount: d.total_amount,
          deliveryOtp: d.delivery_otp || '719284',
          pickupOtp: d.pickup_otp || '482910',
          items: d.order_items?.map((it: any) => ({
            cropName: it.crop_name,
            grade: it.grade,
            quantity: it.quantity,
            unit: it.unit || 'kg',
            pricePerUnit: it.price_per_unit,
          })) || [],
          deliveryAddress: d.delivery_address || 'Pune, Maharashtra',
          driverName: d.driver_name || 'Santosh Shinde',
          driverPhone: d.driver_phone || '+91 9844001122',
          createdAt: d.created_at || new Date().toISOString(),
        }));

        const dbIds = new Set(mappedDb.map((d: any) => d.id));
        const nonDuplicateReg = mappedReg.filter((m: any) => !dbIds.has(m.id));
        finalData = [...mappedDb, ...nonDuplicateReg];
      }

      res.status(200).json({
        data: finalData,
        meta: { total: finalData.length },
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
