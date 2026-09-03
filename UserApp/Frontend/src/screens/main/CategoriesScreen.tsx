import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Image, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import SearchBar from '../../components/SearchBar';
import { SAMPLE_CATEGORIES } from '../../services/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SortOption = 'name-asc' | 'name-desc' | 'count-high' | 'count-low';
type GroupFilter = 'ALL' | 'PRODUCE' | 'GRAINS' | 'HERBS';

export default function CategoriesScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('ALL');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const getSortLabel = (opt: SortOption) => {
    switch (opt) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'count-high': return 'Items (High-Low)';
      case 'count-low': return 'Items (Low-High)';
    }
  };

  const filtered = SAMPLE_CATEGORIES.filter((c) => {
    // Search match
    if (!c.name.toLowerCase().includes(search.toLowerCase())) return false;

    // Group filter match
    if (groupFilter === 'PRODUCE' && !(c.id === 'cat-1' || c.id === 'cat-2')) return false;
    if (groupFilter === 'GRAINS' && !(c.id === 'cat-3' || c.id === 'cat-6')) return false;
    if (groupFilter === 'HERBS' && !(c.id === 'cat-5' || c.id === 'cat-8')) return false;

    return true;
  }).sort((a, b) => {
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOption === 'count-high') return b.productCount - a.productCount;
    if (sortOption === 'count-low') return a.productCount - b.productCount;
    return 0;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Explore Categories</Text>
            <Text style={styles.subtitle}>{filtered.length} of {SAMPLE_CATEGORIES.length} categories</Text>
          </View>

          {/* Filter & Sort Button */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="options-outline" size={16} color={Colors.primary} />
            <Text style={styles.filterBtnText}>{getSortLabel(sortOption)}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search categories..."
        />

        {/* Quick Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'PRODUCE', label: 'Veg & Fruits 🍎' },
            { key: 'GRAINS', label: 'Grains & Pulses 🌾' },
            { key: 'HERBS', label: 'Herbs & Spices 🌿' },
          ].map((chip) => {
            const active = groupFilter === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[styles.groupChip, active && styles.groupChipActive]}
                onPress={() => setGroupFilter(chip.key as GroupFilter)}
              >
                <Text style={[styles.groupChipText, active && styles.groupChipTextActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={48} color={Colors.textDisabled} />
            <Text style={styles.emptyText}>No categories found matching your filter.</Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSearch('');
                setGroupFilter('ALL');
                setSortOption('name-asc');
              }}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ProductStack', {
                screen: 'ProductListing',
                params: { categoryId: item.id, categoryName: item.name },
              })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardImage, styles.cardFallback]}>
                <Text style={styles.cardEmoji}>{item.icon}</Text>
              </View>
            )}

            <View style={styles.cardContent}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardCount}>{item.productCount} items</Text>
                <View style={styles.arrowBg}>
                  <Ionicons name="chevron-forward" size={12} color={Colors.primary} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Filter & Sort Bottom Sheet Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter Categories</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionTitle}>Sort By</Text>
            <View style={styles.sortOptionsList}>
              {[
                { key: 'name-asc', label: 'Name: A to Z', icon: 'text' },
                { key: 'name-desc', label: 'Name: Z to A', icon: 'text' },
                { key: 'count-high', label: 'Item Count: High to Low', icon: 'trending-up' },
                { key: 'count-low', label: 'Item Count: Low to High', icon: 'trending-down' },
              ].map((opt) => {
                const isSelected = sortOption === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.sortRow, isSelected && styles.sortRowSelected]}
                    onPress={() => {
                      setSortOption(opt.key as SortOption);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={18}
                      color={isSelected ? Colors.primary : Colors.textSecondary}
                    />
                    <Text style={[styles.sortRowLabel, isSelected && styles.sortRowLabelSelected]}>
                      {opt.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  // Filter Button
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(35, 134, 54, 0.2)',
  },
  filterBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  // Chips
  chipRow: { gap: 6, paddingTop: 4 },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  groupChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  groupChipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  groupChipTextActive: { color: Colors.white },
  // Grid
  grid: { padding: Spacing.md, paddingTop: 0, gap: Spacing.md },
  row: { gap: Spacing.md },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  cardImage: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.gray100,
  },
  cardFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  cardEmoji: { fontSize: 40 },
  cardContent: {
    padding: Spacing.sm + 2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  arrowBg: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  // Empty
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: { fontSize: 13, color: Colors.textSecondary },
  resetBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  resetBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  // Modal Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  modalSectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginTop: 4 },
  sortOptionsList: { gap: Spacing.sm },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  sortRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  sortRowLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  sortRowLabelSelected: { color: Colors.primary, fontWeight: '700' },
});
