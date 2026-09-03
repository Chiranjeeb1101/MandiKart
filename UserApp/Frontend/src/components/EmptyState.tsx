import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../theme';
import PrimaryButton from './PrimaryButton';

interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'empty' | 'error' | 'network';
}

export default function EmptyState({ icon, title, description, actionLabel, onAction, type = 'empty' }: Props) {
  const defaultIcons: Record<string, string> = {
    empty: 'file-tray-outline',
    error: 'alert-circle-outline',
    network: 'wifi-outline',
  };

  const iconName = (icon ?? defaultIcons[type]) as any;
  const iconColor = type === 'error' || type === 'network' ? Colors.error : Colors.textDisabled;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: type === 'empty' ? Colors.gray100 : Colors.errorLight }]}>
        <Ionicons name={iconName} size={40} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
          variant={type === 'error' || type === 'network' ? 'outline' : 'primary'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
  },
});
