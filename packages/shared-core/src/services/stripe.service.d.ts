/**
 * MandiKart — Shared Stripe Escrow Service
 *
 * Handles Stripe PaymentIntent creation, escrow hold tagging, and delivery-verified release.
 * Shared across Buyer backend, Farmer backend, and automated tests.
 */
export interface CreateIntentParams {
    orderId: string;
    amount: number;
    currency?: string;
    buyerId?: string;
    farmerId?: string;
    customerEmail?: string;
}
export interface StripeIntentResult {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    escrowStatus: 'HELD';
    isSimulated: boolean;
}
export declare class StripeService {
    private static stripeClient;
    private static getClient;
    /**
     * Creates a Stripe PaymentIntent with Escrow hold tags.
     */
    static createPaymentIntent(params: CreateIntentParams): Promise<StripeIntentResult>;
    /**
     * Records or upserts payment into the Supabase payments table.
     */
    private static recordPayment;
    /**
     * Confirms payment and moves escrow to HELD.
     */
    static confirmPayment(paymentIntentId: string, orderId: string): Promise<{
        success: boolean;
        orderId: string;
        paymentIntentId: string;
        status: string;
        escrowStatus: string;
        message: string;
    }>;
    /**
     * Releases escrow to farmer when delivery is verified with POD OTP.
     */
    static releaseEscrow(orderId: string): Promise<{
        orderId: string;
        escrowStatus: string;
        releasedAt: string;
        message: string;
    }>;
}
