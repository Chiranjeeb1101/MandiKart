import type { DetailedOrder, DisputeCase } from '../types/ordersAndDisputes';

export const mockDetailedOrders: DetailedOrder[] = [
  {
    id: 'ORD-9402',
    orderNumber: '#MK-9402',
    farmerName: 'Ramesh Patel',
    farmerCode: 'FMR-8921',
    farmerPhone: '+91 98765 43210',
    farmerLocation: 'Nashik, Maharashtra',
    buyerName: 'Vikram Mehta',
    buyerCompany: 'BigBasket Bulk Ops',
    buyerPhone: '+91 91234 56789',
    buyerLocation: 'Thane, Mumbai',
    produceName: 'Tomatoes (Hybrid Grade A)',
    cropName: 'Tomatoes (Hybrid Grade A)',
    qualityGrade: 'Grade A',
    quantityKg: 1,
    pricePerKg: 1,
    totalAmount: 1,
    totalPrice: 1,
    status: 'IN_TRANSIT',
    escrowStatus: 'HELD_IN_ESCROW',
    mandiName: 'Nashik Central Mandi',
    district: 'Nashik',
    createdAt: '2026-09-04 10:15 AM',
    timestamp: '2026-09-04 10:15 AM',
    deliveryAddress: 'Cold Storage Hub #4, Thane West, Mumbai',
    logisticsPartner: 'AgroTruck Express',
    logisticsTrackingId: 'TRK-9402-MH',
    estimatedDelivery: 'Today, 06:00 PM',
  },
];

export const mockDisputeCases: DisputeCase[] = [
  {
    id: 'DSP-201',
    disputeNumber: '#DSP-104',
    orderId: 'ORD-9402',
    orderNumber: '#MK-9402',
    farmerName: 'Suresh Kumar',
    buyerName: 'AgroExport Co-Op',
    produceName: 'Oranges (Nagpur Grade 1)',
    cropName: 'Oranges (Nagpur Grade 1)',
    disputingParty: 'buyer',
    disputeReason: 'COLD_CHAIN_SPOILAGE',
    disputedAmount: 1,
    amountDisputed: 1,
    category: 'SPOILAGE',
    severity: 'CRITICAL',
    status: 'OPEN',
    openedAt: '2026-09-03 03:45 PM',
    farmerClaim: 'Produce was loaded in pristine condition at 18°C. Temperature spike occurred due to logistics reefer failure.',
    buyerClaim: 'Container arrived at JNPT with internal temp of 26°C.',
    description: 'Buyer claims produce arrived spoiled due to reefer truck refrigeration unit failure during transit.',
    weightSlipNumber: 'WS-NAG-49021',
    expectedGrade: 'Export Grade A',
    receivedGrade: 'Grade C (Softened/Spoiled)',
    evidenceFiles: ['Inspection_Report.pdf'],
  },
];

export const MOCK_ORDERS = mockDetailedOrders;
export const MOCK_DISPUTES = mockDisputeCases;
