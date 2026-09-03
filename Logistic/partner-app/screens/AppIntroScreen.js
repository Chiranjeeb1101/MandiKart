import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// 3.8 seconds cinematic video-style intro
const INTRO_DURATION_MS = 3800;

export default function AppIntroScreen({ navigation }) {
  const [secondsRemaining, setSecondsRemaining] = useState(4);

  // Animation values for video motion simulation
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.4)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const truckSlideAnim = useRef(new Animated.Value(-120)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const speedLine1 = useRef(new Animated.Value(width)).current;
  const speedLine2 = useRef(new Animated.Value(width + 80)).current;
  const speedLine3 = useRef(new Animated.Value(width + 160)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Progress Bar Fill (0 to 1 over INTRO_DURATION_MS)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: INTRO_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // 2. Logo entrance with bounce & scale
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Cinematic Delivery Vehicle zooming across screen
    Animated.timing(truckSlideAnim, {
      toValue: width + 100,
      duration: 3200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // 4. Speed lines streaming effect (simulating fast camera motion)
    const runSpeedLine = (anim, duration, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -150,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    runSpeedLine(speedLine1, 900, 0);
    runSpeedLine(speedLine2, 1100, 200);
    runSpeedLine(speedLine3, 850, 400);

    // 5. Pulsing REC dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 6. Countdown ticker (4s -> 0s)
    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 7. Auto transition to Splash/Home after 3.8 seconds
    const autoNavTimer = setTimeout(() => {
      finishIntro();
    }, INTRO_DURATION_MS);

    return () => {
      clearInterval(timerInterval);
      clearTimeout(autoNavTimer);
    };
  }, []);

  const finishIntro = () => {
    Animated.timing(screenFadeOut, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('Splash');
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#04120a" />

      {/* Main Cinematic Video Surface */}
      <Animated.View style={[styles.videoCanvas, { opacity: screenFadeOut }]}>
        
        {/* Ambient Dark Green Neon Glow Background */}
        <View style={styles.ambientGlowTop} />
        <View style={styles.ambientGlowBottom} />

        {/* Video Camera Viewfinder Top Bar */}
        <View style={styles.cameraTopBar}>
          <View style={styles.recBadge}>
            <Animated.View style={[styles.recDot, { opacity: pulseAnim }]} />
            <Text style={styles.recText}>REC 4K • 60FPS</Text>
          </View>

          <View style={styles.telemetryPill}>
            <MaterialCommunityIcons name="satellite-variant" size={12} color="#4ade80" />
            <Text style={styles.telemetryText}>MANDI-NET GPS LIVE</Text>
          </View>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={finishIntro}
            activeOpacity={0.8}
          >
            <Text style={styles.skipBtnText}>SKIP</Text>
            <Ionicons name="play-forward" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Streaming Video Speed Lines */}
        <Animated.View
          style={[
            styles.speedLine,
            { top: height * 0.35, transform: [{ translateX: speedLine1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.speedLine,
            { top: height * 0.48, width: 90, opacity: 0.4, transform: [{ translateX: speedLine2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.speedLine,
            { top: height * 0.62, width: 140, opacity: 0.6, transform: [{ translateX: speedLine3 }] },
          ]}
        />

        {/* Moving Delivery Truck Video Element */}
        <Animated.View
          style={[
            styles.movingTruckTrack,
            { transform: [{ translateX: truckSlideAnim }] },
          ]}
        >
          {/* Headlight beam */}
          <View style={styles.headlightBeam} />
          {/* Vehicle icon */}
          <View style={styles.truckIconCircle}>
            <MaterialCommunityIcons name="truck-fast" size={26} color="#4ade80" />
          </View>
        </Animated.View>

        {/* Center Cinematic Brand Reveal */}
        <View style={styles.centerHeroBlock}>
          {/* Animated Logo Icon */}
          <Animated.View
            style={[
              styles.logoIconWrapper,
              {
                opacity: logoOpacityAnim,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            <View style={styles.logoIconInner}>
              <MaterialCommunityIcons name="sprout" size={48} color="#4ade80" />
            </View>
          </Animated.View>

          {/* Title & Badge */}
          <Animated.View style={[styles.titleGroup, { opacity: logoOpacityAnim }]}>
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>AGRI-LOGISTICS DISPATCH</Text>
            </View>

            <Text style={styles.brandTitleMain}>MandiKart</Text>
            <Text style={styles.brandTitlePartner}>PARTNER</Text>

            <Animated.Text style={[styles.taglineText, { opacity: subtitleAnim }]}>
              Fast Farm-to-Mandi Transit • Odisha
            </Animated.Text>
          </Animated.View>

          {/* Quick Value Pillars during 1-5s intro */}
          <Animated.View style={[styles.pillarRow, { opacity: subtitleAnim }]}>
            <View style={styles.pillarItem}>
              <Ionicons name="flash" size={14} color="#facc15" />
              <Text style={styles.pillarText}>Instant Dispatch</Text>
            </View>
            <View style={styles.pillarDivider} />
            <View style={styles.pillarItem}>
              <Ionicons name="shield-checkmark" size={14} color="#4ade80" />
              <Text style={styles.pillarText}>₹5L Insured</Text>
            </View>
            <View style={styles.pillarDivider} />
            <View style={styles.pillarItem}>
              <Ionicons name="wallet" size={14} color="#38bdf8" />
              <Text style={styles.pillarText}>Weekly Pay</Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Video HUD: Timeline Progress Bar & Timecode */}
        <View style={styles.bottomHud}>
          <View style={styles.timecodeRow}>
            <Text style={styles.timecodeLabel}>VIDEO INTRO</Text>
            <Text style={styles.timecodeCounter}>
              00:0{secondsRemaining} / 00:04
            </Text>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>

          {/* Interactive Tap Prompt */}
          <TouchableOpacity
            style={styles.tapPromptRow}
            onPress={finishIntro}
            activeOpacity={0.7}
          >
            <Text style={styles.tapPromptText}>Tap anywhere to enter app</Text>
            <Ionicons name="chevron-forward" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04120a',
  },
  videoCanvas: {
    flex: 1,
    backgroundColor: '#04120a',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -100,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#005129',
    opacity: 0.35,
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#0f6b3a',
    opacity: 0.25,
  },
  cameraTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs,
    zIndex: 20,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  recText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  telemetryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4ade80',
    letterSpacing: 0.6,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  speedLine: {
    position: 'absolute',
    width: 110,
    height: 2,
    backgroundColor: '#4ade80',
    opacity: 0.5,
    borderRadius: 1,
  },
  movingTruckTrack: {
    position: 'absolute',
    top: height * 0.28,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  headlightBeam: {
    width: 80,
    height: 28,
    backgroundColor: 'rgba(74, 222, 128, 0.18)',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: -10,
  },
  truckIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 81, 41, 0.8)',
    borderWidth: 1.5,
    borderColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  centerHeroBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    zIndex: 15,
  },
  logoIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    borderWidth: 2,
    borderColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  logoIconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#005129',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleGroup: {
    alignItems: 'center',
    gap: 2,
  },
  brandPill: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginBottom: 6,
  },
  brandPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4ade80',
    letterSpacing: 1.2,
  },
  brandTitleMain: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandTitlePartner: {
    fontSize: 26,
    fontWeight: '900',
    color: '#facc15',
    letterSpacing: 4,
    marginTop: -4,
  },
  taglineText: {
    fontSize: FONT.xs,
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  pillarDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomHud: {
    gap: SPACING.xs,
    zIndex: 20,
    paddingBottom: SPACING.sm,
  },
  timecodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timecodeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
  timecodeCounter: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4ade80',
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  tapPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
  },
  tapPromptText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
});
