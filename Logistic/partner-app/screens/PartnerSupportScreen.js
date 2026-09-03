import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import PartnerHeader from '../components/PartnerHeader';

export default function PartnerSupportScreen({ navigation }) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');

  const faqs = [
    {
      q: 'What if produce is delayed or farmer is not available?',
      a: 'Wait up to 10 minutes at the farm gate. If the farmer is unreachable, tap "Call Mandi Hub" to request immediate re-assignment or wait compensation.',
    },
    {
      q: 'How to report damaged vegetable crates on transit?',
      a: 'Take clear photos on the POD screen before unloading. Note the crate count and alert the Mandi receiving manager upon arrival.',
    },
    {
      q: 'When are weekly earnings transferred to my bank?',
      a: 'All completed orders from Monday to Sunday are settled every Monday by 2:00 PM directly to your verified HDFC bank account.',
    },
    {
      q: 'How do I add a new electric vehicle or update RC?',
      a: 'Navigate to Profile > Vehicles > Update RC photo, or visit the Bhubaneswar Central Mandi Helpdesk with your physical RC card.',
    },
  ];

  const handleSOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS HELPLINE',
      'Connecting to MandiKart 24/7 Roadside & Accident Assistance desk...',
      [
        { text: 'Call Emergency (112)' },
        { text: 'Call Ambulance (108)' },
        { text: 'Mandi Roadside Assist', style: 'default' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTicketSubmit = () => {
    if (!ticketSubject.trim()) {
      Alert.alert('Required', 'Please enter a ticket subject.');
      return;
    }
    Alert.alert(
      'Ticket Submitted! 📩',
      `Ticket #${Math.floor(100000 + Math.random() * 900000)} has been created. A support executive will call you within 15 minutes.`,
      [{ text: 'OK', onPress: () => { setTicketSubject(''); setTicketDetails(''); } }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Help & Support Center"
        subtitle="24/7 Dispatcher & Roadside Assist"
        navigation={navigation}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Emergency SOS Banner */}
        <TouchableOpacity
          style={styles.sosBanner}
          onPress={handleSOS}
          activeOpacity={0.85}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="warning" size={26} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>EMERGENCY ROAD ASSISTANCE</Text>
            <Text style={styles.sosSubtitle}>Vehicle breakdown, accident, or route SOS</Text>
          </View>
          <Ionicons name="call" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* Quick Contact Buttons */}
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Alert.alert('Toll-Free Helpline', 'Dialing 1800-420-9900 (MandiKart Partner Support)...')}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={24} color={COLORS.primary} />
            <Text style={styles.contactBtnTitle}>Call Helpline</Text>
            <Text style={styles.contactBtnDesc}>1800-420-9900</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Alert.alert('WhatsApp Support', 'Opening MandiKart Partner WhatsApp chat...')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.success} />
            <Text style={styles.contactBtnTitle}>WhatsApp Chat</Text>
            <Text style={styles.contactBtnDesc}>Instant 24x7</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Accordion */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqList}>
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqQuestionRow}>
                    <Text style={styles.faqQuestionText}>{faq.q}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  {isExpanded && (
                    <Text style={styles.faqAnswerText}>{faq.a}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Raise Ticket Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Raise a Support Request</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject / Issue Type</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Discrepancy in Tomato crate weight"
              value={ticketSubject}
              onChangeText={setTicketSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Detailed Description</Text>
            <TextInput
              style={[styles.textInput, { height: 80, textAlignVertical: 'top', paddingTop: 8 }]}
              placeholder="Describe the issue you encountered..."
              multiline
              value={ticketDetails}
              onChangeText={setTicketDetails}
            />
          </View>

          <TouchableOpacity
            style={styles.submitTicketBtn}
            onPress={handleTicketSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitTicketText}>Submit Support Ticket</Text>
          </TouchableOpacity>
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
    gap: SPACING.lg,
  },
  sosBanner: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  sosIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTitle: {
    fontSize: FONT.sm,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  sosSubtitle: {
    fontSize: FONT.xs,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  contactBtnTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
    marginTop: 4,
  },
  contactBtnDesc: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  faqList: {
    gap: SPACING.sm,
  },
  faqItem: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: FONT.base,
    fontWeight: '700',
    color: COLORS.onSurface,
    flex: 1,
    marginRight: SPACING.sm,
  },
  faqAnswerText: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 4,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    marginLeft: 2,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: RADIUS.md,
    height: 48,
    paddingHorizontal: SPACING.md,
    fontSize: FONT.base,
    color: COLORS.onSurface,
  },
  submitTicketBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  submitTicketText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: '800',
  },
});
