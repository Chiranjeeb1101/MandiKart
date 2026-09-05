import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import { SAMPLE_PRODUCTS } from '../../services/mockData';

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating'];

export default function ProductListingScreen({ navigation, route }: any) {
  const { categoryName, categoryId } = route.params ?? {};
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(0);
  const [wishlisted, setWishlisted] = useState<string[]>([]);

  const filtered = SAMPLE_PRODUCTS
    .filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryId ||
        (categoryId === 'fresh-deals'
          ? p.isFreshDeal
          : (p.categoryId === categoryId || p.category.toLowerCase() === (categoryName || '').toLowerCase()));
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === 1) return a.price - b.price;
      if (sort === 2) return b.price - a.price;
      if (sort === 3) return b.rating - a.rating;
      return 0;
    });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>{categoryName ?? 'Products'}</Text>
        <TouchableOpacity><Ionicons name="options-outline" size={22} color={Colors.textPrimary} /></TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <SearchBar value={search} onChangeText={setSearch} style={styles.search} />
        <FlatList
          data={SORT_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `${i}`}
          contentContainerStyle={styles.chips}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.chip, index === sort && styles.chipActive]}
              onPress={() => setSort(index)}
            >
              <Text style={[styles.chipText, index === sort && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: Spacing.sm }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
              onAddToCart={() => {}}
              onWishlistToggle={() => setWishlisted((prev) => prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id])}
              isWishlisted={wishlisted.includes(item.id)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: Spacing.sm },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  toolbar: { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingVertical: Spacing.sm, gap: 8 },
  search: { paddingHorizontal: Spacing.md },
  chips: { paddingHorizontal: Spacing.md, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.gray100, borderWidth: 1, borderColor: Colors.borderLight },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.white },
  grid: { padding: Spacing.md, gap: Spacing.sm },
});

