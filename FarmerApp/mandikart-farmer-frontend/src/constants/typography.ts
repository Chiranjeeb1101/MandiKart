/**
 * MandiKart Design System — Typography Tokens
 *
 * Hierarchy (readability-first):
 *   heading   → page titles
 *   title     → section titles / important values
 *   price     → prices & estimated net return (strong weight)
 *   body      → standard body copy
 *   button    → button labels
 *   caption   → supporting / muted info
 *   label     → form labels
 *
 * Must render correctly for: English, Hindi, Marathi.
 * Layouts must not break when translated strings are longer.
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  android: 'sans-serif',
  ios: 'System',
  default: 'System',
});

const fontFamilyMedium = Platform.select({
  android: 'sans-serif-medium',
  ios: 'System',
  default: 'System',
});

export const MKTypography = {
  // ── Page Headings ────────────────────────────────────────
  h1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,

  // ── Section Titles / Important Values ────────────────────
  title: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,

  titleSmall: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  // ── Prices & Net Return (strong emphasis) ────────────────
  price: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.3,
  } as TextStyle,

  priceSmall: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  } as TextStyle,

  // ── Body ─────────────────────────────────────────────────
  body: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,

  // ── Buttons ──────────────────────────────────────────────
  button: {
    fontFamily: fontFamilyMedium,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamilyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  } as TextStyle,

  // ── Captions & Muted ─────────────────────────────────────
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,

  overline: {
    fontFamily: fontFamilyMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  // ── Form Labels ──────────────────────────────────────────
  label: {
    fontFamily: fontFamilyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  } as TextStyle,
} as const;
