/**
 * MandiKart — My Orders Screen (Tracking & Management)
 *
 * Rebuilt to match Stitch Screen Specs (AgroPremium Tactile)
 * - Interactive summary strip & filter pills
 * - Live logistics stepper (Confirmed -> Scheduled -> In Transit -> Delivered)
 * - Functional action buttons: Track Vehicle Live modal, Invoice modal, Contact Buyer, Modify Offer, & Cancel Request logic
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  X,
  Phone,
  FileText,
  Navigation,
  RefreshCw,
} from 'lucide-react-native';
import { MKLayout } from '@/constants/layout';

// ─── Design Tokens (AgroPremium Tactile) ───────────────────────────────────
const C = {
  background: '#fff8f5',
  surface: '#FFFFFF',
  primary: '#964900',
  primaryContainer: '#ef7d1a',
  onPrimary: '#FFFFFF',
  secondary: '#1b6d24',
  onSecondary: '#FFFFFF',
  onSurface: '#241913',
  onSurfaceVariant: '#564336',
  outlineVariant: '#ddc1b0',
  dataMatch: '#E8F5E9',
  onSecondaryContainer: '#217128',
  statusWaiting: '#F39C12',
  surfaceVariant: '#f3ded3',
  surfaceContainerLow: '#fff1ea',
  statusPending: '#D9531E',
};

const SOFT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 4,
};

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA';

const TOMATO_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

type OrderTab = 'All' | 'Active' | 'Pending' | 'Completed';

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<OrderTab>('All');

  const topPadding = MKLayout.getTopHeaderPadding(insets);
  const bottomPadding = MKLayout.getBottomTabClearance(insets);

  // Modals state
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  // Orders state logic
  const [orders, setOrders] = useState([
    {
      id: 'MK1024',
      type: 'Active',
      buyer: 'Maharashtra Agro Buyers Ltd.',
      crop: 'Nashik Red Onion',
      grade: 'Grade A',
      quantity: '1,000 KG',
      value: '₹24,000',
      rate: '₹24.00 /kg',
      date: '15 Sept 2026',
      time: '10:00 AM - 12:00 PM',
      location: 'Pimple Gaon Mandi, Nashik',
      driver: 'Suresh Patil',
      driverPhone: '+91 98220 12345',
      vehicleNo: 'MH-15-EG-4921',
      step: 2, // 1: Confirmed, 2: Scheduled, 3: In Transit, 4: Delivered
    },
    {
      id: 'MK1029',
      type: 'Pending',
      buyer: 'Agri Connect Wholesale Hub',
      crop: 'Red Tomatoes',
      grade: 'Grade A (Hybrid)',
      quantity: '800 KG',
      value: '₹27,200',
      rate: '₹34.00 /kg',
      date: '16 Sept 2026',
      location: 'Market Yard, Pune',
      status: 'Waiting for Buyer Response',
    },
    {
      id: 'MK1008',
      type: 'Completed',
      buyer: 'Panchavati Supermarket',
      crop: 'Sharbati Wheat',
      grade: 'Grade A',
      quantity: '500 KG',
      value: '₹11,250',
      rate: '₹22.50 /kg',
      date: '02 Sept 2026',
      paymentStatus: 'Paid via Bank Transfer',
    },
  ]);

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === 'All') return true;
    return o.type === selectedTab;
  });

  const activeCount = orders.filter((o) => o.type === 'Active').length;
  const pendingCount = orders.filter((o) => o.type === 'Pending').length;
  const completedCount = orders.filter((o) => o.type === 'Completed').length;

  function handleCancelPendingOrder(id: string) {
    Alert.alert('Cancel Request', 'Are you sure you want to cancel this pending sell offer?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          setOrders((prev) => prev.filter((o) => o.id !== id));
          Alert.alert('Cancelled', `Order #${id} has been cancelled.`);
        },
      },
    ]);
  }

  function handleCallDriver(phone: string, name: string) {
    Alert.alert('Calling Driver', `Dialing ${name} at ${phone}...`);
  }

  return (
    <View style={styles.root}>
      {/* Background Blobs with pointerEvents="none" */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.blobOrange} />
        <View style={styles.blobGreen} />
        <View style={styles.blobFade} />
      </View>

      {/* ── Top Header ── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track sales, pickup schedules & payouts</Text>
        </View>

        <View style={styles.headerRightButtons}>
          <Pressable
            style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.9 }] }]}
            onPress={() => router.push('/more/notifications')}
          >
            <Bell size={18} color={C.onSurfaceVariant} strokeWidth={2} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.9 }] }]}
            onPress={() => Alert.alert('Order Filters', 'Filter options applied.')}
          >
            <SlidersHorizontal size={18} color={C.onSurfaceVariant} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 3-Column Summary Strip ── */}
        <View style={styles.summaryStrip}>
          <Pressable
            style={[styles.summaryBox, selectedTab === 'Active' && styles.summaryBoxActive]}
            onPress={() => setSelectedTab('Active')}
          >
            <Text style={[styles.summaryCount, { color: C.secondary }]}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>ACTIVE</Text>
          </Pressable>

          <Pressable
            style={[styles.summaryBox, selectedTab === 'Pending' && styles.summaryBoxActive]}
            onPress={() => setSelectedTab('Pending')}
          >
            <Text style={[styles.summaryCount, { color: C.statusPending }]}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>PENDING</Text>
          </Pressable>

          <Pressable
            style={[styles.summaryBox, selectedTab === 'Completed' && styles.summaryBoxActive]}
            onPress={() => setSelectedTab('Completed')}
          >
            <Text style={[styles.summaryCount, { color: '#564336' }]}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>COMPLETED</Text>
          </Pressable>
        </View>

        {/* ── Filter Tabs ── */}
        <View style={styles.filterTabsRow}>
          {(['All', 'Active', 'Pending', 'Completed'] as OrderTab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.filterPill, selectedTab === tab && styles.filterPillActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.filterPillText, selectedTab === tab && styles.filterPillTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Orders Stack ── */}
        <View style={styles.ordersStack}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Sprout size={36} color={C.outlineVariant} />
              <Text style={styles.emptyText}>No orders under "{selectedTab}"</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                {/* Active Order Card */}
                {order.type === 'Active' && (
                  <>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.activeBadgePill}>
                        <Truck size={13} color={C.secondary} style={{ marginRight: 4 }} />
                        <Text style={styles.activeBadgeText}>ACTIVE ORDER</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.orderValueAmount}>{order.value}</Text>
                        <Text style={styles.orderValueLabel}>Order Value</Text>
                      </View>
                    </View>

                    <Text style={styles.orderNumber}>Order #{order.id}</Text>
                    <View style={styles.buyerRow}>
                      <Text style={styles.buyerName}>{order.buyer}</Text>
                      <CheckCircle2 size={14} color={C.secondary} fill={C.dataMatch} style={{ marginLeft: 4 }} />
                    </View>

                    {/* Crop details */}
                    <View style={styles.itemBox}>
                      <Image source={{ uri: ONION_CROP_URI }} style={styles.cropThumb} />
                      <View style={styles.itemTextCol}>
                        <Text style={styles.itemTitle}>{order.crop}</Text>
                        <Text style={styles.itemSubtext}>
                          {order.quantity} • {order.grade} @ {order.rate}
                        </Text>
                      </View>
                    </View>

                    {/* Timeline Stepper */}
                    <View style={styles.stepperContainer}>
                      <View style={styles.stepperHeader}>
                        <View style={styles.liveDot} />
                        <Text style={styles.stepperHeaderTitle}>
                          Pickup Scheduled ({order.date}, 10:00 AM)
                        </Text>
                      </View>

                      {/* 4 Step Timeline */}
                      <View style={styles.stepRow}>
                        <View style={styles.stepCircleDone}>
                          <Check size={11} color="#FFF" strokeWidth={3} />
                        </View>
                        <Text style={styles.stepTextDone}>Order Confirmed</Text>
                      </View>
                      <View style={styles.stepRow}>
                        <View style={styles.stepCircleCurrent}>
                          <View style={styles.innerDot} />
                        </View>
                        <Text style={styles.stepTextCurrent}>Pickup Scheduled Today</Text>
                      </View>
                      <View style={styles.stepRow}>
                        <View style={styles.stepCirclePending} />
                        <Text style={styles.stepTextPending}>In Transit</Text>
                      </View>
                      <View style={styles.stepRow}>
                        <View style={styles.stepCirclePending} />
                        <Text style={styles.stepTextPending}>Delivered & Paid</Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsRow}>
                      <Pressable style={styles.trackBtn} onPress={() => setTrackModalVisible(true)}>
                        <Navigation size={14} color={C.onSecondary} style={{ marginRight: 6 }} />
                        <Text style={styles.trackBtnText}>Track Vehicle Live</Text>
                      </Pressable>

                      <Pressable style={styles.invoiceBtn} onPress={() => setInvoiceModalVisible(true)}>
                        <FileText size={14} color={C.secondary} style={{ marginRight: 4 }} />
                        <Text style={styles.invoiceBtnText}>Invoice</Text>
                      </Pressable>
                    </View>
                  </>
                )}

                {/* Pending Request Card */}
                {order.type === 'Pending' && (
                  <>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.pendingBadgePill}>
                        <Clock size={12} color={C.statusPending} style={{ marginRight: 4 }} />
                        <Text style={styles.pendingBadgeText}>PENDING OFFER</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.orderValueAmount}>{order.value}</Text>
                        <Text style={styles.orderValueLabel}>Proposed Price</Text>
                      </View>
                    </View>

                    <Text style={styles.buyerNameLarge}>{order.buyer}</Text>
                    <Text style={styles.itemTitle}>
                      {order.crop} • {order.quantity}
                    </Text>

                    <View style={styles.waitingBanner}>
                      <Clock size={14} color={C.statusPending} style={{ marginRight: 6 }} />
                      <Text style={styles.waitingBannerText}>{order.status}</Text>
                    </View>

                    <View style={styles.actionButtonsRow}>
                      <Pressable
                        style={styles.cancelOfferBtn}
                        onPress={() => handleCancelPendingOrder(order.id)}
                      >
                        <Text style={styles.cancelOfferBtnText}>Cancel Request</Text>
                      </Pressable>
                      <Pressable
                        style={styles.modifyOfferBtn}
                        onPress={() => router.push('/(tabs)/sell')}
                      >
                        <Text style={styles.modifyOfferBtnText}>Modify Offer</Text>
                      </Pressable>
                    </View>
                  </>
                )}

                {/* Completed Order Card */}
                {order.type === 'Completed' && (
                  <>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.orderNumber}>Order #{order.id}</Text>
                      <View style={styles.completedBadgePill}>
                        <Text style={styles.completedBadgeText}>COMPLETED</Text>
                      </View>
                    </View>

                    <Text style={styles.buyerName}>{order.buyer}</Text>
                    <Text style={styles.itemTitle}>
                      {order.crop} • {order.quantity} ({order.value})
                    </Text>
                    <Text style={styles.paidNotice}>✅ {order.paymentStatus}</Text>

                    <View style={[styles.actionButtonsRow, { marginTop: 12 }]}>
                      <Pressable
                        style={styles.relistBtn}
                        onPress={() => router.push('/(tabs)/sell')}
                      >
                        <RefreshCw size={14} color={C.secondary} style={{ marginRight: 6 }} />
                        <Text style={styles.relistBtnText}>Re-list Produce</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Live Vehicle Tracking Modal ── */}
      <Modal visible={trackModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Navigation size={20} color={C.secondary} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Live Vehicle Location</Text>
              </View>
              <Pressable onPress={() => setTrackModalVisible(false)}>
                <X size={20} color={C.onSurfaceVariant} />
              </Pressable>
            </View>

            <View style={styles.mapSimulationBox}>
              <Text style={styles.mapSimText}>🗺️ GPS Tracking Active</Text>
              <Text style={styles.mapSimSub}>Truck #MH-15-EG-4921 is 8.4 km away</Text>
            </View>

            <View style={styles.driverInfoCard}>
              <Text style={styles.driverLabel}>Assigned Driver</Text>
              <Text style={styles.driverName}>Suresh Patil</Text>
              <Pressable
                style={styles.callDriverBtn}
                onPress={() => handleCallDriver('+91 98220 12345', 'Suresh Patil')}
              >
                <Phone size={14} color={C.onSecondary} style={{ marginRight: 6 }} />
                <Text style={styles.callDriverBtnText}>Call Driver (+91 98220 12345)</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Invoice Details Modal ── */}
      <Modal visible={invoiceModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice #MK1024</Text>
              <Pressable onPress={() => setInvoiceModalVisible(false)}>
                <X size={20} color={C.onSurfaceVariant} />
              </Pressable>
            </View>
            <View style={{ gap: 10 }}>
              <View style={styles.invoiceLine}>
                <Text style={styles.invoiceLeft}>Crop Quantity</Text>
                <Text style={styles.invoiceRight}>1,000 KG (Onion)</Text>
              </View>
              <View style={styles.invoiceLine}>
                <Text style={styles.invoiceLeft}>Agreed Rate</Text>
                <Text style={styles.invoiceRight}>₹24.00 /kg</Text>
              </View>
              <View style={styles.invoiceLine}>
                <Text style={styles.invoiceLeft}>Transport Deduction</Text>
                <Text style={styles.invoiceRight}>- ₹2,000</Text>
              </View>
              <View style={[styles.invoiceLine, { borderTopWidth: 1, borderTopColor: C.outlineVariant, paddingTop: 8 }]}>
                <Text style={[styles.invoiceLeft, { fontWeight: '700' }]}>Estimated Net Total</Text>
                <Text style={[styles.invoiceRight, { color: C.secondary, fontSize: 16 }]}>₹22,000</Text>
              </View>

              <Pressable
                style={styles.downloadInvoiceBtn}
                onPress={() => {
                  setInvoiceModalVisible(false);
                  Alert.alert('Invoice Saved', 'Invoice PDF saved to downloads.');
                }}
              >
                <Text style={styles.downloadInvoiceBtnText}>Download PDF Invoice</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  blobOrange: { position: 'absolute', top: -60, left: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(239,125,26,0.12)' },
  blobGreen: { position: 'absolute', bottom: 60, right: -80, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(165,214,167,0.2)' },
  blobFade: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(249,251,249,0.84)' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTextCol: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.primary, letterSpacing: -0.4, flexShrink: 1 },
  headerSubtitle: { fontSize: 12, color: C.onSurfaceVariant, marginTop: 2, flexShrink: 1 },
  headerRightButtons: { flexDirection: 'row', gap: 8, flexShrink: 0, marginLeft: 8 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.outlineVariant, ...SOFT_SHADOW },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  summaryStrip: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryBox: { flex: 1, minWidth: 0, backgroundColor: C.surface, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 4, alignItems: 'center', borderWidth: 1.5, borderColor: C.outlineVariant, ...SOFT_SHADOW },
  summaryBoxActive: { borderColor: C.secondary, backgroundColor: C.dataMatch },
  summaryCount: { fontSize: 22, fontWeight: '800', marginBottom: 2, textAlign: 'center', flexShrink: 1 },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 0.8, textAlign: 'center' },

  filterTabsRow: { flexDirection: 'row', backgroundColor: C.surfaceVariant, borderRadius: 24, padding: 4, marginBottom: 16 },
  filterPill: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  filterPillActive: { backgroundColor: C.surface, ...SOFT_SHADOW },
  filterPillText: { fontSize: 12, fontWeight: '600', color: C.onSurfaceVariant },
  filterPillTextActive: { color: C.secondary, fontWeight: '800' },

  ordersStack: { gap: 14 },
  emptyCard: { padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontWeight: '600', color: C.onSurfaceVariant, marginTop: 8 },

  orderCard: { backgroundColor: C.surface, borderRadius: 20, padding: 16, ...SOFT_SHADOW },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  activeBadgePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.dataMatch, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexShrink: 0 },
  activeBadgeText: { fontSize: 10, fontWeight: '800', color: C.secondary, letterSpacing: 0.5 },
  orderValueAmount: { fontSize: 20, fontWeight: '800', color: C.onSurface },
  orderValueLabel: { fontSize: 11, color: C.onSurfaceVariant },

  orderNumber: { fontSize: 17, fontWeight: '800', color: C.onSurface },
  buyerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 12 },
  buyerName: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, flexShrink: 1 },

  itemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceContainerLow, borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(221,193,176,0.3)' },
  cropThumb: { width: 44, height: 44, borderRadius: 8, marginRight: 12, flexShrink: 0 },
  itemTextCol: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: C.onSurface, flexShrink: 1 },
  itemSubtext: { fontSize: 12, color: C.onSurfaceVariant, marginTop: 2, flexShrink: 1 },

  stepperContainer: { backgroundColor: C.background, borderRadius: 12, padding: 12, marginBottom: 14 },
  stepperHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.secondary, marginRight: 6 },
  stepperHeaderTitle: { fontSize: 12, fontWeight: '700', color: C.secondary },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  stepCircleDone: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  stepCircleCurrent: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: C.primary, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  innerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  stepCirclePending: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: C.outlineVariant, marginRight: 10 },
  stepTextDone: { fontSize: 13, fontWeight: '600', color: C.onSurface },
  stepTextCurrent: { fontSize: 13, fontWeight: '700', color: C.primary },
  stepTextPending: { fontSize: 13, color: C.onSurfaceVariant },

  actionButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  trackBtn: { flex: 1, backgroundColor: C.secondary, borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  trackBtnText: { fontSize: 13, fontWeight: '700', color: C.onSecondary },
  invoiceBtn: { backgroundColor: C.dataMatch, borderWidth: 1, borderColor: C.secondary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  invoiceBtnText: { fontSize: 13, fontWeight: '700', color: C.secondary },

  // Pending
  pendingBadgePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pendingBadgeText: { fontSize: 10, fontWeight: '800', color: C.statusPending, letterSpacing: 0.5 },
  buyerNameLarge: { fontSize: 16, fontWeight: '800', color: C.onSurface, marginBottom: 4 },
  waitingBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', padding: 10, borderRadius: 10, marginVertical: 10 },
  waitingBannerText: { fontSize: 12, fontWeight: '700', color: C.statusPending },
  cancelOfferBtn: { flex: 1, backgroundColor: C.surfaceVariant, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancelOfferBtnText: { fontSize: 13, fontWeight: '700', color: C.onSurfaceVariant },
  modifyOfferBtn: { flex: 1, backgroundColor: C.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modifyOfferBtnText: { fontSize: 13, fontWeight: '700', color: C.onPrimary },

  // Completed
  completedBadgePill: { backgroundColor: C.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  completedBadgeText: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant },
  paidNotice: { fontSize: 13, fontWeight: '600', color: C.secondary, marginTop: 4 },
  relistBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.dataMatch, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  relistBtnText: { fontSize: 13, fontWeight: '700', color: C.secondary },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: C.surface, borderRadius: 20, padding: 20, ...SOFT_SHADOW },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface },
  mapSimulationBox: { height: 120, backgroundColor: C.dataMatch, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  mapSimText: { fontSize: 16, fontWeight: '700', color: C.secondary },
  mapSimSub: { fontSize: 12, color: C.onSecondaryContainer, marginTop: 4 },
  driverInfoCard: { backgroundColor: C.background, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.outlineVariant },
  driverLabel: { fontSize: 11, color: C.onSurfaceVariant },
  driverName: { fontSize: 15, fontWeight: '700', color: C.onSurface, marginBottom: 10 },
  callDriverBtn: { backgroundColor: C.secondary, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  callDriverBtnText: { fontSize: 13, fontWeight: '700', color: C.onSecondary },

  invoiceLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  invoiceLeft: { fontSize: 13, color: C.onSurfaceVariant },
  invoiceRight: { fontSize: 13, fontWeight: '700', color: C.onSurface },
  downloadInvoiceBtn: { backgroundColor: C.secondary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  downloadInvoiceBtnText: { fontSize: 14, fontWeight: '700', color: C.onSecondary },
});
