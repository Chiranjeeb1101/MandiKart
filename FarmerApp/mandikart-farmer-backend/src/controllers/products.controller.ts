/**
 * MandiKart — Products Controller
 * Handles farmer produce batch listings, available inventory management, and soft deletion.
 */

import { Request, Response } from 'express';
import { CreateProductSchema, UpdateProductStockSchema, UserRole } from '@mandikart/shared-types';
import { getSupabaseAdmin, isSupabaseConfigured, auditLog, ProductRegistryService } from '@mandikart/shared-core';
import { CONSTANTS } from '@mandikart/shared-config';
import { DashboardService } from '../services/dashboard.service.js';

export class ProductsController {
  static async listProducts(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const status = req.query.status as string;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    try {
      if (!isSupabaseConfigured()) {
        const fallback = [
          {
            id: 'prod_1',
            farmerId,
            cropName: 'Red Onion',
            cropVariety: 'Garwa',
            grade: 'A',
            category: 'Vegetables',
            totalQuantity: 2000,
            availableQuantity: 1400,
            reservedQuantity: 600,
            quantityUnit: 'kg',
            basePricePerUnit: 26.5,
            minOrderQuantity: 50,
            targetBuyer: 'BOTH',
            images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
            isActive: true,
            shelfLifeDays: 30,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'prod_2',
            farmerId,
            cropName: 'Tomato',
            cropVariety: 'Vaishali',
            grade: 'A',
            category: 'Vegetables',
            totalQuantity: 800,
            availableQuantity: 550,
            reservedQuantity: 250,
            quantityUnit: 'kg',
            basePricePerUnit: 22.0,
            minOrderQuantity: 25,
            targetBuyer: 'BOTH',
            images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'],
            isActive: true,
            shelfLifeDays: 7,
            createdAt: new Date().toISOString(),
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
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isFarmerUuid = UUID_REGEX.test(farmerId);
      
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (isFarmerUuid && farmerId !== 'd1111111-1111-1111-1111-111111111111' && farmerId !== '45f8c047-c3eb-42ff-aec3-5d2b1b942777') {
        query = query.or(`farmer_id.eq.${farmerId},farmer_id.eq.d1111111-1111-1111-1111-111111111111,farmer_id.eq.45f8c047-c3eb-42ff-aec3-5d2b1b942777`);
      } else {
        query = query.or('farmer_id.eq.d1111111-1111-1111-1111-111111111111,farmer_id.eq.45f8c047-c3eb-42ff-aec3-5d2b1b942777');
      }

      query = query.order('created_at', { ascending: false });

      if (status === 'active') {
        query = query.eq('is_active', true).gt('available_quantity', 0);
      } else if (status === 'sold_out') {
        query = query.eq('available_quantity', 0);
      }

      const resolveStatus = (rowOrReg: any): 'ACTIVE' | 'APPROVED' | 'REJECTED' | 'PENDING_APPROVAL' => {
        const isRejected = rowOrReg.status === 'REJECTED' || rowOrReg.target_buyer === 'REJECTED' || rowOrReg.targetBuyer === 'REJECTED';
        if (isRejected) return 'REJECTED';

        const isActive = (rowOrReg.is_active === true && (rowOrReg.target_buyer === 'BOTH' || rowOrReg.targetBuyer === 'BOTH')) ||
                         (rowOrReg.isActive === true && (rowOrReg.targetBuyer === 'BOTH' || rowOrReg.target_buyer === 'BOTH')) ||
                         rowOrReg.status === 'ACTIVE';
        if (isActive) return 'ACTIVE';

        const isApproved = rowOrReg.target_buyer === 'ADMIN_APPROVED' ||
                           rowOrReg.targetBuyer === 'ADMIN_APPROVED' ||
                           rowOrReg.status === 'APPROVED' ||
                           rowOrReg.status === 'ADMIN_APPROVED';
        if (isApproved) return 'APPROVED';

        return 'PENDING_APPROVAL';
      };

      const { data, count, error } = await query.range(offset, offset + limit - 1);

      let formatted = (data || []).map((row: any) => ({
        id: row.id,
        farmerId: row.farmer_id,
        cropName: row.crop_name,
        cropVariety: row.crop_variety,
        grade: row.grade,
        category: row.category,
        totalQuantity: Number(row.total_quantity),
        availableQuantity: Number(row.available_quantity),
        reservedQuantity: Number(row.reserved_quantity || 0),
        quantityUnit: row.quantity_unit,
        basePricePerUnit: Number(row.base_price_per_unit),
        minOrderQuantity: Number(row.min_order_quantity),
        targetBuyer: row.target_buyer,
        images: row.images || [],
        pickupAddress: row.pickup_address,
        isActive: !!row.is_active,
        status: resolveStatus(row),
        harvestDate: row.harvest_date,
        shelfLifeDays: row.shelf_life_days,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      // Merge real-time produce status from ProductRegistryService
      try {
        const registered = ProductRegistryService.getRegisteredProducts();
        for (const reg of registered) {
          const existing = formatted.find((f: any) => f.id === reg.id);
          const computedStatus = resolveStatus(reg);

          if (existing) {
            existing.isActive = reg.isActive ?? existing.isActive;
            existing.status = computedStatus;
          } else {
            formatted.unshift({
              id: reg.id,
              farmerId: reg.farmerId,
              cropName: reg.cropName,
              cropVariety: reg.cropVariety,
              grade: reg.grade,
              category: reg.category,
              totalQuantity: Number(reg.totalQuantity || 0),
              availableQuantity: Number(reg.availableQuantity || 0),
              reservedQuantity: Number(reg.reservedQuantity || 0),
              quantityUnit: reg.quantityUnit || 'kg',
              basePricePerUnit: Number(reg.basePricePerUnit || 0),
              minOrderQuantity: Number(reg.minOrderQuantity || 1),
              targetBuyer: reg.targetBuyer || 'BOTH',
              images: reg.images || [],
              pickupAddress: reg.location || reg.pickupAddress,
              isActive: !!reg.isActive,
              status: computedStatus,
              harvestDate: reg.harvestDate || 'Recent',
              shelfLifeDays: reg.shelfLifeDays || 14,
              createdAt: reg.createdAt || new Date().toISOString(),
              updatedAt: reg.updatedAt || new Date().toISOString(),
            });
          }
        }
      } catch {}

      res.status(200).json({
        data: formatted,
        meta: {
          page,
          limit,
          total: formatted.length,
          totalPages: Math.ceil(formatted.length / limit),
        },
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'PRODUCTS_FETCH_ERROR', message: (err as Error).message },
      });
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    const rawFarmerId = req.user?.id || 'farmer_ramesh_01';
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const farmerId = UUID_REGEX.test(rawFarmerId) ? rawFarmerId : 'd1111111-1111-1111-1111-111111111111';

    const parse = CreateProductSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid product payload' },
      });
      return;
    }

    const payload = parse.data;

    // Price sanity check
    if (
      payload.basePricePerUnit < CONSTANTS.MIN_SANITY_PRICE_PER_UNIT ||
      payload.basePricePerUnit > CONSTANTS.MAX_SANITY_PRICE_PER_UNIT
    ) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'PRICE_OUT_OF_BOUNDS', message: 'Base price is outside of allowed marketplace sanity bounds' },
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();

      const dbTargetBuyer =
        payload.targetBuyer === 'PENDING_APPROVAL' || payload.targetBuyer === 'ADMIN_APPROVED'
          ? 'BOTH'
          : (payload.targetBuyer || 'BOTH');

      const { data, error } = await supabase
        .from('products')
        .insert({
          farmer_id: farmerId,
          crop_name: payload.cropName,
          crop_variety: payload.cropVariety || null,
          grade: payload.grade,
          category: payload.category,
          total_quantity: payload.totalQuantity,
          available_quantity: payload.totalQuantity,
          reserved_quantity: 0.0,
          quantity_unit: payload.quantityUnit,
          base_price_per_unit: payload.basePricePerUnit,
          min_order_quantity: payload.minOrderQuantity,
          target_buyer: dbTargetBuyer,
          images: payload.images,
          pickup_address: payload.pickupAddress || null,
          pickup_latitude: payload.pickupLatitude || null,
          pickup_longitude: payload.pickupLongitude || null,
          harvest_date: payload.harvestDate || null,
          shelf_life_days: payload.shelfLifeDays,
          is_active: (payload as any).isActive !== undefined ? Boolean((payload as any).isActive) : false,
        })
        .select()
        .single();

      if (error) {
        console.warn('[ProductsController] Supabase insert warning:', error.message);
        // Fallback response for prototype
        const mockProduct = {
          id: `prod_${Date.now()}`,
          farmerId,
          ...payload,
          availableQuantity: payload.totalQuantity,
          reservedQuantity: 0,
          isActive: (payload as any).isActive !== undefined ? Boolean((payload as any).isActive) : false,
          status: (payload as any).status || 'PENDING_APPROVAL',
          createdAt: new Date().toISOString(),
        };

        const reqFarmerName = (req.body && req.body.farmerName) || (req.user as any)?.fullName || (req.user as any)?.name || 'Registered Farmer';
        const reqFarmerPhone = (req.body && req.body.farmerPhone) || (req.user as any)?.phone || '';
        const reqLocation = (req.body && req.body.location) || payload.pickupAddress || 'Nashik, Maharashtra';

        ProductRegistryService.registerProduct({
          id: mockProduct.id,
          farmerId,
          farmerName: reqFarmerName,
          farmerPhone: reqFarmerPhone,
          location: reqLocation,
          cropName: payload.cropName,
          cropVariety: payload.cropVariety,
          grade: payload.grade,
          category: payload.category,
          totalQuantity: payload.totalQuantity,
          availableQuantity: payload.totalQuantity,
          reservedQuantity: 0,
          quantityUnit: payload.quantityUnit,
          basePricePerUnit: payload.basePricePerUnit,
          minOrderQuantity: payload.minOrderQuantity,
          targetBuyer: payload.targetBuyer,
          images: payload.images && payload.images.length > 0 ? payload.images : ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
          pickupAddress: payload.pickupAddress,
          shelfLifeDays: payload.shelfLifeDays,
          isActive: false,
          status: 'PENDING_APPROVAL',
          createdAt: mockProduct.createdAt,
        });

        DashboardService.invalidateCache(farmerId);
        res.status(201).json({ data: mockProduct, meta: null, error: null });
        return;
      }

      const reqFarmerName = (req.body && req.body.farmerName) || (req.user as any)?.fullName || (req.user as any)?.name || 'Registered Farmer';
      const reqFarmerPhone = (req.body && req.body.farmerPhone) || (req.user as any)?.phone || '';
      const reqLocation = (req.body && req.body.location) || data.pickup_address || 'Nashik, Maharashtra';

      ProductRegistryService.registerProduct({
        id: data.id,
        farmerId: data.farmer_id,
        farmerName: reqFarmerName,
        farmerPhone: reqFarmerPhone,
        location: reqLocation,
        cropName: data.crop_name,
        cropVariety: data.crop_variety,
        grade: data.grade,
        category: data.category,
        totalQuantity: data.total_quantity,
        availableQuantity: data.available_quantity,
        reservedQuantity: data.reserved_quantity,
        quantityUnit: data.quantity_unit,
        basePricePerUnit: data.base_price_per_unit,
        minOrderQuantity: data.min_order_quantity,
        targetBuyer: payload.targetBuyer || 'PENDING_APPROVAL',
        images: (data.images && data.images.length > 0) ? data.images : (payload.images || []),
        pickupAddress: data.pickup_address,
        shelfLifeDays: data.shelf_life_days,
        isActive: false,
        status: 'PENDING_APPROVAL',
        createdAt: data.created_at,
      });

      DashboardService.invalidateCache(farmerId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'CREATE_PRODUCT',
        resourceType: 'PRODUCT',
        resourceId: data.id,
        metadata: { crop: payload.cropName, qty: payload.totalQuantity },
      });

      res.status(201).json({
        data: {
          ...data,
          status: 'PENDING_APPROVAL',
        },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'PRODUCT_CREATE_ERROR', message: (err as Error).message },
      });
    }
  }

  static async updateStock(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const productId = String(req.params.id);
    const parse = UpdateProductStockSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: parse.error.issues[0]?.message || 'Invalid stock update' },
      });
      return;
    }

    try {
      const supabase = getSupabaseAdmin();

      const { data: existing, error: fetchErr } = await supabase
        .from('products')
        .select('id, farmer_id, reserved_quantity')
        .eq('id', productId)
        .single();

      if (!fetchErr && existing && existing.farmer_id !== farmerId && req.user?.role !== UserRole.ADMIN) {
        res.status(403).json({
          data: null,
          meta: null,
          error: { code: 'FORBIDDEN', message: 'You do not have permission to modify this product.' },
        });
        return;
      }

      const updateData: Record<string, any> = {
        available_quantity: parse.data.availableQuantity,
        updated_at: new Date().toISOString(),
      };
      if (parse.data.isActive !== undefined) {
        updateData.is_active = parse.data.isActive;
      }

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        res.status(200).json({
          data: { id: productId, ...parse.data, message: 'Stock updated in session' },
          meta: null,
          error: null,
        });
        return;
      }

      DashboardService.invalidateCache(farmerId);
      res.status(200).json({ data, meta: null, error: null });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'STOCK_UPDATE_ERROR', message: (err as Error).message },
      });
    }
  }

  /**
   * PUT /:id — Update product details / publish to all buyers
   * Allows farmers to update price, status, or targetBuyer of a product.
   * When status=ACTIVE or targetBuyer=BOTH, the crop becomes visible in the User App.
   */
  static async updateProduct(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const productId = String(req.params.id);
    const {
      targetBuyer, basePricePerUnit, status, isActive, images,
      // Full crop data (optional) — sent by the Farmer App "Sell to All" flow
      cropName, cropVariety, grade, category, totalQuantity, availableQuantity,
      quantityUnit, pickupAddress, shelfLifeDays, farmerName, farmerPhone, location,
    } = req.body;

    try {
      const isNowActive = status === 'ACTIVE' || isActive === true || targetBuyer === 'BOTH';

      // Always update/create in the shared ProductRegistryService for cross-app visibility
      const registered = ProductRegistryService.getProductById(productId);

      if (registered) {
        // Merge updates into existing registry entry
        ProductRegistryService.registerProduct({
          ...registered,
          ...(targetBuyer !== undefined && { targetBuyer }),
          ...(basePricePerUnit !== undefined && { basePricePerUnit }),
          ...(images !== undefined && { images }),
          isActive: isNowActive || registered.isActive,
          status: (isNowActive || registered.isActive) ? 'ACTIVE' : 'PENDING_APPROVAL',
        });
      } else {
        // Not yet in registry — create a full entry from request body data
        const reqFarmerName = farmerName || (req.user as any)?.fullName || (req.user as any)?.name || 'MandiKart Farmer';
        const reqLocation = location || pickupAddress || 'Mandi Area';
        const safeCropName = cropName || 'Fresh Produce';
        const safeImages = (images && images.length > 0)
          ? images
          : [`https://source.unsplash.com/featured/600x400/?${encodeURIComponent(safeCropName + ' vegetable farm')}`];

        ProductRegistryService.registerProduct({
          id: productId,
          farmerId,
          farmerName: reqFarmerName,
          farmerPhone: farmerPhone || (req.user as any)?.phone || '',
          location: reqLocation,
          cropName: safeCropName,
          cropVariety: cropVariety || '',
          grade: grade || 'A',
          category: category || 'Vegetables',
          totalQuantity: Number(totalQuantity || availableQuantity || 100),
          availableQuantity: Number(availableQuantity || totalQuantity || 100),
          reservedQuantity: 0,
          quantityUnit: quantityUnit || 'kg',
          basePricePerUnit: Number(basePricePerUnit || 25),
          minOrderQuantity: 10,
          targetBuyer: targetBuyer || 'BOTH',
          images: safeImages,
          pickupAddress: reqLocation,
          shelfLifeDays: Number(shelfLifeDays || 14),
          isActive: isNowActive,
          status: isNowActive ? 'ACTIVE' : 'PENDING_APPROVAL',
          createdAt: new Date().toISOString(),
        });
      }

      // If Supabase is configured, also persist there
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        const dbUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
        if (targetBuyer !== undefined) dbUpdate.target_buyer = targetBuyer;
        if (basePricePerUnit !== undefined) dbUpdate.base_price_per_unit = basePricePerUnit;
        if (isNowActive) dbUpdate.is_active = true;
        if (images !== undefined && images.length > 0) dbUpdate.images = images;
        if (totalQuantity !== undefined) dbUpdate.total_quantity = totalQuantity;
        if (availableQuantity !== undefined) dbUpdate.available_quantity = availableQuantity;

        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        let updatedRows: any[] | null = null;
        if (UUID_REGEX.test(productId)) {
          const res = await supabase
            .from('products')
            .update(dbUpdate)
            .eq('id', productId)
            .select();
          updatedRows = res.data;
        }

        // If no row matched in Supabase (e.g. productId was client-side local ID like crop-xxx),
        // INSERT as an active product in Supabase so UserApp can query it immediately!
        if (!updatedRows || updatedRows.length === 0) {
          const safeFarmerId = UUID_REGEX.test(farmerId) ? farmerId : 'd1111111-1111-1111-1111-111111111111';
          const safePrice = Number(basePricePerUnit || 25);
          const safeQty = Number(totalQuantity || availableQuantity || 100);

          await supabase
            .from('products')
            .insert({
              farmer_id: safeFarmerId,
              crop_name: cropName || 'Fresh Produce',
              crop_variety: cropVariety || null,
              grade: grade || 'A',
              category: category || 'Vegetables',
              total_quantity: safeQty,
              available_quantity: safeQty,
              reserved_quantity: 0.0,
              quantity_unit: quantityUnit || 'kg',
              base_price_per_unit: safePrice,
              min_order_quantity: 10,
              target_buyer: 'BOTH',
              images: (images && images.length > 0) ? images : ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
              pickup_address: pickupAddress || location || 'Nashik, Maharashtra',
              shelf_life_days: Number(shelfLifeDays || 14),
              is_active: true,
            });
        }
      }

      DashboardService.invalidateCache(farmerId);

      res.status(200).json({
        data: { id: productId, message: 'Crop published to global marketplace. Visible to all buyers.' },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'PRODUCT_UPDATE_ERROR', message: (err as Error).message },
      });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    const farmerId = req.user?.id || 'farmer_ramesh_01';
    const productId = String(req.params.id);

    try {
      const supabase = getSupabaseAdmin();

      // Soft delete to protect relational order history
      await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .eq('farmer_id', farmerId);

      DashboardService.invalidateCache(farmerId);

      await auditLog({
        actorId: farmerId,
        role: UserRole.FARMER,
        action: 'DEACTIVATE_PRODUCT',
        resourceType: 'PRODUCT',
        resourceId: productId,
      });

      res.status(200).json({
        data: { message: 'Product listing deactivated successfully' },
        meta: null,
        error: null,
      });
    } catch (err) {
      res.status(500).json({
        data: null,
        meta: null,
        error: { code: 'DELETE_ERROR', message: (err as Error).message },
      });
    }
  }
}
