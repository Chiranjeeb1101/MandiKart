import type { 
  LogisticsShipment, 
  CarrierPartner, 
  PriceForecast, 
  SpoilageRiskAlert, 
  SupplyDemandForecast 
} from '../types/logisticsAndAi';

export const MOCK_SHIPMENTS: LogisticsShipment[] = [
  {
    id: 'shp-001',
    trackingId: 'TRK-9402-MH',
    orderId: 'ORD-9402',
    carrierName: 'AgroTruck Express',
    driverName: 'Santosh Pawar',
    driverPhone: '+91 98221 00991',
    vehicleNumber: 'MH-15-EG-4902',
    produceName: 'Tomatoes (Hybrid Grade A)',
    quantityKg: 1,
    originMandi: 'Nashik Central Mandi',
    destinationHub: 'Cold Storage Hub #4, Thane, Mumbai',
    departureTime: '2026-09-04 06:30 AM',
    estimatedArrival: 'Today, 06:00 PM',
    status: 'IN_TRANSIT',
    isReefer: true,
    targetTempCelsius: 4.0,
    currentTempCelsius: 4.5,
    batteryLevelPct: 100,
    gpsCoordinates: { lat: 19.9975, lng: 73.7898 },
  },
];

export const MOCK_CARRIERS: CarrierPartner[] = [
  {
    id: 'car-101',
    name: 'AgroTruck Express',
    code: 'ATE-MH',
    activeFleetSize: 1,
    onTimeDeliveryPct: 100,
    totalDeliveries: 1,
    rating: 5.0,
    contactPerson: 'Sunil Deshmukh',
    contactPhone: '+91 98220 11223',
  },
];

export const MOCK_PRICE_FORECASTS: PriceForecast[] = [
  {
    cropName: 'Tomatoes (Hybrid Grade A)',
    category: 'Vegetables',
    currentAvgPricePerKg: 1.0,
    predicted7DayPricePerKg: 1.0,
    predictedChangePct: 1.0,
    confidencePct: 100,
    trend: 'UPWARD',
    primaryFactor: 'Unseasonal monsoon rainfall in Nashik & Pune growing clusters disrupting harvest.',
    recommendedBasePrice: 1.0,
  },
];

export const MOCK_SPOILAGE_ALERTS: SpoilageRiskAlert[] = [
  {
    id: 'spl-301',
    batchId: 'BATCH-NAG-9399',
    cropName: 'Oranges (Nagpur Grade 1)',
    farmerName: 'Suresh Kumar',
    quantityKg: 1,
    transitHoursElapsed: 1,
    estimatedRemainingShelfHours: 1,
    riskSeverity: 'CRITICAL',
    currentTempCelsius: 26.2,
    recommendedAction: 'Reroute to nearest cold storage hub.',
    location: 'En route near Akola Bypass',
  },
];

export const MOCK_SUPPLY_DEMAND: SupplyDemandForecast[] = [
  {
    region: 'Western Maharashtra',
    state: 'Maharashtra',
    cropName: 'Tomatoes',
    expectedHarvestTons: 1,
    buyerDemandTons: 1,
    balanceState: 'BALANCED',
    gapTons: 1,
  },
];
