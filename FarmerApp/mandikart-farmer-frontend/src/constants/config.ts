/**
 * MandiKart Design System — Configuration Constants
 */

export const MKConfig = {
  appName: 'MandiKart',
  appTagline: 'Sell Smarter with MandiKart',
  appDescription: 'Find the right buyers and understand your selling options — all in one place.',

  /** Minimum touch target size (accessibility) */
  minTouchTarget: 44,

  /** Maximum content width for tablets/large phones */
  maxContentWidth: 480,

  /** Animation durations (ms) */
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
    verySlow: 600,
  },

  /** Currency symbol */
  currency: '₹',

  /** Default language */
  defaultLocale: 'en',
  supportedLocales: ['en', 'hi', 'mr'] as const,
} as const;
