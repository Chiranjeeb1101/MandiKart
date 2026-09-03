import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../theme';
import { OrderStatus } from '../types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  PENDING: { label: 'Pending', color: Colors.warning, bg: Colors.warningLight, icon: 'time-outline' },
  CONFIRMED: { label: 'Confirmed', color: Colors.info, bg: Colors.infoLight, icon: 'checkmark-circle-outline' },
  PROCESSING: { label: 'Processing', color: Colors.info, bg: Colors.infoLight, icon: 'refresh-outline' },
  DISPATCHED: { label: 'Dispatched', color: Colors.primary, bg: Colors.primaryLight, icon: 'bicycle-outline' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: Colors.primary, bg: Colors.primaryLight, icon: 'car-outline' },
  DELIVERED: { label: 'Delivered', color: Colors.success, bg: Colors.successLight, icon: 'checkmark-done-circle-outline' },
  CANCELLED: { label: 'Cancelled', color: Colors.error, bg: Colors.errorLight, icon: 'close-circle-outline' },
  RETURNED: { label: 'Returned', color: Colors.warning, bg: Colors.warningLight, icon: 'return-up-back-outline' },
};

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      <Ionicons name={config.icon as any} size={size === 'sm' ? 11 : 13} color={config.color} />
      <Text style={[styles.text, { color: config.color }, size === 'sm' && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
  },
});
