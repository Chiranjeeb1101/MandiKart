import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function PartnerSplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative background glow circles */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="sprout" size={18} color={COLORS.primary} />
            <Text style={styles.brandBadgeText}>MandiKart Partner Agro-Logistics</Text>
          </View>
        </View>

        {/* Central Illustration & Logo */}
        <View style={styles.centerSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="truck-delivery" size={48} color={COLORS.primary} />
          </View>

          <Text style={styles.appTitle}>MandiKart Partner</Text>
          <Text style={styles.appSubtitle}>MandiKart Partner Delivery Network</Text>

          {/* Value proposition pill */}
          <View style={styles.heroCard}>
            <View style={styles.benefitRow}>
              <Ionicons name="flash" size={18} color={COLORS.accent} />
              <Text style={styles.benefitText}>Direct Farm Pickups & Guaranteed Payouts</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
              <Text style={styles.benefitText}>Accidental Insurance & Fuel Subsidies</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="trending-up" size={18} color={COLORS.success} />
              <Text style={styles.benefitText}>Earn up to ₹28,000+ per month with bonuses</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Login as Delivery Partner</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Register as New Partner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.4,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.accentLight,
    opacity: 0.35,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandBadgeText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  explorerButtonText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  centerSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  appTitle: {
    fontSize: FONT.hero,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: FONT.base,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  benefitText: {
    fontSize: FONT.base,
    color: COLORS.onSurface,
    fontWeight: '600',
    flex: 1,
  },
  bottomSection: {
    gap: SPACING.md,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT.md,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: RADIUS.lg,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT.md,
    fontWeight: '800',
  },
});
