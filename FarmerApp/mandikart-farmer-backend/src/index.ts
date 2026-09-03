import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { getValidatedEnv } from '@mandikart/shared-config';
import { requireIdempotency } from '@mandikart/shared-core';
import { authRouter } from './routes/auth.routes.js';
import { farmersRouter } from './routes/farmers.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { marketRouter } from './routes/market.routes.js';
import { consentRouter } from './routes/consent.routes.js';
import { notificationRouter } from './routes/notification.routes.js';
import { errorHandler, sendSuccess } from './middlewares/errorHandler.js';
import { InventoryService } from './services/inventory.service.js';

dotenv.config();

// Boot-time environment validation (fail-fast)
const env = getValidatedEnv();

const app = express();
const PORT = env.PORT || 4000;

// Security & utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(requireIdempotency);

// Base Health Check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    service: 'mandikart-farmer-backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

// Farmer App API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/farmers', farmersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/market', marketRouter);
app.use('/api/v1/consent', consentRouter);
app.use('/api/v1/notifications', notificationRouter);

// Centralized error handler
app.use(errorHandler);

// Background job: 15-minute reservation TTL cleanup (runs every 5 minutes)
setInterval(() => {
  InventoryService.cleanupExpiredReservations().catch((err) => {
    console.error('Reservation cleanup error:', err);
  });
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🌾 MandiKart Farmer Backend running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
});

export default app;
