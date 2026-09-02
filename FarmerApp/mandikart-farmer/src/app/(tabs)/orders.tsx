/**
 * MandiKart Farmer App — Screen 11: My Orders (Tracking & Management)
 * 
 * Implements the approved Stitch visual design:
 * Order summary counts (Active, Pending, Completed), filter pill bar,
 * active order card with live multi-step tracking timeline, pickup logistics details,
 * pending buyer request cards, and completed order escrow receipts.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { MKBackground, MKCard, MKStatusBadge } from '@/components/ui';

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

type OrderTab = 'All' | 'Pending' | 'Active' | 'Completed';

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<OrderTab>('Active');

  const topPadding = Math.max(insets.top + 16, 50);
  const bottomPadding = Math.max(insets.bottom + 80, 110);

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSubtitle}>Track your sales, pickups and deliveries</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.filterBtn,
              pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
            ]}
          >
            <SlidersHorizontal size={18} color="#5F6368" />
          </Pressable>
        </View>

        {/* Order Summary Strip */}
        <View style={styles.summaryStrip}>
          <Pressable
            onPress={() => setSelectedTab('Active')}
            style={({ pressed }) => [
              styles.summaryBox,
              selectedTab === 'Active' && styles.summaryBoxActive,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
            ]}
          >
            <Text style={[styles.summaryCount, { color: '#1E5A2A' }]}>2</Text>
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
            <Text style={[styles.summaryCount, { color: '#EF7D1A' }]}>1</Text>
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

        {/* Segmented Filter Pills */}
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

        {/* Orders List */}
        <View style={styles.ordersList}>
          {/* Active Order Card */}
          {(selectedTab === 'All' || selectedTab === 'Active') && (
            <MKCard style={styles.activeOrderCard}>
              <View style={styles.orderTopHeader}>
                <View>
                  <View style={styles.badgeRow}>
                    <MKStatusBadge
                      label="ACTIVE ORDER"
                      type="success"
                      icon={<Truck size={12} color="#1E5A2A" />}
                      size="sm"
                    />
                  </View>
                  <Text style={styles.orderNumber}>Order #MK1024</Text>
                  <View style={styles.buyerRow}>
                    <Text style={styles.buyerName}>ABC Foods</Text>
                    <CheckCircle2 size={14} color="#1E5A2A" />
                  </View>
                </View>

                <View style={styles.orderPriceBlock}>
                  <Text style={styles.orderTotal}>₹24,000</Text>
                  <Text style={styles.orderPriceSub}>Total Order Value</Text>
                </View>
              </View>

              {/* Crop Info Row */}
              <View style={styles.cropRow}>
                <Image source={{ uri: ONION_CROP_URI }} style={styles.cropThumb} />
                <View>
                  <Text style={styles.cropTitle}>Onion • Grade A</Text>
                  <Text style={styles.cropSub}>1,000 KG Available</Text>
                </View>
              </View>

              {/* Scheduled Status Banner */}
              <View style={styles.statusBanner}>
                <View style={styles.pulsingDot} />
                <Text style={styles.statusBannerText}>
                  Pickup Scheduled (15 September, 10:00 AM)
                </Text>
              </View>

              {/* Multi-Step Timeline */}
              <View style={styles.timelineContainer}>
                {/* Step 1: Confirmed */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepCircleDone}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepLineDone} />
                  <Text style={styles.stepTitleDone}>Order Confirmed</Text>
                </View>

                {/* Step 2: Pickup Scheduled */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepCircleDone}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepLineActive} />
                  <Text style={styles.stepTitleDone}>Pickup Scheduled</Text>
                </View>

                {/* Step 3: Pickup Today */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepCircleActive}>
                    <View style={styles.stepInnerDot} />
                  </View>
                  <View style={styles.stepLinePending} />
                  <Text style={styles.stepTitleActive}>Pickup Today</Text>
                </View>

                {/* Step 4: Delivered */}
                <View style={styles.timelineStep}>
                  <View style={styles.stepCirclePending} />
                  <Text style={styles.stepTitlePending}>Delivered & Paid</Text>
                </View>
              </View>

              {/* Pickup Logistics Box */}
              <View style={styles.logisticsBox}>
                <View style={styles.logisticsHeader}>
                  <Calendar size={16} color="#1E5A2A" />
                  <Text style={styles.logisticsTitle}>Pickup Details</Text>
                </View>

                <View style={styles.logisticsGrid}>
                  <View style={styles.logisticsCol}>
                    <Text style={styles.logisticsLabel}>Date</Text>
                    <Text style={styles.logisticsVal}>15 Sept 2026</Text>
                  </View>

                  <View style={styles.logisticsCol}>
                    <Text style={styles.logisticsLabel}>Time Window</Text>
                    <Text style={styles.logisticsVal}>10:00 AM - 12:00 PM</Text>
                  </View>

                  <View style={[styles.logisticsCol, { marginTop: 8 }]}>
                    <Text style={styles.logisticsLabel}>Pickup Location</Text>
                    <Text style={styles.logisticsVal}>Dindori, Nashik, Maharashtra</Text>
                  </View>
                </View>
              </View>
            </MKCard>
          )}

          {/* Pending Request Card */}
          {(selectedTab === 'All' || selectedTab === 'Pending') && (
            <MKCard style={styles.pendingCard}>
              <View style={styles.orderTopHeader}>
                <View>
                  <MKStatusBadge
                    label="PENDING REQUEST"
                    type="warning"
                    icon={<Clock size={12} color="#EF7D1A" />}
                    size="sm"
                  />
                  <Text style={[styles.orderNumber, { marginTop: 4 }]}>ABC Foods</Text>
                </View>

                <View style={styles.orderPriceBlock}>
                  <Text style={styles.orderTotal}>₹24.00/kg</Text>
                  <Text style={styles.orderPriceSub}>Proposed Price</Text>
                </View>
              </View>

              <View style={styles.cropRow}>
                <View style={styles.placeholderThumb}>
                  <Building2 size={20} color="#5F6368" />
                </View>
                <View>
                  <Text style={styles.cropTitle}>Onion • 1,000 KG • Grade A</Text>
                  <Text style={styles.cropSub}>Estimated Net: ₹21,500</Text>
                </View>
              </View>

              <View style={styles.waitingBanner}>
                <Clock size={16} color="#EF7D1A" />
                <Text style={styles.waitingText}>Waiting for Buyer Acceptance</Text>
              </View>
            </MKCard>
          )}

          {/* Completed Order Card */}
          {(selectedTab === 'All' || selectedTab === 'Completed') && (
            <MKCard style={styles.completedCard}>
              <View style={styles.orderTopHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #MK1008</Text>
                  <Text style={styles.cropSub}>ABC Foods • Onion, 1,000 KG</Text>
                </View>

                <MKStatusBadge label="COMPLETED" type="neutral" size="sm" />
              </View>

              <View style={styles.completedBadgesRow}>
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={14} color="#1E5A2A" />
                  <Text style={styles.verifiedText}>Delivered</Text>
                </View>

                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={14} color="#1E5A2A" />
                  <Text style={styles.verifiedText}>₹22,000 Paid via Escrow</Text>
                </View>
              </View>
            </MKCard>
          )}
        </View>
      </ScrollView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#5F6368',
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
  },
  summaryStrip: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
  },
  summaryBoxActive: {
    borderColor: '#1E5A2A',
    backgroundColor: '#FAF9F6',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 0.5,
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#E8F5E9',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  filterPillTextActive: {
    color: '#1E5A2A',
    fontWeight: '700',
  },
  ordersList: {
    gap: 16,
  },
  activeOrderCard: {
    padding: 18,
    gap: 14,
    borderColor: '#C8E6C9',
  },
  pendingCard: {
    padding: 18,
    gap: 12,
  },
  completedCard: {
    padding: 16,
    gap: 10,
    opacity: 0.9,
  },
  orderTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeRow: {
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  buyerName: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '600',
  },
  orderPriceBlock: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  orderPriceSub: {
    fontSize: 11,
    color: '#7A7A7A',
  },
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  cropThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  placeholderThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0ECE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  cropSub: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E5A2A',
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  timelineContainer: {
    paddingLeft: 4,
    gap: 16,
    marginVertical: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  stepCircleDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 2,
  },
  stepCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF7D1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 2,
  },
  stepInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF7D1A',
  },
  stepCirclePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D8D4CA',
    marginRight: 12,
    zIndex: 2,
  },
  stepLineDone: {
    position: 'absolute',
    left: 10,
    top: 22,
    bottom: -16,
    width: 2,
    backgroundColor: '#1E5A2A',
    zIndex: 1,
  },
  stepLineActive: {
    position: 'absolute',
    left: 10,
    top: 22,
    bottom: -16,
    width: 2,
    backgroundColor: '#EF7D1A',
    zIndex: 1,
  },
  stepLinePending: {
    position: 'absolute',
    left: 10,
    top: 22,
    bottom: -16,
    width: 2,
    backgroundColor: '#D8D4CA',
    zIndex: 1,
  },
  stepTitleDone: {
    fontSize: 13,
    color: '#1A1C1E',
    fontWeight: '600',
  },
  stepTitleActive: {
    fontSize: 13,
    color: '#EF7D1A',
    fontWeight: '700',
  },
  stepTitlePending: {
    fontSize: 13,
    color: '#9AA0A6',
    fontWeight: '500',
  },
  logisticsBox: {
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    gap: 10,
  },
  logisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logisticsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  logisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logisticsCol: {
    width: '50%',
  },
  logisticsLabel: {
    fontSize: 11,
    color: '#7A7A7A',
    marginBottom: 2,
  },
  logisticsVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 12,
  },
  waitingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E65100',
  },
  completedBadgesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
  },
});
