import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function DeliveryAddressScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress', {})}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={20} color={Colors.primary} />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={styles.addressCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}><Text style={styles.badgeText}>HOME</Text></View>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.name}>Ramesh Sharma</Text>
          <Text style={styles.address}>123, Model Town, near SBI Bank, Pune, Maharashtra - 411016</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton title="Continue to Summary" onPress={() => navigation.navigate('CheckoutReview')} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.md, borderStyle: 'dashed' },
  addText: { color: Colors.primary, fontWeight: '600' },
  addressCard: { backgroundColor: 'transparent', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: Colors.primary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { backgroundColor: Colors.gray100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  phone: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  footer: { padding: Spacing.md, backgroundColor: 'transparent', borderTopWidth: 1, borderTopColor: Colors.borderLight },
});

