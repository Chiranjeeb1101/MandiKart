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
  ActivityIndicator,
  Modal,
  Alert,
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
  X,
  Search,
  Camera,
  Upload,
} from 'lucide-react-native';
import { MKBackground, MKButton, MKHeader } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import {
  getCurrentFarmerLocation,
  searchVillageCitySuggestions,
  VillageCitySuggestion,
} from '@/services/locationService';
import { pickImageFromGallery } from '@/services/imagePickerService';
import { FarmMapView } from '@/components/FarmMapView';
import { CelebrationModal } from '@/components/CelebrationModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_LANDSCAPE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyitG1xHjUeo25NCa6DDi94QFNt27vCURHeh9yKp9spBBGWmv17NeA8sqx9TjvMCAjisWRTFpQocVVqSK2q2MSooODZPmu3IvMHisHI07SfQjdcIyr9EPOLOaQb_5XicVXzEfhZTJLZtQn25nuHaoN6WGQvX46cyJGa0MGHb_c9xrbYpkTUxlUKucGs4ULOkjxijPWQbuIr_OCKQOxlZmNb2OyVJjzmQbSqPIygzfOZeUtD7TdSPo0xBOhiyqbMtWNa9mUmzk7X-B0MIE';

const VEGGIE_BASKET_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEsoOdmex3qtM0FjWgMDqCkVgzuRtFPoR_fKQ5HxW1Poj6zald8zwgJrtyR76k7D7tquV6ZfHLUpr0qHuP_TEMvlaESWEO8V3CY-LWBDAfR7192ruOhrkYLVk8iMruBK_nsicsfK8_KvrL7C6-At1J39Nq4pksJxKgwKH-MZS5KCq1Eas50IEcfIaAcn_mv-k3t8gJKNNW1UsjtV_wH26sHx6pYGy0rAvoAMz4xHCHE_Nxt7EdK3n0NA';

interface CropOption {
  id: string;
  name: string;
  emoji: string;
  imageUri?: string;
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

  const initialLoc = user?.village
    ? `${user.village}, ${user.city || user.district || ''}`
    : user?.district
    ? `${user.district}, ${user.state || ''}`
    : 'Bhubaneswar, Odisha';

  const [farmLocation, setFarmLocation] = useState(initialLoc);
  const [latitude, setLatitude] = useState(20.2961);
  const [longitude, setLongitude] = useState(85.8245);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<VillageCitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [farmSize, setFarmSize] = useState('5.5');
  const [farmUnit, setFarmUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['onion', 'wheat', 'tomato']);
  const [ownershipType, setOwnershipType] = useState<'Owned' | 'Leased'>('Owned');

