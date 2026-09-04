/**
 * MandiKart — Home Dashboard Screen (UI UX Pro Max Redesign)
 * 
 * Features:
 * - Top App Bar: Farmer greeting, realtime detailed GPS address, interactive Notification Drawer
 * - Top Middle: "Today at a Glance" stat cards (Active Orders, Pickup Schedule, Monthly Earnings)
 * - Under Glance: Integrated Search Bar with interactive Voice Search & live filtering
 * - Hero "Sell Today" banner with "Add Product" CTA routing to /(tabs)/sell
 * - "Best Opportunity for You" 2-Sided Segmented Section:
 *     Side 1: "🔥 High Demanded to Sell" (Direct buyer bids & 1-tap Sell Now)
 *     Side 2: "🌱 Produce Recommendations" (High-yield crops & 1-tap Add to Produce)
 * - Working "View All" toggle expanding complete catalog of opportunities
 * - Live APMC Mandi Benchmark rates & Weather harvest advisory
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  MapPin,
  Plus,
  Star,
  Flame,
  ArrowRight,
  FileText,
  Truck,
  Wallet,
  TrendingUp,
  Mic,
  MicOff,
  CheckCircle2,
  Search,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Sun,
  Clock,
  Check,
} from 'lucide-react-native';
import { MKScreen, MKSection, MKCard, MKButton, MKStatusBadge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWtbtdYEsJNCwEKZoi1xfJOZtPORnKD9GPoltpHd8eia8fYdHGOcijL8FHdga770RJTQzAlyHwu2wsbwtX555geY0I6OLsCVJnHMI3NO3tdHMP9YUctgl9S7vP0j7O9hSnek9ToXwIseCbKhXxVlUVQeix2P5A-k9Jo4H6Rlg7z1pLlsu7pgQsvSEkAow2Qvu0M777ZEEfveoswBRPceVJNWkptJtiy_PAbWmzMVcsTX143_2IR9_Kw';

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA';

const TOMATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const POTATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'bid' | 'weather' | 'mandi';
  unread: boolean;
  actionText?: string;
  actionRoute?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { language } = useTranslation();

  // Search & Voice Search State
  const [searchQuery, setSearchQuery] = useState('');
  const { isListening, transcript, match, startListening, stopListening, resetVoiceSearch } =
    useVoiceSearch();

  // Two-Sided Best Opportunity State ('high_demand' vs 'recommendations')
  const [opportunitySide, setOpportunitySide] = useState<'high_demand' | 'recommendations'>(
    'high_demand'
  );
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);

  // Notification Drawer State
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: '🚛 Pickup Vehicle En Route',
      description:
        'Tata Ace (MH 15 BX 4022) is 6.2 km away from your farmgate for 1,000 KG Onion pickup.',
      time: '10m ago',
      type: 'order',
      unread: true,
      actionText: 'Track Live Vehicle',
      actionRoute: '/orders/track-vehicle',
    },
    {
      id: 'notif_2',
      title: '💼 New Direct Corporate Bid',
      description:
        'Reliance Retail Mandi Hub offered ₹28.50/kg for Grade A Onion (+₹4.50 above APMC average).',
      time: '35m ago',
      type: 'bid',
      unread: true,
      actionText: 'View & Accept Offer',
      actionRoute: '/(tabs)/sell',
    },
    {
      id: 'notif_3',
      title: '📈 APMC Mandi Surge Alert',
      description:
        'Nashik Red Onion price surged +4.2% today to ₹2,450/q with 15+ verified buyers bidding.',
      time: '2h ago',
      type: 'mandi',
      unread: true,
      actionText: 'View Market Rates',
      actionRoute: '/(tabs)/produce',
    },
    {
      id: 'notif_4',
      title: '☀️ Optimal Harvest Weather',
      description:
        'Clear skies for next 72 hours. Humidity 48%. Ideal window for curing and farmgate dispatch.',
      time: '4h ago',
      type: 'weather',
      unread: false,
    },
  ]);

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Ramesh';
  const locationName = user?.village
    ? `${user.village}, ${user.city || user.district || ''}, ${user.state || ''}`
    : user?.district
    ? `${user.district}, ${user.state}`
    : 'Dindori, Nashik, Maharashtra';

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  // High Demanded Crops Data
  const highDemandProducts = [
    {
      id: 'hd_1',
      name: 'Onion • Grade A',
      subname: 'Nashik Red Garwa Variety',
      imageUri: ONION_PHOTO_URI,
      match: '94% Match',
      sellingPrice: '₹24.00 /kg',
      netReturn: '₹22.00 /kg',
      transport: '₹2.00 /kg',
      demand: 'Very High',
      buyers: '18 Active Buyers',
      cropKey: 'Onion',
      qty: '1,000 KG',
      grade: 'Grade A',
    },
    {
      id: 'hd_2',
      name: 'Hybrid Tomato • Grade A',
      subname: 'Semi-Ripe Fresh Harvest',
      imageUri: TOMATO_PHOTO_URI,
      match: '91% Match',
      sellingPrice: '₹23.00 /kg',
      netReturn: '₹21.50 /kg',
      transport: '₹1.50 /kg',
      demand: 'High',
      buyers: '14 Active Buyers',
      cropKey: 'Tomato',
      qty: '500 KG',
      grade: 'Grade A',
    },
    {
      id: 'hd_3',
      name: 'Jyoti Potato • Grade A',
      subname: 'Clean Washed Table Quality',
      imageUri: POTATO_PHOTO_URI,
      match: '88% Match',
      sellingPrice: '₹22.00 /kg',
      netReturn: '₹20.20 /kg',
      transport: '₹1.80 /kg',
      demand: 'High',
      buyers: '11 Active Buyers',
      cropKey: 'Potato',
      qty: '800 KG',
      grade: 'Grade A',
    },
    {
      id: 'hd_4',
      name: 'Green Chilli (G-4 Hybrid)',
      subname: 'Pungent Fresh Export Spec',
      imageUri:
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
      match: '96% Match',
      sellingPrice: '₹68.00 /kg',
      netReturn: '₹63.50 /kg',
      transport: '₹4.50 /kg',
      demand: 'Surging',
      buyers: '22 Active Buyers',
      cropKey: 'Green Chilli',
      qty: '400 KG',
      grade: 'Grade A',
    },
  ];

  // Produce Recommendations Data
  const produceRecommendations = [
    {
      id: 'rec_1',
      cropName: 'Green Chilli (G-4 Hybrid)',
      badge: 'High Profit (+35%)',
      badgeColor: '#15803D',
      expectedPrice: '₹62 - ₹68 /kg',
      seasonWindow: 'Sow next 14 days',
      cycle: '65 Days Cycle',
      advice: 'Strong bulk demand from Mumbai & Pune retail aggregators. High heat tolerance.',
      targetCrop: 'Green Chilli',
    },
    {
      id: 'rec_2',
      cropName: 'Garlic (Yamuna Safed)',
      badge: 'Surging Demand',
      badgeColor: '#C2410C',
      expectedPrice: '₹135 - ₹150 /kg',
      seasonWindow: 'Optimal Sowing Window',
      cycle: '90 Days Cycle',
      advice: 'Lowest storage perishability. Verified buyer contracts available in Nashik.',
      targetCrop: 'Garlic',
    },
    {
      id: 'rec_3',
      cropName: 'Ginger (Mahim Variety)',
      badge: 'Export Standard',
      badgeColor: '#4338CA',
      expectedPrice: '₹80 - ₹95 /kg',
      seasonWindow: 'Early Season Prep',
      cycle: '120 Days Cycle',
      advice: 'Resistant to rhizome rot. Direct sourcing agreements open for FPO farmers.',
      targetCrop: 'Ginger',
    },
  ];

  // Live filtered items based on search query
  const effectiveQuery = searchQuery.trim().toLowerCase();
  const filteredHighDemand = highDemandProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(effectiveQuery) ||
      p.subname.toLowerCase().includes(effectiveQuery) ||
      p.cropKey.toLowerCase().includes(effectiveQuery)
  );
  const filteredRecommendations = produceRecommendations.filter(
    (r) =>
      r.cropName.toLowerCase().includes(effectiveQuery) ||
      r.advice.toLowerCase().includes(effectiveQuery)
  );

  return (
    <MKScreen>
      {/* ── 1. Top App Bar ── */}
      <View style={styles.topAppBar}>
        <Pressable
          style={styles.farmerProfileHeader}
          onPress={() => router.push('/more/profile')}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatarImage} />
            <View style={styles.onlineBadgeDot} />
          </View>
          <View style={styles.greetingContainer}>
            <Text numberOfLines={1} style={styles.greetingTitle}>
              {language === 'or'
                ? `ନମସ୍କାର, ${farmerName}`
                : language === 'hi'
                ? `नमस्ते, ${farmerName}`
                : language === 'mr'
                ? `नमस्कार, ${farmerName}`
                : `Namaste, ${farmerName}`} 👋
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#15803D" strokeWidth={2.4} />
              <Text numberOfLines={1} style={styles.locationText}>
                {locationName}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Interactive Notification Bell */}
        <Pressable
          style={({ pressed }) => [
            styles.notificationBtn,
            pressed && { transform: [{ scale: 0.92 }], opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() => setNotificationModalVisible(true)}
        >
          <Bell size={20} color="#1A1C1E" strokeWidth={2.2} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── 2. Top Middle Section: Today at a Glance ── */}
      <View style={styles.glanceSectionContainer}>
        <View style={styles.glanceHeaderRow}>
          <Text style={styles.glanceSectionTitle}>Today at a Glance</Text>
        </View>

        <View style={styles.metricsRow}>
          {/* Card 1: Active Orders */}
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFF2E8' }]}>
              <FileText size={19} color="#D9531E" strokeWidth={2.4} />
            </View>
            <Text style={styles.metricBigNumber}>2</Text>
            <Text numberOfLines={1} style={styles.metricLabel}>
              Active Orders
            </Text>
            <View style={styles.metricStatusPillOrange}>
              <Text numberOfLines={1} style={styles.metricStatusPillOrangeText}>1 En Route</Text>
            </View>
          </Pressable>

          {/* Card 2: Pickup Schedule */}
          <Pressable
            onPress={() => router.push('/orders/track-vehicle')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Truck size={19} color="#15803D" strokeWidth={2.4} />
            </View>
            <Text numberOfLines={1} style={styles.metricBigText}>
              Tomorrow
            </Text>
            <Text numberOfLines={1} style={styles.metricLabel}>
              Pickup Slot
            </Text>
            <View style={styles.metricStatusPillGreen}>
              <Text numberOfLines={1} style={styles.metricStatusPillGreenText}>08:30 AM</Text>
            </View>
          </Pressable>

          {/* Card 3: Monthly Earnings */}
          <Pressable
            onPress={() => router.push('/earnings')}
            style={({ pressed }) => [
              styles.metricCard,
              styles.metricCardLast,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Wallet size={19} color="#15803D" strokeWidth={2.4} />
            </View>
            <Text numberOfLines={1} style={styles.metricBigTextGreen}>
              ₹48.5k
            </Text>
            <Text numberOfLines={1} style={styles.metricLabel}>
              Net Payouts
            </Text>
            <View style={styles.metricStatusPillGreen}>
              <Text numberOfLines={1} style={styles.metricStatusPillGreenText}>+18% MTD</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* ── 3. Under Glance: High Aesthetic Search Bar with Voice Feature ── */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarInner}>
          <Search size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops, buyers, mandi rates (e.g. Onion, Tomato)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
              <X size={16} color="#64748B" />
            </Pressable>
          )}

          {/* Integrated Voice Search Button */}
          <Pressable
            onPress={isListening ? stopListening : startListening}
            style={[styles.voiceMicBtn, isListening && styles.voiceMicBtnListening]}
            accessibilityRole="button"
            accessibilityLabel="Voice Search"
          >
            {isListening ? (
              <MicOff size={18} color="#FFFFFF" strokeWidth={2.4} />
            ) : (
              <Mic size={18} color="#FFFFFF" strokeWidth={2.4} />
            )}
          </Pressable>
        </View>

        {/* Live Speech Recognition Card */}
        {isListening && (
          <View style={styles.voiceListeningBanner}>
            <View style={styles.voicePulseDot} />
            <Text style={styles.voiceListeningText}>
              Listening in Hindi, Odia, Marathi, English... Speak crop name now
            </Text>
          </View>
        )}

        {(transcript || match) && (
          <View style={styles.voiceMatchCard}>
            <View style={styles.voiceMatchHeader}>
              <CheckCircle2 size={15} color="#15803D" />
              <Text style={styles.voiceMatchHeaderText}>Voice Recognized Crop:</Text>
            </View>
            <Text style={styles.voiceMatchCropName}>
              {match ? match.cropName : transcript}{' '}
              {match?.vernacularLabel ? `(${match.vernacularLabel})` : ''}
            </Text>
            <View style={styles.voiceMatchActionsRow}>
              <Pressable
                style={styles.voiceMatchBtnPrimary}
                onPress={() => {
                  setSearchQuery(match?.cropName || transcript);
                  router.push({
                    pathname: '/sell/best-options',
                    params: { crop: match?.cropName || transcript, qty: '1000 KG', grade: 'Grade A' },
                  });
                }}
              >
                <Text style={styles.voiceMatchBtnPrimaryText}>Find Best Buyers Now</Text>
              </Pressable>
              <Pressable style={styles.voiceMatchBtnSecondary} onPress={resetVoiceSearch}>
                <Text style={styles.voiceMatchBtnSecondaryText}>Clear</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* ── 4. Sell Today Hero Card ── */}
      <Pressable
        onPress={() => router.push('/(tabs)/sell')}
        style={({ pressed }) => [
          styles.heroSellCard,
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        ]}
      >
        <View style={styles.heroSellContent}>
          <Text style={styles.heroSellTitle}>What do you want{'\n'}to sell today?</Text>
          <Text style={styles.heroSellSubtitle}>
            Direct corporate buyers, guaranteed pickup & same-day settlement.
          </Text>
          <View style={styles.inlineAddBtn}>
            <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.inlineAddBtnText}>Add Product</Text>
          </View>
        </View>
        <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.heroBasketImage} />
      </Pressable>

      {/* ── 5. Best Opportunity for You (Two Sides / Segmented Switcher) ── */}
      <View style={styles.opportunitySectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeadingTitle}>Best Opportunity for You</Text>
          <Pressable
            onPress={() => setShowAllOpportunities(!showAllOpportunities)}
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllBtnText}>
              {showAllOpportunities ? 'Show Less' : 'View all'}
            </Text>
            <ChevronRight size={14} color="#15803D" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* 2-Sided Segmented Tab Controls */}
        <View style={styles.segmentedTabContainer}>
          <Pressable
            style={[
              styles.segmentTab,
              opportunitySide === 'high_demand' && styles.segmentTabActive,
            ]}
            onPress={() => setOpportunitySide('high_demand')}
          >
            <Flame
              size={15}
              color={opportunitySide === 'high_demand' ? '#EA580C' : '#64748B'}
              fill={opportunitySide === 'high_demand' ? '#EA580C' : 'none'}
            />
            <Text
              style={[
                styles.segmentTabText,
                opportunitySide === 'high_demand' && styles.segmentTabTextActive,
              ]}
            >
              High Demanded to Sell
            </Text>
            <View
              style={[
                styles.segmentTabCountBadge,
                opportunitySide === 'high_demand' && styles.segmentTabCountBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentTabCountText,
                  opportunitySide === 'high_demand' && styles.segmentTabCountTextActive,
                ]}
              >
                {filteredHighDemand.length}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.segmentTab,
              opportunitySide === 'recommendations' && styles.segmentTabActive,
            ]}
            onPress={() => setOpportunitySide('recommendations')}
          >
            <Sparkles
              size={15}
              color={opportunitySide === 'recommendations' ? '#15803D' : '#64748B'}
            />
            <Text
              style={[
                styles.segmentTabText,
                opportunitySide === 'recommendations' && styles.segmentTabTextActive,
              ]}
            >
              Produce Recommendations
            </Text>
            <View
              style={[
                styles.segmentTabCountBadge,
                opportunitySide === 'recommendations' && styles.segmentTabCountBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentTabCountText,
                  opportunitySide === 'recommendations' && styles.segmentTabCountTextActive,
                ]}
              >
                {filteredRecommendations.length}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── Side 1: High Demanded Products to Sell ── */}
        {opportunitySide === 'high_demand' && (
          <View style={styles.opportunityCardsList}>
            {(showAllOpportunities ? filteredHighDemand : filteredHighDemand.slice(0, 2)).map(
              (prod) => (
                <View key={prod.id} style={styles.opportunityCard}>
                  <View style={styles.opportunityCardTop}>
                    <Image source={{ uri: prod.imageUri }} style={styles.oppCropThumb} />
                    <View style={styles.oppCropDetails}>
                      <Text numberOfLines={1} style={styles.oppCropTitle}>{prod.name}</Text>
                      <Text numberOfLines={1} style={styles.oppCropSub}>{prod.subname}</Text>
                    </View>
                    <View style={styles.oppDemandPill}>
                      <Flame size={13} color="#EA580C" fill="#EA580C" />
                      <Text style={styles.oppDemandText}>{prod.demand}</Text>
                    </View>
                  </View>

                  {/* Clean 2-Zone Pricing Spotlight Bar (Fixed overwriting boxes) */}
                  <View style={styles.oppPriceBanner}>
                    <View style={styles.oppPricePrimary}>
                      <Text style={styles.oppPricePrimaryLabel}>Net Farmer Rate</Text>
                      <Text style={styles.oppPricePrimaryValue}>{prod.netReturn}</Text>
                    </View>
                    <View style={styles.oppPriceDivider} />
                    <View style={styles.oppPriceSecondary}>
                      <Text style={styles.oppPriceSecondaryLabel}>Mandi Benchmark</Text>
                      <Text style={styles.oppPriceSecondaryValue}>{prod.sellingPrice}</Text>
                    </View>
                  </View>

                  {/* Buyer Badge & Direct Action Button */}
                  <View style={styles.oppBottomRow}>
                    <View style={styles.oppBuyerBadge}>
                      <ShieldCheck size={14} color="#15803D" strokeWidth={2.4} />
                      <Text numberOfLines={1} style={styles.oppBuyerBadgeText}>{prod.buyers}</Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        styles.oppActionBtn,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() =>
                        router.push({
                          pathname: '/sell/best-options',
                          params: { crop: prod.cropKey, qty: prod.qty, grade: prod.grade },
                        })
                      }
                    >
                      <Text style={styles.oppActionBtnText}>Sell Harvest</Text>
                      <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.4} />
                    </Pressable>
                  </View>
                </View>
              )
            )}
          </View>
        )}

        {/* ── Side 2: Produce Recommendations for You ── */}
        {opportunitySide === 'recommendations' && (
          <View style={styles.opportunityCardsList}>
            {(showAllOpportunities
              ? filteredRecommendations
              : filteredRecommendations.slice(0, 2)
            ).map((rec) => (
              <View key={rec.id} style={styles.recCard}>
                <View style={styles.recCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        styles.recBadgePill,
                        { backgroundColor: `${rec.badgeColor}15` },
                      ]}
                    >
                      <Sparkles size={11} color={rec.badgeColor} />
                      <Text style={[styles.recBadgeText, { color: rec.badgeColor }]}>
                        {rec.badge}
                      </Text>
                    </View>
                    <Text style={styles.recCropTitle}>{rec.cropName}</Text>
                  </View>
                  <View style={styles.recPriceWrap}>
                    <Text style={styles.recPriceLabel}>Forecast Rate</Text>
                    <Text style={styles.recPriceVal}>{rec.expectedPrice}</Text>
                  </View>
                </View>

                <Text style={styles.recAdviceText}>{rec.advice}</Text>

                <View style={styles.recFooterRow}>
                  <View style={styles.recCyclePill}>
                    <Clock size={12} color="#64748B" />
                    <Text style={styles.recCycleText}>{rec.cycle}</Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.recAddProduceBtn,
                      pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                    ]}
                    onPress={() => router.push('/(tabs)/produce')}
                  >
                    <Plus size={14} color="#15803D" strokeWidth={2.5} />
                    <Text style={styles.recAddProduceText}>Add to Produce</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── 6. Section: Live APMC Mandi Benchmark Rates ── */}
      <MKSection
        title="Live APMC Mandi Rates"
        actionText="Price Trends"
        onActionPress={() => router.push('/(tabs)/produce')}
      >
        <MKCard style={styles.apmcCard}>
          <View style={styles.apmcHeader}>
            <View style={styles.apmcTitleWrap}>
              <TrendingUp size={18} color="#15803D" />
              <Text style={styles.apmcTitle}>Nashik & Pune APMC Benchmarks</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.livePillDot} />
              <Text style={styles.livePillText}>Live Agmarknet</Text>
            </View>
          </View>

          <View style={styles.apmcGrid}>
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Nashik Red Onion</Text>
              <Text style={styles.apmcPrice}>
                ₹2,450 <Text style={styles.apmcUnit}>/q</Text>
              </Text>
              <Text style={[styles.apmcTrend, { color: '#15803D' }]}>▲ +4.2% today</Text>
            </View>
            <View style={styles.apmcDividerV} />
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Tomato Hybrid</Text>
              <Text style={styles.apmcPrice}>
                ₹1,820 <Text style={styles.apmcUnit}>/q</Text>
              </Text>
              <Text style={[styles.apmcTrend, { color: '#B91C1C' }]}>▼ -1.5% today</Text>
            </View>
            <View style={styles.apmcDividerV} />
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Potato Jyoti</Text>
              <Text style={styles.apmcPrice}>
                ₹1,540 <Text style={styles.apmcUnit}>/q</Text>
              </Text>
              <Text style={[styles.apmcTrend, { color: '#15803D' }]}>▲ +2.1% today</Text>
            </View>
          </View>
        </MKCard>
      </MKSection>

      {/* ── 7. Weather & Harvest Advisory Card ── */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sun size={18} color="#EA580C" />
            <Text style={styles.weatherTitle}>Weather & Harvest Advisory</Text>
          </View>
          <View style={styles.weatherTempBadge}>
            <Text style={styles.weatherTempText}>29°C Sunny</Text>
          </View>
        </View>
        <Text style={styles.weatherBody}>
          Dry conditions expected for next 72 hours with 48% humidity. Perfect window for
          harvesting, curing and loading crops onto transit vehicles.
        </Text>
      </View>

      {/* ════ Interactive Notifications Drawer / Modal (Item Fixed) ════ */}
      <Modal
        visible={notificationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Bell size={20} color="#15803D" />
                <Text style={styles.modalHeaderTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.modalUnreadBadge}>
                    <Text style={styles.modalUnreadText}>{unreadCount} New</Text>
                  </View>
                )}
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setNotificationModalVisible(false)}
              >
                <X size={20} color="#475569" />
              </Pressable>
            </View>

            <View style={styles.modalSubActionsRow}>
              <Text style={styles.modalSubtext}>Recent updates for your farm and sales</Text>
              <Pressable onPress={markAllNotificationsRead}>
                <Text style={styles.markAllReadText}>Mark all read</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.notifScrollView} showsVerticalScrollIndicator={false}>
              {notifications.map((n) => (
                <View
                  key={n.id}
                  style={[styles.notifItemCard, n.unread && styles.notifItemUnread]}
                >
                  <View style={styles.notifItemHeader}>
                    <Text style={styles.notifItemTitle}>{n.title}</Text>
                    <Text style={styles.notifItemTime}>{n.time}</Text>
                  </View>
                  <Text style={styles.notifItemBody}>{n.description}</Text>

                  {n.actionText && n.actionRoute && (
                    <Pressable
                      style={styles.notifActionBtn}
                      onPress={() => {
                        setNotificationModalVisible(false);
                        router.push(n.actionRoute as any);
                      }}
                    >
                      <Text style={styles.notifActionBtnText}>{n.actionText}</Text>
                      <ArrowRight size={14} color="#15803D" strokeWidth={2.4} />
                    </Pressable>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </MKScreen>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* ── 1. Top Bar ── */
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  farmerProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: MKSpacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    flex: 1,
    minWidth: 0,
  },
  greetingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 11.5,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 3,
    flexShrink: 1,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    elevation: 2,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    flexShrink: 0,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── 2. Today at a Glance (Top Middle) ── */
  glanceSectionContainer: {
    marginBottom: 12,
  },
  glanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  glanceSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    minHeight: 132,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    minWidth: 0,
  },
  metricCardLast: {},
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricBigNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1C1E',
    marginBottom: 2,
  },
  metricBigText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#1A1C1E',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricBigTextGreen: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803D',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 5,
  },
  metricStatusPillOrange: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricStatusPillOrangeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  metricStatusPillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricStatusPillGreenText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },

  /* ── 3. Search Bar with Voice Feature ── */
  searchBarWrapper: {
    marginBottom: 12,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
    marginRight: 6,
  },
  voiceMicBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  voiceMicBtnListening: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.08 }],
  },
  voiceListeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  voicePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    marginRight: 8,
  },
  voiceListeningText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#B91C1C',
    flex: 1,
  },
  voiceMatchCard: {
    marginTop: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  voiceMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voiceMatchHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  voiceMatchCropName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#14532D',
    marginTop: 2,
  },
  voiceMatchActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  voiceMatchBtnPrimary: {
    flex: 1,
    backgroundColor: '#15803D',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  voiceMatchBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  voiceMatchBtnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  voiceMatchBtnSecondaryText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ── 4. Hero Sell Card ── */
  heroSellCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    minHeight: 140,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSellContent: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  heroSellTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1A1C1E',
    marginBottom: 4,
    lineHeight: 22,
  },
  heroSellSubtitle: {
    fontSize: 11.5,
    color: '#4B5563',
    marginBottom: 10,
    lineHeight: 16,
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    gap: 5,
    elevation: 2,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  inlineAddBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroBasketImage: {
    width: 88,
    height: 88,
    resizeMode: 'contain',
    flexShrink: 0,
  },

  /* ── 5. Best Opportunity 2-Sided Segmented Section ── */
  opportunitySectionWrap: {
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },
  segmentedTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFE8DC',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 11,
    gap: 5,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    fontWeight: '800',
    color: '#1A1C1E',
  },
  segmentTabCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  segmentTabCountBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  segmentTabCountText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  segmentTabCountTextActive: {
    color: '#15803D',
  },
  opportunityCardsList: {
    gap: 12,
  },
  opportunityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  opportunityCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  oppCropThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  oppCropDetails: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  oppCropTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  oppCropSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  oppDemandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  oppDemandText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  oppPriceBanner: {
    flexDirection: 'row',
    backgroundColor: '#F8FBF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oppPricePrimary: {
    flex: 1,
  },
  oppPricePrimaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  oppPricePrimaryValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#14532D',
  },
  oppPriceDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#BBF7D0',
    marginHorizontal: 10,
  },
  oppPriceSecondary: {
    flex: 1,
    alignItems: 'flex-end',
  },
  oppPriceSecondaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  oppPriceSecondaryValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#334155',
  },
  oppBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  oppBuyerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  oppBuyerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  oppActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#15803D',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    flexShrink: 0,
    elevation: 1,
  },
  oppActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── Produce Recommendations Cards ── */
  recCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  recCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  recBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  recCropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  recPriceWrap: {
    alignItems: 'flex-end',
  },
  recPriceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  recPriceVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803D',
    marginTop: 2,
  },
  recAdviceText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  recFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recCyclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  recCycleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  recAddProduceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  recAddProduceText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },

  /* ── 6. APMC Mandi Rates ── */
  apmcCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
  },
  apmcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  apmcTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apmcTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  livePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  livePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  apmcGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  apmcItem: {
    flex: 1,
    alignItems: 'center',
  },
  apmcDividerV: {
    width: 1,
    height: 38,
    backgroundColor: '#E5E7EB',
  },
  apmcCrop: {
    fontSize: 11.5,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  apmcPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  apmcUnit: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  apmcTrend: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },

  /* ── 7. Weather Card ── */
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    marginTop: 12,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  weatherTempBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  weatherTempText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C2410C',
  },
  weatherBody: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },

  /* ── Notification Modal ── */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  modalUnreadBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  modalUnreadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  markAllReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  notifScrollView: {
    marginBottom: 10,
  },
  notifItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifItemUnread: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  notifItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  notifItemTime: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  notifItemBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  notifActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  notifActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
});
