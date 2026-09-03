/**
 * MandiKart Design System — Shadow Tokens
 *
 * Soft, diffused shadows for premium 3D depth.
 * No hard black shadows, no thick borders, no excessive glow.
 */

import { Platform, ViewStyle } from 'react-native';

/** Subtle elevation for flat elements */
export const MKShadows = {
  /** No shadow */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  /** Cards resting on background — soft lift */
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    } as ViewStyle,
    android: {
      elevation: 2,
    } as ViewStyle,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    } as ViewStyle,
  }),

  /** Standard card elevation — clear but soft */
  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    } as ViewStyle,
    android: {
      elevation: 4,
    } as ViewStyle,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    } as ViewStyle,
  }),

  /** Elevated / floating elements — e.g., bottom nav, modals */
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
    } as ViewStyle,
    android: {
      elevation: 8,
    } as ViewStyle,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
    } as ViewStyle,
  }),

  /** Button press-feedback / CTA — slightly lifted */
  button: Platform.select({
    ios: {
      shadowColor: '#2E7D32',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.20,
      shadowRadius: 6,
    } as ViewStyle,
    android: {
      elevation: 4,
    } as ViewStyle,
    default: {
      shadowColor: '#2E7D32',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.20,
      shadowRadius: 6,
    } as ViewStyle,
  }),
} as const;
