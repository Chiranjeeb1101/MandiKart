/**
 * MandiKart — Global Geo & Location Utilities
 * Accurate distance calculation, route interpolation, ETA prediction,
 * and regional reverse-geocoding for Indian agricultural corridors.
 */
import { GeoCoordinates, GeoAddress } from '@mandikart/shared-types';
/**
 * Calculates Great-Circle distance between two points on Earth using Haversine formula.
 * @returns Distance in Kilometers
 */
export declare function haversineDistance(coord1: {
    latitude: number;
    longitude: number;
}, coord2: {
    latitude: number;
    longitude: number;
}): number;
/**
 * Estimates travel time in minutes based on distance and average transit speed.
 * Adjusts for rural mandi access roads and urban delivery bottlenecks.
 */
export declare function estimateEtaMinutes(distanceKm: number, averageSpeedKmH?: number): number;
/**
 * Interpolates coordinates along a line between start and end (0.0 to 1.0)
 */
export declare function interpolateRoute(start: GeoCoordinates, end: GeoCoordinates, fraction: number): GeoCoordinates;
/**
 * Calculates bearing angle in degrees from start to end coordinates.
 */
export declare function calculateHeading(start: {
    latitude: number;
    longitude: number;
}, end: {
    latitude: number;
    longitude: number;
}): number;
/**
 * Regional Reverse-Geocode lookup tailored for major Maharashtra & Indian Mandi centers.
 * Instantly resolves coordinates without external rate limits, falling back gracefully.
 */
export declare function reverseGeocodeLocal(latitude: number, longitude: number): GeoAddress;
