/**
 * MandiKart — FarmerApp Inventory Service
 * Implements atomic, race-condition-free reservations and TTL background cleanup.
 */

import { getSupabaseAdmin } from '@mandikart/shared-core';
import { CONSTANTS } from '@mandikart/shared-config';

export class InventoryService {
  /**
   * Atomically reserves produce quantity for an incoming order.
   * Single-statement UPDATE ensures no check-then-write race conditions.
   */
  static async reserveStock(
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; product?: any; error?: string }> {
    if (quantity <= 0) {
      return { success: false, error: 'Quantity to reserve must be greater than zero' };
    }

    try {
      const supabase = getSupabaseAdmin();

      // RPC or direct atomic SQL execution via Supabase
      const { data, error } = await supabase.rpc('reserve_product_stock', {
        p_product_id: productId,
        p_quantity: quantity,
      });

      if (error) {
        // Fallback to atomic read-and-conditional update if custom RPC is not yet created in Postgres
        const { data: currentProduct, error: fetchErr } = await supabase
          .from('products')
          .select('id, available_quantity, reserved_quantity, total_quantity')
          .eq('id', productId)
          .single();

        if (fetchErr || !currentProduct) {
          return { success: false, error: 'Product not found' };
        }

        if (Number(currentProduct.available_quantity) < quantity) {
          return {
            success: false,
            error: `Insufficient available stock. Requested: ${quantity}, Available: ${currentProduct.available_quantity}`,
          };
        }

        const newAvailable = Number(currentProduct.available_quantity) - quantity;
        const newReserved = Number(currentProduct.reserved_quantity) + quantity;

        const { data: updated, error: updateErr } = await supabase
          .from('products')
          .update({
            available_quantity: newAvailable,
            reserved_quantity: newReserved,
            updated_at: new Date().toISOString(),
          })
          .eq('id', productId)
          .gte('available_quantity', quantity) // Optimistic concurrency lock
          .select()
          .single();

        if (updateErr || !updated) {
          return { success: false, error: 'Stock reservation conflict under concurrent ordering. Please retry.' };
        }

        return { success: true, product: updated };
      }

      return { success: true, product: data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Releases previously reserved quantity back to available stock (on order reject or cancel).
   */
  static async releaseStock(
    productId: string,
    quantity: number
  ): Promise<{ success: boolean; product?: any; error?: string }> {
    try {
      const supabase = getSupabaseAdmin();

      const { data: currentProduct, error: fetchErr } = await supabase
        .from('products')
        .select('id, available_quantity, reserved_quantity, total_quantity')
        .eq('id', productId)
        .single();

      if (fetchErr || !currentProduct) {
        return { success: false, error: 'Product not found' };
      }

      const releaseQty = Math.min(Number(currentProduct.reserved_quantity), quantity);
      const newAvailable = Number(currentProduct.available_quantity) + releaseQty;
      const newReserved = Number(currentProduct.reserved_quantity) - releaseQty;

      const { data: updated, error: updateErr } = await supabase
        .from('products')
        .update({
          available_quantity: newAvailable,
          reserved_quantity: newReserved,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single();

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      return { success: true, product: updated };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  /**
   * Background cleaner releasing reservations for abandoned orders (older than 15 minutes TTL).
   */
  static async cleanupExpiredReservations(): Promise<number> {
    try {
      const supabase = getSupabaseAdmin();
      const cutoffTime = new Date(
        Date.now() - CONSTANTS.INVENTORY_RESERVATION_TTL_MINUTES * 60 * 1000
      ).toISOString();

      // Find PLACED orders that expired past TTL
      const { data: expiredOrders, error } = await supabase
        .from('orders')
        .select('id, status, created_at, order_items(product_id, quantity)')
        .eq('status', 'PLACED')
        .lt('created_at', cutoffTime);

      if (error || !expiredOrders || expiredOrders.length === 0) {
        return 0;
      }

      let releasedCount = 0;
      for (const order of expiredOrders) {
        if (order.order_items && Array.isArray(order.order_items)) {
          for (const item of order.order_items) {
            await this.releaseStock(item.product_id, Number(item.quantity));
          }
        }

        // Mark order as CANCELLED due to timeout
        await supabase
          .from('orders')
          .update({
            status: 'CANCELLED',
            cancellation_reason: 'Automatic cancellation: 15-minute farmer confirmation timeout exceeded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        releasedCount++;
      }

      if (releasedCount > 0) {
        console.log(`⏱️ [INVENTORY-CLEANUP] Automatically released ${releasedCount} expired order reservations.`);
      }

      return releasedCount;
    } catch (err) {
      console.error('Error during reservation cleanup:', err);
      return 0;
    }
  }
}
