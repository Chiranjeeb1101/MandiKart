/**
 * MandiKart — Crop Details Screen ("Crop Intelligence Center")
 *
 * Detailed single crop view:
 * 1. Stock Breakdown (Available, Reserved, Sold)
 * 2. Estimated Freshness Window & Storage details
 * 3. Market Intelligence & Reference Price (AGMARKNET verified source & timestamp)
 * 4. Interactive 7D / 30D / 90D Price Trend Chart (SVG Polyline)
 * 5. Estimated Total Market Value calculation
 * 6. Nearby Mandi Preview (Distance, typical transit time, arrival volume)
 * 7. Update Condition Modal & Stock Adjustment Modal
 * 8. Primary CTA: "Sell This Crop" -> /sell/best-options
 *
 * Simple, professional English throughout.
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
  Trash2,
  PlusCircle,
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
  const updateCropQuantity = useProduceStore((state) => state.updateCropQuantity);
  const deleteCrop = useProduceStore((state) => state.deleteCrop);

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

  // Stock Adjustment Modal
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [availableStockInput, setAvailableStockInput] = useState(
    crop ? crop.availableKg.toString() : '0'
  );

  // Freshness Info Modal
  const [freshnessInfoModalVisible, setFreshnessInfoModalVisible] = useState(false);

  if (!crop) {
    return (
      <View style={[styles.notFoundContainer, { paddingTop: insets.top }]}>
        <AlertCircle size={48} color={MKColors.accentOrange} />
        <Text style={styles.notFoundTitle}>Crop Not Found</Text>
        <Text style={styles.notFoundSubtitle}>
          This crop is no longer available in your inventory.
        </Text>
        <Pressable
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(tabs)/produce')}
        >
          <Text style={styles.backHomeBtnText}>Back to My Produce</Text>
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
    Alert.alert('Condition Updated', 'Crop condition has been updated successfully.');
  };

  const handleSaveStock = () => {
    const newQty = parseFloat(availableStockInput);
    if (isNaN(newQty) || newQty < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid stock weight in kg.');
      return;
    }
    updateCropQuantity(crop.id, newQty);
    setStockModalVisible(false);
    Alert.alert('Stock Updated', `Available stock updated to ${newQty.toLocaleString()} kg.`);
  };

  const handleDeleteCrop = () => {
    Alert.alert(
      'Remove Crop',
      `Are you sure you want to remove ${crop.cropName} from your active inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            deleteCrop(crop.id);
            router.replace('/(tabs)/produce');
          },
        },
      ]
    );
  };

  const getConditionBadge = (cond: CropCondition) => {
    switch (cond) {
      case 'Good':
        return {
          label: 'Good Condition',
          color: MKColors.primaryGreen,
          bg: MKColors.primaryGreenSurface,
          icon: CheckCircle2,
        };
      case 'Needs Attention':
        return {
          label: 'Needs Attention',
          color: MKColors.accentOrange,
          bg: MKColors.accentOrangeSurface,
          icon: AlertTriangle,
        };
      case 'Deteriorating':
        return {
          label: 'Deteriorating',
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
          <Text style={styles.headerSubtitle}>Crop Intelligence</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {crop.cropName}
          </Text>
        </View>
        <Pressable
          style={styles.deleteIconBtn}
          onPress={handleDeleteCrop}
          accessibilityLabel="Remove Crop"
        >
          <Trash2 size={18} color="#DC2626" />
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
                Last inspected: {crop.conditionUpdatedAt}
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
            <Text style={styles.sectionCardTitle}>Stock Allocation</Text>
            <Pressable
              style={styles.editStockBtn}
              onPress={() => {
                setAvailableStockInput(crop.availableKg.toString());
                setStockModalVisible(true);
              }}
            >
              <Edit3 size={13} color={MKColors.primaryGreen} style={{ marginRight: 4 }} />
              <Text style={styles.editStockBtnText}>Adjust Stock</Text>
            </Pressable>
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
              <Text style={styles.stockStatLabel}>Total Stock</Text>
            </View>

            <View style={styles.stockStatCol}>
              <Text style={[styles.stockStatNum, { color: MKColors.primaryGreenDark }]}>
                {crop.availableKg.toLocaleString()} kg
              </Text>
              <View style={styles.colorDotLabel}>
                <View style={[styles.smallDot, { backgroundColor: MKColors.primaryGreen }]} />
                <Text style={styles.stockStatLabel}>Available</Text>
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
              color={crop.shelfLifeDaysEstMax <= 5 ? '#DC2626' : MKColors.primaryGreen}
            />
            <Text style={styles.sectionCardTitle}>Estimated Freshness Window</Text>
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
              Approx. {crop.shelfLifeDaysEstMin} to {crop.shelfLifeDaysEstMax} days
            </Text>
            <Text style={styles.freshnessSubText}>
              Harvested: {crop.harvestDate} • Storage: {crop.storageType}
            </Text>
          </View>

          <Text style={styles.shelfLifeBasisText}>
            📌 Basis: {crop.shelfLifeBasis}
          </Text>

          {crop.storageDetails ? (
            <Text style={styles.storageDetailsSub}>
              Facility: {crop.storageDetails}
            </Text>
          ) : null}
        </View>

        {/* ── Market Intelligence & Reference Price ──────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Building2 size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Market Intelligence</Text>
          </View>

          <View style={styles.marketPriceRow}>
            <View>
              <Text style={styles.marketRateLabel}>Reference Mandi Rate:</Text>
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
                    ? `+${crop.priceMovementPct}% (7D)`
                    : `${crop.priceMovementPct}% (7D)`}
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
              Source: {crop.marketName} ({crop.marketSource}) • {crop.marketLastUpdated}
            </Text>
          </View>

          {/* Estimated Total Market Value */}
          <View style={styles.estimatedValueBox}>
            <Text style={styles.estValueLabel}>
              Estimated Available Market Value:
            </Text>
            <Text style={styles.estValueNum}>
              ₹{estimatedMarketValue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.estValueDisclaimer}>
              Calculated as {crop.availableKg.toLocaleString()} kg × ₹{crop.referencePricePerKg}/kg. Final payout depends on buyer contract, grading, and logistics.
            </Text>
          </View>
        </View>

        {/* ── Interactive SVG Price Trend Chart ───────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <TrendingUp size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Price Trend History (AGMARKNET)</Text>
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
                      ? 'Past 7 Days'
                      : interval === '30D'
                      ? 'Past 30 Days'
                      : 'Past 3 Months'}
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

        {/* ── Nearby Mandi Preview ───────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <MapPin size={18} color={MKColors.primaryGreen} />
            <Text style={styles.sectionCardTitle}>Nearest APMC Mandi</Text>
          </View>

          <View style={styles.nearbyMandiCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nearbyMandiName}>{crop.marketName}</Text>
              <Text style={styles.nearbyMandiDist}>
                📍 Approx. {crop.marketDistanceKm} km away • 45 min transit
              </Text>
              <Text style={styles.nearbyArrivalText}>
                Today's recorded arrivals: ~1,200 Quintals
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
            <Text style={styles.compareMandiBtnText}>Compare Other Regional Markets</Text>
            <ArrowRight size={14} color={MKColors.primaryGreen} />
          </Pressable>
        </View>

        {/* Space before sticky footer */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Sticky Bottom Action Bar: "Sell This Crop" ─────────── */}
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
            Sell This Crop ({crop.availableKg.toLocaleString()} kg available)
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
              <Text style={styles.modalTitle}>Update Crop Condition</Text>
              <Pressable
                onPress={() => setConditionModalVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Select the current physical condition of your {crop.cropName}:
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
              Inspection Note (Optional):
            </Text>
            <TextInput
              style={styles.modalNoteInput}
              value={conditionNote}
              onChangeText={setConditionNote}
              placeholder="e.g. Moderate humidity observed, good natural aeration..."
              placeholderTextColor={MKColors.textMuted}
              multiline
            />

            <Pressable
              style={styles.modalSaveBtn}
              onPress={handleSaveCondition}
            >
              <Text style={styles.modalSaveBtnText}>Save Condition</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Stock Adjustment Modal ───────────────────────────────── */}
      <Modal
        visible={stockModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStockModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adjust Available Stock</Text>
              <Pressable
                onPress={() => setStockModalVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Update remaining available stock for {crop.cropName} (in kilograms):
            </Text>

            <View style={styles.stockInputRow}>
              <TextInput
                style={styles.stockNumericInput}
                keyboardType="numeric"
                value={availableStockInput}
                onChangeText={setAvailableStockInput}
                placeholder="e.g. 1000"
                placeholderTextColor={MKColors.textMuted}
              />
              <Text style={styles.stockUnitText}>KG</Text>
            </View>

            <Text style={styles.stockHelperText}>
              Note: Reserved stock ({crop.reservedKg} kg) remains allocated for active buyer bookings.
            </Text>

            <Pressable
              style={styles.modalSaveBtn}
              onPress={handleSaveStock}
            >
              <Text style={styles.modalSaveBtnText}>Save Stock</Text>
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
              <Text style={styles.modalTitle}>Freshness Window Guidelines</Text>
              <Pressable
                onPress={() => setFreshnessInfoModalVisible(false)}
                hitSlop={10}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.estimateBanner}>
              <Text style={styles.estimateBannerTitle}>
                Approx. {crop.shelfLifeDaysEstMin} to {crop.shelfLifeDaysEstMax} days remaining
              </Text>
              <Text style={styles.estimateBannerSub}>
                Storage: {crop.storageType} ({crop.storageDetails || 'Standard'})
              </Text>
            </View>

            <Text style={styles.disclaimerPoint}>
              • This estimate is calculated based on your harvest date ({crop.harvestDate}) and proper storage conditions.
            </Text>
            <Text style={styles.disclaimerPoint}>
              • Changes in environmental temperature, humidity, or ventilation can alter actual shelf-life.
            </Text>
            <Text style={styles.disclaimerPoint}>
              • Regularly inspect your crops and update their condition status to keep buyers informed.
            </Text>

            <Pressable
              style={styles.modalSaveBtn}
              onPress={() => setFreshnessInfoModalVisible(false)}
            >
              <Text style={styles.modalSaveBtnText}>Got it, Thank you</Text>
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
  deleteIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
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
  editStockBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editStockBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
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
  stockInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MKColors.border,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 8,
  },
  stockNumericInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  stockUnitText: {
    fontSize: 14,
    fontWeight: '700',
    color: MKColors.textSecondary,
  },
  stockHelperText: {
    fontSize: 11,
    color: MKColors.textMuted,
    lineHeight: 15,
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
