import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function PaymentScreen({ navigation }: any) {
  const [selected, setSelected] = useState('upi');

  const methods = [
    { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: 'phone-portrait-outline' },
    { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {methods.map((m) => (
          <TouchableOpacity key={m.id} style={[styles.card, selected === m.id && styles.cardSelected]} onPress={() => setSelected(m.id)}>
            <Ionicons name={m.icon as any} size={24} color={selected === m.id ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.label, selected === m.id && styles.labelSelected]}>{m.label}</Text>
            <View style={[styles.radio, selected === m.id && styles.radioSelected]}>
              {selected === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton title="Pay ₹155" onPress={() => navigation.navigate('OrderConfirmation', { orderId: 'ORD-' + Date.now() } as any)} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: 'transparent', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing.md },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  label: { flex: 1, fontSize: 16, color: Colors.textPrimary },
  labelSelected: { fontWeight: '600', color: Colors.primary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.textDisabled, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  footer: { padding: Spacing.md, backgroundColor: 'transparent', borderTopWidth: 1, borderTopColor: Colors.borderLight },
});

