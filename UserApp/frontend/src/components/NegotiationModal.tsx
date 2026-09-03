import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme';
import { Product } from '../types';
import { apiClient } from '../services/apiClient';

interface NegotiationModalProps {
  visible: boolean;
  product: Product;
  initialQuantity?: number;
  onClose: () => void;
  onOfferSubmitted: (offer: any) => void;
}

export default function NegotiationModal({
  visible,
  product,
  initialQuantity = 20,
  onClose,
  onOfferSubmitted,
}: NegotiationModalProps) {
  const [quantity, setQuantity] = useState<string>(String(Math.max(product.minOrder || 1, initialQuantity)));
  const [offeredPrice, setOfferedPrice] = useState<string>(String(Math.round(product.price * 0.9)));
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const parsedQty = Math.max(1, Number(quantity) || 1);
  const parsedOffer = Math.max(1, Number(offeredPrice) || 1);
  const originalTotal = parsedQty * product.price;
  const offeredTotal = parsedQty * parsedOffer;
  const discountPercent = Math.round(((product.price - parsedOffer) / product.price) * 100);

  const handleSubmit = async () => {
    if (parsedOffer >= product.price) {
      Alert.alert('Notice', `Your offer (₹${parsedOffer}) is at or above the listed price (₹${product.price}). You can directly add to cart.`);
      return;
    }

    if (parsedOffer < product.price * 0.5) {
      Alert.alert('Unrealistic Offer', 'Offers below 50% of the farm base price are automatically declined by the fair-trade policy.');
      return;
    }

    setLoading(true);
    try {
      const offer = await apiClient.negotiations.submitOffer({
        productId: product.id,
        cropName: product.name,
        farmerId: product.farmer?.id || 'farmer-1',
        farmerName: product.farmer?.name || 'Rajan Kumar',
        originalPrice: product.price,
        offeredPrice: parsedOffer,
        quantity: parsedQty,
        unit: product.unit,
        remarks: remarks || `Looking for ${parsedQty} ${product.unit} at ₹${parsedOffer}/${product.unit}`,
      });

      setLoading(false);
      Alert.alert(
        'Offer Sent! 🤝',
        `Your price offer of ₹${parsedOffer}/${product.unit} for ${parsedQty} ${product.unit} was dispatched to ${product.farmer?.name || 'the farmer'}. You can track responses in Chat.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onOfferSubmitted(offer);
            },
          },
        ]
      );
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to submit offer. Please try again.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.badge}>
                <Ionicons name="pricetag-outline" size={14} color={Colors.primary} />
                <Text style={styles.badgeText}>DIRECT PRICE NEGOTIATION</Text>
              </View>
              <Text style={styles.title}>Make an Offer to Farmer</Text>
              <Text style={styles.subTitle}>
                {product.name} • Listed at ₹{product.price}/{product.unit}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Quantity & Offer Inputs */}
          <View style={styles.inputSection}>
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Required Quantity ({product.unit})</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="e.g. 50"
                  />
                  <Text style={styles.unitSuffix}>{product.unit}</Text>
                </View>
              </View>

              <View style={styles.halfCol}>
                <Text style={styles.inputLabel}>Your Target Price (₹)</Text>
                <View style={styles.inputWrap}>
                  <Text style={styles.rupeePrefix}>₹</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={offeredPrice}
                    onChangeText={setOfferedPrice}
                    placeholder="e.g. 24"
                  />
                  <Text style={styles.unitSuffix}>/{product.unit}</Text>
                </View>
              </View>
            </View>

            {/* Price comparison card */}
            <View style={styles.calcCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Listed Farm Total:</Text>
                <Text style={styles.calcOriginal}>₹{originalTotal}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Your Proposed Total:</Text>
                <Text style={styles.calcOffered}>₹{offeredTotal}</Text>
              </View>
              <View style={styles.savingRow}>
                <Text style={styles.savingText}>
                  {discountPercent > 0 ? `Target Discount: ${discountPercent}% lower than listed price` : 'Standard Listed Rate'}
                </Text>
              </View>
            </View>

            {/* Remarks note */}
            <Text style={styles.inputLabel}>Note for Farmer (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Require regular delivery for restaurant kitchen..."
              placeholderTextColor={Colors.textDisabled}
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <Ionicons name="paper-plane-outline" size={16} color={Colors.white} />
                  <Text style={styles.submitBtnText}>Submit Offer (₹{offeredTotal})</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 10,
    height: 44,
  },
  rupeePrefix: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  unitSuffix: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginLeft: 2,
  },
  calcCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginVertical: 4,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calcLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  calcOriginal: {
    fontSize: 13,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  calcOffered: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  savingRow: {
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: 4,
    marginTop: 2,
  },
  savingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
    padding: 10,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 50,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    height: 46,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
