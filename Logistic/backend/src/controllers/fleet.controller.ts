import { Request, Response } from 'express';
import { getSupabaseAdmin } from '@mandikart/shared-core';

export class LogisticFleetController {
  static async registerVehicle(req: Request, res: Response): Promise<void> {
    const { vehicleNumber, type, capacityKg, driverId } = req.body;
    
    if (!vehicleNumber || !type || !capacityKg) {
      res.status(400).json({ data: null, meta: null, error: { code: 'VALIDATION_ERROR', message: 'Vehicle number, type, and capacity are required' } });
      return;
    }

    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      res.status(200).json({
        data: {
          id: 'veh_' + Math.floor(Math.random() * 1000),
          vehicleNumber,
          type,
          capacityKg,
          driverId: driverId || null,
          status: 'ACTIVE'
        },
        meta: null,
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          vehicle_number: vehicleNumber,
          type,
          capacity_kg: capacityKg,
          driver_id: driverId || null,
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'FLEET_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: null, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'FLEET_ERROR', message: (err as Error).message } });
    }
  }

  static async getFleetStatus(req: Request, res: Response): Promise<void> {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      res.status(200).json({
        data: [
          { id: 'veh_01', vehicleNumber: 'MH-15-AB-1234', type: 'Tata Ace', capacityKg: 750, status: 'IN_TRANSIT', driverId: 'driver_santosh_01' },
          { id: 'veh_02', vehicleNumber: 'MH-12-CD-5678', type: 'Tata 407', capacityKg: 2000, status: 'AVAILABLE', driverId: 'driver_ramesh_02' }
        ],
        meta: { total: 2 },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('vehicles').select('*');

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'FLEET_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: { total: data.length }, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'FLEET_ERROR', message: (err as Error).message } });
    }
  }
}
