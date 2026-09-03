/**
 * MandiKart — Global System Constants
 */

export const CONSTANTS = {
  // Authentication & Security
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  MAX_OTP_ATTEMPTS: 5,
  OTP_RATE_LIMIT_WINDOW_MINUTES: 10,
  OTP_MAX_REQUESTS_PER_WINDOW: 3,
  JWT_EXPIRY_HOURS: 24,

  // 15-Day Rolling Session Management
  SESSION_TTL_DAYS: 15,
  SESSION_TTL_SECONDS: 15 * 24 * 60 * 60, // 1,296,000 seconds
  SESSION_RENEW_THRESHOLD_SECONDS: 3 * 24 * 60 * 60, // Auto-extend if activity within 3 days of expiry

  // Concurrency & High Performance
  MAX_CONCURRENT_CONNECTIONS: 1000,
  LRU_CACHE_MAX_ENTRIES: 5000,

  // Concurrency & Order Lifecycle
  INVENTORY_RESERVATION_TTL_MINUTES: 15,
  IDEMPOTENCY_CACHE_TTL_SECONDS: 120,

  // Platform Commission & Thresholds
  DEFAULT_PLATFORM_FEE_PERCENT: 2.5,
  MAX_SANITY_PRICE_PER_UNIT: 100000,
  MIN_SANITY_PRICE_PER_UNIT: 1,

  // Caching TTLs (seconds)
  DASHBOARD_SUMMARY_CACHE_TTL: 45,
  MARKET_RATES_CACHE_TTL: 3600 * 6, // 6 hours

  // Storage Buckets
  STORAGE_BUCKETS: {
    PRODUCE_PHOTOS: 'produce-photos',
    DELIVERY_PROOF: 'delivery-proof',
    KYC_DOCS: 'kyc-docs',
  },
} as const;
