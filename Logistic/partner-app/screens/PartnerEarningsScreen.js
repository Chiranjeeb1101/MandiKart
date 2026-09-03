import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';
import PartnerHeader from '../components/PartnerHeader';

export default function PartnerEarningsScreen({ navigation }) {
  const { weeklyEarnings, todayStats } = usePartner();
  const maxDayAmount = Math.max(...weeklyEarnings.days.map(d => d.amount));

  const handleWithdraw = () => {
    Alert.alert(
      'Payout Scheduled 💸',
      'Your earnings of ₹4,850 are scheduled for auto-settlement this Monday to HDFC Bank ending in 4012.',
      [{ text: 'View Payout Records', onPress: () => navigation.navigate('PayoutHistory') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Earnings Dashboard"
        subtitle="Weekly Analytics & Settlement"
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Weekly Balance Card */}
        <View style={styles.heroEarningsCard}>
          <Text style={styles.heroPeriod}>CURRENT WEEK • AUG 25 - AUG 31</Text>
          <View style={styles.heroBalanceRow}>
            <Text style={styles.heroCurrency}>₹</Text>
            <Text style={styles.heroBalance}>{weeklyEarnings.totalWeek.toLocaleString('en-IN')}</Text>
          </View>
          <Text style={styles.heroSubtext}>104 Completed Deliveries • Zero Cancellations</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View>
              <Text style={styles.todaySmallLabel}>Today's Earnings</Text>
              <Text style={styles.todaySmallVal}>₹{todayStats.earnings} (18 trips)</Text>
            </View>

            <TouchableOpacity
              style={styles.withdrawCTA}
              onPress={handleWithdraw}
              activeOpacity={0.85}
            >
              <Text style={styles.withdrawText}>Request Payout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 7-Day Visual Bar Chart */}
        <View style={styles.sectionCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Daily Earnings Trends</Text>
            <Text style={styles.chartAvg}>Avg: ₹692/day</Text>
          </View>

          <View style={styles.barChartContainer}>
            {weeklyEarnings.days.map((day, idx) => {
              const heightPercent = (day.amount / maxDayAmount) * 100;
              const isToday = day.day === 'Fri';

              return (
                <View key={idx} style={styles.barColumn}>
                  <Text style={styles.barAmount}>₹{day.amount}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPercent}%` },
                        isToday && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, isToday && styles.barDayToday]}>
                    {day.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Breakdown Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Earnings Breakdown</Text>

          <View style={styles.breakdownList}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dotIcon, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.breakdownLabel}>Base Delivery Fares</Text>
              </View>
              <Text style={styles.breakdownVal}>₹{weeklyEarnings.breakdown.basePay}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dotIcon, { backgroundColor: COLORS.info }]} />
                <Text style={styles.breakdownLabel}>Distance Kilometer Bonus</Text>
              </View>
              <Text style={styles.breakdownVal}>₹{weeklyEarnings.breakdown.distancePay}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dotIcon, { backgroundColor: COLORS.accent }]} />
                <Text style={styles.breakdownLabel}>Surge & Rainy Hours Incentive</Text>
              </View>
              <Text style={styles.breakdownVal}>₹{weeklyEarnings.breakdown.surgeBonus}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dotIcon, { backgroundColor: COLORS.success }]} />
                <Text style={styles.breakdownLabel}>Farmer & Mandi Tips</Text>
              </View>
              <Text style={styles.breakdownVal}>₹{weeklyEarnings.breakdown.tips}</Text>
            </View>
          </View>
        </View>

        {/* Payout Records Button */}
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('PayoutHistory')}
          activeOpacity={0.8}
        >
          <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
          <Text style={styles.historyBtnText}>View Bank Statement & TDS Receipts</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.lg,
  },
  heroEarningsCard: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    gap: 4,
  },
  heroPeriod: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.8,
  },
  heroBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroCurrency: {
    fontSize: FONT.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginRight: 4,
  },
  heroBalance: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  heroSubtext: {
    fontSize: FONT.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: SPACING.md,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todaySmallLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  todaySmallVal: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.white,
  },
  withdrawCTA: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
  },
  withdrawText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: FONT.xs,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartAvg: {
    fontSize: FONT.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: SPACING.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barAmount: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 110,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
  },
  barFillToday: {
    backgroundColor: COLORS.primary,
  },
  barDay: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    marginTop: 6,
  },
  barDayToday: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  breakdownList: {
    gap: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerLow,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dotIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    fontSize: FONT.base,
    color: COLORS.onSurface,
  },
  breakdownVal: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
  historyBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  historyBtnText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
