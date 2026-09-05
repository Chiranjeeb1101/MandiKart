/**
 * MandiKart — Auth & Authorization Middleware
 * Verifies JWT tokens, attaches req.user, and enforces role & ownership checks.
 */
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@mandikart/shared-types';
export interface AuthenticatedUser {
    id: string;
    phone: string;
    role: UserRole;
    email?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireRole(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
