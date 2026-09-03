import { Router } from 'express';
import { CatalogController } from '../controllers/catalog.controller.js';

export const catalogRouter = Router();

catalogRouter.get('/', CatalogController.searchCatalog);
