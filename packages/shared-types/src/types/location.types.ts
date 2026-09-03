/**
 * MandiKart — Canonical Location & Tracking Types
 * Shared across UserApp, FarmerApp, Logistic, and Admin.
 */

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

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  label?: string;
  timestamp?: string;
}

export interface TrackingMetadata {
  orderId: string;
  origin: {
    title: string;
    coordinates: GeoCoordinates;
    address?: string;
    farmerName?: string;
  };
  destination: {
    title: string;
    coordinates: GeoCoordinates;
    address?: string;
    buyerName?: string;
  };
  currentDriverLocation: GeoCoordinates;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  estimatedTimeMinutes: number;
  routeProgressPercent: number;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  temperatureCelsius?: number;
}
