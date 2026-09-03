import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import PartnerHeader from '../components/PartnerHeader';

export default function PartnerLegalPoliciesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Legal & Policies"
        subtitle="Terms of Service & Insurance"
        navigation={navigation}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Insurance Highlight Box */}
        <View style={styles.insuranceBox}>
          <View style={styles.insIconBg}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.insTitle}>₹5,00,000 Partner Accidental Insurance</Text>
            <Text style={styles.insSubtitle}>
              Every active delivery partner on the MandiKart network is insured while on active farm duty and transit.
            </Text>
          </View>
        </View>

        {/* Policy Section 1 */}
        <View style={styles.policyCard}>
          <Text style={styles.sectionHeading}>1. Partner Delivery Agreement</Text>
          <Text style={styles.policyBody}>
            By signing up and accepting delivery requests on the MandiKart platform, you operate as an independent logistics contractor. You agree to transport agricultural farm produce safely from registered farmers to designated Mandi auction bays and fulfillment hubs within the scheduled time windows.
          </Text>
        </View>

        {/* Policy Section 2 */}
        <View style={styles.policyCard}>
          <Text style={styles.sectionHeading}>2. Produce Handling & Quality Standards</Text>
          <Text style={styles.policyBody}>
            • Farm produce (tomatoes, vegetables, greens) must be stacked securely using standard MandiKart crates.{'\n'}
            • In case of rainy weather, protective waterproof tarpaulin must be used.{'\n'}
            • Any physical crate damage during transit must be reported immediately on the POD screen before unloading.
          </Text>
        </View>

        {/* Policy Section 3 */}
        <View style={styles.policyCard}>
          <Text style={styles.sectionHeading}>3. Weekly Settlement & TDS Deduction</Text>
          <Text style={styles.policyBody}>
            Deliveries completed from Monday 00:00 to Sunday 23:59 are calculated, and payouts are initiated every Monday by 2:00 PM. Applicable statutory TDS (1% under Section 194C of IT Act) is deducted and Form 16A certificates are furnished quarterly.
          </Text>
        </View>

        {/* Policy Section 4 */}
        <View style={styles.policyCard}>
          <Text style={styles.sectionHeading}>4. Privacy & Location Tracking</Text>
          <Text style={styles.policyBody}>
            GPS location data is tracked only while your status is set to "ONLINE" to match you with nearby farm pickups and provide turn-by-turn routing to Mandis. Location tracking ceases when you switch to "OFFLINE".
          </Text>
        </View>

        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>MandiKart Partner Terms • Version 2.4.1</Text>
          <Text style={styles.legalEntityText}>MandiKart Technologies Pvt. Ltd., Bhubaneswar, Odisha</Text>
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
  insuranceBox: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  insIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
  insSubtitle: {
    fontSize: FONT.xs,
    color: COLORS.primary,
    marginTop: 2,
    lineHeight: 16,
  },
  policyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.xs,
  },
  sectionHeading: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  policyBody: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: 4,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.outline,
  },
  legalEntityText: {
    fontSize: 10,
    color: COLORS.outlineVariant,
  },
});
