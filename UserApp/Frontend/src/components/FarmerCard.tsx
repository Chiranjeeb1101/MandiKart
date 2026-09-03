import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Shadows } from '../theme';
import { Farmer } from '../types';

interface Props {
  farmer: Farmer;
  onPress: () => void;
  onChat?: () => void;
}

export default function FarmerCard({ farmer, onPress, onChat }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.avatarContainer}>
        {farmer.avatar ? (
          <Image source={{ uri: farmer.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{farmer.name.charAt(0)}</Text>
          </View>
        )}
        {farmer.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{farmer.name}</Text>
        </View>
        <Text style={styles.location}>
          <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />
          {' '}{farmer.location}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="star" size={12} color={Colors.accent} />
            <Text style={styles.statText}>{farmer.rating}</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.statText}>{farmer.reviewCount} reviews</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.statText}>{farmer.totalProducts} products</Text>
        </View>
      </View>

      {onChat && (
        <TouchableOpacity style={styles.chatBtn} onPress={onChat} activeOpacity={0.8}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.gray100,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  location: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  dot: {
    color: Colors.textDisabled,
    fontSize: 11,
  },
  chatBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
