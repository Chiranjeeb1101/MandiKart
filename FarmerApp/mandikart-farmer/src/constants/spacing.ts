/**
 * MandiKart Design System — Spacing Tokens
 *
 * 4-point grid for consistent rhythm across all screens.
 */

export const MKSpacing = {
  /** 2px — hairline gaps */
  xxs: 2,
  /** 4px — tight internal padding */
  xs: 4,
  /** 8px — compact spacing */
  sm: 8,
  /** 12px — small gaps */
  md: 12,
  /** 16px — standard padding / gaps */
  lg: 16,
  /** 20px — comfortable sections */
  xl: 20,
  /** 24px — generous card padding */
  '2xl': 24,
  /** 32px — section gaps */
  '3xl': 32,
  /** 40px — large section breaks */
  '4xl': 40,
  /** 48px — screen-level spacing */
  '5xl': 48,
  /** 64px — hero / header spacing */
  '6xl': 64,
} as const;

export const MKRadius = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px — standard card corners */
  lg: 16,
  /** 20px — large cards */
  xl: 20,
  /** 24px — premium cards */
  '2xl': 24,
  /** 9999px — pill / full round */
  full: 9999,
} as const;
