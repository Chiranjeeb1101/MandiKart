/**
 * MandiKart Farmer App — Home Screen (UI UX Pro Max Refinement)
 *
 * Fully refined according to farmer UX requirements:
 * 1. Farmer Profile Header: Tighter, compact (48x48 avatar, 42x42 bell), aligned more to the left
 * 2. Search Bar with Interactive Auto-Suggestions Dropdown (tap/type reveals instant crop/buyer/rates suggestions)
 * 3. Earnings Hero Card with Interactive "Financial Breakdown & Monthly Target Manager" modal
 *    - Allows farmer to dynamically change monthly target with presets & stepper
 *    - Displays itemized financial stats (Gross, Middleman Saved, Net Received, Escrow Pending)
 * 4. Elevated tactile shadows on Quick Action cards and Your Crops cards
 * 5. Important Updates section removed per request
 * 6. "High Demanded to Sell" and "Produce Recommendations" 2-sided segmented intelligence section
 *    - Side 1: Direct corporate buyer bids with 1-tap "Sell Now" navigation
 *    - Side 2: Regional crop intelligence & margin forecasts with 1-tap "Add to Produce"
 * 7. Smooth, fluid scrolling with bottom tab bar clearance (no screen sticking or cutoff)
 */

import React, { useState, useMemo } from 'react';
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
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Bell,
  Search,
  Mic,
  Wallet,
  TrendingUp,
  Leaf,
  Sprout,
  Tag,
  Users,
  BarChart3,
  ChevronRight,
  Flame,
  ArrowRight,
  Lightbulb,
  Eye,
  EyeOff,
  X,
  Edit3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Plus,
} from 'lucide-react-native';
import { MKScreen } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const HERO_PLANT_BG_URI =
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80';

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA';

const TOMATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const POTATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

const GARLIC_PHOTO_URI =
  'https://images.unsplash.com/photo-1615477550926-db6d36e29780?w=300&auto=format&fit=crop&q=80';

const CORN_PHOTO_URI =
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&auto=format&fit=crop&q=80';

const PEAS_PHOTO_URI =
  'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=300&auto=format&fit=crop&q=80';

