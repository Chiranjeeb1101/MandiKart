import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { getValidatedEnv } from '@mandikart/shared-config';
import { requireIdempotency } from '@mandikart/shared-core';
import { authRouter } from './routes/auth.routes.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { negotiationsRouter } from './routes/negotiations.routes.js';
import { consentRouter } from './routes/consent.routes.js';
import { notificationRouter } from './routes/notification.routes.js';
import { bulkRequirementsRouter } from './routes/bulk-requirements.routes.js';

dotenv.config();

const env = getValidatedEnv();
const app = express();
const PORT = process.env.PORT || 4001;

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

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    data: {
      service: 'mandikart-user-backend',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: PORT,
    },
    meta: null,
    error: null,
  });
});

// Buyer Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/negotiations', negotiationsRouter);
app.use('/api/v1/consent', consentRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/bulk-requirements', bulkRequirementsRouter);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error in User Backend:', err);
  res.status(500).json({
    data: null,
    meta: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🛒 MandiKart Buyer Backend running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
});

export default app;
