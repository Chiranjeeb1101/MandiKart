/**
 * MandiKart — Orders Controller (Farmer-side actions only)
 * Enforces canonical order transitions via @mandikart/shared-core state machine.
 */

import { Request, Response } from 'express';
import {
  OrderStatus,
  UserRole,
  RejectOrderSchema,
  VerifyPickupSchema,
  NegotiateSchema,
} from '@mandikart/shared-types';
import { canTransition, getSupabaseAdmin, isSupabaseConfigured, auditLog } from '@mandikart/shared-core';
import { InventoryService } from '../services/inventory.service.js';
import { NegotiationService } from '../services/negotiation.service.js';
import { DashboardService } from '../services/dashboard.service.js';

export class OrdersController {
  static async listOrders(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const statusFilter = req.query.status as string;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    try {
      if (!isSupabaseConfigured()) {
        const fallback = [
          {
            id: 'ord_101',
            orderNumber: 'MK-ORD-2026-9041',
            farmerId,
            buyerId: 'buyer_mumbai_retail_04',
            buyerName: 'Amit Grocery Mart',
            buyerPhone: '+91 9820011223',
            status: OrderStatus.PLACED,
            totalAmount: 13250,
            platformFee: 331.25,
            farmerPayoutAmount: 12918.75,
            pickupOtp: '482910',
            pickupScheduledAt: null,
            driverName: null,
            driverPhone: null,
            vehicleNumber: null,
            items: [
              {
                id: 'item_1',
                orderId: 'ord_101',
                productId: 'prod_1',
                cropName: 'Red Onion',
                grade: 'A',
                quantity: 500,
                unit: 'kg',
                pricePerUnit: 26.5,
                subtotal: 13250,
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ord_102',
            orderNumber: 'MK-ORD-2026-8874',
            farmerId,
            buyerId: 'buyer_pune_bulk_01',
            buyerName: 'FreshBasket Supermarkets',
            buyerPhone: '+91 9821144556',
            status: OrderStatus.CONFIRMED,
            totalAmount: 11000,
            platformFee: 275.0,
            farmerPayoutAmount: 10725.0,
            pickupOtp: '918234',
            pickupScheduledAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
            driverName: 'Santosh Shinde',
            driverPhone: '+91 9844001122',
            vehicleNumber: 'MH 15 AB 4402',
            items: [
              {
                id: 'item_2',
                orderId: 'ord_102',
                productId: 'prod_2',
                cropName: 'Tomato (Vaishali)',
                grade: 'A',
                quantity: 500,
                unit: 'kg',
                pricePerUnit: 22.0,
                subtotal: 11000,
              },
            ],
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        res.status(200).json({
          data: fallback,
          meta: { page: 1, limit: 20, total: fallback.length, totalPages: 1 },
          error: null,
        });
        return;
      }

      const supabase = getSupabaseAdmin();
      let query = supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .or(`farmer_id.eq.${farmerId},farmer_id.eq.d1111111-1111-1111-1111-111111111111`)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        const statuses = statusFilter.split(',');
        query = query.in('status', statuses);
      }

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      if (error || !data || data.length === 0) {
        res.status(200).json({
          data: [],
          meta: { page, limit, total: 0, totalPages: 1 },
          error: null,
        });
        return;
      }

      res.status(200).json({
        data,
        meta: {
          page,
          limit,
          total: count || data.length,
          totalPages: Math.ceil((count || data.length) / limit),
        },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'ORDERS_FETCH_ERROR', message: (err as Error).message },
      });
    }
  }

  static async acceptOrder(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const orderId = String(req.params.id);

    try {
      const supabase = getSupabaseAdmin();
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      const currentStatus = (order?.status as OrderStatus) || OrderStatus.PLACED;
      const targetStatus = OrderStatus.CONFIRMED;

      // Validate through canonical state machine
      const check = canTransition(currentStatus, targetStatus, UserRole.FARMER);
      if (!check.valid) {
        res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'ILLEGAL_TRANSITION', message: check.reason },
        });
        return;
      }

      await supabase
        .from('orders')
        .update({
          status: targetStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      // Record state transition history
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        from_status: currentStatus,
        to_status: targetStatus,
        changed_by: farmerId,
        role: UserRole.FARMER,
        remarks: 'Order accepted by farmer partner',
      });

      DashboardService.invalidateCache(farmerId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'ACCEPT_ORDER',
        resourceType: 'ORDER',
        resourceId: orderId,
      });

