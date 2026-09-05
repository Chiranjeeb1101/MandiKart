import { Request, Response } from 'express';
import { getSupabaseAdmin } from '@mandikart/shared-core';

// ─── Earnings Config ──────────────────────────────────────────────────────────
const RATE_PER_KM = 15;          // ₹15 per km
const BASE_DELIVERY_FEE = 50;    // ₹50 flat per completed delivery
const CURRENCY = 'INR';

const isMockEnv = () =>
  !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

// ─── Helper: calculate earnings from a list of completed orders ───────────────
const calculateEarnings = (orders: any[]): number => {
  return orders.reduce((total, order) => {
    const distanceKm = order.distance_km || 30; // fallback to 30 km if not stored
    return total + BASE_DELIVERY_FEE + distanceKm * RATE_PER_KM;
  }, 0);
};

export class LogisticEarningsController {
  // ─── GET /earnings ────────────────────────────────────────────────────────
  static async getEarningsSummary(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';

    if (isMockEnv()) {
      const now = new Date();
      res.status(200).json({
        data: {
          driverId,
          currency: CURRENCY,
          ratePerKm: RATE_PER_KM,
          baseDeliveryFee: BASE_DELIVERY_FEE,
          today: { deliveries: 3, earnings: 1350 },
          thisWeek: { deliveries: 14, earnings: 6300 },
          thisMonth: { deliveries: 58, earnings: 24500 },
          pending: { deliveries: 2, earnings: 850 },
          lastUpdated: now.toISOString(),
        },
        meta: { source: 'mock' },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const now = new Date();

      const startOfDay   = new Date(now); startOfDay.setHours(0, 0, 0, 0);
      const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch all completed orders assigned to this driver this month
      const { data: monthOrders, error } = await supabase
        .from('orders')
        .select('id, distance_km, status, completed_at')
        .eq('assigned_driver_id', driverId)
        .eq('status', 'DELIVERED')
        .gte('completed_at', startOfMonth.toISOString());

      if (error) {
        res.status(500).json({
          data: null, meta: null,
          error: { code: 'EARNINGS_ERROR', message: error.message },
        });
        return;
      }

      const orders = monthOrders || [];
      const todayOrders  = orders.filter((o: { completed_at: string }) => new Date(o.completed_at) >= startOfDay);
      const weekOrders   = orders.filter((o: { completed_at: string }) => new Date(o.completed_at) >= startOfWeek);

      // Fetch pending (IN_TRANSIT) orders
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('id, distance_km')
        .eq('assigned_driver_id', driverId)
        .in('status', ['IN_TRANSIT', 'COLLECTED']);

      res.status(200).json({
        data: {
          driverId,
          currency: CURRENCY,
          ratePerKm: RATE_PER_KM,
          baseDeliveryFee: BASE_DELIVERY_FEE,
          today: {
            deliveries: todayOrders.length,
            earnings: calculateEarnings(todayOrders),
          },
          thisWeek: {
            deliveries: weekOrders.length,
            earnings: calculateEarnings(weekOrders),
          },
          thisMonth: {
            deliveries: orders.length,
            earnings: calculateEarnings(orders),
          },
          pending: {
            deliveries: (pendingOrders || []).length,
            earnings: calculateEarnings(pendingOrders || []),
          },
          lastUpdated: now.toISOString(),
        },
        meta: { source: 'database' },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null, meta: null,
        error: { code: 'EARNINGS_ERROR', message: (err as Error).message },
      });
    }
  }

  // ─── GET /earnings/payouts ────────────────────────────────────────────────
  static async getPayoutHistory(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';

    if (isMockEnv()) {
      res.status(200).json({
        data: [
          {
            id: 'pay_001',
            amount: 5400,
            status: 'COMPLETED',
            date: new Date(Date.now() - 86400000 * 3).toISOString(),
            referenceNumber: 'NEFT/MBK/2349012',
            deliveriesCount: 12,
          },
          {
            id: 'pay_002',
            amount: 4200,
            status: 'COMPLETED',
            date: new Date(Date.now() - 86400000 * 10).toISOString(),
            referenceNumber: 'NEFT/MBK/2345099',
            deliveriesCount: 9,
          },
        ],
        meta: { total: 2, currency: CURRENCY },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', driverId)
        .order('date', { ascending: false });

      if (error) {
        res.status(500).json({
          data: null, meta: null,
          error: { code: 'PAYOUTS_ERROR', message: error.message },
        });
        return;
      }

      res.status(200).json({
        data,
        meta: { total: data.length, currency: CURRENCY },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null, meta: null,
        error: { code: 'PAYOUTS_ERROR', message: (err as Error).message },
      });
    }
  }
}

