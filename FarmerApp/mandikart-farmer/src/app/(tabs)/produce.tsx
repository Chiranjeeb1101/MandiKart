/**
 * MandiKart Farmer App — Screen 9: My Produce (Inventory Management)
 *
 * Built using MandiKart production layout primitives (MKScreen, MKSection, MKCard).
 * Standardized segmented tabs (Available / Listed / Sold) with equal flex distribution
 * so labels never collide across screen sizes or languages (Hindi/Marathi).
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
  Sprout,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { MKScreen, MKCard, MKStatusBadge } from '@/components/ui';
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
            <Sprout size={22} color={MKColors.primaryGreen} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>My Produce</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage your available and sold crops</Text>
        </View>

        <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatar} />
      </View>

      {/* ── 2. Summary Strip (3 Equal Columns) ── */}
      <View style={styles.summaryStrip}>
        <Pressable
          style={({ pressed }) => [
            styles.summaryBox,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={styles.summaryLabel}>AVAILABLE</Text>
          <Text style={styles.summaryValue}>2,500 KG</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.summaryBox,
            styles.summaryBoxMiddle,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={styles.summaryLabel}>LISTED</Text>
          <Text style={styles.summaryValue}>4</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.summaryBox,
            pressed && { transform: [{ scale: 0.94 }], opacity: 0.88 },
          ]}
        >
          <Text style={styles.summaryLabel}>SOLD</Text>
          <Text style={styles.summaryValue}>1,200 KG</Text>
        </Pressable>
      </View>

      {/* ── 3. Add Produce Primary Banner ── */}
      <Pressable
        onPress={() => router.push('/(tabs)/sell')}
        style={({ pressed }) => [
          styles.addProduceBanner,
          pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
        ]}
      >
        <View style={styles.bannerLeftRow}>
          <View style={styles.plusIconBadge}>
            <Plus size={22} color={MKColors.primaryGreen} strokeWidth={3} />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.addProduceTitle}>+ ADD PRODUCE</Text>
            <Text style={styles.addProduceSubtext}>List your crop & find verified buyers</Text>
          </View>
        </View>

        <View style={styles.bannerArrowBadge}>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </Pressable>

      {/* ── 4. Segmented Filter Tabs (Guaranteed Non-Colliding equal flex distribution) ── */}
      <View style={styles.tabsContainer}>
        {(['Available', 'Listed', 'Sold'] as FilterTab[]).map((tab, idx) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={({ pressed }) => [
              styles.tabBtn,
              idx > 0 && styles.tabBtnMargin,
              activeTab === tab && styles.tabBtnActive,
              pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── 5. Search Field ── */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#7A7A7A" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your produce..."
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
                <View style={styles.badgeWrapper}>
                  <MKStatusBadge label="94% Match" type="match" size="sm" />
                </View>
              </View>
              <Text numberOfLines={1} style={styles.produceSpecs}>
                1,000 KG Available | Harvest: 15 Sep
              </Text>
              <View style={styles.badgeWrapper}>
                <Text style={styles.statusPill}>LISTED</Text>
              </View>
            </View>
          </View>

          {/* Expected Price & Buyers Info */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Expected Price</Text>
              <Text style={styles.priceValue}>
                ₹24 <Text style={styles.priceUnit}>/kg</Text>
              </Text>
            </View>
            <View style={styles.buyersFoundBadge}>
              <Sparkles size={14} color={MKColors.primaryGreen} />
              <Text style={styles.buyersFoundText}>3 buyers found</Text>
            </View>
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
              <ArrowRight size={16} color={MKColors.primaryGreen} strokeWidth={2.5} />
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

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>PARTIALLY SOLD</Text>
                  <Text style={styles.progressPercent}>60%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '60%' }]} />
                </View>
              </View>
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
              <ArrowRight size={16} color={MKColors.primaryGreen} strokeWidth={2.5} />
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
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.lg,
    width: '100%',
  },
  headerLeft: {
    flex: 1,
    marginRight: MKSpacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: MKColors.textPrimary,
    letterSpacing: -0.4,
    marginLeft: MKSpacing.sm,
  },
  headerSubtitle: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
    flexShrink: 0,
  },

  /* ── Summary Strip (3 Equal Columns) ── */
  summaryStrip: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: MKSpacing.lg,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    minWidth: 0,
  },
  summaryBoxMiddle: {
    marginHorizontal: MKSpacing.sm,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: MKColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.primaryGreen,
  },

  /* ── Add Produce Banner ── */
  addProduceBanner: {
    width: '100%',
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2B7038',
    marginBottom: MKSpacing.lg,
  },
  bannerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: MKSpacing.sm,
    minWidth: 0,
  },
  plusIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginRight: MKSpacing.md,
    flexShrink: 0,
  },
  bannerTextCol: {
    flex: 1,
    minWidth: 0,
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
    marginTop: 2,
    fontWeight: '500',
  },
  bannerArrowBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexShrink: 0,
  },

  /* ── Segmented Filter Tabs ── */
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#EAE6DC',
    borderRadius: 14,
    padding: 4,
    marginBottom: MKSpacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 0,
  },
  tabBtnMargin: {
    marginLeft: MKSpacing.xs,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: MKColors.textSecondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: MKColors.primaryGreen,
    fontWeight: '800',
  },

  /* ── Search Bar ── */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    height: 48,
    elevation: 1,
    marginBottom: MKSpacing.lg,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: MKColors.textPrimary,
    fontWeight: '500',
  },

  /* ── Produce Cards List ── */
  produceList: {
    width: '100%',
  },
  produceCard: {
    marginBottom: MKSpacing.md,
  },
  produceRowTop: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  produceThumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    marginRight: MKSpacing.md,
    flexShrink: 0,
  },
  produceDetails: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  produceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
    width: '100%',
  },
  produceName: {
    fontSize: 15,
    fontWeight: '700',
    color: MKColors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  produceSpecs: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginBottom: 6,
  },
  badgeWrapper: {
    flexShrink: 0,
  },
  statusPill: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '800',
    color: MKColors.primaryGreen,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: MKSpacing.md,
    width: '100%',
  },
  priceLabel: {
    fontSize: 10,
    color: '#7A7A7A',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: MKColors.primaryGreen,
  },
  priceUnit: {
    fontSize: 12,
    color: MKColors.textSecondary,
    fontWeight: '500',
  },
  buyersFoundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buyersFoundText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
    marginLeft: 4,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
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
    color: MKColors.primaryGreen,
    letterSpacing: 0.3,
    marginRight: 4,
  },
  editText: {
    fontSize: 12,
    color: MKColors.textSecondary,
    textDecorationLine: 'underline',
  },
  progressContainer: {
    marginTop: 4,
    width: '100%',
  },
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
    color: MKColors.textSecondary,
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
});
