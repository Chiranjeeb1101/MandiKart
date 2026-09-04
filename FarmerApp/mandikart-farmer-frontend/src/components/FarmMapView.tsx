/**
 * MandiKart Farmer App — Interactive React Farm Map View
 * Realtime GPS coordinate mapping, boundary plot overlay, terrain grid, and zoom controls.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Line,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  Pattern,
} from 'react-native-svg';
import {
  MapPin,
  Crosshair,
  Plus,
  Minus,
  Layers,
  Navigation,
  Compass,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FarmMapViewProps {
  locationName: string;
  latitude?: number;
  longitude?: number;
  acres?: number;
  onDetectGps?: () => void;
  isLocating?: boolean;
}

export function FarmMapView({
  locationName = 'Dindori, Nashik',
  latitude = 20.2015,
  longitude = 73.8347,
  acres = 5.5,
  onDetectGps,
  isLocating = false,
}: FarmMapViewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapType, setMapType] = useState<'satellite' | 'terrain'>('terrain');

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 1.8));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));

  const isSatellite = mapType === 'satellite';
  const bgColor = isSatellite ? '#2E4C33' : '#E8F5E9';
  const gridLineColor = isSatellite ? 'rgba(255,255,255,0.08)' : 'rgba(46,125,50,0.12)';
  const plotFill = isSatellite ? 'rgba(76, 175, 80, 0.35)' : 'rgba(46, 125, 50, 0.25)';
  const plotStroke = isSatellite ? '#A5D6A7' : '#2E7D32';

  return (
    <View style={styles.container}>
      {/* ── Map Canvas ── */}
      <View style={[styles.canvasWrapper, { backgroundColor: bgColor }]}>
        <Svg width="100%" height={210} viewBox="0 0 340 210">
          <Defs>
            <LinearGradient id="fieldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={isSatellite ? '#1F3723' : '#D7ECD9'} />
              <Stop offset="100%" stopColor={isSatellite ? '#2C4C32' : '#C8E6C9'} />
            </LinearGradient>
            <LinearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#EF6C00" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#EF6C00" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Background base */}
          <Rect width="340" height="210" fill="url(#fieldGrad)" />

          {/* Scaled Layer containing plot, roads & pin */}
          <G transform={`scale(${zoomLevel})`} origin="170, 105">
            {/* Grid & Elevation contours */}
            <Line x1="0" y1="50" x2="340" y2="50" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1="105" x2="340" y2="105" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1="160" x2="340" y2="160" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="85" y1="0" x2="85" y2="210" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="170" y1="0" x2="170" y2="210" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="255" y1="0" x2="255" y2="210" stroke={gridLineColor} strokeWidth="1" strokeDasharray="4 4" />

            {/* Farm canal / irrigation stream */}
            <Path
              d="M0,175 Q90,145 170,165 T340,135"
              fill="none"
              stroke={isSatellite ? '#3B82F6' : '#60A5FA'}
              strokeWidth="3.5"
              strokeOpacity="0.6"
            />

            {/* Farm Access Road */}
            <Path
              d="M30,0 Q70,75 140,110 T310,210"
              fill="none"
              stroke={isSatellite ? '#78716C' : '#D6D3D1'}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <Path
              d="M30,0 Q70,75 140,110 T310,210"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeDasharray="5 5"
            />

            {/* Farm Plot Boundary Polygon (Representing Farmer's Registered Land) */}
            <Polygon
              points="105,60 235,50 255,145 125,155"
              fill={plotFill}
              stroke={plotStroke}
              strokeWidth="2"
              strokeDasharray="6 3"
            />

            {/* Surrounding neighbor plots */}
            <Polygon
              points="15,65 95,60 115,140 30,145"
              fill="none"
              stroke={gridLineColor}
              strokeWidth="1.5"
            />
            <Polygon
              points="245,45 325,40 335,130 265,140"
              fill="none"
              stroke={gridLineColor}
              strokeWidth="1.5"
            />

            {/* Farmer's Central Pin Pulse Halo */}
            <Circle cx="170" cy="105" r="26" fill="url(#pulseGlow)" />
            <Circle cx="170" cy="105" r="14" fill="rgba(239,108,0,0.2)" />
            <Circle cx="170" cy="105" r="7" fill="#EF6C00" />
            <Circle cx="170" cy="105" r="3" fill="#FFFFFF" />
          </G>
        </Svg>

        {/* ── Top Coordinates Pill ── */}
        <View style={styles.coordsBadge}>
          <Navigation size={11} color="#1B5E20" />
          <Text style={styles.coordsText}>
            {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E • {acres} Acres
          </Text>
        </View>

        {/* ── Top Right Map Type Toggle ── */}
        <Pressable
          style={styles.layerBtn}
          onPress={() => setMapType(isSatellite ? 'terrain' : 'satellite')}
        >
          <Layers size={14} color="#1F2937" />
          <Text style={styles.layerBtnText}>{isSatellite ? 'Terrain' : 'Satellite'}</Text>
        </Pressable>

        {/* ── Bottom Left Location Title ── */}
        <View style={styles.bottomLocationCard}>
          <MapPin size={14} color="#2E7D32" />
          <Text numberOfLines={1} style={styles.bottomLocationText}>
            {locationName}
          </Text>
        </View>

        {/* ── Bottom Right Zoom & Center Controls ── */}
        <View style={styles.controlsCol}>
          <Pressable style={styles.zoomBtn} onPress={handleZoomIn}>
            <Plus size={16} color="#1F2937" strokeWidth={2.5} />
          </Pressable>
          <Pressable style={styles.zoomBtn} onPress={handleZoomOut}>
            <Minus size={16} color="#1F2937" strokeWidth={2.5} />
          </Pressable>
          {onDetectGps && (
            <Pressable style={styles.recenterBtn} onPress={onDetectGps}>
              <Crosshair size={16} color="#2E7D32" strokeWidth={2.4} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ECEAE3',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  canvasWrapper: {
    width: '100%',
    height: 210,
    position: 'relative',
    overflow: 'hidden',
  },
  coordsBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coordsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B5E20',
  },
  layerBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  layerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  bottomLocationCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomLocationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  controlsCol: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    gap: 6,
  },
  zoomBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recenterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
