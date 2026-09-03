import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';
import PartnerHeader from '../components/PartnerHeader';

const { width } = Dimensions.get('window');

export default function PartnerActiveRouteScreen({ navigation }) {
  const { activeDelivery, advanceDeliveryStep } = usePartner();
  const [etaMins, setEtaMins] = useState(18);
  const [speed, setSpeed] = useState(36);

  useEffect(() => {
    // Subtle speed flutter simulation
    const interval = setInterval(() => {
      setSpeed(prev => Math.floor(34 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleArrived = () => {
    Alert.alert(
      'Arrived at Mandi Gate 3 🚜',
      'You have arrived at Bhubaneswar Central Mandi Hub. Proceed to unload produce and verify Proof of Delivery (POD).',
      [
        {
          text: 'Open POD Screen',
          onPress: () => navigation.navigate('DeliveryPOD'),
        },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS ACTIVATED',
      'Your live GPS coordinates have been sent to MandiKart Mandi Dispatcher and Emergency Response Team.',
      [
        { text: 'Call Police (112)' },
        { text: 'Call Mandi Dispatch', style: 'default' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Live Route Navigation"
        subtitle="Patia Farm → Mandi Hub"
        navigation={navigation}
        showBack
      />

      {/* Turn-by-Turn Instruction Banner */}
      <View style={styles.navigationBanner}>
        <View style={styles.turnIconCircle}>
          <Ionicons name="arrow-undo" size={28} color={COLORS.white} />
        </View>
        <View style={styles.turnInfo}>
          <Text style={styles.turnDistance}>In 350 meters</Text>
          <Text style={styles.turnStreet}>Turn LEFT onto Mandi Bypass Road</Text>
          <Text style={styles.turnNext}>Then continue straight towards Gate 3</Text>
        </View>
      </View>

      {/* Simulated Live Route Map Graphic */}
      <View style={styles.mapContainer}>
        {/* Background Map Visual */}
        <View style={styles.simulatedGrid}>
          {/* Main Road Line */}
          <View style={styles.roadTrack} />
          <View style={styles.roadDashes} />

          {/* Farm Pickup Pin */}
          <View style={styles.farmPin}>
            <MaterialCommunityIcons name="home-silo" size={24} color={COLORS.primary} />
            <Text style={styles.pinLabel}>Ramesh Farm</Text>
          </View>

          {/* Vehicle Marker on Road */}
          <View style={styles.vehicleMarker}>
            <View style={styles.vehiclePulse} />
            <View style={styles.vehicleIconCircle}>
              <MaterialCommunityIcons name="moped" size={24} color={COLORS.white} />
            </View>
            <View style={styles.vehicleSpeedTag}>
              <Text style={styles.vehicleSpeedText}>{speed} km/h</Text>
            </View>
          </View>

          {/* Destination Mandi Pin */}
          <View style={styles.mandiPin}>
            <MaterialCommunityIcons name="storefront-outline" size={26} color={COLORS.error} />
            <Text style={styles.pinLabelRed}>Mandi Hub Gate 3</Text>
          </View>
        </View>

        {/* Floating Controls on Map */}
        <View style={styles.mapFloatingControls}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOS}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={18} color={COLORS.white} />
            <Text style={styles.sosText}>SOS HELP</Text>
          </TouchableOpacity>

          <View style={styles.speedLimitBadge}>
            <Text style={styles.speedLimitNumber}>40</Text>
            <Text style={styles.speedLimitText}>LIMIT</Text>
          </View>
        </View>
      </View>

      {/* Bottom Route Summary Drawer */}
      <View style={styles.bottomDrawer}>
        <View style={styles.etaRow}>
          <View>
            <View style={styles.etaTimeRow}>
              <Text style={styles.etaTime}>{etaMins} mins</Text>
              <Text style={styles.etaDistance}>• 8.4 km remaining</Text>
            </View>
            <Text style={styles.etaEstimatedArrival}>Expected arrival: 12:00 PM (On Time)</Text>
          </View>

          <View style={styles.produceBadge}>
            <Text style={styles.produceBadgeText}>120 kg Tomatoes</Text>
          </View>
        </View>

        {/* Call & Contact Actions */}
        <View style={styles.callRow}>
          <TouchableOpacity
            style={styles.quickContactBtn}
            onPress={() => Alert.alert('Farmer Contact', 'Calling Ramesh Patel (+91 94370 12345)...')}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={18} color={COLORS.primary} />
            <Text style={styles.quickContactText}>Call Farmer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickContactBtn}
            onPress={() => Alert.alert('Mandi Hub Contact', 'Calling Mandi Gate 3 Manager (+91 94371 98765)...')}
            activeOpacity={0.8}
          >
            <Ionicons name="business-outline" size={18} color={COLORS.primary} />
            <Text style={styles.quickContactText}>Call Mandi Hub</Text>
          </TouchableOpacity>
        </View>

        {/* Arrival Confirmation CTA */}
        <TouchableOpacity
          style={styles.arrivedCTA}
          onPress={handleArrived}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
          <Text style={styles.arrivedCTAText}>I Have Arrived at Mandi Gate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navigationBanner: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  turnIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnInfo: {
    flex: 1,
  },
  turnDistance: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.primaryFixed,
    textTransform: 'uppercase',
  },
  turnStreet: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.white,
  },
  turnNext: {
    fontSize: FONT.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#d8e7d7',
    position: 'relative',
    overflow: 'hidden',
  },
  simulatedGrid: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadTrack: {
    position: 'absolute',
    width: 32,
    height: '110%',
    backgroundColor: '#728c73',
    borderRadius: 16,
    transform: [{ rotate: '25deg' }],
  },
  roadDashes: {
    position: 'absolute',
    width: 2,
    height: '100%',
    borderColor: '#ffffff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    transform: [{ rotate: '25deg' }],
  },
  farmPin: {
    position: 'absolute',
    top: 40,
    left: 40,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mandiPin: {
    position: 'absolute',
    bottom: 50,
    right: 40,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pinLabelRed: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.error,
  },
  vehicleMarker: {
    alignItems: 'center',
    zIndex: 10,
  },
  vehiclePulse: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 81, 41, 0.2)',
  },
  vehicleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleSpeedTag: {
    backgroundColor: COLORS.onSurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    marginTop: 4,
  },
  vehicleSpeedText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  mapFloatingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
    alignItems: 'flex-end',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    gap: 6,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sosText: {
    color: COLORS.white,
    fontSize: FONT.xs,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  speedLimitBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  speedLimitNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.onSurface,
    lineHeight: 16,
  },
  speedLimitText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.onSurfaceVariant,
  },
  bottomDrawer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    gap: SPACING.md,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  etaTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  etaTime: {
    fontSize: FONT.xxxl,
    fontWeight: '900',
    color: COLORS.primary,
  },
  etaDistance: {
    fontSize: FONT.base,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  etaEstimatedArrival: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  produceBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  produceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  callRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 6,
  },
  quickContactText: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  arrivedCTA: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  arrivedCTAText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: '800',
  },
});
