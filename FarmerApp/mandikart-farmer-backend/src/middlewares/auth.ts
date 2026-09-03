import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { sendError } from './errorHandler.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    phone: string;
    role: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In local dev without live Supabase, allow demo bypass
    if (!isSupabaseConfigured && process.env.NODE_ENV === 'development') {
      req.user = {
        id: 'farmer-demo-001',
        phone: '+919876543210',
        role: 'farmer',
      };
      return next();
    }
    sendError(res, 'Authentication token missing or invalid', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!isSupabaseConfigured) {
    req.user = {
      id: 'farmer-demo-001',
      phone: '+919876543210',
      role: 'farmer',
    };
    return next();
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      sendError(res, 'Invalid or expired session token', 401, 'INVALID_TOKEN');
      return;
    }

    req.user = {
      id: data.user.id,
      phone: data.user.phone || '',
      role: (data.user.user_metadata?.role as string) || 'farmer',
    };
    next();
  } catch (err) {
    sendError(res, 'Failed to authenticate user', 500, 'AUTH_ERROR', err);
  }
}
