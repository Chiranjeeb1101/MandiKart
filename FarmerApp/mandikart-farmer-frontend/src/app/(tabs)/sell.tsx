/**
 * MandiKart Farmer App — Screen 10: Sell (Guided Selection Flow)
 * 
 * Implements the approved Stitch visual design:
 * Crop horizontal selector with photos, quantity counter stepper with grade dropdown,
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
} from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { MKBackground, MKButton, MKCard, MKStatusBadge } from '@/components/ui';

const CROPS = [
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

const BUYER_AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsiGgdNTdwdzhHT51YSgwvNdShC0__Wu24dv1CcbVou-08kHaF50TnNAr-IA4hoY6hcIQ8HF-zHS6M9DY_rNpUegqDAqP49C9fp-TtpVVuQqZwRC_19oX9AwOggRZ2zhJKJeL8KWXIgd7XssPOZUNgpcSGlfZip3jLGCaPeF1ejDvtqzrcrp8j9wwkAaTiLyfJNYiFh0cpRkWZSrtcFHpH6vkhEpi-cDnLgzW0WOnCgNLsuCPyY3cPjg';

export default function SellScreen() {
  const router = useRouter();

  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantity, setQuantity] = useState(1000);
  const [grade, setGrade] = useState('Grade A');

  const currentCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const sellingPrice = currentCrop.price;
  const transportCost = currentCrop.transport;
  const netReturn = sellingPrice - transportCost;

  const handleIncreaseQty = () => setQuantity((prev) => prev + 250);
  const handleDecreaseQty = () => setQuantity((prev) => (prev > 250 ? prev - 250 : 250));

  const handleFindOptions = () => {
    Alert.alert(
      'Purchase Request Sent! 🎉',
      `Your offer for ${quantity} KG ${currentCrop.name} (${grade}) has been matched with ABC Foods at ₹${sellingPrice}/KG (Net Return: ₹${netReturn}/KG).`,
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
        contentContainerStyle={styles.scrollContent}
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

          {/* Horizontal Crop Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropScrollContent}
          >
            {CROPS.map((crop) => {
              const isSelected = selectedCropId === crop.id;
              return (
                <Pressable
                  key={crop.id}
                  onPress={() => setSelectedCropId(crop.id)}
                  style={[
                    styles.cropSelectBtn,
                    isSelected && styles.cropSelectBtnActive,
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
          </ScrollView>

          {/* Quantity & Grade 2-Column Row */}
          <View style={styles.qtyGradeGrid}>
            {/* Quantity Counter */}
            <View style={styles.qtyCol}>
              <Text style={styles.inputLabel}>Quantity (KG)</Text>
              <View style={styles.stepperContainer}>
                <Pressable onPress={handleDecreaseQty} style={styles.stepperBtn}>
                  <Minus size={16} color="#1E5A2A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.qtyNumber}>{quantity.toLocaleString()}</Text>
                <Pressable onPress={handleIncreaseQty} style={styles.stepperBtn}>
                  <Plus size={16} color="#1E5A2A" strokeWidth={2.5} />
                </Pressable>
              </View>
            </View>

            {/* Grade Selector */}
            <View style={styles.qtyCol}>
              <Text style={styles.inputLabel}>Quality Grade</Text>
              <Pressable
                onPress={() =>
                  setGrade((g) => (g === 'Grade A' ? 'Grade B' : 'Grade A'))
                }
                style={styles.gradeDropdownBtn}
              >
                <Text style={styles.gradeText}>{grade}</Text>
                <ChevronDown size={18} color="#7A7A7A" />
              </Pressable>
            </View>
          </View>
        </MKCard>

        {/* Section 2: Market Intelligence Bento Grid (2 Cards) */}
        <View style={styles.bentoGrid}>
          {/* Card 1: Mandi Price */}
          <View style={styles.bentoCard}>
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
          </View>

          {/* Card 2: Buyer Demand */}
          <View style={[styles.bentoCard, styles.bentoCardDemand]}>
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
          </View>
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
  qtyGradeGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  qtyCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
    marginBottom: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    padding: 4,
    height: 48,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  gradeDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    height: 48,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C1E',
  },
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
});
