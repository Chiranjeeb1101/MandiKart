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
            {/* Top-Left Ambient Warm Orange Glow */}
            <RadialGradient
              id="orangeAura"
              cx="10%"
              cy="10%"
              rx="60%"
              ry="50%"
              fx="10%"
              fy="10%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#FFB347" stopOpacity="0.22" />
              <Stop offset="50%" stopColor="#FFF3E0" stopOpacity="0.10" />
              <Stop offset="100%" stopColor="#FAFAF7" stopOpacity="0" />
            </RadialGradient>

            {/* Bottom-Right Ambient Growth Green Glow */}
            <RadialGradient
              id="greenAura"
              cx="90%"
              cy="90%"
              rx="65%"
              ry="55%"
              fx="90%"
              fy="90%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#A5D6A7" stopOpacity="0.25" />
              <Stop offset="50%" stopColor="#E8F5E9" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#FAFAF7" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Base Soft White Background */}
          <Rect x="0" y="0" width="100%" height="100%" fill="#FAF9F6" />

          {/* Ambient Glows */}
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#orangeAura)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#greenAura)" />
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
    position: 'relative',
    backgroundColor: '#FAF9F6',
  },
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
});
