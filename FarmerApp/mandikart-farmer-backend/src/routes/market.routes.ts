import { Router, Response } from 'express';
import { sendSuccess } from '../middlewares/errorHandler.js';

export const marketRouter = Router();

/**
 * GET /api/v1/market/prices - Live APMC market rates
 */
marketRouter.get('/prices', (_req, res: Response) => {
  const prices = [
    {
      crop: 'Onion',
      variety: 'Nashik Red',
      modalPricePerKg: 24,
      minPricePerKg: 20,
      maxPricePerKg: 26,
      market: 'Lasalgaon APMC',
      trend: 'UP',
      changePercent: '+4.2%',
    },
    {
      crop: 'Tomato',
      variety: 'Hybrid Vaishali',
      modalPricePerKg: 32,
      minPricePerKg: 28,
      maxPricePerKg: 35,
      market: 'Pimpalgaon APMC',
      trend: 'HIGH',
      changePercent: '+8.1%',
    },
    {
      crop: 'Potato',
      variety: 'Jyoti',
      modalPricePerKg: 18,
      minPricePerKg: 16,
      maxPricePerKg: 21,
      market: 'Pune APMC',
      trend: 'STABLE',
      changePercent: '0.0%',
    },
  ];

  return sendSuccess(res, prices);
});

/**
 * GET /api/v1/market/match - Top buyer match calculation
 */
marketRouter.get('/match', (req, res: Response) => {
  const crop = (req.query.crop as string) || 'Onion';
  const quantity = parseFloat((req.query.quantity as string) || '1000');

  const buyerMatches = [
    {
      buyerId: 'buyer-apmc-direct',
      businessName: 'FreshDirect APMC Wholesale',
      rating: 4.9,
      isVerified: true,
      distanceKm: 12,
      grossRatePerKg: 24,
      estimatedTransportCostPerKg: 2,
      estimatedMandiFeePerKg: 0.36,
      netReturnPerKg: 21.64,
      totalNetReturn: Math.round(quantity * 21.64),
      matchPercentage: 96,
      matchFactors: [
        'Verified APMC Buyer',
        'Direct farm gate pickup',
        'Next-day bank settlement',
      ],
      isRecommended: true,
    },
  ];

  return sendSuccess(res, buyerMatches);
});
