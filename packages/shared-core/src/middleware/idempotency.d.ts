/**
 * MandiKart — Idempotency Middleware
 * Deduplicates repeated writes under rural network retries via Idempotency-Key header.
 */
import { Request, Response, NextFunction } from 'express';
export declare function requireIdempotency(req: Request, res: Response, next: NextFunction): void;
