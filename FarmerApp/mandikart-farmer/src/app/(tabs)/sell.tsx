/**
 * MandiKart Farmer App — Screen 10: Sell (Guided Selection Flow)
 * 
 * Implements the approved Stitch visual design:
 * Crop horizontal selector with photos & "+ Add Crop" card,
 * Quantity dropdown bar & stepper, Quality Grade dropdown modal picker,
 * market intelligence 2-card bento grid (Market Price & Demand),
 * "Top Match for You" net return calculation card with verified buyer profile,
 * and 3D primary FIND BEST SELLING OPTIONS action.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Flame,
  Plus,
  Minus,
  Star,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ChevronDown,
  Scale,
  Award,
  Check,
  X,
  Sprout,
} from 'lucide-react-native';
import { MKBackground, MKButton, MKCard, MKStatusBadge } from '@/components/ui';

interface CropItem {
  id: string;
  name: string;
  image: string;
  price: number;
  transport: number;
  marketRange: string;
}

const INITIAL_CROPS: CropItem[] = [
  {
    id: 'onion',
    name: 'Onion',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAuROSv85P-drqVE4rTfYtwRmFfr49TTBrEKbzYz1bxJU2x1-BBbUlXkffYtyHCnbmHd_ym0xTR6yiPkJeQkhYcea1SC4urd6OTJPQ29l3D_1inY0Yo7_eEKRveWNVprEVzz9ngDbRnRH3hhH2aU1Om_lOrBrfd4EZuqG0BQ37XrPiOQE9NdWTOls2EGVI0TqQQviaRCvFgAcsjWAOO_j3TWsvBksS2EyULUE5fv6h3kmDgSPwP5IqmbQ',
    price: 24,
    transport: 2,
    marketRange: '₹20-24',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7LbaxneUQIS9ixZUcJrJv5vY-g2wdprpFCabzbIZ912Yr27FwEg6AnvBpZgzkxDVpGm2YZaykQbYhfC7vu63Rxd1OY66YVF7VIxxWfr2yTY8zDmK-vp2rqDO8dZs7IYjKdgkMkTNzs6GufCfzaaibo800IUzo0MJ7UYMSa0GSre8789niCZ9g6rvwber_j34X7hsRSPwkOkxmReujIg-t7Om3teS3_jBFvrQXT90iZVuLVwSBfloBsg',
    price: 32,
    transport: 3,
    marketRange: '₹28-34',
  },
  {
    id: 'potato',
    name: 'Potato',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOJL8RKbbBEQi0du8hHGGe-fNpsnVqibsmptRi9ANv4FaE2LMboZqWH-2gppsktLNvVx7JSEyIU7uFwWEwW_oPILiWrX--jYxolR5dfUcXhKUUF-9cJbkgQ_8gyjelFWX8ZwXTeUjNw-KboozHRyg_JSSPA-o-tGFXdfyIhuXXnpbyl4_aNaN-vY2CjsppXPuL2phZuIDm3b1kNIqcfZ0gthemK3IivuhVUaf9GTfWi3xjfl-HDHjcg',
    price: 18,
    transport: 2,
    marketRange: '₹16-20',
  },
];

const EXTRA_CROPS_PRESETS: CropItem[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp1Zj0OQSZz-R5lwjzzVMhfIpQ7UZXXJyh99AhnWV3qwaT4O0bqL8-SHei9CGxNR0OrSLAyvpnMs7-3ByBBSeCVimUuDZZEokQeqa9V0vPd7JtriOCnbXwyG0OZejq9zA4Ag6Tr27my0GcXPmYgPzRqfyiIRMe5nibIxEvfXjrKjMlUkrTBvO_JVftDlMfe6zs6mF3JYv4No9dchmW3SEJlp45WvmqSBErKdRcr7VJWZ5HZiBOkoPdbA',
    price: 22,
    transport: 2,
    marketRange: '₹20-25',
  },
  {
    id: 'rice',
    name: 'Rice',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLJjSUyWgLdbXU3_H2F3g0FW9V1FkqNh60JzX2kcs1jUaS2rYWSwYwXwhowBfWfwhrhZjqYfxllcN5Xdcsts1A6kAt5O4LmQPny8e04Fp0y84FS6TpCEv6Ead9nuauzJ7PzfgHsXoqM7YL56z7eugidEni2b94tc7VaVKHgRQpgJqD0FmceLE7P-1C9I838IelI2xmVlACO7rX5mVD65970EQP4WrdCAJY1P_9-3zSyE78Vh_QrNBA',
    price: 36,
    transport: 3,
    marketRange: '₹32-40',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOJL8RKbbBEQi0du8hHGGe-fNpsnVqibsmptRi9ANv4FaE2LMboZqWH-2gppsktLNvVx7JSEyIU7uFwWEwW_oPILiWrX--jYxolR5dfUcXhKUUF-9cJbkgQ_8gyjelFWX8ZwXTeUjNw-KboozHRyg_JSSPA-o-tGFXdfyIhuXXnpbyl4_aNaN-vY2CjsppXPuL2phZuIDm3b1kNIqcfZ0gthemK3IivuhVUaf9GTfWi3xjfl-HDHjcg',
    price: 85,
    transport: 5,
    marketRange: '₹80-95',
  },
];

const QUANTITY_OPTIONS = [
  { label: '500 KG (0.5 Ton)', value: 500 },
  { label: '1,000 KG (1 Ton)', value: 1000 },
  { label: '2,500 KG (2.5 Tons)', value: 2500 },
  { label: '5,000 KG (5 Tons)', value: 5000 },
  { label: '10,000 KG (10 Tons)', value: 10000 },
];

const QUALITY_GRADES = [
  { id: 'Grade A', name: 'Grade A (Export / Premium)', desc: 'Uniform size, zero damage, top luster' },
  { id: 'Grade B', name: 'Grade B (Standard Mandi)', desc: 'Good quality, minor variation in size' },
  { id: 'Grade C', name: 'Grade C (Processing)', desc: 'Ideal for juices, pastes & food factories' },
  { id: 'Organic', name: 'Organic Certified', desc: 'Chemical-free with lab certificate' },
];

const BUYER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsiGgdNTdwdzhHT51YSgwvNdShC0__Wu24dv1CcbVou-08kHaF50TnNAr-IA4hoY6hcIQ8HF-zHS6M9DY_rNpUegqDAqP49C9fp-TtpVVuQqZwRC_19oX9AwOggRZ2zhJKJeL8KWXIgd7XssPOZUNgpcSGlfZip3jLGCaPeF1ejDvtqzrcrp8j9wwkAaTiLyfJNYiFh0cpRkWZSrtcFHpH6vkhEpi-cDnLgzW0WOnCgNLsuCPyY3cPjg';

export default function SellScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [cropsList, setCropsList] = useState<CropItem[]>(INITIAL_CROPS);
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantity, setQuantity] = useState(1000);
  const [grade, setGrade] = useState('Grade A');

  // Modals state
  const [addCropModalOpen, setAddCropModalOpen] = useState(false);
  const [qtyModalOpen, setQtyModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [customCropName, setCustomCropName] = useState('');

  const currentCrop = cropsList.find((c) => c.id === selectedCropId) || cropsList[0];
  const sellingPrice = currentCrop.price;
  const transportCost = currentCrop.transport;
  const netReturn = sellingPrice - transportCost;

  const handleIncreaseQty = () => setQuantity((prev) => prev + 250);
  const handleDecreaseQty = () => setQuantity((prev) => (prev > 250 ? prev - 250 : 250));

  const handleAddCrop = (crop: CropItem) => {
    if (!cropsList.some((c) => c.id === crop.id)) {
      setCropsList([...cropsList, crop]);
    }
    setSelectedCropId(crop.id);
    setAddCropModalOpen(false);
  };

  const handleAddCustomCrop = () => {
    if (!customCropName.trim()) return;
    const newCropItem: CropItem = {
      id: `custom_${Date.now()}`,
      name: customCropName.trim(),
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOJL8RKbbBEQi0du8hHGGe-fNpsnVqibsmptRi9ANv4FaE2LMboZqWH-2gppsktLNvVx7JSEyIU7uFwWEwW_oPILiWrX--jYxolR5dfUcXhKUUF-9cJbkgQ_8gyjelFWX8ZwXTeUjNw-KboozHRyg_JSSPA-o-tGFXdfyIhuXXnpbyl4_aNaN-vY2CjsppXPuL2phZuIDm3b1kNIqcfZ0gthemK3IivuhVUaf9GTfWi3xjfl-HDHjcg',
      price: 25,
      transport: 2,
      marketRange: '₹22-28',
    };
    setCropsList([...cropsList, newCropItem]);
    setSelectedCropId(newCropItem.id);
    setCustomCropName('');
    setAddCropModalOpen(false);
  };

  const handleFindOptions = () => {
    Alert.alert(
      'Purchase Request Sent! 🎉',
      `Your offer for ${quantity.toLocaleString()} KG ${currentCrop.name} (${grade}) has been matched with ABC Foods at ₹${sellingPrice}/KG (Net Return: ₹${netReturn}/KG).`,
      [
        {
          text: 'Track Order',
          onPress: () => router.push('/(tabs)/orders'),
        },
      ]
    );
  };

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 16, 50),
            paddingBottom: Math.max(insets.bottom + 80, 110),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sell Produce</Text>
          <Text style={styles.headerSubtitle}>Calculate net return & connect with buyers</Text>
        </View>

        {/* Section 1: Crop & Quantity Selection Card */}
        <MKCard style={styles.cropSelectorCard}>
          <Text style={styles.sectionTitle}>What do you want to sell?</Text>

          {/* Horizontal Crop Scroll including "+ Add Crop" card */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropScrollContent}
          >
            {cropsList.map((crop) => {
              const isSelected = selectedCropId === crop.id;
              return (
                <Pressable
                  key={crop.id}
                  onPress={() => setSelectedCropId(crop.id)}
                  style={({ pressed }) => [
                    styles.cropSelectBtn,
                    isSelected && styles.cropSelectBtnActive,
                    pressed && { transform: [{ scale: 0.93 }], opacity: 0.9 },
                  ]}
                >
                  <View style={styles.cropImageWrapper}>
                    <Image source={{ uri: crop.image }} style={styles.cropThumb} />
                  </View>
                  <Text
                    style={[
                      styles.cropSelectName,
                      isSelected && styles.cropSelectNameActive,
                    ]}
                  >
                    {crop.name}
                  </Text>
                </Pressable>
              );
            })}

            {/* + ADD CROP CARD */}
            <Pressable
              onPress={() => setAddCropModalOpen(true)}
              style={({ pressed }) => [
                styles.addCropCardBtn,
                pressed && { transform: [{ scale: 0.93 }], opacity: 0.85 },
              ]}
            >
              <View style={styles.addCropCircle}>
                <Plus size={22} color="#1E5A2A" strokeWidth={2.8} />
              </View>
              <Text style={styles.addCropCardText}>Add Crop</Text>
            </Pressable>
          </ScrollView>

          {/* Quantity & Quality Dropdown Section */}
          <View style={styles.dropdownsSection}>
            
            {/* Quantity Dropdown & Stepper Bar */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity (KG)</Text>
              <View style={styles.qtyControlRow}>
                {/* Quantity Dropdown Selector */}
                <Pressable
                  onPress={() => setQtyModalOpen(true)}
                  style={({ pressed }) => [
                    styles.dropdownBar,
                    styles.qtyDropdownBar,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Scale size={18} color="#1E5A2A" />
                  <Text style={styles.dropdownBarText}>{quantity.toLocaleString()} KG</Text>
                  <ChevronDown size={18} color="#7A7A7A" />
                </Pressable>

                {/* +/- Stepper Buttons */}
                <View style={styles.stepperBox}>
                  <Pressable
                    onPress={handleDecreaseQty}
                    style={({ pressed }) => [
                      styles.stepperBtn,
                      pressed && { transform: [{ scale: 0.88 }], opacity: 0.8 },
                    ]}
                  >
                    <Minus size={16} color="#1E5A2A" strokeWidth={2.5} />
                  </Pressable>
                  <Pressable
                    onPress={handleIncreaseQty}
                    style={({ pressed }) => [
                      styles.stepperBtn,
                      pressed && { transform: [{ scale: 0.88 }], opacity: 0.8 },
                    ]}
                  >
                    <Plus size={16} color="#1E5A2A" strokeWidth={2.5} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Quality Grade Dropdown Bar */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quality Grade</Text>
              <Pressable
                onPress={() => setGradeModalOpen(true)}
                style={({ pressed }) => [
                  styles.dropdownBar,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.dropdownLeftRow}>
                  <Award size={18} color="#EF7D1A" />
                  <Text style={styles.dropdownBarText}>{grade}</Text>
                </View>
                <ChevronDown size={18} color="#7A7A7A" />
              </Pressable>
            </View>
          </View>
        </MKCard>

        {/* Section 2: Market Intelligence Bento Grid (2 Cards) */}
        <View style={styles.bentoGrid}>
          {/* Card 1: Mandi Price */}
          <Pressable
            style={({ pressed }) => [
              styles.bentoCard,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
            ]}
          >
            <View style={styles.bentoIconTop}>
              <TrendingUp size={24} color="#1565C0" opacity={0.3} />
            </View>
            <Text style={styles.bentoLabel}>Nashik Mandi Rate</Text>
            <View>
              <Text style={styles.bentoPrice}>
                {currentCrop.marketRange} <Text style={styles.bentoUnit}>/kg</Text>
              </Text>
              <Text style={styles.bentoChange}>+₹2.00 from yesterday</Text>
            </View>
          </Pressable>

          {/* Card 2: Buyer Demand */}
          <Pressable
            style={({ pressed }) => [
              styles.bentoCard,
              styles.bentoCardDemand,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
            ]}
          >
            <View style={styles.bentoIconTop}>
              <Flame size={24} color="#EF7D1A" opacity={0.3} />
            </View>
            <Text style={styles.bentoLabel}>Buyer Demand</Text>
            <View>
              <View style={styles.demandHeaderRow}>
                <Text style={styles.demandText}>High</Text>
                <Flame size={16} color="#EF7D1A" fill="#EF7D1A" />
              </View>
              <Text style={styles.demandCount}>15+ active buyers nearby</Text>
            </View>
          </Pressable>
        </View>

        {/* Section 3: Top Match & Net Return Calculation Card */}
        <View style={styles.matchCard}>
          <View style={styles.matchHeaderBanner}>
            <View style={styles.matchBadgeLeft}>
              <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.matchBadgeText}>TOP MATCH FOR YOU</Text>
            </View>
            <Text style={styles.matchScorePill}>94% MATCH</Text>
          </View>

          <View style={styles.matchBody}>
            <View style={styles.matchCalculationRow}>
              <View>
                <Text style={styles.netReturnTitle}>Estimated Net Return</Text>
                <Text style={styles.netReturnAmount}>
                  ₹{netReturn.toFixed(2)}{' '}
                  <Text style={styles.netReturnUnit}>/kg</Text>
                </Text>
              </View>

              <View style={styles.matchCalculationRight}>
                <Text style={styles.grossPriceText}>Selling Price: ₹{sellingPrice}.00/kg</Text>
                <Text style={styles.deductionText}>- ₹{transportCost}.00/kg Transport</Text>
              </View>
            </View>

            {/* Buyer Profile Mini Card */}
            <View style={styles.buyerMiniCard}>
              <Image source={{ uri: BUYER_AVATAR_URI }} style={styles.buyerThumb} />
              <View style={styles.buyerDetails}>
                <View style={styles.buyerNameRow}>
                  <Text style={styles.buyerName}>ABC Foods & Wholesale</Text>
                  <CheckCircle2 size={16} color="#1E5A2A" />
                </View>
                <View style={styles.buyerLocationRow}>
                  <MapPin size={12} color="#5F6368" />
                  <Text style={styles.buyerDistText}>45 KM away • Pickup Included</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Primary CTA */}
        <View style={styles.actionWrapper}>
          <MKButton
            title="FIND BEST SELLING OPTIONS"
            onPress={handleFindOptions}
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
          />
        </View>
      </ScrollView>

      {/* ── MODAL 1: ADD CROP MODAL ── */}
      <Modal transparent visible={addCropModalOpen} animationType="slide" onRequestClose={() => setAddCropModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Sprout size={20} color="#1E5A2A" />
                <Text style={styles.modalTitleText}>Add More Crops</Text>
              </View>
              <Pressable onPress={() => setAddCropModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#5F6368" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtext}>Select a crop to add to your selling list:</Text>

            <View style={styles.presetsGrid}>
              {EXTRA_CROPS_PRESETS.map((preset) => (
                <Pressable
                  key={preset.id}
                  onPress={() => handleAddCrop(preset)}
                  style={styles.presetItemCard}
                >
                  <Image source={{ uri: preset.image }} style={styles.presetThumb} />
                  <Text style={styles.presetItemName}>{preset.name}</Text>
                  <Text style={styles.presetItemRate}>{preset.marketRange}/kg</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.customCropContainer}>
              <Text style={styles.customLabel}>Or add a custom crop name:</Text>
              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  placeholder="E.g. Garlic, Chilli, Ginger"
                  value={customCropName}
                  onChangeText={setCustomCropName}
                />
                <Pressable onPress={handleAddCustomCrop} style={styles.addCustomBtn}>
                  <Text style={styles.addCustomBtnText}>Add</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 2: QUANTITY DROPDOWN MODAL ── */}
      <Modal transparent visible={qtyModalOpen} animationType="fade" onRequestClose={() => setQtyModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Scale size={20} color="#1E5A2A" />
                <Text style={styles.modalTitleText}>Select Quantity</Text>
              </View>
              <Pressable onPress={() => setQtyModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#5F6368" />
              </Pressable>
            </View>

            <View style={styles.optionsList}>
              {QUANTITY_OPTIONS.map((opt) => {
                const isSelected = quantity === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      setQuantity(opt.value);
                      setQtyModalOpen(false);
                    }}
                    style={[styles.optionRow, isSelected && styles.optionRowActive]}
                  >
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                      {opt.label}
                    </Text>
                    {isSelected && <Check size={18} color="#1E5A2A" strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 3: QUALITY GRADE DROPDOWN MODAL ── */}
      <Modal transparent visible={gradeModalOpen} animationType="fade" onRequestClose={() => setGradeModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Award size={20} color="#EF7D1A" />
                <Text style={styles.modalTitleText}>Select Quality Grade</Text>
              </View>
              <Pressable onPress={() => setGradeModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#5F6368" />
              </Pressable>
            </View>

            <View style={styles.optionsList}>
              {QUALITY_GRADES.map((g) => {
                const isSelected = grade === g.id;
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => {
                      setGrade(g.id);
                      setGradeModalOpen(false);
                    }}
                    style={[styles.gradeOptionCard, isSelected && styles.gradeOptionCardActive]}
                  >
                    <View style={styles.gradeOptionLeft}>
                      <Text style={[styles.gradeOptionTitle, isSelected && styles.gradeOptionTitleActive]}>
                        {g.name}
                      </Text>
                      <Text style={styles.gradeOptionDesc}>{g.desc}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    marginBottom: 4,
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
  cropSelectorCard: {
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  cropScrollContent: {
    gap: 12,
    paddingVertical: 4,
  },
  cropSelectBtn: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F0ECE4',
    backgroundColor: '#FAF9F6',
    minWidth: 80,
  },
  cropSelectBtnActive: {
    borderColor: '#EF7D1A',
    backgroundColor: '#FFF3E0',
  },
  cropImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 6,
  },
  cropThumb: {
    width: '100%',
    height: '100%',
  },
  cropSelectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  cropSelectNameActive: {
    color: '#EF7D1A',
    fontWeight: '800',
  },

  /* + Add Crop Card */
  addCropCardBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1E5A2A',
    borderStyle: 'dashed',
    backgroundColor: '#E8F5E9',
    minWidth: 80,
    height: 94,
  },
  addCropCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addCropCardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E5A2A',
  },

  /* Dropdowns */
  dropdownsSection: {
    gap: 12,
    marginTop: 6,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  qtyControlRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dropdownBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    height: 48,
    flex: 1,
  },
  qtyDropdownBar: {
    flex: 1,
  },
  dropdownLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownBarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
    marginLeft: 6,
  },
  stepperBox: {
    flexDirection: 'row',
    gap: 6,
  },
  stepperBtn: {
    width: 44,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  /* Bento Grid */
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 125,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    position: 'relative',
  },
  bentoCardDemand: {
    borderColor: '#FFE0B2',
  },
  bentoIconTop: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  bentoPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  bentoUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5F6368',
  },
  bentoChange: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E5A2A',
    marginTop: 2,
  },
  demandHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF7D1A',
  },
  demandCount: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 2,
  },

  /* Match Card */
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  matchHeaderBanner: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: 0.5,
  },
  matchScorePill: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E5A2A',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchBody: {
    padding: 16,
    gap: 14,
  },
  matchCalculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  netReturnTitle: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 2,
  },
  netReturnAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: -0.5,
  },
  netReturnUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5F6368',
  },
  matchCalculationRight: {
    alignItems: 'flex-end',
  },
  grossPriceText: {
    fontSize: 12,
    color: '#1A1C1E',
    fontWeight: '600',
  },
  deductionText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
    marginTop: 2,
  },
  buyerMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  buyerThumb: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  buyerDetails: {
    flex: 1,
  },
  buyerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  buyerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  buyerDistText: {
    fontSize: 11,
    color: '#5F6368',
  },
  actionWrapper: {
    marginTop: 6,
  },

  /* Modals */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 16,
    maxHeight: '80%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  closeBtn: {
    padding: 6,
  },
  modalSubtext: {
    fontSize: 13,
    color: '#5F6368',
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  presetItemCard: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  presetThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  presetItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  presetItemRate: {
    fontSize: 11,
    color: '#1E5A2A',
    fontWeight: '600',
    marginTop: 2,
  },
  customCropContainer: {
    marginTop: 6,
    gap: 8,
  },
  customLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  customInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1C1E',
  },
  addCustomBtn: {
    backgroundColor: '#1E5A2A',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCustomBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  /* Options list */
  optionsList: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  optionRowActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#1E5A2A',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  optionLabelActive: {
    color: '#1E5A2A',
    fontWeight: '800',
  },

  /* Grade Options */
  gradeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  gradeOptionCardActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#EF7D1A',
  },
  gradeOptionLeft: {
    flex: 1,
  },
  gradeOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 2,
  },
  gradeOptionTitleActive: {
    color: '#EF7D1A',
  },
  gradeOptionDesc: {
    fontSize: 12,
    color: '#5F6368',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF7D1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
