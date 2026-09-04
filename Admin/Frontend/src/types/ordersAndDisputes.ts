export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PICKUP_SCHEDULED' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'DISPUTED';

export type EscrowStatus = 
  | 'HELD_IN_ESCROW' 
  | 'RELEASED_TO_FARMER' 
  | 'REFUNDED_TO_BUYER' 
  | 'PARTIAL_SPLIT';

export interface DetailedOrder {
  id: string;
  orderNumber: string;
  farmerName: string;
  farmerCode: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  buyerLocation: string;
  produceName: string;
  cropName: string;
  qualityGrade: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  totalPrice: number;
  status: OrderStatus;
  escrowStatus: EscrowStatus;
  mandiName: string;
  district: string;
  createdAt: string;
  timestamp: string;
  deliveryAddress: string;
  logisticsPartner: string;
  logisticsTrackingId: string;
  estimatedDelivery: string;
}

export type DisputeSeverity = 'CRITICAL' | 'HIGH' | 'MAJOR' | 'MEDIUM' | 'MINOR';
export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED';

export interface DisputeCase {
  id: string;
  disputeNumber: string;
  orderId: string;
  orderNumber: string;
  farmerName: string;
  buyerName: string;
  produceName: string;
  cropName: string;
  disputingParty: 'farmer' | 'buyer';
  disputeReason: string;
  disputedAmount: number;
  amountDisputed: number;
  category: 'SPOILAGE' | 'WEIGHT_MISMATCH' | 'QUALITY_GRADE_FAIL' | 'LOGISTICS_DELAY';
  severity: DisputeSeverity;
  status: DisputeStatus;
  openedAt: string;
  farmerClaim: string;
  buyerClaim: string;
  description: string;
  evidencePhotoUrl?: string;
  evidenceFiles: string[];
  weightSlipNumber?: string;
  expectedGrade?: string;
  receivedGrade?: string;
  resolutionOutcome?: string;
  arbitratorNote?: string;
  resolutionSummary?: string;
}
