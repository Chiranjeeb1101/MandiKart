import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function OrderSummaryScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>Order Summary</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery To</Text>
          <Text style={styles.text}>Ramesh Sharma</Text>
          <Text style={styles.textSub}>123, Model Town, Pune, MH - 411016</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items (2)</Text>
          <View style={styles.itemRow}><Text style={styles.text}>Fresh Tomatoes (2 kg)</Text><Text style={styles.text}>₹80</Text></View>
          <View style={styles.itemRow}><Text style={styles.text}>Organic Potatoes (1 kg)</Text><Text style={styles.text}>₹35</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.itemRow}><Text style={styles.textSub}>Subtotal</Text><Text style={styles.text}>₹115</Text></View>
          <View style={styles.itemRow}><Text style={styles.textSub}>Delivery Fee</Text><Text style={styles.text}>₹40</Text></View>
          <View style={[styles.itemRow, styles.totalRow]}><Text style={styles.totalText}>Total Amount</Text><Text style={styles.totalText}>₹155</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View><Text style={styles.footerLabel}>Total</Text><Text style={styles.footerTotal}>₹155</Text></View>
        <PrimaryButton title="Proceed to Pay" onPress={() => navigation.navigate('Payment')} style={{ flex: 1, marginLeft: Spacing.md }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.md },
  section: { backgroundColor: 'transparent', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.borderLight },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  text: { fontSize: 14, color: Colors.textPrimary },
  textSub: { fontSize: 14, color: Colors.textSecondary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 8, marginTop: 4 },
  totalText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderTopWidth: 1, borderTopColor: Colors.borderLight },
  footerLabel: { fontSize: 12, color: Colors.textSecondary },
  footerTotal: { fontSize: 20, fontWeight: '700', color: Colors.primary },
});

