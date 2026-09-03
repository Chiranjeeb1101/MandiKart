import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';

type NotifCategory = 'ALL' | 'ORDERS' | 'OFFERS' | 'FARM_ALERTS';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  color: string;
  unread: boolean;
  category: NotifCategory;
  orderId?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Order Dispatched & On The Way! 🚚',
    desc: 'Driver Suresh Patil is 1.8 km away in an EV van (Temp: 4°C). ETA 25 mins.',
    time: '10 mins ago',
    icon: 'car-sport-outline',
    color: Colors.primary,
    unread: true,
    category: 'ORDERS',
    orderId: 'MK-2024-001234',
  },
  {
    id: 'n-2',
    title: '🌾 Rajan Kumar Harvested Fresh Mint!',
    desc: 'Farmer Rajan Kumar just listed fresh organic mint from Nashik. Order before stock runs out!',
    time: '2 hours ago',
    icon: 'leaf-outline',
    color: '#22C55E',
    unread: true,
    category: 'FARM_ALERTS',
  },
  {
    id: 'n-3',
    title: '🏷️ 20% OFF Summer Mango Festival',
    desc: 'Use promo code MANGO20 on Alphonso & Kesar Mangoes today. Free shipping above ₹399.',
    time: '5 hours ago',
    icon: 'pricetag-outline',
    color: '#F59E0B',
    unread: false,
    category: 'OFFERS',
  },
  {
    id: 'n-4',
    title: 'Refund Processed Successfully 💸',
    desc: 'Refund of ₹150 for cancelled item in Order #MK-984 has been credited to your UPI account.',
    time: 'Yesterday',
    icon: 'checkmark-circle-outline',
    color: '#3B82F6',
    unread: false,
    category: 'ORDERS',
  },
  {
    id: 'n-5',
    title: 'Price Drop Alert! 📉',
    desc: 'Red Onions price dropped from ₹35/kg to ₹28/kg direct from Nashik Mandi.',
    time: '2 days ago',
    icon: 'trending-down-outline',
    color: '#8B5CF6',
    unread: false,
    category: 'OFFERS',
  },
];

export default function NotificationScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotifCategory>('ALL');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    Alert.alert('Clear Notifications', 'Are you sure you want to clear all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'ALL') return true;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadgeHeader}>
              <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.actionBtn}>
            <Ionicons name="checkmark-done-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={clearAll} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'ORDERS', label: 'Orders 📦' },
            { key: 'OFFERS', label: 'Offers 🏷️' },
            { key: 'FARM_ALERTS', label: 'Farm Alerts 🌾' },
          ].map((chip) => {
            const active = activeFilter === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(chip.key as NotifCategory)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={56} color={Colors.textDisabled} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You're all caught up!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.unread && styles.cardUnread]}
            activeOpacity={0.85}
            onPress={() => {
              // Mark item read
              setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
              );

              // Navigate if order
              if (item.category === 'ORDERS') {
                navigation.navigate('OrderTracking', { orderId: item.orderId || 'MK-2024-001234' });
              }
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>

            <View style={styles.info}>
              <View style={styles.topRow}>
                <Text style={styles.notiTitle} numberOfLines={1}>{item.title}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.notiDesc}>{item.desc}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  headerTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  unreadBadgeHeader: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(35,134,54,0.2)',
  },
  unreadBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
  actionBtn: { padding: 4 },
  // Filter
  filterWrap: { paddingVertical: Spacing.sm },
  chipRow: { paddingHorizontal: Spacing.md, gap: 6 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  // List
  list: { padding: Spacing.md, gap: Spacing.sm },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  cardUnread: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '30',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notiTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notiDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginTop: 2, marginBottom: 6 },
  time: { fontSize: 11, color: Colors.textDisabled, fontWeight: '500' },
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
