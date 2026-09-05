"use strict";
/**
 * MandiKart — Real-Time Driver GPS Telemetry & Tracking Stream Service
 * High-frequency location streaming (every 3-5 seconds):
 *  - Driver broadcasts from Logistic partner app
 *  - Stored in Firebase Realtime DB / Firestore without taxing PostgreSQL
 *  - Subscribed to by Buyer UserApp & FarmerApp on InteractiveMapView
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingStreamService = void 0;
const geo_utils_js_1 = require("../utils/geo.utils.js");
class TrackingStreamService {
    static liveStreamStore = new Map();
    static subscribers = new Map();
    /**
     * Broadcasts driver GPS ping (called by Logistic driver app every 3-5s).
     */
    static async publishDriverLocation(ping) {
        let remainingDistanceKm = 3.8;
        let estimatedArrivalMinutes = 14;
        if (ping.destinationCoordinates) {
            remainingDistanceKm = (0, geo_utils_js_1.haversineDistance)(ping.coordinates, ping.destinationCoordinates);
            estimatedArrivalMinutes = (0, geo_utils_js_1.estimateEtaMinutes)(remainingDistanceKm, ping.speedKmh || 32);
        }
        const fullPing = {
            ...ping,
            timestamp: new Date().toISOString(),
            remainingDistanceKm,
            estimatedArrivalMinutes,
        };
        // 1. Cache in memory / RTDB
        this.liveStreamStore.set(ping.orderId, fullPing);
        // 2. Dispatch to live subscribers (WebSockets / Firebase listener)
        const listeners = this.subscribers.get(ping.orderId);
        if (listeners) {
            listeners.forEach((fn) => {
                try {
                    fn(fullPing);
                }
                catch (e) {
                    console.warn('[TrackingStream] Subscriber error:', e);
                }
            });
        }
        return fullPing;
    }
    /**
     * Subscribes to driver real-time GPS stream for an active order.
     */
    static subscribeToDriverLocation(orderId, callback) {
        if (!this.subscribers.has(orderId)) {
            this.subscribers.set(orderId, new Set());
        }
        const listeners = this.subscribers.get(orderId);
        listeners.add(callback);
        // Immediately dispatch last known position if available
        const lastPing = this.liveStreamStore.get(orderId);
        if (lastPing) {
            callback(lastPing);
        }
        // Return unsubscribe cleanup function
        return () => {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.subscribers.delete(orderId);
            }
        };
    }
    /**
     * Retrieves latest known driver coordinates for an order.
     */
    static getLatestDriverLocation(orderId) {
        return this.liveStreamStore.get(orderId) || null;
    }
}
exports.TrackingStreamService = TrackingStreamService;
