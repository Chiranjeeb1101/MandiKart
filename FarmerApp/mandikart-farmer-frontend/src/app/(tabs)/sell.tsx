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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  X,
  Camera,
  Check,
  Truck,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { MKLayout } from '@/constants/layout';
import { pickImageFromGallery } from '@/services/imagePickerService';

const C = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  primaryOrange: '#EF7D1A',
  selectedCropBg: '#FFF5ED',
  secondaryGreen: '#1B6D24',
  onSecondary: '#FFFFFF',
  onSurface: '#241913',
  onSurfaceVariant: '#564336',
  outlineVariant: '#ECEAE3',
  dataMatchBg: '#DCFCE7',
  redTransport: '#D9531E',
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

interface OrderRequest {
  id: string;
  buyerName: string;
  buyerType: string;
  crop: string;
  quantity: string;
  offeredRate: string;
  totalValue: string;
  pickupSlot: string;
  status: 'pending' | 'accepted' | 'declined';
}

export default function SellScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const { t } = useTranslation();

  const [cropList, setCropList] = useState<{ id: string; name: string; imageUri: string }[]>([
    { id: 'Onion', name: 'Onion', imageUri: CROP_IMAGES.Onion },
    { id: 'Tomato', name: 'Tomato', imageUri: CROP_IMAGES.Tomato },
    { id: 'Potato', name: 'Potato', imageUri: CROP_IMAGES.Potato },
  ]);
  const [selectedCrop, setSelectedCrop] = useState<string>('Onion');
  const [quantity, setQuantity] = useState('1000');
  const [quantityUnit, setQuantityUnit] = useState<'KG' | 'Quintal' | 'Tons'>('KG');
  const [grade, setGrade] = useState('Grade A');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  // Custom crop & product modal state
  const [customCropModalVisible, setCustomCropModalVisible] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [customCropPhotoUri, setCustomCropPhotoUri] = useState<string | undefined>();

  // Incoming Order Requests (Item 15)
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([
    {
      id: 'REQ-101',
      buyerName: 'Reliance Retail Mandi Hub',
      buyerType: 'Verified Corporate Buyer',
      crop: 'Onion (Grade A)',
      quantity: '1,000 KG',
      offeredRate: '₹28.50 /kg',
      totalValue: '₹28,500',
      pickupSlot: 'Tomorrow, 08:30 AM',
      status: 'pending',
    },
    {
      id: 'REQ-102',
      buyerName: 'Mother Dairy Fruit & Vegetable',
      buyerType: 'National Dairy & Produce',
      crop: 'Red Tomatoes',
      quantity: '500 KG',
      offeredRate: '₹23.00 /kg',
      totalValue: '₹11,500',
      pickupSlot: 'Tomorrow, 11:00 AM',
      status: 'pending',
    },
    {
      id: 'REQ-103',
      buyerName: 'Nashik Kisan Traders Co-op',
      buyerType: 'FPO Wholesale Aggregator',
      crop: 'Fresh Potato',
      quantity: '800 KG',
      offeredRate: '₹22.00 /kg',
      totalValue: '₹17,600',
      pickupSlot: '05 Sept, 10:00 AM',
      status: 'pending',
    },
  ]);

  const topPadding = MKLayout.getTopHeaderPadding(insets);

  function adjustQuantity(delta: number) {
    const num = parseInt(quantity.replace(/,/g, ''), 10) || 1000;
    const next = Math.max(50, num + delta);
    setQuantity(next.toString());
  }

  function handleAddCustomCrop() {
    const trimmed = newCropName.trim();
    if (!trimmed) {
      Alert.alert('Crop Name Required', 'Please enter a valid crop name.');
      return;
    }
    const newCrop = {
      id: trimmed,
      name: trimmed,
      imageUri: customCropPhotoUri || CROP_IMAGES.Tomato,
    };
    setCropList((prev) => [...prev, newCrop]);
    setSelectedCrop(newCrop.name);
    if (user) {
      const existingCrops = user.crops || [];
      if (!existingCrops.includes(trimmed)) {
        setUser({ ...user, crops: [...existingCrops, trimmed] });
      }
    }
    setNewCropName('');
    setCustomCropPhotoUri(undefined);
    setCustomCropModalVisible(false);
    Alert.alert('Product Added', `${trimmed} has been added to your crops.`);
  }

  function handleFindBestOptions() {
    router.push({
      pathname: '/sell/best-options',
      params: {
        crop: selectedCrop,
        qty: `${quantity} ${quantityUnit}`,
        grade,
      },
    });
  }

  function handleAcceptRequest(id: string) {
    setOrderRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'accepted' } : req))
    );
    Alert.alert('Offer Accepted!', 'Vehicle dispatched for pickup. You can track it in Orders.');
  }

  function handleDeclineRequest(id: string) {
    setOrderRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'declined' } : req))
    );
    Alert.alert('Offer Declined', 'Request has been declined.');
  }

  return (
    <View style={styles.root}>
      {/* Background blobs with pointerEvents="none" */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.blobOrange} />
        <View style={styles.blobGreen} />
      </View>

      {/* ── Top App Bar (Safe Area Aware) ── */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <Pressable style={styles.circleBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={C.onSurface} strokeWidth={2} />
        </Pressable>

        <Text style={styles.topBarTitle}>{t.tabSell}</Text>

        <View style={styles.bellWrapper}>
          <Pressable style={styles.circleBtn} onPress={() => router.push('/more/notifications')}>
            <Bell size={20} color={C.onSurface} strokeWidth={2} />
          </Pressable>
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Main Container Card (What do you want to sell?) ── */}
        <View style={[styles.mainCard, showGradeDropdown && { zIndex: 100, elevation: 12 }]}>
          <Text style={styles.cardTitle}>{t.whatWantToSell}</Text>

          {/* Crop Horizontal Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropSelectorContainer}
          >
            {cropList.map((crop) => {
              const isSelected = selectedCrop === crop.name;
              return (
                <Pressable
                  key={crop.id}
                  style={[styles.cropCard, isSelected && styles.cropCardSelected]}
                  onPress={() => setSelectedCrop(crop.name)}
                >
                  <Image source={{ uri: crop.imageUri }} style={styles.cropImg} />
                  <Text style={[styles.cropLabel, isSelected && styles.cropLabelSelected]}>
                    {crop.name}
                  </Text>
                </Pressable>
              );
            })}

            {/* + Add New */}
            <Pressable
              style={styles.addNewCard}
              onPress={() => setCustomCropModalVisible(true)}
            >
              <View style={styles.addNewPlusCircle}>
                <Plus size={20} color={C.onSurfaceVariant} strokeWidth={2} />
              </View>
              <Text style={styles.addNewText}>{t.addNew}</Text>
            </Pressable>
          </ScrollView>

          {/* Quantity & Grade Controls Row */}
          <View style={styles.controlsRow}>
            {/* Quantity Input Box */}
            <View style={styles.controlCol}>
              <View style={styles.quantityLabelRow}>
                <Text style={styles.controlLabel}>{t.quantityKg}</Text>
                <Pressable
                  style={styles.unitSelectorBtn}
                  onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                >
                  <Text style={styles.unitSelectorText}>{quantityUnit}</Text>
                  <ChevronDown size={13} color="#1B6D24" />
                </Pressable>
              </View>

              <View style={styles.stepperPill}>
                <Pressable style={styles.stepperBtn} onPress={() => adjustQuantity(-50)}>
                  <Minus size={16} color={C.primaryOrange} strokeWidth={2.5} />
                </Pressable>
                <TextInput
                  style={styles.stepperInput}
                  value={quantity}
                  onChangeText={(val) => setQuantity(val.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <Pressable style={styles.stepperBtn} onPress={() => adjustQuantity(50)}>
                  <Plus size={16} color={C.primaryOrange} strokeWidth={2.5} />
                </Pressable>
              </View>

              {/* Unit Dropdown */}
              {showUnitDropdown && (
                <View style={styles.unitDropdownMenu}>
                  {(['KG', 'Quintal', 'Tons'] as const).map((u) => (
                    <Pressable
                      key={u}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setQuantityUnit(u);
                        setShowUnitDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownMenuText,
                          quantityUnit === u && { fontWeight: '700', color: C.secondaryGreen },
                        ]}
                      >
                        {u}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Quality Grade Dropdown Box */}
            <View style={styles.controlCol}>
              <Text style={styles.controlLabel}>{t.qualityGrade}</Text>
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

          {/* Metric Cards Row */}
          <View style={styles.metricsRow}>
            {/* Nashik Market */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Store size={15} color={C.secondaryGreen} style={{ marginRight: 4 }} />
                <Text style={styles.metricCardTitle}>{t.nashikMarket}</Text>
              </View>
              <Text style={styles.metricCardPrice}>₹20-24/kg</Text>
              <Text style={styles.metricCardSubGreen}>+₹2 from yesterday</Text>
            </View>

            {/* Buyer Demand */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Users size={15} color={C.primaryOrange} style={{ marginRight: 4 }} />
                <Text style={styles.metricCardTitle}>{t.demand}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={styles.metricCardDemandText}>{t.highDemand} </Text>
                <Flame size={14} color={C.primaryOrange} fill={C.primaryOrange} strokeWidth={0} />
              </View>
              <Text style={styles.metricCardSubGrey}>15+ {t.activeBuyers}</Text>
            </View>
          </View>

          {/* ── Top Match Card (★ TOP MATCH FOR YOU) ── */}
          <View style={styles.topMatchCard}>
            {/* Header Row */}
            <View style={styles.topMatchHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star size={13} color={C.secondaryGreen} fill={C.secondaryGreen} style={{ marginRight: 5 }} />
                <Text style={styles.topMatchHeaderTitle}>{t.topMatchForYou}</Text>
              </View>
              <View style={styles.matchPill}>
                <Text style={styles.matchPillText}>94% MATCH</Text>
              </View>
            </View>

            {/* Content Row */}
            <View style={styles.topMatchContentRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.topMatchSublabel}>{t.estimatedNetReturn}</Text>
                <Text style={styles.topMatchGreenPrice}>
                  ₹22.00 <Text style={{ fontSize: 13, fontWeight: '400', color: C.onSurfaceVariant }}>/kg</Text>
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.topMatchSellingPrice}>{t.sellingPrice}: ₹24.00/kg</Text>
                <Text style={styles.topMatchTransport}>- ₹2.00/kg {t.transportCost}</Text>
              </View>
            </View>

            {/* Buyer Avatar Pill inside card */}
            <View style={styles.buyerPillRow}>
              <Image source={{ uri: CROP_IMAGES.BuyerAvatar }} style={styles.buyerAvatar} />
              <Text style={styles.buyerName}>ABC Foods</Text>
              <CheckCircle2 size={16} color={C.secondaryGreen} fill={C.dataMatchBg} style={{ marginLeft: 4 }} />
            </View>
          </View>

          {/* ═══ Incoming Buyer Order Requests Section (Item 15) ═══ */}
          <View style={styles.orderRequestsSection}>
            <View style={styles.orderRequestsHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Users size={18} color="#1E5A2A" />
                <Text style={styles.orderRequestsTitle}>Incoming Buyer Requests</Text>
              </View>
              <View style={styles.requestsBadge}>
                <Text style={styles.requestsBadgeText}>
                  {orderRequests.filter((r) => r.status === 'pending').length} NEW
                </Text>
              </View>
            </View>

            <View style={styles.requestsStack}>
              {orderRequests.map((req) => (
                <View key={req.id} style={styles.requestCard}>
                  <View style={styles.requestCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.requestBuyerName}>{req.buyerName}</Text>
                      <Text style={styles.requestBuyerType}>{req.buyerType}</Text>
                    </View>
                    <View style={styles.requestValueBadge}>
                      <Text style={styles.requestValueText}>{req.totalValue}</Text>
                    </View>
                  </View>

                  <View style={styles.requestDetailsBox}>
                    <View style={styles.requestDetailItem}>
                      <Text style={styles.requestDetailLabel}>Crop & Qty</Text>
                      <Text style={styles.requestDetailVal}>
                        {req.crop} • {req.quantity}
                      </Text>
                    </View>
                    <View style={styles.requestDetailItem}>
                      <Text style={styles.requestDetailLabel}>Offered Rate</Text>
                      <Text style={[styles.requestDetailVal, { color: '#15803D' }]}>
                        {req.offeredRate}
                      </Text>
                    </View>
                    <View style={styles.requestDetailItem}>
                      <Text style={styles.requestDetailLabel}>Pickup</Text>
                      <Text style={styles.requestDetailVal}>{req.pickupSlot}</Text>
                    </View>
                  </View>

                  {req.status === 'pending' ? (
                    <View style={styles.requestActionsRow}>
                      <Pressable
                        style={styles.requestDeclineBtn}
                        onPress={() => handleDeclineRequest(req.id)}
                      >
                        <Text style={styles.requestDeclineText}>Decline</Text>
                      </Pressable>
                      <Pressable
                        style={styles.requestCounterBtn}
                        onPress={() =>
                          Alert.alert('Counter Offer', `Submit your expected rate for ${req.buyerName}:`)
                        }
                      >
                        <Text style={styles.requestCounterText}>Counter</Text>
                      </Pressable>
                      <Pressable
                        style={styles.requestAcceptBtn}
                        onPress={() => handleAcceptRequest(req.id)}
                      >
                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
                        <Text style={styles.requestAcceptText}>Accept</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.statusBanner,
                        req.status === 'accepted' ? styles.statusAccepted : styles.statusDeclined,
                      ]}
                    >
                      <Text style={styles.statusBannerText}>
                        {req.status === 'accepted'
                          ? '✓ Offer Accepted • Vehicle Dispatched'
                          : '✕ Offer Declined'}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Sticky Bottom CTA Button ── */}
        <View style={styles.stickyFooter}>
          <Pressable
            style={({ pressed }) => [
              styles.findOptionsBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleFindBestOptions}
          >
            <Text style={styles.findOptionsBtnText}>{t.findBestSellingOptions}</Text>
            <ArrowRight size={20} color={C.onSecondary} strokeWidth={2.5} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        {/* ── Add Custom Crop / Product Modal ── */}
        <Modal
          visible={customCropModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCustomCropModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Add Product / Crop</Text>
                <Pressable onPress={() => setCustomCropModalVisible(false)}>
                  <X size={20} color="#666" />
                </Pressable>
              </View>
              <Text style={styles.modalSubtitle}>
                Enter custom product details and upload photos of your harvest.
              </Text>
              <TextInput
                style={styles.cropInput}
                placeholder="e.g. Ginger, Chilli, Mustard, Wheat..."
                placeholderTextColor="#999"
                value={newCropName}
                onChangeText={setNewCropName}
                autoFocus
              />

              {/* Crop Photo Upload Box */}
              <Text style={styles.modalPhotoLabel}>Product Photo (Optional)</Text>
              <View style={styles.cropPhotoUploadRow}>
                {customCropPhotoUri ? (
                  <View style={styles.cropPhotoThumbWrapper}>
                    <Image source={{ uri: customCropPhotoUri }} style={styles.cropUploadedPhoto} />
                    <Pressable
                      style={styles.cropPhotoDeleteBtn}
                      onPress={() => setCustomCropPhotoUri(undefined)}
                    >
                      <X size={14} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={styles.cropPhotoChooseBtn}
                    onPress={async () => {
                      const res = await pickImageFromGallery();
                      if (!res.cancelled && res.uri) {
                        setCustomCropPhotoUri(res.uri);
                      }
                    }}
                  >
                    <Camera size={16} color="#1E5A2A" />
                    <Text style={styles.cropPhotoChooseText}>Upload Crop Photo</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.modalBtnRow}>
                <Pressable
                  style={styles.modalCancelBtn}
                  onPress={() => setCustomCropModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalSubmitBtn} onPress={handleAddCustomCrop}>
                  <Text style={styles.modalSubmitBtnText}>Add Product</Text>
                </Pressable>
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
    paddingBottom: 12,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...SOFT_SHADOW,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.onSurface,
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    flexShrink: 1,
  },
  bellWrapper: {
    position: 'relative',
    flexShrink: 0,
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

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 120,
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
    zIndex: 100,
  },
  controlCol: {
    flex: 1,
    position: 'relative',
    zIndex: 100,
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
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    zIndex: 999,
    elevation: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
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
    zIndex: 1,
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
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
  },
  findOptionsBtn: {
    backgroundColor: '#1B6D24',
    borderRadius: 16,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SOFT_SHADOW,
  },
  findOptionsBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    flexShrink: 1,
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...SOFT_SHADOW,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#241913',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  cropInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EFEAE0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#241913',
    backgroundColor: '#FAF8F5',
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  modalSubmitBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1B6D24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Quantity and Unit Selectors
  quantityLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  unitSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unitSelectorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1B6D24',
  },
  stepperInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#241913',
    textAlign: 'center',
    paddingVertical: 0,
  },
  unitDropdownMenu: {
    position: 'absolute',
    top: 68,
    left: 0,
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEAE3',
    padding: 4,
    zIndex: 120,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  unitDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  unitDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },

  // Order Requests Section (Item 15)
  orderRequestsSection: {
    marginTop: 18,
  },
  orderRequestsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderRequestsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#241913',
  },
  requestsBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  requestsBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
  },
  requestsStack: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#ECEAE3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  requestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestBuyerName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  requestBuyerType: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  requestValueBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  requestValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  requestDetailsBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  requestDetailItem: {
    flex: 1,
  },
  requestDetailLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  requestDetailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  requestDeclineBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestDeclineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  requestCounterBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  requestAcceptBtn: {
    flex: 1.5,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E5A2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAcceptText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusBanner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusAccepted: {
    backgroundColor: '#DCFCE7',
  },
  statusDeclined: {
    backgroundColor: '#FEE2E2',
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },

  // Modal photo upload styles
  modalPhotoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 4,
  },
  cropPhotoUploadRow: {
    marginBottom: 18,
  },
  cropPhotoChooseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#1E5A2A',
    backgroundColor: '#F4FBF5',
  },
  cropPhotoChooseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  cropPhotoThumbWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cropUploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  cropPhotoDeleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
