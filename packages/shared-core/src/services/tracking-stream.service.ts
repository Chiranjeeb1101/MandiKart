/**
 * MandiKart — Real-Time Driver GPS Telemetry & Tracking Stream Service
 * High-frequency location streaming (every 3-5 seconds):
 *  - Driver broadcasts from Logistic partner app
 *  - Stored in Firebase Realtime DB / Firestore without taxing PostgreSQL
 *  - Subscribed to by Buyer UserApp & FarmerApp on InteractiveMapView
 */

import { GeoCoordinates } from '@mandikart/shared-types';
import { haversineDistance, estimateEtaMinutes } from '../utils/geo.utils.js';

export interface DriverTelemetryPing {
  orderId: string;
  driverId: string;
  driverName?: string;
  coordinates: GeoCoordinates;
  heading?: number;
  speedKmh?: number;
  timestamp: string;
  destinationCoordinates?: GeoCoordinates;
  remainingDistanceKm?: number;
  estimatedArrivalMinutes?: number;
}

type TelemetryListener = (ping: DriverTelemetryPing) => void;

export class TrackingStreamService {
  private static liveStreamStore = new Map<string, DriverTelemetryPing>();
  private static subscribers = new Map<string, Set<TelemetryListener>>();

  /**
   * Broadcasts driver GPS ping (called by Logistic driver app every 3-5s).
   */
  static async publishDriverLocation(
    ping: Omit<DriverTelemetryPing, 'timestamp' | 'remainingDistanceKm' | 'estimatedArrivalMinutes'>
  ): Promise<DriverTelemetryPing> {
    let remainingDistanceKm = 3.8;
    let estimatedArrivalMinutes = 14;

    if (ping.destinationCoordinates) {
      remainingDistanceKm = haversineDistance(ping.coordinates, ping.destinationCoordinates);
      estimatedArrivalMinutes = estimateEtaMinutes(remainingDistanceKm, ping.speedKmh || 32);
    }

    const fullPing: DriverTelemetryPing = {
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
        } catch (e) {
          console.warn('[TrackingStream] Subscriber error:', e);
        }
      });
    }

    return fullPing;
  }

  /**
   * Subscribes to driver real-time GPS stream for an active order.
   */
  static subscribeToDriverLocation(
    orderId: string,
    callback: TelemetryListener
  ): () => void {
    if (!this.subscribers.has(orderId)) {
      this.subscribers.set(orderId, new Set());
    }

    const listeners = this.subscribers.get(orderId)!;
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
  static getLatestDriverLocation(orderId: string): DriverTelemetryPing | null {
    return this.liveStreamStore.get(orderId) || null;
  }
}
