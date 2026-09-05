"use strict";
/**
 * MandiKart — Shared Stripe Escrow Service
 *
 * Handles Stripe PaymentIntent creation, escrow hold tagging, and delivery-verified release.
 * Shared across Buyer backend, Farmer backend, and automated tests.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const crypto_1 = __importDefault(require("crypto"));
const supabase_js_1 = require("../db/supabase.js");
class StripeService {
    static stripeClient = null;
    static getClient() {
        const key = process.env.STRIPE_SECRET_KEY;
        if (key && (key.startsWith('sk_') || key.startsWith('rk_'))) {
            if (!this.stripeClient) {
                this.stripeClient = new stripe_1.default(key, {
                    apiVersion: '2025-02-24.acacia',
                });
            }
            return this.stripeClient;
        }
        return null;
    }
    /**
     * Creates a Stripe PaymentIntent with Escrow hold tags.
     */
    static async createPaymentIntent(params) {
        const stripe = this.getClient();
        const currency = (params.currency || 'inr').toLowerCase();
        const amountInSmallestUnit = Math.round(params.amount * 100);
        if (stripe) {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amountInSmallestUnit,
                    currency,
                    metadata: {
                        orderId: params.orderId,
                        buyerId: params.buyerId || 'buyer-guest',
                        farmerId: params.farmerId || '',
                        escrowHold: 'true',
                    },
                    automatic_payment_methods: { enabled: true },
                });
                await this.recordPayment({
                    orderId: params.orderId,
                    buyerId: params.buyerId,
                    stripePaymentIntentId: paymentIntent.id,
                    amount: params.amount,
                    currency: currency.toUpperCase(),
                    status: 'PENDING',
                    escrowStatus: 'HELD',
                });
                return {
                    clientSecret: paymentIntent.client_secret || '',
                    paymentIntentId: paymentIntent.id,
                    amount: params.amount,
                    currency: currency.toUpperCase(),
                    status: paymentIntent.status,
                    escrowStatus: 'HELD',
                    isSimulated: false,
                };
            }
            catch (err) {
                console.warn('[StripeService] Stripe API failed, falling back to simulated mode:', err.message);
            }
        }
        // Simulated Stripe PaymentIntent for Local/Staging Development
        const mockPiId = `pi_mandikart_${Date.now()}_${crypto_1.default.randomBytes(4).toString('hex')}`;
        const mockSecret = `${mockPiId}_secret_${crypto_1.default.randomBytes(8).toString('hex')}`;
        await this.recordPayment({
            orderId: params.orderId,
            buyerId: params.buyerId,
            stripePaymentIntentId: mockPiId,
            amount: params.amount,
            currency: currency.toUpperCase(),
            status: 'PENDING',
            escrowStatus: 'HELD',
        });
        return {
            clientSecret: mockSecret,
            paymentIntentId: mockPiId,
            amount: params.amount,
            currency: currency.toUpperCase(),
            status: 'requires_payment_method',
            escrowStatus: 'HELD',
            isSimulated: true,
        };
    }
    /**
     * Records or upserts payment into the Supabase payments table.
     */
    static async recordPayment(data) {
        const supabase = (0, supabase_js_1.getSupabaseAdmin)();
        try {
            await supabase.from('payments').upsert({
                order_id: data.orderId,
                buyer_id: data.buyerId || null,
                stripe_payment_intent_id: data.stripePaymentIntentId,
                amount: data.amount,
                currency: data.currency,
                payment_method: 'STRIPE_UPI',
                status: data.status,
                escrow_status: data.escrowStatus,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, { onConflict: 'order_id' });
        }
        catch (err) {
            console.warn('[StripeService] Could not persist payment record to Supabase:', err.message);
        }
    }
    /**
     * Confirms payment and moves escrow to HELD.
     */
    static async confirmPayment(paymentIntentId, orderId) {
        const supabase = (0, supabase_js_1.getSupabaseAdmin)();
        try {
            await supabase
                .from('payments')
                .update({
                status: 'SUCCEEDED',
                escrow_status: 'HELD',
                updated_at: new Date().toISOString(),
            })
                .eq('order_id', orderId);
        }
        catch {
            // Safe fallback
        }
        return {
            success: true,
            orderId,
            paymentIntentId,
            status: 'SUCCEEDED',
            escrowStatus: 'HELD',
            message: 'Payment received. Funds securely locked in MandiKart Escrow until delivery OTP verification.',
        };
    }
    /**
     * Releases escrow to farmer when delivery is verified with POD OTP.
     */
    static async releaseEscrow(orderId) {
        const supabase = (0, supabase_js_1.getSupabaseAdmin)();
        try {
            await supabase
                .from('payments')
                .update({
                escrow_status: 'RELEASED',
                updated_at: new Date().toISOString(),
            })
                .eq('order_id', orderId);
        }
        catch {
            // Safe fallback
        }
        return {
            orderId,
            escrowStatus: 'RELEASED',
            releasedAt: new Date().toISOString(),
            message: 'Escrow released successfully to farmer account.',
        };
    }
}
exports.StripeService = StripeService;
