/**
 * MandiKart — FarmerApp Negotiation Service
 * Handles farmer-side counter-offers and negotiation history with buyers.
 */

import { getSupabaseAdmin, auditLog } from '@mandikart/shared-core';
import { UserRole } from '@mandikart/shared-types';

// In-memory rate limiting map for negotiation offers: max 5 offers per farmer per 10 minutes
const farmerOfferRateMap = new Map<string, number[]>();

export class NegotiationService {
  /**
   * Submit a farmer counter-offer on a pending negotiation
   */
  static async submitCounterOffer(params: {
    negotiationId?: string;
    orderId?: string;
    farmerId: string;
    counterPricePerUnit: number;
    remarks?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    // 1. Anti-spam rate limiting
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const timestamps = (farmerOfferRateMap.get(params.farmerId) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= 5) {
      return {
        success: false,
        error: 'Too many counter-offers submitted recently. Please wait before submitting another counter-offer.',
      };
    }

    timestamps.push(now);
    farmerOfferRateMap.set(params.farmerId, timestamps);

    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
      return {
        success: true,
        data: {
          id: params.negotiationId || `neg_${Date.now()}`,
          orderId: params.orderId,
          farmerId: params.farmerId,
          counterPrice: params.counterPricePerUnit,
          remarks: params.remarks,
          status: 'COUNTERED',
        },
      };
    }

    try {
      const supabase = getSupabaseAdmin();

      let query = supabase.from('negotiations').select('*');
      if (params.negotiationId) {
        query = query.eq('id', params.negotiationId);
      } else if (params.orderId) {
        query = query.eq('order_id', params.orderId);
      } else {
        return { success: false, error: 'Either negotiationId or orderId is required' };
      }

      const { data: existing, error: fetchErr } = await query.eq('farmer_id', params.farmerId).single();

      if (fetchErr || !existing) {
        // Create new negotiation row if one doesn't exist yet for this order
        const { data: created, error: createErr } = await supabase
          .from('negotiations')
          .insert({
            order_id: params.orderId || null,
            product_id: 'prod_default',
            buyer_id: 'buyer_default',
            farmer_id: params.farmerId,
            original_price: params.counterPricePerUnit * 1.1,
            offered_price: params.counterPricePerUnit * 0.9,
            counter_price: params.counterPricePerUnit,
            quantity: 100,
            status: 'COUNTERED',
            remarks: params.remarks || null,
          })
          .select()
          .single();

        if (createErr) {
          return { success: false, error: createErr.message };
        }

        await auditLog({
          actorId: params.farmerId,
          role: UserRole.FARMER,
          action: 'SUBMIT_COUNTER_OFFER',
          resourceType: 'ORDER',
          resourceId: params.orderId || 'negotiation',
          metadata: { counterPrice: params.counterPricePerUnit },
        });

        return { success: true, data: created };
      }

      const { data: updated, error: updateErr } = await supabase
        .from('negotiations')
        .update({
          counter_price: params.counterPricePerUnit,
          status: 'COUNTERED',
          remarks: params.remarks || existing.remarks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      await auditLog({
        actorId: params.farmerId,
        role: UserRole.FARMER,
        action: 'SUBMIT_COUNTER_OFFER',
        resourceType: 'ORDER',
        resourceId: existing.order_id || existing.id,
        metadata: { counterPrice: params.counterPricePerUnit },
      });

      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}
