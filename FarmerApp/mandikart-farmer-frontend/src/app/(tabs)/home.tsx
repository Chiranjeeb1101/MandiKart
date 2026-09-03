/**
 * MandiKart — Home Screen (Selling Command Center)
 *
 * 100% Pixel-Perfect Match with Native Mobile & Web:
 * 1. Background:
 *    - Soft golden amber wash radiating smoothly from top-left (with pointerEvents="none")
 *    - Gentle pale leaf-green mist on the right edge
 *    - Clean #F8FAF7 canvas base
 * 2. Header:
 *    - Safe-area aware topBar (works across all Android/iOS notch cutouts & web)
 *    - Farmer avatar + "Namaste, Ravi 👋" + "📍 Nashik, Maharashtra" on left
 *    - Circular bell button with badge '3' on right
 * 3. Hero Card:
 *    - "What do you want to sell today?", "Find best buyers and get better returns"
 *    - Rich solid forest green "+ Add Produce" button (#1B6D24)
 *    - Fresh vegetable woven basket on right (flex-row layout, zero native clipping)
 * 4. "Today at a Glance" (Precision 3-Card Design):
 *    - Card 1: Circular soft peach badge (#FFF4EB), orange doc icon (#FF6B00), bold count 2, "Active\nOrders"
 *    - Card 2: Circular soft herbal green badge (#EDF7EE), delivery truck icon (#16A34A), bold text Tomorrow, "Pickup\nSchedule"
 *    - Card 3: Circular soft herbal green badge (#EDF7EE), wallet icon (#16A34A), bold amount ₹48,500, "Monthly\nEarning"
 *    - Clean white floating cards with soft ambient drop shadows
 * 5. Best Opportunity for You:
 *    - Title row: "Best Opportunity for You" left, "View all" green link right
 *    - Card top row: Onion photo (left) + Recommended badge & 94% Match badge + Onion • Grade A + 1,000 KG (right)
 *    - Card divider
 *    - Estimated Net Return label + large bold price: ₹22.00 /kg (#964900)
 *    - Card divider
 *    - 3 metrics row: Selling Price (₹24.00 /kg), Transport Cost (₹2.00 /kg), Demand (High 🔥)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  MapPin,
  Plus,
  Star,
  Flame,
  FileText,
  Truck,
  Wallet,
  X,
  TrendingUp,
  Sun,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { MKLayout } from '@/constants/layout';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  canvasBg: '#F8FAF7',
  surface: '#FFFFFF',
  primaryOrange: '#EF7D1A',
  priceOrange: '#964900',
  secondaryGreen: '#1B6D24',
  onSecondary: '#FFFFFF',
  textTitle: '#241913',
  textSub: '#564336',
  dividerColor: '#EFEAE0',
  dataMatchBg: '#E8F5E9',
  dataMatchText: '#1B6D24',
  badgeOrange: '#964900',
  statusWaiting: '#F39C12',

  // Precision 3-Card Design Tokens
  iconOrangeBg: '#FFF4EB',    // Circular soft peach badge
  iconOrangeColor: '#FF6B00', // Orange document icon
  iconGreenBg: '#EDF7EE',     // Circular soft herbal green badge
  iconGreenColor: '#16A34A',  // Delivery truck / wallet icon
};

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWtbtdYEsJNCwEKZoi1xfJOZtPORnKD9GPoltpHd8eia8fYdHGOcijL8FHdga770RJTQzAlyHwu2wsbwtX555geY0I6OLsCVJnHMI3NO3tdHMP9YUctgl9S7vP0j7O9hSnek9ToXwIseCbKhXxVlUVQeix2P5A-k9Jo4H6Rlg7z1pLlsu7pgQsvSEkAow2Qvu0M777ZEEfveoswBRPceVJNWkptJtiy_PAbWmzMVcsTX143_2IR9_Kw';

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

const TOMATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'Nashik');

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Ravi';
  const village = user?.village?.trim();
  const cityOrDist = user?.city?.trim() || user?.district?.trim() || selectedDistrict;
  const state = user?.state?.trim() || 'Maharashtra';
  const locationName = village ? `${village}, ${cityOrDist}, ${state}` : `${cityOrDist}, ${state}`;

  // Safe area top and bottom tab clearance
  const topPadding = MKLayout.getTopHeaderPadding(insets);
  const bottomPadding = MKLayout.getBottomTabClearance(insets);

  return (
    <View style={styles.root}>
      {/* ── 1. Organic Watercolor Background Washes (pointerEvents="none" prevents touch blocking) ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#FFE7CE', 'rgba(255, 241, 230, 0.75)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.75, y: 0.4 }}
          style={styles.gradientTopWarm}
        />
        <LinearGradient
          colors={['#DCEFDE', 'rgba(235, 247, 238, 0.70)', 'transparent']}
          start={{ x: 1, y: 0.05 }}
          end={{ x: 0.35, y: 0.55 }}
          style={styles.gradientTopGreen}
        />
      </View>

      {/* ── Top Bar (Avatar + Greeting left, Bell right) ── */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <View style={styles.topBarLeft}>
          <Pressable onPress={() => router.push('/(tabs)/more')}>
            <Image source={{ uri: user?.avatarUri || FARMER_AVATAR_URI }} style={styles.avatar} />
          </Pressable>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingText}>{t.namaste}, {farmerName} 👋</Text>
            <Pressable
              style={styles.locationRow}
              onPress={() => setLocationModalVisible(true)}
            >
              <MapPin size={13} color={C.secondaryGreen} fill={C.secondaryGreen} style={{ marginRight: 3 }} />
              <Text numberOfLines={1} style={styles.locationText}>{locationName}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bellWrapper}>
          <Pressable
            style={({ pressed }) => [styles.bellButton, pressed && { opacity: 0.8 }]}
            onPress={() => router.push('/more/notifications')}
          >
            <Bell size={21} color={C.textTitle} strokeWidth={1.8} />
          </Pressable>
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>3</Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable Body (flex: 1 prevents mobile scroll collapse) ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ SECTION 1: HERO CARD ("What do you want to sell today?") ═══ */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeftCol}>
            <Text style={styles.heroTitle}>{t.whatSellToday}</Text>
            <Text style={styles.heroSubtitle}>{t.findBestBuyers}</Text>
            <Pressable
              style={({ pressed }) => [styles.addProduceBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
              onPress={() => router.push('/(tabs)/sell')}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.addProduceBtnText}>Add Product</Text>
            </Pressable>
          </View>
          <View style={styles.heroRightCol}>
            <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.heroImage} />
          </View>
        </View>

        {/* ═══ SECTION 2: TODAY AT A GLANCE (Precision 3-Card Design) ═══ */}
        <View style={styles.glanceSection}>
          <Text style={styles.sectionHeaderTitle}>{t.todayGlance}</Text>
          <View style={styles.glanceCardsRow}>
            {/* Card 1: Active Orders */}
            <Pressable
              style={({ pressed }) => [styles.glanceCard, pressed && { transform: [{ scale: 0.97 }] }]}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <View style={[styles.glanceIconCircle, { backgroundColor: C.iconOrangeBg }]}>
                <FileText size={22} color={C.iconOrangeColor} strokeWidth={2} />
              </View>
              <Text style={styles.glanceValueLarge}>2</Text>
              <Text style={styles.glanceLabel}>{t.activeOrders}</Text>
            </Pressable>

            {/* Card 2: Pickup Schedule */}
            <Pressable
              style={({ pressed }) => [styles.glanceCard, pressed && { transform: [{ scale: 0.97 }] }]}
              onPress={() => setPickupModalVisible(true)}
            >
              <View style={[styles.glanceIconCircle, { backgroundColor: C.iconGreenBg }]}>
                <Truck size={22} color={C.iconGreenColor} strokeWidth={2} />
              </View>
              <Text style={styles.glanceValueMd}>{t.tomorrow}</Text>
              <Text style={styles.glanceLabel}>{t.pickupSchedule}</Text>
            </Pressable>

            {/* Card 3: Monthly Earning */}
            <Pressable
              style={({ pressed }) => [styles.glanceCard, pressed && { transform: [{ scale: 0.97 }] }]}
              onPress={() => router.push('/earnings')}
            >
              <View style={[styles.glanceIconCircle, { backgroundColor: C.iconGreenBg }]}>
                <TrendingUp size={22} color={C.iconGreenColor} strokeWidth={2.2} />
              </View>
              <Text style={styles.glanceValueMd}>₹48,500</Text>
              <Text style={styles.glanceLabel}>{t.monthlyEarning}</Text>
            </Pressable>
          </View>
        </View>

        {/* ═══ SECTION 3: BEST OPPORTUNITY FOR YOU ═══ */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeaderTitle}>{t.bestOpportunity}</Text>
          <Pressable onPress={() => setShowAllOpportunities(!showAllOpportunities)}>
            <Text style={styles.viewAllLink}>{showAllOpportunities ? 'Show less' : t.viewAll}</Text>
          </Pressable>
        </View>

        <View style={styles.opportunityCard}>
          {/* Top Row: Crop Photo (left) + Badges & Info (right) */}
          <View style={styles.opportunityHeaderRow}>
            <Image source={{ uri: ONION_PHOTO_URI }} style={styles.onionThumb} />
            <View style={styles.opportunityHeaderInfo}>
              <View style={styles.opportunityBadgesRow}>
                <View style={styles.recommendedBadge}>
                  <Star size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} style={{ marginRight: 4 }} />
                  <Text style={styles.recommendedBadgeText}>{t.recommended}</Text>
                </View>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>94% Match</Text>
                </View>
              </View>
              <Text style={styles.cropTitle}>Onion • Grade A</Text>
              <Text style={styles.cropQty}>1,000 KG</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Estimated Net Return Section */}
          <Text style={styles.netReturnLabel}>{t.estimatedNetReturn}</Text>
          <View style={styles.netReturnPriceRow}>
            <Text style={styles.netReturnPrice}>₹22.00</Text>
            <Text style={styles.netReturnUnit}> /kg</Text>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* 3 Metric Columns: Selling Price | Transport Cost | Demand */}
          <View style={styles.metricGrid}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{t.sellingPrice}</Text>
              <Text style={styles.metricValue}>₹24.00 /kg</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{t.transportCost}</Text>
              <Text style={styles.metricValue}>₹2.00 /kg</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{t.demand}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.metricValue}>{t.highDemand} </Text>
                <Flame size={12} color="#EF7D1A" fill="#EF7D1A" strokeWidth={0} />
              </View>
            </View>
          </View>
        </View>

        {/* Toggled Extra Opportunity (Tomatoes) */}
        {showAllOpportunities && (
          <View style={[styles.opportunityCard, { marginTop: 4 }]}>
            <View style={styles.opportunityHeaderRow}>
              <Image source={{ uri: TOMATO_PHOTO_URI }} style={styles.onionThumb} />
              <View style={styles.opportunityHeaderInfo}>
                <View style={styles.opportunityBadgesRow}>
                  <View style={[styles.recommendedBadge, { backgroundColor: '#2980B9' }]}>
                    <TrendingUp size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.recommendedBadgeText}>High Demand</Text>
                  </View>
                  <View style={[styles.matchBadge, { backgroundColor: '#EBF5FB' }]}>
                    <Text style={[styles.matchBadgeText, { color: '#2980B9' }]}>88% Match</Text>
                  </View>
                </View>
                <Text style={styles.cropTitle}>Red Tomatoes • Grade A</Text>
                <Text style={styles.cropQty}>800 KG</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <Text style={styles.netReturnLabel}>Estimated Net Return</Text>
            <View style={styles.netReturnPriceRow}>
              <Text style={[styles.netReturnPrice, { color: '#2980B9' }]}>₹31.50</Text>
              <Text style={styles.netReturnUnit}> /kg</Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.metricGrid}>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Selling Price</Text>
                <Text style={styles.metricValue}>₹34.00 /kg</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Transport Cost</Text>
                <Text style={styles.metricValue}>₹2.50 /kg</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Demand</Text>
                <View style={styles.demandRow}>
                  <Text style={[styles.demandValue, { color: '#E74C3C' }]}>Very High </Text>
                  <Flame size={14} color="#E74C3C" fill="#E74C3C" strokeWidth={0} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ═══ SECTION 4: APMC & DIRECT BENCHMARK CARD ═══ */}
        <View style={styles.benchmarkCard}>
          <View style={styles.benchmarkHeaderRow}>
            <View style={styles.benchmarkBadge}>
              <TrendingUp size={13} color="#15803D" />
              <Text style={styles.benchmarkBadgeText}>LIVE MANDI INTELLIGENCE</Text>
            </View>
            <Text style={styles.benchmarkDateText}>Updated 10m ago</Text>
          </View>
          <Text style={styles.benchmarkTitle}>Direct Sourcing vs APMC Mandi</Text>
          <Text style={styles.benchmarkSubtitle}>
            Selling directly on MandiKart saves ₹2.20/kg on mandi commission & transport deductions.
          </Text>

          <View style={styles.benchmarkComparisonRow}>
            <View style={styles.benchmarkCompareBox}>
              <Text style={styles.compareBoxLabel}>APMC Mandi Auction</Text>
              <Text style={styles.compareBoxPrice}>₹25.80 <Text style={styles.compareUnit}>/kg</Text></Text>
              <Text style={styles.compareBoxDeduction}>- ₹2.50 transport & cess</Text>
            </View>
            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={[styles.benchmarkCompareBox, styles.compareBoxGreen]}>
              <Text style={[styles.compareBoxLabel, { color: '#15803D' }]}>MandiKart Direct</Text>
              <Text style={[styles.compareBoxPrice, { color: '#166534' }]}>₹28.50 <Text style={styles.compareUnit}>/kg</Text></Text>
              <Text style={[styles.compareBoxDeduction, { color: '#15803D' }]}>+ Free Farm Pickup</Text>
            </View>
          </View>

          <Pressable
            style={styles.benchmarkCta}
            onPress={() => router.push('/sell/best-options')}
          >
            <Text style={styles.benchmarkCtaText}>COMPARE MORE CROPS</Text>
            <ArrowRight size={14} color="#1E5A2A" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* ═══ SECTION 5: WEATHER & HARVEST ADVISORY CARD ═══ */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherTopRow}>
            <View style={styles.weatherIconCircle}>
              <Sun size={24} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.weatherTempText}>29°C • Clear & Sunny</Text>
              <Text numberOfLines={1} style={styles.weatherLocationSub}>{locationName}</Text>
            </View>
            <View style={styles.weatherFavorableBadge}>
              <ShieldCheck size={12} color="#15803D" />
              <Text style={styles.weatherFavorableText}>Ideal Harvest</Text>
            </View>
          </View>
          <Text style={styles.weatherAdvisoryBody}>
            Optimal sunlight and low 38% humidity for field drying and bagging onion, wheat, and pulses before mandi dispatch. No rain alerts for the next 72 hours.
          </Text>
        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <Modal visible={pickupModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Truck size={22} color={C.secondaryGreen} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Pickup Schedule</Text>
              </View>
              <Pressable onPress={() => setPickupModalVisible(false)}>
                <X size={20} color={C.textSub} />
              </Pressable>
            </View>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.textTitle }}>
                Tomorrow, 10:00 AM - 12:00 PM
              </Text>
              <Text style={{ fontSize: 13, color: C.textSub }}>
                Truck #MH-15-EG-4921 assigned by ABC Foods
              </Text>
              <Pressable
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setPickupModalVisible(false);
                  router.push('/(tabs)/orders');
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Track Order</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={locationModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Region</Text>
              <Pressable onPress={() => setLocationModalVisible(false)}>
                <X size={20} color={C.textSub} />
              </Pressable>
            </View>
            {['Nashik', 'Pune', 'Ahmednagar', 'Solapur'].map((dist) => (
              <Pressable
                key={dist}
                style={[
                  styles.districtItem,
                  selectedDistrict === dist && { backgroundColor: C.dataMatchBg },
                ]}
                onPress={() => {
                  setSelectedDistrict(dist);
                  setLocationModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.districtText,
                    selectedDistrict === dist && { fontWeight: '700', color: C.secondaryGreen },
                  ]}
                >
                  {dist}, Maharashtra
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const SOFT_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.canvasBg,
  },

  // 1. Organic Watercolor Background Washes
  gradientTopWarm: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '85%',
    height: 320,
  },
  gradientTopGreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    height: 360,
  },

  // Top Bar (Safe Area aware, flex-row)
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexShrink: 0,
    ...SOFT_SHADOW,
  },
  greetingCol: {
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textTitle,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 1,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSub,
    flexShrink: 1,
  },
  bellWrapper: {
    position: 'relative',
    flexShrink: 0,
    marginLeft: 8,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SOFT_SHADOW,
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D9531E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Scroll View & Content Container
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // ── Hero Card (Flex Row layout, zero native clipping) ──
  heroCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    ...SOFT_SHADOW,
  },
  heroLeftCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textTitle,
    lineHeight: 24,
    marginBottom: 6,
    flexShrink: 1,
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: C.textSub,
    lineHeight: 17,
    marginBottom: 14,
    flexShrink: 1,
  },
  addProduceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B6D24',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    gap: 6,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    ...SOFT_SHADOW,
  },
  addProduceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroRightCol: {
    width: 95,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 95,
    height: 95,
    resizeMode: 'contain',
  },

  // ── 2. "Today at a Glance" (Precision 3-Card Design) ──
  glanceSection: {
    marginBottom: 26,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textTitle,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  glanceCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  glanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5DF',
    paddingVertical: 18,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SOFT_SHADOW,
  },
  glanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  glanceValueLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textTitle,
    textAlign: 'center',
    marginBottom: 4,
  },
  glanceValueMd: {
    fontSize: 14.5,
    fontWeight: '800',
    color: C.textTitle,
    textAlign: 'center',
    marginBottom: 4,
  },
  glanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: C.textSub,
    textAlign: 'center',
    lineHeight: 15,
  },

  // ── Best Opportunity Section ──
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: C.secondaryGreen,
  },
  opportunityCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...SOFT_SHADOW,
  },
  opportunityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  onionThumb: {
    width: 78,
    height: 78,
    borderRadius: 14,
  },
  opportunityHeaderInfo: {
    flex: 1,
  },
  opportunityBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.badgeOrange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recommendedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchBadge: {
    backgroundColor: C.dataMatchBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: C.dataMatchText,
  },
  cropTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textTitle,
  },
  cropQty: {
    fontSize: 12,
    color: C.textSub,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: C.dividerColor,
    marginVertical: 12,
  },
  netReturnLabel: {
    fontSize: 11.5,
    color: C.textSub,
    marginBottom: 3,
  },
  netReturnPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  netReturnPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: C.priceOrange,
  },
  netReturnUnit: {
    fontSize: 13,
    color: C.textSub,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: C.textSub,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textTitle,
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demandValue: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primaryOrange,
  },

  // Modal styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: C.surface, borderRadius: 20, padding: 20, ...SOFT_SHADOW },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.textTitle },
  modalPrimaryBtn: { backgroundColor: C.secondaryGreen, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  modalPrimaryBtnText: { fontSize: 14, fontWeight: '700', color: C.onSecondary },
  districtItem: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, marginBottom: 4 },
  districtText: { fontSize: 14, color: C.textTitle },

  // Section 4 & 5 Detail Cards
  benchmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#ECEAE3',
    marginTop: 14,
    ...SOFT_SHADOW,
  },
  benchmarkHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  benchmarkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benchmarkBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.4,
  },
  benchmarkDateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  benchmarkTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textTitle,
    marginBottom: 3,
  },
  benchmarkSubtitle: {
    fontSize: 12,
    color: C.textSub,
    lineHeight: 17,
    marginBottom: 14,
  },
  benchmarkComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  benchmarkCompareBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compareBoxGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  compareBoxLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  compareBoxPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  compareUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  compareBoxDeduction: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 2,
  },
  vsCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6B7280',
  },
  benchmarkCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  benchmarkCtaText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: 0.3,
  },
  weatherCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginTop: 14,
    ...SOFT_SHADOW,
  },
  weatherTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  weatherIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherTempText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#92400E',
  },
  weatherLocationSub: {
    fontSize: 11.5,
    color: '#B45309',
    marginTop: 1,
  },
  weatherFavorableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weatherFavorableText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  weatherAdvisoryBody: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});
