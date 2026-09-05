/**
 * MandiKart — Global System Constants
 */
export declare const CONSTANTS: {
    readonly OTP_LENGTH: 6;
    readonly OTP_EXPIRY_MINUTES: 5;
    readonly MAX_OTP_ATTEMPTS: 5;
    readonly OTP_RATE_LIMIT_WINDOW_MINUTES: 10;
    readonly OTP_MAX_REQUESTS_PER_WINDOW: 3;
    readonly JWT_EXPIRY_HOURS: 24;
    readonly SESSION_TTL_DAYS: 15;
    readonly SESSION_TTL_SECONDS: number;
    readonly SESSION_RENEW_THRESHOLD_SECONDS: number;
    readonly MAX_CONCURRENT_CONNECTIONS: 1000;
    readonly LRU_CACHE_MAX_ENTRIES: 5000;
    readonly INVENTORY_RESERVATION_TTL_MINUTES: 15;
    readonly IDEMPOTENCY_CACHE_TTL_SECONDS: 120;
    readonly DEFAULT_PLATFORM_FEE_PERCENT: 2.5;
    readonly MAX_SANITY_PRICE_PER_UNIT: 100000;
    readonly MIN_SANITY_PRICE_PER_UNIT: 1;
    readonly DASHBOARD_SUMMARY_CACHE_TTL: 45;
    readonly MARKET_RATES_CACHE_TTL: number;
    readonly STORAGE_BUCKETS: {
        readonly PRODUCE_PHOTOS: "produce-photos";
        readonly DELIVERY_PROOF: "delivery-proof";
        readonly KYC_DOCS: "kyc-docs";
    };
};
