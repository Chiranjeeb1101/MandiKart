import { Request, Response, NextFunction } from 'express';

// ─── Sliding-Window In-Memory Rate Limiter ────────────────────────────────────
// No external dependencies — uses a simple Map to track request timestamps.

interface RateLimitEntry {
  timestamps: number[];
}

const _store = new Map<string, RateLimitEntry>();

/**
 * Creates an Express rate-limiting middleware using a sliding-window algorithm.
 *
 * @param maxRequests  Maximum allowed requests within the window
 * @param windowMs     Window size in milliseconds
 * @param keyPrefix    Optional prefix to namespace different limiters
 */
const createRateLimiter = (maxRequests: number, windowMs: number, keyPrefix = 'rl') => {
  // Prune stale entries every 5 minutes to prevent memory leak
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, entry] of _store.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
      if (entry.timestamps.length === 0) _store.delete(key);
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = _store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      _store.set(key, entry);
    }

    // Remove timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

    if (entry.timestamps.length >= maxRequests) {
      const retryAfterSec = Math.ceil(windowMs / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.status(429).json({
        data: null,
        meta: null,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Try again in ${retryAfterSec} seconds.`,
        },
      });
      return;
    }

    entry.timestamps.push(now);
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - entry.timestamps.length));
    next();
  };
};

// ─── Exported Limiters ────────────────────────────────────────────────────────

/** General API: 500 requests per minute (allows continuous dashboard polling) */
export const generalRateLimit = createRateLimiter(500, 60_000, 'api');

/** Location updates: 300 per minute (5/sec max for live navigation tracking) */
export const locationRateLimit = createRateLimiter(300, 60_000, 'loc');

/** Auth / sensitive routes: 30 per minute */
export const strictRateLimit = createRateLimiter(30, 60_000, 'auth');
