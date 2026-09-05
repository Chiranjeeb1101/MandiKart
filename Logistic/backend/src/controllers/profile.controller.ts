import { Request, Response } from 'express';
import { getSupabaseAdmin } from '@mandikart/shared-core';

export class LogisticProfileController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      res.status(200).json({
        data: {
          id: driverId,
          name: 'Santosh Kumar',
          phone: '+91 9876543211',
          vehicleNumber: 'MH-15-AB-1234',
          vehicleType: 'Tata Ace (Chota Hathi)',
          vehicleCapacityKg: 750,
          status: 'ACTIVE',
        },
        meta: null,
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'PROFILE_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: null, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'PROFILE_ERROR', message: (err as Error).message } });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    const driverId = (req as any).user?.id || 'driver_santosh_01';
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    const updateData = req.body;

    if (isMock) {
      res.status(200).json({
        data: {
          id: driverId,
          ...updateData,
          message: 'Profile updated successfully (Mock)'
        },
        meta: null,
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', driverId)
        .select()
        .single();

      if (error) {
        res.status(500).json({ data: null, meta: null, error: { code: 'PROFILE_UPDATE_ERROR', message: error.message } });
        return;
      }

      res.status(200).json({ data, meta: null, error: null });
    } catch (err) {
      res.status(500).json({ data: null, meta: null, error: { code: 'PROFILE_UPDATE_ERROR', message: (err as Error).message } });
    }
  }
}
