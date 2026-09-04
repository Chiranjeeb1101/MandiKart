/**
 * MandiKart — Realtime Location & Village/City Suggestion Service
 *
 * Provides realtime GPS location detection and reverse geocoding via expo-location,
 * plus realtime village and city autocomplete across major Indian agricultural hubs.
 */

import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  state?: string;
  district?: string;
  city?: string;
  village?: string;
  postalCode?: string;
  formattedAddress: string;
}

export interface VillageCitySuggestion {
  id: string;
  name: string;
  type: 'Village' | 'City' | 'Mandi Hub';
  district: string;
  state: string;
}

// Curated database of major agricultural mandi hubs, towns, and villages (Odisha, Maharashtra, Punjab, etc.)
const AGRICULTURAL_LOCATIONS: VillageCitySuggestion[] = [
  // Odisha
  { id: 'or_1', name: 'Bargarh', type: 'Mandi Hub', district: 'Bargarh', state: 'Odisha' },
  { id: 'or_2', name: 'Attabira', type: 'Village', district: 'Bargarh', state: 'Odisha' },
  { id: 'or_3', name: 'Sambalpur', type: 'City', district: 'Sambalpur', state: 'Odisha' },
  { id: 'or_4', name: 'Rengali', type: 'Village', district: 'Sambalpur', state: 'Odisha' },
  { id: 'or_5', name: 'Puri', type: 'City', district: 'Puri', state: 'Odisha' },
  { id: 'or_6', name: 'Nimapada', type: 'Village', district: 'Puri', state: 'Odisha' },
  { id: 'or_7', name: 'Cuttack', type: 'City', district: 'Cuttack', state: 'Odisha' },
  { id: 'or_8', name: 'Banki', type: 'Village', district: 'Cuttack', state: 'Odisha' },
  { id: 'or_9', name: 'Balasore', type: 'City', district: 'Balasore', state: 'Odisha' },
  { id: 'or_10', name: 'Jaleswar', type: 'Mandi Hub', district: 'Balasore', state: 'Odisha' },
  { id: 'or_11', name: 'Bhadrak', type: 'City', district: 'Bhadrak', state: 'Odisha' },
  { id: 'or_12', name: 'Dhamnagar', type: 'Village', district: 'Bhadrak', state: 'Odisha' },
  { id: 'or_13', name: 'Ganjam', type: 'Mandi Hub', district: 'Ganjam', state: 'Odisha' },
  { id: 'or_14', name: 'Berhampur', type: 'City', district: 'Ganjam', state: 'Odisha' },
  { id: 'or_15', name: 'Aska', type: 'Mandi Hub', district: 'Ganjam', state: 'Odisha' },
  { id: 'or_16', name: 'Koraput', type: 'City', district: 'Koraput', state: 'Odisha' },
  { id: 'or_17', name: 'Jeypore', type: 'Mandi Hub', district: 'Koraput', state: 'Odisha' },
  { id: 'or_18', name: 'Semiliguda', type: 'Village', district: 'Koraput', state: 'Odisha' },
  { id: 'or_19', name: 'Mayurbhanj', type: 'City', district: 'Mayurbhanj', state: 'Odisha' },
  { id: 'or_20', name: 'Baripada', type: 'City', district: 'Mayurbhanj', state: 'Odisha' },
  { id: 'or_21', name: 'Kalahandi', type: 'City', district: 'Kalahandi', state: 'Odisha' },
  { id: 'or_22', name: 'Bhawanipatna', type: 'Mandi Hub', district: 'Kalahandi', state: 'Odisha' },
  { id: 'or_23', name: 'Junagarh', type: 'Village', district: 'Kalahandi', state: 'Odisha' },

  // Maharashtra
  { id: 'mh_1', name: 'Nashik', type: 'City', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_2', name: 'Pimpalgaon Baswant', type: 'Mandi Hub', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_3', name: 'Lasalgaon', type: 'Mandi Hub', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_4', name: 'Dindori', type: 'Village', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_5', name: 'Sinnar', type: 'Village', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_6', name: 'Niphad', type: 'Village', district: 'Nashik', state: 'Maharashtra' },
  { id: 'mh_7', name: 'Pune', type: 'City', district: 'Pune', state: 'Maharashtra' },
  { id: 'mh_8', name: 'Junnar', type: 'Mandi Hub', district: 'Pune', state: 'Maharashtra' },
  { id: 'mh_9', name: 'Baramati', type: 'Mandi Hub', district: 'Pune', state: 'Maharashtra' },
  { id: 'mh_10', name: 'Khed', type: 'Village', district: 'Pune', state: 'Maharashtra' },
  { id: 'mh_11', name: 'Ahmednagar', type: 'City', district: 'Ahmednagar', state: 'Maharashtra' },
  { id: 'mh_12', name: 'Rahata', type: 'Village', district: 'Ahmednagar', state: 'Maharashtra' },
  { id: 'mh_13', name: 'Sangamner', type: 'Mandi Hub', district: 'Ahmednagar', state: 'Maharashtra' },
  { id: 'mh_14', name: 'Solapur', type: 'City', district: 'Solapur', state: 'Maharashtra' },
  { id: 'mh_15', name: 'Pandharpur', type: 'Mandi Hub', district: 'Solapur', state: 'Maharashtra' },
  { id: 'mh_16', name: 'Barshi', type: 'Mandi Hub', district: 'Solapur', state: 'Maharashtra' },
  { id: 'mh_17', name: 'Nagpur', type: 'City', district: 'Nagpur', state: 'Maharashtra' },
  { id: 'mh_18', name: 'Katol', type: 'Mandi Hub', district: 'Nagpur', state: 'Maharashtra' },
  { id: 'mh_19', name: 'Kalmeshwar', type: 'Village', district: 'Nagpur', state: 'Maharashtra' },
  { id: 'mh_20', name: 'Satara', type: 'City', district: 'Satara', state: 'Maharashtra' },
  { id: 'mh_21', name: 'Karad', type: 'Mandi Hub', district: 'Satara', state: 'Maharashtra' },
  { id: 'mh_22', name: 'Wai', type: 'Village', district: 'Satara', state: 'Maharashtra' },

  // Punjab / Haryana
  { id: 'pb_1', name: 'Ludhiana', type: 'City', district: 'Ludhiana', state: 'Punjab' },
  { id: 'pb_2', name: 'Khanna', type: 'Mandi Hub', district: 'Ludhiana', state: 'Punjab' },
  { id: 'pb_3', name: 'Jagraon', type: 'Village', district: 'Ludhiana', state: 'Punjab' },
  { id: 'pb_4', name: 'Amritsar', type: 'City', district: 'Amritsar', state: 'Punjab' },
  { id: 'pb_5', name: 'Ajnala', type: 'Village', district: 'Amritsar', state: 'Punjab' },
  { id: 'pb_6', name: 'Bathinda', type: 'City', district: 'Bathinda', state: 'Punjab' },
  { id: 'pb_7', name: 'Karnal', type: 'Mandi Hub', district: 'Karnal', state: 'Haryana' },
];

/**
 * Fetch realtime GPS location of device and reverse geocode
 */
export async function getCurrentFarmerLocation(): Promise<LocationData | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'Please allow location access to automatically detect your farm village and district.'
      );
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;

    let state = 'Maharashtra';
    let district = 'Nashik';
    let city = 'Nashik';
    let village = 'Dindori';
    let postalCode = '422001';
    let formattedAddress = `${city}, ${district}, ${state}`;

    try {
      const reverseList = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseList && reverseList.length > 0) {
        const addr = reverseList[0];
        state = addr.region || state;
        district = addr.subregion || addr.district || district;
        city = addr.city || addr.subregion || city;
        village = addr.street || addr.name || village;
        postalCode = addr.postalCode || postalCode;
        formattedAddress = `${village ? village + ', ' : ''}${city}, ${state}`;
      }
    } catch (reverseErr) {
      console.warn('Reverse geocode fallback:', reverseErr);
    }

    return {
      latitude,
      longitude,
      state,
      district,
      city,
      village,
      postalCode,
      formattedAddress,
    };
  } catch (err: any) {
    console.error('Failed to get realtime location:', err);
    Alert.alert('Location Error', err?.message || 'Could not fetch current GPS location.');
    return null;
  }
}

/**
 * Search village/city suggestions in realtime
 */
export function searchVillageCitySuggestions(query: string, preferredState?: string): VillageCitySuggestion[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  return AGRICULTURAL_LOCATIONS.filter((loc) => {
    const matchesQuery =
      loc.name.toLowerCase().includes(cleanQuery) ||
      loc.district.toLowerCase().includes(cleanQuery) ||
      loc.state.toLowerCase().includes(cleanQuery);

    if (!preferredState) return matchesQuery;
    return matchesQuery && loc.state.toLowerCase() === preferredState.toLowerCase();
  }).slice(0, 8);
}
