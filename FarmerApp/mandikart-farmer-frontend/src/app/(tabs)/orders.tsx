/**
 * MandiKart Farmer App — Screen 11: My Orders (UI UX Pro Max Redesign)
 *
 * Full-fidelity orders management:
 * - Live Transit Radar Banner: Real-time driver ETA with 1-tap "Track Live Vehicle"
 * - Segmented Order Tabs: Active (2), Pending (1), Completed (2), All (5)
 * - Rich Order Cards: Thumbnail, buyer verification, rate/KG, net payout, logistics stepper
 * - Actionable CTAs on EVERY Card:
 *     1. "🚚 Track Vehicle" (Directly launches /orders/track-vehicle)
 *     2. "👁️ See Order Details" (Full-screen interactive invoice & weighbridge modal)
 * - Pending Buyer Negotiation CTAs: "Accept Offer", "Counter-Offer"
 * - Ultra-clean responsive layout with zero text collisions and premium earthy styling
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
  TextInput,
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
  ArrowRight,
  ChevronRight,
  PhoneCall,
  Eye,
  FileText,
  Download,
  X,
  MapPin,
  ShieldCheck,
  Flame,
  CreditCard,
  Navigation,
  Search,
} from 'lucide-react-native';
import { MKScreen, MKCard } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

const TOMATO_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const POTATO_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

const WHEAT_CROP_URI =
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80';

type OrderTab = 'All' | 'Active' | 'Pending' | 'Completed';

interface OrderItem {
  id: string;
  orderNumber: string;
  tab: 'Active' | 'Pending' | 'Completed';
  cropName: string;
  cropVariety: string;
  grade: string;
  quantity: string;
  cropImage: string;
  buyerName: string;
  buyerType: string;
  totalValue: string;
  ratePerKg: string;
  netPayout: string;
  transportDeduction: string;
  pickupDate: string;
  pickupTime: string;
  location: string;
  statusLabel: string;
  statusType: 'en_route' | 'scheduled' | 'pending' | 'completed';
  stepIndex: number; // 1 to 4
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  etaMins?: number;
  paymentMode?: string;
}

const ORDERS_DATA: OrderItem[] = [
  {
    id: 'ord_1',
    orderNumber: '#MK1024',
    tab: 'Active',
    cropName: 'Red Onion',
    cropVariety: 'Nashik Garwa Red',
    grade: 'Grade A',
    quantity: '1,000 KG',
    cropImage: ONION_CROP_URI,
    buyerName: 'ABC Foods & Retail Hub',
    buyerType: 'Verified Corporate Buyer',
    totalValue: '₹24,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹22,000',
    transportDeduction: '₹2,000',
    pickupDate: 'Today, 15 Sept 2026',
    pickupTime: '10:00 AM - 12:00 PM',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Vehicle En Route (6.2 km away)',
    statusType: 'en_route',
    stepIndex: 3,
    driverName: 'Ramesh Gurjar',
    driverPhone: '+91 98234 56789',
    vehicleNumber: 'MH 15 BX 4022',
    vehicleModel: 'Tata Ace Gold (1.5T)',
    etaMins: 22,
    paymentMode: 'IMPS Escrow Guaranteed',
  },
  {
    id: 'ord_2',
    orderNumber: '#MK1031',
    tab: 'Active',
    cropName: 'Hybrid Tomato',
    cropVariety: 'Semi-Ripe Fresh Harvest',
    grade: 'Grade A',
    quantity: '500 KG',
    cropImage: TOMATO_CROP_URI,
    buyerName: 'BigBasket Regional Sourcing',
    buyerType: 'Organized Retail Aggregator',
    totalValue: '₹11,500',
    ratePerKg: '₹23.00/kg',
    netPayout: '₹10,750',
    transportDeduction: '₹750',
    pickupDate: 'Tomorrow, 16 Sept 2026',
    pickupTime: '08:30 AM - 10:30 AM',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Pickup Slot Confirmed',
    statusType: 'scheduled',
    stepIndex: 2,
    driverName: 'Sunil Jadhav',
    driverPhone: '+91 94222 18904',
    vehicleNumber: 'MH 15 CT 8812',
    vehicleModel: 'Mahindra Bolero Maxi Truck',
    paymentMode: 'Direct UPI on Dispatch',
  },
  {
    id: 'ord_3',
    orderNumber: '#MK1018',
    tab: 'Pending',
    cropName: 'Jyoti Potato',
    cropVariety: 'Clean Washed Table Quality',
    grade: 'Grade A',
    quantity: '800 KG',
    cropImage: POTATO_CROP_URI,
    buyerName: 'Kalyan Agro Food Processors',
    buyerType: 'Food Processing Industry',
    totalValue: '₹18,000',
    ratePerKg: '₹22.50/kg',
    netPayout: '₹16,560',
    transportDeduction: '₹1,440',
    pickupDate: '17 Sept 2026 (Proposed)',
    pickupTime: 'Flexible Afternoon',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Buyer Offer Awaiting Farmer Action',
    statusType: 'pending',
    stepIndex: 1,
    paymentMode: '100% Advance in Escrow',
  },
  {
    id: 'ord_4',
    orderNumber: '#MK1008',
    tab: 'Completed',
    cropName: 'Sharbati Wheat',
    cropVariety: 'Golden Sharbati Grain',
    grade: 'Premium Grade',
    quantity: '2,000 KG',
    cropImage: WHEAT_CROP_URI,
    buyerName: 'ITC e-Choupal Sourcing',
    buyerType: 'FMCG Corporate Client',
    totalValue: '₹48,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹45,000',
    transportDeduction: '₹3,000',
    pickupDate: 'Delivered on 01 Sept 2026',
    pickupTime: 'Completed at 02:15 PM',
    location: 'Delivered to Lasalgaon Hub',
    statusLabel: 'Delivered • Payment Credited',
    statusType: 'completed',
    stepIndex: 4,
    paymentMode: 'Paid via IMPS Ref #TXN9021',
  },
  {
    id: 'ord_5',
    orderNumber: '#MK0994',
    tab: 'Completed',
    cropName: 'Red Onion',
    cropVariety: 'Early Kharif Red',
    grade: 'Grade A',
    quantity: '1,500 KG',
    cropImage: ONION_CROP_URI,
    buyerName: 'Reliance Fresh Mandi Hub',
    buyerType: 'Direct Retail Network',
    totalValue: '₹36,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹33,600',
    transportDeduction: '₹2,400',
    pickupDate: 'Delivered on 26 Aug 2026',
    pickupTime: 'Completed at 11:40 AM',
    location: 'Delivered to Nashik Hub',
    statusLabel: 'Delivered • Payment Settled',
    statusType: 'completed',
    stepIndex: 4,
    paymentMode: 'Paid via NEFT Ref #TXN8842',
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<OrderTab>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS_DATA);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItem | null>(null);

  const activeCount = orders.filter((o) => o.tab === 'Active').length;
  const pendingCount = orders.filter((o) => o.tab === 'Pending').length;
  const completedCount = orders.filter((o) => o.tab === 'Completed').length;

  const filteredOrders = orders.filter((o) => {
    if (selectedTab !== 'All' && o.tab !== selectedTab) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.cropName.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.statusLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleAcceptOffer(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              tab: 'Active',
              statusType: 'scheduled',
              statusLabel: 'Offer Accepted • Vehicle Scheduled',
              stepIndex: 2,
            }
          : o
      )
    );
    Alert.alert(
      'Offer Accepted! 🚛',
      'Order is now Active. A MandiKart transit vehicle will be dispatched to your farmgate.'
    );
  }

  function handleCounterOffer(order: OrderItem) {
    Alert.alert(
      'Submit Counter-Offer',
      `Current Buyer Offer: ${order.ratePerKg}\nEnter your desired rate for ${order.cropName}:`,
      [
        {
          text: 'Propose +₹2.00/kg',
          onPress: () => {
            Alert.alert('Counter Sent', 'Buyer notified of your proposed rate.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  return (
    <MKScreen scrollable contentContainerStyle={styles.screenScrollContent}>
      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>
            Track active dispatches, buyer bids & verified payouts
          </Text>
        </View>

        <View style={styles.headerRightButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.circleBtn,
              pressed && { transform: [{ scale: 0.9 }], opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/more/notifications')}
          >
            <Bell size={18} color="#1A1C1E" strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* ── 2. Order Quick Search Bar ── */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarInner}>
          <Search size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by crop, order ID or buyer..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
              <X size={16} color="#64748B" />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── 3. Summary Stat Strip (Clickable Filters) ── */}
      <View style={styles.summaryStrip}>
        <Pressable
          onPress={() => setSelectedTab('Active')}
          style={[
            styles.summaryBox,
            selectedTab === 'Active' && styles.summaryBoxActive,
          ]}
        >
          <Text style={[styles.summaryCount, { color: '#15803D' }]}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>ACTIVE</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('Pending')}
          style={[
            styles.summaryBox,
            selectedTab === 'Pending' && styles.summaryBoxActive,
          ]}
        >
          <Text style={[styles.summaryCount, { color: '#EA580C' }]}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>PENDING</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedTab('Completed')}
          style={[
            styles.summaryBox,
            selectedTab === 'Completed' && styles.summaryBoxActive,
          ]}
        >
          <Text style={[styles.summaryCount, { color: '#4B5563' }]}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>COMPLETED</Text>
        </Pressable>
      </View>

      {/* ── 4. Segmented Filter Tabs ── */}
      <View style={styles.filterTabsRow}>
        {(['All', 'Active', 'Pending', 'Completed'] as OrderTab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.filterPill,
              selectedTab === tab && styles.filterPillActive,
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

      {/* ── 5. Orders List ── */}
      <View style={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <Sprout size={36} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No {selectedTab} Orders</Text>
            <Text style={styles.emptyStateSub}>
              Sell your harvest today to receive corporate buyer bids and farmgate pickup.
            </Text>
            <Pressable
              style={styles.emptySellBtn}
              onPress={() => router.push('/(tabs)/sell')}
            >
              <Text style={styles.emptySellBtnText}>Sell Produce Now</Text>
            </Pressable>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <MKCard key={order.id} style={styles.orderCard}>
              {/* Order Card Header */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.orderBadgeRow}>
                  {order.tab === 'Active' && (
                    <View style={styles.badgeActive}>
                      <Truck size={12} color="#15803D" strokeWidth={2.4} />
                      <Text style={styles.badgeActiveText}>ACTIVE ORDER</Text>
                    </View>
                  )}
                  {order.tab === 'Pending' && (
                    <View style={styles.badgePending}>
                      <Clock size={12} color="#C2410C" strokeWidth={2.4} />
                      <Text style={styles.badgePendingText}>NEW BUYER OFFER</Text>
                    </View>
                  )}
                  {order.tab === 'Completed' && (
                    <View style={styles.badgeCompleted}>
                      <CheckCircle2 size={12} color="#4B5563" strokeWidth={2.4} />
                      <Text style={styles.badgeCompletedText}>DELIVERED</Text>
                    </View>
                  )}
                  <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
                </View>

                <View style={styles.orderValueWrap}>
                  <Text style={styles.orderValueAmount}>{order.totalValue}</Text>
                  <Text style={styles.orderValueSub}>Total Value</Text>
                </View>
              </View>

              {/* Inline Live Transit Badge for Active Dispatch */}
              {order.statusType === 'en_route' && (
                <View style={styles.inlineLiveTransitBanner}>
                  <View style={styles.inlineTransitLeft}>
                    <View style={styles.inlineRadarDot} />
                    <Truck size={14} color="#15803D" strokeWidth={2.4} />
                    <Text style={styles.inlineTransitText}>
                      Live Transit • Driver ETA {order.etaMins} mins
                    </Text>
                  </View>
                  <Text style={styles.inlineTransitSub}>
                    {order.vehicleModel} ({order.vehicleNumber})
                  </Text>
                </View>
              )}

              {/* Crop & Buyer Info */}
              <View style={styles.cropInfoRow}>
                <Image source={{ uri: order.cropImage }} style={styles.cropThumb} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={styles.cropNameTitle}>
                    {order.cropName} • {order.grade}
                  </Text>
                  <Text numberOfLines={1} style={styles.cropVarietySub}>
                    {order.quantity} • {order.ratePerKg}
                  </Text>
                  <View style={styles.buyerInlineRow}>
                    <Building2 size={12} color="#64748B" />
                    <Text numberOfLines={1} style={styles.buyerInlineName}>
                      {order.buyerName}
                    </Text>
                    <CheckCircle2 size={12} color="#15803D" fill="#DCFCE7" />
                  </View>
                </View>
              </View>

              {/* Timeline Status Stepper (For Active & Completed) */}
              {order.tab !== 'Pending' && (
                <View style={styles.stepperBox}>
                  <View style={styles.stepperHeader}>
                    <View
                      style={[
                        styles.stepperDot,
                        order.statusType === 'en_route'
                          ? styles.stepperDotOrange
                          : styles.stepperDotGreen,
                      ]}
                    />
                    <Text numberOfLines={1} style={styles.stepperHeaderText}>
                      {order.statusLabel}
                    </Text>
                  </View>

                  {/* 4 Step Horizontal Progress Bar */}
                  <View style={styles.progressBarWrap}>
                    <View style={[styles.progressTrack, { width: `${(order.stepIndex / 4) * 100}%` }]} />
                  </View>
                  <View style={styles.progressLabelsRow}>
                    <Text style={[styles.progressStepLabel, order.stepIndex >= 1 && styles.progressStepLabelActive]}>
                      Confirmed
                    </Text>
                    <Text style={[styles.progressStepLabel, order.stepIndex >= 2 && styles.progressStepLabelActive]}>
                      Pickup Set
                    </Text>
                    <Text style={[styles.progressStepLabel, order.stepIndex >= 3 && styles.progressStepLabelActive]}>
                      In Transit
                    </Text>
                    <Text style={[styles.progressStepLabel, order.stepIndex >= 4 && styles.progressStepLabelActive]}>
                      Delivered
                    </Text>
                  </View>

                  {/* Pickup Slot Brief */}
                  <View style={styles.pickupBriefRow}>
                    <Calendar size={13} color="#64748B" />
                    <Text numberOfLines={1} style={styles.pickupBriefText}>
                      {order.pickupDate} ({order.pickupTime})
                    </Text>
                  </View>
                </View>
              )}

              {/* Pending Request Details Banner */}
              {order.tab === 'Pending' && (
                <View style={styles.pendingNoticeBanner}>
                  <Flame size={14} color="#EA580C" />
                  <Text style={styles.pendingNoticeText}>
                    Buyer offered {order.ratePerKg} for immediate pickup. Estimated net payout: {order.netPayout}.
                  </Text>
                </View>
              )}

              {/* ── Action Buttons ── */}
              <View style={styles.cardActionsRow}>
                {order.tab === 'Active' && (
                  <>
                    <Pressable
                      style={({ pressed }) => [
                        styles.seeDetailsBtn,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() => setSelectedOrderDetails(order)}
                    >
                      <Eye size={14} color="#374151" />
                      <Text style={styles.seeDetailsBtnText}>See Orders</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.trackVehicleActionBtn,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
                      ]}
                      onPress={() => router.push('/orders/track-vehicle')}
                    >
                      <Truck size={14} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.trackVehicleActionText}>Track Order</Text>
                      <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.4} />
                    </Pressable>
                  </>
                )}

                {order.tab === 'Pending' && (
                  <>
                    <Pressable
                      style={({ pressed }) => [
                        styles.seeDetailsBtn,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() => setSelectedOrderDetails(order)}
                    >
                      <Eye size={14} color="#374151" />
                      <Text style={styles.seeDetailsBtnText}>Details</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.counterBtn,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() => handleCounterOffer(order)}
                    >
                      <Text style={styles.counterBtnText}>Counter</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.acceptBtn,
                        pressed && { opacity: 0.9 },
                      ]}
                      onPress={() => handleAcceptOffer(order.id)}
                    >
                      <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.acceptBtnText}>Accept Offer</Text>
                    </Pressable>
                  </>
                )}

                {order.tab === 'Completed' && (
                  <>
                    <Pressable
                      style={({ pressed }) => [
                        styles.seeDetailsBtn,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() => setSelectedOrderDetails(order)}
                    >
                      <Eye size={14} color="#374151" />
                      <Text style={styles.seeDetailsBtnText}>See Orders</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.invoiceBtn,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() =>
                        Alert.alert('Invoice Downloaded', 'Weighbridge settlement slip saved to device.')
                      }
                    >
                      <Download size={14} color="#15803D" />
                      <Text style={styles.invoiceBtnText}>Invoice & Receipt</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </MKCard>
          ))
        )}
      </View>

      {/* ════ Interactive "See Order Details" Full Modal ════ */}
      {selectedOrderDetails && (
        <Modal
          visible={Boolean(selectedOrderDetails)}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedOrderDetails(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {/* Modal Top Bar */}
              <View style={styles.modalTopBar}>
                <View>
                  <Text style={styles.modalOrderTitle}>
                    Order {selectedOrderDetails.orderNumber}
                  </Text>
                  <Text style={styles.modalOrderSub}>{selectedOrderDetails.statusLabel}</Text>
                </View>
                <Pressable
                  onPress={() => setSelectedOrderDetails(null)}
                  style={styles.modalCloseCircle}
                >
                  <X size={20} color="#4B5563" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Crop & Quantity Header Card */}
                <View style={styles.modalCropCard}>
                  <Image
                    source={{ uri: selectedOrderDetails.cropImage }}
                    style={styles.modalCropImg}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalCropName}>{selectedOrderDetails.cropName}</Text>
                    <Text style={styles.modalCropSub}>{selectedOrderDetails.cropVariety}</Text>
                    <View style={styles.modalQtyBadge}>
                      <Text style={styles.modalQtyText}>
                        {selectedOrderDetails.quantity} • {selectedOrderDetails.grade}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Financial Payout Breakdown */}
                <View style={styles.modalSectionCard}>
                  <Text style={styles.modalSectionHeading}>Financial Settlement Breakdown</Text>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Agreed Rate</Text>
                    <Text style={styles.modalRowVal}>{selectedOrderDetails.ratePerKg}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Gross Value</Text>
                    <Text style={styles.modalRowVal}>{selectedOrderDetails.totalValue}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalRowLabel}>Transit & Loading Fee</Text>
                    <Text style={[styles.modalRowVal, { color: '#DC2626' }]}>
                      - {selectedOrderDetails.transportDeduction}
                    </Text>
                  </View>
                  <View style={[styles.modalRow, styles.modalRowHighlight]}>
                    <Text style={styles.modalTotalLabel}>Net Farmer Payout</Text>
                    <Text style={styles.modalTotalVal}>{selectedOrderDetails.netPayout}</Text>
                  </View>
                  <View style={styles.paymentModeBox}>
                    <CreditCard size={14} color="#15803D" />
                    <Text style={styles.paymentModeText}>{selectedOrderDetails.paymentMode}</Text>
                  </View>
                </View>

                {/* Buyer & Verification Card */}
                <View style={styles.modalSectionCard}>
                  <Text style={styles.modalSectionHeading}>Buyer Information</Text>
                  <View style={styles.modalBuyerRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.modalBuyerName}>{selectedOrderDetails.buyerName}</Text>
                        <CheckCircle2 size={15} color="#15803D" fill="#DCFCE7" />
                      </View>
                      <Text style={styles.modalBuyerType}>{selectedOrderDetails.buyerType}</Text>
                    </View>
                    <Pressable
                      style={styles.modalCallBtn}
                      onPress={() =>
                        Alert.alert('Connecting Buyer', `Calling ${selectedOrderDetails.buyerName} representative...`)
                      }
                    >
                      <PhoneCall size={16} color="#15803D" />
                    </Pressable>
                  </View>
                </View>

                {/* Logistics & Driver Details (If Active) */}
                {selectedOrderDetails.driverName && (
                  <View style={styles.modalSectionCard}>
                    <Text style={styles.modalSectionHeading}>Assigned Vehicle & Driver</Text>
                    <View style={styles.driverBox}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.driverNameText}>{selectedOrderDetails.driverName}</Text>
                        <Text style={styles.driverVehicleText}>
                          {selectedOrderDetails.vehicleModel} • {selectedOrderDetails.vehicleNumber}
                        </Text>
                        <View style={styles.driverLocationRow}>
                          <MapPin size={13} color="#64748B" />
                          <Text style={styles.driverLocationText}>
                            {selectedOrderDetails.statusLabel}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        style={styles.driverCallBtn}
                        onPress={() =>
                          Alert.alert('Calling Driver', `Calling ${selectedOrderDetails.driverName} (${selectedOrderDetails.driverPhone})`)
                        }
                      >
                        <PhoneCall size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* Direct Track Button inside Modal */}
                {selectedOrderDetails.tab === 'Active' && (
                  <Pressable
                    style={styles.modalTrackActionBtn}
                    onPress={() => {
                      setSelectedOrderDetails(null);
                      router.push('/orders/track-vehicle');
                    }}
                  >
                    <Truck size={18} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.modalTrackActionBtnText}>Track Live Vehicle on Map</Text>
                    <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
                  </Pressable>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  headerTextCol: {
    flex: 1,
    marginRight: MKSpacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  screenScrollContent: {
    paddingHorizontal: 10,
    width: '100%',
  },

  /* ── Search Bar ── */
  searchBarWrapper: {
    marginBottom: 12,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
    marginRight: 4,
  },

  /* ── Inline Live Transit Banner inside Order Card ── */
  inlineLiveTransitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 10,
  },
  inlineTransitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  inlineRadarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  inlineTransitText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
  inlineTransitSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  /* ── Summary Strip ── */
  summaryStrip: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    minWidth: 0,
  },
  summaryBoxActive: {
    borderColor: '#15803D',
    backgroundColor: '#F0FDF4',
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
  },

  /* ── Filter Pills ── */
  filterTabsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#EFE8DC',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    fontWeight: '800',
    color: '#1A1C1E',
  },

  /* ── Orders List & Cards ── */
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeActiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  badgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgePendingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C2410C',
  },
  badgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeCompletedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4B5563',
  },
  orderNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  orderValueWrap: {
    alignItems: 'flex-end',
  },
  orderValueAmount: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#15803D',
  },
  orderValueSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  /* Crop & Buyer Info */
  cropInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cropThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cropNameTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  cropVarietySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  buyerInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  buyerInlineName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },

  /* Stepper Box */
  stepperBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  stepperDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepperDotOrange: {
    backgroundColor: '#EA580C',
  },
  stepperDotGreen: {
    backgroundColor: '#15803D',
  },
  stepperHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressTrack: {
    height: '100%',
    backgroundColor: '#15803D',
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressStepLabel: {
    fontSize: 9.5,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  progressStepLabelActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  pickupBriefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  pickupBriefText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },

  /* Pending Banner */
  pendingNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginBottom: 10,
  },
  pendingNoticeText: {
    fontSize: 11.5,
    color: '#C2410C',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },

  /* Card Actions Row */
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seeDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seeDetailsBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
  },
  trackVehicleActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#15803D',
    elevation: 2,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  trackVehicleActionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  counterBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  counterBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  acceptBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    elevation: 2,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  acceptBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  invoiceBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  invoiceBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },

  /* Empty State */
  emptyStateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E3DCCF',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  emptySellBtn: {
    marginTop: 8,
    backgroundColor: '#15803D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptySellBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12.5,
  },

  /* ════ Modal Styles ════ */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '85%',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 12,
  },
  modalOrderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  modalOrderSub: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
    marginTop: 1,
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalCropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  modalCropImg: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  modalCropName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  modalCropSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  modalQtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  modalQtyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  modalSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  modalSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalRowLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalRowVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalRowHighlight: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 4,
  },
  modalTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  modalTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803D',
  },
  paymentModeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  paymentModeText: {
    fontSize: 11.5,
    color: '#15803D',
    fontWeight: '700',
  },
  modalBuyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBuyerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalBuyerType: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
  },
  driverNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  driverVehicleText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  driverLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  driverLocationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EA580C',
  },
  driverCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTrackActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15803D',
    height: 46,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  modalTrackActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
