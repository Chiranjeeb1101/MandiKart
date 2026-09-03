/**
 * MandiKart — Auth Routes
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/signup', AuthController.signup);
authRouter.post('/verify-otp', AuthController.verifyOtp);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh-session', AuthController.refreshSession);
authRouter.post('/logout', AuthController.logout);
