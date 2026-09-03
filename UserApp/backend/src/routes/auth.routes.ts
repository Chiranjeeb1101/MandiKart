import { Router } from 'express';
import { BuyerAuthController } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', BuyerAuthController.login);
authRouter.post('/refresh-session', BuyerAuthController.refreshSession);
