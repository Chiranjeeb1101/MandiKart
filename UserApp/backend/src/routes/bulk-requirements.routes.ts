import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { BulkRequirementsController } from '../controllers/bulk-requirements.controller.js';

export const bulkRequirementsRouter = Router();

bulkRequirementsRouter.get('/', requireAuth, BulkRequirementsController.listRequirements);
bulkRequirementsRouter.post('/', requireAuth, requireIdempotency, BulkRequirementsController.createRequirement);
bulkRequirementsRouter.get('/:id/matches', requireAuth, BulkRequirementsController.getMatches);
