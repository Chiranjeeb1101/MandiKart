/**
 * MandiKart — Global Market Price Aggregator Service
 * Aggregates APMC/Agmarknet mandi benchmark prices with aggressive caching.
 */
import { MarketPrice } from '@mandikart/shared-types';
export declare class MarketPriceService {
    /**
     * Fetch benchmark modal prices for a given district & commodity
     */
    static getRates(params: {
        district?: string;
        commodity?: string;
        state?: string;
    }): Promise<MarketPrice[]>;
    private static getCuratedBenchmarkPrices;
}
