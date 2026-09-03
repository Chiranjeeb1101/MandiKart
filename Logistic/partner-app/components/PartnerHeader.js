import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';

export default function PartnerHeader({ title, subtitle, navigation, showBack = false, rightAction }) {
  const { isOnline, toggleOnline, notifications } = usePartner();
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Brand & Actions */}
      <View style={styles.topRow}>
        <View style={styles.leftBrand}>
          {showBack && navigation ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandIconContainer}>
              <MaterialCommunityIcons name="sprout" size={20} color={COLORS.onPrimary} />
            </View>
          )}

          <View>
            <Text style={styles.brandTitle}>{title || 'MandiKart Partner'}</Text>
            {subtitle && <Text style={styles.brandSubtitle}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.rightActions}>
          {/* Notifications button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation?.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.onSurface} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile avatar shortcut */}
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => {
              try {
                navigation?.navigate('MainTabs', { screen: 'Profile' });
              } catch (e) {
                navigation?.navigate('Profile');
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={16} color={COLORS.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Online / Offline Bar (Only on Home / main view) */}
      {!showBack && (
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.greetingText}>Good Morning, Rahul 👋</Text>
            <Text style={styles.greetingSubtext}>Ready for today's farm pickups?</Text>
          </View>

          <TouchableOpacity
            style={[styles.onlinePill, isOnline ? styles.onlinePillActive : styles.onlinePillOffline]}
            onPress={toggleOnline}
            activeOpacity={0.8}
          >
            <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={[styles.statusText, isOnline ? styles.statusTextOnline : styles.statusTextOffline]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surfaceCard,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  screenPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  screenPickerText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerLow,
  },
  greetingText: {
    fontSize: FONT.xl,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  greetingSubtext: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    gap: 6,
    borderWidth: 1,
  },
  onlinePillActive: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.primaryLight,
  },
  onlinePillOffline: {
    backgroundColor: COLORS.surfaceContainerHighest,
    borderColor: COLORS.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  dotOnline: {
    backgroundColor: COLORS.success,
  },
  dotOffline: {
    backgroundColor: COLORS.onSurfaceVariant,
  },
  statusText: {
    fontSize: FONT.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextOnline: {
    color: COLORS.success,
  },
  statusTextOffline: {
    color: COLORS.onSurfaceVariant,
  },
});
