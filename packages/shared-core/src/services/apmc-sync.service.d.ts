/**
 * MandiKart — Automated Daily APMC Mandi Rate Synchronization Service
 *
 * Synchronizes benchmark wholesale commodity prices into the shared Supabase 'market_prices' table.
 * Powers the price-discovery cards in FarmerApp, BuyerApp, and Admin dashboard.
 */
export interface MandiRateRecord {
    state: string;
    district: string;
    market_mandi_name: string;
    commodity: string;
    variety: string;
    min_price: number;
    max_price: number;
    modal_price: number;
    price_date: string;
}
export declare class ApmcSyncService {
    private static syncIntervalId;
    /**
     * Fetches fresh APMC mandi rates from Agmarknet / Open Data portal
     * or applies authoritative regional daily modal rates.
     */
    static fetchLatestBenchmarkRates(): Promise<MandiRateRecord[]>;
    /**
     * Executes a full synchronization cycle:
     * 1. Fetches latest daily modal rates
     * 2. Upserts records into Supabase 'market_prices' table
     * 3. Returns sync summary stats
     */
    static syncMandiRates(): Promise<{
        synced: number;
        timestamp: string;
        rates: MandiRateRecord[];
    }>;
    /**
     * Starts background recurring sync (every 24 hours).
     */
    static startAutomatedCron(intervalMs?: number): void;
    static stopAutomatedCron(): void;
}
