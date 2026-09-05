import { Request, Response } from 'express';
import { getSupabaseAdmin } from '@mandikart/shared-core';
import { SocketService } from '../services/socket.service.js';

// In-memory cache for ultra-fast location reads
const locationCache = new Map<string, {
  lat: number;
  lng: number;
  speed: number;
  heading?: number;
  orderId?: string;
  timestamp: string;
}>();

const isMockEnv = () =>
  !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

export class LogisticLocationController {
  // ─── POST /location/update ─────────────────────────────────────────────────
  static async updateLocation(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';
    // Body already validated by Zod middleware
    const { lat, lng, speed = 0, heading, orderId } = req.body;

    const locationData = {
      lat,
      lng,
      speed,
      heading,
      orderId,
      timestamp: new Date().toISOString(),
    };

    // 1. Update in-memory cache (always — fast read path)
    locationCache.set(driverId, locationData);

    // 2. Broadcast live location via Socket.io to all tracking subscribers
    SocketService.emitLocationUpdate({
      driverId,
      orderId,
      lat,
      lng,
      speed,
      heading,
      timestamp: locationData.timestamp,
    });

    // 3. Persist to Supabase location_history (fire and forget)
    if (!isMockEnv()) {
      try {
        const supabase = getSupabaseAdmin();
        supabase
          .from('location_history')
          .insert({
            user_id: driverId,
            lat,
            lng,
            speed,
            heading: heading ?? null,
            order_id: orderId ?? null,
            recorded_at: locationData.timestamp,
          })
          .then(({ error }: any) => {
            if (error) console.error(`[Location] DB insert failed for ${driverId}:`, error.message);
          });
      } catch (e) {
        console.error('[Location] Supabase error:', e);
      }
    }

    res.status(200).json({
      data: { success: true, driverId, timestamp: locationData.timestamp },
      meta: null,
      error: null,
    });
  }

  // ─── GET /location/:driverId ───────────────────────────────────────────────
  static async getLocation(req: Request, res: Response): Promise<void> {
    const driverId = String(req.params.driverId);

    // Check fast in-memory cache first
    const cached = locationCache.get(driverId);
    if (cached) {
      res.status(200).json({
        data: { driverId, ...cached },
        meta: { source: 'cache' },
        error: null,
      });
      return;
    }

    if (isMockEnv()) {
      res.status(200).json({
        data: {
          driverId,
          lat: 20.2961,
          lng: 85.8245,
          speed: 40,
          heading: 180,
          timestamp: new Date().toISOString(),
        },
        meta: { source: 'mock' },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('location_history')
        .select('*')
        .eq('user_id', driverId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        res.status(404).json({
          data: null,
          meta: null,
          error: { code: 'LOCATION_NOT_FOUND', message: 'No location data found for this driver' },
        });
        return;
      }

      res.status(200).json({ data, meta: { source: 'database' }, error: null });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'LOCATION_ERROR', message: (err as Error).message },
      });
    }
  }
}

