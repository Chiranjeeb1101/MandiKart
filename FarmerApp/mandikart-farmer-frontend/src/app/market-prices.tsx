/**
 * MandiKart — Market Prices Screen
 * 
 * Live APMC Mandi Benchmark Rates & Market Intelligence
 * Real-time price tracking across Maharashtra & National APMC mandis.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
  Scale,
  Truck,
} from 'lucide-react-native';
import { MKBackground } from '@/components/ui';

interface MandiPriceRecord {
  id: string;
  cropName: string;
  variety: string;
  grade: string;
  mandiName: string;
  district: string;
  distanceKm: number;
  minPriceQtl: number;
  modalPriceQtl: number;
  maxPriceQtl: number;
  modalPriceKg: number;
  trendPct: number;
  trendDirection: 'up' | 'down';
  arrivalQtl: number;
  updatedTime: string;
  imageUri: string;
}

const LIVE_MANDI_DATA: MandiPriceRecord[] = [
  {
    id: 'mp-1',
    cropName: 'Red Onion',
    variety: 'Nashik Garwa',
    grade: 'Grade A',
    mandiName: 'Lasalgaon APMC',
    district: 'Nashik',
    distanceKm: 28,
    minPriceQtl: 2150,
    modalPriceQtl: 2450,
    maxPriceQtl: 2780,
    modalPriceKg: 24.5,
    trendPct: 4.2,
    trendDirection: 'up',
    arrivalQtl: 3200,
    updatedTime: '15 mins ago',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA',
  },
  {
    id: 'mp-2',
    cropName: 'Hybrid Tomato',
    variety: 'Abhinav Fresh',
    grade: 'Grade A',
    mandiName: 'Pimpalgaon APMC',
    district: 'Nashik',
    distanceKm: 18,
    minPriceQtl: 1650,
    modalPriceQtl: 1820,
    maxPriceQtl: 2100,
    modalPriceKg: 18.2,
    trendPct: -1.5,
    trendDirection: 'down',
    arrivalQtl: 1850,
    updatedTime: '22 mins ago',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw',
  },
  {
    id: 'mp-3',
    cropName: 'Jyoti Potato',
    variety: 'Table Clean Washed',
    grade: 'Grade A',
    mandiName: 'Pune APMC (Gultekdi)',
    district: 'Pune',
    distanceKm: 165,
    minPriceQtl: 1380,
    modalPriceQtl: 1540,
    maxPriceQtl: 1720,
    modalPriceKg: 15.4,
    trendPct: 2.1,
    trendDirection: 'up',
    arrivalQtl: 4100,
    updatedTime: '30 mins ago',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ',
  },
  {
    id: 'mp-4',
    cropName: 'Garlic (Lahsun)',
    variety: 'Ooty Hybrid Large',
    grade: 'Premium Special',
    mandiName: 'Vashi APMC',
    district: 'Navi Mumbai',
    distanceKm: 145,
    minPriceQtl: 14500,
    modalPriceQtl: 16800,
    maxPriceQtl: 19200,
    modalPriceKg: 168.0,
    trendPct: 5.8,
    trendDirection: 'up',
    arrivalQtl: 620,
    updatedTime: '10 mins ago',
    imageUri:
      'https://images.unsplash.com/photo-1615477550926-db6d36e29780?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'mp-5',
    cropName: 'Sharbati Wheat',
    variety: 'Lokwan 148',
    grade: 'Grade 1',
    mandiName: 'Nashik Main APMC',
    district: 'Nashik',
    distanceKm: 12,
    minPriceQtl: 2850,
    modalPriceQtl: 3100,
    maxPriceQtl: 3350,
    modalPriceKg: 31.0,
    trendPct: 1.2,
    trendDirection: 'up',
    arrivalQtl: 2200,
    updatedTime: '40 mins ago',
    imageUri:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'mp-6',
    cropName: 'Green Chilli',
    variety: 'Jwala Spicy',
    grade: 'Grade A',
    mandiName: 'Kalyan APMC',
    district: 'Thane',
    distanceKm: 120,
    minPriceQtl: 3800,
    modalPriceQtl: 4250,
    maxPriceQtl: 4800,
    modalPriceKg: 42.5,
    trendPct: -3.2,
    trendDirection: 'down',
    arrivalQtl: 480,
    updatedTime: '1 hour ago',
    imageUri:
      'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=300&auto=format&fit=crop&q=80',
  },
];

const CROP_FILTER_CHIPS = ['All Crops', 'Onion', 'Tomato', 'Potato', 'Garlic', 'Wheat', 'Chilli'];

export default function MarketPricesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All Crops');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const filteredRecords = useMemo(() => {
    return LIVE_MANDI_DATA.filter((item) => {
      const matchSearch =
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCrop =
        selectedCrop === 'All Crops' ||
        item.cropName.toLowerCase().includes(selectedCrop.toLowerCase());

      return matchSearch && matchCrop;
    });
  }, [searchQuery, selectedCrop]);

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
            <Text style={styles.headerTitle}>Market Prices</Text>
            <View style={styles.liveSyncRow}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveSyncText}>Live Agmarknet Feeds</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.refreshBtn, pressed && { opacity: 0.7 }]}
            onPress={onRefresh}
            hitSlop={8}
          >
            <RefreshCw size={18} color="#168A45" />
          </Pressable>
        </View>

        {/* ── Search Bar ──────────────────────────────────────── */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search crop, APMC mandi, or district..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <X size={16} color="#64748B" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Crop Filter Chips ───────────────────────────────── */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {CROP_FILTER_CHIPS.map((crop) => {
              const isSelected = selectedCrop === crop;
              return (
                <Pressable
                  key={crop}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedCrop(crop)}
                  hitSlop={4}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {crop}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Mandi Price Cards List ──────────────────────────── */}
        <ScrollView
          style={styles.recordsList}
          contentContainerStyle={[styles.recordsScrollContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#168A45']} />}
        >
          {filteredRecords.length === 0 ? (
            <View style={styles.emptyCard}>
              <Scale size={42} color="#94A3B8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No mandi rates found</Text>
              <Text style={styles.emptySub}>Try searching a different crop or clearing the search query.</Text>
            </View>
          ) : (
            filteredRecords.map((item) => {
              const isUp = item.trendDirection === 'up';
              return (
                <View key={item.id} style={styles.priceCard}>
                  {/* Card Header: Crop Image + Name + Trend Badge */}
                  <View style={styles.cardHeaderRow}>
                    <Image source={{ uri: item.imageUri }} style={styles.cropThumb} />
                    <View style={styles.cardCropDetails}>
                      <View style={styles.cropTitleRow}>
                        <Text style={styles.cropName}>{item.cropName}</Text>
                        <View style={styles.gradeBadge}>
                          <Text style={styles.gradeBadgeText}>{item.grade}</Text>
                        </View>
                      </View>
                      <Text style={styles.cropVariety}>{item.variety}</Text>
                    </View>

                    <View style={[styles.trendPill, isUp ? styles.trendPillUp : styles.trendPillDown]}>
                      {isUp ? (
                        <TrendingUp size={12} color="#15803D" strokeWidth={2.4} />
                      ) : (
                        <TrendingDown size={12} color="#DC2626" strokeWidth={2.4} />
                      )}
                      <Text style={[styles.trendPillText, isUp ? styles.trendTextUp : styles.trendTextDown]}>
                        {isUp ? `+${item.trendPct}%` : `${item.trendPct}%`}
                      </Text>
                    </View>
                  </View>

                  {/* Mandi Location & Distance Strip */}
                  <View style={styles.mandiLocationStrip}>
                    <View style={styles.locationLeft}>
                      <MapPin size={13} color="#168A45" />
                      <Text style={styles.mandiNameText}>{item.mandiName}</Text>
                      <Text style={styles.mandiDistrictText}>({item.district})</Text>
                    </View>
                    <View style={styles.distanceBadge}>
                      <Truck size={11} color="#64748B" />
                      <Text style={styles.distanceText}>{item.distanceKm} km</Text>
                    </View>
                  </View>

                  {/* 3-Column Rate Strip (Min / Benchmark Modal / Max) */}
                  <View style={styles.rateBox}>
                    <View style={styles.rateCol}>
                      <Text style={styles.rateColLabel}>MIN RATE</Text>
                      <Text style={styles.rateColVal}>₹{item.minPriceQtl}</Text>
                      <Text style={styles.rateColKg}>₹{(item.minPriceQtl / 100).toFixed(1)}/kg</Text>
                    </View>

                    <View style={styles.rateDivider} />

                    <View style={styles.rateCol}>
                      <Text style={[styles.rateColLabel, { color: '#16A34A', fontWeight: '800' }]}>MODAL RATE</Text>
                      <Text style={[styles.rateColVal, { color: '#15803D', fontSize: 18 }]}>₹{item.modalPriceQtl}</Text>
                      <Text style={[styles.rateColKg, { color: '#166534', fontWeight: '800' }]}>₹{item.modalPriceKg}/kg</Text>
                    </View>

                    <View style={styles.rateDivider} />

                    <View style={styles.rateCol}>
                      <Text style={styles.rateColLabel}>MAX RATE</Text>
                      <Text style={styles.rateColVal}>₹{item.maxPriceQtl}</Text>
                      <Text style={styles.rateColKg}>₹{(item.maxPriceQtl / 100).toFixed(1)}/kg</Text>
                    </View>
                  </View>

                  {/* Footer Action Row: Arrival Volume & Sell Button */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.arrivalBox}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.arrivalText}>Arrivals: {item.arrivalQtl} Qtl • {item.updatedTime}</Text>
                    </View>

                    <Pressable
                      style={({ pressed }) => [styles.sellActionBtn, pressed && { opacity: 0.85 }]}
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/sell',
                          params: { crop: item.cropName, mandi: item.mandiName },
                        })
                      }
                      hitSlop={6}
                    >
                      <Text style={styles.sellActionBtnText}>Sell at Rate</Text>
                      <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}

          {/* Mandi Disclaimer Card */}
          <View style={styles.disclaimerCard}>
            <ShieldCheck size={16} color="#168A45" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={styles.disclaimerText}>
              All prices are certified live Agmarknet benchmark rates. MandiKart provides free pickup directly from your farm gate at approved modal prices.
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
  liveSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveSyncText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  refreshBtn: {
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
  searchSection: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: '#111827',
  },
  chipsContainer: {
    marginBottom: 10,
  },
  chipsScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9CC',
  },
  chipSelected: {
    backgroundColor: '#168A45',
    borderColor: '#168A45',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  recordsList: {
    flex: 1,
  },
  recordsScrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  priceCard: {
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
    marginBottom: 8,
  },
  cropThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cardCropDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cropTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cropName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111827',
  },
  gradeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  cropVariety: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendPillUp: {
    backgroundColor: '#DCFCE7',
  },
  trendPillDown: {
    backgroundColor: '#FEE2E2',
  },
  trendPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  trendTextUp: {
    color: '#15803D',
  },
  trendTextDown: {
    color: '#DC2626',
  },
  mandiLocationStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EBE1',
    marginBottom: 10,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mandiNameText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  mandiDistrictText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  distanceText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  rateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  rateCol: {
    flex: 1,
    alignItems: 'center',
  },
  rateColLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  rateColVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  rateColKg: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  rateDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#BBF7D0',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrivalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrivalText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  sellActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#168A45',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    elevation: 2,
  },
  sellActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2D9CC',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 4,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
    flex: 1,
  },
});
