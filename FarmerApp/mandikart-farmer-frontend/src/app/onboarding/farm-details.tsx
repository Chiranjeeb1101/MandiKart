/**
 * MandiKart Farmer App — Screen 7: Tell Us About Your Farm (Farm Details)
 * 
 * Implements the approved Stitch visual design:
 * Hero farm landscape, location picker with stylized map thumbnail, farm size
 * with unit selector (Acres/Hectares), crop multiselect grid (Onion, Wheat, Tomato, etc.),
 * farm ownership toggle, success banner, and 3D FINISH SETUP CTA.
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
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  LocateFixed,
  Layers,
  Sprout,
  Plus,
  Warehouse,
  Check,
  ArrowRight,
  ShieldCheck,
  Camera,
  FileText,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { MKBackground, MKButton, MKHeader } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/apiClient';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_LANDSCAPE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyitG1xHjUeo25NCa6DDi94QFNt27vCURHeh9yKp9spBBGWmv17NeA8sqx9TjvMCAjisWRTFpQocVVqSK2q2MSooODZPmu3IvMHisHI07SfQjdcIyr9EPOLOaQb_5XicVXzEfhZTJLZtQn25nuHaoN6WGQvX46cyJGa0MGHb_c9xrbYpkTUxlUKucGs4ULOkjxijPWQbuIr_OCKQOxlZmNb2OyVJjzmQbSqPIygzfOZeUtD7TdSPo0xBOhiyqbMtWNa9mUmzk7X-B0MIE';

const MAP_PREVIEW_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBLvnl7gsUW_MCoB86sEZRv_OEYp0rdF1t6TW0PNIqVjBm_aP2CUGx9Qp9gdG1ximKx0cq2En63MF5nuGoqUrOraX0FgsUIYtUj7HxvjeXR2w6IQyBHdBlllpG14KDFOxMEjw_ANF_ZoBWdf5LwN2uPDEg4vvQirwWNFbCLcNGkBAO7DAdGdRHREzDQo6eL2HDx03d55yYKw0SypjlNYfbKOzTpCx7KgMQFF22Lw6j2oWrtMbxrXm5lqA';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEsoOdmex3qtM0FjWgMDqCkVgzuRtFPoR_fKQ5HxW1Poj6zald8zwgJrtyR76k7D7tquV6ZfHLUpr0qHuP_TEMvlaESWEO8V3CY-LWBDAfR7192ruOhrkYLVk8iMruBK_nsicsfK8_KvrL7C6-At1J39Nq4pksJxKgwKH-MZS5KCq1Eas50IEcfIaAcn_mv-k3t8gJKNNW1UsjtV_wH26sHx6pYGy0rAvoAMz4xHCHE_Nxt7EdK3n0NA';

interface CropOption {
  id: string;
  name: string;
  emoji: string;
}

const CROPS_LIST: CropOption[] = [
  { id: 'onion', name: 'Onion', emoji: '🧅' },
  { id: 'wheat', name: 'Wheat', emoji: '🌾' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'potato', name: 'Potato', emoji: '🥔' },
  { id: 'rice', name: 'Rice', emoji: '🍚' },
  { id: 'maize', name: 'Maize', emoji: '🌽' },
  { id: 'cotton', name: 'Cotton', emoji: '☁️' },
  { id: 'soybean', name: 'Soybean', emoji: '🌱' },
];

export default function FarmDetailsScreen() {
  const router = useRouter();
  const { user, setUser, setIsAuthenticated } = useAuthStore();

  const [farmLocation, setFarmLocation] = useState('Nashik, Maharashtra');
  const [farmSize, setFarmSize] = useState('5.5');
  const [farmUnit, setFarmUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['onion', 'wheat', 'tomato']);
  const [ownershipType, setOwnershipType] = useState<'Owned' | 'Leased'>('Owned');
  const [surveyNumber, setSurveyNumber] = useState('Gat No. 142/B');
  const [soilType, setSoilType] = useState('Black Cotton Soil');
  const [plotImageUri, setPlotImageUri] = useState<string | null>(null);
  const [doc712Uri, setDoc712Uri] = useState<string | null>(null);
  const [uploadingPlot, setUploadingPlot] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handlePickPlotPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is needed to upload your farm plot photo.');
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
        setPlotImageUri(localUri);
        setUploadingPlot(true);
        const upload = await apiClient.uploadImage(localUri, 'land_records');
        setUploadingPlot(false);
        if (upload?.url) {
          setPlotImageUri(upload.url);
          Alert.alert('Farm Plot Photo Uploaded! 🌾', `Compressed to WebP and securely registered.\nStorage saved: ${upload.savingsPercent}%`);
        }
      }
    } catch (err: any) {
      setUploadingPlot(false);
      Alert.alert('Upload Error', err?.message || 'Failed to upload photo');
    }
  };

  const handlePickDoc712 = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll access is needed to upload your 7/12 document.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        const localUri = res.assets[0].uri;
        setDoc712Uri(localUri);
        setUploadingDoc(true);
        const upload = await apiClient.uploadImage(localUri, 'land_records');
        setUploadingDoc(false);
        if (upload?.url) {
          setDoc712Uri(upload.url);
          Alert.alert('7/12 Document Uploaded! 📄', `Compressed to WebP and stored for government verification.\nStorage saved: ${upload.savingsPercent}%`);
        }
      }
    } catch (err: any) {
      setUploadingDoc(false);
      Alert.alert('Upload Error', err?.message || 'Failed to upload document');
    }
  };

  const toggleCrop = (id: string) => {
    if (selectedCrops.includes(id)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== id));
    } else {
      setSelectedCrops([...selectedCrops, id]);
    }
  };

  const handleFinishSetup = () => {
    if (user) {
      setUser({
        ...user,
        farmSizeAcres: parseFloat(farmSize) || 5,
        isVerified: true,
      });
    }
    setIsAuthenticated(true);
    router.replace('/(tabs)/home');
  };

  return (
    <MKBackground disableSafeArea>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: HERO_LANDSCAPE_URI }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <MKHeader
              showBack={true}
              step={{ current: 2, total: 2, label: 'Farm Details' }}
              style={styles.headerRow}
            />

            <View style={styles.heroTitles}>
              <Text style={styles.heroMainTitle}>
                Tell Us About{'\n'}
                <Text style={styles.heroTitleGreen}>Your Farm</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                This helps us show you more relevant market opportunities.
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content Form Cards */}
        <View style={styles.cardsContainer}>
          {/* Section 1: Farm Location */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBadge}>
                <MapPin size={18} color="#1E5A2A" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.cardTitle}>1. Farm Location</Text>
                <Text style={styles.cardSubtitle}>Where is your farm located?</Text>
              </View>
            </View>

            <View style={styles.locationContentRow}>
              <View style={styles.locationInfoBox}>
                <Text style={styles.locationTitle}>{farmLocation}</Text>
                <Text style={styles.locationCountry}>India</Text>
                <Text style={styles.locationNote}>
                  Location helps estimate nearby buyers and transport costs accurately.
                </Text>
              </View>

              <View style={styles.mapThumbWrapper}>
                <Image source={{ uri: MAP_PREVIEW_URI }} style={styles.mapImage} />
              </View>
            </View>

            <View style={styles.locationActionsRow}>
              <Pressable
                onPress={() => setFarmLocation('Dindori, Nashik (Current)')}
                style={styles.locationBtn}
              >
                <LocateFixed size={16} color="#1E5A2A" />
                <Text style={styles.locationBtnText}>Use Current Location</Text>
              </Pressable>
            </View>
          </View>

          {/* Section 2: Farm Size */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBadge}>
                <Layers size={18} color="#1E5A2A" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.cardTitle}>2. Farm Size</Text>
                <Text style={styles.cardSubtitle}>How large is your agricultural land?</Text>
              </View>
            </View>

            <View style={styles.farmSizeInputRow}>
              <TextInput
                style={styles.farmSizeInput}
                value={farmSize}
                onChangeText={setFarmSize}
                keyboardType="decimal-pad"
              />
              <View style={styles.unitToggleContainer}>
                <Pressable
                  onPress={() => setFarmUnit('Acres')}
                  style={[styles.unitBtn, farmUnit === 'Acres' && styles.unitBtnActive]}
                >
                  <Text
                    style={[styles.unitText, farmUnit === 'Acres' && styles.unitTextActive]}
                  >
                    Acres
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFarmUnit('Hectares')}
                  style={[styles.unitBtn, farmUnit === 'Hectares' && styles.unitBtnActive]}
                >
                  <Text
                    style={[styles.unitText, farmUnit === 'Hectares' && styles.unitTextActive]}
                  >
                    Hectares
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Section 3: Crops Grown */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBadge}>
                <Sprout size={18} color="#1E5A2A" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.cardTitle}>3. What do you grow?</Text>
                <Text style={styles.cardSubtitle}>Select crops you produce and harvest.</Text>
              </View>
            </View>

            <View style={styles.cropsGrid}>
              {CROPS_LIST.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <Pressable
                    key={crop.id}
                    onPress={() => toggleCrop(crop.id)}
                    style={[
                      styles.cropChip,
                      isSelected ? styles.cropChipActive : styles.cropChipInactive,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                    <Text
                      style={[
                        styles.cropName,
                        isSelected ? styles.cropNameActive : styles.cropNameInactive,
                      ]}
                    >
                      {crop.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.cropCheckBadge}>
                        <Check size={10} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.addCropBtn}>
              <Plus size={16} color="#1E5A2A" />
              <Text style={styles.addCropText}>Add Another Crop</Text>
            </Pressable>
          </View>

          {/* Section 4: Farm Ownership */}
          <View style={styles.cardRowBetween}>
            <View style={styles.farmTypeLeft}>
              <View style={styles.cardIconBadge}>
                <Warehouse size={18} color="#1E5A2A" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Farm Type</Text>
                <Text style={styles.cardSubtitle}>Ownership status</Text>
              </View>
            </View>

            <View style={styles.segmentedControl}>
              <Pressable
                onPress={() => setOwnershipType('Owned')}
                style={[
                  styles.segmentBtn,
                  ownershipType === 'Owned' && styles.segmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    ownershipType === 'Owned' && styles.segmentTextActive,
                  ]}
                >
                  Owned
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOwnershipType('Leased')}
                style={[
                  styles.segmentBtn,
                  ownershipType === 'Leased' && styles.segmentBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    ownershipType === 'Leased' && styles.segmentTextActive,
                  ]}
                >
                  Leased
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Section 5: Land Records & Photos (7/12 & Farm Plot) */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardIconBadge}>
                <FileText size={18} color="#1E5A2A" strokeWidth={2.2} />
              </View>
              <View>
                <Text style={styles.cardTitle}>5. Land Records & Verification</Text>
                <Text style={styles.cardSubtitle}>Upload farm plot photo & 7/12 land extract</Text>
              </View>
            </View>

            {/* Survey / Gat Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Survey / Gat Number</Text>
              <TextInput
                style={styles.textInput}
                value={surveyNumber}
                onChangeText={setSurveyNumber}
                placeholder="e.g. Gat No. 142/B"
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* Soil Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Soil Type</Text>
              <TextInput
                style={styles.textInput}
                value={soilType}
                onChangeText={setSoilType}
                placeholder="e.g. Black Cotton, Loamy, Red"
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* Upload Buttons Row */}
            <View style={styles.uploadRow}>
              {/* Farm Plot Photo */}
              <Pressable
                onPress={handlePickPlotPhoto}
                style={[styles.uploadBox, plotImageUri ? styles.uploadBoxDone : null]}
              >
                {uploadingPlot ? (
                  <ActivityIndicator size="small" color="#1E5A2A" />
                ) : plotImageUri ? (
                  <>
                    <Image source={{ uri: plotImageUri }} style={styles.uploadThumb} />
                    <View style={styles.uploadDoneBadge}>
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.uploadIconCircle}>
                      <Camera size={20} color="#1E5A2A" />
                    </View>
                    <Text style={styles.uploadBoxTitle}>Farm Plot Photo</Text>
                    <Text style={styles.uploadBoxSub}>Take or choose photo</Text>
                  </>
                )}
              </Pressable>

              {/* 7/12 Land Record Document */}
              <Pressable
                onPress={handlePickDoc712}
                style={[styles.uploadBox, doc712Uri ? styles.uploadBoxDone : null]}
              >
                {uploadingDoc ? (
                  <ActivityIndicator size="small" color="#1E5A2A" />
                ) : doc712Uri ? (
                  <>
                    <Image source={{ uri: doc712Uri }} style={styles.uploadThumb} />
                    <View style={styles.uploadDoneBadge}>
                      <CheckCircle2 size={14} color="#FFFFFF" />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.uploadIconCircle}>
                      <FileText size={20} color="#1E5A2A" />
                    </View>
                    <Text style={styles.uploadBoxTitle}>7/12 Land Extract</Text>
                    <Text style={styles.uploadBoxSub}>Satbara certificate</Text>
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.compressionNote}>
              <ShieldCheck size={14} color="#16A34A" />
              <Text style={styles.compressionNoteText}>
                Photos are automatically compressed to WebP for zero storage wastage.
              </Text>
            </View>
          </View>

          {/* Success Banner */}
          <View style={styles.successBanner}>
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>You're all set!</Text>
              <Text style={styles.successSubtitle}>
                Let's find better market opportunities for your produce.
              </Text>
            </View>
            <Image source={{ uri: VEGGIE_BASKET_URI }} style={styles.successImage} />
          </View>

          {/* Action CTA */}
          <View style={styles.footerAction}>
            <MKButton
              title="FINISH SETUP"
              onPress={handleFinishSetup}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
            />

            {/* Step Dots (All Complete) */}
            <View style={styles.progressDotsRow}>
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotDone]} />
            </View>

            <View style={styles.trustFooterRow}>
              <ShieldCheck size={14} color="#1E5A2A" />
              <Text style={styles.trustFooterText}>100% Secure • No Spam • Verified Network</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 36,
  },
  heroContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 249, 246, 0.75)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 48,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  headerRow: {
    paddingHorizontal: 0,
  },
  heroTitles: {
    maxWidth: '75%',
  },
  heroMainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1C1E',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroTitleGreen: {
    color: '#1E5A2A',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#5F6368',
    marginTop: 6,
    lineHeight: 18,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: -16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0ECE4',
  },
  cardRowBetween: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 1,
  },
  locationContentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  locationInfoBox: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  locationCountry: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 4,
  },
  locationNote: {
    fontSize: 10,
    color: '#7A7A7A',
    lineHeight: 14,
  },
  mapThumbWrapper: {
    width: 100,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  locationActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  locationBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  locationBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  farmSizeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  farmSizeInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#FAF9F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C1E',
    textAlign: 'center',
  },
  unitToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0ECE4',
    borderRadius: 12,
    padding: 3,
  },
  unitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  unitBtnActive: {
    backgroundColor: '#1E5A2A',
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F6368',
  },
  unitTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    position: 'relative',
  },
  cropChipActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: '#1E5A2A',
  },
  cropChipInactive: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E8E4DA',
  },
  cropEmoji: {
    fontSize: 16,
  },
  cropName: {
    fontSize: 13,
    fontWeight: '600',
  },
  cropNameActive: {
    color: '#1E5A2A',
  },
  cropNameInactive: {
    color: '#5F6368',
  },
  cropCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  addCropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#1E5A2A',
    gap: 6,
  },
  addCropText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E5A2A',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#1E5A2A',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F6368',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    position: 'relative',
    overflow: 'hidden',
  },
  successTextContainer: {
    maxWidth: '70%',
    zIndex: 1,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E5A2A',
    marginBottom: 2,
  },
  successSubtitle: {
    fontSize: 12,
    color: '#217128',
    lineHeight: 16,
  },
  successImage: {
    width: 70,
    height: 60,
    position: 'absolute',
    right: 6,
    bottom: 0,
  },
  footerAction: {
    alignItems: 'center',
    paddingTop: 8,
  },
  progressDotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5D5C5',
  },
  dotDone: {
    backgroundColor: '#1E5A2A',
    width: 14,
  },
  trustFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustFooterText: {
    fontSize: 11,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  inputGroup: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  uploadBox: {
    flex: 1,
    height: 120,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#A5D6A7',
    borderRadius: 14,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  uploadBoxDone: {
    borderStyle: 'solid',
    borderColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
  },
  uploadIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
    textAlign: 'center',
  },
  uploadBoxSub: {
    fontSize: 10,
    color: '#757575',
    textAlign: 'center',
    marginTop: 2,
  },
  uploadThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadDoneBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compressionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  compressionNoteText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '500',
    flex: 1,
  },
});
