import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, StatusBar, Animated, Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    // Floating loop for background icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto transition to Onboarding
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim, progressAnim, floatAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" translucent />

      {/* Deep Rich Emerald Gradient Background */}
      <LinearGradient
        colors={['#011F16', '#064E3B', '#047857', '#10B981']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      />

      {/* Decorative Ambient Background Mesh Circles */}
      <View style={styles.bgGlowHalo} />
      {/* <View style={styles.bgCircleTopLeft} /> */}
      {/* <View style={styles.bgCircleBottomRight} /> */}

      {/* Floating Organic Produce Watermarks */}
      <Animated.View style={[styles.watermark, styles.wmTopLeft, { transform: [{ translateY: floatY }] }]}>
        <Text style={styles.wmEmoji}>🌿</Text>
      </Animated.View>
      <Animated.View style={[styles.watermark, styles.wmTopRight, { transform: [{ translateY: Animated.multiply(floatY, -1) }] }]}>
        <Text style={styles.wmEmoji}>🌾</Text>
      </Animated.View>
      <Animated.View style={[styles.watermark, styles.wmMidRight, { transform: [{ translateY: floatY }] }]}>
        <Text style={styles.wmEmoji}>🍎</Text>
      </Animated.View>
      <Animated.View style={[styles.watermark, styles.wmBottomLeft, { transform: [{ translateY: Animated.multiply(floatY, -1) }] }]}>
        <Text style={styles.wmEmoji}>🍋</Text>
      </Animated.View>
      <Animated.View style={[styles.watermark, styles.wmBottomRight, { transform: [{ translateY: floatY }] }]}>
        <Text style={styles.wmEmoji}>🥦</Text>
      </Animated.View>

      {/* Center Hero Logo Area */}
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.haloRing}>
          <View style={styles.logoBadgeOuter}>
            <View style={styles.logoBadgeInner}>
              <Text style={styles.logoEmoji}>🌾</Text>
            </View>
          </View>
        </View>

        <Text style={styles.brandName}>MandiKart</Text>
        <Text style={styles.tagline}>DIRECT FARM MARKETPLACE</Text>

        <View style={styles.qualityPill}>
          <Ionicons name="sparkles" size={13} color="#FEF08A" />
          <Text style={styles.qualityText}>Fresh Harvest • Nashik & Pune</Text>
        </View>
      </Animated.View>

      {/* Footer Loader */}
      <Animated.View style={[styles.footer, { opacity: opacityAnim }]}>
        {/* Loading Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <Text style={styles.footerText}>Connecting Indian Farmers & Buyers</Text>
        <Text style={styles.versionText}>🇮🇳 Made with ❤️ in India • v1.2.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#011F16',
  },
  // Ambient Mesh Background
  bgGlowHalo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    top: '30%',
  },
  bgCircleTopLeft: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  bgCircleBottomRight: {
    position: 'absolute',
    bottom: -120,
    right: -80,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(4, 120, 87, 0.35)',
  },
  // Floating Watermarks
  watermark: {
    position: 'absolute',
    opacity: 0.18,
  },
  wmEmoji: { fontSize: 36 },
  wmTopLeft: { top: 80, left: 32, transform: [{ rotate: '-15deg' }] },
  wmTopRight: { top: 100, right: 36, transform: [{ rotate: '20deg' }] },
  wmMidRight: { top: '45%', right: 24, transform: [{ rotate: '-10deg' }] },
  wmBottomLeft: { bottom: 140, left: 40, transform: [{ rotate: '15deg' }] },
  wmBottomRight: { bottom: 120, right: 48, transform: [{ rotate: '-25deg' }] },

  // Hero Logo Area
  logoArea: {
    alignItems: 'center',
    gap: 10,
  },
  haloRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(254, 240, 138, 0.3)',
    marginBottom: Spacing.xs,
  },
  logoBadgeOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  logoEmoji: {
    fontSize: 42,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 3,
    marginTop: -4,
  },
  qualityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(254, 240, 138, 0.4)',
    marginTop: 8,
    ...Shadows.sm,
  },
  qualityText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    gap: 10,
    width: '80%',
  },
  progressTrack: {
    width: 150,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
  },
});
