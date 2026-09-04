/**
 * MandiKart Farmer App — Best Selling Options Screen
 * Realtime buyer matchmaking, APMC price comparison, net profit calculations, and direct booking.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
  DollarSign,
  Building2,
  ArrowRight,
  Info,
  Calendar,
  X,
  PhoneCall,
  Check,
} from 'lucide-react-native';
import { MKLayout } from '@/constants/layout';

interface BuyerOption {
  id: string;
  name: string;
  type: 'Direct Buyer' | 'APMC Mandi' | 'Food Processor';
  badge: string;
  ratePerKg: number;
  rating: number;
  totalDeals: number;
  pickupType: string;
  paymentTerm: string;
  verified: boolean;
  avatar: string;
}

const BUYER_OPTIONS: BuyerOption[] = [
  {
    id: 'b1',
    name: 'Reliance Fresh Sourcing Hub',
    type: 'Direct Buyer',
    badge: 'HIGHEST NET PAYOUT',
    ratePerKg: 28.5,
    rating: 4.9,
    totalDeals: 1420,
    pickupType: 'Free Farmgate Pickup',
    paymentTerm: 'Instant Bank Transfer on Loading',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'b2',
    name: 'BigBasket Regional Hub',
    type: 'Direct Buyer',
    badge: 'GUARANTEED PICKUP',
    ratePerKg: 27.8,
    rating: 4.8,
    totalDeals: 890,
    pickupType: 'Tomorrow 9:00 AM',
    paymentTerm: 'Same-Day UPI / IMPS',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'b3',
    name: 'Kalyan Agro Food Processors',
    type: 'Food Processor',
    badge: 'BULK BONUS +₹1.5/KG',
    ratePerKg: 29.0,
    rating: 4.7,
    totalDeals: 430,
    pickupType: 'Self Drop / MandiKart Transit',
    paymentTerm: 'Escrow Protected (12h)',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'b4',
    name: 'Lasalgaon APMC Mandi Auction',
    type: 'APMC Mandi',
    badge: 'GOVT MANDI BENCHMARK',
    ratePerKg: 25.5,
    rating: 4.5,
    totalDeals: 9500,
    pickupType: 'Requires Farmer Transport (₹1.8/kg)',
    paymentTerm: 'Mandi Commission & 3-Day Cheque',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=120&auto=format&fit=crop&q=80',
  },
];

export default function BestSellingOptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ crop?: string; qty?: string; grade?: string }>();

  const crop = params.crop || 'Onion';
  const rawQty = params.qty || '1,000';
  const grade = params.grade || 'Grade A';
  const qtyNumber = parseInt(rawQty.replace(/,/g, ''), 10) || 1000;

  const [activeFilter, setActiveFilter] = useState<'All' | 'Direct Buyer' | 'Food Processor' | 'APMC Mandi'>('All');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerOption | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const topPadding = MKLayout.getTopHeaderPadding(insets);

  const filteredOptions = BUYER_OPTIONS.filter((opt) => {
    if (activeFilter === 'All') return true;
    return opt.type === activeFilter;
  });

  const handleBookOffer = (buyer: BuyerOption) => {
    setSelectedBuyer(buyer);
    setSuccessModalVisible(true);
  };

  return (
    <View style={styles.root}>
      {/* ── Top App Bar ── */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1F2937" strokeWidth={2.2} />
        </Pressable>
        <View style={styles.topBarTitleCol}>
          <Text style={styles.topBarTitle}>Best Selling Options</Text>
          <Text style={styles.topBarSubtitle}>
            {qtyNumber.toLocaleString()} KG {crop} • {grade}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Recommendation Banner ── */}
        <View style={styles.recBanner}>
          <View style={styles.recIconWrap}>
            <Sparkles size={20} color="#EF6C00" />
          </View>
          <View style={styles.recTextCol}>
            <Text style={styles.recTitle}>MandiKart AI Price Discovery</Text>
            <Text style={styles.recDesc}>
              Direct buyers are currently paying <Text style={styles.boldGreen}>+12.4% higher</Text> than traditional mandi auctions after deducting transport and loading fees.
            </Text>
          </View>
        </View>

        {/* ── Filter Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['All', 'Direct Buyer', 'Food Processor', 'APMC Mandi'] as const).map((cat) => (
            <Pressable
              key={cat}
              style={[styles.filterPill, activeFilter === cat && styles.filterPillActive]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[styles.filterPillText, activeFilter === cat && styles.filterPillTextActive]}>
                {cat === 'All' ? 'All Offers' : cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Buyer Option Cards ── */}
        <View style={styles.optionsList}>
          {filteredOptions.map((opt) => {
            const grossPayout = opt.ratePerKg * qtyNumber;
            const isGovt = opt.type === 'APMC Mandi';
            const transportDeduction = isGovt ? qtyNumber * 1.8 : 0;
            const netPayout = grossPayout - transportDeduction;

            return (
              <View key={opt.id} style={styles.buyerCard}>
                {/* Header Badge */}
                <View style={styles.cardBadgeRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      opt.type === 'Direct Buyer' && styles.typeBadgeDirect,
                      opt.type === 'Food Processor' && styles.typeBadgeProcessor,
                      opt.type === 'APMC Mandi' && styles.typeBadgeGovt,
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>{opt.badge}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ {opt.rating}</Text>
                    <Text style={styles.dealsText}>({opt.totalDeals})</Text>
                  </View>
                </View>

                {/* Buyer Header Info */}
                <View style={styles.buyerHeader}>
                  <Image source={{ uri: opt.avatar }} style={styles.buyerAvatar} />
                  <View style={styles.buyerInfoCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.buyerName}>{opt.name}</Text>
                      {opt.verified && (
                        <ShieldCheck size={16} color="#2E7D32" strokeWidth={2.4} style={{ marginLeft: 4 }} />
                      )}
                    </View>
                    <Text style={styles.buyerCategory}>{opt.type}</Text>
                  </View>
                </View>

                {/* Price & Payout Box */}
                <View style={styles.payoutBox}>
                  <View style={styles.payoutCol}>
                    <Text style={styles.payoutLabel}>Rate Offered</Text>
                    <Text style={styles.payoutRate}>₹{opt.ratePerKg.toFixed(2)} <Text style={styles.perKg}>/kg</Text></Text>
                  </View>

                  <View style={styles.payoutDivider} />

                  <View style={styles.payoutCol}>
                    <Text style={styles.payoutLabel}>Net Payout in Bank</Text>
                    <Text style={styles.payoutTotal}>₹{netPayout.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* Terms Details */}
                <View style={styles.termsList}>
                  <View style={styles.termRow}>
                    <Truck size={14} color="#6B7280" />
                    <Text style={styles.termText}>{opt.pickupType}</Text>
                  </View>
                  <View style={styles.termRow}>
                    <ShieldCheck size={14} color="#2E7D32" />
                    <Text style={styles.termText}>{opt.paymentTerm}</Text>
                  </View>
                </View>

                {/* CTA Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.acceptBtn,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => handleBookOffer(opt)}
                >
                  <Text style={styles.acceptBtnText}>
                    {isGovt ? 'GENERATE GATE PASS' : 'ACCEPT & BOOK PICKUP'}
                  </Text>
                  <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Booking Success Modal ── */}
      {selectedBuyer && (
        <Modal
          visible={successModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalIconWrap}>
                <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
              </View>

              <Text style={styles.modalSuccessTitle}>Offer Accepted!</Text>
              <Text style={styles.modalSuccessSubtitle}>
                Vehicle and pickup booked with <Text style={{ fontWeight: '700', color: '#1F2937' }}>{selectedBuyer.name}</Text>.
              </Text>

              <View style={styles.dealSummaryBox}>
                <View style={styles.dealSummaryRow}>
                  <Text style={styles.dealSummaryLabel}>Crop & Grade</Text>
                  <Text style={styles.dealSummaryVal}>{crop} ({grade})</Text>
                </View>
                <View style={styles.dealSummaryRow}>
                  <Text style={styles.dealSummaryLabel}>Total Quantity</Text>
                  <Text style={styles.dealSummaryVal}>{qtyNumber.toLocaleString()} KG</Text>
                </View>
                <View style={styles.dealSummaryRow}>
                  <Text style={styles.dealSummaryLabel}>Rate Agreed</Text>
                  <Text style={styles.dealSummaryVal}>₹{selectedBuyer.ratePerKg.toFixed(2)}/kg</Text>
                </View>
                <View style={[styles.dealSummaryRow, { borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 8, marginTop: 4 }]}>
                  <Text style={[styles.dealSummaryLabel, { fontWeight: '700', color: '#1F2937' }]}>Estimated Payout</Text>
                  <Text style={[styles.dealSummaryVal, { fontWeight: '800', color: '#2E7D32', fontSize: 16 }]}>
                    ₹{(selectedBuyer.ratePerKg * qtyNumber).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.modalDoneBtn}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.push('/(tabs)/orders');
                }}
              >
                <Text style={styles.modalDoneBtnText}>VIEW IN ORDERS</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F1E9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3DCCF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleCol: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
  },
  topBarSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  recBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  recIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTextCol: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 12.5,
    color: '#7C2D12',
    lineHeight: 18,
  },
  boldGreen: {
    fontWeight: '800',
    color: '#2E7D32',
  },
  filterTabsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#1E5A2A',
    borderColor: '#1E5A2A',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  optionsList: {
    gap: 14,
  },
  buyerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeDirect: {
    backgroundColor: '#DCFCE7',
  },
  typeBadgeProcessor: {
    backgroundColor: '#FEF3C7',
  },
  typeBadgeGovt: {
    backgroundColor: '#E0E7FF',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: 0.3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  dealsText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  buyerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  buyerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  buyerInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  buyerCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  payoutBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  payoutCol: {
    flex: 1,
  },
  payoutDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  payoutLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  payoutRate: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F2937',
  },
  perKg: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  payoutTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15803D',
  },
  termsList: {
    gap: 6,
    marginBottom: 14,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  termText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  acceptBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1E5A2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalSuccessTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  modalSuccessSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  dealSummaryBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    marginBottom: 20,
  },
  dealSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dealSummaryLabel: {
    fontSize: 12.5,
    color: '#6B7280',
  },
  dealSummaryVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalDoneBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
