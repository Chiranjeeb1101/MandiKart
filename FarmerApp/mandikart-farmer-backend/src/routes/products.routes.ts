/**
 * MandiKart — Products Routes
 */

import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { ProductsController } from '../controllers/products.controller.js';

export const productsRouter = Router();

productsRouter.get('/', requireAuth, ProductsController.listProducts);
productsRouter.post('/', requireAuth, requireIdempotency, ProductsController.createProduct);
productsRouter.patch('/:id/stock', requireAuth, requireIdempotency, ProductsController.updateStock);
productsRouter.delete('/:id', requireAuth, ProductsController.deleteProduct);
