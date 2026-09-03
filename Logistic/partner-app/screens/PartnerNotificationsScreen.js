import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';
import PartnerHeader from '../components/PartnerHeader';

export default function PartnerNotificationsScreen({ navigation }) {
  const { notifications, markAllNotificationsRead } = usePartner();

  const getIconForType = (type) => {
    switch (type) {
      case 'WARNING':
        return { name: 'cloud-outline', color: COLORS.warning, bg: COLORS.warningLight };
      case 'PROMO':
        return { name: 'flash-outline', color: COLORS.accentDark, bg: COLORS.accentLight };
      case 'SUCCESS':
        return { name: 'checkmark-circle-outline', color: COLORS.success, bg: COLORS.successLight };
      default:
        return { name: 'notifications-outline', color: COLORS.primary, bg: COLORS.primaryBg };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Notifications"
        subtitle="Alerts & Dispatch Updates"
        navigation={navigation}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topActions}>
          <Text style={styles.unreadCount}>
            {notifications.filter(n => n.unread).length} Unread Updates
          </Text>
          <TouchableOpacity
            onPress={markAllNotificationsRead}
            activeOpacity={0.7}
          >
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {notifications.map(item => {
            const iconConfig = getIconForType(item.type);

            return (
              <View
                key={item.id}
                style={[
                  styles.notifCard,
                  item.unread && styles.notifCardUnread,
                ]}
              >
                <View style={[styles.iconBg, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.name} size={22} color={iconConfig.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.cardTop}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{item.message}</Text>
                </View>

                {item.unread && <View style={styles.unreadDot} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.md,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadCount: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
  },
  markReadText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  list: {
    gap: SPACING.sm,
  },
  notifCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderColor: COLORS.primaryLight,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
    flex: 1,
    marginRight: 6,
  },
  notifTime: {
    fontSize: 10,
    color: COLORS.outline,
  },
  notifMessage: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
