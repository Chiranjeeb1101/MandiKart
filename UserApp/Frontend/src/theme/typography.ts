import { StyleSheet } from 'react-native';

export const Typography = {
  fontFamily: {
    regular: undefined, // system default (Inter-like)
    medium: undefined,
    semiBold: undefined,
    bold: undefined,
  },

  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export const textStyles = StyleSheet.create({
  displayLg: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  titleLg: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  labelLg: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  priceLg: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  priceMd: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  priceSm: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
