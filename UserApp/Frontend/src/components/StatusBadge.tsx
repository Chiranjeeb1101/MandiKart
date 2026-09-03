import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius } from '../theme';
import { OrderStatus } from '../types';
import { getStatusConfig } from '../constants/orderStatusLabels';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = getStatusConfig(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.badgeBg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      <Ionicons
        name={config.iconName as any}
        size={size === 'sm' ? 11 : 13}
        color={config.badgeText}
      />
      <Text style={[styles.text, { color: config.badgeText }, size === 'sm' && styles.textSm]}>
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
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10,
  },
});
