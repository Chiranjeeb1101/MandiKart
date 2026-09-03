/**
 * MandiKart — Idempotency Middleware
 * Deduplicates repeated writes under rural network retries via Idempotency-Key header.
 */

import { Request, Response, NextFunction } from 'express';
import { CONSTANTS } from '@mandikart/shared-config';

interface CachedResponse {
  statusCode: number;
  body: any;
  timestamp: number;
}

const idempotencyStore = new Map<string, CachedResponse>();

// Auto-cleanup stale keys periodically
setInterval(() => {
  const now = Date.now();
  const ttlMs = CONSTANTS.IDEMPOTENCY_CACHE_TTL_SECONDS * 1000;
  for (const [key, entry] of idempotencyStore.entries()) {
    if (now - entry.timestamp > ttlMs) {
      idempotencyStore.delete(key);
    }
  }
}, 30000);

export function requireIdempotency(req: Request, res: Response, next: NextFunction): void {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    // In production this can be enforced strictly; for non-mutating or dev it can pass
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
      res.setHeader('Warning', '199 - Missing Idempotency-Key header on mutating request');
    }
    next();
    return;
  }

  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');
    res.status(cached.statusCode).json(cached.body);
    return;
  }

  // Intercept json() response to cache on successful completion
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
}
