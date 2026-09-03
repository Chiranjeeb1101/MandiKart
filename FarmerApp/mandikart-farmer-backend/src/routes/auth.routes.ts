import { Router, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../middlewares/errorHandler.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const authRouter = Router();

const sendOtpSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * POST /api/v1/auth/login (Send OTP)
 */
authRouter.post('/login', async (req, res: Response) => {
  const parse = sendOtpSchema.safeParse(req.body);
  if (!parse.success) {
    return sendError(res, parse.error.errors[0].message, 400, 'VALIDATION_ERROR');
  }

  const { phone } = parse.data;

  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      return sendError(res, error.message, 400, 'OTP_SEND_FAILED');
    }
  }

  return sendSuccess(res, {
    message: `OTP sent successfully to ${phone}`,
    phone,
    debugOtp: isSupabaseConfigured ? undefined : '123456',
  });
});

/**
 * POST /api/v1/auth/verify-otp
 */
authRouter.post('/verify-otp', async (req, res: Response) => {
  const parse = verifyOtpSchema.safeParse(req.body);
  if (!parse.success) {
    return sendError(res, parse.error.errors[0].message, 400, 'VALIDATION_ERROR');
  }

  const { phone, otp } = parse.data;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error || !data.session) {
      return sendError(res, error?.message || 'Invalid OTP code', 400, 'INVALID_OTP');
    }

    return sendSuccess(res, {
      token: data.session.access_token,
      farmer: {
        id: data.user?.id,
        phone: data.user?.phone,
        fullName: data.user?.user_metadata?.fullName || 'Farmer',
        role: 'farmer',
      },
    });
  }

  // Demo fallback
  return sendSuccess(res, {
    token: 'demo-jwt-token-farmer-001',
    farmer: {
      id: 'farmer-demo-001',
      fullName: 'Ramesh Patel',
      phone,
      district: 'Nashik',
      state: 'Maharashtra',
      farmerType: 'Individual Farmer',
      experience: '12 years',
      role: 'farmer',
    },
  });
});

/**
 * GET /api/v1/auth/me (Get profile)
 */
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, {
    farmer: {
      id: req.user?.id || 'farmer-demo-001',
      fullName: 'Ramesh Patel',
      phone: req.user?.phone || '+919876543210',
      district: 'Nashik',
      state: 'Maharashtra',
      farmerType: 'Individual Farmer',
      experience: '12 years',
      crops: ['Onion', 'Tomato', 'Wheat'],
      isVerified: true,
    },
  });
});
