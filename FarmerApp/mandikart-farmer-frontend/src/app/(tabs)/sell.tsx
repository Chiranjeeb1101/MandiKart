/**
 * MandiKart Farmer App — Screen 10: Sell (Guided Selection Flow)
 *
 * Built using MandiKart production layout primitives (MKScreen, MKSection, MKCard).
 * Robust horizontal layouts, responsive bento grid, dropdowns, and modals.
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
  ActivityIndicator,
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
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Scale,
  Award,
  Check,
  X,
  Sprout,
  Store,
  Users,
  Bell,
  Camera,
  ShieldCheck,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { MKScreen, MKCard, MKButton } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';
import { apiClient } from '@/services/apiClient';

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

  const [cropsList, setCropsList] = useState<CropItem[]>(INITIAL_CROPS);
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantity, setQuantity] = useState(1000);
  const [grade, setGrade] = useState('Grade A');

  // Modals state
  const [addCropModalOpen, setAddCropModalOpen] = useState(false);
  const [qtyModalOpen, setQtyModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [customCropPhotoUri, setCustomCropPhotoUri] = useState<string | undefined>();
  const [batchPhotos, setBatchPhotos] = useState<string[]>([]);
  const [uploadingBatchPhoto, setUploadingBatchPhoto] = useState(false);

  // Incoming Order Requests (Item 15)
  const [orderRequests, setOrderRequests] = useState([
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

  const handlePickBatchPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is needed to upload produce photos.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        const localUri = res.assets[0].uri;
        setUploadingBatchPhoto(true);
        const upload = await apiClient.uploadImage(localUri, 'products');
        setUploadingBatchPhoto(false);
        if (upload?.url) {
          setBatchPhotos((prev) => [...prev, upload.url]);
          Alert.alert(
            'Produce Photo Uploaded! 🍅',
            `Compressed to WebP and linked with your produce batch.\nStorage saved: ${upload.savingsPercent}%`
          );
        }
      }
    } catch (err: any) {
      setUploadingBatchPhoto(false);
      Alert.alert('Upload Error', err?.message || 'Failed to upload crop photo');
    }
  };

  const handlePickCustomCropPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is needed.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        setCustomCropPhotoUri(res.assets[0].uri);
      }
    } catch (err) {
      console.warn('Custom photo pick failed', err);
    }
  };


  const currentCrop = cropsList.find((c) => c.id === selectedCropId) || cropsList[0];
  const sellingPrice = currentCrop.price;
  const transportCost = currentCrop.transport;
  const netReturn = sellingPrice - transportCost;
  const estimatedGross = sellingPrice * quantity;
  const estimatedNet = netReturn * quantity;

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(100, prev - 100));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 100);
  };

  const handleAddCrop = (crop: CropItem) => {
    if (!cropsList.some((c) => c.id === crop.id)) {
      setCropsList([...cropsList, crop]);
    }
    setSelectedCropId(crop.id);
    setAddCropModalOpen(false);
  };

  const handleAddCustomCrop = () => {
    if (!customCropName.trim()) {
      Alert.alert('Crop Name Required', 'Please enter a valid crop name.');
      return;
    }
    const newCropItem: CropItem = {
      id: `custom_${Date.now()}`,
      name: customCropName.trim(),
      image:
        customCropPhotoUri ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw',
      price: 25,
      transport: 2,
      marketRange: '₹22-28',
    };
    setCropsList([...cropsList, newCropItem]);
    setSelectedCropId(newCropItem.id);
    setCustomCropName('');
    setCustomCropPhotoUri(undefined);
    setAddCropModalOpen(false);
    Alert.alert('Crop Added', `${newCropItem.name} has been added with custom photo!`);
  };

  const handleFindOptions = () => {
    router.push({
      pathname: '/sell/best-options',
      params: {
        crop: currentCrop.name,
        qty: `${quantity.toLocaleString()} KG`,
        grade,
      },
    });
  };

  const handleAcceptRequest = (id: string) => {
    setOrderRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
    Alert.alert('Offer Accepted! 🚛', 'Pickup vehicle has been assigned. You can track it in Orders.');
  };

  const handleDeclineRequest = (id: string) => {
    setOrderRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
    Alert.alert('Offer Declined', 'Request has been removed.');
  };

  return (
    <MKScreen>
      {/* ── Header (Image 5) ── */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'))}
          style={styles.headerCircleBtn}
        >
          <ArrowLeft size={20} color="#212121" strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.topHeaderTitle}>Sell Produce</Text>
        <Pressable
          onPress={() => router.push('/more/notifications')}
          style={styles.headerCircleBtn}
        >
          <Bell size={20} color="#212121" strokeWidth={2.2} />
          <View style={styles.headerBadgeDot} />
        </Pressable>
      </View>

      {/* ── Section 1: Crop & Quantity Selection Card (Image 5) ── */}
      <MKCard style={styles.cropSelectorCard}>
        <Text style={styles.sectionTitle}>What do you want to sell?</Text>

        {/* Horizontal Crop Scroll including "+ Add New" card */}
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
                  numberOfLines={1}
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

          {/* + ADD NEW CARD */}
          <Pressable
            onPress={() => setAddCropModalOpen(true)}
            style={({ pressed }) => [
              styles.addCropCardBtn,
              pressed && { transform: [{ scale: 0.93 }], opacity: 0.85 },
            ]}
          >
            <View style={styles.addCropCircle}>
              <Plus size={20} color="#757575" strokeWidth={2.5} />
            </View>
            <Text style={styles.addCropCardText}>Add New</Text>
          </Pressable>
        </ScrollView>

        {/* Side-by-Side: Quantity & Quality Grade (Image 5) */}
        <View style={styles.selectorsRow}>
          {/* Quantity Stepper Pill */}
          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>Quantity (KG)</Text>
            <View style={styles.stepperPill}>
              <Pressable
                onPress={handleDecreaseQty}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Minus size={15} color="#D9531E" strokeWidth={2.5} />
              </Pressable>
              <TextInput
                style={styles.stepperInput}
                value={quantity.toString()}
                onChangeText={(val) => {
                  const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                  setQuantity(isNaN(num) ? 0 : num);
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              <Pressable
                onPress={handleIncreaseQty}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Plus size={15} color="#D9531E" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          {/* Quality Grade Dropdown Pill */}
          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>Quality Grade</Text>
            <Pressable
              onPress={() => setGradeModalOpen(true)}
              style={({ pressed }) => [
                styles.gradePill,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text numberOfLines={1} style={styles.gradeText}>{grade}</Text>
              <ChevronDown size={18} color="#757575" />
            </Pressable>
          </View>
        </View>
      </MKCard>

      {/* ── Produce Batch Photos (Sharp WebP Quality Verification) ── */}
      <MKCard style={styles.photoCard}>
        <View style={styles.photoCardHeader}>
          <View style={styles.photoTitleRow}>
            <Camera size={18} color="#1E5A2A" strokeWidth={2.2} />
            <Text style={styles.photoCardTitle}>Produce Batch Photos</Text>
          </View>
          <View style={styles.verifiedBatchBadge}>
            <ShieldCheck size={12} color="#16A34A" />
            <Text style={styles.verifiedBatchText}>Quality Verified</Text>
          </View>
        </View>
        <Text style={styles.photoCardSubtitle}>
          Real farm photos attract 3.4× more buyers & faster commitments.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScrollContent}
        >
          {/* Add Photo Button */}
          <Pressable
            onPress={handlePickBatchPhoto}
            style={({ pressed }) => [
              styles.addPhotoBtn,
              pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] },
            ]}
          >
            {uploadingBatchPhoto ? (
              <ActivityIndicator size="small" color="#1E5A2A" />
            ) : (
              <>
                <View style={styles.addPhotoCircle}>
                  <Camera size={20} color="#1E5A2A" strokeWidth={2.2} />
                </View>
                <Text style={styles.addPhotoBtnText}>+ Add Photo</Text>
              </>
            )}
          </Pressable>

          {/* Uploaded Photos */}
          {batchPhotos.map((photoUri, index) => (
            <View key={index} style={styles.batchThumbWrapper}>
              <Image source={{ uri: photoUri }} style={styles.batchThumbImage} />
              <View style={styles.webpBadge}>
                <Text style={styles.webpBadgeText}>WebP</Text>
              </View>
            </View>
          ))}

          {batchPhotos.length === 0 && (
            <View style={styles.noPhotoPlaceholder}>
              <Image
                source={{ uri: currentCrop.image }}
                style={styles.defaultCropThumb}
              />
              <Text style={styles.defaultCropNote}>Catalog default photo active</Text>
            </View>
          )}
        </ScrollView>
      </MKCard>

      {/* ── Section 2: Market Intelligence Bento Grid (Image 5) ── */}
      <View style={styles.bentoGrid}>
        {/* Card 1: Mandi Price */}
        <View style={styles.bentoCard}>
          <View style={styles.bentoHeaderRow}>
            <Store size={15} color="#374151" style={{ marginRight: 5 }} />
            <Text style={styles.bentoHeaderText}>Nashik Market</Text>
            <ArrowUpRight size={14} color="#0284C7" style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.bentoPrice}>
            {currentCrop.marketRange} <Text style={styles.bentoUnit}>/kg</Text>
          </Text>
          <View style={styles.bentoChangeRow}>
            <ArrowUp size={12} color="#16A34A" strokeWidth={3} style={{ marginRight: 2 }} />
            <Text style={styles.bentoChangeText}>+₹2 from yesterday</Text>
          </View>
        </View>

        {/* Card 2: Buyer Demand */}
        <View style={styles.bentoCard}>
          <View style={styles.bentoHeaderRow}>
            <Users size={15} color="#374151" style={{ marginRight: 5 }} />
            <Text style={styles.bentoHeaderText}>Buyer Demand</Text>
            <Flame size={14} color="#EF4444" fill="#EF4444" style={{ marginLeft: 2 }} />
          </View>
          <View style={styles.bentoDemandRow}>
            <Text style={styles.demandHighText}>High</Text>
            <Flame size={16} color="#EF4444" fill="#EF4444" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.activeBuyersText}>15+ active buyers</Text>
        </View>
      </View>

      {/* ── Section 3: Top Match & Net Return Calculation Card (Image 5) ── */}
      <View style={styles.matchCard}>
        <View style={styles.matchHeaderBanner}>
          <View style={styles.matchBadgeLeft}>
            <Star size={13} color="#15803D" fill="#15803D" style={{ marginRight: 6 }} />
            <Text style={styles.matchBadgeText}>TOP MATCH FOR YOU</Text>
          </View>
          <Text style={styles.matchScorePill}>94% MATCH</Text>
        </View>

        <View style={styles.matchBody}>
          <View style={styles.matchCalculationRow}>
            <View style={styles.netReturnCol}>
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
                <Text numberOfLines={1} style={styles.buyerName}>
                  ABC Foods
                </Text>
                <CheckCircle2 size={16} color="#15803D" fill="#DCFCE7" style={{ marginLeft: 6 }} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ═══ Incoming Buyer Order Requests Section (Item 15) ═══ */}
      <View style={styles.orderRequestsSection}>
        <View style={styles.orderRequestsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Users size={18} color="#15803D" />
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

      {/* ── 4. Primary Action CTA ── */}
      <View style={styles.actionWrapper}>
        <Pressable
          onPress={handleFindOptions}
          style={({ pressed }) => [
            styles.findOptionsBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.findOptionsText}>FIND BEST SELLING OPTIONS</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 8 }} />
        </Pressable>
      </View>

      {/* ── MODAL 1: ADD CROP MODAL ── */}
      <Modal
        transparent
        visible={addCropModalOpen}
        animationType="slide"
        onRequestClose={() => setAddCropModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Sprout size={20} color={MKColors.primaryGreen} />
                <Text style={styles.modalTitleText}>Add More Crops</Text>
              </View>
              <Pressable onPress={() => setAddCropModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color={MKColors.textSecondary} />
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
                  <Text numberOfLines={1} style={styles.presetItemName}>
                    {preset.name}
                  </Text>
                  <Text style={styles.presetItemRate}>{preset.marketRange}/kg</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.customCropContainer}>
              <Text style={styles.customLabel}>Or add custom crop with photo:</Text>
              
              {/* Photo Upload for Custom Crop */}
              <View style={styles.customPhotoRow}>
                {customCropPhotoUri ? (
                  <View style={styles.customPhotoPreview}>
                    <Image source={{ uri: customCropPhotoUri }} style={styles.customCropThumb} />
                    <Pressable
                      style={styles.removeCustomPhotoBtn}
                      onPress={() => setCustomCropPhotoUri(undefined)}
                    >
                      <X size={12} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={styles.uploadCustomPhotoBtn}
                    onPress={handlePickCustomCropPhoto}
                  >
                    <Camera size={16} color="#1E5A2A" />
                    <Text style={styles.uploadCustomPhotoText}>Upload Photo</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  placeholder="E.g. Garlic, Chilli, Ginger"
                  placeholderTextColor="#9AA0A6"
                  value={customCropName}
                  onChangeText={setCustomCropName}
                />
                <Pressable onPress={handleAddCustomCrop} style={styles.addCustomBtn}>
                  <Text style={styles.addCustomBtnText}>Add Crop</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 2: QUANTITY DROPDOWN MODAL ── */}
      <Modal
        transparent
        visible={qtyModalOpen}
        animationType="fade"
        onRequestClose={() => setQtyModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Scale size={20} color={MKColors.primaryGreen} />
                <Text style={styles.modalTitleText}>Select Quantity</Text>
              </View>
              <Pressable onPress={() => setQtyModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color={MKColors.textSecondary} />
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
                    {isSelected && <Check size={18} color={MKColors.primaryGreen} strokeWidth={3} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 3: QUALITY GRADE DROPDOWN MODAL ── */}
      <Modal
        transparent
        visible={gradeModalOpen}
        animationType="fade"
        onRequestClose={() => setGradeModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Award size={20} color={MKColors.accentOrange} />
                <Text style={styles.modalTitleText}>Select Quality Grade</Text>
              </View>
              <Pressable onPress={() => setGradeModalOpen(false)} style={styles.closeBtn}>
                <X size={20} color={MKColors.textSecondary} />
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
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── 1. Top Header (Image 5) ── */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.md,
    width: '100%',
  },
  headerCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  headerBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E65100',
  },

  /* ── Section 1: Crop Selector ── */
  cropSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    marginBottom: MKSpacing.md,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  /* ── Produce Batch Photos ── */
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    marginBottom: MKSpacing.md,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  photoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  photoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E5A2A',
  },
  verifiedBatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedBatchText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  photoCardSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  photoScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  addPhotoBtn: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#A5D6A7',
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addPhotoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  batchThumbWrapper: {
    width: 90,
    height: 90,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  batchThumbImage: {
    width: '100%',
    height: '100%',
  },
  webpBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(30, 90, 42, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  webpBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noPhotoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAFAF9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  defaultCropThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  defaultCropNote: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    marginBottom: MKSpacing.sm,
  },
  cropScrollContent: {
    paddingVertical: 4,
  },
  cropSelectBtn: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1.8,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
    marginRight: MKSpacing.sm,
  },
  cropSelectBtnActive: {
    borderColor: '#E65100',
    backgroundColor: '#FFF8F2',
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
    color: '#6B7280',
  },
  cropSelectNameActive: {
    color: '#E65100',
    fontWeight: '800',
  },

  /* + Add New Card */
  addCropCardBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#FAF9F6',
    minWidth: 80,
    height: 96,
  },
  addCropCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addCropCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },

  /* Side-by-Side: Quantity & Grade (Image 5) */
  selectorsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: MKSpacing.md,
    width: '100%',
  },
  selectorCol: {
    flex: 1,
    minWidth: 0,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    paddingHorizontal: 8,
    height: 48,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
  },
  gradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E5DFD5',
    paddingHorizontal: 12,
    height: 48,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },

  /* ── Section 2: Bento Grid (Image 5) ── */
  bentoGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: MKSpacing.md,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 115,
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    minWidth: 0,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bentoHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
  bentoPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1C1E',
    marginBottom: 2,
  },
  bentoUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  bentoChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bentoChangeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  bentoDemandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  demandHighText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
  },
  activeBuyersText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  /* ── Section 3: Match Card (Image 5) ── */
  matchCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    marginBottom: MKSpacing.md,
  },
  matchHeaderBanner: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  matchBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  matchScorePill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    backgroundColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchBody: {
    padding: 16,
    width: '100%',
  },
  matchCalculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  netReturnCol: {
    flex: 1,
    marginRight: MKSpacing.sm,
  },
  netReturnTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  netReturnAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: -0.5,
  },
  netReturnUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  matchCalculationRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  grossPriceText: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '700',
  },
  deductionText: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
    marginTop: 2,
  },
  buyerMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    width: '100%',
  },
  buyerThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    flexShrink: 0,
  },
  buyerDetails: {
    flex: 1,
    minWidth: 0,
  },
  buyerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#212121',
  },

  /* ── 4. Primary Action CTA ── */
  actionWrapper: {
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  findOptionsBtn: {
    width: '100%',
    backgroundColor: '#1E6B2C',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1E6B2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  findOptionsText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    maxHeight: '80%',
    width: '100%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginLeft: 8,
  },
  closeBtn: {
    padding: 6,
  },
  modalSubtext: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginBottom: MKSpacing.md,
  },
  presetsGrid: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: MKSpacing.md,
  },
  presetItemCard: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginRight: MKSpacing.sm,
    minWidth: 0,
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
    color: MKColors.textPrimary,
  },
  presetItemRate: {
    fontSize: 11,
    color: MKColors.primaryGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  customCropContainer: {
    marginTop: MKSpacing.sm,
    width: '100%',
  },
  customLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MKColors.textSecondary,
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    width: '100%',
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
    color: MKColors.textPrimary,
    marginRight: 10,
  },
  addCustomBtn: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addCustomBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  /* Options list */
  optionsList: {
    width: '100%',
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
    marginBottom: MKSpacing.sm,
    width: '100%',
  },
  optionRowActive: {
    backgroundColor: '#E8F5E9',
    borderColor: MKColors.primaryGreen,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: MKColors.textPrimary,
  },
  optionLabelActive: {
    color: MKColors.primaryGreen,
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
    marginBottom: MKSpacing.sm,
    width: '100%',
  },
  gradeOptionCardActive: {
    backgroundColor: '#FFF3E0',
    borderColor: MKColors.accentOrange,
  },
  gradeOptionLeft: {
    flex: 1,
    minWidth: 0,
  },
  gradeOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MKColors.textPrimary,
    marginBottom: 2,
  },
  gradeOptionTitleActive: {
    color: MKColors.accentOrange,
  },
  gradeOptionDesc: {
    fontSize: 12,
    color: MKColors.textSecondary,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MKColors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    flexShrink: 0,
  },

  /* Stepper text input */
  stepperInput: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C1E',
    textAlign: 'center',
    minWidth: 60,
    paddingVertical: 0,
  },

  /* Order Requests Section */
  orderRequestsSection: {
    marginTop: 18,
    marginBottom: 16,
    width: '100%',
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
    color: '#1A1C1E',
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
    borderColor: '#E3DCCF',
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

  /* Custom Crop Photo in Modal */
  customPhotoRow: {
    marginBottom: 10,
  },
  customPhotoPreview: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  customCropThumb: {
    width: '100%',
    height: '100%',
  },
  removeCustomPhotoBtn: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCustomPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#15803D',
    backgroundColor: '#F0FDF4',
  },
  uploadCustomPhotoText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },
});
