/**
 * MandiKart — MKBackground Component
 * 
 * Implements the approved organic background visual identity:
 * Soft White base + subtle blurred orange and green ambient glows.
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

export const MKBackground: React.FC<MKBackgroundProps> = ({
  children,
  style,
  disableSafeArea = false,
}) => {
  const content = (
    <View style={[styles.container, style]}>
      {/* Organic Ambient Glow SVG Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height="100%" width="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          <Defs>
            {/* Top-Left Ambient Warm Harvest Orange Glow */}
            <RadialGradient
              id="orangeAura"
              cx="12%"
              cy="8%"
              rx="65%"
              ry="55%"
              fx="12%"
              fy="8%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#EA580C" stopOpacity="0.35" />
              <Stop offset="45%" stopColor="#FB923C" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#F5EFE6" stopOpacity="0" />
            </RadialGradient>

            {/* Bottom-Right Ambient Growth Emerald Green Glow */}
            <RadialGradient
              id="greenAura"
              cx="88%"
              cy="92%"
              rx="70%"
              ry="60%"
              fx="88%"
              fy="92%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#15803D" stopOpacity="0.32" />
              <Stop offset="40%" stopColor="#4ADE80" stopOpacity="0.16" />
              <Stop offset="100%" stopColor="#F5EFE6" stopOpacity="0" />
            </RadialGradient>

            {/* Center Subtle Golden Sunlight Glow */}
            <RadialGradient
              id="sunlightAura"
              cx="50%"
              cy="45%"
              rx="60%"
              ry="45%"
              fx="50%"
              fy="45%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FBBF24" stopOpacity="0.18" />
              <Stop offset="60%" stopColor="#FEF3C7" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#F5EFE6" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Base Rich Warm Earthy Background */}
          <Rect x="0" y="0" width="100%" height="100%" fill="#F5EFE6" />

          {/* Ambient Glows */}
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orangeAura)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#greenAura)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#sunlightAura)" />
        </Svg>
      </View>

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
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#FAF9F6',
  },
  contentLayer: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
});
