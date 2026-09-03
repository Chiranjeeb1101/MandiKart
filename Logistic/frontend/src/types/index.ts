/**
 * MandiKart Logistics — Domain Types & Contracts
 * Aligned with 00_PROJECT_MASTER_GUIDE.md canonical state machine
 */

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'PICKUP_IN_PROGRESS'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'DISPUTED';

export type PickupStatus =
  | 'CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'PICKUP_IN_PROGRESS'
  | 'COLLECTED'
  | 'FAILED';

export type VehicleStatus = 'IDLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'MAINTENANCE';

export type DriverStatus = 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';

export interface Vehicle {
  id: string;
  regNumber: string;
  model: string;
  type: 'Mini Truck (1.5T)' | 'Maxi Truck (2.5T)' | 'Heavy Hauler (4.0T)' | 'Refrigerated Reefer (3.0T)';
  capacityKg: number;
  currentLoadKg: number;
  fuelPercentage: number;
  status: VehicleStatus;
  assignedDriverId?: string;
  isRefrigerated: boolean;
  currentLat: number;
  currentLng: number;
  lastMaintenanceDate: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  status: DriverStatus;
  assignedVehicleId?: string;
  currentRouteId?: string;
  totalTrips: number;
  avatarUrl?: string;
}

export interface PickupItem {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmLocation: string;
  cropName: string;
  quantityKg: number;
  qualityGrade: 'A' | 'B' | 'C';
  pickupStatus: PickupStatus;
  scheduledTime: string;
  collectedTime?: string;
  pickupToken: string;
  notes?: string;
  lat: number;
  lng: number;
}

export interface ProofOfDelivery {
  otp: string;
  verifiedAt?: string;
  receiverName?: string;
  receiverPhone?: string;
  notes?: string;
  signatureCaptured?: boolean;
}

export interface LogisticsOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  isBulk: boolean;
  totalQuantityKg: number;
  totalAmount: number;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  routeId?: string;
  pickups: PickupItem[];
  deliveryLat: number;
  deliveryLng: number;
  deliveryEta: string;
  proofOfDelivery: ProofOfDelivery;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  stopNumber: number;
  type: 'PICKUP' | 'COLLECTION_HUB' | 'DELIVERY';
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  eta: string;
  status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'DELAYED';
  pickupId?: string;
  orderId?: string;
  loadChangeKg: number;
  cropInfo?: string;
  contactPerson: string;
  contactPhone: string;
}

export interface DeliveryRoute {
  id: string;
  routeCode: string;
  vehicleId: string;
  driverId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMins: number;
  status: 'PLANNED' | 'OPTIMIZED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXCEPTION';
  currentStopIndex: number;
  spoilageRiskPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  lastOptimizedAt?: string;
}

export interface ExceptionIncident {
  id: string;
  incidentCode: string;
  routeId?: string;
  orderId?: string;
  pickupId?: string;
  type: 'VEHICLE_BREAKDOWN' | 'TRAFFIC_DELAY' | 'FARMER_UNAVAILABLE' | 'QUALITY_REJECTION' | 'WEATHER_HAZARD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  reportedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  actionTaken?: string;
  assignedVehicleSwapId?: string;
  resolvedAt?: string;
}
