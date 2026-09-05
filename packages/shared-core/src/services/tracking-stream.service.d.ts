/**
 * MandiKart — Real-Time Driver GPS Telemetry & Tracking Stream Service
 * High-frequency location streaming (every 3-5 seconds):
 *  - Driver broadcasts from Logistic partner app
 *  - Stored in Firebase Realtime DB / Firestore without taxing PostgreSQL
 *  - Subscribed to by Buyer UserApp & FarmerApp on InteractiveMapView
 */
import { GeoCoordinates } from '@mandikart/shared-types';
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
export declare class TrackingStreamService {
    private static liveStreamStore;
    private static subscribers;
    /**
     * Broadcasts driver GPS ping (called by Logistic driver app every 3-5s).
     */
    static publishDriverLocation(ping: Omit<DriverTelemetryPing, 'timestamp' | 'remainingDistanceKm' | 'estimatedArrivalMinutes'>): Promise<DriverTelemetryPing>;
    /**
     * Subscribes to driver real-time GPS stream for an active order.
     */
    static subscribeToDriverLocation(orderId: string, callback: TelemetryListener): () => void;
    /**
     * Retrieves latest known driver coordinates for an order.
     */
    static getLatestDriverLocation(orderId: string): DriverTelemetryPing | null;
}
export {};
