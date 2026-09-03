import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { apiClient } from '../../services/apiClient';

export default function PaymentScreen({ navigation, route }: any) {
  const [selected, setSelected] = useState('upi');
  const [loading, setLoading] = useState(false);

  const amount = route.params?.amount || 155;
  const isBulk = route.params?.isBulk || false;
  const bulkSupplier = route.params?.bulkSupplier;

  const methods = [
    { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: 'phone-portrait-outline', desc: 'Fast & Instant' },
    { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline', desc: 'Visa, MasterCard, RuPay' },
    { id: 'cod', label: 'Cash / Escrow on Delivery', icon: 'cash-outline', desc: 'Pay upon verified delivery' },
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const items = isBulk && bulkSupplier
        ? [
            {
              productId: bulkSupplier.supplierId || 'prod-bulk',
              cropName: bulkSupplier.cropName,
              grade: bulkSupplier.grade,
              quantity: bulkSupplier.availableCapacity,
              unit: bulkSupplier.capacityUnit,
              pricePerUnit: bulkSupplier.askingPricePerUnit,
            },
          ]
        : [
            {
              productId: 'prod-1',
              cropName: 'Fresh Tomatoes',
              grade: 'A' as const,
              quantity: 2,
              unit: 'kg',
              pricePerUnit: 35,
            },
            {
              productId: 'prod-2',
              cropName: 'Organic Potatoes',
              grade: 'A' as const,
              quantity: 1,
              unit: 'kg',
              pricePerUnit: 45,
            },
          ];

      const res = await apiClient.orders.placeOrder({
        items,
        deliveryAddress: '123, Model Town, Pune, MH - 411016',
        targetBuyerType: isBulk ? 'BULK' : 'RETAIL',
      });

      setLoading(false);
      navigation.navigate('OrderConfirmation', {
        orderId: res.order?.orderNumber || 'MK-ORD-2026-9041',
        deliveryOtp: res.order?.deliveryOtp || '719284',
        order: res.order,
      });
    } catch (err: any) {
      setLoading(false);
      navigation.navigate('OrderConfirmation', {
        orderId: 'MK-ORD-2026-9041',
        deliveryOtp: '719284',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Safe Escrow Guarantee */}
        <View style={styles.escrowCard}>
          <Ionicons name="shield-checkmark" size={20} color="#15803D" />
          <View style={styles.escrowTextWrap}>
            <Text style={styles.escrowTitle}>MandiKart Safe Settlement Escrow</Text>
            <Text style={styles.escrowSub}>
              Farmer is paid only after you confirm delivery with your secret 6-digit OTP.
            </Text>
          </View>
        </View>

        {methods.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.card, selected === m.id && styles.cardSelected]}
            onPress={() => setSelected(m.id)}
          >
            <Ionicons
              name={m.icon as any}
              size={24}
              color={selected === m.id ? Colors.primary : Colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, selected === m.id && styles.labelSelected]}>{m.label}</Text>
              <Text style={styles.subLabel}>{m.desc}</Text>
            </View>
            <View style={[styles.radio, selected === m.id && styles.radioSelected]}>
              {selected === m.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={loading ? 'Processing...' : `Pay ₹${amount}`}
          onPress={handlePayment}
          disabled={loading}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.md },
  escrowCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  escrowTextWrap: { flex: 1 },
  escrowTitle: { fontSize: 13, fontWeight: '700', color: '#15803D' },
  escrowSub: { fontSize: 11, color: '#166534', marginTop: 2, lineHeight: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  label: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  subLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  labelSelected: { color: Colors.primary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
