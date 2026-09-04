/**
 * MandiKart — Crop Details Screen ("Crop Intelligence Center")
 *
 * Detailed single crop view:
 * 1. Stock Breakdown (Available, Reserved, Sold)
 * 2. Estimated Freshness Window & Storage details
 * 3. Market Intelligence & Reference Price (AGMARKNET verified source & timestamp)
 * 4. Interactive 7D / 30D / 90D Price Trend Chart (SVG Polyline)
 * 5. Estimated Total Market Value calculation
 * 6. Paas Ki Mandi (Nearby Mandi Preview)
 * 7. Update Condition Modal
 * 8. Primary CTA: "Sell This Fasal" -> /sell/best-options
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Info,
  Edit3,
  MapPin,
  Scale,
  Warehouse,
  ChevronRight,
  ArrowRight,
  X,
  HelpCircle,
} from 'lucide-react-native';
import { MKColors } from '@/constants/colors';
import {
  useProduceStore,
  CropItem,
  CropCondition,
  PriceHistoryPoint,
} from '@/store/produceStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CropDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const crops = useProduceStore((state) => state.crops);
  const updateCropCondition = useProduceStore((state) => state.updateCropCondition);

  // Find crop
  const crop = crops.find((c) => c.id === id);

  // Chart time interval state: '7D' | '30D' | '90D'
  const [chartInterval, setChartInterval] = useState<'7D' | '30D' | '90D'>('7D');

  // Condition Update Modal
  const [conditionModalVisible, setConditionModalVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<CropCondition>(
    crop?.condition || 'Good'
  );
  const [conditionNote, setConditionNote] = useState(crop?.conditionNote || '');

  // Freshness Info Modal
  const [freshnessInfoModalVisible, setFreshnessInfoModalVisible] = useState(false);

  if (!crop) {
    return (
      <View style={[styles.notFoundContainer, { paddingTop: insets.top }]}>
        <AlertCircle size={48} color={MKColors.accentOrange} />
        <Text style={styles.notFoundTitle}>Fasal Nahi Mili</Text>
        <Text style={styles.notFoundSubtitle}>
          Ye fasal inventory mein maujood nahi hai ya hata di gayi hai.
        </Text>
        <Pressable
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(tabs)/produce')}
        >
          <Text style={styles.backHomeBtnText}>Wapas Produce Par Jayein</Text>
        </Pressable>
      </View>
    );
  }

  // Active chart points
  const activeHistory: PriceHistoryPoint[] = useMemo(() => {
    if (chartInterval === '30D') return crop.history30D || [];
    if (chartInterval === '90D') return crop.history90D || [];
    return crop.history7D || [];
  }, [crop, chartInterval]);

  // Derived stock percentages
  const availablePct = crop.totalKg > 0 ? (crop.availableKg / crop.totalKg) * 100 : 0;
  const reservedPct = crop.totalKg > 0 ? (crop.reservedKg / crop.totalKg) * 100 : 0;
  const soldPct = crop.totalKg > 0 ? (crop.soldKg / crop.totalKg) * 100 : 0;

  // Estimated Market Value
  const estimatedMarketValue = Math.round(crop.availableKg * crop.referencePricePerKg);

  const handleSaveCondition = () => {
    updateCropCondition(crop.id, selectedCondition, conditionNote);
    setConditionModalVisible(false);
    Alert.alert('Condition Updated', 'Fasal ki sthiti safaltapoorvak update ho gayi.');
  };

  const getConditionBadge = (cond: CropCondition) => {
    switch (cond) {
      case 'Good':
        return {
          label: 'Achhi Sthiti (Good)',
          color: MKColors.primaryGreen,
          bg: MKColors.primaryGreenSurface,
          icon: CheckCircle2,
        };
      case 'Needs Attention':
        return {
          label: 'Dhyan Dein (Attention)',
          color: MKColors.accentOrange,
          bg: MKColors.accentOrangeSurface,
          icon: AlertTriangle,
        };
      case 'Deteriorating':
        return {
          label: 'Kharab Ho Rahi Hai',
          color: '#DC2626',
          bg: '#FEE2E2',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Check Pending',
          color: '#6B7280',
          bg: '#F3F4F6',
          icon: HelpCircle,
        };
    }
  };

  const conditionConfig = getConditionBadge(crop.condition);
  const CondIcon = conditionConfig.icon;

  // SVG Chart Calculations
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
          style={styles.headerBackBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={MKColors.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerSubtitle}>Fasal Intelligence</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {crop.cropName}
          </Text>
        </View>
        <Pressable
          style={styles.updateConditionIconBtn}
          onPress={() => {
            setSelectedCondition(crop.condition);
            setConditionNote(crop.conditionNote || '');
            setConditionModalVisible(true);
          }}
          accessibilityLabel="Update Condition"
        >
          <Edit3 size={18} color={MKColors.primaryGreen} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Media & Vital Card ──────────────────────────────── */}
        <View style={styles.heroCard}>
          <Image source={{ uri: crop.imageUri }} style={styles.heroImage} />

          <View style={styles.heroBody}>
            <View style={styles.heroTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroCropName}>{crop.cropName}</Text>
                <Text style={styles.heroVarietyText}>
                  {crop.variety ? crop.variety : crop.category} • {crop.grade}
                </Text>
              </View>
              <Pressable
                style={[styles.conditionChip, { backgroundColor: conditionConfig.bg }]}
                onPress={() => setConditionModalVisible(true)}
              >
                <CondIcon size={13} color={conditionConfig.color} style={{ marginRight: 4 }} />
                <Text style={[styles.conditionChipText, { color: conditionConfig.color }]}>
                  {conditionConfig.label}
                </Text>
              </Pressable>
            </View>

            {crop.conditionUpdatedAt && (
              <Text style={styles.lastCheckedText}>
                Akhiri jaanch: {crop.conditionUpdatedAt}
              </Text>
            )}

            {crop.conditionNote ? (
              <View style={styles.noteCallout}>
                <Text style={styles.noteCalloutText}>
                  📝 "{crop.conditionNote}"
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── Stock Breakdown Visual ──────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Scale size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Kul Stock Vivaran</Text>
          </View>

          {/* Multi-segment progress bar */}
          <View style={styles.multiBarTrack}>
            {availablePct > 0 && (
              <View
                style={[
                  styles.multiBarSegment,
                  { width: `${availablePct}%`, backgroundColor: MKColors.primaryGreen },
                ]}
              />
            )}
            {reservedPct > 0 && (
              <View
                style={[
                  styles.multiBarSegment,
                  { width: `${reservedPct}%`, backgroundColor: MKColors.accentOrange },
                ]}
              />
            )}
            {soldPct > 0 && (
              <View
                style={[
                  styles.multiBarSegment,
                  { width: `${soldPct}%`, backgroundColor: '#9CA3AF' },
                ]}
              />
            )}
          </View>

          <View style={styles.stockBreakdownGrid}>
            <View style={styles.stockStatCol}>
              <Text style={styles.stockStatNum}>
                {crop.totalKg.toLocaleString()} kg
              </Text>
              <Text style={styles.stockStatLabel}>Kul Stock (Total)</Text>
            </View>

            <View style={styles.stockStatCol}>
              <Text style={[styles.stockStatNum, { color: MKColors.primaryGreenDark }]}>
                {crop.availableKg.toLocaleString()} kg
              </Text>
              <View style={styles.colorDotLabel}>
                <View style={[styles.smallDot, { backgroundColor: MKColors.primaryGreen }]} />
                <Text style={styles.stockStatLabel}>Uplabdh (Available)</Text>
              </View>
            </View>

            <View style={styles.stockStatCol}>
              <Text style={[styles.stockStatNum, { color: MKColors.accentOrange }]}>
                {crop.reservedKg.toLocaleString()} kg
              </Text>
              <View style={styles.colorDotLabel}>
                <View style={[styles.smallDot, { backgroundColor: MKColors.accentOrange }]} />
                <Text style={styles.stockStatLabel}>Reserved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Shelf-Life Intelligence & Freshness Window ─────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Clock
              size={18}
              color={crop.shelfLifeDaysEstMax <= 4 ? '#DC2626' : MKColors.primaryGreen}
            />
            <Text style={styles.sectionCardTitle}>Anumanit Freshness Window</Text>
            <Pressable
              onPress={() => setFreshnessInfoModalVisible(true)}
              hitSlop={8}
              style={{ marginLeft: 'auto' }}
            >
              <Info size={16} color={MKColors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.freshnessHighlightBox}>
            <Text style={styles.freshnessDaysText}>
              Approx. {crop.shelfLifeDaysEstMin} se {crop.shelfLifeDaysEstMax} din
            </Text>
            <Text style={styles.freshnessSubText}>
              Kataai: {crop.harvestDate} • Storage: {crop.storageType}
            </Text>
          </View>

          <Text style={styles.shelfLifeBasisText}>
            📌 Aadhar: {crop.shelfLifeBasis}
          </Text>

          {crop.storageDetails ? (
            <Text style={styles.storageDetailsSub}>
              Godam Vivaran: {crop.storageDetails}
            </Text>
          ) : null}
        </View>

        {/* ── Market Intelligence & Reference Price ──────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Building2 size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Mandi Market Intelligence</Text>
          </View>

          <View style={styles.marketPriceRow}>
            <View>
              <Text style={styles.marketRateLabel}>Sandarbh Mandi Bhav (Ref Price):</Text>
              <Text style={styles.marketRateValue}>
                ₹{crop.referencePricePerKg}
                <Text style={styles.perKgUnit}> / kg</Text>
              </Text>
            </View>

            <View style={styles.marketTrendBox}>
              <View
                style={[
                  styles.trendBadge,
                  crop.priceMovementTrend === 'up'
                    ? styles.trendBadgeUp
                    : styles.trendBadgeDown,
                ]}
              >
                {crop.priceMovementTrend === 'up' ? (
                  <TrendingUp size={14} color={MKColors.primaryGreen} />
                ) : (
                  <TrendingDown size={14} color="#DC2626" />
                )}
                <Text
                  style={[
                    styles.trendBadgeText,
                    crop.priceMovementTrend === 'up'
                      ? { color: MKColors.primaryGreen }
                      : { color: '#DC2626' },
                  ]}
                >
                  {crop.priceMovementPct > 0
                    ? `+${crop.priceMovementPct}% (7 din)`
                    : `${crop.priceMovementPct}% (7 din)`}
                </Text>
              </View>
              <Text style={styles.demandBadgeText}>
                Demand: {crop.marketDemand}
              </Text>
            </View>
          </View>

          <View style={styles.sourceVerifiedRow}>
            <ShieldCheck size={13} color={MKColors.primaryGreen} />
            <Text style={styles.sourceVerifiedText}>
              Srot: {crop.marketName} ({crop.marketSource}) • {crop.marketLastUpdated}
            </Text>
          </View>

          {/* Estimated Total Market Value */}
          <View style={styles.estimatedValueBox}>
            <Text style={styles.estValueLabel}>
              Uplabdh Stock Ka Anumanit Mandi Mulya:
            </Text>
            <Text style={styles.estValueNum}>
              ₹{estimatedMarketValue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.estValueDisclaimer}>
              ({crop.availableKg} kg × ₹{crop.referencePricePerKg}/kg). Asli praapti khareedar aur grading par tay hogi.
            </Text>
          </View>
        </View>

        {/* ── Interactive SVG Price Trend Chart ───────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <TrendingUp size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Mandi Bhav Trend (AGMARKNET)</Text>
          </View>

          {/* Interval Switcher */}
          <View style={styles.chartIntervalRow}>
            {(['7D', '30D', '90D'] as const).map((interval) => {
              const isSelected = chartInterval === interval;
              return (
                <Pressable
                  key={interval}
                  style={[
                    styles.intervalChip,
                    isSelected && styles.intervalChipSelected,
                  ]}
                  onPress={() => setChartInterval(interval)}
                >
                  <Text
                    style={[
                      styles.intervalChipText,
                      isSelected && styles.intervalChipTextSelected,
                    ]}
                  >
                    {interval === '7D'
                      ? 'Pichle 7 Din'
                      : interval === '30D'
                      ? '30 Din'
                      : '3 Mahine'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* SVG Sparkline Container */}
          <View style={styles.chartSvgWrap}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Horizontal Grid lines */}
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

              {/* Polyline */}
              <Polyline
                points={polylinePoints}
                fill="none"
                stroke={MKColors.primaryGreen}
                strokeWidth={3}
              />

              {/* Data points */}
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
                  {/* Price label above */}
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
                  {/* Date label below */}
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
        </View>

        {/* ── Paas Ki Mandi (Nearby Mandi Preview) ────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <MapPin size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Paas Ki Mandi (Nearby APMC)</Text>
          </View>

          <View style={styles.nearbyMandiCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nearbyMandiName}>{crop.marketName}</Text>
              <Text style={styles.nearbyMandiDist}>
                📍 Approx. {crop.marketDistanceKm} km door • 45 min drive
              </Text>
              <Text style={styles.nearbyArrivalText}>
                Aaj ka aamad: ~1,200 Quintal darj hui
              </Text>
            </View>
            <ChevronRight size={20} color={MKColors.textSecondary} />
          </View>

          <Pressable
            style={styles.compareMandiBtn}
            onPress={() =>
              router.push({
                pathname: '/sell/best-options',
                params: {
                  crop: crop.cropName,
                  qty: crop.availableKg.toString(),
                  grade: crop.grade,
                },
              })
            }
          >
            <Text style={styles.compareMandiBtnText}>Dusri Mandiyan Compare Karein</Text>
            <ArrowRight size={14} color={MKColors.primaryGreen} />
          </Pressable>
        </View>

        {/* Space before sticky footer */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Sticky Bottom Action Bar: "Sell This Fasal" ─────────── */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.primarySellButton,
            pressed && styles.pressedSellButton,
          ]}
          onPress={() =>
            router.push({
              pathname: '/sell/best-options',
              params: {
                crop: crop.cropName,
                qty: crop.availableKg.toString(),
                grade: crop.grade,
              },
            })
          }
        >
          <Text style={styles.primarySellButtonText}>
            Is Fasal Ko Sell Karein ({crop.availableKg} kg)
          </Text>
          <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>

      {/* ── Update Condition Modal ───────────────────────────────── */}
      <Modal
        visible={conditionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConditionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fasal Ki Sthiti Update Karein</Text>
              <Pressable
                onPress={() => setConditionModalVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              {crop.cropName} ki vartamaan sthiti chunein:
            </Text>

            {(['Good', 'Needs Attention', 'Deteriorating'] as CropCondition[]).map((c) => {
              const isSelected = selectedCondition === c;
              const cfg = getConditionBadge(c);
              const IconComp = cfg.icon;
              return (
                <Pressable
                  key={c}
                  style={[
                    styles.conditionSelectRow,
                    isSelected && styles.conditionSelectRowActive,
                  ]}
                  onPress={() => setSelectedCondition(c)}
                >
                  <IconComp size={18} color={cfg.color} style={{ marginRight: 10 }} />
                  <Text
                    style={[
                      styles.conditionSelectLabel,
                      isSelected && { color: cfg.color, fontWeight: '800' },
                    ]}
                  >
                    {cfg.label}
                  </Text>
                  {isSelected && (
                    <CheckCircle2
                      size={18}
                      color={MKColors.primaryGreen}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </Pressable>
              );
            })}

            <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>
              Koi dhyan dene yogya baat (Note):
            </Text>
            <TextInput
              style={styles.modalNoteInput}
              value={conditionNote}
              onChangeText={setConditionNote}
              placeholder="e.g. Sahi dhoop lagi hai / Nami thodi badh rahi hai..."
              placeholderTextColor={MKColors.textMuted}
              multiline
            />

            <Pressable
              style={styles.modalSaveBtn}
              onPress={handleSaveCondition}
            >
              <Text style={styles.modalSaveBtnText}>Sthiti Save Karein</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Freshness Information Disclaimer Modal ───────────────── */}
      <Modal
        visible={freshnessInfoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFreshnessInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Clock size={22} color={MKColors.primaryGreen} />
              <Text style={styles.modalTitle}>Freshness Window Jankari</Text>
              <Pressable
                onPress={() => setFreshnessInfoModalVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.estimateBanner}>
              <Text style={styles.estimateBannerTitle}>
                Approx. {crop.shelfLifeDaysEstMin} se {crop.shelfLifeDaysEstMax} din theek rahegi
              </Text>
              <Text style={styles.estimateBannerSub}>
                Storage: {crop.storageType} ({crop.storageDetails || 'Standard'})
              </Text>
            </View>

            <Text style={styles.disclaimerPoint}>
              • Ye koi guarantee nahi hai, balki kataai ki taarikh ({crop.harvestDate}) evam {crop.storageType} storage ki anukul sthiti par aadharit anuman hai.
            </Text>
            <Text style={styles.disclaimerPoint}>
              • Mausam ki nami, tapman ya keede lagne se ye samay kam ho sakta hai.
            </Text>
            <Text style={styles.disclaimerPoint}>
              • Har do din mein fasal ka nirikshan karein aur zaroorat padne par 'Condition Update' karein.
            </Text>

            <Pressable
              style={styles.modalSaveBtn}
              onPress={() => setFreshnessInfoModalVisible(false)}
            >
              <Text style={styles.modalSaveBtnText}>Theek Hai, Samajh Gaya</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MKColors.backgroundPrimary,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: MKColors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginTop: 12,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: MKColors.textSecondary,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 20,
  },
  backHomeBtn: {
    backgroundColor: MKColors.primaryGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  backHomeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Header ────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MKColors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  headerBackBtn: {
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
    fontSize: 19,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  updateConditionIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // ── Hero Card ─────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heroImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  heroBody: {
    padding: 14,
  },
  heroTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroCropName: {
    fontSize: 20,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  heroVarietyText: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lastCheckedText: {
    fontSize: 11,
    color: MKColors.textMuted,
    marginTop: 6,
  },
  noteCallout: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    marginTop: 8,
  },
  noteCalloutText: {
    fontSize: 12,
    color: '#92400E',
    fontStyle: 'italic',
  },

  // ── Section Card ──────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginLeft: 8,
  },

  // Stock Visual
  multiBarTrack: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 12,
  },
  multiBarSegment: {
    height: '100%',
  },
  stockBreakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 10,
  },
  stockStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  stockStatNum: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  colorDotLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  smallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  stockStatLabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
    fontWeight: '600',
  },

  // Freshness
  freshnessHighlightBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  freshnessDaysText: {
    fontSize: 17,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  freshnessSubText: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    marginTop: 3,
  },
  shelfLifeBasisText: {
    fontSize: 12,
    color: MKColors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  storageDetailsSub: {
    fontSize: 11,
    color: MKColors.textMuted,
    marginTop: 4,
  },

  // Market Rate
  marketPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  marketRateLabel: {
    fontSize: 11,
    color: MKColors.textSecondary,
  },
  marketRateValue: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  perKgUnit: {
    fontSize: 13,
    color: MKColors.textSecondary,
    fontWeight: '500',
  },
  marketTrendBox: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendBadgeUp: {
    backgroundColor: '#E8F5E9',
  },
  trendBadgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  demandBadgeText: {
    fontSize: 10,
    color: MKColors.textSecondary,
    fontWeight: '600',
    marginTop: 3,
  },
  sourceVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceVerifiedText: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginLeft: 5,
  },
  estimatedValueBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  estValueLabel: {
    fontSize: 11,
    color: '#9A3412',
    fontWeight: '600',
  },
  estValueNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9A3412',
    marginVertical: 2,
  },
  estValueDisclaimer: {
    fontSize: 10,
    color: '#C2410C',
    lineHeight: 14,
  },

  // Chart
  chartIntervalRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  intervalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  intervalChipSelected: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  intervalChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.textSecondary,
  },
  intervalChipTextSelected: {
    color: '#FFFFFF',
  },
  chartSvgWrap: {
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },

  // Nearby Mandi
  nearbyMandiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
    marginBottom: 10,
  },
  nearbyMandiName: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  nearbyMandiDist: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  nearbyArrivalText: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  compareMandiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  compareMandiBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },

  // ── Bottom Action Bar ─────────────────────────────────────────────
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: MKColors.borderLight,
    paddingHorizontal: 16,
    paddingTop: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  primarySellButton: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedSellButton: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primarySellButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── Modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginBottom: 12,
  },
  conditionSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  conditionSelectRowActive: {
    borderColor: MKColors.primaryGreen,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  conditionSelectLabel: {
    fontSize: 13,
    color: MKColors.textPrimary,
    fontWeight: '600',
  },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.textSecondary,
    marginBottom: 6,
  },
  modalNoteInput: {
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MKColors.border,
    padding: 10,
    height: 64,
    fontSize: 13,
    color: MKColors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalSaveBtn: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  estimateBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  estimateBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  estimateBannerSub: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    marginTop: 2,
  },
  disclaimerPoint: {
    fontSize: 12,
    color: MKColors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
});
