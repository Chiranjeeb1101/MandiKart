import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import { apiClient } from '../../services/apiClient';
import { useLocation } from '../../context/LocationContext';

const CROPS = ['Red Onion', 'Tomato', 'Potato', 'Wheat', 'Basmati Rice', 'Green Chilli', 'Ginger', 'Turmeric'];
const GRADES: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];
const UNITS: Array<'quintal' | 'tonne' | 'kg'> = ['quintal', 'tonne', 'kg'];

export default function BulkRequirementScreen({ navigation }: any) {
  const { fetchCurrentLocation, currentAddress } = useLocation();
  const [selectedCrop, setSelectedCrop] = useState('Red Onion');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [quantity, setQuantity] = useState('25');
  const [unit, setUnit] = useState<'quintal' | 'tonne' | 'kg'>('quintal');
  const [maxPrice, setMaxPrice] = useState('2400');
  const [deliveryLocation, setDeliveryLocation] = useState('Pune Wholesale Mandi, Market Yard');
  const [requiredDate, setRequiredDate] = useState('2026-09-15');
  const [loading, setLoading] = useState(false);

  const parsedQty = Number(quantity) || 1;
  const parsedPrice = Number(maxPrice) || 1;
  const totalBudget = parsedQty * parsedPrice;

  const handleSubmit = async () => {
    if (!quantity || !maxPrice) {
      Alert.alert('Required Fields', 'Please fill in quantity and target procurement budget.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.bulk.createRequirement({
        cropName: selectedCrop,
        grade,
        requiredQuantity: parsedQty,
        quantityUnit: unit,
        maxTargetPricePerUnit: parsedPrice,
        deliveryLocation,
        requiredByDate: requiredDate,
      });

      setLoading(false);
      navigation.navigate('BulkMatchDiscovery', {
        requirementId: res.id,
        requirement: res,
      });
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Could not post bulk requirement.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Post Bulk Requirement</Text>
          <Text style={styles.headerSub}>B2B & Commercial Procurement</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro banner */}
        <View style={styles.heroBanner}>
          <Ionicons name="business" size={26} color={Colors.primary} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Direct-From-FPO Sourcing</Text>
            <Text style={styles.heroDesc}>
              Post your target volume and price. Our AI matches certified farm clusters & FPOs to fulfill your demand.
            </Text>
          </View>
        </View>

        {/* 1. Crop Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Select Commodity</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropList}>
            {CROPS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.cropChip, selectedCrop === c && styles.cropChipActive]}
                onPress={() => setSelectedCrop(c)}
              >
                <Text style={[styles.cropChipText, selectedCrop === c && styles.cropChipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quality Grade */}
          <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Quality Grade</Text>
          <View style={styles.gradeRow}>
            {GRADES.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.gradeBtn, grade === g && styles.gradeBtnActive]}
                onPress={() => setGrade(g)}
              >
                <Text style={[styles.gradeTitle, grade === g && styles.gradeTitleActive]}>Grade {g}</Text>
                <Text style={styles.gradeSub}>
                  {g === 'A' ? 'Premium / Export' : g === 'B' ? 'Hotel & Kitchen' : 'Industrial'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Volume & Target Price */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Quantity & Budget</Text>

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Total Quantity</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="25"
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Unit</Text>
              <View style={styles.unitToggleRow}>
                {UNITS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitChip, unit === u && styles.unitChipActive]}
                    onPress={() => setUnit(u)}
                  >
                    <Text style={[styles.unitChipText, unit === u && styles.unitChipTextActive]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={{ marginTop: Spacing.sm }}>
            <Text style={styles.label}>Max Target Price per {unit} (₹)</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
                placeholder="2400"
              />
              <Text style={styles.unitSuffix}>/{unit}</Text>
            </View>
          </View>

          {/* APMC Benchmark Note */}
          <View style={styles.benchmarkBox}>
            <Ionicons name="trending-up" size={16} color="#0369A1" />
            <Text style={styles.benchmarkText}>
              Today's APMC Mandi benchmark for {selectedCrop}: ₹2,320 – ₹2,550 / {unit}
            </Text>
          </View>

          {/* Total Budget calculation */}
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Estimated Procurement Budget:</Text>
            <Text style={styles.budgetValue}>₹{totalBudget.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* 3. Delivery & Date */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Delivery Logistics</Text>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Destination Depot / Mandi Hub</Text>
            <TouchableOpacity
              style={styles.autoLocateBtn}
              onPress={async () => {
                const loc = await fetchCurrentLocation(true);
                if (loc && currentAddress) {
                  setDeliveryLocation(currentAddress.formattedAddress);
                  Alert.alert('Depot Location Updated 📍', `Set to: ${currentAddress.formattedAddress}`);
                }
              }}
            >
              <Ionicons name="locate" size={13} color={Colors.primary} />
              <Text style={styles.autoLocateText}>My GPS</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={deliveryLocation}
            onChangeText={setDeliveryLocation}
            placeholder="Warehouse Address"
          />

          <Text style={[styles.label, { marginTop: Spacing.sm }]}>Expected Delivery By Date</Text>
          <TextInput
            style={styles.input}
            value={requiredDate}
            onChangeText={setRequiredDate}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </ScrollView>

      {/* Footer Submit CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <View style={styles.btnContent}>
              <Ionicons name="sparkles" size={18} color={Colors.white} />
              <Text style={styles.submitBtnText}>Post & Run AI Supplier Match</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  headerTitleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 11, color: Colors.textSecondary },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 100 },
  heroBanner: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: Spacing.md,
    alignItems: 'center',
  },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 14, fontWeight: '700', color: '#1E40AF' },
  heroDesc: { fontSize: 12, color: '#3B82F6', marginTop: 2, lineHeight: 17 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  cropList: { gap: Spacing.xs, paddingVertical: 4 },
  cropChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cropChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  cropChipText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  cropChipTextActive: { color: Colors.primary, fontWeight: '700' },
  gradeRow: { flexDirection: 'row', gap: Spacing.sm },
  gradeBtn: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.gray50,
  },
  gradeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  gradeTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  gradeTitleActive: { color: Colors.primary },
  gradeSub: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', gap: Spacing.md },
  halfCol: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  autoLocateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  autoLocateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  unitToggleRow: { flexDirection: 'row', height: 44, gap: 4 },
  unitChip: {
    flex: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitChipText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  unitChipTextActive: { color: Colors.white },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
  },
  rupeeSign: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginRight: 4 },
  priceInput: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  unitSuffix: { fontSize: 12, color: Colors.textDisabled },
  benchmarkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  benchmarkText: { fontSize: 11, color: '#0369A1', flex: 1 },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.md,
  },
  budgetLabel: { fontSize: 13, color: Colors.textSecondary },
  budgetValue: { fontSize: 16, fontWeight: '800', color: '#15803D' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.md,
  },
  submitBtn: {
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
