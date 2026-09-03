import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Shadows } from '../theme';
import { useLocation, GeoCoordinates } from '../context/LocationContext';

interface InteractiveMapViewProps {
  origin?: {
    title: string;
    coordinates: GeoCoordinates;
    subTitle?: string;
  };
  destination?: {
    title: string;
    coordinates?: GeoCoordinates;
    subTitle?: string;
  };
  driverName?: string;
  vehicleNumber?: string;
  onLocationDetected?: (coords: GeoCoordinates) => void;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InteractiveMapView({
  origin = {
    title: 'Nashik Organic Farm',
    coordinates: { latitude: 19.9975, longitude: 73.7898 },
    subTitle: 'Harvest Lot #2026-09',
  },
  destination = {
    title: 'Your Delivery Location',
    subTitle: 'FC Road, Shivajinagar, Pune',
  },
  driverName = 'Suresh Patil',
  vehicleNumber = 'MH 12 AB 4821',
  onLocationDetected,
  style,
}: InteractiveMapViewProps) {
  const {
    currentLocation,
    currentAddress,
    isLoadingLocation,
    fetchCurrentLocation,
  } = useLocation();

  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [driverProgress, setDriverProgress] = useState<number>(0.65); // 65% completed
  const [driverSpeed, setDriverSpeed] = useState<number>(28);
  const [focusTarget, setFocusTarget] = useState<'driver' | 'destination'>('driver');

  // Periodic driver movement along route
  useEffect(() => {
    const timer = setInterval(() => {
      setDriverProgress((prev) => {
        if (prev >= 0.95) return 0.2; // loop for demo
        return prev + 0.015;
      });
      setDriverSpeed(Math.round(25 + Math.sin(Date.now() / 3000) * 8));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleLocateMe = async () => {
    const coords = await fetchCurrentLocation(true);
    if (coords && onLocationDetected) {
      onLocationDetected(coords);
    }
  };

  // Calculate coordinates on visual grid (percentages)
  const originX = 18;
  const originY = 65;

  const destX = 82;
  const destY = 32;

  // Linear position of driver along vector
  const driverX = originX + (destX - originX) * driverProgress;
  const driverY = originY + (destY - originY) * driverProgress;

  // Real user live GPS marker location
  const userX = Math.min(92, destX + 4);
  const userY = Math.min(84, destY + 28);

  const remainingDistKm = Math.max(0.2, Math.round((1 - driverProgress) * 4.2 * 10) / 10);
  const remainingEtaMin = Math.max(2, Math.round((remainingDistKm / 26) * 60));

  const isSatellite = mapMode === 'satellite';

  return (
    <View style={[styles.container, isSatellite && styles.containerSatellite, style]}>
      {/* Visual Map Canvas Grid */}
      <View style={styles.mapGrid}>
        {/* Geographic Route Line */}
        <View
          style={[
            styles.routeTrack,
            {
              left: `${originX}%`,
              top: `${originY}%`,
              width: `${Math.hypot(destX - originX, destY - originY) * 3.4}%`,
              transform: [
                {
                  rotate: `${Math.atan2(destY - originY, destX - originX) * (180 / Math.PI)}deg`,
                },
              ],
            },
          ]}
        >
          {/* Animated Dashed Progress */}
          <View
            style={[
              styles.routeProgress,
              { width: `${Math.min(100, driverProgress * 100)}%` },
            ]}
          />
        </View>

        {/* Ambient Topography Lines */}
        <View style={[styles.topoLine, { top: '25%', left: '10%' }]} />
        <View style={[styles.topoLine, { top: '55%', left: '40%' }]} />
        <View style={[styles.topoLine, { top: '75%', left: '20%' }]} />

        {/* 1. Origin Marker (Farm) */}
        <View style={[styles.markerContainer, { left: `${originX}%`, top: `${originY}%` }]}>
          <View style={styles.farmBubble}>
            <Text style={styles.bubbleEmoji}>🌾</Text>
          </View>
          <View style={styles.markerLabelWrap}>
            <Text style={styles.markerTitle}>{origin.title}</Text>
            <Text style={styles.markerSubtitle}>{origin.subTitle}</Text>
          </View>
        </View>

        {/* 2. Destination Marker (Buyer Location) */}
        <View style={[styles.markerContainer, { left: `${destX}%`, top: `${destY}%` }]}>
          <View style={styles.destBubble}>
            <Ionicons name="home" size={16} color={Colors.white} />
          </View>
          <View style={styles.markerLabelWrap}>
            <Text style={styles.markerTitle}>{destination.title}</Text>
            <Text style={styles.markerSubtitle} numberOfLines={1}>
              {currentAddress?.street || destination.subTitle}
            </Text>
          </View>
        </View>

        {/* 3. Live Moving Logistics Driver Marker */}
        <View
          style={[
            styles.markerContainer,
            styles.driverContainer,
            {
              left: `${driverX}%`,
              top: `${driverY}%`,
              transform: [{ scale: zoomLevel }],
            },
          ]}
        >
          {/* Radar Pulse Halo */}
          <View style={styles.pulseRadar} />

          <View style={styles.driverBubble}>
            <Ionicons name="car" size={18} color={Colors.white} />
          </View>

          <View style={styles.driverLabelPill}>
            <View style={styles.liveBlinker} />
            <Text style={styles.driverNameText}>{driverName}</Text>
            <Text style={styles.driverSpeedText}>{driverSpeed} km/h</Text>
          </View>
        </View>

        {/* 4. Live User Marker (You Are Here) */}
        <View
          style={[
            styles.markerContainer,
            styles.userContainer,
            {
              left: `${userX}%`,
              top: `${userY}%`,
            },
          ]}
        >
          {/* User Pulsing Accuracy Halo */}
          <View style={styles.userPulseRadar} />
          <View style={styles.userBubble}>
            <Ionicons name="person" size={14} color={Colors.white} />
          </View>
          <View style={styles.userLabelWrap}>
            <View style={styles.userBlinker} />
            <Text style={styles.userLabelText}>You (Live GPS)</Text>
          </View>
        </View>
      </View>

      {/* Top Floating Control Bar */}
      <View style={styles.topControls}>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, !isSatellite && styles.modeBtnActive]}
            onPress={() => setMapMode('street')}
          >
            <Ionicons name="map-outline" size={14} color={!isSatellite ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.modeText, !isSatellite && styles.modeTextActive]}>Road</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, isSatellite && styles.modeBtnActive]}
            onPress={() => setMapMode('satellite')}
          >
            <Ionicons name="planet-outline" size={14} color={isSatellite ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.modeText, isSatellite && styles.modeTextActive]}>Satellite</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.locateMeBtn}
          onPress={handleLocateMe}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              <Ionicons name="locate" size={16} color={Colors.primary} />
              <Text style={styles.locateMeText}>My GPS</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Telemetry Card */}
      <View style={styles.bottomHud}>
        <View style={styles.hudMetric}>
          <Ionicons name="navigate-circle" size={20} color={Colors.primary} />
          <View>
            <Text style={styles.hudValue}>{remainingDistKm} km</Text>
            <Text style={styles.hudLabel}>Distance</Text>
          </View>
        </View>

        <View style={styles.hudDivider} />

        <View style={styles.hudMetric}>
          <Ionicons name="time" size={20} color="#0284C7" />
          <View>
            <Text style={styles.hudValue}>{remainingEtaMin} mins</Text>
            <Text style={styles.hudLabel}>Live ETA</Text>
          </View>
        </View>

        <View style={styles.hudDivider} />

        <View style={styles.hudMetric}>
          <Ionicons name="snow" size={18} color="#0D9488" />
          <View>
            <Text style={styles.hudValue}>4.2°C</Text>
            <Text style={styles.hudLabel}>Cold-Chain</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    backgroundColor: '#EEF6F0',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#C6E8D0',
    position: 'relative',
    ...Shadows.md,
  },
  containerSatellite: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  mapGrid: {
    flex: 1,
    position: 'relative',
  },
  topoLine: {
    position: 'absolute',
    width: 140,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.15)',
  },
  routeTrack: {
    position: 'absolute',
    height: 4,
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderRadius: 2,
    transformOrigin: '0% 50%',
  },
  routeProgress: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 2,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -18,
    marginTop: -18,
  },
  farmBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  destBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  bubbleEmoji: {
    fontSize: 18,
  },
  markerLabelWrap: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
    alignItems: 'center',
    maxWidth: 120,
    ...Shadows.sm,
  },
  markerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  markerSubtitle: {
    fontSize: 8,
    color: Colors.textSecondary,
  },
  driverContainer: {
    zIndex: 10,
  },
  pulseRadar: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    top: -7,
    left: -7,
  },
  driverBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284C7',
    borderWidth: 2.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  driverLabelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    ...Shadows.sm,
  },
  liveBlinker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  driverNameText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  driverSpeedText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  // User Live Marker Styles
  userContainer: {
    zIndex: 12,
  },
  userPulseRadar: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
    top: -5,
    left: -5,
  },
  userBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#7C3AED',
    borderWidth: 2.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  userLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    ...Shadows.sm,
  },
  userBlinker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  userLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6D28D9',
  },
  topControls: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: BorderRadius.full,
    padding: 2,
    ...Shadows.sm,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  modeBtnActive: {
    backgroundColor: Colors.primaryLight,
  },
  modeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  locateMeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    ...Shadows.sm,
  },
  locateMeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  bottomHud: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Shadows.md,
  },
  hudMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  hudLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  hudDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.borderLight,
  },
});
