import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { generalRateLimit } from '../middleware/rateLimit.middleware.js';
import { registerVehicleSchema } from '../validators/fleet.validator.js';
import { LogisticFleetController } from '../controllers/fleet.controller.js';
import { SocketService } from '../services/socket.service.js';

export const fleetRouter = Router();

fleetRouter.post('/register', generalRateLimit, requireAuth, validate(registerVehicleSchema), LogisticFleetController.registerVehicle);
fleetRouter.get('/status',    generalRateLimit, requireAuth, LogisticFleetController.getFleetStatus);

// Real-time online drivers (powered by Socket.io registry)
fleetRouter.get('/online', generalRateLimit, requireAuth, (_req, res) => {
  res.status(200).json({
    data: SocketService.getOnlineDrivers(),
    meta: { count: Object.keys(SocketService.getOnlineDrivers()).length },
    error: null,
  });
});

