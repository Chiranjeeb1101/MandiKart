/**
 * MandiKart Farmer App — Celebration Modal ("All Set! We're Ready to Go!")
 * Built with UI UX Pro Max animation and design styling.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {
  Check,
  Sparkles,
  Tractor,
  Sprout,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CelebrationModalProps {
  visible: boolean;
  onContinue: () => void;
  farmerName?: string;
  farmLocation?: string;
}

export function CelebrationModal({
  visible,
  onContinue,
  farmerName = 'Farmer',
  farmLocation = 'Odisha, India',
}: CelebrationModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const badgeBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(badgeBounce, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous subtle pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      badgeBounce.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onContinue}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Confetti / Sparkle Accents */}
          <View style={styles.sparkleTopLeft}>
            <Sparkles size={24} color="#FFB300" />
          </View>
          <View style={styles.sparkleTopRight}>
            <Sparkles size={20} color="#2E7D32" />
          </View>

          {/* Central Pulsing Check Badge */}
          <Animated.View
            style={[
              styles.badgeOuterRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.badgeMiddleRing}>
              <View style={styles.badgeCenterCircle}>
                <Check size={38} color="#FFFFFF" strokeWidth={3.5} />
              </View>
            </View>
          </Animated.View>

          {/* Pill Badge */}
          <View style={styles.statusPill}>
            <ShieldCheck size={14} color="#1B5E20" strokeWidth={2.4} />
            <Text style={styles.statusPillText}>ALL SET • READY TO GO</Text>
          </View>

          {/* Headline & Subtitle */}
          <Text style={styles.title}>
            You're Ready to Sell,{'\n'}
            <Text style={styles.titleHighlight}>{farmerName}!</Text> 🌾
          </Text>

          <Text style={styles.subtitle}>
            Your farm profile and produce catalog are now active. Connect directly with verified buyers for guaranteed daily market rates.
          </Text>

          {/* Farm details summary strip */}
          <View style={styles.infoStrip}>
            <View style={styles.infoStripItem}>
              <Sprout size={16} color="#2E7D32" />
              <Text style={styles.infoStripText}>Zero Middleman</Text>
            </View>
            <View style={styles.infoStripDivider} />
            <View style={styles.infoStripItem}>
              <Tractor size={16} color="#EF6C00" />
              <Text style={styles.infoStripText}>Farmgate Pickup</Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={onContinue}
          >
            <Text style={styles.continueButtonText}>GO TO DASHBOARD</Text>
            <View style={styles.continueIconCircle}>
              <ArrowRight size={18} color="#1B5E20" strokeWidth={2.8} />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 26,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 10,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 18,
    left: 20,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 18,
    right: 20,
  },
  badgeOuterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeMiddleRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCenterCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1B5E20',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  titleHighlight: {
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 22,
  },
  infoStripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoStripDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  infoStripText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  continueIconCircle: {
    position: 'absolute',
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
