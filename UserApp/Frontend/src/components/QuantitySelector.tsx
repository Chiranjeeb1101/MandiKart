import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}: Props) {
  const btnSize = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }]}
        onPress={onDecrease}
        disabled={quantity <= min}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, quantity <= min && styles.iconDisabled]}>−</Text>
      </TouchableOpacity>

      <Text style={[styles.quantity, { fontSize, minWidth: btnSize }]}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.btn, styles.btnActive, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }]}
        onPress={onIncrease}
        disabled={quantity >= max}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, styles.iconActive, quantity >= max && styles.iconDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  btnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  iconActive: {
    color: Colors.white,
  },
  iconDisabled: {
    opacity: 0.3,
  },
  quantity: {
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
