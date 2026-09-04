/**
 * MandiKart Farmer App — Market Prices, Trends & History (Screens 08, 09, 10)
 *
 * Dedicated Market Intelligence Center:
 * - Searchable crop market directory
 * - Low, High, Reference, and Modal prices with AGMARKNET sources
 * - 7D / 30D / 90D interactive SVG price trend sparklines
 * - "What's Trending" market movements
 * - Clear price definitions (Reference vs Low/High vs Buyer Offer)
 *
 * Simple, professional English throughout.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Building2,
  Clock,
  Info,
  ChevronRight,
  Flame,
  ArrowRight,
  X,
  SlidersHorizontal,
} from 'lucide-react-native';
import { MKColors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MarketCropData {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  lowPrice: number;
  highPrice: number;
  modalPrice: number;
  changePct: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'High' | 'Medium' | 'Low' | 'Stable';
  marketName: string;
  source: string;
  lastUpdated: string;
  history7D: { date: string; price: number }[];
  history30D: { date: string; price: number }[];
  history90D: { date: string; price: number }[];
  trendingNote: string;
}

const MARKET_DATA: MarketCropData[] = [
  {
    id: 'm_onion',
    name: 'Red Onion',
    category: 'Vegetables',
    currentPrice: 22.0,
    lowPrice: 19.0,
    highPrice: 25.0,
    modalPrice: 22.5,
    changePct: 8,
    trend: 'up',
    demand: 'High',
    marketName: 'Nashik APMC Mandi',
    source: 'AGMARKNET Official Feed',
    lastUpdated: 'Today, 10:30 AM',
    trendingNote: 'Price increased +8% over the past 3 days due to strong interstate procurement.',
    history7D: [
      { date: '29 Aug', price: 20.0 },
      { date: '31 Aug', price: 20.5 },
      { date: '02 Sep', price: 21.2 },
      { date: '04 Sep', price: 22.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 18.5 },
      { date: '15 Aug', price: 19.5 },
      { date: '25 Aug', price: 20.8 },
      { date: '04 Sep', price: 22.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 16.0 },
      { date: '05 Jul', price: 17.5 },
      { date: '05 Aug', price: 18.5 },
      { date: '04 Sep', price: 22.0 },
    ],
  },
  {
    id: 'm_tomato',
    name: 'Hybrid Tomato',
    category: 'Vegetables',
    currentPrice: 18.0,
    lowPrice: 15.0,
    highPrice: 22.0,
    modalPrice: 18.0,
    changePct: -5,
    trend: 'down',
    demand: 'Medium',
    marketName: 'Pimpalgaon Mandi',
    source: 'AGMARKNET Official Feed',
    lastUpdated: 'Today, 10:30 AM',
    trendingNote: 'Daily arrivals increased by 15%, causing a slight softening in spot rates.',
    history7D: [
      { date: '29 Aug', price: 19.5 },
      { date: '31 Aug', price: 19.0 },
      { date: '02 Sep', price: 18.5 },
      { date: '04 Sep', price: 18.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 21.0 },
      { date: '15 Aug', price: 20.0 },
      { date: '25 Aug', price: 19.2 },
      { date: '04 Sep', price: 18.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 24.0 },
      { date: '05 Jul', price: 22.5 },
      { date: '05 Aug', price: 21.0 },
      { date: '04 Sep', price: 18.0 },
    ],
  },
  {
    id: 'm_potato',
    name: 'Jyoti Potato',
    category: 'Vegetables',
    currentPrice: 20.0,
    lowPrice: 18.0,
    highPrice: 22.0,
    modalPrice: 20.0,
    changePct: 0,
    trend: 'stable',
    demand: 'High',
    marketName: 'Lasalgaon Mandi Hub',
    source: 'AGMARKNET Official Feed',
    lastUpdated: 'Today, 10:30 AM',
    trendingNote: 'Steady cold-storage release balancing market demand.',
    history7D: [
      { date: '29 Aug', price: 20.0 },
      { date: '31 Aug', price: 20.0 },
      { date: '02 Sep', price: 20.0 },
      { date: '04 Sep', price: 20.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 19.5 },
      { date: '15 Aug', price: 19.8 },
      { date: '25 Aug', price: 20.0 },
      { date: '04 Sep', price: 20.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 18.0 },
      { date: '05 Jul', price: 19.0 },
      { date: '05 Aug', price: 19.5 },
      { date: '04 Sep', price: 20.0 },
    ],
  },
  {
    id: 'm_wheat',
    name: 'Lokwan Wheat',
    category: 'Grains',
    currentPrice: 28.5,
    lowPrice: 27.0,
    highPrice: 30.5,
    modalPrice: 28.5,
    changePct: 1,
    trend: 'stable',
    demand: 'High',
    marketName: 'Nashik Central APMC',
    source: 'e-NAM National Portal',
    lastUpdated: 'Today, 10:30 AM',
    trendingNote: 'Consistent demand from flour mills maintaining stable firm rates.',
    history7D: [
      { date: '29 Aug', price: 28.0 },
      { date: '31 Aug', price: 28.2 },
      { date: '02 Sep', price: 28.5 },
      { date: '04 Sep', price: 28.5 },
    ],
    history30D: [
      { date: '05 Aug', price: 27.5 },
      { date: '15 Aug', price: 28.0 },
      { date: '25 Aug', price: 28.2 },
      { date: '04 Sep', price: 28.5 },
    ],
    history90D: [
      { date: '05 Jun', price: 26.5 },
      { date: '05 Jul', price: 27.0 },
      { date: '05 Aug', price: 27.5 },
      { date: '04 Sep', price: 28.5 },
    ],
  },
  {
    id: 'm_soybean',
    name: 'Yellow Soybean',
    category: 'Oilseeds',
    currentPrice: 46.0,
    lowPrice: 43.5,
    highPrice: 48.0,
    modalPrice: 46.0,
    changePct: 3,
    trend: 'up',
    demand: 'High',
    marketName: 'Latur APMC Yard',
    source: 'AGMARKNET Official Feed',
    lastUpdated: 'Today, 09:15 AM',
    trendingNote: 'Crushers actively sourcing dry quality stock.',
    history7D: [
      { date: '29 Aug', price: 44.5 },
      { date: '31 Aug', price: 45.0 },
      { date: '02 Sep', price: 45.5 },
      { date: '04 Sep', price: 46.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 43.0 },
      { date: '15 Aug', price: 44.0 },
      { date: '25 Aug', price: 45.0 },
      { date: '04 Sep', price: 46.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 41.0 },
      { date: '05 Jul', price: 42.0 },
      { date: '05 Aug', price: 43.0 },
      { date: '04 Sep', price: 46.0 },
    ],
  },
];

export default function MarketPricesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MarketCropData>(MARKET_DATA[0]);
  const [chartInterval, setChartInterval] = useState<'7D' | '30D' | '90D'>('7D');

  const filteredCrops = useMemo(() => {
    return MARKET_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.marketName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Chart calculations
  const activeHistory = useMemo(() => {
    if (chartInterval === '30D') return selectedCrop.history30D;
    if (chartInterval === '90D') return selectedCrop.history90D;
    return selectedCrop.history7D;
  }, [selectedCrop, chartInterval]);

  const chartWidth = Math.min(SCREEN_WIDTH - 56, 340);
  const chartHeight = 130;
  const paddingX = 24;
  const paddingY = 24;

  const prices = activeHistory.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.95 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.05 : 100;
  const priceRange = maxPrice - minPrice || 1;

  const chartPoints = activeHistory.map((point, index) => {
    const x =
      paddingX +
      (index / (activeHistory.length - 1 || 1)) * (chartWidth - 2 * paddingX);
    const y =
      chartHeight -
      paddingY -
      ((point.price - minPrice) / priceRange) * (chartHeight - 2 * paddingY);
    return { x, y, ...point };
  });

  const polylinePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Header ────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={MKColors.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerSubtitle}>Mandi Intelligence</Text>
          <Text style={styles.headerTitle}>Market Prices & Trends</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Search Bar ────────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Search size={18} color={MKColors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crop or mandi (e.g. Onion, Nashik)..."
            placeholderTextColor={MKColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
              <X size={16} color={MKColors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* ── Spotlight Chart Card for Selected Crop ────────────────── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.chartCropTitle}>{selectedCrop.name}</Text>
              <Text style={styles.chartMandiSub}>
                {selectedCrop.marketName} ({selectedCrop.source})
              </Text>
            </View>
            <View style={styles.chartRateBox}>
              <Text style={styles.chartRateNum}>₹{selectedCrop.currentPrice.toFixed(2)}</Text>
              <Text style={styles.chartPerKg}>/kg</Text>
            </View>
          </View>

          {/* Low, High, Modal strip */}
          <View style={styles.spreadStrip}>
            <View style={styles.spreadCol}>
              <Text style={styles.spreadLabel}>Observed Low</Text>
              <Text style={styles.spreadVal}>₹{selectedCrop.lowPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.spreadDivider} />
            <View style={styles.spreadCol}>
              <Text style={styles.spreadLabel}>Modal / Avg</Text>
              <Text style={[styles.spreadVal, { color: MKColors.primaryGreenDark }]}>
                ₹{selectedCrop.modalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.spreadDivider} />
            <View style={styles.spreadCol}>
              <Text style={styles.spreadLabel}>Observed High</Text>
              <Text style={styles.spreadVal}>₹{selectedCrop.highPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Interval Switcher */}
          <View style={styles.chartIntervalRow}>
            {(['7D', '30D', '90D'] as const).map((int) => {
              const isSelected = chartInterval === int;
              return (
                <Pressable
                  key={int}
                  style={[styles.intervalChip, isSelected && styles.intervalChipActive]}
                  onPress={() => setChartInterval(int)}
                >
                  <Text style={[styles.intervalText, isSelected && styles.intervalTextActive]}>
                    {int === '7D' ? 'Past 7 Days' : int === '30D' ? 'Past 30 Days' : 'Past 3 Months'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* SVG Sparkline */}
          <View style={styles.svgContainer}>
            <Svg width={chartWidth} height={chartHeight}>
              <Line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />

              <Polyline
                points={polylinePoints}
                fill="none"
                stroke={MKColors.primaryGreen}
                strokeWidth={3}
              />

              {chartPoints.map((pt, i) => (
                <React.Fragment key={i}>
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={5}
                    fill="#FFFFFF"
                    stroke={MKColors.primaryGreen}
                    strokeWidth={2.5}
                  />
                  <SvgText
                    x={pt.x}
                    y={pt.y - 8}
                    fill={MKColors.primaryGreenDark}
                    fontSize={10}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {`₹${pt.price}`}
                  </SvgText>
                  <SvgText
                    x={pt.x}
                    y={chartHeight - 4}
                    fill={MKColors.textSecondary}
                    fontSize={9}
                    textAnchor="middle"
                  >
                    {pt.date}
                  </SvgText>
                </React.Fragment>
              ))}
            </Svg>
          </View>

          {/* Trend observation text */}
          <Text style={styles.trendNoteText}>
            📌 <Text style={{ fontWeight: '700' }}>Trend Observation:</Text> {selectedCrop.trendingNote}
          </Text>
        </View>

        {/* ── What's Trending Section (Screen 11) ───────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>What's Trending</Text>
        </View>

        <View style={styles.trendingGrid}>
          {MARKET_DATA.slice(0, 3).map((item) => (
            <Pressable
              key={`trend_${item.id}`}
              style={[
                styles.trendingCard,
                selectedCrop.id === item.id && styles.trendingCardSelected,
              ]}
              onPress={() => setSelectedCrop(item)}
            >
              <View style={styles.trendingTop}>
                <Text style={styles.trendingCropName}>{item.name}</Text>
                {item.trend === 'up' ? (
                  <View style={[styles.miniTrendChip, { backgroundColor: '#E8F5E9' }]}>
                    <TrendingUp size={11} color={MKColors.primaryGreen} />
                    <Text style={[styles.miniTrendText, { color: MKColors.primaryGreen }]}>
                      +{item.changePct}%
                    </Text>
                  </View>
                ) : item.trend === 'down' ? (
                  <View style={[styles.miniTrendChip, { backgroundColor: '#FEE2E2' }]}>
                    <TrendingDown size={11} color="#DC2626" />
                    <Text style={[styles.miniTrendText, { color: '#DC2626' }]}>
                      {item.changePct}%
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.miniTrendChip, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.miniTrendText, { color: '#6B7280' }]}>Stable</Text>
                  </View>
                )}
              </View>
              <Text style={styles.trendingPrice}>₹{item.currentPrice.toFixed(2)}/kg</Text>
              <Text style={styles.trendingDemand}>Demand: {item.demand}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── Market Directory List ─────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Regional Mandi Directory ({filteredCrops.length})</Text>
        </View>

        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop.id === crop.id;
          return (
            <Pressable
              key={crop.id}
              style={[styles.directoryCard, isSelected && styles.directoryCardSelected]}
              onPress={() => setSelectedCrop(crop)}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.dirCropName}>{crop.name}</Text>
                  <Text style={styles.dirCategory}>({crop.category})</Text>
                </View>
                <Text style={styles.dirMandiText}>
                  {crop.marketName} • {crop.source}
                </Text>
                <Text style={styles.dirSpreadText}>
                  Spread: ₹{crop.lowPrice} – ₹{crop.highPrice} (Modal: ₹{crop.modalPrice})
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.dirPriceText}>₹{crop.currentPrice.toFixed(2)}/kg</Text>
                <Text style={styles.dirTimeText}>{crop.lastUpdated}</Text>
                <Pressable
                  style={styles.dirSellBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/sell/best-options',
                      params: { crop: crop.name, qty: '1000', grade: 'Grade A' },
                    })
                  }
                >
                  <Text style={styles.dirSellBtnText}>Find Buyers</Text>
                  <ArrowRight size={12} color={MKColors.primaryGreen} />
                </Pressable>
              </View>
            </Pressable>
          );
        })}

        {/* ── Price Definitions Clarification Box ──────────────────── */}
        <View style={styles.definitionsBox}>
          <Text style={styles.definitionsTitle}>Market Price Definitions:</Text>
          <Text style={styles.definitionsText}>
            • <Text style={{ fontWeight: '700' }}>Reference Price:</Text> Verified modal rate reported by the government AGMARKNET portal for standard commercial quality.
          </Text>
          <Text style={styles.definitionsText}>
            • <Text style={{ fontWeight: '700' }}>Low / High Price:</Text> Observed trading range recorded during the most recent mandi auction session.
          </Text>
          <Text style={styles.definitionsText}>
            • <Text style={{ fontWeight: '700' }}>Buyer Offer:</Text> Direct procurement quote offered by verified institutional or retail buyers, which may be higher than mandi modal price for sorted Grade A produce.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MKColors.backgroundPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MKColors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MKColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: MKColors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: MKColors.textPrimary,
    height: '100%',
  },

  // Chart Card
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 2,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  chartCropTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  chartMandiSub: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  chartRateBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  chartRateNum: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  chartPerKg: {
    fontSize: 12,
    color: MKColors.textSecondary,
  },

  // Spread
  spreadStrip: {
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  spreadCol: {
    flex: 1,
    alignItems: 'center',
  },
  spreadDivider: {
    width: 1,
    backgroundColor: MKColors.borderLight,
  },
  spreadLabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
  },
  spreadVal: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginTop: 2,
  },

  // Interval Switcher
  chartIntervalRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  intervalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  intervalChipActive: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  intervalText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.textSecondary,
  },
  intervalTextActive: {
    color: '#FFFFFF',
  },
  svgContainer: {
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
    marginBottom: 10,
  },
  trendNoteText: {
    fontSize: 11,
    color: MKColors.textSecondary,
    lineHeight: 16,
  },

  // Trending
  sectionHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  trendingGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  trendingCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: MKColors.border,
  },
  trendingCardSelected: {
    borderColor: MKColors.primaryGreen,
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  trendingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendingCropName: {
    fontSize: 12,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  miniTrendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  miniTrendText: {
    fontSize: 9,
    fontWeight: '700',
  },
  trendingPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  trendingDemand: {
    fontSize: 9,
    color: MKColors.textSecondary,
    marginTop: 2,
  },

  // Directory
  directoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MKColors.border,
  },
  directoryCardSelected: {
    borderColor: MKColors.primaryGreen,
    backgroundColor: '#FAFAF8',
  },
  dirCropName: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  dirCategory: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginLeft: 4,
  },
  dirMandiText: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  dirSpreadText: {
    fontSize: 10,
    color: MKColors.textMuted,
    marginTop: 2,
  },
  dirPriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  dirTimeText: {
    fontSize: 9,
    color: MKColors.textMuted,
    marginTop: 1,
  },
  dirSellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  dirSellBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },

  // Definitions
  definitionsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  definitionsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 6,
  },
  definitionsText: {
    fontSize: 11,
    color: MKColors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
});
