export type ShipmentStatus = 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'TEMP_ALERT' | 'DELAYED';

export interface LogisticsShipment {
  id: string;
  trackingId: string;
  orderId: string;
  carrierName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  produceName: string;
  quantityKg: number;
  originMandi: string;
  destinationHub: string;
  departureTime: string;
  estimatedArrival: string;
  status: ShipmentStatus;
  isReefer: boolean;
  targetTempCelsius: number;
  currentTempCelsius: number;
  batteryLevelPct: number;
  gpsCoordinates: { lat: number; lng: number };
}

export interface CarrierPartner {
  id: string;
  name: string;
  code: string;
  activeFleetSize: number;
  onTimeDeliveryPct: number;
  totalDeliveries: number;
  rating: number;
  contactPerson: string;
  contactPhone: string;
}

export interface PriceForecast {
  cropName: string;
  category: string;
  currentAvgPricePerKg: number;
  predicted7DayPricePerKg: number;
  predictedChangePct: number;
  confidencePct: number;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  primaryFactor: string;
  recommendedBasePrice: number;
}

export interface SpoilageRiskAlert {
  id: string;
  batchId: string;
  cropName: string;
  farmerName: string;
  quantityKg: number;
  transitHoursElapsed: number;
  estimatedRemainingShelfHours: number;
  riskSeverity: 'HIGH' | 'CRITICAL' | 'MODERATE';
  currentTempCelsius: number;
  recommendedAction: string;
  location: string;
}

export interface SupplyDemandForecast {
  region: string;
  state: string;
  cropName: string;
  expectedHarvestTons: number;
  buyerDemandTons: number;
  balanceState: 'SURPLUS' | 'DEFICIT' | 'BALANCED';
  gapTons: number;
}
