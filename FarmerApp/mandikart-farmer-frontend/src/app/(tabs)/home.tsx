/**
 * MandiKart Farmer App — Home Screen (Selling Command Center)
 *
 * Built using the MandiKart production layout primitives (MKScreen, MKSection, MKCard).
 * 100% responsive, robust spacing, content-driven heights, safe area aware.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Bell,
  Plus,
  Star,
  Flame,
  ArrowRight,
  FileText,
  Truck,
  Wallet,
} from 'lucide-react-native';
import { MKScreen, MKSection, MKCard, MKButton, MKStatusBadge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWtbtdYEsJNCwEKZoi1xfJOZtPORnKD9GPoltpHd8eia8fYdHGOcijL8FHdga770RJTQzAlyHwu2wsbwtX555geY0I6OLsCVJnHMI3NO3tdHMP9YUctgl9S7vP0j7O9hSnek9ToXwIseCbKhXxVlUVQeix2P5A-k9Jo4H6Rlg7z1pLlsu7pgQsvSEkAow2Qvu0M777ZEEfveoswBRPceVJNWkptJtiy_PAbWmzMVcsTX143_2IR9_Kw';

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Ramesh';
  const locationName = user?.district
    ? `${user.district}, ${user.state}`
    : 'Nashik, Maharashtra';

  return (
    <MKScreen>
      {/* ── 1. Top App Bar ── */}
      <View style={styles.topAppBar}>
        <View style={styles.farmerProfileHeader}>
          <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatarImage} />
          <View style={styles.greetingContainer}>
            <Text numberOfLines={1} style={styles.greetingTitle}>
              Namaste, {farmerName} 👋
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={MKColors.primaryGreen} strokeWidth={2.2} />
              <Text numberOfLines={1} style={styles.locationText}>
                {locationName}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.notificationBtn,
            pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() => router.push('/more/notifications')}
        >
          <Bell size={20} color={MKColors.textPrimary} strokeWidth={2} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </Pressable>
      </View>

      {/* ── 2. Sell Today Hero Card ── */}
      <Pressable
        onPress={() => router.push('/(tabs)/produce')}
        style={({ pressed }) => [
          styles.heroSellCard,
          pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
        ]}
      >
        <View style={styles.heroSellContent}>
          <Text style={styles.heroSellTitle}>What do you want{'\n'}to sell today?</Text>
          <Text style={styles.heroSellSubtitle}>
            Find verified buyers and maximize your net returns
          </Text>
          <View pointerEvents="none" style={styles.addProduceBtnWrapper}>
            <View style={styles.inlineAddBtn}>
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.inlineAddBtnText}>Add Produce</Text>
            </View>
          </View>
        </View>
        <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.heroBasketImage} />
      </Pressable>

      {/* ── 3. Section: Best Opportunity For You ── */}
      <MKSection
        title="Best Opportunity for You"
        actionText="View all"
        onActionPress={() => router.push('/(tabs)/sell')}
      >
        <MKCard padding="none" onPress={() => router.push('/(tabs)/sell')}>
          {/* Crop Header */}
          <View style={styles.cropHeaderRow}>
            <View style={styles.cropInfoRow}>
              <Image source={{ uri: ONION_PHOTO_URI }} style={styles.cropImage} />
              <View style={styles.cropDetails}>
                <View style={styles.recommendedBadge}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
                <Text numberOfLines={1} style={styles.cropName}>
                  Onion • Grade A
                </Text>
                <Text numberOfLines={1} style={styles.cropQty}>
                  1,000 KG Available
                </Text>
              </View>
            </View>
            <View style={styles.badgeWrapper}>
              <MKStatusBadge label="94% Match" type="match" />
            </View>
          </View>

          {/* Net Return */}
          <View style={styles.netReturnRow}>
            <Text style={styles.netReturnLabel}>Estimated Net Return</Text>
            <Text style={styles.netReturnValue}>
              ₹22.00 <Text style={styles.unitText}>/kg</Text>
            </Text>
          </View>

          {/* Breakdown Grid */}
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Selling Price</Text>
              <Text style={styles.breakdownValue}>₹24.00 /kg</Text>
            </View>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Transport Cost</Text>
              <Text style={styles.breakdownValue}>₹2.00 /kg</Text>
            </View>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Market Demand</Text>
              <View style={styles.demandRow}>
                <Text style={styles.demandValue}>High</Text>
                <Flame size={14} color={MKColors.accentOrange} fill={MKColors.accentOrange} />
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View pointerEvents="none" style={styles.decisionActionWrapper}>
            <MKButton
              title="View Best Options"
              onPress={() => {}}
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight size={18} color={MKColors.primaryGreen} strokeWidth={2.2} />}
            />
          </View>
        </MKCard>
      </MKSection>

      {/* ── 4. Section: Today at a Glance ── */}
      <MKSection title="Today at a Glance">
        <View style={styles.metricsRow}>
          {/* Active Orders */}
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFEADE' }]}>
              <FileText size={18} color="#964900" />
            </View>
            <Text style={styles.metricBigNumber}>2</Text>
            <Text style={styles.metricLabel}>Active Orders</Text>
          </Pressable>

          {/* Pickup Schedule */}
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Truck size={18} color={MKColors.primaryGreen} />
            </View>
            <Text style={styles.metricBigText}>Tomorrow</Text>
            <Text style={styles.metricLabel}>Pickup Schedule</Text>
          </Pressable>

          {/* Monthly Earning */}
          <Pressable
            onPress={() => router.push('/more/bank-details')}
            style={({ pressed }) => [
              styles.metricCard,
              styles.metricCardLast,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Wallet size={18} color={MKColors.primaryGreen} />
            </View>
            <Text style={styles.metricBigText}>₹48,500</Text>
            <Text style={styles.metricLabel}>Monthly Earning</Text>
          </Pressable>
        </View>
      </MKSection>
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── Top Bar ── */
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.xl,
    width: '100%',
  },
  farmerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: MKSpacing.md,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: MKSpacing.md,
    flexShrink: 0,
  },
  greetingContainer: {
    flex: 1,
    minWidth: 0,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: MKColors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
    flexShrink: 0,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: MKColors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── Hero Sell Card ── */
  heroSellCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    minHeight: 148,
    overflow: 'hidden',
    marginBottom: MKSpacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSellContent: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  heroSellTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 4,
    lineHeight: 21,
  },
  heroSellSubtitle: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  addProduceBtnWrapper: {
    alignSelf: 'flex-start',
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  inlineAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  heroBasketImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    flexShrink: 0,
  },

  /* ── Decision Card ── */
  cropHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: MKSpacing.lg,
    paddingBottom: 0,
    width: '100%',
  },
  cropInfoRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: MKSpacing.sm,
    minWidth: 0,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: MKSpacing.md,
    flexShrink: 0,
  },
  cropDetails: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.accentOrange,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  cropName: {
    fontSize: 15,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  cropQty: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  badgeWrapper: {
    flexShrink: 0,
  },
  netReturnRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingHorizontal: MKSpacing.lg,
    paddingTop: MKSpacing.md,
    paddingBottom: 4,
    marginTop: MKSpacing.md,
    width: '100%',
  },
  netReturnLabel: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginBottom: 2,
  },
  netReturnValue: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.primaryGreen,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '500',
    color: MKColors.textSecondary,
  },
  breakdownGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingHorizontal: MKSpacing.lg,
    paddingVertical: MKSpacing.md,
    marginTop: MKSpacing.sm,
    width: '100%',
  },
  breakdownCol: {
    flex: 1,
    minWidth: 0,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    marginBottom: 3,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demandValue: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.accentOrange,
    marginRight: 3,
  },
  decisionActionWrapper: {
    paddingHorizontal: MKSpacing.lg,
    paddingBottom: MKSpacing.lg,
    marginTop: 4,
    width: '100%',
  },

  /* ── Today at a Glance ── */
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
    marginRight: MKSpacing.sm,
    minWidth: 0,
  },
  metricCardLast: {
    marginRight: 0,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricBigNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 2,
  },
  metricBigText: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