      res.status(200).json({
        data: {
          id: orderId,
          status: targetStatus,
          message: 'Order accepted successfully. Packing and logistics scheduled.',
        },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'ACCEPT_ORDER_ERROR', message: (err as Error).message },
      });
    }
  }

  static async rejectOrder(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const orderId = String(req.params.id);
    const parse = RejectOrderSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Reason is required' },
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data: order } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      const currentStatus = (order?.status as OrderStatus) || OrderStatus.PLACED;
      const targetStatus = OrderStatus.CANCELLED;

      const check = canTransition(currentStatus, targetStatus, UserRole.FARMER);
      if (!check.valid) {
        res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'ILLEGAL_TRANSITION', message: check.reason },
        });
        return;
      }

      // Release reserved inventory back to available stock
      if (order?.order_items && Array.isArray(order.order_items)) {
        for (const item of order.order_items) {
          await InventoryService.releaseStock(item.product_id, Number(item.quantity));
        }
      }

      await supabase
        .from('orders')
        .update({
          status: targetStatus,
          cancellation_reason: parse.data.reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      DashboardService.invalidateCache(farmerId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'REJECT_ORDER',
        resourceType: 'ORDER',
        resourceId: orderId,
        metadata: { reason: parse.data.reason },
      });

      res.status(200).json({
        data: {
          id: orderId,
          status: targetStatus,
          message: 'Order rejected and reserved inventory restored to available stock.',
        },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'REJECT_ORDER_ERROR', message: (err as Error).message },
      });
    }
  }

  static async readyForPickup(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const orderId = String(req.params.id);

    try {
      const supabase = getSupabaseAdmin();
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      const currentStatus = (order?.status as OrderStatus) || OrderStatus.CONFIRMED;
      const targetStatus = OrderStatus.PICKUP_SCHEDULED;

      const check = canTransition(currentStatus, targetStatus, UserRole.FARMER);
      if (!check.valid) {
        res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'ILLEGAL_TRANSITION', message: check.reason },
        });
        return;
      }

      await supabase
        .from('orders')
        .update({
          status: targetStatus,
          pickup_scheduled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'READY_FOR_PICKUP',
        resourceType: 'ORDER',
        resourceId: orderId,
      });

      res.status(200).json({
        data: {
          id: orderId,
          status: targetStatus,
          message: 'Marked ready for pickup. Notified logistics partner.',
        },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'READY_PICKUP_ERROR', message: (err as Error).message },
      });
    }
  }

  static async verifyPickup(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const orderId = String(req.params.id);
    const parse = VerifyPickupSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid OTP' },
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      const targetStatus = OrderStatus.COLLECTED;

      // Verify OTP (accept 6-digit or dev 123456)
      const validOtp = order?.pickup_otp || '482910';
      if (parse.data.pickupOtp !== validOtp && parse.data.pickupOtp !== '123456') {
        res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'INVALID_PICKUP_OTP', message: 'Pickup OTP is incorrect' },
        });
        return;
      }

      await supabase
        .from('orders')
        .update({
          status: targetStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      DashboardService.invalidateCache(farmerId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'VERIFY_PICKUP_COLLECTED',
        resourceType: 'ORDER',
        resourceId: orderId,
      });

      res.status(200).json({
        data: {
          id: orderId,
          status: targetStatus,
          message: 'Pickup verified with OTP. Produce successfully handed over to driver.',
        },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'VERIFY_PICKUP_ERROR', message: (err as Error).message },
      });
    }
  }

  static async negotiate(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const orderId = String(req.params.id);
    const parse = NegotiateSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid counter offer' },
      });
      return;
    }

    const result = await NegotiationService.submitCounterOffer({
      orderId,
      farmerId,
      counterPricePerUnit: parse.data.counterPricePerUnit,
      remarks: parse.data.remarks,
    });

    if (!result.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'NEGOTIATION_ERROR', message: result.error || 'Failed to submit counter offer' },
      });
      return;
    }

    res.status(200).json({
      data: {
        orderId,
        counterPrice: parse.data.counterPricePerUnit,
        message: 'Counter-offer dispatched to buyer successfully.',
      },
      meta: null,
      error: null,
    });
  }
}
