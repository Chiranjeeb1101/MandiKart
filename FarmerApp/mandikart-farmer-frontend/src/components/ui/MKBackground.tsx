/**
 * MandiKart — MKBackground Component (High Intensity Ambient + Fast Performance)
 * 
 * Implements the approved organic background visual identity:
 * Soft warm base + vibrant, high-intensity orange and green ambient glows.
 * Optimized with React.memo to prevent unnecessary SVG re-renders.
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface MKBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disableSafeArea?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Memoized SVG background layer to guarantee 60fps and instant touch responses
const AmbientGlowSvg = React.memo(() => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg height="100%" width="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
      <Defs>
        {/* Top-Left Rich Vibrant Harvest Orange Ambient Glow */}
        <RadialGradient
          id="orangeAura"
          cx="15%"
          cy="6%"
          rx="80%"
          ry="65%"
          fx="15%"
          fy="6%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#e97739ff" stopOpacity="0.32" />
          <Stop offset="35%" stopColor="#F97316" stopOpacity="0.12" />
          <Stop offset="70%" stopColor="#e16a33ff" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </RadialGradient>

        {/* Bottom-Right Rich Vibrant Growth Emerald Green Glow */}
        <RadialGradient
          id="greenAura"
          cx="85%"
          cy="92%"
          rx="85%"
          ry="70%"
          fx="85%"
          fy="92%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#15803D" stopOpacity="0.28" />
          <Stop offset="35%" stopColor="#22C55E" stopOpacity="0.08" />
          <Stop offset="70%" stopColor="#86EFAC" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </RadialGradient>

        {/* Center Golden Sunlight Aura */}
        <RadialGradient
          id="sunlightAura"
          cx="50%"
          cy="48%"
          rx="65%"
          ry="50%"
          fx="50%"
          fy="48%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
          <Stop offset="55%" stopColor="#FDE68A" stopOpacity="0.10" />
          <Stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Base Canvas */}
      <Rect x="0" y="0" width="100%" height="100%" fill="#FAF8F5" />

      {/* High-Intensity Ambient Glows */}
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#orangeAura)" />
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#greenAura)" />
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#sunlightAura)" />
    </Svg>
  </View>
));

export const MKBackground: React.FC<MKBackgroundProps> = ({
  children,
  style,
  disableSafeArea = false,
}) => {
  const content = (
    <View style={[styles.container, style]}>
      <AmbientGlowSvg />
      {/* Main Content Layer */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );

  if (disableSafeArea) {
    return content;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#FAF8F5',
  },
  contentLayer: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
});
