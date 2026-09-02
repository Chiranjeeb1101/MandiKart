/**
 * MandiKart — MKStatusBadge Component
 * 
 * Semantic badges for Match %, Order Status, Produce Status, and Tags.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type BadgeType = 'match' | 'success' | 'warning' | 'info' | 'neutral' | 'urgent';

interface MKStatusBadgeProps {
  label: string;
  type?: BadgeType;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const MKStatusBadge: React.FC<MKStatusBadgeProps> = ({
  label,
  type = 'neutral',
  icon,
  size = 'md',
}) => {
  const getBadgeStyle = (): ViewStyle => {
    switch (type) {
      case 'match':
      case 'success':
        return {
          backgroundColor: '#E8F5E9',
          borderColor: '#C8E6C9',
        };
      case 'warning':
      case 'urgent':
        return {
          backgroundColor: '#FFF3E0',
          borderColor: '#FFE0B2',
        };
      case 'info':
        return {
          backgroundColor: '#E3F2FD',
          borderColor: '#BBDEFB',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: '#F5F5F0',
          borderColor: '#E8E8E0',
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (type) {
      case 'match':
      case 'success':
        return { color: '#1E5A2A' };
      case 'warning':
      case 'urgent':
        return { color: '#E65100' };
      case 'info':
        return { color: '#1565C0' };
      case 'neutral':
      default:
        return { color: '#5F6368' };
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getBadgeStyle(),
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text
        style={[
          styles.text,
          getTextStyle(),
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  iconWrapper: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textMd: {
    fontSize: 12,
  },
  textSm: {
    fontSize: 11,
  },
});
