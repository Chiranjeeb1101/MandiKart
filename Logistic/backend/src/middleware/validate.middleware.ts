import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Returns an Express middleware that validates `req.body` against the given
 * Zod schema. On failure, responds with HTTP 400 and a structured error list.
 *
 * Usage:
 *   router.post('/route', validate(mySchema), MyController.handler);
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      res.status(400).json({
        data: null,
        meta: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request body validation failed',
          details: errors,
        },
      });
      return;
    }

    // Replace req.body with the parsed + coerced data
    req.body = result.data;
    next();
  };
