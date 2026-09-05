import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, TextInput, Alert, FlatList, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import EmptyState from '../../components/EmptyState';
import QuantitySelector from '../../components/QuantitySelector';
import { SAMPLE_PRODUCTS } from '../../services/mockData';
import { CartItem, Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Suggestions that can be added directly to cart
const SUGGESTED_ITEMS = SAMPLE_PRODUCTS.slice(3, 8);

export default function CartScreen() {
  const navigation = useNavigation<Nav>();
  const { currentAddress } = useLocation();
  const {
    items,
    addToCart,
    updateQty,
    removeItem,
    clearCart: contextClearCart,
    couponCode: contextCouponCode,
    couponApplied,
    applyCoupon: contextApplyCoupon,
    removeCoupon,
    subtotal,
    deliveryFee,
    handlingFee,
    couponSavings,
    total,
  } = useCart();

  const [inputCouponCode, setInputCouponCode] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<'express' | 'morning'>('express');
  const deliveryThreshold = 500;

  const addSuggestedItem = (product: Product) => {
    addToCart(product, 1);
  };

  const handleClearCart = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        const confirmed = window.confirm('Are you sure you want to remove all items from your cart?');
        if (confirmed) contextClearCart();
      } else {
        contextClearCart();
      }
    } else {
      Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => contextClearCart() },
      ]);
    }
  };

  const handleApplyCoupon = () => {
    const success = contextApplyCoupon(inputCouponCode);
    if (success) {
      Alert.alert('Coupon Applied! 🎉', '10% discount applied to your order.');
    } else {
      Alert.alert('Invalid Coupon', 'Try using coupon code "MANDI10" or "FRESH".');
    }
  };

  const totalSavings = couponSavings + (deliveryFee === 0 && items.length > 0 ? 40 : 0);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          description="Explore fresh farm produce and add items to your cart!"
          actionLabel="Browse Marketplace"
          onAction={() => navigation.navigate('Main', { screen: 'Home' })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Cart ({items.length})</Text>
          <Text style={styles.subtitle}>Farm fresh produce</Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Ionicons name="trash-bin-outline" size={16} color={Colors.error} />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Address Bar */}
      <TouchableOpacity
        style={styles.addressBar}
        onPress={() => navigation.navigate('DeliveryAddress' as any)}
        activeOpacity={0.85}
      >
        <Ionicons name="location" size={18} color={Colors.primary} />
        <View style={styles.addressInfo}>
          <Text style={styles.addressTitle}>
            Deliver to {currentAddress ? `${currentAddress.city}, ${currentAddress.state}` : 'Pune, Maharashtra'}
          </Text>
          <Text style={styles.addressSub} numberOfLines={1}>
            {currentAddress ? currentAddress.formattedAddress : 'Flat 402, Shivajinagar, Pune - 411005'}
          </Text>
        </View>
        <Text style={styles.changeLink}>Change</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Free Delivery Threshold Bar */}
        {subtotal < deliveryThreshold ? (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Ionicons name="car-outline" size={18} color={Colors.primary} />
              <Text style={styles.progressText}>
                Add <Text style={styles.progressHighlight}>₹{deliveryThreshold - subtotal}</Text> more for <Text style={styles.freeText}>FREE Delivery</Text>
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, (subtotal / deliveryThreshold) * 100)}%` }]} />
            </View>
          </View>
        ) : (
          <View style={styles.unlockedBanner}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            <Text style={styles.unlockedText}>🎉 You unlocked FREE Delivery!</Text>
          </View>
        )}

        {/* Cart Item Cards */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
              
              <View style={styles.itemContent}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteIcon}>
                    <Ionicons name="close-circle-outline" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Farmer badge */}
                <View style={styles.farmerBadge}>
                  <Ionicons name="leaf-outline" size={12} color={Colors.primary} />
                  <Text style={styles.farmerText} numberOfLines={1}>{item.product.farmer.name}</Text>
                </View>

                <View style={styles.itemBottomRow}>
                  <View>
                    <Text style={styles.itemPrice}>₹{item.product.price} <Text style={styles.unitText}>/ {item.product.unit}</Text></Text>
                    <Text style={styles.itemSubtotal}>Total: ₹{item.product.price * item.quantity}</Text>
                  </View>

                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQty(item.id, item.quantity + 1)}
                    onDecrease={() => item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, item.quantity - 1)}
                    min={0}
                    size="sm"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Slot Selection */}
        <View style={styles.slotCard}>
          <Text style={styles.sectionTitle}>Select Delivery Slot</Text>
          <View style={styles.slotRow}>
            <TouchableOpacity
              style={[styles.slotOption, selectedSlot === 'express' && styles.selectedSlotOption]}
              onPress={() => setSelectedSlot('express')}
            >
              <Ionicons name="flash" size={16} color={selectedSlot === 'express' ? Colors.white : Colors.primary} />
              <View>
                <Text style={[styles.slotTitle, selectedSlot === 'express' && styles.selectedSlotText]}>Express Delivery</Text>
                <Text style={[styles.slotSub, selectedSlot === 'express' && styles.selectedSlotSub]}>Today within 45 mins</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.slotOption, selectedSlot === 'morning' && styles.selectedSlotOption]}
              onPress={() => setSelectedSlot('morning')}
            >
              <Ionicons name="sunny-outline" size={16} color={selectedSlot === 'morning' ? Colors.white : Colors.textPrimary} />
              <View>
                <Text style={[styles.slotTitle, selectedSlot === 'morning' && styles.selectedSlotText]}>Morning Slot</Text>
                <Text style={[styles.slotSub, selectedSlot === 'morning' && styles.selectedSlotSub]}>Tomorrow (7 - 10 AM)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Frequently Bought Together Carousel */}
        <View style={styles.suggestionsCard}>
          <Text style={styles.sectionTitle}>Frequently Bought Together</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionList}>
            {SUGGESTED_ITEMS.map((sug) => {
              const inCart = items.some((i) => i.product.id === sug.id);
              return (
                <View key={sug.id} style={styles.sugItem}>
                  <Image source={{ uri: sug.imageUrl }} style={styles.sugImage} />
                  <Text style={styles.sugName} numberOfLines={1}>{sug.name}</Text>
                  <Text style={styles.sugPrice}>₹{sug.price}/{sug.unit}</Text>
                  <TouchableOpacity
                    style={[styles.sugAddBtn, inCart && styles.sugAddBtnActive]}
                    onPress={() => addSuggestedItem(sug)}
                  >
                    <Ionicons name={inCart ? "checkmark" : "add"} size={14} color={Colors.white} />
                    <Text style={styles.sugAddText}>{inCart ? "Added" : "Add"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Promo Coupon Section */}
        <View style={styles.couponCard}>
          <Text style={styles.sectionTitle}>Offers & Coupons</Text>
          {couponApplied ? (
            <View style={styles.appliedCouponRow}>
              <View style={styles.appliedCouponTag}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.appliedCouponText}>{(contextCouponCode || 'MANDI10').toUpperCase()} (10% OFF)</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <Ionicons name="pricetag-outline" size={18} color={Colors.textSecondary} style={styles.couponIcon} />
              <TextInput
                style={styles.couponInput}
                placeholder="Enter Coupon Code (e.g. MANDI10)"
                placeholderTextColor={Colors.textDisabled}
                value={inputCouponCode}
                onChangeText={setInputCouponCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCoupon}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bill Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>

          {couponApplied && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount (10%)</Text>
              <Text style={styles.discountValue}>-₹{couponSavings}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charge</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && { color: Colors.success, fontWeight: '700' }]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Handling & Packaging</Text>
            <Text style={styles.summaryValue}>₹{handlingFee}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>

          {totalSavings > 0 && (
            <View style={styles.savingsTag}>
              <Ionicons name="sparkles" size={14} color={Colors.primary} />
              <Text style={styles.savingsText}>You saved ₹{totalSavings} on this order!</Text>
            </View>
          )}
        </View>

        {/* Quality Guarantee Card */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <Text style={styles.guaranteeText}>100% Quality Guaranteed</Text>
          </View>
          <View style={styles.guaranteeDivider} />
          <View style={styles.guaranteeItem}>
            <Ionicons name="leaf-outline" size={20} color={Colors.primary} />
            <Text style={styles.guaranteeText}>Direct From Local Farmers</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Footer Bar */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotal}>₹{total}</Text>
          <Text style={styles.footerSavings}>Saved ₹{totalSavings}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CheckoutStack', { screen: 'DeliveryAddress' })}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  clearText: { fontSize: 12, fontWeight: '600', color: Colors.error },
  // Address Bar
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  addressInfo: { flex: 1 },
  addressTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  addressSub: { fontSize: 11, color: Colors.textSecondary },
  changeLink: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  // Scroll
  scroll: { padding: Spacing.md, paddingTop: 0, gap: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  // Progress Bar
  progressCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
    ...Shadows.sm,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressText: { fontSize: 12, color: Colors.textPrimary },
  progressHighlight: { fontWeight: '700', color: Colors.primary },
  freeText: { fontWeight: '700', color: Colors.success },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  unlockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  unlockedText: { fontSize: 13, fontWeight: '700', color: Colors.success },
  // Item Cards
  itemsList: { gap: Spacing.sm },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray100,
  },
  itemContent: { flex: 1, justifyContent: 'space-between' },
  itemTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  deleteIcon: { padding: 2 },
  farmerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  farmerText: { fontSize: 10, fontWeight: '600', color: Colors.primary },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemPrice: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  unitText: { fontSize: 11, fontWeight: '400', color: Colors.textSecondary },
  itemSubtotal: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  // Delivery Slots
  slotCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
    ...Shadows.sm,
  },
  slotRow: { flexDirection: 'row', gap: Spacing.sm },
  slotOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  selectedSlotOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  selectedSlotText: { color: Colors.white },
  slotSub: { fontSize: 10, color: Colors.textSecondary },
  selectedSlotSub: { color: 'rgba(255,255,255,0.8)' },
  // Suggestions
  suggestionsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
    ...Shadows.sm,
  },
  suggestionList: { gap: Spacing.sm },
  sugItem: {
    width: 110,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sugImage: { width: 50, height: 50, borderRadius: BorderRadius.sm, marginBottom: 4 },
  sugName: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  sugPrice: { fontSize: 10, color: Colors.textSecondary, marginBottom: 6 },
  sugAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  sugAddBtnActive: { backgroundColor: Colors.success },
  sugAddText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  // Coupons
  couponCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
    ...Shadows.sm,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  couponIcon: { marginRight: 6 },
  couponInput: { flex: 1, height: 38, fontSize: 13, color: Colors.textPrimary },
  applyBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.primary, borderRadius: BorderRadius.sm },
  applyBtnText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  appliedCouponTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appliedCouponText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  removeCouponText: { fontSize: 12, fontWeight: '700', color: Colors.error },
  // Summary
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
    ...Shadows.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  discountValue: { fontSize: 13, fontWeight: '700', color: Colors.success },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  savingsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  savingsText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  // Guarantee
  guaranteeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 80, // space for footer
    ...Shadows.sm,
  },
  guaranteeItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guaranteeText: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary },
  guaranteeDivider: { width: 1, height: 24, backgroundColor: Colors.borderLight },
  // Footer Sticky Bar
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.lg,
  },
  footerInfo: { gap: 1 },
  footerTotal: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  footerSavings: { fontSize: 11, fontWeight: '600', color: Colors.success },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  checkoutText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
