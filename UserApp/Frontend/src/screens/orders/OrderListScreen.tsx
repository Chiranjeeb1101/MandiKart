import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Image, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import StatusBadge from '../../components/StatusBadge';
import { SAMPLE_PRODUCTS } from '../../services/mockData';

type FilterTab = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED';

const INITIAL_ORDERS = [
  {
    id: 'MK-2024-001234',
    date: '3 Sep 2026, 02:30 PM',
    status: 'DISPATCHED',
    total: 395,
    itemsCount: 3,
    itemsPreview: [SAMPLE_PRODUCTS[0], SAMPLE_PRODUCTS[2], SAMPLE_PRODUCTS[7]],
    deliveryAddress: 'Flat 402, Shivajinagar, Pune - 411005',
    farmerName: 'Rajan Kumar',
    estimatedDelivery: 'Today by 5:30 PM',
  },
  {
    id: 'MK-2024-001198',
    date: '28 Aug 2026, 11:15 AM',
    status: 'DELIVERED',
    total: 580,
    itemsCount: 4,
    itemsPreview: [SAMPLE_PRODUCTS[1], SAMPLE_PRODUCTS[3], SAMPLE_PRODUCTS[4]],
    deliveryAddress: 'Flat 402, Shivajinagar, Pune - 411005',
    farmerName: 'Priya Devi',
    deliveredDate: '28 Aug 2026, 12:45 PM',
  },
  {
    id: 'MK-2024-001052',
    date: '15 Aug 2026, 09:00 AM',
    status: 'DELIVERED',
    total: 220,
    itemsCount: 2,
    itemsPreview: [SAMPLE_PRODUCTS[5], SAMPLE_PRODUCTS[6]],
    deliveryAddress: 'Flat 402, Shivajinagar, Pune - 411005',
    farmerName: 'Rajan Kumar',
    deliveredDate: '15 Aug 2026, 10:30 AM',
  },
  {
    id: 'MK-2024-000984',
    date: '02 Aug 2026, 04:20 PM',
    status: 'CANCELLED',
    total: 150,
    itemsCount: 1,
    itemsPreview: [SAMPLE_PRODUCTS[8]],
    deliveryAddress: 'Flat 402, Shivajinagar, Pune - 411005',
    farmerName: 'Priya Devi',
    cancelledReason: 'Out of stock at farm',
  },
];

export default function OrderListScreen({ navigation }: any) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const cancelOrderById = (orderId: string) => {
    Alert.alert(
      'Cancel Order 🚫',
      `Are you sure you want to cancel order #${orderId}? Full refund will be initiated to your original payment method.`,
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: () => {
            setOrders((prev) =>
              prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
            );
            Alert.alert('Order Cancelled', `Order #${orderId} has been cancelled.`);
          },
        },
      ]
    );
  };

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'ACTIVE' && !(order.status === 'DISPATCHED' || order.status === 'PROCESSING' || order.status === 'CONFIRMED')) return false;
    if (activeTab === 'DELIVERED' && order.status !== 'DELIVERED') return false;
    if (activeTab === 'CANCELLED' && order.status !== 'CANCELLED') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchFarmer = order.farmerName.toLowerCase().includes(q);
      const matchItem = order.itemsPreview.some((p) => p.name.toLowerCase().includes(q));
      return matchId || matchFarmer || matchItem;
    }

    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} total orders placed</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order ID, farmer, or item..."
            placeholderTextColor={Colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as FilterTab[]).map((tab) => {
            const active = activeTab === tab;
            const count = orders.filter((o) => {
              if (tab === 'ALL') return true;
              if (tab === 'ACTIVE') return o.status === 'DISPATCHED' || o.status === 'PROCESSING' || o.status === 'CONFIRMED';
              return o.status === tab;
            }).length;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabChip, active && styles.activeTabChip]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, active && styles.activeTabText]}>
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textDisabled} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySub}>You don't have any orders under this filter.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isActive = item.status === 'DISPATCHED' || item.status === 'PROCESSING' || item.status === 'CONFIRMED';
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('OrderDetails', {
                  orderId: item.id,
                  order: item,
                  onCancel: () => setOrders((prev) => prev.map((o) => o.id === item.id ? { ...o, status: 'CANCELLED' } : o)),
                })
              }
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <StatusBadge status={item.status as any} size="sm" />
              </View>

              {/* Product Images Preview */}
              <View style={styles.previewRow}>
                <View style={styles.imagesWrap}>
                  {item.itemsPreview.map((p, i) => (
                    <Image key={`${p.id}-${i}`} source={{ uri: p.imageUrl }} style={styles.previewThumb} />
                  ))}
                </View>

                <View style={styles.previewInfo}>
                  <Text style={styles.farmerName}>🌾 {item.farmerName}</Text>
                  <Text style={styles.itemsSummary}>
                    {item.itemsPreview.map((p) => p.name).join(', ')}
                  </Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total ({item.itemsCount} items)</Text>
                  <Text style={styles.totalPrice}>₹{item.total}</Text>
                </View>

                <View style={styles.actionBtns}>
                  {isActive && (
                    <>
                      <TouchableOpacity
                        style={styles.cancelCardBtn}
                        onPress={() => cancelOrderById(item.id)}
                      >
                        <Text style={styles.cancelCardText}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.trackBtn}
                        onPress={() => navigation.navigate('OrderTracking', { orderId: item.id, order: item })}
                      >
                        <Ionicons name="location" size={13} color={Colors.white} />
                        <Text style={styles.trackBtnText}>Track</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() =>
                      navigation.navigate('OrderDetails', {
                        orderId: item.id,
                        order: item,
                        onCancel: () => setOrders((prev) => prev.map((o) => o.id === item.id ? { ...o, status: 'CANCELLED' } : o)),
                      })
                    }
                  >
                    <Text style={styles.detailsBtnText}>Details</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: -4 },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  // Filter Tabs
  tabRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activeTabChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  activeTabText: { color: Colors.white },
  // List
  list: { padding: Spacing.md, paddingTop: 0, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  orderId: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  orderDate: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  // Preview
  previewRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  imagesWrap: { flexDirection: 'row', gap: 4 },
  previewThumb: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
  },
  previewInfo: { flex: 1, gap: 2 },
  farmerName: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  itemsSummary: { fontSize: 12, color: Colors.textSecondary },
  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalLabel: { fontSize: 10, color: Colors.textSecondary },
  totalPrice: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  actionBtns: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  cancelCardBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  cancelCardText: { fontSize: 11, fontWeight: '700', color: Colors.error },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  trackBtnText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  detailsBtnText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  // Empty
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 12, color: Colors.textSecondary },
});
