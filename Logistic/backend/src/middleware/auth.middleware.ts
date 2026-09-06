import { Request, Response, NextFunction } from 'express';

// ─── Mock User (used in MOCK ENV so no env vars are needed) ──────────────────
const MOCK_USER = {
  id: 'driver_santosh_01',
  role: 'LOGISTICS_DRIVER',
  name: 'Santosh Kumar',
  phone: '+91 9876543211',
};

const isMockEnv = () =>
  !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

// ─── Simple JWT decode (no verify in mock; use a real lib in prod) ───────────
/**
 * Decodes a JWT payload without cryptographic verification.
 * In production, replace this with `jsonwebtoken.verify()` using your secret.
 */
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

// ─── requireAuth Middleware ───────────────────────────────────────────────────
/**
 * Verifies the Authorization header and populates req.user.
 *
 * Mock ENV  → injects MOCK_USER automatically (no token needed).
 * Production → reads "Authorization: Bearer <token>", decodes JWT, sets req.user.
 *
 * Returns 401 if token is missing or malformed in production mode.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const isMockToken = token.startsWith('mock_jwt_token_') || token.startsWith('mock_otp_token_') || token.startsWith('mock_google_token_');

  // In mock/dev environment or with mock token, skip auth verification
  if (isMockEnv() || isMockToken) {
    (req as any).user = MOCK_USER;
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      data: null,
      meta: null,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' },
    });
    return;
  }

  const payload = decodeJwtPayload(token);

  if (!payload || !payload.sub) {
    res.status(401).json({
      data: null,
      meta: null,
      error: { code: 'UNAUTHORIZED', message: 'Invalid token payload' },
    });
    return;
  }

  // Check token expiry
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    res.status(401).json({
      data: null,
      meta: null,
      error: { code: 'TOKEN_EXPIRED', message: 'Access token has expired' },
    });
    return;
  }

  (req as any).user = {
    id: payload.sub,
    role: payload.role || 'LOGISTICS_DRIVER',
    name: payload.name,
    phone: payload.phone,
  };

  next();
};
