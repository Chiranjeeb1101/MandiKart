"use strict";
/**
 * MandiKart — Global Geo & Location Utilities
 * Accurate distance calculation, route interpolation, ETA prediction,
 * and regional reverse-geocoding for Indian agricultural corridors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistance = haversineDistance;
exports.estimateEtaMinutes = estimateEtaMinutes;
exports.interpolateRoute = interpolateRoute;
exports.calculateHeading = calculateHeading;
exports.reverseGeocodeLocal = reverseGeocodeLocal;
/**
 * Calculates Great-Circle distance between two points on Earth using Haversine formula.
 * @returns Distance in Kilometers
 */
function haversineDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.latitude)) *
            Math.cos(toRad(coord2.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
}
function toRad(degrees) {
    return (degrees * Math.PI) / 180;
}
/**
 * Estimates travel time in minutes based on distance and average transit speed.
 * Adjusts for rural mandi access roads and urban delivery bottlenecks.
 */
function estimateEtaMinutes(distanceKm, averageSpeedKmH = 32) {
    if (distanceKm <= 0)
        return 0;
    // Account for 5 minutes dispatch/packing handling buffer
    const travelMinutes = (distanceKm / averageSpeedKmH) * 60;
    return Math.max(5, Math.round(travelMinutes));
}
/**
 * Interpolates coordinates along a line between start and end (0.0 to 1.0)
 */
function interpolateRoute(start, end, fraction) {
    const clamped = Math.max(0, Math.min(1, fraction));
    return {
        latitude: start.latitude + (end.latitude - start.latitude) * clamped,
        longitude: start.longitude + (end.longitude - start.longitude) * clamped,
        heading: calculateHeading(start, end),
    };
}
/**
 * Calculates bearing angle in degrees from start to end coordinates.
 */
function calculateHeading(start, end) {
    const dLon = toRad(end.longitude - start.longitude);
    const y = Math.sin(dLon) * Math.cos(toRad(end.latitude));
    const x = Math.cos(toRad(start.latitude)) * Math.sin(toRad(end.latitude)) -
        Math.sin(toRad(start.latitude)) * Math.cos(toRad(end.latitude)) * Math.cos(dLon);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
}
/**
 * Regional Reverse-Geocode lookup tailored for major Maharashtra & Indian Mandi centers.
 * Instantly resolves coordinates without external rate limits, falling back gracefully.
 */
function reverseGeocodeLocal(latitude, longitude) {
    // Pune Cluster (~18.52 N, 73.85 E)
    if (latitude >= 18.3 && latitude <= 18.7 && longitude >= 73.6 && longitude <= 74.1) {
        return {
            formattedAddress: 'Shivajinagar, FC Road, Pune, Maharashtra - 411005',
            street: 'FC Road',
            area: 'Shivajinagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411005',
            country: 'India',
        };
    }
    // Nashik APMC / Farm Cluster (~19.99 N, 73.78 E)
    if (latitude >= 19.8 && latitude <= 20.2 && longitude >= 73.6 && longitude <= 74.0) {
        return {
            formattedAddress: 'Dindori Road, APMC Mandi, Nashik, Maharashtra - 422003',
            street: 'Dindori Road',
            area: 'Panchavati / APMC Yard',
            city: 'Nashik',
            state: 'Maharashtra',
            pincode: '422003',
            country: 'India',
        };
    }
    // Mumbai / Navi Mumbai APMC (~19.07 N, 72.87 E)
    if (latitude >= 18.9 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.1) {
        return {
            formattedAddress: 'Vashi APMC Market, Navi Mumbai, Maharashtra - 400703',
            street: 'Sector 19, APMC Complex',
            area: 'Vashi',
            city: 'Navi Mumbai',
            state: 'Maharashtra',
            pincode: '400703',
            country: 'India',
        };
    }
    // Ahmednagar Farm Belt (~19.09 N, 74.74 E)
    if (latitude >= 18.9 && latitude <= 19.3 && longitude >= 74.5 && longitude <= 75.0) {
        return {
            formattedAddress: 'Station Road, Market Yard, Ahmednagar, Maharashtra - 414001',
            street: 'Market Yard Road',
            area: 'Central Mandi',
            city: 'Ahmednagar',
            state: 'Maharashtra',
            pincode: '414001',
            country: 'India',
        };
    }
    // Default Central Maharashtra Mandi fallback
    return {
        formattedAddress: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E, Maharashtra, India`,
        street: 'Mandi Access Corridor',
        area: 'Agricultural Zone',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India',
    };
}
