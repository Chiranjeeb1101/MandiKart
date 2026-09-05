/**
 * MandiKart — Weather & Agronomic Advisory Service
 * Powered by Open-Meteo & IMD (India Meteorological Department) regional parameters.
 * Provides hyper-local agricultural advisories for harvest windows, pest risk, and cold-chain transit.
 */
export interface WeatherCondition {
    temperatureC: number;
    humidityPercent: number;
    precipitationMm: number;
    windSpeedKmh: number;
    conditionCode: number;
    conditionText: string;
    isDaytime: boolean;
    advisory: {
        harvestRecommendation: 'OPTIMAL' | 'CAUTION' | 'DELAY';
        pestRisk: 'LOW' | 'MODERATE' | 'HIGH';
        sprayCondition: 'FAVORABLE' | 'UNFAVORABLE';
        summary: string;
    };
}
export declare class WeatherService {
    /**
     * Fetches real-time weather and generates agricultural crop advisory.
     * Defaults to Maharashtra APMC hub coordinates (Pune/Nashik: 18.5204, 73.8567)
     */
    static getAgriWeather(latitude?: number, longitude?: number): Promise<WeatherCondition>;
    private static mapWeatherCodeToText;
    private static generateAgriAdvisory;
}
