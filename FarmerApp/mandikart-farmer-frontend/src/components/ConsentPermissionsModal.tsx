/**
 * MandiKart — Global Consent & App Permissions Modal
 * Clean, tactile, and native-feeling prompt for terms, 15-day cookies, and OS device permissions.
 * Includes interactive full-screen reader for Terms & Privacy Charter.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  MapPin,
  Camera,
  Bell,
  CheckCircle2,
  FileText,
  ArrowRight,
  Scale,
  Lock,
  X,
} from 'lucide-react-native';
import { FrontendConsentService } from '@/services/consentService';

interface ConsentPermissionsModalProps {
  visible: boolean;
  onConsentAccepted: () => void;
}

export const ConsentPermissionsModal: React.FC<ConsentPermissionsModalProps> = ({
  visible,
  onConsentAccepted,
}) => {
  const [terms, setTerms] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const cookies = true;

  const [location, setLocation] = useState(true);
  const [camera, setCamera] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showTermsReader, setShowTermsReader] = useState(false);

  const canProceed = terms && privacy;

  const handleAgreeAndProceed = async () => {
    if (!canProceed || loading) return;

    setLoading(true);
    try {
      await FrontendConsentService.submitConsent({
        terms,
        privacy,
        cookies,
        permissions: {
          location,
          camera,
          notifications,
        },
      });
      onConsentAccepted();
    } catch (e) {
      console.warn('Consent acceptance completed with fallback:', e);
      onConsentAccepted();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Badge */}
          <View style={styles.header}>
            <View style={styles.shieldBadge}>
              <ShieldCheck size={28} color="#1E5A2A" strokeWidth={2.4} />
            </View>
            <Text style={styles.title}>Permissions & Agreement</Text>
            <Text style={styles.subtitle}>
              MandiKart requires a few essential permissions to provide accurate APMC rates, AI crop grading, and direct buyer dispatches.
            </Text>
          </View>

          {/* Card 1: Mandatory Legal Policies */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>LEGAL POLICIES & SESSIONS</Text>
              <Pressable onPress={() => setShowTermsReader(true)}>
                <Text style={styles.readerLink}>Read Full Terms ↗</Text>
              </Pressable>
            </View>

            {/* Terms */}
            <View style={styles.row}>
              <FileText size={20} color="#1E5A2A" style={styles.rowIcon} />
              <View style={styles.rowMeta}>
                <Pressable onPress={() => setShowTermsReader(true)}>
                  <Text style={styles.rowTitle}>
                    Terms & Conditions <Text style={styles.linkAccent}>(View Charter)</Text>
                  </Text>
                </Pressable>
                <Text style={styles.rowDesc}>Marketplace rules, mandi bidding & payouts</Text>
              </View>
              <Switch
                value={terms}
                onValueChange={setTerms}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={terms ? '#16a34a' : '#f1f5f9'}
              />
            </View>

            {/* Privacy */}
            <View style={[styles.row, styles.noBorder]}>
              <CheckCircle2 size={20} color="#1E5A2A" style={styles.rowIcon} />
              <View style={styles.rowMeta}>
                <Pressable onPress={() => setShowTermsReader(true)}>
                  <Text style={styles.rowTitle}>
                    Privacy Policy <Text style={styles.linkAccent}>(DPDP Act)</Text>
                  </Text>
                </Pressable>
                <Text style={styles.rowDesc}>DPDP Act compliance & data security</Text>
              </View>
              <Switch
                value={privacy}
                onValueChange={setPrivacy}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={privacy ? '#16a34a' : '#f1f5f9'}
              />
            </View>
          </View>

          {/* Card 2: Device Hardware Permissions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PHONE HARDWARE PERMISSIONS</Text>

            {/* Location */}
            <View style={styles.row}>
              <MapPin size={20} color="#2563eb" style={styles.rowIcon} />
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>📍 Location Access</Text>
                <Text style={styles.rowDesc}>Detects nearest APMC mandis and calculates transporter route</Text>
              </View>
              <Switch
                value={location}
                onValueChange={setLocation}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={location ? '#16a34a' : '#f1f5f9'}
              />
            </View>

            {/* Camera */}
            <View style={styles.row}>
              <Camera size={20} color="#7c3aed" style={styles.rowIcon} />
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>📷 Camera & Photos</Text>
                <Text style={styles.rowDesc}>Capture harvest photos for AI crop grading & weighbridge slips</Text>
              </View>
              <Switch
                value={camera}
                onValueChange={setCamera}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={camera ? '#16a34a' : '#f1f5f9'}
              />
            </View>

            {/* Push Popups */}
            <View style={[styles.row, styles.noBorder]}>
              <Bell size={20} color="#ea580c" style={styles.rowIcon} />
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>🔔 Push Popups</Text>
                <Text style={styles.rowDesc}>Instant phone pop-ups when buyer bids arrive or orders are dispatched</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={notifications ? '#16a34a' : '#f1f5f9'}
              />
            </View>
          </View>

          {/* Action CTA */}
          <Pressable
            style={[styles.button, (!canProceed || loading) && styles.buttonDisabled]}
            onPress={handleAgreeAndProceed}
            disabled={!canProceed || loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.buttonText}>Agree & Enter MandiKart 🌾</Text>
                <ArrowRight size={18} color="#ffffff" />
              </View>
            )}
          </Pressable>

          <Text style={styles.footerNotice}>
            By continuing, you confirm acceptance of MandiKart platform terms. You can change hardware permissions at any time in device settings.
          </Text>
        </ScrollView>

        {/* ── Interactive Terms & Privacy Policy Charter Reader Modal ── */}
        <Modal visible={showTermsReader} animationType="slide" transparent={false}>
          <View style={styles.readerRoot}>
            <View style={styles.readerHeader}>
              <Text style={styles.readerHeaderTitle}>Terms & Privacy Charter</Text>
              <Pressable onPress={() => setShowTermsReader(false)} style={styles.closeBtn}>
                <X size={22} color="#ffffff" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.readerContent} showsVerticalScrollIndicator={false}>
              <View style={styles.bannerBox}>
                <ShieldCheck size={28} color="#16a34a" />
                <Text style={styles.bannerHeading}>Farmer Protection Mandate</Text>
                <Text style={styles.bannerText}>
                  Zero commission marketplace framework, guaranteed Escrow settlement, and calibrated farm-gate digital weighing.
                </Text>
              </View>

              {/* Section 1 */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeadingRow}>
                  <Scale size={20} color="#16a34a" />
                  <Text style={styles.sectionHeadingText}>1. Direct Kisan Trade Rules</Text>
                </View>
                <Text style={styles.pText}>
                  • <Text style={styles.boldText}>100% Net Price Realization: </Text>
                  The price you accept on the app is the exact net payment credited to your bank account. No deductions for brokerage, mandi cess, or handling fees.
                </Text>
                <Text style={styles.pText}>
                  • <Text style={styles.boldText}>Escrow Security Lock: </Text>
                  Buyers must deposit 100% funds into MandiKart Escrow before pickup trucks are dispatched. Payouts are guaranteed within 24 hours of farm-gate receipt.
                </Text>
                <Text style={styles.pText}>
                  • <Text style={styles.boldText}>Calibrated Farm-Gate Weighing: </Text>
                  Logistics partners weigh produce using certified digital scales in your presence before loading.
                </Text>
              </View>

              {/* Section 2 */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeadingRow}>
                  <Lock size={20} color="#2563eb" />
                  <Text style={styles.sectionHeadingText}>2. Data Privacy & DPDP Compliance</Text>
                </View>
                <Text style={styles.pText}>
                  • <Text style={styles.boldText}>Encrypted Vault: </Text>
                  Aadhaar, Land RoR, and Bank records are 256-bit encrypted and stored solely for KYC and direct DBT payouts.
                </Text>
                <Text style={styles.pText}>
                  • <Text style={styles.boldText}>No Commercial Selling: </Text>
                  Your phone number, farm GPS location, and harvest quantity are never sold to commercial telemarketers.
                </Text>
              </View>

              <Pressable
                style={styles.doneBtn}
                onPress={() => setShowTermsReader(false)}
              >
                <Text style={styles.doneBtnText}>I Have Read & Understand ✓</Text>
              </Pressable>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a1a0d' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  shieldBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#86efac',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },
  card: {
    backgroundColor: '#112916',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e4624',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#86efac', letterSpacing: 1.2 },
  readerLink: { fontSize: 12, fontWeight: '700', color: '#86efac', textDecorationLine: 'underline' },
  linkAccent: { color: '#86efac', fontWeight: '600', fontSize: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e4624',
  },
  noBorder: { borderBottomWidth: 0, paddingBottom: 4 },
  rowIcon: { marginRight: 14 },
  rowMeta: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#f8fafc', marginBottom: 3 },
  rowDesc: { fontSize: 11, color: '#94a3b8', lineHeight: 15 },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#334155' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  footerNotice: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
    paddingHorizontal: 12,
  },

  // Reader Modal Styles
  readerRoot: { flex: 1, backgroundColor: '#0a1a0d' },
  readerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e4624',
  },
  readerHeaderTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e4624',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerContent: { padding: 20, paddingBottom: 40 },
  bannerBox: {
    backgroundColor: '#112916',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e4624',
    alignItems: 'center',
  },
  bannerHeading: { fontSize: 16, fontWeight: '800', color: '#86efac', marginTop: 8, marginBottom: 4 },
  bannerText: { fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },
  sectionCard: {
    backgroundColor: '#112916',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e4624',
  },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionHeadingText: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  pText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginBottom: 10 },
  boldText: { fontWeight: '700', color: '#86efac' },
  doneBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
