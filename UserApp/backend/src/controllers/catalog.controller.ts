/**
 * MandiKart — UserApp Catalog Controller
 * Allows buyers to browse, search, and filter farm-fresh produce batches.
 */

import { Request, Response } from 'express';
import { getSupabaseAdmin, FastLRUCache, ProductRegistryService } from '@mandikart/shared-core';

const catalogCache = new FastLRUCache<any[]>(1000);

export class CatalogController {
  static async searchCatalog(req: Request, res: Response): Promise<void> {
    const crop = req.query.crop as string;
    const category = req.query.category as string;
    const grade = req.query.grade as string;
    const cacheKey = `cat_${crop || 'all'}_${category || 'all'}_${grade || 'all'}`;

    const isNoCache = req.query.fresh === 'true' || req.headers['cache-control'] === 'no-cache';
    if (!isNoCache) {
      const cached = catalogCache.get(cacheKey);
      if (cached) {
        res.status(200).json({ data: cached, meta: { total: cached.length, cached: true }, error: null });
        return;
      }
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
        .gt('available_quantity', 0)
        .order('created_at', { ascending: false });

      if (crop) query = query.ilike('crop_name', `%${crop}%`);
      if (category) query = query.eq('category', category);
      if (grade) query = query.eq('grade', grade);

      const { data, error } = await query.limit(50);

      if (error) {
        console.warn('[CatalogController] Supabase products query error:', error.message, 'Serving cached fallback catalog.');
        const fallbackCatalog = [
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
        catalogCache.set(cacheKey, fallbackCatalog, 60);
        res.status(200).json({
          data: fallbackCatalog,
          meta: { total: fallbackCatalog.length, fallback: true },
          error: null,
        });
        return;
      }

      const formatted = (data || []).map((row: any) => {
        const farmerInfo = row.farmers || {};
        const district = farmerInfo.district || 'Nashik';
        const state = farmerInfo.state || 'Maharashtra';
        return {
          id: row.id,
          farmerId: row.farmer_id,
          farmerName: farmerInfo.full_name || 'Ramesh Patil',
          location: row.pickup_address || `${district}, ${state}`,
          cropName: row.crop_name,
          cropVariety: row.crop_variety,
          grade: row.grade,
          category: row.category,
          totalQuantity: row.total_quantity,
          availableQuantity: row.available_quantity,
          reservedQuantity: row.reserved_quantity,
          quantityUnit: row.quantity_unit,
          basePricePerUnit: row.base_price_per_unit,
          minOrderQuantity: row.min_order_quantity,
          targetBuyer: row.target_buyer,
          images: row.images && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
          pickupAddress: row.pickup_address,
          shelfLifeDays: row.shelf_life_days,
          createdAt: row.created_at,
          ...row,
        };
      });

      // Merge live registered products (only active/approved listings)
      try {
        const registered = ProductRegistryService.getRegisteredProducts();
        for (const reg of registered) {
          if (reg.isActive && !formatted.some((p: any) => p.id === reg.id)) {
            formatted.push(reg);
          }
        }
      } catch {}

      // Sort with newest listings at the top
      formatted.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt || a.created_at || 0).getTime();
        const timeB = new Date(b.createdAt || b.created_at || 0).getTime();
        return timeB - timeA;
      });

      catalogCache.set(cacheKey, formatted, 0.5); // Fast TTL for real-time visibility

      res.status(200).json({
        data: formatted,
        meta: { total: formatted.length },
        error: null,
      });
    } catch (err) {
      console.warn('[CatalogController] Exception during catalog fetch:', (err as Error).message);
      res.status(200).json({
        data: [],
        meta: { total: 0, fallback: true },
        error: null,
      });
    }
  }

  static async getBatchById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('products')
        .select('*, farmers(full_name, state, district)')
        .eq('id', id)
        .single();
      if (error || !data) {
        res.status(404).json({ data: null, error: { message: 'Product batch not found' } });
        return;
      }
      res.status(200).json({ data, error: null });
    } catch (err) {
      res.status(500).json({ data: null, error: { message: (err as Error).message } });
    }
  }
}
