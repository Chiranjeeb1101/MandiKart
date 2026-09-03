/**
 * MandiKart Farmer App — Notifications & Price Alerts Settings
 *
 * Unique Design:
 * - Smart Category Alert Cards with Live Status Tags
 * - Instant SMS, WhatsApp & Push Toggles with visual cues
 * - Timing preference for morning mandi price broadcasts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Bell,
  TrendingUp,
  Truck,
  Smartphone,
  MessageSquare,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { MKBackground, MKHeader } from '@/components/ui';

export default function NotificationsScreen() {
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [pickupReminders, setPickupReminders] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [morningBroadcastTime, setMorningBroadcastTime] = useState('06:30 AM');

  return (
    <MKBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MKHeader showBack title="Mandi Notifications" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Note */}
          <Animated.View entering={FadeInDown.duration(450)} style={styles.headerBox}>
            <View style={styles.bellIconCircle}>
              <Bell size={24} color="#1E5A2A" />
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.headerTitle}>Real-time Mandi Alerts</Text>
              <Text style={styles.headerSub}>
                Get instant notifications when buyer bids arrive or crop mandi prices rise.
              </Text>
            </View>
          </Animated.View>

          {/* Section 1: Market & Price Alerts */}
          <Text style={styles.sectionTitle}>MANDI & CROP UPDATES</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(100)} style={styles.card}>
            {/* Price Alerts */}
            <View style={styles.toggleRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <TrendingUp size={20} color="#1E5A2A" />
              </View>
              <View style={styles.toggleMeta}>
                <View style={styles.titleWithTag}>
                  <Text style={styles.toggleTitle}>Daily Mandi Price Quotes</Text>
                  <View style={styles.liveTag}><Text style={styles.liveTagText}>Daily</Text></View>
                </View>
                <Text style={styles.toggleSub}>Morning updates for Rice, Wheat & Vegetables</Text>
              </View>
              <Switch
                value={priceAlerts}
                onValueChange={setPriceAlerts}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={priceAlerts ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>

            {/* Broadcast Timing Pill */}
            {priceAlerts && (
              <View style={styles.timingPillRow}>
                <Clock size={13} color="#1E5A2A" />
                <Text style={styles.timingPillText}>Broadcast delivery time: </Text>
                <Text style={styles.timingBold}>{morningBroadcastTime}</Text>
              </View>
            )}

            {/* Order Updates */}
            <View style={[styles.toggleRow, styles.noBorder]}>
              <View style={[styles.iconBox, { backgroundColor: '#E1F5FE' }]}>
                <Truck size={20} color="#0288D1" />
              </View>
              <View style={styles.toggleMeta}>
                <Text style={styles.toggleTitle}>Driver & Pickup Tracking</Text>
                <Text style={styles.toggleSub}>Live GPS arrival countdown and vehicle verification</Text>
              </View>
              <Switch
                value={orderUpdates}
                onValueChange={setOrderUpdates}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={orderUpdates ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>
          </Animated.View>

          {/* Section 2: Direct Channels */}
          <Text style={styles.sectionTitle}>DELIVERY CHANNELS</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(150)} style={styles.card}>
            {/* WhatsApp */}
            <View style={styles.toggleRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <MessageSquare size={20} color="#2E7D32" />
              </View>
              <View style={styles.toggleMeta}>
                <View style={styles.titleWithTag}>
                  <Text style={styles.toggleTitle}>WhatsApp Summaries</Text>
                  <View style={styles.recommendedTag}><Text style={styles.recommendedTagText}>Recommended</Text></View>
                </View>
                <Text style={styles.toggleSub}>Digital weight receipts & instant payment confirmation</Text>
              </View>
              <Switch
                value={whatsappAlerts}
                onValueChange={setWhatsappAlerts}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={whatsappAlerts ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>

            {/* SMS */}
            <View style={[styles.toggleRow, styles.noBorder]}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <Smartphone size={20} color="#E65100" />
              </View>
              <View style={styles.toggleMeta}>
                <Text style={styles.toggleTitle}>SMS Backup Alerts</Text>
                <Text style={styles.toggleSub}>Critical login OTPs and gate pickup verification pins</Text>
              </View>
              <Switch
                value={smsAlerts}
                onValueChange={setSmsAlerts}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={smsAlerts ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 14,
  },
  bellIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  headerMeta: { flex: 1, gap: 2 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1E5A2A' },
  headerSub: { fontSize: 12, color: '#5F6368', lineHeight: 16 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7A7A7A',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
    gap: 12,
  },
  noBorder: { borderBottomWidth: 0 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleMeta: { flex: 1, gap: 3 },
  titleWithTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  toggleTitle: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },
  toggleSub: { fontSize: 11, color: '#5F6368', lineHeight: 15 },
  liveTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E5A2A',
  },
  recommendedTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  timingPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  timingPillText: {
    fontSize: 11,
    color: '#555',
  },
  timingBold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E5A2A',
  },
});
