import { Router } from 'express';
import { requireAuth, requireRole, requireIdempotency } from '@mandikart/shared-core';
import { UserRole } from '@mandikart/shared-types';
import { AdminController } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/metrics', requireAuth, AdminController.getPlatformMetrics);
adminRouter.post('/farmers/:farmerId/verify', requireAuth, requireIdempotency, AdminController.verifyFarmerKyc);
adminRouter.post('/disputes/:orderId/resolve', requireAuth, requireIdempotency, AdminController.resolveDispute);
adminRouter.get('/audit-logs', requireAuth, AdminController.getAuditLogs);
