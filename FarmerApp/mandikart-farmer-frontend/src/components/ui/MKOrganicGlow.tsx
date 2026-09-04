/**
 * MandiKart — Organic Glow Background Layer
 *
 * Replicates the AgroPremium "Organic Background Treatment" from the Stitch
 * reference (home_selling_command_center_refined_ui). Instead of the hard-edged
 * solid circles that used to be layered under a flat wash (which produced the
 * visible orange/green corner wedges), this uses SVG radial gradients — the
 * closest React Native equivalent to the CSS `blur()` used in the design — so
 * the orange (top-left) and green (bottom-right) glows fade out smoothly with
 * no hard edges, over an organic-white base with a lightened centre band.
 *
 * Usage: render as the FIRST child of a screen's root View (it is an absolute,
 * pointer-transparent fill layer):
 *
 *   <View style={{ flex: 1, backgroundColor: C.background }}>
 *     <MKOrganicGlow />
 *     ...content...
 *   </View>
 */

import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface MKOrganicGlowProps {
  /** Optional extra styles for the fill layer (rarely needed). */
  style?: StyleProp<ViewStyle>;
}

export const MKOrganicGlow: React.FC<MKOrganicGlowProps> = ({ style }) => {
  return (
    <View style={[styles.layer, style]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          {/* Top-left warm orange glow (background-accent-orange #FFB347) */}
          <RadialGradient id="mkOrganicGlowOrange" cx="0%" cy="0%" r="95%">
            <Stop offset="0%" stopColor="#FFB347" stopOpacity="0.40" />
            <Stop offset="30%" stopColor="#FFD9A8" stopOpacity="0.22" />
            <Stop offset="65%" stopColor="#FFF0DC" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#FFF0DC" stopOpacity="0" />
          </RadialGradient>

          {/* Bottom-right growth green glow (background-accent-green #A5D6A7) */}
          <RadialGradient id="mkOrganicGlowGreen" cx="100%" cy="100%" r="95%">
            <Stop offset="0%" stopColor="#A5D6A7" stopOpacity="0.45" />
            <Stop offset="30%" stopColor="#C4E5C6" stopOpacity="0.25" />
            <Stop offset="65%" stopColor="#E3F3E4" stopOpacity="0.10" />
            <Stop offset="100%" stopColor="#E3F3E4" stopOpacity="0" />
          </RadialGradient>

          {/* Lightened centre band (organic-white #F9FBF9, ~75% wide) */}
          <LinearGradient id="mkOrganicGlowCenter" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F9FBF9" stopOpacity="0" />
            <Stop offset="12%" stopColor="#F9FBF9" stopOpacity="0" />
            <Stop offset="38%" stopColor="#F9FBF9" stopOpacity="0.85" />
            <Stop offset="62%" stopColor="#F9FBF9" stopOpacity="0.85" />
            <Stop offset="88%" stopColor="#F9FBF9" stopOpacity="0" />
            <Stop offset="100%" stopColor="#F9FBF9" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Base organic-white */}
        <Rect x="0" y="0" width="100%" height="100%" fill="#F9FBF9" />
        {/* Ambient glows */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#mkOrganicGlowOrange)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#mkOrganicGlowGreen)" />
        {/* Centre lightening */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#mkOrganicGlowCenter)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
