import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import QuantitySelector from '../../components/QuantitySelector';
import FarmerCard from '../../components/FarmerCard';
import { SAMPLE_PRODUCTS } from '../../services/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductStack'>;

export default function ProductDetailsScreen({ navigation, route }: any) {
  const { productId } = route.params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId) || SAMPLE_PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image & Header */}
        <View style={styles.imageHeader}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsWishlisted(!isWishlisted)} style={styles.iconBtn}>
              <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={24} color={isWishlisted ? Colors.error : Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={Colors.white} />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>
          <Text style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.unit}> / {product.unit}</Text>
          </Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>
        </View>

        {/* Farmer Info */}
        <View style={styles.farmerSection}>
          <Text style={styles.sectionTitle}>Grown by</Text>
          <FarmerCard
            farmer={product.farmer}
            onPress={() => {}}
            onChat={() => navigation.navigate('ChatStack', { screen: 'ChatRoom' })}
          />
        </View>

        {/* Reviews (Preview) */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Reviews ({product.reviewCount})</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ReviewList', { productId: product.id })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* Mock review */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewUser}>Anil Kumar</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={12} color={Colors.accent} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>Very fresh and good quality. Delivered on time.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyWrap}>
          <QuantitySelector quantity={qty} onIncrease={() => setQty(qty + 1)} onDecrease={() => setQty(qty - 1)} />
        </View>
        <PrimaryButton
          title={`Add to Cart • ₹${product.price * qty}`}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' } as any)}
          style={styles.addBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  imageHeader: { height: 320, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: Colors.gray100 },
  headerActions: { position: 'absolute', top: 50, left: Spacing.md, right: Spacing.md, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  infoSection: { backgroundColor: 'transparent', padding: Spacing.lg, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl, ...Shadows.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { flex: 1, fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 4 },
  ratingText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  priceRow: { marginTop: 8, marginBottom: Spacing.lg },
  price: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  unit: { fontSize: 16, color: Colors.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  desc: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  farmerSection: { marginTop: Spacing.sm, backgroundColor: 'transparent', padding: Spacing.lg },
  reviewSection: { marginTop: Spacing.sm, backgroundColor: 'transparent', padding: Spacing.lg },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  reviewCard: { backgroundColor: Colors.gray50, padding: Spacing.md, borderRadius: BorderRadius.md },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewUser: { fontWeight: '600', color: Colors.textPrimary, fontSize: 14 },
  stars: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'transparent', padding: Spacing.md, paddingBottom: 30, flexDirection: 'row', gap: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight, ...Shadows.md },
  qtyWrap: { justifyContent: 'center' },
  addBtn: { flex: 1 },
});

