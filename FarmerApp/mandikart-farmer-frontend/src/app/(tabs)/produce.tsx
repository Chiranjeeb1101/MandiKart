/**
 * MandiKart Farmer App — Screen 9: My Produce (Inventory Management)
 *
 * Matches the official MandiKart design standard (Image 4):
 * - Tractor header with warm brown title and subtitle
 * - 3 separate white stat cards (AVAILABLE, LISTED, SOLD)
 * - Solid dark green centered "+ ADD PRODUCE" banner
 * - Rounded segmented filter tabs (Available, Listed, Sold)
 * - Pill search bar with icon
 * - Rich crop cards with soft peach Expected Price card and clean action footer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Tractor,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { MKScreen, MKCard } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const ONION_IMG_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA';

const WHEAT_IMG_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1Zj0OQSZz-R5lwjzzVMhfIpQ7UZXXJyh99AhnWV3qwaT4O0bqL8-SHei9CGxNR0OrSLAyvpnMs7-3ByBBSeCVimUuDZZEokQeqa9V0vPd7JtriOCnbXwyG0OZejq9zA4Ag6Tr27my0GcXPmYgPzRqfyiIRMe5nibIxEvfXjrKjMlUkrTBvO_JVftDlMfe6zs6mF3JYv4No9dchmW3SEJlp45WvmqSBErKdRcr7VJWZ5HZiBOkoPdbA';

type FilterTab = 'Available' | 'Listed' | 'Sold';

export default function ProduceScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FilterTab>('Available');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MKScreen>
      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitleRow}>
            <Tractor size={24} color="#8D5018" strokeWidth={2.2} style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>My Produce</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage your available and sold produce</Text>
        </View>

        <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatar} />
      </View>

      {/* ── 2. Summary Strip (3 Distinct Cards) ── */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>AVAILABLE</Text>
          <Text style={styles.summaryValue}>2,500 KG</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>LISTED</Text>
          <Text style={styles.summaryValue}>4</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>SOLD</Text>
          <Text style={styles.summaryValue}>1,200 KG</Text>
        </View>
      </View>

      {/* ── 3. Add Produce Primary Banner (Centered Green Card) ── */}
      <Pressable
        onPress={() => router.push('/(tabs)/sell')}
        style={({ pressed }) => [
          styles.addProduceBanner,
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        ]}
      >
        <View style={styles.bannerCenterContent}>
          <View style={styles.bannerTitleRow}>
            <Plus size={20} color="#FFFFFF" strokeWidth={3.5} style={{ marginRight: 6 }} />
            <Text style={styles.addProduceTitle}>ADD PRODUCE</Text>
          </View>
          <Text style={styles.addProduceSubtext}>List your crop and find buyers</Text>
        </View>
      </Pressable>

      {/* ── 4. Segmented Filter Tabs (Warm Cream Pill Container) ── */}
      <View style={styles.tabsContainer}>
        {(['Available', 'Listed', 'Sold'] as FilterTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => [
                styles.tabBtn,
                isActive && styles.tabBtnActive,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── 5. Search Bar ── */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#7A7A7A" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your produce"
          placeholderTextColor="#9AA0A6"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ── 6. Produce Cards List ── */}
      <View style={styles.produceList}>
        {/* Card 1: Onion */}
        <MKCard style={styles.produceCard} onPress={() => router.push('/(tabs)/sell')}>
          <View style={styles.produceRowTop}>
            <Image source={{ uri: ONION_IMG_URI }} style={styles.produceThumb} />
            <View style={styles.produceDetails}>
              <View style={styles.produceTitleRow}>
                <Text numberOfLines={1} style={styles.produceName}>
                  Onion • Grade A
                </Text>
                <View style={styles.matchBadge}>
                  <CheckCircle2 size={13} color="#1E6B2C" />
                  <Text style={styles.matchBadgeText}>94% Match</Text>
                </View>
              </View>
              <Text numberOfLines={1} style={styles.produceSpecs}>
                1,000 KG Available | Avail: 15 Sep 2026
              </Text>
              <View style={styles.listedBadgeWrapper}>
                <Text style={styles.listedBadgeText}>LISTED</Text>
              </View>
            </View>
          </View>

          {/* Expected Price & Buyers Info (Soft Peach Box) */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Expected Price</Text>
              <Text style={styles.priceValue}>
                ₹24<Text style={styles.priceUnit}>/kg</Text>
              </Text>
            </View>
            <Text style={styles.buyersFoundText}>3 buyers found</Text>
          </View>

          {/* Action Bottom */}
          <View style={styles.cardActionRow}>
            <Pressable
              onPress={() => router.push('/(tabs)/sell')}
              style={({ pressed }) => [
                styles.viewOptionsBtn,
                pressed && { opacity: 0.6, transform: [{ scale: 0.96 }] },
              ]}
            >
              <Text style={styles.viewOptionsText}>VIEW BEST OPTIONS</Text>
              <ArrowRight size={15} color="#1E6B2C" strokeWidth={2.5} style={{ marginLeft: 4 }} />
            </Pressable>

            <Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </MKCard>

        {/* Card 2: Wheat */}
        <MKCard style={styles.produceCard} onPress={() => router.push('/(tabs)/orders')}>
          <View style={styles.produceRowTop}>
            <Image source={{ uri: WHEAT_IMG_URI }} style={styles.produceThumb} />
            <View style={styles.produceDetails}>
              <Text numberOfLines={1} style={styles.produceName}>
                Wheat • Grade A
              </Text>
              <Text style={styles.produceSpecs}>500 KG Available</Text>
            </View>
          </View>

          {/* Wheat Progress & Sold Status Box */}
          <View style={styles.priceRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>PARTIALLY SOLD</Text>
                <Text style={styles.progressPercent}>60% (300 KG)</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '60%' }]} />
              </View>
            </View>
            <View style={styles.wheatBadge}>
              <Text style={styles.wheatBadgeText}>1 Active Truck</Text>
            </View>
          </View>

          {/* Action Bottom */}
          <View style={styles.cardActionRow}>
            <Pressable
              onPress={() => router.push('/(tabs)/orders')}
              style={({ pressed }) => [
                styles.viewOptionsBtn,
                pressed && { opacity: 0.6, transform: [{ scale: 0.96 }] },
              ]}
            >
              <Text style={styles.viewOptionsText}>VIEW ORDER</Text>
              <ArrowRight size={15} color="#1E6B2C" strokeWidth={2.5} style={{ marginLeft: 4 }} />
            </Pressable>

            <Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </MKCard>
      </View>
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── 1. Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.lg,
    width: '100%',
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8D5018',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7C6E61',
    fontWeight: '500',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: MKSpacing.md,
    flexShrink: 0,
  },

  /* ── 2. Summary Strip (3 Distinct Cards) ── */
  summaryStrip: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: MKSpacing.lg,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    borderWidth: 1.2,
    borderColor: '#EFE7DC',
    minWidth: 0,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5E3C',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8B4513',
  },

  /* ── 3. Add Produce Primary Banner (Centered) ── */
  addProduceBanner: {
    width: '100%',
    backgroundColor: '#1E6B2C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1E6B2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#175522',
    marginBottom: MKSpacing.lg,
  },
  bannerCenterContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  addProduceTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  addProduceSubtext: {
    fontSize: 12,
    color: '#E8F5E9',
    fontWeight: '500',
  },

  /* ── 4. Segmented Filter Tabs (Warm Cream Container) ── */
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F3EDE4',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: MKSpacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 0,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C6E61',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#212121',
    fontWeight: '800',
  },

  /* ── 5. Search Bar (Pill Shape) ── */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E8E2D8',
    paddingHorizontal: 16,
    height: 46,
    marginBottom: MKSpacing.lg,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    width: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#212121',
    paddingVertical: 0,
  },

  /* ── 6. Produce List & Cards ── */
  produceList: {
    width: '100%',
  },
  produceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    padding: 16,
    marginBottom: MKSpacing.md,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  produceRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  produceThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#FAF9F6',
    flexShrink: 0,
  },
  produceDetails: {
    flex: 1,
    minWidth: 0,
  },
  produceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  produceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    flex: 1,
    marginRight: 6,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E6B2C',
    marginLeft: 4,
  },
  produceSpecs: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 6,
  },
  listedBadgeWrapper: {
    alignSelf: 'flex-start',
  },
  listedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    letterSpacing: 0.5,
  },

  /* Price Row (Soft Warm Peach) */
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F8E7D8',
    marginBottom: 14,
    width: '100%',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8D6E63',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#A0522D',
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8D6E63',
  },
  buyersFoundText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
  },

  /* Wheat specifics */
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: MKColors.accentOrange,
  },
  progressPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: '#757575',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0ECE4',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MKColors.accentOrange,
    borderRadius: 3,
  },
  wheatBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  wheatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E65100',
  },

  /* Action Row */
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
    paddingTop: 10,
    width: '100%',
  },
  viewOptionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewOptionsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E6B2C',
    letterSpacing: 0.5,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5D4037',
    textDecorationLine: 'underline',
  },
});
