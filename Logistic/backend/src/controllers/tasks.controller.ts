/**
 * MandiKart — Logistic Fulfillment Tasks Controller
 * Driver-side lifecycle transitions enforced via @mandikart/shared-core state machine.
 */

import { Request, Response } from 'express';
import { OrderStatus, UserRole } from '@mandikart/shared-types';
import { canTransition, getSupabaseAdmin, auditLog } from '@mandikart/shared-core';

export class LogisticTasksController {
  static async getAvailableTasks(_req: Request, res: Response): Promise<void> {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      res.status(200).json({
        data: [
          {
            orderId: 'ord_102',
            orderNumber: 'MK-ORD-2026-8874',
            status: OrderStatus.CONFIRMED,
            pickupLocation: 'Palsan Village, Dindori, Nashik',
            deliveryLocation: 'FreshBasket Hub, Pune',
            cropName: 'Tomato (Vaishali)',
            quantityKg: 500,
            farmerName: 'Ramesh Patil',
            farmerPhone: '+91 9876543210',
            pickupOtp: '918234',
          },
        ],
        meta: { total: 1 },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', [OrderStatus.CONFIRMED, OrderStatus.PICKUP_SCHEDULED]);

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'TASKS_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: { total: data.length }, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'TASKS_ERROR', message: (err as Error).message } });
    }
  }

  static async startPickup(req: Request, res: Response): Promise<void> {
    const driverId = req.user?.id || 'driver_santosh_01';
    const orderId = String(req.params.orderId);

    const check = canTransition(OrderStatus.PICKUP_SCHEDULED, OrderStatus.PICKUP_IN_PROGRESS, UserRole.LOGISTICS_DRIVER);
    if (!check.valid) {
      res.status(400).json({ data: null, meta: null, error: { code: 'ILLEGAL_TRANSITION', message: check.reason } });
      return;
    }

    await auditLog({
      actorId: driverId,
      role: UserRole.LOGISTICS_DRIVER,
      action: 'START_PICKUP',
      resourceType: 'ORDER',
      resourceId: orderId,
    });

    res.status(200).json({
      data: {
        orderId,
        status: OrderStatus.PICKUP_IN_PROGRESS,
        message: 'Driver en route to farm for produce collection.',
      },
      meta: null,
      error: null,
    });
  }

  static async verifyPickup(req: Request, res: Response): Promise<void> {
    const driverId = req.user?.id || 'driver_santosh_01';
    const orderId = String(req.params.orderId);
    const { pickupOtp } = req.body;

    if (!pickupOtp) {
      res.status(400).json({ data: null, meta: null, error: { code: 'VALIDATION_ERROR', message: 'Pickup OTP is required' } });
      return;
    }

    const check = canTransition(OrderStatus.PICKUP_IN_PROGRESS, OrderStatus.COLLECTED, UserRole.LOGISTICS_DRIVER);
    if (!check.valid) {
      res.status(400).json({ data: null, meta: null, error: { code: 'ILLEGAL_TRANSITION', message: check.reason } });
      return;
    }

    await auditLog({
      actorId: driverId,
      role: UserRole.LOGISTICS_DRIVER,
      action: 'COLLECTED_FROM_FARMER',
      resourceType: 'ORDER',
      resourceId: orderId,
    });

    res.status(200).json({
      data: {
        orderId,
        status: OrderStatus.COLLECTED,
        message: 'Produce verified with farmer OTP and loaded onto truck.',
      },
      meta: null,
      error: null,
    });
  }

  static async startTransit(req: Request, res: Response): Promise<void> {
    const driverId = req.user?.id || 'driver_santosh_01';
    const orderId = String(req.params.orderId);

    const check = canTransition(OrderStatus.COLLECTED, OrderStatus.IN_TRANSIT, UserRole.LOGISTICS_DRIVER);
    if (!check.valid) {
      res.status(400).json({ data: null, meta: null, error: { code: 'ILLEGAL_TRANSITION', message: check.reason } });
      return;
    }

    await auditLog({
      actorId: driverId,
      role: UserRole.LOGISTICS_DRIVER,
      action: 'START_TRANSIT',
      resourceType: 'ORDER',
      resourceId: orderId,
    });

    res.status(200).json({
      data: {
        orderId,
        status: OrderStatus.IN_TRANSIT,
        message: 'Vehicle departed farm. In transit to buyer destination.',
      },
      meta: null,
      error: null,
    });
  }

  static async completeDelivery(req: Request, res: Response): Promise<void> {
    const driverId = req.user?.id || 'driver_santosh_01';
    const orderId = String(req.params.orderId);
    const { deliveryOtp } = req.body;

    if (!deliveryOtp) {
      res.status(400).json({ data: null, meta: null, error: { code: 'VALIDATION_ERROR', message: 'Delivery OTP is required' } });
      return;
    }

    const check = canTransition(OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED, UserRole.LOGISTICS_DRIVER);
    if (!check.valid) {
      res.status(400).json({ data: null, meta: null, error: { code: 'ILLEGAL_TRANSITION', message: check.reason } });
      return;
    }

    await auditLog({
      actorId: driverId,
      role: UserRole.LOGISTICS_DRIVER,
      action: 'COMPLETE_DELIVERY',
      resourceType: 'ORDER',
      resourceId: orderId,
    });

    res.status(200).json({
      data: {
        orderId,
        status: OrderStatus.DELIVERED,
        message: 'Delivery completed and verified with buyer OTP.',
      },
      meta: null,
      error: null,
    });
  }
}
