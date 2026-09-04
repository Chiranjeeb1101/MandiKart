/**
 * MandiKart — My Produce Screen (Inventory Management)
 *
 * Rebuilt & Expanded from Stitch Screen: 582eb39f4c6b4a2a96b01b043ce973d6
 * Design System: AgroPremium Tactile
 *
 * Features:
 * - Summary strip reflecting dynamic produce counts & total quantities
 * - 6 detailed produce cards (Onion, Wheat, Tomato, Potato, Maize, Soybean)
 * - Working tab filtering (Available / Listed / Sold)
 * - Working live text search filter
 * - Interactive Edit modal to adjust quantity/price
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Plus,
  Search,
  ArrowRight,
  CheckCircle2,
  Sprout,
  Edit3,
  X,
  Clock,
  Building2,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { MKLayout } from '@/constants/layout';

// ─── Design Tokens (AgroPremium Tactile) ───────────────────────────────────
const C = {
  background: '#F6F1E9',
  surface: '#FFFFFF',
  surfaceContainerLow: '#fff1ea',
  surfaceVariant: '#f3ded3',
  primary: '#964900',
  primaryContainer: '#ef7d1a',
  onPrimary: '#FFFFFF',
  secondary: '#1b6d24',
  onSecondary: '#FFFFFF',
  onSurface: '#241913',
  onSurfaceVariant: '#564336',
  outlineVariant: '#ddc1b0',
  dataMatch: '#E8F5E9',
  onSecondaryContainer: '#217128',
  secondaryContainer: '#a0f399',
  statusWaiting: '#F39C12',
  statusAccepted: '#2E7D32',
};

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

// Produce image URIs
const CROP_IMAGES = {
  Onion:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA',
  Wheat:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1Zj0OQSZz-R5lwjzzVMhfIpQ7UZXXJyh99AhnWV3qwaT4O0bqL8-SHei9CGxNR0OrSLAyvpnMs7-3ByBBSeCVimUuDZZEokQeqa9V0vPd7JtriOCnbXwyG0OZejq9zA4Ag6Tr27my0GcXPmYgPzRqfyiIRMe5nibIxEvfXjrKjMlUkrTBvO_JVftDlMfe6zs6mF3JYv4No9dchmW3SEJlp45WvmqSBErKdRcr7VJWZ5HZiBOkoPdbA',
  Tomato:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw',
  Potato:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ',
  Maize:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDGWtbtdYEsJNCwEKZoi1xfJOZtPORnKD9GPoltpHd8eia8fYdHGOcijL8FHdga770RJTQzAlyHwu2wsbwtX555geY0I6OLsCVJnHMI3NO3tdHMP9YUctgl9S7vP0j7O9hSnek9ToXwIseCbKhXxVlUVQeix2P5A-k9Jo4H6Rlg7z1pLlsu7pgQsvSEkAow2Qvu0M777ZEEfveoswBRPceVJNWkptJtiy_PAbWmzMVcsTX143_2IR9_Kw',
  Soybean:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ',
};

type FilterTab = 'Available' | 'Listed' | 'Sold';

interface ProduceItem {
  id: string;
  name: string;
  grade: string;
  availableKg: number;
  totalKg: number;
  availableDate: string;
  expectedPrice: number;
  buyersFound: number;
  matchPct: number;
  status: 'Listed' | 'Partially Sold' | 'Available' | 'Sold Out';
  imageUri: string;
  soldPct?: number;
}

const INITIAL_PRODUCE_LIST: ProduceItem[] = [
  {
    id: 'p1',
    name: 'Onion',
    grade: 'Grade A',
    availableKg: 1000,
    totalKg: 1000,
    availableDate: '15 Sep 2026',
    expectedPrice: 24,
    buyersFound: 3,
    matchPct: 94,
    status: 'Listed',
    imageUri: CROP_IMAGES.Onion,
  },
  {
    id: 'p2',
    name: 'Wheat',
    grade: 'Grade A',
    availableKg: 500,
    totalKg: 1250,
    availableDate: '20 Sep 2026',
    expectedPrice: 22.5,
    buyersFound: 2,
    matchPct: 88,
    status: 'Partially Sold',
    soldPct: 60,
    imageUri: CROP_IMAGES.Wheat,
  },
  {
    id: 'p3',
    name: 'Red Tomatoes',
    grade: 'Grade A (Hybrid)',
    availableKg: 800,
    totalKg: 800,
    availableDate: '12 Sep 2026',
    expectedPrice: 34,
    buyersFound: 5,
    matchPct: 91,
    status: 'Listed',
    imageUri: CROP_IMAGES.Tomato,
  },
  {
    id: 'p4',
    name: 'Potato (Jyoti)',
    grade: 'Grade A',
    availableKg: 1500,
    totalKg: 1500,
    availableDate: '25 Sep 2026',
    expectedPrice: 18,
    buyersFound: 4,
    matchPct: 85,
    status: 'Available',
    imageUri: CROP_IMAGES.Potato,
  },
  {
    id: 'p5',
    name: 'Yellow Maize',
    grade: 'Standard Grain',
    availableKg: 2000,
    totalKg: 2000,
    availableDate: '30 Sep 2026',
    expectedPrice: 21,
    buyersFound: 2,
    matchPct: 82,
    status: 'Available',
    imageUri: CROP_IMAGES.Maize,
  },
  {
    id: 'p6',
    name: 'Soybean',
    grade: 'Grade A (High Oil)',
    availableKg: 0,
    totalKg: 1200,
    availableDate: '01 Sep 2026',
    expectedPrice: 46,
    buyersFound: 6,
    matchPct: 96,
    status: 'Sold Out',
    soldPct: 100,
    imageUri: CROP_IMAGES.Soybean,
  },
];

const SOFT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 4,
};

export default function ProduceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [items, setItems] = useState<ProduceItem[]>(INITIAL_PRODUCE_LIST);
  const [activeTab, setActiveTab] = useState<FilterTab>('Available');
  const [searchQuery, setSearchQuery] = useState('');

  // Top header and bottom tab clearance
  const topPadding = MKLayout.getTopHeaderPadding(insets);
  const bottomPadding = MKLayout.getBottomTabClearance(insets, 48);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<ProduceItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');

  // Filtered produce items based on tab & search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter logic
      let tabMatches = false;
      if (activeTab === 'Available') {
        tabMatches = item.status === 'Available' || item.status === 'Listed' || item.status === 'Partially Sold';
      } else if (activeTab === 'Listed') {
        tabMatches = item.status === 'Listed' || item.status === 'Partially Sold';
      } else if (activeTab === 'Sold') {
        tabMatches = item.status === 'Sold Out' || item.status === 'Partially Sold';
      }

      // Search query logic
      const queryMatches =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.grade.toLowerCase().includes(searchQuery.toLowerCase());

      return tabMatches && queryMatches;
    });
  }, [items, activeTab, searchQuery]);

  // Compute summary stats dynamically
  const summaryStats = useMemo(() => {
    const availableCount = items.filter((i) => i.status === 'Available' || i.status === 'Listed').length;
    const listedCount = items.filter((i) => i.status === 'Listed' || i.status === 'Partially Sold').length;
    const soldCount = items.filter((i) => i.status === 'Sold Out' || i.status === 'Partially Sold').length;
    return { available: availableCount, listed: listedCount, sold: soldCount };
  }, [items]);

  function openEditModal(item: ProduceItem) {
    setEditingItem(item);
    setEditPrice(item.expectedPrice.toString());
    setEditQty(item.availableKg.toString());
  }

  function saveEdit() {
    if (!editingItem) return;
    const priceNum = parseFloat(editPrice);
    const qtyNum = parseInt(editQty, 10);

    if (isNaN(priceNum) || isNaN(qtyNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numeric price and quantity.');
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              expectedPrice: priceNum,
              availableKg: qtyNum,
              totalKg: Math.max(i.totalKg, qtyNum),
            }
          : i
      )
    );

    setEditingItem(null);
    Alert.alert('Success', `${editingItem.name} details updated successfully.`);
  }

  return (
    <View style={styles.root}>
      {/* ── Background Blobs with pointerEvents="none" ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.blobOrange} />
        <View style={styles.blobGreen} />
        <View style={styles.blobFade} />
      </View>

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitleRow}>
            <Sprout size={22} color={C.primary} strokeWidth={2.2} style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>{t.myProduce}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t.manageCropsOffers}</Text>
        </View>
        <View style={styles.headerRightCol}>
          <Image source={{ uri: user?.avatarUri || FARMER_AVATAR_URI }} style={styles.headerAvatar} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Summary Strip ── */}
        <View style={styles.summaryStrip}>
          <Pressable style={styles.summaryPill} onPress={() => setActiveTab('Available')}>
            <Text style={styles.summaryLabel}>{t.available.toUpperCase()}</Text>
            <Text style={styles.summaryValue}>{summaryStats.available}</Text>
          </Pressable>
          <Pressable style={styles.summaryPill} onPress={() => setActiveTab('Listed')}>
            <Text style={styles.summaryLabel}>{t.listed.toUpperCase()}</Text>
            <Text style={styles.summaryValue}>{summaryStats.listed}</Text>
          </Pressable>
          <Pressable style={styles.summaryPill} onPress={() => setActiveTab('Sold')}>
            <Text style={styles.summaryLabel}>{t.sold.toUpperCase()}</Text>
            <Text style={styles.summaryValue}>{summaryStats.sold}</Text>
          </Pressable>
        </View>

        {/* ── ADD PRODUCE CTA (Ultra Prominent & Visible) ── */}
        <Pressable
          style={({ pressed }) => [styles.addProduceBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => router.push('/(tabs)/sell')}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          <View style={styles.addProduceBtnInner}>
            <Plus size={22} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.addProduceBtnText}>ADD PRODUCE</Text>
          </View>
          <Text style={styles.addProduceSubtext}>List your crop and get best buyer offers</Text>
        </Pressable>

        {/* ── Filter Tabs ── */}
        <View style={styles.filterTabsWrapper}>
          {(['Available', 'Listed', 'Sold'] as FilterTab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.filterTab, activeTab === tab && styles.filterTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.filterTabText, activeTab === tab && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchWrapper}>
          <Search size={18} color={C.onSurfaceVariant} strokeWidth={2} style={{ marginLeft: 16, marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search produce name or grade..."
            placeholderTextColor={C.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={{ paddingRight: 16 }}>
              <X size={16} color={C.onSurfaceVariant} />
            </Pressable>
          ) : null}
        </View>

        {/* ── Produce Cards List ── */}
        <View style={styles.cardsList}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Sprout size={40} color={C.outlineVariant} />
              <Text style={styles.emptyTitle}>No produce found</Text>
              <Text style={styles.emptySub}>Try changing your filter tab or search query</Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.produceCard}>
                <View style={styles.cardTopRow}>
                  <Image source={{ uri: item.imageUri }} style={styles.cropImage} />
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cropName}>
                        {item.name} • {item.grade}
                      </Text>
                      {item.matchPct ? (
                        <View style={styles.matchBadge}>
                          <CheckCircle2 size={12} color={C.onSecondaryContainer} strokeWidth={2.5} style={{ marginRight: 3 }} />
                          <Text style={styles.matchText}>{item.matchPct}% Match</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.cropMeta}>
                      {item.availableKg.toLocaleString('en-IN')} KG Available | Avail: {item.availableDate}
                    </Text>

                    <View
                      style={[
                        styles.listedChip,
                        item.status === 'Sold Out' && { backgroundColor: '#FADBD8' },
                        item.status === 'Available' && { backgroundColor: '#EBF5FB' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.listedChipText,
                          item.status === 'Sold Out' && { color: '#C0392B' },
                          item.status === 'Available' && { color: '#2980B9' },
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Progress bar if partially sold */}
                {item.soldPct !== undefined && item.soldPct < 100 && (
                  <View style={styles.progressWrapper}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.partiallySoldLabel}>PROGRESS</Text>
                      <Text style={styles.progressPct}>{item.soldPct}% Sold</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${item.soldPct}%` }]} />
                    </View>
                  </View>
                )}

                {/* Expected Price Box */}
                {item.status !== 'Sold Out' && (
                  <View style={styles.priceBox}>
                    <View>
                      <Text style={styles.priceLabel}>Expected Price</Text>
                      <Text style={styles.priceValue}>
                        ₹{item.expectedPrice}
                        <Text style={styles.priceUnit}>/kg</Text>
                      </Text>
                    </View>
                    <Text style={styles.buyersFound}>{item.buyersFound} buyers interested</Text>
                  </View>
                )}

                {/* Card Footer Actions */}
                <View style={styles.cardFooter}>
                  <Pressable
                    style={styles.viewOptionsBtn}
                    onPress={() => router.push('/(tabs)/sell')}
                  >
                    <Text style={styles.viewOptionsBtnText}>VIEW BEST OPTIONS</Text>
                    <ArrowRight size={14} color={C.secondary} strokeWidth={2.5} />
                  </Pressable>
                  <Pressable style={styles.editBtn} onPress={() => openEditModal(item)}>
                    <Edit3 size={14} color={C.onSurfaceVariant} style={{ marginRight: 4 }} />
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Edit Produce Modal ── */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editingItem?.name}</Text>
              <Pressable onPress={() => setEditingItem(null)}>
                <X size={20} color={C.onSurfaceVariant} />
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Available Quantity (KG)</Text>
              <TextInput
                style={styles.modalInput}
                value={editQty}
                onChangeText={setEditQty}
                keyboardType="number-pad"
              />

              <Text style={styles.inputLabel}>Expected Price (₹/kg)</Text>
              <TextInput
                style={styles.modalInput}
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="decimal-pad"
              />

              <View style={styles.modalActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setEditingItem(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={saveEdit}>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  blobOrange: {
    position: 'absolute',
    top: -60, left: -80, width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(239,125,26,0.18)',
  },
  blobGreen: {
    position: 'absolute',
    bottom: 60, right: -80, width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(27,109,36,0.16)',
  },
  blobFade: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(246,241,233,0.78)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 10,
  },
  headerLeft: { flex: 1, minWidth: 0 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: C.primary, letterSpacing: -0.3, flexShrink: 1 },
  headerSubtitle: { fontSize: 13, color: C.onSurfaceVariant, marginTop: 2, flexShrink: 1 },
  headerRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    marginLeft: 8,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B6D24',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
    shadowColor: '#1B6D24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: C.surface, ...SOFT_SHADOW },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },

  summaryStrip: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  summaryPill: { flex: 1, minWidth: 0, backgroundColor: C.surface, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center', ...SOFT_SHADOW },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 0.2, marginBottom: 4, textAlign: 'center' },
  summaryValue: { fontSize: 15, fontWeight: '700', color: C.primary, textAlign: 'center', flexShrink: 1 },

  // Ultra Visible Add Produce Banner CTA
  addProduceBtn: {
    backgroundColor: '#1B6D24',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    overflow: 'hidden',
    shadowColor: '#1B6D24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  addProduceBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addProduceBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  addProduceSubtext: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 4,
    fontWeight: '500',
  },

  // Floating Action Button (Safely elevated above bottom tab navigation)
  fabAddProduce: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B6D24',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 6,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },
  fabAddProduceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  filterTabsWrapper: { flexDirection: 'row', backgroundColor: C.surfaceVariant, borderRadius: 12, padding: 4, marginBottom: 14 },
  filterTab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  filterTabActive: { backgroundColor: C.surface, ...SOFT_SHADOW },
  filterTabText: { fontSize: 13, fontWeight: '500', color: C.onSurfaceVariant },
  filterTabTextActive: { fontWeight: '700', color: C.onSurface },

  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 50, borderWidth: 1, borderColor: C.outlineVariant, marginBottom: 16, height: 48, ...SOFT_SHADOW },
  searchInput: { flex: 1, fontSize: 14, color: C.onSurface, paddingRight: 16 },

  cardsList: { gap: 14 },
  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.onSurface, marginTop: 12 },
  emptySub: { fontSize: 13, color: C.onSurfaceVariant, textAlign: 'center', marginTop: 4 },

  produceCard: { backgroundColor: C.surface, borderRadius: 20, padding: 16, ...SOFT_SHADOW },
  cardTopRow: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  cropImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: C.surfaceVariant, flexShrink: 0 },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  cropName: { fontSize: 15, fontWeight: '700', color: C.onSurface, flex: 1, minWidth: 0, marginRight: 8 },
  matchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.dataMatch, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, flexShrink: 0 },
  matchText: { fontSize: 10, fontWeight: '700', color: C.onSecondaryContainer, letterSpacing: 0.4 },
  cropMeta: { fontSize: 12, color: C.onSurfaceVariant, marginBottom: 8, flexShrink: 1 },
  listedChip: { backgroundColor: 'rgba(160, 243, 153, 0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  listedChipText: { fontSize: 10, fontWeight: '700', color: C.statusAccepted, letterSpacing: 0.6 },

  progressWrapper: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  partiallySoldLabel: { fontSize: 10, fontWeight: '700', color: C.statusWaiting, letterSpacing: 0.5 },
  progressPct: { fontSize: 11, fontWeight: '500', color: C.onSurfaceVariant },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.surfaceVariant, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: C.statusWaiting },

  priceBox: { backgroundColor: C.surfaceContainerLow, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(221,193,176,0.25)' },
  priceLabel: { fontSize: 11, color: C.onSurfaceVariant, marginBottom: 2 },
  priceValue: { fontSize: 22, fontWeight: '700', color: C.primary, letterSpacing: -0.5 },
  priceUnit: { fontSize: 13, fontWeight: '400', color: C.onSurfaceVariant },
  buyersFound: { fontSize: 12, fontWeight: '500', color: C.onSurfaceVariant, flexShrink: 0 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(221,193,176,0.2)', paddingTop: 10, gap: 8 },
  viewOptionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 },
  viewOptionsBtnText: { fontSize: 12, fontWeight: '700', color: C.secondary, letterSpacing: 0.4, flexShrink: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  editText: { fontSize: 13, fontWeight: '500', color: C.onSurfaceVariant },

  // Modal styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: C.surface, borderRadius: 20, padding: 20, ...SOFT_SHADOW },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface },
  modalBody: { gap: 12 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: C.onSurface },
  modalInput: { backgroundColor: C.background, borderWidth: 1.5, borderColor: C.outlineVariant, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.onSurface },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: { flex: 1, backgroundColor: C.surfaceVariant, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: C.onSurfaceVariant },
  saveBtn: { flex: 1, backgroundColor: C.secondary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: C.onSecondary },
});
