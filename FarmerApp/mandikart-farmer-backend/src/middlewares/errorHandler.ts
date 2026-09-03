import { Request, Response, NextFunction } from 'express';
import { ApiResponseEnvelope } from '../types/index.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  meta: ApiResponseEnvelope<T>['meta'] = null,
  statusCode = 200
): void {
  const payload: ApiResponseEnvelope<T> = {
    data,
    meta,
    error: null,
  };
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  code?: string,
  details?: unknown
): void {
  const payload: ApiResponseEnvelope<null> = {
    data: null,
    meta: null,
    error: {
      message,
      code,
      details,
    },
  };
  res.status(statusCode).json(payload);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error Handler]', err);
  sendError(res, err.message || 'Internal Server Error', 500, 'INTERNAL_ERROR');
}
