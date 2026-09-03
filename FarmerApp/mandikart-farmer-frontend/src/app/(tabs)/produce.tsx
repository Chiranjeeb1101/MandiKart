/**
 * MandiKart Farmer App — Screen 9: My Produce (Inventory Management)
 * 
 * Implements the approved Stitch visual design:
 * Header with farmer avatar, 3-metric summary strip (Available, Listed, Sold),
 * "+ ADD PRODUCE" primary banner, category filter tabs, search bar, and
 * produce inventory cards with status badges and buyer matching.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sprout,
  Plus,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { MKBackground, MKCard, MKStatusBadge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

const FARMER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const ONION_IMG_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA';

const WHEAT_IMG_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1Zj0OQSZz-R5lwjzzVMhfIpQ7UZXXJyh99AhnWV3qwaT4O0bqL8-SHei9CGxNR0OrSLAyvpnMs7-3ByBBSeCVimUuDZZEokQeqa9V0vPd7JtriOCnbXwyG0OZejq9zA4Ag6Tr27my0GcXPmYgPzRqfyiIRMe5nibIxEvfXjrKjMlUkrTBvO_JVftDlMfe6zs6mF3JYv4No9dchmW3SEJlp45WvmqSBErKdRcr7VJWZ5HZiBOkoPdbA';

type FilterTab = 'Available' | 'Listed' | 'Sold';

export default function ProduceScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<FilterTab>('Available');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.headerTitleRow}>
              <Sprout size={22} color="#1E5A2A" strokeWidth={2.5} />
              <Text style={styles.headerTitle}>My Produce</Text>
            </View>
            <Text style={styles.headerSubtitle}>Manage your available and sold crops</Text>
          </View>

          <Image source={{ uri: FARMER_AVATAR_URI }} style={styles.avatar} />
        </View>

        {/* Summary Strip (3 Columns) */}
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

        {/* Add Produce Primary Banner */}
        <Pressable
          onPress={() => router.push('/(tabs)/sell')}
          style={({ pressed }) => [
            styles.addProduceBanner,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <View style={styles.addProduceRow}>
            <Plus size={20} color="#FFFFFF" strokeWidth={3} />
            <Text style={styles.addProduceTitle}>ADD PRODUCE</Text>
          </View>
          <Text style={styles.addProduceSubtext}>List your crop and find verified buyers</Text>
        </Pressable>

        {/* Segmented Filter Tabs */}
        <View style={styles.tabsContainer}>
          {(['Available', 'Listed', 'Sold'] as FilterTab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Search Field */}
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

        {/* Produce Cards List */}
        <View style={styles.produceList}>
          {/* Card 1: Onion */}
          <MKCard style={styles.produceCard}>
            <View style={styles.produceRowTop}>
              <Image source={{ uri: ONION_IMG_URI }} style={styles.produceThumb} />
              <View style={styles.produceDetails}>
                <View style={styles.produceTitleRow}>
                  <Text style={styles.produceName}>Onion • Grade A</Text>
                  <MKStatusBadge label="94% Match" type="match" size="sm" />
                </View>
                <Text style={styles.produceSpecs}>
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
                <Sparkles size={14} color="#1E5A2A" />
                <Text style={styles.buyersFoundText}>3 buyers found</Text>
              </View>
            </View>

            {/* Action Bottom */}
            <View style={styles.cardActionRow}>
              <Pressable
                onPress={() => router.push('/(tabs)/sell')}
                style={styles.viewOptionsBtn}
              >
                <Text style={styles.viewOptionsText}>VIEW BEST OPTIONS</Text>
                <ArrowRight size={16} color="#1E5A2A" strokeWidth={2.5} />
              </Pressable>

              <Pressable>
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          </MKCard>

          {/* Card 2: Wheat */}
          <MKCard style={styles.produceCard}>
            <View style={styles.produceRowTop}>
              <Image source={{ uri: WHEAT_IMG_URI }} style={styles.produceThumb} />
              <View style={styles.produceDetails}>
                <Text style={styles.produceName}>Wheat • Grade A</Text>
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
                style={styles.viewOptionsBtn}
              >
                <Text style={styles.viewOptionsText}>VIEW ORDER</Text>
                <ArrowRight size={16} color="#1E5A2A" strokeWidth={2.5} />
              </Pressable>

              <Pressable>
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          </MKCard>
        </View>
      </ScrollView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 28,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  summaryStrip: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5F6368',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E5A2A',
  },
  addProduceBanner: {
    backgroundColor: '#1E5A2A',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#16481A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  addProduceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addProduceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  addProduceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0ECE4',
    borderRadius: 14,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F6368',
  },
  tabTextActive: {
    color: '#1A1C1E',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1C1E',
    fontWeight: '500',
  },
  produceList: {
    gap: 14,
  },
  produceCard: {
    padding: 16,
    gap: 12,
  },
  produceRowTop: {
    flexDirection: 'row',
    gap: 14,
  },
  produceThumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },
  produceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  produceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  produceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  produceSpecs: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 6,
  },
  badgeWrapper: {},
  statusPill: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '800',
    color: '#1E5A2A',
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
  },
  priceLabel: {
    fontSize: 10,
    color: '#7A7A7A',
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E5A2A',
  },
  priceUnit: {
    fontSize: 12,
    color: '#5F6368',
    fontWeight: '500',
  },
  buyersFoundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buyersFoundText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingTop: 10,
  },
  viewOptionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewOptionsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: 0.3,
  },
  editText: {
    fontSize: 12,
    color: '#5F6368',
    textDecorationLine: 'underline',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF7D1A',
  },
  progressPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5F6368',
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
    backgroundColor: '#EF7D1A',
    borderRadius: 3,
  },
});
