import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Pressable, FlatList, StatusBar, Image, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import MarqueeTicker from '../../components/MarqueeTicker';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import InteractiveMapView from '../../components/InteractiveMapView';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BANNERS = [
  { id: '1', bg: '#E8F5E9', title: 'Fresh Vegetables', subtitle: 'Up to 20% off today', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', categoryId: 'cat-1', categoryName: 'Vegetables' },
  { id: '2', bg: '#FFF3E0', title: 'Summer Fruits', subtitle: 'Mangoes & more in season', imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', categoryId: 'cat-2', categoryName: 'Fruits' },
  { id: '3', bg: '#E3F2FD', title: 'Organic Range', subtitle: 'Certified pesticide-free', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', categoryId: 'cat-1', categoryName: 'Organic Produce' },
];

const BANNER_WIDTH = Dimensions.get('window').width - 32;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { buyerMode, toggleBuyerMode, user } = useAuth();
  const { currentAddress, fetchCurrentLocation, isLoadingLocation } = useLocation();
  const [searchText, setSearchText] = useState('');
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [showMap, setShowMap] = useState<boolean>(true);
  const bannerScrollRef = useRef<FlatList>(null);
  const bannerIndex = useRef(0);

  const handleLocationPress = () => {
    Alert.alert(
      'Delivery Location 📍',
      `Current: ${currentAddress?.formattedAddress || 'Pune, Maharashtra'}\n\nWould you like to auto-detect your live GPS coordinates or enter an address?`,
      [
        {
          text: 'Auto-Detect GPS 🎯',
          onPress: async () => {
            const loc = await fetchCurrentLocation(true);
            if (loc) {
              Alert.alert('GPS Updated! 📍', 'Your delivery hub has been set using your device coordinates.');
            }
          },
        },
        {
          text: 'Add New Address 📝',
          onPress: () => navigation.navigate('AddAddress', {}),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleBannerPress = (catId: string, catName: string) => {
    navigation.navigate('ProductStack', {
      screen: 'ProductListing',
      params: { categoryId: catId, categoryName: catName },
    });
  };

  // Auto-scroll banners every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      bannerIndex.current = (bannerIndex.current + 1) % BANNERS.length;
      bannerScrollRef.current?.scrollToOffset({
        offset: bannerIndex.current * (BANNER_WIDTH + 12),
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlisted((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {/* Profile Avatar - left */}
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Main', { screen: 'Profile' } as any)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'A'}</Text>
              </View>
              <View style={styles.onlineDot} />
            </TouchableOpacity>

            {/* Location */}
            <View style={styles.locationWrap}>
              <Text style={styles.locationLabel}>Deliver to</Text>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={handleLocationPress}
              >
                <Ionicons name="location" size={14} color={Colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {currentAddress?.area ? `${currentAddress.area}, ${currentAddress.city}` : 'Pune, Maharashtra'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Right icons */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('ChatStack', { screen: 'ChatList' })}
              >
                <Ionicons name="chatbubble-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Switcher Pill (Retail vs Bulk) */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              style={[styles.modeTab, buyerMode === 'RETAIL' && styles.modeTabActive]}
              onPress={() => buyerMode !== 'RETAIL' && toggleBuyerMode()}
            >
              <Ionicons
                name="basket-outline"
                size={15}
                color={buyerMode === 'RETAIL' ? Colors.white : Colors.textSecondary}
              />
              <Text style={[styles.modeTabText, buyerMode === 'RETAIL' && styles.modeTabTextActive]}>
                Household / Retail
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, buyerMode === 'BULK' && styles.modeTabActive]}
              onPress={() => buyerMode !== 'BULK' && toggleBuyerMode()}
            >
              <Ionicons
                name="business-outline"
                size={15}
                color={buyerMode === 'BULK' ? Colors.white : Colors.textSecondary}
              />
              <Text style={[styles.modeTabText, buyerMode === 'BULK' && styles.modeTabTextActive]}>
                Hotel & Bulk Buyer
              </Text>
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => navigation.navigate('ProductStack', { screen: 'Search' })}
            style={styles.searchBar}
          />
        </View>

        {/* Bulk Procurement Hero Card (Only in Bulk Mode) */}
        {buyerMode === 'BULK' && (
          <View style={styles.bulkHeroBox}>
            <View style={styles.bulkHeroTop}>
              <View style={styles.bulkTag}>
                <Ionicons name="sparkles" size={13} color="#15803D" />
                <Text style={styles.bulkTagText}>WHOLESALE MANDI DESK</Text>
              </View>
              <Text style={styles.bulkHeroTitle}>Direct FPO Procurement</Text>
              <Text style={styles.bulkHeroSub}>
                Procure commercial truckloads with volume price discounts, multi-farmer aggregation, and AI matching.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.postRequirementBtn}
              onPress={() => navigation.navigate('BulkRequirement' as any)}
            >
              <Ionicons name="add-circle" size={18} color={Colors.white} />
              <Text style={styles.postRequirementBtnText}>Post Commercial Requirement</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Marquee ticker */}
        <MarqueeTicker
          items={SAMPLE_PRODUCTS.map((p) => ({
            name: p.name,
            price: `₹${p.price}/${p.unit}`,
            imageUrl: p.imageUrl,
          }))}
          speed={50}
        />

        {/* Banner Carousel — FlatList handles horizontal scroll + tap correctly */}
        <FlatList
          ref={bannerScrollRef}
          data={BANNERS}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.bannerList}
          snapToInterval={BANNER_WIDTH + 12}
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            bannerIndex.current = Math.round(
              e.nativeEvent.contentOffset.x / (BANNER_WIDTH + 12)
            );
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.banner, { backgroundColor: item.bg }]}
              activeOpacity={0.85}
              onPress={() => handleBannerPress(item.categoryId, item.categoryName)}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSub}>{item.subtitle}</Text>
                <View style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>Shop Now →</Text>
                </View>
              </View>
              <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
            </TouchableOpacity>
          )}
        />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductStack', { screen: 'AllCategories' })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={SAMPLE_CATEGORIES.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.catList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.catItem}
                onPress={() => navigation.navigate('ProductStack', {
                  screen: 'ProductListing',
                  params: { categoryId: item.id, categoryName: item.name },
                })}
              >
                <View style={styles.catIcon}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
                  ) : (
                    <Text style={styles.catEmoji}>{item.icon}</Text>
                  )}
                </View>
                <Text style={styles.catName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Live Farm & Fleet GPS Map Widget */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="map" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Live Farm & GPS Fleet</Text>
            </View>
            <TouchableOpacity onPress={() => setShowMap(!showMap)}>
              <Text style={styles.seeAll}>{showMap ? 'Hide Map' : 'View Live Map'}</Text>
            </TouchableOpacity>
          </View>

          {showMap && (
            <View style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.xs }}>
              <InteractiveMapView
                origin={{
                  title: 'Nashik Organic Farm',
                  coordinates: { latitude: 19.9975, longitude: 73.7898 },
                  subTitle: 'Harvest Lot #2026-09',
                }}
                destination={{
                  title: 'Your Location',
                  subTitle: currentAddress?.formattedAddress || 'Pune Delivery Hub',
                }}
              />
            </View>
          )}
        </View>

        {/* Fresh Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Fresh Deals</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductStack', {
                screen: 'ProductListing',
                params: { categoryId: 'fresh-deals', categoryName: '🔥 Fresh Deals' },
              })}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={SAMPLE_PRODUCTS.filter((p) => p.isFreshDeal)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(p) => p.id}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <View style={styles.productCardWrapper}>
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductStack', {
                    screen: 'ProductDetails',
                    params: { productId: item.id },
                  })}
                  onAddToCart={() => {}}
                  onWishlistToggle={() => toggleWishlist(item.id)}
                  isWishlisted={wishlisted.includes(item.id)}
                />
              </View>
            )}
          />
        </View>

        {/* All Products */}
        <View style={[styles.section, { paddingBottom: Spacing.lg }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Products</Text>
          </View>
          <View style={styles.productGrid}>
            {SAMPLE_PRODUCTS.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductStack', {
                    screen: 'ProductDetails',
                    params: { productId: item.id },
                  })}
                  onAddToCart={() => {}}
                  onWishlistToggle={() => toggleWishlist(item.id)}
                  isWishlisted={wishlisted.includes(item.id)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: 'transparent', paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm, marginBottom: Spacing.sm, gap: Spacing.sm },
  avatarBtn: { position: 'relative' },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primaryLight,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: Colors.white },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  locationWrap: { flex: 1 },
  locationLabel: { fontSize: 11, color: Colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray100 },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error, borderWidth: 1.5, borderColor: Colors.white },
  searchBar: { marginBottom: Spacing.sm },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  bulkHeroBox: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    backgroundColor: '#F0FDF4',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  bulkHeroTop: {
    gap: 4,
  },
  bulkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  bulkTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  bulkHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bulkHeroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  postRequirementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  postRequirementBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  bannerList: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  banner: { width: BANNER_WIDTH, borderRadius: BorderRadius.xl, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Spacing.md, overflow: 'hidden' },
  bannerContent: { flex: 1, gap: 4 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  bannerSub: { fontSize: 12, color: Colors.textSecondary },
  bannerBtn: { marginTop: 8, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  bannerBtnText: { fontSize: 12, fontWeight: '600', color: Colors.white },
  bannerImage: { width: 90, height: 90, borderRadius: 16 },
  section: { paddingTop: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  catList: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  catItem: { alignItems: 'center', gap: 6, width: 68 },
  catIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  categoryImage: { width: '100%', height: '100%' },
  catEmoji: { fontSize: 24 },
  catName: { fontSize: 11, fontWeight: '500', color: Colors.textPrimary, textAlign: 'center' },
  productList: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  productCardWrapper: { width: 170 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md, gap: Spacing.sm },
  gridItem: { width: '48%' },
});

