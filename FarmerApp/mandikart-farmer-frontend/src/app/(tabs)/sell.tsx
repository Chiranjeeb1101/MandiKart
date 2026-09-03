/**
 * MandiKart — Sell Produce Screen
 *
 * Rebuilt to match the exact design screenshot (Image 2):
 * 1. Top Bar — White circle Back button, "Sell Produce" title, White circle Bell button with orange badge
 * 2. Main White Container Card:
 *    - "What do you want to sell?" title
 *    - Crop horizontal cards: Onion (Selected orange border + dish image), Tomato, Potato, + Add New (dashed border)
 *    - Quantity (KG) stepper pill (- 1,000 +) & Quality Grade dropdown pill (Grade A ∨)
 * 3. Two Side-by-Side Metric Cards:
 *    - Nashik Market ↗ (₹20-24/kg, ↑ +₹2 from yesterday)
 *    - Buyer Demand 🔥 (High 🔥, 15+ active buyers)
 * 4. Top Match Card (★ TOP MATCH FOR YOU):
 *    - 94% MATCH badge
 *    - Estimated Net Return ₹22.00 /kg, Selling Price ₹24.00/kg, - ₹2.00/kg Transport
 *    - Buyer: ABC Foods ✔
 * 5. Sticky Bottom CTA Button — "FIND BEST SELLING OPTIONS ➔"
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Bell,
  Plus,
  Minus,
  ChevronDown,
  ArrowUpRight,
  Flame,
  Star,
  CheckCircle2,
  ArrowRight,
  Store,
  Users,
} from 'lucide-react-native';

const C = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  primaryOrange: '#EF7D1A',
  selectedCropBg: '#FFF5ED',
  secondaryGreen: '#1B6D24',
  onSecondary: '#FFFFFF',
  onSurface: '#241913',
  onSurfaceVariant: '#6B7280',
  outlineVariant: '#EFEAE0',
  dataMatchBg: '#E8F5E9',
  dataMatchText: '#1B6D24',
  redTransport: '#D9531E',
  greenTrend: '#1B6D24',
};

const SOFT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
};

// Crop option images
const CROP_IMAGES = {
  Onion:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA',
  Tomato:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw',
  Potato:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ',
  BuyerAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ',
};

export default function SellScreen() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState<'Onion' | 'Tomato' | 'Potato'>('Onion');
  const [quantity, setQuantity] = useState('1,000');
  const [grade, setGrade] = useState('Grade A');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);

  function adjustQuantity(delta: number) {
    const num = parseInt(quantity.replace(/,/g, ''), 10) || 1000;
    const next = Math.max(100, num + delta);
    setQuantity(next.toLocaleString('en-US'));
  }

  function handleFindBestOptions() {
    Alert.alert(
      'Searching Best Buyers...',
      `Finding top offers for ${quantity} KG of ${selectedCrop} (${grade})`,
      [
        {
          text: 'View AI Matches',
          onPress: () => router.push('/(tabs)/orders'),
        },
      ]
    );
  }

  return (
    <View style={styles.root}>
      {/* Background blobs */}
      <View style={styles.blobOrange} />
      <View style={styles.blobGreen} />

      {/* ── Top App Bar (Exact Match Image 2) ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.circleBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={C.onSurface} strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle}>Sell Produce</Text>

        <View style={styles.bellWrapper}>
          <Pressable style={styles.circleBtn} onPress={() => router.push('/more/notifications')}>
            <Bell size={20} color={C.onSurface} strokeWidth={2} />
          </Pressable>
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Main Container Card (What do you want to sell?) ── */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>What do you want to sell?</Text>

          {/* Crop Horizontal Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropSelectorContainer}
          >
            {/* Onion (Selected) */}
            <Pressable
              style={[
                styles.cropCard,
                selectedCrop === 'Onion' && styles.cropCardSelected,
              ]}
              onPress={() => setSelectedCrop('Onion')}
            >
              <Image source={{ uri: CROP_IMAGES.Onion }} style={styles.cropImg} />
              <Text
                style={[
                  styles.cropLabel,
                  selectedCrop === 'Onion' && styles.cropLabelSelected,
                ]}
              >
                Onion
              </Text>
            </Pressable>

            {/* Tomato */}
            <Pressable
              style={[
                styles.cropCard,
                selectedCrop === 'Tomato' && styles.cropCardSelected,
              ]}
              onPress={() => setSelectedCrop('Tomato')}
            >
              <Image source={{ uri: CROP_IMAGES.Tomato }} style={styles.cropImg} />
              <Text
                style={[
                  styles.cropLabel,
                  selectedCrop === 'Tomato' && styles.cropLabelSelected,
                ]}
              >
                Tomato
              </Text>
            </Pressable>

            {/* Potato */}
            <Pressable
              style={[
                styles.cropCard,
                selectedCrop === 'Potato' && styles.cropCardSelected,
              ]}
              onPress={() => setSelectedCrop('Potato')}
            >
              <Image source={{ uri: CROP_IMAGES.Potato }} style={styles.cropImg} />
              <Text
                style={[
                  styles.cropLabel,
                  selectedCrop === 'Potato' && styles.cropLabelSelected,
                ]}
              >
                Potato
              </Text>
            </Pressable>

            {/* + Add New */}
            <Pressable
              style={styles.addNewCard}
              onPress={() => Alert.alert('Add Crop', 'Enter crop details to add a new variety.')}
            >
              <View style={styles.addNewPlusCircle}>
                <Plus size={20} color={C.onSurfaceVariant} strokeWidth={2} />
              </View>
              <Text style={styles.addNewText}>Add{'\n'}New</Text>
            </Pressable>
          </ScrollView>

          {/* Quantity & Grade Controls Row */}
          <View style={styles.controlsRow}>
            {/* Quantity Input Box */}
            <View style={styles.controlCol}>
              <Text style={styles.controlLabel}>Quantity (KG)</Text>
              <View style={styles.stepperPill}>
                <Pressable style={styles.stepperBtn} onPress={() => adjustQuantity(-100)}>
                  <Minus size={16} color={C.primaryOrange} strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.stepperValue}>{quantity}</Text>
                <Pressable style={styles.stepperBtn} onPress={() => adjustQuantity(100)}>
                  <Plus size={16} color={C.primaryOrange} strokeWidth={2.5} />
                </Pressable>
              </View>
            </View>

            {/* Quality Grade Dropdown Box */}
            <View style={styles.controlCol}>
              <Text style={styles.controlLabel}>Quality Grade</Text>
              <Pressable
                style={styles.dropdownPill}
                onPress={() => setShowGradeDropdown(!showGradeDropdown)}
              >
                <Text style={styles.dropdownValue}>{grade}</Text>
                <ChevronDown size={18} color={C.onSurfaceVariant} />
              </Pressable>

              {/* Dropdown Options */}
              {showGradeDropdown && (
                <View style={styles.dropdownMenu}>
                  {['Grade A', 'Grade B', 'Grade C', 'Organic'].map((g) => (
                    <Pressable
                      key={g}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setGrade(g);
                        setShowGradeDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownMenuText,
                          grade === g && { fontWeight: '700', color: C.secondaryGreen },
                        ]}
                      >
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ── Two Metric Cards Side-by-Side (Exact Match Image 2) ── */}
        <View style={styles.metricsRow}>
          {/* Card 1: Nashik Market */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Store size={15} color={C.onSurface} style={{ marginRight: 4 }} />
              <Text style={styles.metricCardTitle}>Nashik Market</Text>
              <ArrowUpRight size={14} color="#3498DB" style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.metricCardPrice}>₹20-24/kg</Text>
            <Text style={styles.metricCardSubGreen}>↑ +₹2 from yesterday</Text>
          </View>

          {/* Card 2: Buyer Demand */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Users size={15} color={C.onSurface} style={{ marginRight: 4 }} />
              <Text style={styles.metricCardTitle}>Buyer Demand</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text style={styles.metricCardDemandText}>High </Text>
              <Flame size={14} color={C.primaryOrange} fill={C.primaryOrange} strokeWidth={0} />
            </View>
            <Text style={styles.metricCardSubGrey}>15+ active buyers</Text>
          </View>
        </View>

        {/* ── Top Match Card (★ TOP MATCH FOR YOU) (Exact Match Image 2) ── */}
        <View style={styles.topMatchCard}>
          {/* Header Row */}
          <View style={styles.topMatchHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={13} color={C.secondaryGreen} fill={C.secondaryGreen} style={{ marginRight: 5 }} />
              <Text style={styles.topMatchHeaderTitle}>TOP MATCH FOR YOU</Text>
            </View>
            <View style={styles.matchPill}>
              <Text style={styles.matchPillText}>94% MATCH</Text>
            </View>
          </View>

          {/* Content Row */}
          <View style={styles.topMatchContentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.topMatchSublabel}>Estimated Net Return</Text>
              <Text style={styles.topMatchGreenPrice}>
                ₹22.00 <Text style={{ fontSize: 13, fontWeight: '400', color: C.onSurfaceVariant }}>/kg</Text>
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.topMatchSellingPrice}>Selling Price: ₹24.00/kg</Text>
              <Text style={styles.topMatchTransport}>- ₹2.00/kg Transport</Text>
            </View>
          </View>

          {/* Buyer Avatar Pill inside card */}
          <View style={styles.buyerPillRow}>
            <Image source={{ uri: CROP_IMAGES.BuyerAvatar }} style={styles.buyerAvatar} />
            <Text style={styles.buyerName}>ABC Foods</Text>
            <CheckCircle2 size={16} color={C.secondaryGreen} fill={C.dataMatchBg} style={{ marginLeft: 4 }} />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Bottom CTA Button (Exact Match Image 2) ── */}
      <View style={styles.stickyFooter}>
        <Pressable
          style={({ pressed }) => [styles.findOptionsBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={handleFindBestOptions}
        >
          <Text style={styles.findOptionsBtnText}>FIND BEST SELLING OPTIONS</Text>
          <ArrowRight size={20} color={C.onSecondary} strokeWidth={2.5} style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
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
    top: -60, right: -60, width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(239, 125, 26, 0.15)',
  },
  blobGreen: {
    position: 'absolute',
    bottom: 80, left: -60, width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(165, 214, 167, 0.25)',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 12,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SOFT_SHADOW,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.onSurface,
  },
  bellWrapper: {
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primaryOrange,
    borderWidth: 1.5,
    borderColor: C.surface,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },

  // Main Card
  mainCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...SOFT_SHADOW,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.onSurface,
    marginBottom: 16,
  },

  // Crop Selector
  cropSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cropCard: {
    width: 90,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
  },
  cropCardSelected: {
    backgroundColor: C.selectedCropBg,
    borderColor: C.primaryOrange,
  },
  cropImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 8,
  },
  cropLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.onSurfaceVariant,
  },
  cropLabelSelected: {
    fontWeight: '800',
    color: C.primaryOrange,
  },

  addNewCard: {
    width: 72,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    borderStyle: 'dashed',
    backgroundColor: C.surface,
  },
  addNewPlusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addNewText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Controls Row
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlCol: {
    flex: 1,
    position: 'relative',
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.onSurface,
    marginBottom: 6,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  stepperBtn: {
    padding: 4,
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '800',
    color: C.onSurface,
  },

  dropdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurface,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    left: 0, right: 0,
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    zIndex: 50,
    ...SOFT_SHADOW,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  dropdownMenuText: {
    fontSize: 13,
    color: C.onSurface,
  },

  // Metrics Row
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 14,
    ...SOFT_SHADOW,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: C.onSurfaceVariant,
  },
  metricCardPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: C.onSurface,
  },
  metricCardDemandText: {
    fontSize: 17,
    fontWeight: '800',
    color: C.primaryOrange,
  },
  metricCardSubGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: C.secondaryGreen,
    marginTop: 4,
  },
  metricCardSubGrey: {
    fontSize: 11,
    color: C.onSurfaceVariant,
    marginTop: 4,
  },

  // Top Match Card
  topMatchCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(27, 109, 36, 0.2)',
    marginBottom: 16,
  },
  topMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topMatchHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: C.secondaryGreen,
    letterSpacing: 0.5,
  },
  matchPill: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.secondaryGreen,
  },
  topMatchContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  topMatchSublabel: {
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  topMatchGreenPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: C.secondaryGreen,
    marginTop: 2,
  },
  topMatchSellingPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: C.onSurface,
  },
  topMatchTransport: {
    fontSize: 12,
    fontWeight: '600',
    color: C.redTransport,
    marginTop: 2,
  },
  buyerPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buyerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.onSurface,
  },

  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.background,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
  },
  findOptionsBtn: {
    backgroundColor: C.secondaryGreen,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SOFT_SHADOW,
  },
  findOptionsBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.onSecondary,
    letterSpacing: 0.5,
  },
});
