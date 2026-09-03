/**
 * MandiKart Farmer App — Help Center & Kisan Support Helpline
 *
 * Unique Design:
 * - 24x7 Direct Kisan Support Command Center
 * - 1-Tap Toll-Free Hotline Dialer & WhatsApp Assistant
 * - Categorized FAQ Accordion with instant expand/collapse
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Headphones,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Truck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react-native';
import { MKBackground, MKHeader } from '@/components/ui';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    category: 'Payments',
    question: 'How and when do I receive payment for my crop?',
    answer: 'Buyer funds are locked in MandiKart Escrow before pickup. Once the driver confirms the weight receipt at your farm gate, payment is transferred directly to your bank account or UPI within 24 hours.',
  },
  {
    id: '2',
    category: 'Logistics',
    question: 'Do I need to arrange transport to the Mandi?',
    answer: 'No! MandiKart assigns verified transport trucks to pick up the produce directly from your farm. You will receive live GPS tracking of the vehicle arrival.',
  },
  {
    id: '3',
    category: 'Quality',
    question: 'What happens if there is a quality dispute?',
    answer: 'All quality grading is completed transparently at your farm gate using standard digital moisture meters and scales. Once accepted at the gate, payout is 100% guaranteed.',
  },
  {
    id: '4',
    category: 'FPO / Groups',
    question: 'Can farmer producer organizations (FPOs) sell in bulk?',
    answer: 'Yes! FPOs and farmer cooperatives receive dedicated logistics lanes, bulk pricing tiers, and direct corporate buyer contracts.',
  },
];

export default function HelpSupportScreen() {
  const [openFaq, setOpenFaq] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const handleCallSupport = () => {
    Alert.alert('Kisan Helpline', 'Dialing MandiKart Toll-Free Helpline: 1800-123-4567\nAvailable in Odia, Hindi & English (24x7)');
  };

  const handleWhatsApp = () => {
    Alert.alert('WhatsApp Assistant', 'Connecting to MandiKart Kisan Support on WhatsApp (+91 98765 43210)...');
  };

  return (
    <MKBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MKHeader showBack title="Help & Kisan Support" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Support Helpline Command Card */}
          <Animated.View entering={FadeInDown.duration(450)} style={styles.supportCard}>
            <View style={styles.supportTop}>
              <View style={styles.iconCircle}>
                <Headphones size={28} color="#FFFFFF" />
              </View>
              <View style={styles.supportMeta}>
                <Text style={styles.supportTitle}>24x7 Kisan Helpline</Text>
                <Text style={styles.supportSub}>Toll-free assistance for price quotes, pickup & payouts</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable onPress={handleCallSupport} style={styles.callBtn}>
                <PhoneCall size={16} color="#FFFFFF" />
                <Text style={styles.callBtnText}>Call 1800-123-4567</Text>
              </Pressable>

              <Pressable onPress={handleWhatsApp} style={styles.waBtn}>
                <MessageCircle size={16} color="#1E5A2A" />
                <Text style={styles.waBtnText}>WhatsApp Chat</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Frequently Asked Questions */}
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(100)} style={styles.faqList}>
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;

              return (
                <Pressable
                  key={faq.id}
                  onPress={() => toggleFaq(faq.id)}
                  style={styles.faqCard}
                >
                  <View style={styles.faqHeader}>
                    <View style={styles.faqIconBox}>
                      <HelpCircle size={18} color="#1E5A2A" />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    {isOpen ? (
                      <ChevronUp size={20} color="#1E5A2A" />
                    ) : (
                      <ChevronDown size={20} color="#9AA0A6" />
                    )}
                  </View>

                  {isOpen && (
                    <View style={styles.answerArea}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
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
    gap: 16,
  },
  supportCard: {
    backgroundColor: '#1E5A2A',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#1E5A2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  supportTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  supportMeta: { flex: 1, gap: 4 },
  supportTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  supportSub: { fontSize: 12, color: '#C8E6C9', lineHeight: 17 },
  actionRow: { flexDirection: 'row', gap: 10 },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF7D1A',
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
  },
  callBtnText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF' },
  waBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
  },
  waBtnText: { fontSize: 13, fontWeight: '900', color: '#1E5A2A' },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7A7A7A',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  faqList: { gap: 10 },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
    lineHeight: 19,
  },
  answerArea: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EC',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#5F6368',
    lineHeight: 20,
  },
});
