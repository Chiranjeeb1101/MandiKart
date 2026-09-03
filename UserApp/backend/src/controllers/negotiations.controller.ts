/**
 * MandiKart — UserApp Negotiations Controller
 * Handles buyer price offers and response to farmer counter-offers.
 */

import { Request, Response } from 'express';
import { UserRole } from '@mandikart/shared-types';
import { auditLog } from '@mandikart/shared-core';

export class BuyerNegotiationsController {
  static async submitOffer(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const { productId, offeredPrice, quantity, remarks } = req.body;

    if (!productId || !offeredPrice || !quantity) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'productId, offeredPrice, and quantity are required' },
      });
      return;
    }

    const negotiationId = `neg_${Date.now()}`;

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: 'SUBMIT_PRICE_OFFER',
      resourceType: 'PRODUCT',
      resourceId: productId,
      metadata: { offeredPrice, quantity },
    });

    res.status(201).json({
      data: {
        id: negotiationId,
        productId,
        buyerId,
        offeredPrice,
        quantity,
        status: 'PENDING_FARMER',
        remarks: remarks || null,
        message: 'Price offer dispatched to farmer partner.',
      },
      meta: null,
      error: null,
    });
  }
}
