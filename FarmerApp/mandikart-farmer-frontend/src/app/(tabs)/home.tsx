/**
 * MandiKart — Home Dashboard Screen
 * 
 * Features:
 * - High contrast greeting with safe status bar breathing room
 * - Visual "Sell Today" Hero Card with distinct borders and shadows
 * - "Best Opportunity for You" Decision Card with clean breakdown boxes
 * - "Today at a Glance" stat counters encapsulated in separated cards
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
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
  Languages,
  CheckCircle2,
} from 'lucide-react-native';
import { MKScreen, MKSection, MKCard, MKButton, MKStatusBadge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { useAppStore, LanguageCode } from '@/store/appStore';
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

  const { t, language } = useTranslation();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { isListening, transcript, match, startListening, stopListening, resetVoiceSearch } = useVoiceSearch();

  const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'hi', label: 'HI', nativeName: 'हिंदी' },
    { code: 'or', label: 'OD', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'mr', label: 'MR', nativeName: 'मराठी' },
  ];

  return (
    <MKScreen>
      {/* ── 1. Top App Bar ── */}
      <View style={styles.topAppBar}>
        <View style={styles.farmerProfileHeader}>
          <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatarImage} />
          <View style={styles.greetingContainer}>
            <Text numberOfLines={1} style={styles.greetingTitle}>
              {language === 'or' ? `ନମସ୍କାର, ${farmerName}` : language === 'hi' ? `नमस्ते, ${farmerName}` : language === 'mr' ? `नमस्कार, ${farmerName}` : `Namaste, ${farmerName}`} 👋
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

      {/* ── Vernacular Language Switcher ── */}
      <View style={styles.langBar}>
        <View style={styles.langBarLeft}>
          <Languages size={14} color={MKColors.primaryGreen} strokeWidth={2.2} />
          <Text style={styles.langBarLabel}>
            {language === 'or' ? 'ଭାଷା:' : language === 'hi' ? 'भाषा:' : language === 'mr' ? 'भाषा:' : 'Language:'}
          </Text>
        </View>
        <View style={styles.langPillsRow}>
          {SUPPORTED_LANGUAGES.map((item) => (
            <Pressable
              key={item.code}
              onPress={() => setLanguage(item.code)}
              style={[
                styles.langPill,
                language === item.code && styles.langPillActive,
              ]}
            >
              <Text
                style={[
                  styles.langPillText,
                  language === item.code && styles.langPillTextActive,
                ]}
              >
                {item.nativeName}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Vernacular Voice Search Bar ── */}
      <View style={styles.voiceSearchContainer}>
        <View style={styles.voiceSearchInputRow}>
          <Pressable
            onPress={isListening ? stopListening : startListening}
            style={[styles.micButton, isListening && styles.micButtonListening]}
            accessibilityRole="button"
            accessibilityLabel="Voice search"
          >
            {isListening ? (
              <MicOff size={18} color="#FFFFFF" strokeWidth={2.4} />
            ) : (
              <Mic size={18} color="#FFFFFF" strokeWidth={2.4} />
            )}
          </Pressable>
          <View style={styles.voiceSearchTextContainer}>
            <Text style={styles.voiceSearchTitle}>
              {language === 'or'
                ? 'ଫସଲ ନାମ କୁହନ୍ତୁ (Voice Search)...'
                : language === 'hi'
                ? 'फसल का नाम बोलें (Voice Search)...'
                : language === 'mr'
                ? 'पिकाचे नाव बोला (Voice Search)...'
                : 'Speak or search crop name...'}
            </Text>
            <Text style={styles.voiceSearchSub}>
              {isListening
                ? language === 'or' ? 'ଶୁଣୁଛି... (Listening)...' : 'Listening now...'
                : language === 'or' ? 'ଉଦା: "ପିଆଜ", "ବିଲାତି", "ଆଳୁ"' : language === 'hi' ? 'उदा: "प्याज", "टमाटर", "आलू"' : language === 'mr' ? 'उदा: "कांदा", "टोमॅटो", "बटाटा"' : 'e.g. "Onion", "Tomato", "Potato"'}
            </Text>
          </View>
        </View>

        {/* Live Speech Recognition & Match Result Card */}
        {(transcript || match) && (
          <View style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <CheckCircle2 size={16} color="#16A34A" />
              <Text style={styles.matchHeaderText}>
                {language === 'or' ? 'ଚିହ୍ନଟ ହୋଇଛି (Recognized):' : 'Recognized Crop:'}
              </Text>
            </View>
            <Text style={styles.matchCropName}>
              {match ? match.cropName : transcript} {match?.vernacularLabel ? `(${match.vernacularLabel})` : ''}
            </Text>
            <View style={styles.matchActionRow}>
              <Pressable
                style={styles.matchActionBtnPrimary}
                onPress={() => router.push('/(tabs)/produce')}
              >
                <Text style={styles.matchActionBtnTextPrimary}>
                  {language === 'or' ? 'ମଣ୍ଡି ଦର ଦେଖନ୍ତୁ' : language === 'hi' ? 'मंडी भाव देखें' : language === 'mr' ? 'बाजार भाव पहा' : 'View Mandi Rate'}
                </Text>
              </Pressable>
              <Pressable style={styles.matchActionBtnSecondary} onPress={resetVoiceSearch}>
                <Text style={styles.matchActionBtnTextSecondary}>
                  {language === 'or' ? 'ପରିଷ୍କାର କରନ୍ତୁ' : 'Clear'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
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

      {/* ── 4. Section: Live APMC Mandi Rates Discovery ── */}
      <MKSection
        title="Live APMC Mandi Rates"
        actionText="Price Trends"
        onActionPress={() => router.push('/(tabs)/produce')}
      >
        <MKCard style={styles.apmcCard}>
          <View style={styles.apmcHeader}>
            <View style={styles.apmcTitleWrap}>
              <TrendingUp size={18} color="#15803D" />
              <Text style={styles.apmcTitle}>Nashik & Pune APMC Benchmark</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.livePillDot} />
              <Text style={styles.livePillText}>Live Agmarknet</Text>
            </View>
          </View>

          <View style={styles.apmcGrid}>
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Nashik Red Onion</Text>
              <Text style={styles.apmcPrice}>₹2,450 <Text style={styles.apmcUnit}>/q</Text></Text>
              <Text style={[styles.apmcTrend, { color: '#15803D' }]}>▲ +4.2% today</Text>
            </View>
            <View style={styles.apmcDividerV} />
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Tomato Hybrid</Text>
              <Text style={styles.apmcPrice}>₹1,820 <Text style={styles.apmcUnit}>/q</Text></Text>
              <Text style={[styles.apmcTrend, { color: '#B91C1C' }]}>▼ -1.5% today</Text>
            </View>
            <View style={styles.apmcDividerV} />
            <View style={styles.apmcItem}>
              <Text style={styles.apmcCrop}>Potato Jyoti</Text>
              <Text style={styles.apmcPrice}>₹1,540 <Text style={styles.apmcUnit}>/q</Text></Text>
              <Text style={[styles.apmcTrend, { color: '#15803D' }]}>▲ +2.1% today</Text>
            </View>
          </View>
        </MKCard>
      </MKSection>

      {/* ── 5. Section: Today at a Glance ── */}
      <MKSection title="Today at a Glance">
        <View style={styles.metricsRow}>
          {/* Active Orders */}
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFF2E8' }]}>
              <FileText size={20} color="#D9531E" />
            </View>
            <Text style={styles.metricBigNumber}>2</Text>
            <Text style={styles.metricLabel}>Active Orders</Text>
          </Pressable>

          {/* Pickup Schedule */}
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [
              styles.metricCard,
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Truck size={20} color="#2E7D32" />
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
              pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.metricIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Wallet size={20} color="#2E7D32" />
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
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2DBD0',
    elevation: 4,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
    backgroundColor: '#1E5A2A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    elevation: 2,
  },
  inlineAddBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  heroBasketImage: {
    width: 105,
    height: 105,
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
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 2,
  },
  cropQty: {
    fontSize: 12,
    color: MKColors.textSecondary,
    fontWeight: '500',
  },
  badgeWrapper: {
    flexShrink: 0,
  },
  netReturnRow: {
    paddingHorizontal: MKSpacing.lg,
    paddingTop: MKSpacing.md,
    width: '100%',
  },
  netReturnLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  netReturnValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E5A2A',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FAF9F6',
    marginHorizontal: MKSpacing.lg,
    marginTop: MKSpacing.md,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E8E3D8',
  },
  breakdownCol: {
    alignItems: 'flex-start',
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
    color: MKColors.accentOrange,
    marginRight: 3,
  },
  decisionActionWrapper: {
    paddingHorizontal: MKSpacing.lg,
    paddingBottom: MKSpacing.lg,
    marginTop: 12,
    width: '100%',
  },

  /* ── Today at a Glance ── */
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#EFE7DC',
    minHeight: 125,
    elevation: 4,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minWidth: 0,
  },
  metricCardLast: {},
  metricIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricBigNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1C1E',
    marginBottom: 2,
  },
  metricBigText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1A1C1E',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '600',
  },
  /* ── APMC Mandi Rates ── */
  apmcCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#EFE7DC',
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
    fontSize: 13,
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
    height: 36,
    backgroundColor: '#F3F4F6',
  },
  apmcCrop: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  apmcPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  apmcUnit: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  apmcTrend: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 12,
  },
  langBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  langPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langPillActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  langPillTextActive: {
    color: '#FFFFFF',
  },
  voiceSearchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceSearchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  micButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  micButtonListening: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.08 }],
  },
  voiceSearchTextContainer: {
    flex: 1,
  },
  voiceSearchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  voiceSearchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  matchCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    textTransform: 'uppercase',
  },
  matchCropName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  matchActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  matchActionBtnPrimary: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  matchActionBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  matchActionBtnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  matchActionBtnTextSecondary: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});
