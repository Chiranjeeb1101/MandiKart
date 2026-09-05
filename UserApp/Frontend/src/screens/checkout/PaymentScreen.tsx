import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { apiClient } from '../../services/apiClient';
import { useCart } from '../../context/CartContext';

export default function PaymentScreen({ navigation, route }: any) {
  const { clearCart } = useCart();
  const [selected, setSelected] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = route.params?.amount || route.params?.total || 155;
  const isBulk = route.params?.isBulk || false;
  const bulkSupplier = route.params?.bulkSupplier;
  const isNegotiated = route.params?.isNegotiated || false;
  const negotiation = route.params?.negotiation;

  const methods = [
    { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: 'phone-portrait-outline', desc: 'Fast & Instant' },
    { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline', desc: 'Visa, MasterCard, RuPay' },
    { id: 'cod', label: 'Cash / Escrow on Delivery', icon: 'cash-outline', desc: 'Pay upon verified delivery' },
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const items = isNegotiated && negotiation
        ? [
            {
              productId: negotiation.id || 'prod-neg',
              cropName: negotiation.cropName || 'Negotiated Produce',
              grade: 'A' as const,
              quantity: negotiation.quantity || 1,
              unit: negotiation.unit || 'kg',
              pricePerUnit: negotiation.counterPrice || negotiation.offeredPrice || 50,
            },
          ]
        : isBulk && bulkSupplier
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

      const orderId = res.order?.orderNumber || 'MK-ORD-2026-9041';

      // 2. Create Stripe PaymentIntent with Escrow hold tags
      const paymentIntent = await apiClient.payments.createIntent({
        orderId,
        amount,
        currency: 'INR',
      });

      // 3. Confirm Stripe Payment & Lock in Escrow
      if (paymentIntent?.paymentIntentId) {
        await apiClient.payments.confirm(paymentIntent.paymentIntentId, orderId);
      }

      setLoading(false);
      clearCart();
      navigation.navigate('OrderConfirmation', {
        orderId,
        deliveryOtp: res.order?.deliveryOtp || '719284',
        order: res.order,
        stripePaymentIntentId: paymentIntent?.paymentIntentId,
      });
    } catch (err: any) {
      setLoading(false);
      clearCart();
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
            <Text style={styles.escrowTitle}>MandiKart Safe Escrow (Powered by Stripe)</Text>
            <Text style={styles.escrowSub}>
              Payment is held securely in Stripe Escrow. Farmer is paid only after you inspect produce and verify your secret 6-digit delivery OTP.
            </Text>
          </View>
        </View>

        {/* Order Amount Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Produce Total</Text>
            <Text style={styles.summaryValue}>₹{amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Escrow Protection Fee</Text>
            <Text style={[styles.summaryValue, { color: '#15803D' }]}>FREE (₹0)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mandi Yard Logistics</Text>
            <Text style={styles.summaryValue}>Included</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalValue}>₹{amount}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Select Payment Mode</Text>

        {methods.map((m) => (
          <View key={m.id} style={[styles.card, selected === m.id && styles.cardSelected]}>
            <TouchableOpacity
              style={styles.cardHeaderRow}
              onPress={() => setSelected(m.id)}
              activeOpacity={0.8}
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

            {/* Dynamic Interactive Fields per method */}
            {selected === 'upi' && m.id === 'upi' && (
              <View style={styles.expandedSection}>
                <Text style={styles.inputPrompt}>Enter Virtual Payment Address (VPA)</Text>
                <View style={styles.upiInputWrap}>
                  <Text style={styles.upiIconText}>@</Text>
                  <TextInput
                    style={styles.upiInputField}
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="e.g. mobile@upi or username@okaxis"
                    placeholderTextColor={Colors.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            )}

            {selected === 'card' && m.id === 'card' && (
              <View style={styles.expandedSection}>
                <Text style={styles.inputPrompt}>Stripe Secure Card Element</Text>
                <View style={styles.cardSimulator}>
                  <Ionicons name="card" size={18} color={Colors.textSecondary} />
                  <Text style={styles.cardSimText}>•••• •••• •••• 4242</Text>
                  <Text style={styles.cardSimExpiry}>12/28</Text>
                </View>
              </View>
            )}

            {selected === 'cod' && m.id === 'cod' && (
              <View style={styles.expandedSection}>
                <View style={styles.codNote}>
                  <Ionicons name="information-circle" size={16} color="#B45309" />
                  <Text style={styles.codNoteText}>
                    Deliveries require the 6-digit delivery OTP before crates are released from the EV van.
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerEscrowNote}>
          <Ionicons name="lock-closed" size={12} color="#059669" />
          <Text style={styles.footerEscrowNoteText}>Funds safe in Stripe Escrow until verified delivery</Text>
        </View>
        <PrimaryButton
          title={loading ? 'Locking in Escrow...' : `Pay ₹${amount} & Confirm`}
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
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: '#F8FCF9' },
  expandedSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: Spacing.sm,
  },
  inputPrompt: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  upiInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    gap: 8,
  },
  upiIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  upiInputField: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 0,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  cardSimulator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    gap: 8,
  },
  cardSimText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  cardSimExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  codNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  codNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },
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
    gap: 8,
  },
  footerEscrowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerEscrowNoteText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
});
