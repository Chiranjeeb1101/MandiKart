/**
 * MandiKart — UserApp Catalog Controller
 * Allows buyers to browse, search, and filter farm-fresh produce batches.
 */

import { Request, Response } from 'express';
import { getSupabaseAdmin, FastLRUCache } from '@mandikart/shared-core';

const catalogCache = new FastLRUCache<any[]>(1000);

export class CatalogController {
  static async searchCatalog(req: Request, res: Response): Promise<void> {
    const crop = req.query.crop as string;
    const category = req.query.category as string;
    const grade = req.query.grade as string;
    const cacheKey = `cat_${crop || 'all'}_${category || 'all'}_${grade || 'all'}`;

    const cached = catalogCache.get(cacheKey);
    if (cached) {
      res.status(200).json({ data: cached, meta: { total: cached.length, cached: true }, error: null });
      return;
    }

    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      const mockCatalog = [
        {
          id: 'prod_1',
          farmerId: 'farmer_ramesh_01',
          farmerName: 'Ramesh Patil',
          location: 'Nashik, Maharashtra',
          cropName: 'Red Onion',
          cropVariety: 'Garwa',
          grade: 'A',
          category: 'Vegetables',
          availableQuantity: 1400,
          quantityUnit: 'kg',
          basePricePerUnit: 26.5,
          minOrderQuantity: 50,
          targetBuyer: 'BOTH',
          images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
          shelfLifeDays: 30,
        },
        {
          id: 'prod_2',
          farmerId: 'farmer_ramesh_01',
          farmerName: 'Ramesh Patil',
          location: 'Nashik, Maharashtra',
          cropName: 'Tomato',
          cropVariety: 'Vaishali',
          grade: 'A',
          category: 'Vegetables',
          availableQuantity: 550,
          quantityUnit: 'kg',
          basePricePerUnit: 22.0,
          minOrderQuantity: 25,
          targetBuyer: 'BOTH',
          images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'],
          shelfLifeDays: 7,
        },
      ];

      catalogCache.set(cacheKey, mockCatalog, 60);

      res.status(200).json({
        data: mockCatalog,
        meta: { total: mockCatalog.length },
        error: null,
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      let query = supabase
        .from('products')
        .select('*, farmers(full_name, state, district)')
        .eq('is_active', true)
        .gt('available_quantity', 0);

      if (crop) query = query.ilike('crop_name', `%${crop}%`);
      if (category) query = query.eq('category', category);
      if (grade) query = query.eq('grade', grade);

      const { data, error } = await query.limit(50);

      if (error) {
        res.status(500).json({
          data: null,
          meta: null,
          error: { code: 'CATALOG_ERROR', message: error.message },
        });
        return;
      }

      res.status(200).json({
        data,
        meta: { total: data.length },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'CATALOG_ERROR', message: (err as Error).message },
      });
    }
  }
}
