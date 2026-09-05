/**
 * MandiKart — Analytics & Performance Reporting Service
 * Powered by Firebase Analytics event tracking & Supabase Ledger aggregation.
 * Computes live chart datasets:
 *  - GMV Revenue Growth Curves
 *  - Produce Volume by Crop (Donut / Bar)
 *  - Escrow Settlement & Fulfillment Purity (Guage)
 *  - Mandi Price Volatility Index
 */
export interface ChartDataPoint {
    label: string;
    value: number;
    secondaryValue?: number;
}
export interface PlatformAnalyticsData {
    metrics: {
        totalGmv: number;
        totalOrders: number;
        activeFarmers: number;
        activeBuyers: number;
        escrowLockedTotal: number;
        fulfillmentPurityRate: number;
        avgDeliveryTimeMinutes: number;
    };
    gmvGrowthCurve: ChartDataPoint[];
    cropVolumeBreakdown: ChartDataPoint[];
    regionalPriceVolatility: ChartDataPoint[];
    deliveryFulfillmentTrends: ChartDataPoint[];
}
export declare class AnalyticsService {
    /**
     * Logs an event to Firebase Analytics / platform telemetry.
     */
    static logEvent(eventName: string, params?: Record<string, any>): void;
    /**
     * Aggregates platform dashboard metrics and chart series for visualization.
     */
    static getDashboardAnalytics(timeframe?: '7d' | '30d' | '90d'): Promise<PlatformAnalyticsData>;
}