const SEARCH_SUGGESTIONS = [
  { id: 's1', label: '🧅 Nashik Red Onion (High Demand)', type: 'crop', query: 'Onion', route: '/(tabs)/sell' },
  { id: 's2', label: '🍅 Hybrid Fresh Tomato (₹24/kg)', type: 'rate', query: 'Tomato', route: '/sell/best-options' },
  { id: 's3', label: '🏢 Reliance Fresh Sourcing Hub', type: 'buyer', query: 'Reliance', route: '/sell/requests' },
  { id: 's4', label: '🥔 Jyoti Washed Potato (Clean Table Quality)', type: 'crop', query: 'Potato', route: '/(tabs)/sell' },
  { id: 's5', label: '🌾 APMC Wheat Benchmark Rates', type: 'rate', query: 'Wheat', route: '/sell/best-options' },
  { id: 's6', label: '🚛 Farmgate Transit Vehicle Tracking', type: 'service', query: 'Tracking', route: '/orders/track-vehicle' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Search & Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Earnings & Monthly Target State
  const [showEarningsAmount, setShowEarningsAmount] = useState(true);
  const [monthlyTarget, setMonthlyTarget] = useState(100000);
  const [tempTargetInput, setTempTargetInput] = useState('100000');
  const [earningsModalVisible, setEarningsModalVisible] = useState(false);

  // Two-Sided Intelligence Section State ('high_demand' vs 'recommendations')
  const [activeIntelTab, setActiveIntelTab] = useState<'high_demand' | 'recommendations'>('high_demand');

  // Voice Search
  const { isListening, transcript, startListening, stopListening, resetVoiceSearch } =
    useVoiceSearch();
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const farmerName = user?.firstName || (user?.name ? user.name.split(' ')[0] : user?.phone ? user.phone : 'Ramesh');
  const farmerLocation = (user as any)?.village
    ? `${(user as any).village}, ${(user as any).city || user?.district || ''}, ${user?.state || ''}`
    : user?.district
    ? `${user.district}, ${user?.state || 'Maharashtra'}`
    : user?.state || 'Nashik, Maharashtra';

  const targetProgressPct = Math.min(100, Math.round((48500 / monthlyTarget) * 100));

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_SUGGESTIONS;
    return SEARCH_SUGGESTIONS.filter((s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.query.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectSuggestion = (item: (typeof SEARCH_SUGGESTIONS)[0]) => {
    setSearchQuery(item.query);
    setSearchFocused(false);
    router.push(item.route as any);
  };

  const handleTriggerVoice = () => {
    setVoiceModalVisible(true);
    startListening();
  };

  const handleCloseVoice = () => {
    stopListening();
    resetVoiceSearch();
    setVoiceModalVisible(false);
  };

  const handleSaveMonthlyTarget = (newVal?: number) => {
    const targetVal = newVal !== undefined ? newVal : parseInt(tempTargetInput, 10);
    if (isNaN(targetVal) || targetVal < 10000) {
      Alert.alert('Invalid Target', 'Please enter a target amount of at least ₹10,000.');
      return;
    }
    setMonthlyTarget(targetVal);
    setTempTargetInput(targetVal.toString());
    Alert.alert('Target Updated', `Your monthly earning goal is now set to ₹${targetVal.toLocaleString()}.`);
  };

  const insets = useSafeAreaInsets();
  const safeTopPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20
  ) + 10;

  return (
    <MKScreen
      scrollable
      contentContainerStyle={[
        styles.screenScrollContent,
        { paddingTop: safeTopPadding },
      ]}
      bottomClearanceExtra={24}
    >
      {/* ── 1. Farmer Profile Header (Shifted Left & Compact) ─ */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftCol}>
          {/* Circular Avatar with Online Badge */}
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: user?.avatarUri || FARMER_AVATAR_URI }}
              style={styles.avatarImg}
            />
            <View style={styles.onlineBadge} />
          </View>

          {/* Greeting & Location */}
          <View style={styles.profileTextCol}>
            <Text numberOfLines={1} style={styles.greetingText}>
              Namaste, {farmerName} 👋
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#16A34A" strokeWidth={2.4} />
              <Text numberOfLines={1} style={styles.locationText}>
                {farmerLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Circular Notification Bell */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={({ pressed }) => [styles.bellBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] }]}
          onPress={() => router.push('/more/notifications')}
          hitSlop={8}
        >
          <Bell size={19} color="#111827" strokeWidth={2.2} />
          <View style={styles.unreadDot} />
        </Pressable>
      </View>

      {/* ── 2. Search Bar with Live Suggestions Dropdown ────── */}
      <View style={styles.searchSectionWrap}>
        <View style={[styles.searchBarContainer, searchFocused && styles.searchBarContainerFocused]}>
          <Search size={19} color={searchFocused ? '#16A34A' : '#64748B'} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops, buyers, mandi rates..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6} style={{ padding: 4, marginRight: 2 }}>
              <X size={16} color="#64748B" />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voice search"
            style={({ pressed }) => [styles.micCircleBtn, pressed && { transform: [{ scale: 0.94 }] }]}
            onPress={handleTriggerVoice}
            hitSlop={6}
          >
            <Mic size={17} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Suggestions Panel (Dropdown) */}
        {searchFocused && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>Suggested Searches</Text>
              <Pressable onPress={() => setSearchFocused(false)} hitSlop={8}>
                <Text style={styles.suggestionsCloseText}>Close</Text>
              </Pressable>
            </View>

            {filteredSuggestions.slice(0, 4).map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: '#F1F5F9' }]}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Search size={14} color="#16A34A" />
                <Text numberOfLines={1} style={styles.suggestionLabel}>
                  {item.label}
                </Text>
                <ChevronRight size={14} color="#94A3B8" />
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* ── 3. Earnings Hero Card (Interactive) ─────────────── */}
      <Pressable
        style={({ pressed }) => [styles.earningsCard, pressed && { opacity: 0.97 }]}
        onPress={() => setEarningsModalVisible(true)}
      >
        <LinearGradient
          colors={['#126B38', '#168A45']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsGradient}
        >
          {/* Background image & gradient blend */}
          <Image
            source={{ uri: HERO_PLANT_BG_URI }}
            style={styles.earningsPlantBg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(18, 107, 56, 0.96)', 'rgba(22, 138, 69, 0.75)', 'rgba(22, 138, 69, 0.45)']}
            start={{ x: 0.45, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Top Row: Total Earnings & Withdraw */}
          <View style={styles.earningsTopRow}>
            {/* Left Column */}
            <View style={styles.earningsLeftCol}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setShowEarningsAmount(!showEarningsAmount);
                }}
                style={styles.earningsTitleRow}
                hitSlop={8}
              >
                <Text style={styles.earningsTitleText}>Total Earnings</Text>
                {showEarningsAmount ? (
                  <Eye size={14} color="#DCFCE7" />
                ) : (
                  <EyeOff size={14} color="#DCFCE7" />
                )}
              </Pressable>

              <Text style={styles.earningsAmountText}>
                {showEarningsAmount ? '₹48,500' : '••••••'}
              </Text>

              <View style={styles.earningsTrendRow}>
                <TrendingUp size={13} color="#86EFAC" strokeWidth={2.5} />
                <Text style={styles.earningsTrendText}>+18% this month</Text>
              </View>
            </View>

            {/* Right Column: Withdraw Button & Quote */}
            <View style={styles.earningsRightCol}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Withdraw Earnings"
                style={({ pressed }) => [styles.withdrawBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push('/earnings');
                }}
                hitSlop={8}
              >
                <Wallet size={13} color="#168A45" strokeWidth={2.3} />
                <Text style={styles.withdrawBtnText}>Withdraw</Text>
                <ArrowRight size={12} color="#168A45" strokeWidth={2.5} />
              </Pressable>

              <View style={styles.quoteWrap}>
                <Sprout size={11} color="#86EFAC" style={{ marginTop: 2 }} />
                <Text style={styles.quoteText}>
                  "Good farming today,{"\n"}better tomorrow."
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Inset Container: Monthly Target */}
          <View style={styles.monthlyTargetContainer}>
            <View style={styles.targetHeaderRow}>
              <View style={styles.targetTitleLeft}>
                <View style={styles.targetLeafWrap}>
                  <Leaf size={11} color="#86EFAC" strokeWidth={2.4} />
                </View>
                <Text style={styles.targetTitleText}>Monthly Target</Text>
                <View style={styles.editTargetMiniTag}>
                  <Edit3 size={10} color="#DCFCE7" />
                  <Text style={styles.editTargetMiniText}>Tap to set</Text>
                </View>
              </View>
              <Text style={styles.targetAmountText}>
                ₹48,500 / ₹{monthlyTarget.toLocaleString()}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${targetProgressPct}%` }]} />
              </View>
              <Text style={styles.progressPctText}>{targetProgressPct}%</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>

      {/* ── 4. Quick Actions (With Enhanced Shadows) ───────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionsGrid}>
        {/* Action 1: My Crops */}
        <Pressable
          style={({ pressed }) => [styles.quickCard, { backgroundColor: '#ECFDF3', borderColor: '#BBF7D0' }, pressed && styles.cardPressed]}
          onPress={() => router.push('/(tabs)/produce')}
          hitSlop={6}
        >
          <Sprout size={26} color="#168A45" strokeWidth={2.2} />
          <View style={styles.quickCardTextCol}>
            <Text numberOfLines={1} style={styles.quickCardTitle}>My Crops</Text>
            <Text numberOfLines={1} style={styles.quickCardSub}>View & Manage</Text>
          </View>
          <View style={styles.quickMiniArrow}>
            <ChevronRight size={13} color="#111827" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* Action 2: Market Prices */}
        <Pressable
          style={({ pressed }) => [styles.quickCard, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }, pressed && styles.cardPressed]}
          onPress={() => router.push('/market-prices')}
          hitSlop={8}
        >
          <Tag size={26} color="#F97316" strokeWidth={2.2} />
          <View style={styles.quickCardTextCol}>
            <Text numberOfLines={1} style={styles.quickCardTitle}>Market Prices</Text>
            <Text numberOfLines={1} style={styles.quickCardSub}>Check Rates</Text>
          </View>
          <View style={styles.quickMiniArrow}>
            <ChevronRight size={13} color="#111827" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* Action 3: Buyer Requests */}
        <Pressable
          style={({ pressed }) => [styles.quickCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }, pressed && styles.cardPressed]}
          onPress={() => router.push('/sell/requests')}
          hitSlop={8}
        >
          <View style={{ position: 'relative' }}>
            <Users size={26} color="#2563EB" strokeWidth={2.2} />
            <View style={styles.requestBadge}>
              <Text style={styles.requestBadgeText}>3</Text>
            </View>
          </View>
          <View style={styles.quickCardTextCol}>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.quickCardTitle}>Buyer Requests</Text>
            <Text numberOfLines={1} style={styles.quickCardSub}>New Requests</Text>
          </View>
          <View style={styles.quickMiniArrow}>
            <ChevronRight size={13} color="#111827" strokeWidth={2.4} />
          </View>
        </Pressable>

        {/* Action 4: Market Trends */}
        <Pressable
          style={({ pressed }) => [styles.quickCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }, pressed && styles.cardPressed]}
          onPress={() => router.push('/market-trends')}
          hitSlop={8}
        >
          <BarChart3 size={26} color="#7C3AED" strokeWidth={2.2} />
          <View style={styles.quickCardTextCol}>
            <Text numberOfLines={1} style={styles.quickCardTitle}>Market Trends</Text>
            <Text numberOfLines={1} style={styles.quickCardSub}>See What's Rising</Text>
          </View>
          <View style={styles.quickMiniArrow}>
            <ChevronRight size={13} color="#111827" strokeWidth={2.4} />
          </View>
        </Pressable>
      </View>

      {/* ── 5. Your Crops (Enhanced Shadows & Tactile Feel) ── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Your Crops</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cropRowScroll}
      >
        {/* Onion Card */}
        <Pressable
          style={({ pressed }) => [styles.cropCard, pressed && styles.cardPressed]}
          onPress={() => router.push('/(tabs)/produce')}
          hitSlop={6}
        >
          <Image source={{ uri: ONION_PHOTO_URI }} style={styles.cropCardThumb} />
          <View style={styles.cropCardTextCol}>
            <Text numberOfLines={1} style={styles.cropCardName}>Onion</Text>
            <Text numberOfLines={1} style={styles.cropCardQty}>1,000 kg</Text>
          </View>
          <ChevronRight size={15} color="#94A3B8" strokeWidth={2.4} />
        </Pressable>

        {/* Tomato Card */}
        <Pressable
          style={({ pressed }) => [styles.cropCard, pressed && styles.cardPressed]}
          onPress={() => router.push('/(tabs)/produce')}
          hitSlop={6}
        >
          <Image source={{ uri: TOMATO_PHOTO_URI }} style={styles.cropCardThumb} />
          <View style={styles.cropCardTextCol}>
            <Text numberOfLines={1} style={styles.cropCardName}>Tomato</Text>
            <Text numberOfLines={1} style={styles.cropCardQty}>500 kg</Text>
          </View>
          <ChevronRight size={15} color="#94A3B8" strokeWidth={2.4} />
        </Pressable>

        {/* Potato Card */}
        <Pressable
          style={({ pressed }) => [styles.cropCard, pressed && styles.cardPressed]}
          onPress={() => router.push('/(tabs)/produce')}
          hitSlop={6}
        >
          <Image source={{ uri: POTATO_PHOTO_URI }} style={styles.cropCardThumb} />
          <View style={styles.cropCardTextCol}>
            <Text numberOfLines={1} style={styles.cropCardName}>Potato</Text>
            <Text numberOfLines={1} style={styles.cropCardQty}>800 kg</Text>
          </View>
          <ChevronRight size={15} color="#94A3B8" strokeWidth={2.4} />
        </Pressable>
      </ScrollView>

      {/* ── 6. Two-Sided Market Intelligence Section ────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Best Opportunity for You</Text>
      </View>

      <View style={styles.intelHeaderBlock}>
        <View style={styles.segmentedToggleContainer}>
          <Pressable
            style={[styles.segmentBtn, activeIntelTab === 'high_demand' && styles.segmentBtnActive]}
            onPress={() => setActiveIntelTab('high_demand')}
          >
            <Flame size={14} color={activeIntelTab === 'high_demand' ? '#EA580C' : '#64748B'} strokeWidth={2.4} />
            <Text style={[styles.segmentBtnText, activeIntelTab === 'high_demand' && styles.segmentBtnTextActive]}>
              High Demanded to Sell
            </Text>
          </Pressable>

          <Pressable
            style={[styles.segmentBtn, activeIntelTab === 'recommendations' && styles.segmentBtnActive]}
            onPress={() => setActiveIntelTab('recommendations')}
          >
            <Sparkles size={14} color={activeIntelTab === 'recommendations' ? '#168A45' : '#64748B'} strokeWidth={2.4} />
            <Text style={[styles.segmentBtnText, activeIntelTab === 'recommendations' && styles.segmentBtnTextActive]}>
              Produce Recommendations
            </Text>
          </Pressable>
        </View>
      </View>

      {/* SIDE 1: High Demanded to Sell Cards */}
      {activeIntelTab === 'high_demand' ? (
        <View style={styles.intelCardsContainer}>
          {/* Card 1: Onion */}
          <View style={styles.oppCard}>
            <View style={styles.oppTopRow}>
              <Image source={{ uri: ONION_PHOTO_URI }} style={styles.oppCropThumb} />
              <View style={styles.oppHeaderInfo}>
                <Text numberOfLines={1} style={styles.oppCropTitle}>Onion • Grade A</Text>
                <Text numberOfLines={1} style={styles.oppCropSubtitle}>Nashik Red Garwa Variety</Text>
              </View>
              <View style={styles.oppBadgePill}>
                <Flame size={12} color="#EA580C" strokeWidth={2.5} />
                <Text style={styles.oppBadgeText}>Very High</Text>
              </View>
            </View>

            <View style={styles.oppRateBox}>
              <View style={styles.oppRateCol}>
                <Text style={styles.oppRateTag}>NET FARMER RATE</Text>
                <Text style={styles.oppRateVal}>
                  ₹22.00 <Text style={styles.oppRateUnit}>/kg</Text>
                </Text>
              </View>
              <View style={styles.oppRateDivider} />
              <View style={styles.oppRateCol}>
                <Text style={styles.oppBenchmarkTag}>Mandi Benchmark</Text>
                <Text style={styles.oppBenchmarkVal}>
                  ₹24.00 <Text style={styles.oppBenchmarkUnit}>/kg</Text>
                </Text>
              </View>
            </View>

            <View style={styles.oppBottomRow}>
              <View style={styles.buyersPill}>
                <ShieldCheck size={14} color="#168A45" strokeWidth={2.4} />
                <Text style={styles.buyersPillText}>18 Active Buyers</Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.sellHarvestBtn, pressed && { opacity: 0.9 }]}
                onPress={() => router.push('/(tabs)/sell')}
              >
                <Text style={styles.sellHarvestBtnText}>Sell Harvest</Text>
                <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          {/* Card 2: Hybrid Tomato */}
          <View style={styles.oppCard}>
            <View style={styles.oppTopRow}>
              <Image source={{ uri: TOMATO_PHOTO_URI }} style={styles.oppCropThumb} />
              <View style={styles.oppHeaderInfo}>
                <Text numberOfLines={1} style={styles.oppCropTitle}>Hybrid Tomato • Grade A</Text>
                <Text numberOfLines={1} style={styles.oppCropSubtitle}>Semi-Ripe Fresh Harvest</Text>
              </View>
              <View style={styles.oppBadgePill}>
                <Flame size={12} color="#EA580C" strokeWidth={2.5} />
                <Text style={styles.oppBadgeText}>High</Text>
              </View>
            </View>

            <View style={styles.oppRateBox}>
              <View style={styles.oppRateCol}>
                <Text style={styles.oppRateTag}>NET FARMER RATE</Text>
                <Text style={styles.oppRateVal}>
                  ₹21.50 <Text style={styles.oppRateUnit}>/kg</Text>
                </Text>
              </View>
              <View style={styles.oppRateDivider} />
              <View style={styles.oppRateCol}>
                <Text style={styles.oppBenchmarkTag}>Mandi Benchmark</Text>
                <Text style={styles.oppBenchmarkVal}>
                  ₹23.00 <Text style={styles.oppBenchmarkUnit}>/kg</Text>
                </Text>
              </View>
            </View>

            <View style={styles.oppBottomRow}>
              <View style={styles.buyersPill}>
                <ShieldCheck size={14} color="#168A45" strokeWidth={2.4} />
                <Text style={styles.buyersPillText}>14 Active Buyers</Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.sellHarvestBtn, pressed && { opacity: 0.9 }]}
                onPress={() => router.push('/(tabs)/sell')}
              >
                <Text style={styles.sellHarvestBtnText}>Sell Harvest</Text>
                <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        /* SIDE 2: Produce Recommendations Cards */
        <View style={styles.intelCardsContainer}>
          {/* Recommendation 1: Garlic */}
          <View style={styles.oppCard}>
            <View style={styles.oppTopRow}>
              <Image source={{ uri: GARLIC_PHOTO_URI }} style={styles.oppCropThumb} />
              <View style={styles.oppHeaderInfo}>
                <Text numberOfLines={1} style={styles.oppCropTitle}>Garlic (Ooty Hybrid) • Grade A</Text>
                <Text numberOfLines={1} style={styles.oppCropSubtitle}>High Export Demand • 90 Days Cycle</Text>
              </View>
              <View style={[styles.oppBadgePill, { backgroundColor: '#F3E8FF' }]}>
                <TrendingUp size={12} color="#7C3AED" strokeWidth={2.5} />
                <Text style={[styles.oppBadgeText, { color: '#7C3AED' }]}>+42% Margin</Text>
              </View>
            </View>

            <View style={styles.oppRateBox}>
              <View style={styles.oppRateCol}>
                <Text style={styles.oppRateTag}>EST. HARVEST RATE</Text>
                <Text style={styles.oppRateVal}>
                  ₹180.00 <Text style={styles.oppRateUnit}>/kg</Text>
                </Text>
              </View>
              <View style={styles.oppRateDivider} />
              <View style={styles.oppRateCol}>
                <Text style={styles.oppBenchmarkTag}>Mandi Benchmark</Text>
                <Text style={styles.oppBenchmarkVal}>
                  ₹150.00 <Text style={styles.oppBenchmarkUnit}>/kg</Text>
                </Text>
              </View>
            </View>

            <View style={styles.oppBottomRow}>
              <View style={styles.buyersPill}>
                <ShieldCheck size={14} color="#168A45" strokeWidth={2.4} />
                <Text style={styles.buyersPillText}>22 Active Buyers</Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.sellHarvestBtn, pressed && { opacity: 0.9 }]}
                onPress={() => router.push('/produce/add')}
              >
                <Plus size={14} color="#FFFFFF" strokeWidth={2.8} />
                <Text style={styles.sellHarvestBtnText}>Add Crop</Text>
              </Pressable>
            </View>
          </View>

          {/* Recommendation 2: Baby Corn */}
          <View style={styles.oppCard}>
            <View style={styles.oppTopRow}>
              <Image source={{ uri: CORN_PHOTO_URI }} style={styles.oppCropThumb} />
              <View style={styles.oppHeaderInfo}>
                <Text numberOfLines={1} style={styles.oppCropTitle}>Baby Corn (Golden Sweet) • Grade A</Text>
                <Text numberOfLines={1} style={styles.oppCropSubtitle}>Quick Turnaround • 60 Days Harvest</Text>
              </View>
              <View style={[styles.oppBadgePill, { backgroundColor: '#FEF3C7' }]}>
                <TrendingUp size={12} color="#D97706" strokeWidth={2.5} />
                <Text style={[styles.oppBadgeText, { color: '#D97706' }]}>+35% Margin</Text>
              </View>
            </View>

            <View style={styles.oppRateBox}>
              <View style={styles.oppRateCol}>
                <Text style={styles.oppRateTag}>EST. HARVEST RATE</Text>
                <Text style={styles.oppRateVal}>
                  ₹65.00 <Text style={styles.oppRateUnit}>/kg</Text>
                </Text>
              </View>
              <View style={styles.oppRateDivider} />
              <View style={styles.oppRateCol}>
                <Text style={styles.oppBenchmarkTag}>Mandi Benchmark</Text>
                <Text style={styles.oppBenchmarkVal}>
                  ₹52.00 <Text style={styles.oppBenchmarkUnit}>/kg</Text>
                </Text>
              </View>
            </View>

            <View style={styles.oppBottomRow}>
              <View style={styles.buyersPill}>
                <ShieldCheck size={14} color="#168A45" strokeWidth={2.4} />
                <Text style={styles.buyersPillText}>16 Active Buyers</Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.sellHarvestBtn, pressed && { opacity: 0.9 }]}
                onPress={() => router.push('/produce/add')}
              >
                <Plus size={14} color="#FFFFFF" strokeWidth={2.8} />
                <Text style={styles.sellHarvestBtnText}>Add Crop</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ── 7. Live APMC Mandi Rates ─────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Live APMC Mandi Rates</Text>
        <Pressable onPress={() => router.push('/market-trends')} hitSlop={8}>
          <Text style={styles.priceTrendsText}>Price Trends</Text>
        </Pressable>
      </View>

      <View style={styles.mandiRatesCard}>
        <View style={styles.mandiRatesHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#168A45" strokeWidth={2.4} />
            <Text style={styles.mandiRatesTitle}>Nashik & Pune APMC Benchmarks</Text>
          </View>
          <View style={styles.liveAgmarknetBadge}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.liveAgmarknetText}>Live Agmarknet</Text>
          </View>
        </View>

        <View style={styles.mandiRatesGrid}>
          <View style={styles.mandiRateCol}>
            <Text style={styles.mandiCropName}>Nashik Red Onion</Text>
            <Text style={styles.mandiPrice}>₹2,450 <Text style={styles.mandiUnit}>/q</Text></Text>
            <Text style={[styles.mandiTrendText, { color: '#16A34A' }]}>▲ +4.2% today</Text>
          </View>
          <View style={styles.mandiDivider} />
          <View style={styles.mandiRateCol}>
            <Text style={styles.mandiCropName}>Tomato Hybrid</Text>
            <Text style={styles.mandiPrice}>₹1,820 <Text style={styles.mandiUnit}>/q</Text></Text>
            <Text style={[styles.mandiTrendText, { color: '#DC2626' }]}>▼ -1.5% today</Text>
          </View>
          <View style={styles.mandiDivider} />
          <View style={styles.mandiRateCol}>
            <Text style={styles.mandiCropName}>Potato Jyoti</Text>
            <Text style={styles.mandiPrice}>₹1,540 <Text style={styles.mandiUnit}>/q</Text></Text>
            <Text style={[styles.mandiTrendText, { color: '#16A34A' }]}>▲ +2.1% today</Text>
          </View>
        </View>
      </View>

      {/* ── 8. Weather & Harvest Advisory ────────────────────── */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 18 }}>☀️</Text>
            <Text style={styles.weatherTitle}>Weather & Harvest Advisory</Text>
          </View>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherBadgeText}>29°C Sunny</Text>
          </View>
        </View>
        <Text style={styles.weatherSub}>
          Sunny conditions expected for next 72 hours with 42% humidity. Optimal conditions for onion drying and open field harvest.
        </Text>
      </View>

      {/* ── 7. Interactive Earnings & Monthly Target Modal ──── */}
      <Modal
        visible={earningsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEarningsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.earningsModalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Wallet size={20} color="#168A45" strokeWidth={2.4} />
                <Text style={styles.modalTitle}>Financial Intelligence</Text>
              </View>
              <Pressable onPress={() => setEarningsModalVisible(false)} hitSlop={10}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Gross vs Net Breakdown Cards */}
              <View style={styles.financialStatsBox}>
                <Text style={styles.financialSectionHeading}>This Month Performance</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Realized Sales</Text>
                  <Text style={styles.statVal}>₹56,200</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Direct MandiKart Benefit (Zero Middleman)</Text>
                  <Text style={[styles.statVal, { color: '#168A45' }]}>+ ₹7,700 Saved</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Transit Fees & Weighbridge</Text>
                  <Text style={[styles.statVal, { color: '#DC2626' }]}>- ₹0.00 (Free Pickup)</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.statRow}>
                  <Text style={styles.statTotalLabel}>Net Farmer Take-Home</Text>
                  <Text style={styles.statTotalVal}>₹48,500</Text>
                </View>
              </View>

              {/* Set New Monthly Target Section */}
              <View style={styles.targetSetterCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Leaf size={16} color="#168A45" />
                  <Text style={styles.targetSetterTitle}>Update Monthly Target</Text>
                </View>
                <Text style={styles.targetSetterSub}>
                  Set your personal revenue goal to track sales motivation and progress.
                </Text>

                {/* Target Value Input */}
                <View style={styles.targetInputRow}>
                  <Text style={styles.targetRupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.targetTextInput}
                    keyboardType="numeric"
                    value={tempTargetInput}
                    onChangeText={setTempTargetInput}
                    placeholder="100000"
                  />
                </View>

                {/* Quick Target Presets */}
                <Text style={styles.presetLabel}>Quick Presets:</Text>
                <View style={styles.presetsRow}>
                  {[75000, 100000, 150000, 200000].map((val) => (
                    <Pressable
                      key={val}
                      style={[
                        styles.presetPill,
                        monthlyTarget === val && styles.presetPillActive,
                      ]}
                      onPress={() => {
                        setTempTargetInput(val.toString());
                        handleSaveMonthlyTarget(val);
                      }}
                    >
                      <Text style={[styles.presetText, monthlyTarget === val && styles.presetTextActive]}>
                        ₹{(val / 1000)}k
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Save Target CTA */}
                <Pressable
                  style={styles.saveTargetBtn}
                  onPress={() => {
                    handleSaveMonthlyTarget();
                    setEarningsModalVisible(false);
                  }}
                >
                  <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.saveTargetBtnText}>Save Target Goal</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── 8. Voice Search Modal ──────────────────────────── */}
      <Modal
        visible={voiceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseVoice}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseVoice}>
          <View style={styles.voiceModalCard}>
            <View style={styles.voiceMicCircle}>
              <Mic size={32} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.voiceModalTitle}>Listening to your voice...</Text>
            <Text style={styles.voiceModalHint}>
              Speak crop name, buyer query, or mandi rates
            </Text>
            {transcript ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptText}>"{transcript}"</Text>
              </View>
            ) : null}
            <Pressable style={styles.voiceCloseBtn} onPress={handleCloseVoice}>
              <Text style={styles.voiceCloseBtnText}>Done / Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  screenScrollContent: {
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },

  /* ── 1. Farmer Profile Header (Shifted Left & Compact) ── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#16A34A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  greetingText: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E8E3DA',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* ── 2. Search Section & Suggestions ── */
  searchSectionWrap: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchBarContainerFocused: {
    borderColor: '#16A34A',
    backgroundColor: '#FAFCF8',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  micCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    elevation: 2,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2D9CC',
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EBE1',
    marginBottom: 4,
  },
  suggestionsTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 8,
  },
  suggestionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },

  /* ── 3. Earnings Hero Card ── */
  earningsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#126B38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  earningsGradient: {
    padding: 15,
    position: 'relative',
  },
  earningsPlantBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    opacity: 0.45,
  },
  earningsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  earningsLeftCol: {
    flex: 1,
  },
  earningsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  earningsTitleText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#DCFCE7',
  },
  earningsAmountText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: -0.4,
  },
  earningsTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  earningsTrendText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#86EFAC',
  },
  earningsRightCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  withdrawBtn: {
    backgroundColor: '#FFFFFF',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  withdrawBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#168A45',
  },
  quoteWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 6,
  },
  quoteText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#DCFCE7',
    textAlign: 'right',
    lineHeight: 14,
  },
  monthlyTargetContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
    zIndex: 2,
  },
  targetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  targetTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  targetLeafWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetTitleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  editTargetMiniTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 8,
    marginLeft: 4,
  },
  editTargetMiniText: {
    fontSize: 9.5,
    color: '#DCFCE7',
    fontWeight: '700',
  },
  targetAmountText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3.5,
  },
  progressPctText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── Headers & Section Titles ── */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#16A34A',
  },

  /* ── 4. Quick Actions (Elevated Shadows) ── */
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  quickCard: {
    flex: 1,
    height: 106,
    borderRadius: 14,
    borderWidth: 1.2,
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  quickCardTextCol: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 1,
  },
  quickCardTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  quickCardSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  quickMiniArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EFF6FF',
  },
  requestBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* ── 5. Your Crops (Enhanced Tactile Elevation) ── */
  cropRowScroll: {
    gap: 10,
    paddingRight: 6,
    marginBottom: 20,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: '#E2D9CC',
    padding: 8,
    paddingRight: 10,
    width: 142,
    height: 60,
    gap: 8,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },
  cropCardThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  cropCardTextCol: {
    flex: 1,
    minWidth: 0,
  },
  cropCardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  cropCardQty: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },

  /* ── 6. Two-Sided Intelligence Segmented Section ── */
  intelHeaderBlock: {
    marginBottom: 12,
  },
  segmentedToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAE4D9',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#111827',
  },
  intelCardsContainer: {
    gap: 12,
    marginBottom: 20,
  },

  /* Opportunity & Recommendation Card (Master Image Match) */
  oppCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    padding: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },
  oppTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  oppCropThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  oppHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  oppCropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  oppCropSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  oppBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  oppBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#EA580C',
  },
  oppRateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  oppRateCol: {
    flex: 1,
  },
  oppRateTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  oppRateVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  oppRateUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  oppRateDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#BBF7D0',
    marginHorizontal: 14,
  },
  oppBenchmarkTag: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  oppBenchmarkVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  oppBenchmarkUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  oppBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyersPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF3',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  buyersPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  sellHarvestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#168A45',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    elevation: 2,
    shadowColor: '#168A45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  sellHarvestBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── 7. Live APMC Mandi Rates ── */
  mandiRatesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    padding: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  mandiRatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EBE1',
  },
  mandiRatesTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#111827',
  },
  liveAgmarknetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveAgmarknetText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  mandiRatesGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mandiRateCol: {
    flex: 1,
    alignItems: 'center',
  },
  mandiCropName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  mandiPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  mandiUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  mandiTrendText: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },
  mandiDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F1EBE1',
  },
  priceTrendsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },

  /* ── 8. Weather & Harvest Advisory ── */
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    padding: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weatherTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#111827',
  },
  weatherBadge: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  weatherBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  weatherSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
  },

  /* ── 7. Earnings Breakdown & Target Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    justifyContent: 'flex-end',
  },
  earningsModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EBE1',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  financialStatsBox: {
    backgroundColor: '#F8FAF6',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8DC',
    padding: 14,
    marginBottom: 16,
  },
  financialSectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#15803D',
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  statLabel: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 8,
  },
  statTotalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#15803D',
  },
  targetSetterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2D9CC',
    padding: 14,
    marginBottom: 20,
  },
  targetSetterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  targetSetterSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  targetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#16A34A',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  targetRupeeSymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16A34A',
    marginRight: 6,
  },
  targetTextInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  presetLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetPill: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetPillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  presetText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  presetTextActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  saveTargetBtn: {
    backgroundColor: '#168A45',
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveTargetBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ── 8. Voice Search Modal ── */
  voiceModalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  voiceMicCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  voiceModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  voiceModalHint: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  transcriptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 14,
  },
  transcriptText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#168A45',
    textAlign: 'center',
  },
  voiceCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  voiceCloseBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  cardPressed: {
    opacity: 0.78,
  },
});
