/**
 * MandiKart — Market Trends Screen
 * 
 * Price Momentum, Agricultural Demand Forecasts & Strategic Farmer Advisory
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lightbulb,
  BellRing,
  Flame,
  CheckCircle2,
} from 'lucide-react-native';
import { MKBackground } from '@/components/ui';

interface TrendCrop {
  id: string;
  name: string;
  variety: string;
  currentRateKg: number;
  pastRateKg: number;
  changePct: number;
  momentum: 'bullish' | 'bearish' | 'steady';
  demandIndex: number; // 0 to 100
  harvestAdvice: 'Sell Now' | 'Hold' | 'Favorable';
  adviceDetail: string;
  buyersActive: number;
  topBuyer: string;
  imageUri: string;
  historyBars: number[]; // relative price height 20 - 60
}

const TRENDING_CROPS: TrendCrop[] = [
  {
    id: 'tc-1',
    name: 'Red Onion (Garwa)',
    variety: 'Nashik Export Grade',
    currentRateKg: 28.5,
    pastRateKg: 24.0,
    changePct: 18.75,
    momentum: 'bullish',
    demandIndex: 92,
    harvestAdvice: 'Sell Now',
    adviceDetail: 'Festival season bulk procurement from Mumbai, Delhi & Bangalore wholesale markets is peaking.',
    buyersActive: 24,
    topBuyer: 'Reliance Fresh Procurement',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA',
    historyBars: [32, 35, 38, 44, 48, 54, 60],
  },
  {
    id: 'tc-2',
    name: 'Garlic (Lahsun)',
    variety: 'Ooty Large Hybrid',
    currentRateKg: 168.0,
    pastRateKg: 135.0,
    changePct: 24.4,
    momentum: 'bullish',
    demandIndex: 96,
    harvestAdvice: 'Favorable',
    adviceDetail: 'Export shortages in Madhya Pradesh have created a 25% price premium in Maharashtra APMC hubs.',
    buyersActive: 19,
    topBuyer: 'ITC Agri Business Hub',
    imageUri:
      'https://images.unsplash.com/photo-1615477550926-db6d36e29780?w=300&auto=format&fit=crop&q=80',
    historyBars: [28, 30, 34, 42, 49, 53, 58],
  },
  {
    id: 'tc-3',
    name: 'Baby Corn',
    variety: 'Golden Hybrid Sweet',
    currentRateKg: 54.0,
    pastRateKg: 48.0,
    changePct: 12.5,
    momentum: 'bullish',
    demandIndex: 84,
    harvestAdvice: 'Sell Now',
    adviceDetail: 'Frozen food and hospitality processors in Pune are bidding above market average for tender harvest.',
    buyersActive: 15,
    topBuyer: 'BigBasket Fulfilment Center',
    imageUri:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&auto=format&fit=crop&q=80',
    historyBars: [35, 38, 40, 42, 45, 49, 52],
  },
  {
    id: 'tc-4',
    name: 'Jyoti Potato',
    variety: 'Table Clean Washed',
    currentRateKg: 15.4,
    pastRateKg: 16.8,
    changePct: -8.3,
    momentum: 'bearish',
    demandIndex: 58,
    harvestAdvice: 'Hold',
    adviceDetail: 'Temporary harvest glut in northern belts. Cold storage holding advised for 2 weeks for price rebound.',
    buyersActive: 11,
    topBuyer: 'Safal / Mother Dairy',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ',
    historyBars: [54, 52, 49, 46, 44, 40, 36],
  },
];

const TIMEFRAMES = ['7 Days', '15 Days', '30 Days', '3 Months'];

export default function MarketTrendsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTimeframe, setActiveTimeframe] = useState('15 Days');
  const [activeTab, setActiveTab] = useState<'all' | 'rising' | 'advisory'>('all');

  const filteredCrops = useMemo(() => {
    if (activeTab === 'rising') {
      return TRENDING_CROPS.filter((c) => c.momentum === 'bullish');
    }
    if (activeTab === 'advisory') {
      return TRENDING_CROPS.filter((c) => c.harvestAdvice === 'Sell Now');
    }
    return TRENDING_CROPS;
  }, [activeTab]);

  return (
    <MKBackground disableSafeArea>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        {/* ── Header ─────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Market Trends</Text>
            <Text style={styles.headerSubtitle}>Price Momentum & Demand Forecasts</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.alertBellBtn, pressed && { opacity: 0.7 }]}
            onPress={() => Alert.alert('Price Alerts Active', 'You will receive SMS alerts when mandi prices swing by more than 5%.')}
            hitSlop={8}
          >
            <BellRing size={19} color="#168A45" />
          </Pressable>
        </View>

        {/* ── Market Sentiment Hero Card ──────────────────────── */}
        <View style={styles.heroSentimentCard}>
          <View style={styles.sentimentTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Flame size={18} color="#EA580C" />
              <Text style={styles.sentimentTitle}>Market Climate: High Demand</Text>
            </View>
            <View style={styles.sentimentScoreBadge}>
              <Text style={styles.sentimentScoreText}>88 / 100</Text>
            </View>
          </View>

          <Text style={styles.sentimentDesc}>
            Buyer bids across Nashik and Pune mandis are running +14% above seasonal averages due to increased retail chain procurement.
          </Text>

          {/* Timeframe Selector */}
          <View style={styles.timeframeRow}>
            {TIMEFRAMES.map((tf) => {
              const isSelected = activeTimeframe === tf;
              return (
                <Pressable
                  key={tf}
                  style={[styles.timeframePill, isSelected && styles.timeframePillActive]}
                  onPress={() => setActiveTimeframe(tf)}
                  hitSlop={6}
                >
                  <Text style={[styles.timeframeText, isSelected && styles.timeframeTextActive]}>
                    {tf}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Segmented Category Tabs ─────────────────────────── */}
        <View style={styles.categoryTabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
            hitSlop={6}
          >
            <BarChart3 size={14} color={activeTab === 'all' ? '#168A45' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Crops
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'rising' && styles.tabBtnActive]}
            onPress={() => setActiveTab('rising')}
            hitSlop={6}
          >
            <TrendingUp size={14} color={activeTab === 'rising' ? '#EA580C' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'rising' && styles.tabTextActive]}>
              Fastest Rising
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'advisory' && styles.tabBtnActive]}
            onPress={() => setActiveTab('advisory')}
            hitSlop={6}
          >
            <Sparkles size={14} color={activeTab === 'advisory' ? '#168A45' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'advisory' && styles.tabTextActive]}>
              Sell Advice
            </Text>
          </Pressable>
        </View>

        {/* ── Trending Crop Cards List ────────────────────────── */}
        <ScrollView
          style={styles.cropsList}
          contentContainerStyle={[styles.cropsScrollContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {filteredCrops.map((crop) => {
            const isUp = crop.changePct > 0;
            return (
              <View key={crop.id} style={styles.trendCard}>
                {/* Top Row: Thumbnail + Title + Price + Momentum */}
                <View style={styles.cardHeaderRow}>
                  <Image source={{ uri: crop.imageUri }} style={styles.cropThumb} />
                  <View style={styles.cropDetailsCol}>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropVariety}>{crop.variety}</Text>
                  </View>

                  <View style={styles.priceCol}>
                    <Text style={styles.currentPriceText}>₹{crop.currentRateKg.toFixed(1)}/kg</Text>
                    <View style={[styles.momentumPill, isUp ? styles.momentumUp : styles.momentumDown]}>
                      {isUp ? (
                        <TrendingUp size={11} color="#15803D" strokeWidth={2.4} />
                      ) : (
                        <TrendingDown size={11} color="#DC2626" strokeWidth={2.4} />
                      )}
                      <Text style={[styles.momentumText, isUp ? styles.momentumTextUp : styles.momentumTextDown]}>
                        {isUp ? `+${crop.changePct.toFixed(1)}%` : `${crop.changePct.toFixed(1)}%`}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Visual Trajectory Sparkline Bar Chart */}
                <View style={styles.sparklineBox}>
                  <View style={styles.sparklineHeader}>
                    <Text style={styles.sparklineLabel}>{activeTimeframe} Price Trajectory</Text>
                    <Text style={styles.demandScoreText}>Demand Index: {crop.demandIndex}/100</Text>
                  </View>

                  <View style={styles.barsContainer}>
                    {crop.historyBars.map((height, idx) => (
                      <View key={idx} style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${height}%` },
                            idx === crop.historyBars.length - 1 && styles.barFillCurrent,
                          ]}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                {/* MandiKart Smart Advice Box */}
                <View style={styles.adviceBox}>
                  <View style={styles.adviceTopRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Lightbulb size={14} color="#EA580C" />
                      <Text style={styles.adviceHeading}>AI Harvest Recommendation</Text>
                    </View>
                    <View
                      style={[
                        styles.adviceBadge,
                        crop.harvestAdvice === 'Sell Now' && styles.adviceBadgeSell,
                        crop.harvestAdvice === 'Hold' && styles.adviceBadgeHold,
                        crop.harvestAdvice === 'Favorable' && styles.adviceBadgeFav,
                      ]}
                    >
                      <Text
                        style={[
                          styles.adviceBadgeText,
                          crop.harvestAdvice === 'Sell Now' && { color: '#15803D' },
                          crop.harvestAdvice === 'Hold' && { color: '#B45309' },
                          crop.harvestAdvice === 'Favorable' && { color: '#7C3AED' },
                        ]}
                      >
                        {crop.harvestAdvice}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.adviceDetailText}>{crop.adviceDetail}</Text>
                </View>

                {/* Footer Strip: Verified Corporate Buyer & Action */}
                <View style={styles.cardFooterRow}>
                  <View style={styles.buyerInfoRow}>
                    <Building2 size={13} color="#168A45" />
                    <Text numberOfLines={1} style={styles.buyerInfoText}>
                      {crop.buyersActive} buyers • {crop.topBuyer}
                    </Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [styles.sellHarvestBtn, pressed && { opacity: 0.85 }]}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/sell',
                        params: { crop: crop.name },
                      })
                    }
                    hitSlop={6}
                  >
                    <Text style={styles.sellHarvestBtnText}>Sell Produce</Text>
                    <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
                  </Pressable>
                </View>
              </View>
            );
          })}

          {/* Bottom Reliability Note */}
          <View style={styles.reliabilityNote}>
            <ShieldCheck size={16} color="#168A45" style={{ marginRight: 8 }} />
            <Text style={styles.reliabilityText}>
              Trends are computed daily from over 45,000 national AGMARKNET trades and corporate MandiKart buyer contracts.
            </Text>
          </View>
        </ScrollView>
      </View>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2D9CC',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  alertBellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2D9CC',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  heroSentimentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sentimentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sentimentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sentimentScoreBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sentimentScoreText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
  sentimentDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  timeframeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeframePill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeframePillActive: {
    backgroundColor: '#168A45',
  },
  timeframeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  categoryTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EDE8DF',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#111827',
    fontWeight: '800',
  },
  cropsList: {
    flex: 1,
  },
  cropsScrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    padding: 14,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cropDetailsCol: {
    flex: 1,
    marginLeft: 10,
  },
  cropName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111827',
  },
  cropVariety: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  currentPriceText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  momentumPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  momentumUp: {
    backgroundColor: '#DCFCE7',
  },
  momentumDown: {
    backgroundColor: '#FEE2E2',
  },
  momentumText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  momentumTextUp: {
    color: '#15803D',
  },
  momentumTextDown: {
    color: '#DC2626',
  },
  sparklineBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 10,
  },
  sparklineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sparklineLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  demandScoreText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#168A45',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 6,
    paddingTop: 4,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#94A3B8',
    borderRadius: 4,
  },
  barFillCurrent: {
    backgroundColor: '#168A45',
  },
  adviceBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 10,
    marginBottom: 10,
  },
  adviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  adviceHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  adviceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adviceBadgeSell: {
    backgroundColor: '#DCFCE7',
  },
  adviceBadgeHold: {
    backgroundColor: '#FEF3C7',
  },
  adviceBadgeFav: {
    backgroundColor: '#F3E8FF',
  },
  adviceBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  adviceDetailText: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 15,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  buyerInfoText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  sellHarvestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#168A45',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    elevation: 2,
  },
  sellHarvestBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reliabilityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 4,
    marginBottom: 16,
  },
  reliabilityText: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
    flex: 1,
  },
});
