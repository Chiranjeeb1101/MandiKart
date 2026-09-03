/**
 * MandiKart Farmer App — Screen 11: My Orders (Tracking & Management)
 *
 * Built using MandiKart production layout primitives (MKScreen, MKSection, MKCard).
 * Equal-flex filter pills, live timeline tracking, and clear status cards.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Check,
  Building2,
  SlidersHorizontal,
} from 'lucide-react-native';
import { MKScreen, MKCard, MKStatusBadge } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

type OrderTab = 'All' | 'Pending' | 'Active' | 'Completed';

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<OrderTab>('Active');

  return (
    <MKScreen>
      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track your sales, pickups and deliveries</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.filterBtn,
            pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Filter"
        >
          <SlidersHorizontal size={18} color={MKColors.textSecondary} />
        </Pressable>
      </View>

      {/* ── 2. Order Summary Strip (3 Equal Columns) ── */}
      <View style={styles.summaryStrip}>
        <Pressable
          onPress={() => setSelectedTab('Active')}
          style={({ pressed }) => [
            styles.summaryBox,
            selectedTab === 'Active' && styles.summaryBoxActive,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={[styles.summaryCount, { color: MKColors.primaryGreen }]}>2</Text>
          <Text style={styles.summaryLabel}>ACTIVE</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('Pending')}
          style={({ pressed }) => [
            styles.summaryBox,
            styles.summaryBoxMiddle,
            selectedTab === 'Pending' && styles.summaryBoxActive,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={[styles.summaryCount, { color: MKColors.accentOrange }]}>1</Text>
          <Text style={styles.summaryLabel}>PENDING</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('Completed')}
          style={({ pressed }) => [
            styles.summaryBox,
            selectedTab === 'Completed' && styles.summaryBoxActive,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={[styles.summaryCount, { color: '#5D6D7E' }]}>12</Text>
          <Text style={styles.summaryLabel}>COMPLETED</Text>
        </Pressable>
      </View>

      {/* ── 3. Segmented Filter Pills (Equal Flex Distribution) ── */}
      <View style={styles.filterTabsRow}>
        {(['All', 'Pending', 'Active', 'Completed'] as OrderTab[]).map((tab, idx) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={({ pressed }) => [
              styles.filterPill,
              idx > 0 && styles.filterPillMargin,
              selectedTab === tab && styles.filterPillActive,
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.filterPillText,
                selectedTab === tab && styles.filterPillTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── 4. Orders List ── */}
      <View style={styles.ordersList}>
        {/* Active Order Card */}
        {(selectedTab === 'All' || selectedTab === 'Active') && (
          <MKCard style={styles.orderCard}>
            <View style={styles.orderTopHeader}>
              <View style={styles.orderTopHeaderLeft}>
                <View style={styles.badgeRow}>
                  <MKStatusBadge
                    label="ACTIVE ORDER"
                    type="success"
                    icon={<Truck size={12} color={MKColors.primaryGreen} />}
                    size="sm"
                  />
                </View>
                <Text style={styles.orderNumber}>Order #MK1024</Text>
                <View style={styles.buyerRow}>
                  <Text style={styles.buyerName}>ABC Foods</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <CheckCircle2 size={13} color={MKColors.primaryGreen} />
                  <Text style={styles.verifiedText}>Verified Buyer</Text>
                </View>
              </View>

              <Image source={{ uri: ONION_CROP_URI }} style={styles.cropThumb} />
            </View>

            {/* Item Details */}
            <View style={styles.itemDetailsBox}>
              <Text style={styles.itemTitle}>Onion (Grade A)</Text>
              <Text style={styles.itemSubtext}>1,000 KG @ ₹24.00/KG</Text>
              <Text style={styles.itemTotal}>Total Amount: ₹24,000</Text>
            </View>

            {/* Timeline */}
            <View style={styles.timelineBox}>
              <Text style={styles.timelineTitle}>LOGISTICS STATUS</Text>
              <View style={styles.timelineSteps}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text style={styles.stepLabelDone}>Order Accepted</Text>
                </View>
                <View style={[styles.stepLine, styles.stepLineDone]} />
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, styles.stepDotActive]}>
                    <Truck size={10} color="#FFFFFF" />
                  </View>
                  <Text style={styles.stepLabelActive}>Pickup Scheduled</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepItem}>
                  <View style={styles.stepDot} />
                  <Text style={styles.stepLabel}>Delivered & Escrow</Text>
                </View>
              </View>

              <View style={styles.pickupDetailBanner}>
                <Calendar size={14} color={MKColors.primaryGreen} />
                <Text style={styles.pickupDetailText}>
                  Pickup: Tomorrow, 10:00 AM by MandiKart Logistics
                </Text>
              </View>
            </View>
          </MKCard>
        )}

        {/* Pending Request Card */}
        {(selectedTab === 'All' || selectedTab === 'Pending') && (
          <MKCard style={styles.orderCard}>
            <View style={styles.orderTopHeader}>
              <View style={styles.orderTopHeaderLeft}>
                <View style={styles.badgeRow}>
                  <MKStatusBadge
                    label="BUYER REQUEST"
                    type="warning"
                    icon={<Clock size={12} color={MKColors.accentOrange} />}
                    size="sm"
                  />
                </View>
                <Text style={styles.orderNumber}>Request #REQ809</Text>
                <View style={styles.buyerRow}>
                  <Building2 size={14} color={MKColors.textSecondary} />
                  <Text style={styles.buyerNameText}>FreshPro Processing Ltd</Text>
                </View>
              </View>
            </View>

            <View style={styles.itemDetailsBox}>
              <Text style={styles.itemTitle}>Tomato (Grade B)</Text>
              <Text style={styles.itemSubtext}>500 KG Offer @ ₹30.00/KG</Text>
            </View>

            <View style={styles.pendingActionRow}>
              <Pressable style={styles.declineBtn}>
                <Text style={styles.declineBtnText}>Decline</Text>
              </Pressable>

              <Pressable style={styles.acceptBtn}>
                <Text style={styles.acceptBtnText}>Accept Offer (₹15,000)</Text>
              </Pressable>
            </View>
          </MKCard>
        )}
      </View>
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.lg,
    width: '100%',
  },
  headerTextCol: {
    flex: 1,
    marginRight: MKSpacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    elevation: 1,
    flexShrink: 0,
  },

  /* ── Summary Strip (3 Equal Columns) ── */
  summaryStrip: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: MKSpacing.lg,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    minWidth: 0,
  },
  summaryBoxMiddle: {
    marginHorizontal: MKSpacing.sm,
  },
  summaryBoxActive: {
    borderColor: MKColors.primaryGreen,
    backgroundColor: '#E8F5E9',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: MKColors.textSecondary,
    letterSpacing: 0.5,
  },

  /* ── Filter Pills ── */
  filterTabsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: MKSpacing.lg,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  filterPillMargin: {
    marginLeft: MKSpacing.xs,
  },
  filterPillActive: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: MKColors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* ── Orders List ── */
  ordersList: {
    width: '100%',
  },
  orderCard: {
    marginBottom: MKSpacing.md,
  },
  orderTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  orderTopHeaderLeft: {
    flex: 1,
    marginRight: MKSpacing.sm,
    minWidth: 0,
  },
  badgeRow: {
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  buyerName: {
    fontSize: 13,
    fontWeight: '600',
    color: MKColors.textSecondary,
  },
  buyerNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: MKColors.textSecondary,
    marginLeft: 4,
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: MKColors.textMuted,
  },
  verifiedText: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    fontWeight: '700',
    marginLeft: 3,
  },
  cropThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    flexShrink: 0,
  },
  itemDetailsBox: {
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  itemSubtext: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.primaryGreen,
    marginTop: 6,
  },

  /* Timeline */
  timelineBox: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingTop: MKSpacing.md,
    width: '100%',
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: MKColors.textMuted,
    letterSpacing: 0.6,
    marginBottom: MKSpacing.md,
  },
  timelineSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E8E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: {
    backgroundColor: MKColors.primaryGreen,
  },
  stepDotActive: {
    backgroundColor: MKColors.accentOrange,
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E8E4DA',
    marginTop: -16,
  },
  stepLineDone: {
    backgroundColor: MKColors.primaryGreen,
  },
  stepLabel: {
    fontSize: 10,
    color: MKColors.textMuted,
    textAlign: 'center',
  },
  stepLabelDone: {
    fontSize: 10,
    color: MKColors.primaryGreen,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepLabelActive: {
    fontSize: 10,
    color: MKColors.accentOrange,
    fontWeight: '800',
    textAlign: 'center',
  },
  pickupDetailBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  pickupDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: MKColors.primaryGreen,
    marginLeft: 6,
    flex: 1,
  },

  /* Pending Action Row */
  pendingActionRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: MKSpacing.xs,
  },
  declineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: MKSpacing.sm,
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.textSecondary,
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: MKColors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
