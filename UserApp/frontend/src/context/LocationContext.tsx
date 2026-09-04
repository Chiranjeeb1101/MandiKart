import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { apiClient } from '../services/apiClient';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeoAddress {
  formattedAddress: string;
  street?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface TrackingPoint {
  coordinates: GeoCoordinates;
  remainingDistanceKm: number;
  etaMinutes: number;
  progressPercent: number;
  speedKmH: number;
}

export type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface LocationContextType {
  currentLocation: GeoCoordinates | null;
  currentAddress: GeoAddress | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  permissionStatus: PermissionStatus;
  fetchCurrentLocation: (highAccuracy?: boolean) => Promise<GeoCoordinates | null>;
  reverseGeocode: (coords: { latitude: number; longitude: number }) => Promise<GeoAddress>;
  calculateDistance: (
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ) => { distanceKm: number; etaMinutes: number };
  setManualLocation: (coords: GeoCoordinates, address: GeoAddress) => void;
  startDriverSimulation: (
    origin: GeoCoordinates,
    destination: GeoCoordinates,
    onStep: (point: TrackingPoint) => void
  ) => () => void;
}

const DEFAULT_PUNE_COORDS: GeoCoordinates = {
  latitude: 18.5204,
  longitude: 73.8567,
  accuracy: 10,
};

const DEFAULT_PUNE_ADDRESS: GeoAddress = {
  formattedAddress: 'Flat 402, Shivajinagar, FC Road, Pune, Maharashtra - 411005',
  street: 'FC Road',
  area: 'Shivajinagar',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411005',
  country: 'India',
};

// Haversine formula
function computeHaversineDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371; // km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Local Indian Mandi geocoder with regional hub coverage
function resolveLocalAddress(lat: number, lon: number): GeoAddress {
  // Odisha (Bhubaneswar, Cuttack, Puri, Khordha)
  if (lat >= 19.5 && lat <= 21.5 && lon >= 84.0 && lon <= 87.5) {
    return {
      formattedAddress: 'Aiginia Mandi, Khandagiri, Bhubaneswar, Odisha - 751019',
      street: 'NH-16 Khandagiri Road',
      area: 'Aiginia Mandi',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751019',
      country: 'India',
    };
  }
  // Pune corridor
  if (lat >= 18.3 && lat <= 18.7 && lon >= 73.6 && lon <= 74.1) {
    return {
      formattedAddress: 'FC Road, Shivajinagar, Pune, Maharashtra - 411005',
      street: 'FC Road',
      area: 'Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      country: 'India',
    };
  }
  // Nashik Farm belt
  if (lat >= 19.8 && lat <= 20.2 && lon >= 73.6 && lon <= 74.0) {
    return {
      formattedAddress: 'Dindori Road, APMC Mandi, Nashik, Maharashtra - 422003',
      street: 'Dindori Road',
      area: 'Panchavati Mandi',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422003',
      country: 'India',
    };
  }
  // Mumbai / Navi Mumbai
  if (lat >= 18.9 && lat <= 19.3 && lon >= 72.7 && lon <= 73.1) {
    return {
      formattedAddress: 'Sector 19, Vashi APMC, Navi Mumbai, Maharashtra - 400703',
      street: 'Sector 19',
      area: 'Vashi APMC',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400703',
      country: 'India',
    };
  }
  // Delhi NCR
  if (lat >= 28.3 && lat <= 28.9 && lon >= 76.8 && lon <= 77.5) {
    return {
      formattedAddress: 'Azadpur Mandi, GT Karnal Road, New Delhi, Delhi - 110033',
      street: 'GT Karnal Road',
      area: 'Azadpur Mandi',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110033',
      country: 'India',
    };
  }
  // Bengaluru
  if (lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8) {
    return {
      formattedAddress: 'Yeshwanthpur APMC Yard, Tumkur Road, Bengaluru, Karnataka - 560022',
      street: 'Tumkur Main Road',
      area: 'Yeshwanthpur APMC',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560022',
      country: 'India',
    };
  }
  // Generic fallback
  return {
    formattedAddress: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E, Central Mandi Hub, India`,
    street: 'Main Mandi Road',
    area: 'Central District',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    country: 'India',
  };
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: DEFAULT_PUNE_COORDS,
  currentAddress: DEFAULT_PUNE_ADDRESS,
  isLoadingLocation: false,
  locationError: null,
  permissionStatus: 'undetermined',
  fetchCurrentLocation: async () => DEFAULT_PUNE_COORDS,
  reverseGeocode: async () => DEFAULT_PUNE_ADDRESS,
  calculateDistance: () => ({ distanceKm: 2.5, etaMinutes: 15 }),
  setManualLocation: () => {},
  startDriverSimulation: () => () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | null>(DEFAULT_PUNE_COORDS);
  const [currentAddress, setCurrentAddress] = useState<GeoAddress | null>(DEFAULT_PUNE_ADDRESS);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');

  // Reverse geocode wrapper: queries backend API first (zero CORS), then falls back to local dictionary
  const reverseGeocode = async (coords: { latitude: number; longitude: number }): Promise<GeoAddress> => {
    try {
      const serverAddr = await apiClient.tracking.reverseGeocode(coords.latitude, coords.longitude);
      if (serverAddr && serverAddr.city) {
        return {
          formattedAddress: serverAddr.formattedAddress,
          street: serverAddr.street || 'Main Road',
          area: serverAddr.area || serverAddr.city,
          city: serverAddr.city,
          state: serverAddr.state,
          pincode: serverAddr.pincode,
          country: serverAddr.country || 'India',
        };
      }
    } catch {
      // Fallback silently to local dictionary
    }
    return resolveLocalAddress(coords.latitude, coords.longitude);
  };

  const fetchCurrentLocation = async (highAccuracy: boolean = true): Promise<GeoCoordinates | null> => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      if (Platform.OS !== 'web') {
        // Native Android / iOS via expo-location (No API key needed)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionStatus('denied');
          setLocationError('Location permission denied');
          setCurrentLocation(DEFAULT_PUNE_COORDS);
          setCurrentAddress(DEFAULT_PUNE_ADDRESS);
          setIsLoadingLocation(false);
          return DEFAULT_PUNE_COORDS;
        }

        setPermissionStatus('granted');
        const pos = await Location.getCurrentPositionAsync({
          accuracy: highAccuracy ? Location.Accuracy.Balanced : Location.Accuracy.Lowest,
        });

        const coords: GeoCoordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
          altitude: pos.coords.altitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        };

        setCurrentLocation(coords);

        // Native Reverse-Geocode
        try {
          const rev = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          if (rev && rev.length > 0) {
            const r = rev[0];
            const city = r.city || r.subregion || r.district || 'Pune';
            const state = r.region || 'Maharashtra';
            const pincode = r.postalCode || '411005';
            const street = r.street || r.name || 'FC Road';
            const area = r.district || r.subregion || city;
            const formatted = `${street ? street + ', ' : ''}${area ? area + ', ' : ''}${city}, ${state} - ${pincode}`;

            const addr: GeoAddress = {
              formattedAddress: formatted,
              street,
              area,
              city,
              state,
              pincode,
              country: r.country || 'India',
            };
            setCurrentAddress(addr);
          } else {
            const addr = await reverseGeocode(coords);
            setCurrentAddress(addr);
          }
        } catch {
          const addr = await reverseGeocode(coords);
          setCurrentAddress(addr);
        }

        setIsLoadingLocation(false);
        return coords;
      } else {
        // Web fallback with resilient two-tier accuracy and timeout
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          return new Promise((resolve) => {
            const handleSuccess = async (position: any) => {
              const coords: GeoCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              };
              setCurrentLocation(coords);
              setPermissionStatus('granted');
              const addr = await reverseGeocode(coords);
              setCurrentAddress(addr);
              setIsLoadingLocation(false);
              resolve(coords);
            };

            const handleFallback = () => {
              navigator.geolocation.getCurrentPosition(
                handleSuccess,
                () => {
                  setPermissionStatus('denied');
                  setCurrentLocation(DEFAULT_PUNE_COORDS);
                  setCurrentAddress(DEFAULT_PUNE_ADDRESS);
                  setIsLoadingLocation(false);
                  resolve(DEFAULT_PUNE_COORDS);
                },
                { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
              );
            };

            navigator.geolocation.getCurrentPosition(
              handleSuccess,
              handleFallback,
              { enableHighAccuracy: highAccuracy, timeout: 4000, maximumAge: 60000 }
            );
          });
        }
      }
    } catch (e: any) {
      console.warn('[LocationContext] GPS error:', e?.message);
      setLocationError(e?.message || 'Error detecting location');
    }

    setCurrentLocation(DEFAULT_PUNE_COORDS);
    setCurrentAddress(DEFAULT_PUNE_ADDRESS);
    setIsLoadingLocation(false);
    return DEFAULT_PUNE_COORDS;
  };

  // Attempt silent location check on web on mount if permission already granted
  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).permissions) {
      (navigator as any).permissions.query({ name: 'geolocation' }).then((result: any) => {
        if (result.state === 'granted') {
          fetchCurrentLocation(false);
        }
      }).catch(() => {});
    }
  }, []);

  const calculateDistance = (
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): { distanceKm: number; etaMinutes: number } => {
    const dist = computeHaversineDistance(from, to);
    const eta = Math.max(5, Math.round((dist / 32) * 60));
    return { distanceKm: dist, etaMinutes: eta };
  };

  const setManualLocation = (coords: GeoCoordinates, address: GeoAddress) => {
    setCurrentLocation(coords);
    setCurrentAddress(address);
  };

  /**
   * Driver live movement simulation along route
   */
  const startDriverSimulation = (
    origin: GeoCoordinates,
    destination: GeoCoordinates,
    onStep: (point: TrackingPoint) => void
  ): (() => void) => {
    let step = 0;
    const totalSteps = 40; // 40 increments
    const totalDist = computeHaversineDistance(origin, destination);

    const interval = setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / totalSteps);
      const currentLat = origin.latitude + (destination.latitude - origin.latitude) * progress;
      const currentLon = origin.longitude + (destination.longitude - origin.longitude) * progress;
      const remainingDist = Math.max(0.1, Math.round(totalDist * (1 - progress) * 10) / 10);
      const etaMin = Math.max(2, Math.round((remainingDist / 28) * 60));
      const speed = Math.round(24 + Math.sin(step) * 6);

      onStep({
        coordinates: {
          latitude: currentLat,
          longitude: currentLon,
          speed,
        },
        remainingDistanceKm: remainingDist,
        etaMinutes: etaMin,
        progressPercent: Math.round(progress * 100),
        speedKmH: speed,
      });

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        currentAddress,
        isLoadingLocation,
        locationError,
        permissionStatus,
        fetchCurrentLocation,
        reverseGeocode,
        calculateDistance,
        setManualLocation,
        startDriverSimulation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
