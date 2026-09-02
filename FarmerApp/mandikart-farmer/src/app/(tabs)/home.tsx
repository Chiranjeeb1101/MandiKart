/**
 * MandiKart Farmer App — Screen 8: Home (Selling Command Center)
 * 
 * Implements the approved Stitch visual design:
 * Farmer greeting header with notification bell, "Sell Today" action hero card,
 * "Best Opportunity for You" decision-support card with Estimated Net Return & Match %,
 * and "Today at a Glance" 3-metric performance cards.
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
  const locationName = user?.district ? `${user.district}, ${user.state}` : 'Nashik, Maharashtra';

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top + 16, 54) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar / Greeting Section */}
        <View style={styles.topAppBar}>
          <View style={styles.farmerProfileHeader}>
            <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatarImage} />
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingTitle}>Namaste, {farmerName} 👋</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#1E5A2A" strokeWidth={2.2} />
                <Text style={styles.locationText}>{locationName}</Text>
              </View>
            </View>
          </View>

          {/* Notification Button with Badge */}
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

        {/* Section 1: Sell Today Hero Card */}
        <Pressable
          onPress={() => router.push('/(tabs)/produce')}
          style={({ pressed }) => [
            styles.heroSellCard,
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
          ]}
        >
          <View style={styles.heroSellContent}>
            <Text style={styles.heroSellTitle}>What do you want to sell today?</Text>
            <Text style={styles.heroSellSubtitle}>
              Find verified buyers and maximize your net returns
            </Text>

            <View style={styles.addProduceBtnWrapper} pointerEvents="none">
              <MKButton
                title="Add Produce"
                onPress={() => {}}
                variant="primary"
                size="md"
                leftIcon={<Plus size={18} color="#FFFFFF" strokeWidth={2.5} />}
                fullWidth={false}
              />
            </View>
          </View>

          <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.heroBasketImage} />
        </Pressable>

        {/* Section 2: Best Opportunity For You */}
        <View style={styles.opportunitySection}>
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

            {/* Estimated Net Return Highlight */}
            <View style={styles.netReturnRow}>
              <Text style={styles.netReturnLabel}>Estimated Net Return</Text>
              <Text style={styles.netReturnValue}>
                ₹22.00 <Text style={styles.unitText}>/kg</Text>
              </Text>
            </View>

            {/* Cost Breakdown Grid */}
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

            {/* Action Button */}
            <View style={styles.decisionActionWrapper} pointerEvents="none">
              <MKButton
                title="View Best Options"
                onPress={() => {}}
                variant="secondary"
                size="md"
                rightIcon={<ArrowRight size={18} color="#1E5A2A" strokeWidth={2.2} />}
              />
            </View>
          </MKCard>
        </View>

        {/* Section 3: Today at a Glance */}
        <View style={styles.glanceSection}>
          <Text style={styles.sectionHeaderTitle}>Today at a Glance</Text>

          <View style={styles.metricsRow}>
            {/* Metric 1: Active Orders */}
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

            {/* Metric 2: Pickup Schedule */}
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

            {/* Metric 3: Monthly Earning */}
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
        </View>
      </ScrollView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 28,
    gap: 20,
  },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  farmerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  greetingTextContainer: {},
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#5F6368',
    fontWeight: '500',
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
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
  heroSellCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'center',
  },
  heroSellContent: {
    maxWidth: '65%',
    zIndex: 2,
  },
  heroSellTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1C1E',
    marginBottom: 4,
    lineHeight: 22,
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
  heroBasketImage: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    width: 130,
    height: 120,
    resizeMode: 'contain',
    zIndex: 1,
  },
  opportunitySection: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
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
  decisionCard: {
    padding: 18,
    gap: 14,
  },
  cropHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cropInfoRow: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
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
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  cropName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  cropQty: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 1,
  },
  netReturnRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingTop: 12,
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
    paddingTop: 12,
  },
  breakdownCol: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  demandValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF7D1A',
  },
  decisionActionWrapper: {
    marginTop: 4,
  },
  glanceSection: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    gap: 6,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  metricBigNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  metricBigText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1C1E',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#5F6368',
    textAlign: 'center',
    fontWeight: '500',
  },
});
