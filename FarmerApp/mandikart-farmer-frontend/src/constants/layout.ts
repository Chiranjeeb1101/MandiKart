/**
 * MandiKart Design System — Layout Tokens & Responsive Utilities
 *
 * Centralized layout dimensions and rules to ensure 100% responsive
 * consistency across all screen sizes and device configurations:
 * - Real Android phones (notches, hole punches, 3-button nav, gesture bars)
 * - Android emulator
 * - React Native Web / Chrome
 */

import { Platform } from 'react-native';

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

  /** Base height reserved for fixed bottom tab navigation bar */
  bottomTabHeight: 62,

  /** Minimum extra clearance above bottom tab bar for scroll content */
  bottomContentClearance: 32,

  /**
   * Deterministic safe top padding for screen headers across Web, iOS, and Android
   */
  getTopHeaderPadding: (insets: { top: number }, extra = 8): number => {
    if (Platform.OS === 'web') return 16;
    return Math.max(insets.top, 20) + extra;
  },

  /**
   * Deterministic bottom padding for scroll content to clear the bottom navigation bar
   */
  getBottomTabClearance: (insets: { bottom: number }, extra = 32): number => {
    const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 10) : insets.bottom;
    return 62 + bottomInset + extra;
  },
} as const;