  // Dynamic Crops state
  const [cropsList, setCropsList] = useState<CropOption[]>(CROPS_LIST);
  const [customCropModalVisible, setCustomCropModalVisible] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropEmoji, setNewCropEmoji] = useState('🌱');
  const [customCropImageUri, setCustomCropImageUri] = useState<string | undefined>();
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  async function handleAutoDetectGPS() {
    setIsLocating(true);
    const loc = await getCurrentFarmerLocation();
    setIsLocating(false);
    if (loc) {
      const locDisplay = loc.village
        ? `${loc.village}, ${loc.city || loc.district}`
        : `${loc.city || loc.district}, ${loc.state}`;
      setFarmLocation(locDisplay);
      if (loc.latitude && loc.longitude) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
      }
      setShowSuggestions(false);
      if (user) {
        setUser({
          ...user,
          village: loc.village,
          city: loc.city,
          district: loc.district,
          state: loc.state,
        });
      }
      Alert.alert('GPS Location Fetched', `Location set to: ${loc.formattedAddress}`);
    }
  }

  function handleSearchLocationText(text: string) {
    setLocationSearchQuery(text);
    if (text.trim().length >= 2) {
      const matches = searchVillageCitySuggestions(text);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSelectLocationSuggestion(s: VillageCitySuggestion) {
    const locStr = `${s.name}, ${s.district} (${s.state})`;
    setFarmLocation(locStr);
    setLocationSearchQuery('');
    setShowSuggestions(false);
    if (user) {
      setUser({
        ...user,
        village: s.type === 'Village' ? s.name : user.village,
        city: s.type === 'City' ? s.name : user.city,
        district: s.district,
        state: s.state,
      });
    }
  }

  function handleAddCustomCrop() {
    if (!newCropName.trim()) {
      Alert.alert('Missing Name', 'Please enter a crop name');
      return;
    }
    const cropId = newCropName.toLowerCase().replace(/\s+/g, '_');
    const newCrop: CropOption = {
      id: cropId,
      name: newCropName.trim(),
      emoji: newCropEmoji.trim() || '🌱',
      imageUri: customCropImageUri,
    };
    setCropsList((prev) => [...prev, newCrop]);
    setSelectedCrops((prev) => [...prev, cropId]);
    if (user) {
      const currentCrops = user.crops || [];
      setUser({
        ...user,
        crops: [...currentCrops, newCrop.name],
      });
    }
    setNewCropName('');
    setCustomCropImageUri(undefined);
    setCustomCropModalVisible(false);
    Alert.alert('Crop Added', `${newCrop.name} added to your farm crops!`);
  }

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
    setCelebrationVisible(true);
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

            {/* Interactive React Farm Map View */}
            <View style={{ marginTop: 14, marginBottom: 12 }}>
              <FarmMapView
                locationName={farmLocation}
                latitude={latitude}
                longitude={longitude}
                acres={parseFloat(farmSize) || 5.5}
                onDetectGps={handleAutoDetectGPS}
                isLocating={isLocating}
              />
            </View>

            <View style={styles.locationActionsRow}>
              <Pressable
                onPress={handleAutoDetectGPS}
                style={styles.locationBtn}
                disabled={isLocating}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color="#1E5A2A" />
                ) : (
                  <>
                    <LocateFixed size={16} color="#1E5A2A" />
                    <Text style={styles.locationBtnText}>Detect Realtime GPS</Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Realtime Village / City Search & Suggestion */}
            <View style={styles.villageSearchBox}>
              <View style={styles.villageSearchInputRow}>
                <Search size={16} color="#9CA3AF" />
                <TextInput
                  style={styles.villageSearchInput}
                  placeholder="Search village or mandi city..."
                  value={locationSearchQuery}
                  onChangeText={handleSearchLocationText}
                />
              </View>

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsList}>
                  {suggestions.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.suggestionRow}
                      onPress={() => handleSelectLocationSuggestion(item)}
                    >
                      <MapPin size={13} color="#1E5A2A" />
                      <Text style={styles.suggestionTitle}>{item.name}</Text>
                      <Text style={styles.suggestionTag}>{item.type}</Text>
                      <Text style={styles.suggestionMeta}>
                        ({item.district}, {item.state})
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
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
              {cropsList.map((crop) => {
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
                    {crop.imageUri ? (
                      <Image source={{ uri: crop.imageUri }} style={styles.cropCustomImg} />
                    ) : (
                      <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                    )}
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

            <Pressable
              style={styles.addCropBtn}
              onPress={() => setCustomCropModalVisible(true)}
            >
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

      {/* Add Custom Crop Modal */}
      <Modal
        visible={customCropModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomCropModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCustomCropModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Crop</Text>
              <Pressable onPress={() => setCustomCropModalVisible(false)}>
                <X size={20} color="#666" />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>
              Enter any vegetable, fruit, grain, or cash crop you grow.
            </Text>

            <Text style={styles.inputFieldLabel}>Crop Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Ginger, Chilli, Mustard, Turmeric"
              value={newCropName}
              onChangeText={setNewCropName}
              autoFocus
            />

            <Text style={styles.inputFieldLabel}>Emoji Icon</Text>
            <View style={styles.emojiRow}>
              {['🌱', '🌿', '🌾', '🌶️', '🧄', '🥜', '🥕', '🥬', '🍌', '🥭'].map((em) => (
                <Pressable
                  key={em}
                  style={[styles.emojiSelectBtn, newCropEmoji === em && styles.emojiSelectBtnActive]}
                  onPress={() => setNewCropEmoji(em)}
                >
                  <Text style={styles.emojiSelectText}>{em}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputFieldLabel}>Crop Photo (Optional)</Text>
            <View style={styles.cropPhotoUploadBox}>
              {customCropImageUri ? (
                <View style={styles.cropPhotoPreviewRow}>
                  <Image source={{ uri: customCropImageUri }} style={styles.cropPhotoThumb} />
                  <Pressable
                    style={styles.changePhotoBtn}
                    onPress={async () => {
                      const res = await pickImageFromGallery();
                      if (!res.cancelled && res.uri) {
                        setCustomCropImageUri(res.uri);
                      }
                    }}
                  >
                    <Camera size={14} color="#1E5A2A" />
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removePhotoBtn}
                    onPress={() => setCustomCropImageUri(undefined)}
                  >
                    <X size={16} color="#EF4444" />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.uploadPhotoBtn}
                  onPress={async () => {
                    const res = await pickImageFromGallery();
                    if (!res.cancelled && res.uri) {
                      setCustomCropImageUri(res.uri);
                    }
                  }}
                >
                  <Upload size={16} color="#1E5A2A" />
                  <Text style={styles.uploadPhotoText}>Upload Photo of Your Crop</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => {
                  setCustomCropModalVisible(false);
                  setCustomCropImageUri(undefined);
                }}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalAddBtn} onPress={handleAddCustomCrop}>
                <Text style={styles.modalAddBtnText}>Add to Farm</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ── All Set Celebration Modal ── */}
      <CelebrationModal
        visible={celebrationVisible}
        onContinue={() => {
          setCelebrationVisible(false);
          router.replace('/(tabs)/home');
        }}
        farmerName={user?.name || 'Farmer'}
        farmLocation={farmLocation}
      />
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

  // Village search & Autocomplete
  villageSearchBox: {
    marginTop: 12,
  },
  villageSearchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8F5',
    borderWidth: 1,
    borderColor: '#ECEAE3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  villageSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#241913',
  },
  suggestionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEAE3',
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F1EA',
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#241913',
  },
  suggestionTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF7D1A',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  suggestionMeta: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },

  // Custom Crop Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    lineHeight: 18,
  },
  inputFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: '#F9F8F5',
    borderWidth: 1.5,
    borderColor: '#ECEAE3',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    fontWeight: '600',
    color: '#241913',
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  emojiSelectBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelectBtnActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#1E5A2A',
  },
  emojiSelectText: {
    fontSize: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  modalAddBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cropCustomImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  cropPhotoUploadBox: {
    marginTop: 4,
    marginBottom: 16,
  },
  uploadPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#1E5A2A',
    backgroundColor: '#F4FBF5',
  },
  uploadPhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  cropPhotoPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cropPhotoThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  removePhotoBtn: {
    padding: 8,
  },
});
