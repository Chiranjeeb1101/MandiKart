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
import { useRouter } from 'expo-router';
import {
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Check,
  Building2,
  SlidersHorizontal,
  Bell,
  Sprout,
} from 'lucide-react-native';
import { MKScreen, MKCard, MKStatusBadge } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

type OrderTab = 'All' | 'Pending' | 'Active' | 'Completed';

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<OrderTab>('Active');

  return (
    <MKScreen>
      {/* ── 1. Header (Stitch) ── */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track your sales, pickups and deliveries</Text>
        </View>

        <View style={styles.headerRightButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.circleBtn,
              pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/more/notifications')}
          >
            <Bell size={18} color="#564336" strokeWidth={2} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.circleBtn,
              pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filter"
          >
            <SlidersHorizontal size={18} color="#564336" strokeWidth={2} />
          </Pressable>
        </View>
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
          <Text style={[styles.summaryCount, { color: '#1B6D24' }]}>2</Text>
          <Text style={styles.summaryLabel}>ACTIVE</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('Pending')}
          style={({ pressed }) => [
            styles.summaryBox,
            selectedTab === 'Pending' && styles.summaryBoxActive,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={[styles.summaryCount, { color: '#F39C12' }]}>1</Text>
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

      {/* ── 3. Segmented Filter Pills ── */}
      <View style={styles.filterTabsRow}>
        {(['All', 'Pending', 'Active', 'Completed'] as OrderTab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={({ pressed }) => [
              styles.filterPill,
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

      {/* ── 4. Orders List (Stitch) ── */}
      <View style={styles.ordersList}>
        {/* Active Order Card */}
        {(selectedTab === 'All' || selectedTab === 'Active') && (
          <MKCard style={styles.orderCard}>
            {/* Top Row: Badge left, Value right */}
            <View style={styles.orderCardTopRow}>
              <View style={styles.activeBadgePill}>
                <Truck size={13} color="#1B6D24" style={{ marginRight: 4 }} />
                <Text style={styles.activeBadgeText}>ACTIVE ORDER</Text>
              </View>

              <View style={styles.orderValueCol}>
                <Text style={styles.orderValueAmount}>₹24,000</Text>
                <Text style={styles.orderValueLabel}>Order Value</Text>
              </View>
            </View>

            {/* Order Title & Buyer */}
            <View style={styles.orderTitleSection}>
              <Text style={styles.orderNumber}>Order #MK1024</Text>
              <View style={styles.buyerRow}>
                <Text style={styles.buyerName}>ABC Foods</Text>
                <CheckCircle2 size={14} color="#1B6D24" fill="#DCFCE7" style={{ marginLeft: 4 }} />
              </View>
            </View>

            {/* Item Details Box (Peach card with round thumbnail) */}
            <View style={styles.itemDetailsBox}>
              <Image source={{ uri: ONION_CROP_URI }} style={styles.cropThumb} />
              <View style={styles.itemTextCol}>
                <Text style={styles.itemTitle}>Onion • Grade A</Text>
                <Text style={styles.itemSubtext}>1,000 KG</Text>
              </View>
            </View>

            {/* Logistics Status Stepper */}
            <View style={styles.timelineBox}>
              <View style={styles.pickupScheduledHeader}>
                <View style={styles.greenLiveDot} />
                <Text style={styles.pickupScheduledTitle}>
                  Pickup Scheduled (15 September, 10:00 AM)
                </Text>
              </View>

              {/* Vertical 4-Step Stepper */}
              <View style={styles.stepperContainer}>
                {/* Step 1: Done */}
                <View style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={styles.stepCircleDone}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <View style={styles.stepConnectorLineDone} />
                  </View>
                  <Text style={styles.stepLabelDone}>Order Confirmed</Text>
                </View>

                {/* Step 2: Done */}
                <View style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={styles.stepCircleDone}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </View>
                    <View style={styles.stepConnectorLineDone} />
                  </View>
                  <Text style={styles.stepLabelDone}>Pickup Scheduled</Text>
                </View>

                {/* Step 3: Current (Orange Ring) */}
                <View style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={styles.stepCircleCurrent}>
                      <View style={styles.stepDotInner} />
                    </View>
                    <View style={styles.stepConnectorLinePending} />
                  </View>
                  <Text style={styles.stepLabelCurrent}>Pickup Today</Text>
                </View>

                {/* Step 4: Pending */}
                <View style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={styles.stepCirclePending} />
                  </View>
                  <Text style={styles.stepLabelPending}>Delivered</Text>
                </View>
              </View>

              {/* Pickup Details Box */}
              <View style={styles.pickupDetailsCard}>
                <View style={styles.pickupHeaderRow}>
                  <Calendar size={14} color="#564336" style={{ marginRight: 6 }} />
                  <Text style={styles.pickupHeaderText}>Pickup Details</Text>
                </View>
                <View style={styles.pickupInfoGrid}>
                  <View style={styles.pickupInfoCol}>
                    <Text style={styles.pickupInfoLabel}>Date</Text>
                    <Text style={styles.pickupInfoVal}>15 Sept 2026</Text>
                  </View>
                  <View style={styles.pickupInfoCol}>
                    <Text style={styles.pickupInfoLabel}>Time</Text>
                    <Text style={styles.pickupInfoVal}>10:00 AM - 12:00 PM</Text>
                  </View>
                </View>
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.pickupInfoLabel}>Location</Text>
                  <Text style={styles.pickupInfoVal}>Nashik, Maharashtra</Text>
                </View>
              </View>
            </View>
          </MKCard>
        )}

        {/* Pending Request Card (Stitch) */}
        {(selectedTab === 'All' || selectedTab === 'Pending') && (
          <MKCard style={styles.orderCard}>
            <View style={styles.orderCardTopRow}>
              <View style={styles.pendingBadgePill}>
                <Clock size={12} color="#D9531E" style={{ marginRight: 4 }} />
                <Text style={styles.pendingBadgeText}>PENDING REQUEST</Text>
              </View>

              <View style={styles.orderValueCol}>
                <Text style={styles.orderValueAmount}>
                  ₹24<Text style={{ fontSize: 13, fontWeight: '500', color: '#757575' }}>/kg</Text>
                </Text>
                <Text style={styles.orderValueLabel}>Proposed Price</Text>
              </View>
            </View>

            <View style={styles.orderTitleSection}>
              <Text style={styles.buyerNameLarge}>ABC Foods</Text>
            </View>

            {/* Crop Info */}
            <View style={styles.pendingCropRow}>
              <View style={styles.sproutCircle}>
                <Sprout size={18} color="#964900" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Onion • 1,000 KG • Grade A</Text>
                <Text style={styles.itemSubtext}>Est. Net: ₹21,500</Text>
              </View>
            </View>

            {/* Waiting Status Banner */}
            <View style={styles.waitingBanner}>
              <Clock size={14} color="#D9531E" style={{ marginRight: 6 }} />
              <Text style={styles.waitingBannerText}>Waiting for Buyer Response</Text>
            </View>
          </MKCard>
        )}

        {/* Completed Order Card (Stitch) */}
        {(selectedTab === 'All' || selectedTab === 'Completed') && (
          <MKCard style={styles.orderCard}>
            <View style={styles.completedHeaderRow}>
              <Text style={styles.orderNumber}>Order #MK1008</Text>
              <View style={styles.completedBadgePill}>
                <Text style={styles.completedBadgeText}>COMPLETED</Text>
              </View>
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
    color: '#964900',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  /* ── Summary Strip (3 Equal Columns) ── */
  summaryStrip: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: MKSpacing.lg,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    minWidth: 0,
  },
  summaryBoxActive: {
    borderColor: '#A0F399',
    backgroundColor: '#FFFFFF',
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
  },

  /* ── Filter Pills ── */
  filterTabsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    marginBottom: MKSpacing.lg,
    elevation: 2,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#E8F5E9',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterPillTextActive: {
    color: '#1B6D24',
    fontWeight: '800',
  },

  /* ── Orders List ── */
  ordersList: {
    width: '100%',
  },
  orderCard: {
    marginBottom: MKSpacing.md,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  /* Active Order Header */
  orderCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  activeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B6D24',
    letterSpacing: 0.5,
  },
  orderValueCol: {
    alignItems: 'flex-end',
  },
  orderValueAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#212121',
  },
  orderValueLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500',
  },

  orderTitleSection: {
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  buyerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  buyerNameLarge: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
  },

  /* Item Box */
  itemDetailsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F8E7D8',
    width: '100%',
    marginBottom: 16,
  },
  cropThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212121',
  },
  itemSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },

  /* Timeline */
  timelineBox: {
    width: '100%',
  },
  pickupScheduledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greenLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1B6D24',
    marginRight: 6,
  },
  pickupScheduledTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B6D24',
  },

  /* Stepper */
  stepperContainer: {
    paddingLeft: 4,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 22,
    marginRight: 10,
  },
  stepCircleDone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1B6D24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D9531E',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9531E',
  },
  stepCirclePending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  stepConnectorLineDone: {
    width: 2,
    height: 20,
    backgroundColor: '#1B6D24',
  },
  stepConnectorLinePending: {
    width: 2,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  stepLabelDone: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    paddingTop: 1,
  },
  stepLabelCurrent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D9531E',
    paddingTop: 1,
  },
  stepLabelPending: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    paddingTop: 1,
  },

  /* Pickup Details Box */
  pickupDetailsCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    width: '100%',
  },
  pickupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickupHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  pickupInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickupInfoCol: {
    flex: 1,
  },
  pickupInfoLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500',
  },
  pickupInfoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#212121',
    marginTop: 2,
  },

  /* Pending Request Styles */
  pendingBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D9531E',
    letterSpacing: 0.5,
  },
  pendingCropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sproutCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEFE5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
  waitingBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D9531E',
  },

  /* Completed Order */
  completedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  completedBadgePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
});
