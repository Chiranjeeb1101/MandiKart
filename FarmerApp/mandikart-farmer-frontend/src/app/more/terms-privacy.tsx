/**
 * MandiKart Farmer App — Terms of Service & Privacy Policy
 *
 * Unique Design:
 * - Farmer Protection Charter with 4 Trust Pillars
 * - Escrow & Direct Payout Compliance Certifications
 * - Privacy & Digital Data Protection Bill Rights
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Scale,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { MKBackground, MKHeader } from '@/components/ui';

export default function TermsPrivacyScreen() {
  return (
    <MKBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MKHeader showBack title="Terms & Privacy Charter" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Banner */}
          <Animated.View entering={FadeInDown.duration(450)} style={styles.headerBanner}>
            <View style={styles.shieldCircle}>
              <ShieldCheck size={28} color="#1E5A2A" />
            </View>
            <View style={styles.bannerMeta}>
              <Text style={styles.bannerTitle}>Farmer Protection Mandate</Text>
              <Text style={styles.bannerSub}>
                Transparent trade terms, zero hidden commission, and protected Escrow settlement.
              </Text>
            </View>
          </Animated.View>

          {/* Section 1: Terms of Trade */}
          <Text style={styles.sectionTitle}>TERMS OF SERVICE</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(100)} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Scale size={20} color="#1E5A2A" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Direct Kisan Trade Rules</Text>
                <Text style={styles.cardSub}>Zero commission marketplace framework</Text>
              </View>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <CheckCircle2 size={16} color="#1E5A2A" style={{ marginTop: 2 }} strokeWidth={2.5} />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>100% Net Price Realization: </Text>
                  The price you accept on the app is the exact net payment credited to your bank account. No deduction for brokerage or handling fees.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <CheckCircle2 size={16} color="#1E5A2A" style={{ marginTop: 2 }} strokeWidth={2.5} />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Escrow Security Lock: </Text>
                  Buyers must deposit funds into MandiKart Escrow before pickup trucks are dispatched. Payouts are guaranteed once gate receipt is generated.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <CheckCircle2 size={16} color="#1E5A2A" style={{ marginTop: 2 }} strokeWidth={2.5} />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Calibrated Farm-Gate Weighing: </Text>
                  Logistics partners must weigh produce using calibrated digital scales in your presence before loading.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Section 2: Data Privacy */}
          <Text style={styles.sectionTitle}>PRIVACY & DATA RIGHTS</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(150)} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Lock size={20} color="#1565C0" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Kisan Data Protection Policy</Text>
                <Text style={styles.cardSub}>UIDAI & DPDP Act compliance</Text>
              </View>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <CheckCircle2 size={16} color="#1565C0" style={{ marginTop: 2 }} strokeWidth={2.5} />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Encrypted Vault Storage: </Text>
                  Aadhaar, Land RoR, and Bank records are 256-bit encrypted and stored solely for verification and KYC compliance.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <CheckCircle2 size={16} color="#1565C0" style={{ marginTop: 2 }} strokeWidth={2.5} />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>No Third-Party Marketing: </Text>
                  Your phone number, farm location, and personal details are never sold to commercial brokers or advertisers.
                </Text>
              </View>
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
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  shieldCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  bannerMeta: { flex: 1, gap: 2 },
  bannerTitle: { fontSize: 16, fontWeight: '800', color: '#1E5A2A' },
  bannerSub: { fontSize: 12, color: '#5F6368', lineHeight: 16 },

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
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EC',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1A1C1E' },
  cardSub: { fontSize: 11, color: '#757575' },
  bulletList: { gap: 12 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { flex: 1, fontSize: 13, color: '#5F6368', lineHeight: 19 },
  bold: { color: '#1A1C1E', fontWeight: '700' },
});
