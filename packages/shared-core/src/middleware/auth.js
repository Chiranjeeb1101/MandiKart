"use strict";
/**
 * MandiKart — Auth & Authorization Middleware
 * Verifies JWT tokens, attaches req.user, and enforces role & ownership checks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const shared_types_1 = require("@mandikart/shared-types");
const supabase_js_1 = require("../db/supabase.js");
const session_js_1 = require("../auth/session.js");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            data: null,
            meta: null,
            error: { code: 'UNAUTHORIZED', message: 'Missing or malformed Authorization header' },
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    // 0. Dev/Mock mode bypass — accept mock_jwt_token_*, mock_otp_token_*, mock_google_token_* tokens
    //    when Supabase is not configured. This allows full end-to-end testing without real auth.
    const isMockMode = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    const isMockToken = token.startsWith('mock_jwt_token_') || token.startsWith('mock_otp_token_') || token.startsWith('mock_google_token_');
    if (isMockMode && isMockToken) {
        const suffix = token.split('_').pop() || 'default';
        req.user = {
            id: `buyer_mock_${suffix}`,
            phone: '+91 98765 43210',
            role: shared_types_1.UserRole.BUYER,
        };
        next();
        return;
    }
    // 1. Authoritative 15-Day Rolling Session Check & Sliding Renewal
    const sessionCheck = session_js_1.SessionManager.validateAndTouch(token);
    if (sessionCheck.valid && sessionCheck.session) {
        req.user = {
            id: sessionCheck.session.userId,
            phone: sessionCheck.session.phone || '',
            role: sessionCheck.session.role,
        };
        res.setHeader('X-Session-Id', sessionCheck.session.sessionId);
        res.setHeader('X-Session-Expires-At', new Date(sessionCheck.session.expiresAt).toISOString());
        next();
        return;
    }
    // If token is an expired 15-day session, immediately reject with session expired code
    if (token.startsWith('mks_') && !sessionCheck.valid) {
        res.status(401).json({
            data: null,
            meta: null,
            error: {
                code: 'SESSION_EXPIRED',
                message: sessionCheck.error || 'Session expired due to 15 days of inactivity. Please log in again.',
            },
        });
        return;
    }
    try {
        const supabase = (0, supabase_js_1.getSupabaseClient)();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({
                data: null,
                meta: null,
                error: { code: 'INVALID_TOKEN', message: 'Token is expired or invalid' },
            });
            return;
        }
        req.user = {
            id: user.id,
            phone: user.phone || '',
            email: user.email,
            role: user.user_metadata?.role || shared_types_1.UserRole.FARMER,
        };
        next();
    }
    catch (err) {
        res.status(500).json({
            data: null,
            meta: null,
            error: { code: 'AUTH_ERROR', message: 'Failed to verify session authentication' },
        });
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                data: null,
                meta: null,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                data: null,
                meta: null,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
                },
            });
            return;
        }
        next();
    };
}
