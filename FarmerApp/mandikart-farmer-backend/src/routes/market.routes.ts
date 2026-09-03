/**
 * MandiKart — Market Intelligence Routes
 * Proxies to shared MarketPriceService with in-memory caching.
 */

import { Router, Request, Response } from 'express';
import { MarketRatesQuerySchema } from '@mandikart/shared-types';
import { MarketPriceService } from '@mandikart/shared-core';

export const marketRouter = Router();

marketRouter.get('/rates', async (req: Request, res: Response): Promise<void> => {
  const parse = MarketRatesQuerySchema.safeParse(req.query);
  const params = parse.success ? parse.data : {};

  try {
    const rates = await MarketPriceService.getRates(params);
    res.status(200).json({
      data: rates,
      meta: { total: rates.length, timestamp: new Date().toISOString() },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      data: null,
      meta: null,
      error: { code: 'MARKET_RATES_ERROR', message: (err as Error).message },
    });
  }
});
