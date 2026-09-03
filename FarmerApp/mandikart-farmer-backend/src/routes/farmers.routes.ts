/**
 * MandiKart — Farmers Profile & KYC Routes
 */

import { Router } from 'express';
import { requireAuth, requireIdempotency } from '@mandikart/shared-core';
import { FarmersController } from '../controllers/farmers.controller.js';
import { DashboardService } from '../services/dashboard.service.js';

export const farmersRouter = Router();

farmersRouter.get('/me', requireAuth, FarmersController.getMe);
farmersRouter.put('/profile', requireAuth, requireIdempotency, FarmersController.updateProfile);
farmersRouter.put('/farm-details', requireAuth, requireIdempotency, FarmersController.updateFarmDetails);
farmersRouter.put('/preferences', requireAuth, FarmersController.updatePreferences);
farmersRouter.get('/bank-details', requireAuth, FarmersController.getMe);
farmersRouter.put('/bank-details', requireAuth, requireIdempotency, FarmersController.updateBankDetails);
farmersRouter.get('/upload-token', requireAuth, FarmersController.getUploadToken);

farmersRouter.get('/dashboard-summary', requireAuth, async (req, res) => {
  const farmerId = req.user?.id || 'farmer_ramesh_01';
  const summary = await DashboardService.getSummary(farmerId);
  res.status(200).json({ data: summary, meta: null, error: null });
});
