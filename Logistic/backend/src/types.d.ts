declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
        [key: string]: any;
      };
    }
  }
}

declare module '@mandikart/shared-core';
declare module '@mandikart/shared-types';
declare module '@mandikart/shared-config';
