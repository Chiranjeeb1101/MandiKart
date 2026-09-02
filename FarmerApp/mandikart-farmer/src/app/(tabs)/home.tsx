/**
 * MandiKart Farmer App — Screen 8: Home (Selling Command Center)
 *
 * Layout uses explicit marginBottom instead of gap throughout
 * to ensure compatibility across all React Native / Expo versions.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { MKBackground, MKButton, MKCard, MKStatusBadge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWtbtdYEsJNCwEKZoi1xfJOZtPORnKD9GPoltpHd8eia8fYdHGOcijL8FHdga770RJTQzAlyHwu2wsbwtX555geY0I6OLsCVJnHMI3NO3tdHMP9YUctgl9S7vP0j7O9hSnek9ToXwIseCbKhXxVlUVQeix2P5A-k9Jo4H6Rlg7z1pLlsu7pgQsvSEkAow2Qvu0M777ZEEfveoswBRPceVJNWkptJtiy_PAbWmzMVcsTX143_2IR9_Kw';

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Ramesh';
  const locationName = user?.district
    ? `${user.district}, ${user.state}`
    : 'Nashik, Maharashtra';

  const topPadding = Math.max(insets.top + 16, 54);

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top App Bar ── */}
        <View style={styles.topAppBar}>
          <View style={styles.farmerProfileHeader}>
            <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatarImage} />
            <View>
              <Text style={styles.greetingTitle}>Namaste, {farmerName} 👋</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#1E5A2A" strokeWidth={2.2} />
                <Text style={styles.locationText}>{locationName}</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.notificationBtn,
              pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
            ]}
            accessibilityRole="button"
          >
            <Bell size={20} color="#1A1C1E" strokeWidth={2} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </Pressable>
        </View>

        {/* ── Section 1: Sell Today Hero Card ── */}
        <Pressable
          onPress={() => router.push('/(tabs)/produce')}
          style={({ pressed }) => [
            styles.heroSellCard,
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
          ]}
        >
          {/* Text content pinned to left */}
          <View style={styles.heroSellContent}>
            <Text style={styles.heroSellTitle}>What do you want{'\n'}to sell today?</Text>
            <Text style={styles.heroSellSubtitle}>
              Find verified buyers and maximize your net returns
            </Text>
            {/* Button is non-interactive; the whole card is the pressable */}
            <View pointerEvents="none" style={styles.addProduceBtnWrapper}>
              <View style={styles.inlineAddBtn}>
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.inlineAddBtnText}>Add Produce</Text>
              </View>
            </View>
          </View>

          {/* Decorative image — absolutely positioned to right */}
          <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.heroBasketImage} />
        </Pressable>

        {/* ── Section 2: Best Opportunity For You ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Best Opportunity for You</Text>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.6, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => router.push('/(tabs)/sell')}
          >
            <Text style={styles.viewAllLink}>View all</Text>
          </Pressable>
        </View>

        {/* Decision Support Card */}
        <MKCard
          style={styles.decisionCard}
          onPress={() => router.push('/(tabs)/sell')}
        >
          {/* Crop row */}
          <View style={styles.cropHeaderRow}>
            <View style={styles.cropInfoRow}>
              <Image source={{ uri: ONION_PHOTO_URI }} style={styles.cropImage} />
              <View style={styles.cropDetails}>
                <View style={styles.recommendedBadge}>
                  <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
                <Text style={styles.cropName}>Onion • Grade A</Text>
                <Text style={styles.cropQty}>1,000 KG Available</Text>
              </View>
            </View>
            <MKStatusBadge label="94% Match" type="match" />
          </View>

          {/* Net Return */}
          <View style={styles.netReturnRow}>
            <Text style={styles.netReturnLabel}>Estimated Net Return</Text>
            <Text style={styles.netReturnValue}>
              ₹22.00 <Text style={styles.unitText}>/kg</Text>
            </Text>
          </View>

          {/* Breakdown grid */}
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
                <Flame size={14} color="#EF7D1A" fill="#EF7D1A" />
              </View>
            </View>
          </View>

          {/* Action */}
          <View pointerEvents="none" style={styles.decisionActionWrapper}>
            <MKButton
              title="View Best Options"
              onPress={() => {}}
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight size={18} color="#1E5A2A" strokeWidth={2.2} />}
            />
          </View>
        </MKCard>

        {/* ── Section 3: Today at a Glance ── */}
        <Text style={[styles.sectionHeaderTitle, { marginBottom: 12 }]}>Today at a Glance</Text>

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
              <Truck size={18} color="#1E5A2A" />
            </View>
            <Text style={styles.metricBigText}>Tomorrow</Text>
            <Text style={styles.metricLabel}>Pickup Schedule</Text>
          </Pressable>

          {/* Monthly Earning */}
          <Pressable
            onPress={() => router.push('/more/bank-details')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Wallet size={18} color="#1E5A2A" />
            </View>
            <Text style={styles.metricBigText}>₹48,500</Text>
            <Text style={styles.metricLabel}>Monthly Earning</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  /* ── Top bar ── */
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  farmerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#5F6368',
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF7D1A',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    minHeight: 148,
    overflow: 'hidden',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSellContent: {
    flex: 1,
    paddingRight: 8,
    zIndex: 2,
  },
  heroSellTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
    marginBottom: 4,
    lineHeight: 21,
  },
  heroSellSubtitle: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 14,
    lineHeight: 16,
  },
  addProduceBtnWrapper: {
    alignSelf: 'flex-start',
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E5A2A',
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

  /* ── Section header ── */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5A2A',
  },

  /* ── Decision card ── */
  decisionCard: {
    marginBottom: 20,
  },
  cropHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 0,
  },
  cropInfoRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginRight: 12,
  },
  cropDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF7D1A',
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
    color: '#1A1C1E',
  },
  cropQty: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 2,
  },
  netReturnRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    marginTop: 12,
  },
  netReturnLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 2,
  },
  netReturnValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5F6368',
  },
  breakdownGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    marginBottom: 3,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demandValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF7D1A',
    marginRight: 3,
  },
  decisionActionWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 4,
  },

  /* ── Today at a Glance ── */
  metricsRow: {
    flexDirection: 'row',
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
    marginRight: 8,
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
    color: '#1A1C1E',
    marginBottom: 2,
  },
  metricBigText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1C1E',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#5F6368',
    textAlign: 'center',
    fontWeight: '500',
  },
});
