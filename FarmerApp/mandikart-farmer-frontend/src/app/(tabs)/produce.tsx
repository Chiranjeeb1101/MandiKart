/**
 * MandiKart — Produce Screen ("My Crop Intelligence Center")
 *
 * Core Farmer Mental Model:
 * "MERE PAAS KYA HAI? -> KITNA HAI? -> CONDITION KYA HAI? -> KITNE DIN THEEK RAHEGA? -> MARKET KYA HAI? -> SELL KARNA HAI TO SELL PAR JAO"
 *
 * Designed with UI UX Pro Max standards:
 * - Clean semantic typography, warm MK palette
 * - 48px+ touch targets
 * - Verified AGMARKNET / e-NAM data citation (no fake live claims)
 * - Freshness estimation with clear disclaimers
 * - Direct routing to /produce/add, /produce/[id], and /sell/best-options
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Plus,
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Building2,
  Info,
  X,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  PackageCheck,
  Scale,
  Warehouse,
  Bell,
  HelpCircle,
} from 'lucide-react-native';
import { MKColors } from '@/constants/colors';
import { useProduceStore, CropItem, CropCondition } from '@/store/produceStore';

export default function ProduceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const crops = useProduceStore((state) => state.crops);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'attention' | 'available' | 'high_demand'>('all');
  const [freshnessInfoModalVisible, setFreshnessInfoModalVisible] = useState(false);
  const [selectedCropForInfo, setSelectedCropForInfo] = useState<CropItem | null>(null);

  // Derived Metrics for Summary Strip
  const totalCropsCount = crops.length;
  const totalAvailableKg = crops.reduce((sum, c) => sum + c.availableKg, 0);
  const totalReservedKg = crops.reduce((sum, c) => sum + c.reservedKg, 0);
  const attentionCropsCount = crops.filter(
    (c) => c.condition !== 'Good' || c.shelfLifeDaysEstMax <= 4
  ).length;

  // Filtered crops
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (crop.variety && crop.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
        crop.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'attention') {
        return crop.condition !== 'Good' || crop.shelfLifeDaysEstMax <= 4;
      }
      if (selectedFilter === 'available') {
        return crop.availableKg > 0;
      }
      if (selectedFilter === 'high_demand') {
        return crop.marketDemand === 'High';
      }
      return true;
    });
  }, [crops, searchQuery, selectedFilter]);

  // Urgent attention crops
  const urgentCrops = useMemo(() => {
    return crops.filter((c) => c.condition !== 'Good' || c.shelfLifeDaysEstMax <= 4);
  }, [crops]);

  const formatQuantity = (kg: number) => {
    if (kg >= 1000) {
      const quintals = kg / 100;
      return `${quintals % 1 === 0 ? quintals : quintals.toFixed(1)} Qtl (${kg} kg)`;
    }
    return `${kg} kg`;
  };

  const getConditionConfig = (condition: CropCondition) => {
    switch (condition) {
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Header ────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerSubtitle}>MandiKart Fasal Prabandhan</Text>
          <Text style={styles.headerTitle}>Merī Fasal (Produce)</Text>
        </View>
        <Pressable
          style={styles.headerIconButton}
          onPress={() => router.push('/more/notifications')}
          accessibilityLabel="Notifications"
        >
          <Bell size={20} color={MKColors.textPrimary} />
          {attentionCropsCount > 0 && <View style={styles.notificationDot} />}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.screenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Summary Strip: 4 Key Metrics ────────────────────────── */}
        <View style={styles.summaryStrip}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <PackageCheck size={18} color={MKColors.primaryGreen} />
            </View>
            <Text style={styles.metricValue}>{totalCropsCount}</Text>
            <Text style={styles.metricLabel}>Kul Faslein</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Scale size={18} color={MKColors.accentOrange} />
            </View>
            <Text style={styles.metricValue}>{(totalAvailableKg / 100).toFixed(0)} Qtl</Text>
            <Text style={styles.metricLabel}>Uplabdh Stock</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: '#F0F9FF' }]}>
              <Warehouse size={18} color="#0284C7" />
            </View>
            <Text style={styles.metricValue}>{(totalReservedKg / 100).toFixed(0)} Qtl</Text>
            <Text style={styles.metricLabel}>Reserved</Text>
          </View>

          <View style={[styles.metricCard, attentionCropsCount > 0 && styles.metricCardAlert]}>
            <View
              style={[
                styles.metricIconWrap,
                { backgroundColor: attentionCropsCount > 0 ? '#FEE2E2' : '#F3F4F6' },
              ]}
            >
              <AlertTriangle
                size={18}
                color={attentionCropsCount > 0 ? '#DC2626' : '#6B7280'}
              />
            </View>
            <Text
              style={[
                styles.metricValue,
                attentionCropsCount > 0 && { color: '#DC2626' },
              ]}
            >
              {attentionCropsCount}
            </Text>
            <Text style={styles.metricLabel}>Dhyan Chahiye</Text>
          </View>
        </View>

        {/* ── Primary CTA: "+ Add Fasal" ─────────────────────────── */}
        <Pressable
          style={({ pressed }) => [styles.addProduceCta, pressed && styles.pressedCard]}
          onPress={() => router.push('/produce/add')}
        >
          <View style={styles.addCtaContent}>
            <View style={styles.addCtaPlusCircle}>
              <Plus size={24} color="#FFFFFF" strokeWidth={2.8} />
            </View>
            <View style={styles.addCtaTextGroup}>
              <View style={styles.addCtaBadgeRow}>
                <Text style={styles.addCtaTitle}>+ Nayi Fasal Add Karein</Text>
                <View style={styles.quickAddBadge}>
                  <Sparkles size={11} color="#FFFFFF" />
                  <Text style={styles.quickAddBadgeText}>Aasan Form</Text>
                </View>
              </View>
              <Text style={styles.addCtaSubtitle}>
                Apni fasal ki quantity aur photo jod kar sahi daam aur khareedar paayein
              </Text>
            </View>
            <ChevronRight size={22} color={MKColors.primaryGreen} />
          </View>
        </Pressable>

        {/* ── Search & Filter Chips ──────────────────────────────── */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color={MKColors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Fasal ya variety khojein (e.g. Onion, Wheat)..."
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipRow}
          >
            <Pressable
              style={[
                styles.filterChip,
                selectedFilter === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'all' && styles.filterChipTextActive,
                ]}
              >
                Sabhi ({crops.length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                selectedFilter === 'attention' && styles.filterChipActiveAlert,
              ]}
              onPress={() => setSelectedFilter('attention')}
            >
              <AlertTriangle
                size={13}
                color={selectedFilter === 'attention' ? '#DC2626' : MKColors.accentOrange}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'attention' && styles.filterChipTextActiveAlert,
                ]}
              >
                Dhyan Chahiye ({attentionCropsCount})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                selectedFilter === 'available' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('available')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'available' && styles.filterChipTextActive,
                ]}
              >
                Available Stock
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterChip,
                selectedFilter === 'high_demand' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('high_demand')}
            >
              <TrendingUp
                size={13}
                color={selectedFilter === 'high_demand' ? '#FFFFFF' : MKColors.primaryGreen}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'high_demand' && styles.filterChipTextActive,
                ]}
              >
                High Demand
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ── Section Level 1: "Merī Faslein" (My Crops) ──────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Merī Faslein (My Inventory)</Text>
          <Text style={styles.sectionCountText}>{filteredCrops.length} fasal</Text>
        </View>

        {filteredCrops.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              <PackageCheck size={40} color={MKColors.textSecondary} />
            </View>
            <Text style={styles.emptyStateTitle}>Koi fasal nahi mili</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? `"${searchQuery}" se judi koi fasal uplabdh nahi hai.`
                : 'Aapne abhi tak koi fasal darj nahi ki hai. Nayi fasal jodein!'}
            </Text>
            <Pressable
              style={styles.emptyStateButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                router.push('/produce/add');
              }}
            >
              <Plus size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyStateButtonText}>Nayi Fasal Jodein</Text>
            </Pressable>
          </View>
        ) : (
          filteredCrops.map((crop) => {
            const cond = getConditionConfig(crop.condition);
            const CondIcon = cond.icon;
            const stockPct =
              crop.totalKg > 0 ? Math.min(100, Math.round((crop.availableKg / crop.totalKg) * 100)) : 0;

            return (
              <View key={crop.id} style={styles.cropCard}>
                {/* Crop Top Info */}
                <View style={styles.cropCardTopRow}>
                  <Image source={{ uri: crop.imageUri }} style={styles.cropThumbnail} />
                  <View style={styles.cropMetaInfo}>
                    <View style={styles.cropTitleBadgeRow}>
                      <Text style={styles.cropCardTitle} numberOfLines={1}>
                        {crop.cropName}
                      </Text>
                      <View style={styles.gradeBadge}>
                        <Text style={styles.gradeBadgeText}>{crop.grade}</Text>
                      </View>
                    </View>
                    <Text style={styles.cropVarietyText}>
                      {crop.variety ? crop.variety : crop.category} • {crop.storageType}
                    </Text>

                    {/* Condition Chip */}
                    <View style={[styles.conditionChip, { backgroundColor: cond.bg }]}>
                      <CondIcon size={12} color={cond.color} style={{ marginRight: 4 }} />
                      <Text style={[styles.conditionChipText, { color: cond.color }]}>
                        {cond.label}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Stock Level Bar */}
                <View style={styles.stockProgressContainer}>
                  <View style={styles.stockLabelRow}>
                    <Text style={styles.stockStatusLabel}>
                      Available: <Text style={styles.stockHighlight}>{formatQuantity(crop.availableKg)}</Text>
                    </Text>
                    <Text style={styles.stockTotalLabel}>Kul: {formatQuantity(crop.totalKg)}</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${stockPct}%`,
                          backgroundColor:
                            crop.condition === 'Good' ? MKColors.primaryGreen : MKColors.accentOrange,
                        },
                      ]}
                    />
                  </View>
                  {crop.reservedKg > 0 && (
                    <Text style={styles.reservedSubtext}>
                      🔒 {crop.reservedKg} kg khareedar ke liye reserved hai
                    </Text>
                  )}
                </View>

                {/* Intelligence Insights Strip */}
                <View style={styles.cropIntelligenceStrip}>
                  {/* Freshness Window */}
                  <Pressable
                    style={styles.intelligencePill}
                    onPress={() => {
                      setSelectedCropForInfo(crop);
                      setFreshnessInfoModalVisible(true);
                    }}
                  >
                    <Clock
                      size={14}
                      color={crop.shelfLifeDaysEstMax <= 4 ? '#DC2626' : MKColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.intelligenceText,
                        crop.shelfLifeDaysEstMax <= 4 && { color: '#DC2626', fontWeight: '700' },
                      ]}
                    >
                      Approx. {crop.shelfLifeDaysEstMin}–{crop.shelfLifeDaysEstMax} din
                    </Text>
                    <Info size={12} color={MKColors.textMuted} style={{ marginLeft: 2 }} />
                  </Pressable>

                  {/* Mandi Reference Price & Movement */}
                  <View style={styles.intelligencePill}>
                    <Building2 size={13} color={MKColors.textSecondary} />
                    <Text style={styles.intelligenceText}>
                      ₹{crop.referencePricePerKg}/kg
                    </Text>
                    {crop.priceMovementPct !== 0 && (
                      <View
                        style={[
                          styles.trendBadge,
                          crop.priceMovementTrend === 'up'
                            ? styles.trendBadgeUp
                            : styles.trendBadgeDown,
                        ]}
                      >
                        {crop.priceMovementTrend === 'up' ? (
                          <TrendingUp size={11} color={MKColors.primaryGreen} />
                        ) : (
                          <TrendingDown size={11} color="#DC2626" />
                        )}
                        <Text
                          style={[
                            styles.trendBadgeText,
                            crop.priceMovementTrend === 'up'
                              ? { color: MKColors.primaryGreen }
                              : { color: '#DC2626' },
                          ]}
                        >
                          {crop.priceMovementPct > 0 ? `+${crop.priceMovementPct}%` : `${crop.priceMovementPct}%`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Source Verification Badge */}
                <View style={styles.sourceVerifiedRow}>
                  <ShieldCheck size={12} color={MKColors.primaryGreen} />
                  <Text style={styles.sourceVerifiedText}>
                    Mandi Bhav: {crop.marketName} ({crop.marketSource}) • {crop.marketLastUpdated}
                  </Text>
                </View>

                {/* Card Action Buttons */}
                <View style={styles.cropCardActionRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.detailsButton,
                      pressed && styles.pressedButton,
                    ]}
                    onPress={() => router.push(`/produce/${crop.id}` as any)}
                  >
                    <Text style={styles.detailsButtonText}>Details Dekhein</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.sellCropButton,
                      pressed && styles.pressedButton,
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
                    <Text style={styles.sellCropButtonText}>Sell Karein</Text>
                    <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* ── Section Level 2: "Abhi Kya Dhyan Dein" (Action Alerts) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Abhi Kya Dhyan Dein (Action Alerts)</Text>
        </View>

        {urgentCrops.length > 0 ? (
          urgentCrops.map((crop) => (
            <View key={`alert_${crop.id}`} style={styles.alertCard}>
              <View style={styles.alertCardHeader}>
                <AlertTriangle size={18} color={MKColors.accentOrange} />
                <Text style={styles.alertCardTitle}>
                  {crop.cropName}: {crop.attentionMessage || 'Nirakshan ki aavashyakta'}
                </Text>
              </View>
              <Text style={styles.alertCardDesc}>
                Storage sthiti: {crop.storageDetails || crop.storageType}. Anumanit samay {crop.shelfLifeDaysEstMin}–{crop.shelfLifeDaysEstMax} din bacha hai.
              </Text>
              <View style={styles.alertActionRow}>
                <Pressable
                  style={styles.alertActionButton}
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
                  <Text style={styles.alertActionText}>Abhi Sell Karein</Text>
                  <ArrowRight size={14} color={MKColors.primaryGreen} />
                </Pressable>
                <Pressable
                  style={styles.alertSecondaryButton}
                  onPress={() => router.push(`/produce/${crop.id}` as any)}
                >
                  <Text style={styles.alertSecondaryText}>Sthiti Update Karein</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.allSafeBanner}>
            <CheckCircle2 size={20} color={MKColors.primaryGreen} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.allSafeTitle}>Sabhi fasal surakshit hain!</Text>
              <Text style={styles.allSafeSubtitle}>
                Aapki sabhi faslein sahi condition aur regular monitoring mein hain.
              </Text>
            </View>
          </View>
        )}

        {/* ── Section Level 2: "Aapki Fasal Par Nazar" (My Crop Watch) ─ */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Aapki Fasal Par Nazar (Crop Watch)</Text>
        </View>

        <View style={styles.watchContainer}>
          {crops.map((crop) => (
            <View key={`watch_${crop.id}`} style={styles.watchRow}>
              <View style={styles.watchCropBadge}>
                <Text style={styles.watchCropName}>{crop.cropName}</Text>
              </View>
              <View style={styles.watchContent}>
                <Text style={styles.watchTagText}>{crop.watchTag}</Text>
                <Text style={styles.watchSourceText}>
                  {crop.marketName} • {crop.marketSource}
                </Text>
              </View>
              <ChevronRight size={16} color={MKColors.textSecondary} />
            </View>
          ))}
        </View>

        {/* ── Section Level 2: Market Pulse Disclaimer ─────────────── */}
        <View style={styles.disclaimerContainer}>
          <Info size={15} color={MKColors.textSecondary} style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.disclaimerText}>
            Mandi dar evam shelf-life ke aakde AGMARKNET evan Krishi vigyan kendra ke standard adhar par anumanit hain. Asli bikri mulya fasal ki gunvatta, grading aur khareedar ke sath tay hota hai.
          </Text>
        </View>

        {/* Bottom spacing for smooth tab navigation */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Freshness Information Disclaimer Modal ─────────────────── */}
      <Modal
        visible={freshnessInfoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFreshnessInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Clock size={22} color={MKColors.primaryGreen} />
              <Text style={styles.modalTitle}>Freshness Window (Shelf-Life)</Text>
              <Pressable
                onPress={() => setFreshnessInfoModalVisible(false)}
                hitSlop={12}
              >
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalCropTitle}>
              {selectedCropForInfo?.cropName} ({selectedCropForInfo?.variety})
            </Text>

            <View style={styles.modalEstimatePill}>
              <Text style={styles.modalEstimateValue}>
                Approx. {selectedCropForInfo?.shelfLifeDaysEstMin} se {selectedCropForInfo?.shelfLifeDaysEstMax} din
              </Text>
              <Text style={styles.modalEstimateSubtitle}>
                (Sahi storage condition mein surakshit)
              </Text>
            </View>

            <Text style={styles.modalSectionHeading}>Kyon jaruri hai ye janna?</Text>
            <Text style={styles.modalBodyText}>
              • Ye koi guarantee nahi hai, balki aapki harvest date aur storage prakar ({selectedCropForInfo?.storageType}) ke aadhar par anumanit avadhi hai.
            </Text>
            <Text style={styles.modalBodyText}>
              • Storage basis: {selectedCropForInfo?.shelfLifeBasis || 'Dry standard storage'}.
            </Text>
            <Text style={styles.modalBodyText}>
              • Agar fasal ka rang ya nami badal rahi ho, to kripya Crop Details screen par jaakar 'Condition Update' karein.
            </Text>

            <Pressable
              style={styles.modalDismissBtn}
              onPress={() => setFreshnessInfoModalVisible(false)}
            >
              <Text style={styles.modalDismissBtnText}>Samajh Gaya</Text>
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
  scrollContainer: {
    flex: 1,
  },
  screenScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    width: '100%',
  },

  // ── Header ────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MKColors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: MKColors.primaryGreen,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginTop: 1,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MKColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },

  // ── Summary Strip ─────────────────────────────────────────────────
  summaryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: MKColors.border,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  metricCardAlert: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: MKColors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },

  // ── Add Produce CTA ───────────────────────────────────────────────
  addProduceCta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: MKColors.primaryGreen,
    elevation: 2,
    shadowColor: MKColors.primaryGreen,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  addCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCtaPlusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MKColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCtaTextGroup: {
    flex: 1,
  },
  addCtaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  addCtaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
    marginRight: 8,
  },
  quickAddBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.accentOrange,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  quickAddBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addCtaSubtitle: {
    fontSize: 12,
    color: MKColors.textSecondary,
    lineHeight: 16,
  },

  // ── Search & Filter ───────────────────────────────────────────────
  searchSection: {
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: MKColors.border,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: MKColors.textPrimary,
    height: '100%',
  },
  filterChipRow: {
    flexDirection: 'row',
    paddingVertical: 2,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MKColors.border,
  },
  filterChipActive: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  filterChipActiveAlert: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: MKColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterChipTextActiveAlert: {
    color: '#DC2626',
    fontWeight: '700',
  },

  // ── Section Titles ────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  sectionCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: MKColors.textSecondary,
  },

  // ── Crop Card ─────────────────────────────────────────────────────
  cropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cropCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  cropMetaInfo: {
    flex: 1,
  },
  cropTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cropCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: MKColors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  gradeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  cropVarietyText: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginVertical: 3,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  conditionChipText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Stock Progress
  stockProgressContainer: {
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  stockLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockStatusLabel: {
    fontSize: 13,
    color: MKColors.textSecondary,
  },
  stockHighlight: {
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  stockTotalLabel: {
    fontSize: 12,
    color: MKColors.textSecondary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  reservedSubtext: {
    fontSize: 11,
    color: MKColors.accentOrange,
    fontWeight: '600',
    marginTop: 5,
  },

  // Intelligence Strip
  cropIntelligenceStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  intelligencePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  intelligenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.textPrimary,
    marginHorizontal: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  trendBadgeUp: {
    backgroundColor: '#E8F5E9',
  },
  trendBadgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },

  // Source Verified
  sourceVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sourceVerifiedText: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginLeft: 5,
  },

  // Action Buttons
  cropCardActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: MKColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  sellCropButton: {
    flex: 1.2,
    height: 44,
    borderRadius: 10,
    backgroundColor: MKColors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  sellCropButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressedButton: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // ── Alert Card ────────────────────────────────────────────────────
  alertCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: MKColors.accentOrange,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
    marginLeft: 6,
    flex: 1,
  },
  alertCardDesc: {
    fontSize: 12,
    color: MKColors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  alertActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  alertActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MKColors.primaryGreen,
    gap: 4,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  alertSecondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
  },
  alertSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },

  // All Safe Banner
  allSafeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 12,
  },
  allSafeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  allSafeSubtitle: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    marginTop: 2,
  },

  // ── Watch Rows ────────────────────────────────────────────────────
  watchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: MKColors.border,
    marginBottom: 14,
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  watchCropBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  watchCropName: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  watchContent: {
    flex: 1,
  },
  watchTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  watchSourceText: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginTop: 2,
  },

  // ── Disclaimer ────────────────────────────────────────────────────
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: MKColors.textSecondary,
    lineHeight: 16,
  },

  // ── Empty State ───────────────────────────────────────────────────
  emptyStateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MKColors.border,
    marginVertical: 10,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: MKColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Modal ─────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  modalCropTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MKColors.textSecondary,
    marginBottom: 10,
  },
  modalEstimatePill: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  modalEstimateValue: {
    fontSize: 17,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  modalEstimateSubtitle: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    marginTop: 2,
  },
  modalSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginBottom: 8,
  },
  modalBodyText: {
    fontSize: 12,
    color: MKColors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  modalDismissBtn: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  modalDismissBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
