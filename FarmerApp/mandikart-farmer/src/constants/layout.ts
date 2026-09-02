/**
 * MandiKart Design System — Layout Tokens
 *
 * Centralized layout dimensions and rules to ensure 100% responsive
 * consistency across all screen sizes and device configurations.
 */

export const MKLayout = {
  /** Screen horizontal margin/padding */
  screenPaddingHorizontal: 18,
  
  /** Standard card internal padding */
  cardPadding: 16,
  
  /** Large card internal padding */
  cardPaddingLarge: 20,
  
  /** Standard section gap */
  sectionGap: 24,
  
  /** Standard row minimum height */
  rowMinHeight: 60,
  
  /** Standard button minimum height */
  buttonMinHeight: 48,

  /** Touch target minimum size (44x44) */
  minTouchTarget: 44,

  /** Height reserved for fixed bottom tab navigation */
  bottomTabHeight: 70,

  /** Minimum extra clearance above bottom tab bar */
  bottomContentClearance: 32,
} as const;
