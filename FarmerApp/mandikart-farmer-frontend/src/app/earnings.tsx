/**
 * MandiKart Farmer App — Earnings & Payouts Screen
 * Full earnings metrics, SVG revenue chart, transaction history, and instant bank withdrawal.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import {
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Clock,
  CheckCircle2,
  Building,
  Download,
  Calendar,
  CreditCard,
  ShieldCheck,
  Check,
  TrendingUp,
} from 'lucide-react-native';
import { MKLayout } from '@/constants/layout';
import { useAuthStore } from '@/store/authStore';

export default function EarningsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '1Y'>('7D');
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('15,000');
  const [isSuccess, setIsSuccess] = useState(false);

  const topPadding = MKLayout.getTopHeaderPadding(insets);

  const weeklyData = [
    { day: 'Mon', amount: 12000, height: 60 },
    { day: 'Tue', amount: 18500, height: 90 },
    { day: 'Wed', amount: 8000, height: 40 },
    { day: 'Thu', amount: 24000, height: 120 },
    { day: 'Fri', amount: 16000, height: 80 },
    { day: 'Sat', amount: 32000, height: 150 },
    { day: 'Sun', amount: 17950, height: 85 },
  ];

  const transactions = [
    {
      id: 'TXN-9021',
      orderId: 'MK-8921',
      crop: 'Sharbati Wheat (500 KG)',
      buyer: 'Reliance Fresh Hub',
      date: 'Today, 11:30 AM',
      amount: '₹11,250',
      status: 'Paid via IMPS',
      type: 'credit',
    },
    {
      id: 'TXN-8842',
      orderId: 'MK-8874',
      crop: 'Red Onion (1,000 KG)',
      buyer: 'BigBasket Regional',
      date: '02 Sept 2026',
      amount: '₹24,600',
      status: 'Paid via NEFT',
      type: 'credit',
    },
    {
      id: 'TXN-8710',
      orderId: 'WD-4401',
      crop: 'Bank Transfer to SBI A/c *8912',
      buyer: 'Self Withdrawal',
      date: '31 Aug 2026',
      amount: '₹40,000',
      status: 'Completed',
      type: 'debit',
    },
    {
      id: 'TXN-8655',
      orderId: 'MK-8790',
      crop: 'Hybrid Tomato (800 KG)',
      buyer: 'Kalyan Agro Processors',
      date: '28 Aug 2026',
      amount: '₹18,400',
      status: 'Paid via UPI',
      type: 'credit',
    },
  ];

  const handleWithdraw = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setWithdrawModalVisible(false);
      Alert.alert('Payout Initiated', `₹${withdrawAmount} sent to State Bank of India A/c *8912 via IMPS.`);
    }, 1200);
  };

  return (
    <View style={styles.root}>
      {/* ── Top App Bar ── */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1F2937" strokeWidth={2.2} />
        </Pressable>
        <View style={styles.topBarTitleCol}>
          <Text style={styles.topBarTitle}>Earnings & Payouts</Text>
          <Text style={styles.topBarSubtitle}>Verified Farmer Wallet</Text>
        </View>
        <Pressable
          style={styles.statementBtn}
          onPress={() => Alert.alert('Download Statement', 'Monthly PDF statement downloaded to your device!')}
        >
          <Download size={18} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Balance Hero Card ── */}
        <View style={styles.balanceHero}>
          <View style={styles.balanceHeaderRow}>
            <View>
              <Text style={styles.balanceHeaderLabel}>TOTAL NET EARNINGS</Text>
              <Text style={styles.balanceAmount}>₹1,28,450</Text>
            </View>
            <View style={styles.walletIconWrap}>
              <Wallet size={26} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Available Balance</Text>
              <Text style={styles.metricValGreen}>₹24,800</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>In Escrow Transit</Text>
              <Text style={styles.metricValOrange}>₹16,450</Text>
            </View>
          </View>

          {/* Withdraw CTA Button */}
          <Pressable
            style={({ pressed }) => [styles.withdrawBtn, pressed && { opacity: 0.9 }]}
            onPress={() => setWithdrawModalVisible(true)}
          >
            <ArrowUpRight size={18} color="#1E5A2A" strokeWidth={2.5} />
            <Text style={styles.withdrawBtnText}>WITHDRAW TO BANK</Text>
          </Pressable>
        </View>

        {/* ── Linked Bank Account Banner ── */}
        <View style={styles.bankCard}>
          <View style={styles.bankIconWrap}>
            <Building size={20} color="#1E5A2A" />
          </View>
          <View style={styles.bankInfoCol}>
            <Text style={styles.bankName}>State Bank of India</Text>
            <Text style={styles.bankDetails}>A/C: *******8912 • IFSC: SBIN0001420</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={14} color="#15803D" />
            <Text style={styles.verifiedText}>Active</Text>
          </View>
        </View>

        {/* ── Revenue Performance Chart ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Payout Trends</Text>
              <Text style={styles.chartSubtitle}>Weekly revenue progression</Text>
            </View>

            <View style={styles.timeframeTabs}>
              {(['7D', '1M', '1Y'] as const).map((tf) => (
                <Pressable
                  key={tf}
                  style={[styles.tfPill, timeframe === tf && styles.tfPillActive]}
                  onPress={() => setTimeframe(tf)}
                >
                  <Text style={[styles.tfText, timeframe === tf && styles.tfTextActive]}>
                    {tf}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* SVG Bar Chart */}
          <View style={styles.chartCanvas}>
            <Svg width="100%" height={170} viewBox="0 0 320 170">
              {weeklyData.map((d, index) => {
                const x = 16 + index * 44;
                const barHeight = d.height;
                const y = 140 - barHeight;
                const isSelected = index === 5; // Highlight Saturday

                return (
                  <G key={d.day}>
                    <Rect
                      x={x}
                      y={y}
                      width={24}
                      height={barHeight}
                      rx={6}
                      fill={isSelected ? '#1E5A2A' : '#D1E7D5'}
                    />
                    <SvgText
                      x={x + 12}
                      y={160}
                      fontSize="11"
                      fontWeight="600"
                      fill="#6B7280"
                      textAnchor="middle"
                    >
                      {d.day}
                    </SvgText>
                    {isSelected && (
                      <SvgText
                        x={x + 12}
                        y={y - 8}
                        fontSize="10"
                        fontWeight="700"
                        fill="#1E5A2A"
                        textAnchor="middle"
                      >
                        ₹32k
                      </SvgText>
                    )}
                  </G>
                );
              })}
            </Svg>
          </View>
        </View>

        {/* ── Transaction History ── */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Payouts</Text>
            <Text style={styles.historyCount}>{transactions.length} transactions</Text>
          </View>

          <View style={styles.transactionsList}>
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit';
              return (
                <View key={tx.id} style={styles.txRow}>
                  <View
                    style={[
                      styles.txIconWrap,
                      isCredit ? styles.txIconCredit : styles.txIconDebit,
                    ]}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={18} color="#15803D" />
                    ) : (
                      <ArrowUpRight size={18} color="#92400E" />
                    )}
                  </View>

                  <View style={styles.txInfoCol}>
                    <Text style={styles.txCrop}>{tx.crop}</Text>
                    <Text style={styles.txMeta}>
                      {tx.buyer} • {tx.date}
                    </Text>
                    <Text style={styles.txStatus}>{tx.status}</Text>
                  </View>

                  <View style={styles.txAmountCol}>
                    <Text
                      style={[
                        styles.txAmount,
                        isCredit ? styles.amountGreen : styles.amountBrown,
                      ]}
                    >
                      {isCredit ? `+${tx.amount}` : `-${tx.amount}`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── Withdraw Modal ── */}
      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Withdraw to Bank</Text>
            <Text style={styles.modalSubtitle}>
              Available balance: <Text style={{ fontWeight: '800', color: '#15803D' }}>₹24,800</Text>
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.rupeePrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.payoutTargetBox}>
              <Building size={18} color="#1E5A2A" />
              <View style={{ flex: 1 }}>
                <Text style={styles.payoutTargetName}>State Bank of India (*8912)</Text>
                <Text style={styles.payoutTargetType}>Instant IMPS • Zero Fee</Text>
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.modalConfirmBtn} onPress={handleWithdraw}>
                {isSuccess ? (
                  <Check size={18} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text style={styles.modalConfirmText}>TRANSFER NOW</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  statementBtn: {
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
    gap: 16,
  },
  balanceHero: {
    backgroundColor: '#1E5A2A',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#1E5A2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  balanceHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  walletIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },
  metricCol: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  metricValGreen: {
    fontSize: 17,
    fontWeight: '800',
    color: '#86EFAC',
    marginTop: 2,
  },
  metricValOrange: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FDBA74',
    marginTop: 2,
  },
  withdrawBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  withdrawBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: 0.4,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    gap: 12,
  },
  bankIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInfoCol: {
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  bankDetails: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  chartSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  timeframeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
  },
  tfPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  tfPillActive: {
    backgroundColor: '#FFFFFF',
  },
  tfText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  tfTextActive: {
    color: '#1F2937',
  },
  chartCanvas: {
    alignItems: 'center',
    paddingTop: 8,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  historyCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionsList: {
    gap: 14,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  txIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconCredit: {
    backgroundColor: '#DCFCE7',
  },
  txIconDebit: {
    backgroundColor: '#FEF3C7',
  },
  txInfoCol: {
    flex: 1,
  },
  txCrop: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  txMeta: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  txStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
    marginTop: 2,
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  amountGreen: {
    color: '#15803D',
  },
  amountBrown: {
    color: '#92400E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  rupeePrefix: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  payoutTargetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  payoutTargetName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  payoutTargetType: {
    fontSize: 11.5,
    color: '#15803D',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  modalConfirmBtn: {
    flex: 2,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
