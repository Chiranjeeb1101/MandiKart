import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🌾',
    badge: 'DIRECT FROM FARM',
    title: 'Freshly Harvested\nDirect From Local Farmers',
    description: 'Bypass middlemen! Get chemical-free vegetables, fruits, and grains harvested daily from Nashik & Pune farms.',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
    bg: '#F0FDF4',
    accentColor: '#166534',
  },
  {
    id: '2',
    emoji: '🍎',
    badge: 'DAILY MANDI RATES',
    title: 'Transparent Pricing\n& Verified Quality',
    description: 'Compare live mandi prices across 80+ categories. 100% quality checked with easy instant refunds.',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600',
    bg: '#FFFBEB',
    accentColor: '#B45309',
  },
  {
    id: '3',
    emoji: '⚡',
    badge: 'COLD-CHAIN EV DELIVERY',
    title: 'Express Delivery',
    description: 'Delivered in temperature-controlled eco EV vans. Track your driver live from farm pick-up to your doorstep.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    bg: '#EFF6FF',
    accentColor: '#1D4ED8',
  },
];

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      listRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  const handleDemoGuest = () => {
    signIn(); // Directly enters main app in sample mode
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.brandName}>MandiKart</Text>
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            {/* Hero Image Container */}
            <View style={styles.imageCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.slideImage} />
              <View style={styles.emojiBadge}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
              </View>
            </View>

            {/* Slide Text Content */}
            <View style={styles.contentWrap}>
              <View style={[styles.badgeTag, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
                <Text style={[styles.badgeText, { color: item.accentColor }]}>{item.badge}</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Animated Page Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={goToNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started Now' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>

        {/* Guest Demo Login Option */}
        {/* <TouchableOpacity style={styles.guestBtn} onPress={handleDemoGuest} activeOpacity={0.85}>
          <Ionicons name="flash-outline" size={15} color={Colors.primary} />
          <Text style={styles.guestBtnText}>Explore App in Demo Mode</Text>
        </TouchableOpacity> */}

        {/* Sign In Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    zIndex: 10,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 16, fontWeight: '800', color: Colors.white },
  brandName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  skipBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
  },
  skipText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  // Slides
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  imageCard: {
    width: width - 48,
    height: 220,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Shadows.md,
  },
  slideImage: { width: '100%', height: '100%' },
  emojiBadge: {
    position: 'absolute',
    bottom: 12, right: 12,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.md,
  },
  emojiText: { fontSize: 24 },
  contentWrap: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  badgeTag: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: {
    fontSize: 24, fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xs,
  },
  // Footer
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotInactive: { width: 8, backgroundColor: Colors.gray300 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    width: '100%',
    height: 50,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    width: '100%',
    height: 44,
    borderRadius: BorderRadius.full,
  },
  guestBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 2 },
  loginText: { fontSize: 13, color: Colors.textSecondary },
  loginLink: { fontSize: 13, color: Colors.primary, fontWeight: '800' },
});
