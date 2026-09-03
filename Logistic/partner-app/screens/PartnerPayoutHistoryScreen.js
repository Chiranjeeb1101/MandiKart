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

export default function PartnerPayoutHistoryScreen({ navigation }) {
  const { payouts, partnerProfile } = usePartner();

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Payout History"
        subtitle="Bank Transfers & Statements"
        navigation={navigation}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Connected Bank Card */}
        <View style={styles.bankCard}>
          <View style={styles.bankTop}>
            <View style={styles.bankIconBg}>
              <Ionicons name="card" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankLabel}>DEFAULT PAYOUT ACCOUNT</Text>
              <Text style={styles.bankName}>{partnerProfile.bank.bankName}</Text>
              <Text style={styles.accountNumber}>{partnerProfile.bank.accountNumber}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.bankFooter}>
            <Text style={styles.ifscText}>IFSC: {partnerProfile.bank.ifsc}</Text>
            <Text style={styles.holderText}>{partnerProfile.bank.holderName}</Text>
          </View>
        </View>

        {/* Settlement Cycle Explainer */}
        <View style={styles.settlementCycleBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cycleTitle}>Weekly Auto-Settlement Cycle</Text>
            <Text style={styles.cycleDesc}>
              Deliveries completed between Monday to Sunday are reconciled and direct-transferred to your HDFC account every Monday by 2:00 PM.
            </Text>
          </View>
        </View>

        {/* Transfer Records */}
        <Text style={styles.sectionHeading}>Recent Settlements</Text>

        <View style={styles.recordsList}>
          {payouts.map(p => (
            <View key={p.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View>
                  <Text style={styles.recordDate}>{p.date}</Text>
                  <Text style={styles.recordId}>{p.id}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>● {p.status}</Text>
                </View>
              </View>

              <View style={styles.recordAmountRow}>
                <Text style={styles.recordAmount}>{p.amount}</Text>
                <Text style={styles.tdsText}>TDS (1%): {p.tdsDeducted}</Text>
              </View>

              <View style={styles.utrBox}>
                <Text style={styles.utrText}>UTR: {p.utr}</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Receipt Downloaded', `Receipt for ${p.id} saved to your device.`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Tax Statements CTA */}
        <TouchableOpacity
          style={styles.taxBtn}
          onPress={() => Alert.alert('Tax Certificates', 'Form 16A TDS certificates for FY 2025-26 will be emailed to rahul.sharma@mandikart.in')}
          activeOpacity={0.8}
        >
          <Ionicons name="document-attach-outline" size={20} color={COLORS.primary} />
          <Text style={styles.taxBtnText}>Download Annual TDS & Income Certificate</Text>
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
  bankCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    gap: SPACING.md,
  },
  bankTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  bankIconBg: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  bankName: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  accountNumber: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  bankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerLow,
  },
  ifscText: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  holderText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  settlementCycleBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  cycleTitle: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cycleDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  recordsList: {
    gap: SPACING.md,
  },
  recordCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.xs,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recordDate: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  recordId: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  statusPill: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  recordAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  recordAmount: {
    fontSize: FONT.xxl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  tdsText: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  utrBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  utrText: {
    fontSize: 11,
    color: COLORS.outline,
    fontFamily: 'monospace',
  },
  taxBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  taxBtnText: {
    color: COLORS.primary,
    fontSize: FONT.xs,
    fontWeight: '800',
  },
});
