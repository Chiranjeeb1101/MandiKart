import { Router, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../middlewares/errorHandler.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { Product } from '../types/index.js';

export const productsRouter = Router();

// In-memory demo products store (mirrors Supabase table)
let demoProducts: Product[] = [
  {
    id: 'prod-001',
    farmerId: 'farmer-demo-001',
    cropName: 'Nashik Red Onion',
    quantityKg: 2500,
    availableQuantityKg: 2500,
    expectedPricePerKg: 24,
    qualityGrade: 'A',
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    farmerId: 'farmer-demo-001',
    cropName: 'Hybrid Tomato',
    quantityKg: 1200,
    availableQuantityKg: 800,
    expectedPricePerKg: 32,
    qualityGrade: 'A',
    status: 'LISTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    farmerId: 'farmer-demo-001',
    cropName: 'Sharbati Wheat',
    quantityKg: 4000,
    availableQuantityKg: 0,
    expectedPricePerKg: 28,
    qualityGrade: 'B',
    status: 'SOLD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const createProductSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  quantityKg: z.number().positive('Quantity must be greater than 0'),
  expectedPricePerKg: z.number().positive('Price must be greater than 0'),
  qualityGrade: z.enum(['A', 'B', 'C']).default('A'),
  harvestDate: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

/**
 * GET /api/v1/products - List farmer products with optional status filter & pagination
 */
productsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);

  let filtered = demoProducts.filter(
    (p) => p.farmerId === (req.user?.id || 'farmer-demo-001')
  );

  if (status) {
    filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return sendSuccess(res, paginated, {
    page,
    limit,
    total,
  });
});

/**
 * POST /api/v1/products - Create new produce listing
 */
productsRouter.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const parse = createProductSchema.safeParse(req.body);
  if (!parse.success) {
    return sendError(res, parse.error.errors[0].message, 400, 'VALIDATION_ERROR');
  }

  const { cropName, quantityKg, expectedPricePerKg, qualityGrade, harvestDate, imageUrl } =
    parse.data;

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    farmerId: req.user?.id || 'farmer-demo-001',
    cropName,
    quantityKg,
    availableQuantityKg: quantityKg,
    expectedPricePerKg,
    qualityGrade,
    harvestDate,
    status: 'AVAILABLE',
    imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  demoProducts.unshift(newProduct);

  return sendSuccess(res, newProduct, null, 201);
});

/**
 * PATCH /api/v1/products/:id - Update product details or stock
 */
productsRouter.patch('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const productIndex = demoProducts.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return sendError(res, 'Product not found', 404, 'NOT_FOUND');
  }

  const existing = demoProducts[productIndex];
  if (existing.farmerId !== (req.user?.id || 'farmer-demo-001')) {
    return sendError(res, 'Unauthorized to modify this product', 403, 'FORBIDDEN');
  }

  const updated: Product = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  demoProducts[productIndex] = updated;

  return sendSuccess(res, updated);
});
