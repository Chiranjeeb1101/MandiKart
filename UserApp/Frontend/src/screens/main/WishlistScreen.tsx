import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import { SAMPLE_PRODUCTS } from '../../services/mockData';
import { WishlistItem } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const navigation = useNavigation<Nav>();
  const [items, setItems] = useState<WishlistItem[]>(
    SAMPLE_PRODUCTS.slice(0, 4).map((p, i) => ({
      id: `w-${i}`,
      product: p,
      addedAt: new Date().toISOString(),
    }))
  );

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMoveAllToCart = () => {
    Alert.alert(
      'Move All to Cart 🛒',
      `All ${items.length} items from your wishlist have been added to your cart!`,
      [
        {
          text: 'View Cart',
          onPress: () => navigation.navigate('Main', { screen: 'Cart' } as any),
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert('Clear Wishlist', 'Are you sure you want to remove all saved items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setItems([]) },
    ]);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>My Saved Wishlist</Text>
          <View style={{ width: 22 }} />
        </View>
        <EmptyState
          icon="heart-outline"
          title="Your Wishlist is Empty ❤️"
          description="Save your favourite fresh farm vegetables and fruits here to quickly buy them later."
          actionLabel="Explore Products 🌾"
          onAction={() => navigation.navigate('Main', { screen: 'Home' } as any)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>My Wishlist</Text>
          <Text style={styles.subtitle}>{items.length} saved produce items</Text>
        </View>

        <TouchableOpacity onPress={handleClearWishlist} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Top Banner Action */}
      <View style={styles.topBanner}>
        <View style={styles.bannerTextWrap}>
          <Ionicons name="heart" size={18} color="#EF4444" />
          <Text style={styles.bannerText}>Save your daily essentials for fast re-ordering!</Text>
        </View>
        <TouchableOpacity style={styles.moveAllBtn} onPress={handleMoveAllToCart} activeOpacity={0.85}>
          <Ionicons name="cart-outline" size={14} color={Colors.white} />
          <Text style={styles.moveAllText}>Move All to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: Spacing.sm }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProductCard
              product={item.product}
              onPress={() =>
                navigation.navigate('ProductStack', {
                  screen: 'ProductDetails',
                  params: { productId: item.product.id },
                })
              }
              onAddToCart={() =>
                Alert.alert('Added to Cart 🛒', `${item.product.name} added to your cart!`)
              }
              onWishlistToggle={() => removeItem(item.id)}
              isWishlisted
            />
          </View>
        )}
      />
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
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  titleWrap: { alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 11, color: Colors.textSecondary },
  actionBtn: { padding: 4 },
  // Top Banner
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  bannerTextWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  bannerText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  moveAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  moveAllText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  // Grid
  grid: { padding: Spacing.md, gap: Spacing.sm },
  cardWrap: { flex: 1 },
});
