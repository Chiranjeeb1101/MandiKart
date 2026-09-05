/**
 * MandiKart Farmer App — Central Orders Store (Zustand)
 *
 * Full-fidelity state management for all farmer orders:
 * - Active in-transit orders with live driver & vehicle tracking telemetry
 * - Pending buyer contract offers awaiting farmer confirmation
 * - Completed orders with settled escrow payouts & weighbridge slips
 * - Atomic order creation from Sell flow, Best Options, and Buyer Requests
 */

import { create } from 'zustand';

export type OrderTab = 'All' | 'Active' | 'Pending' | 'Completed';
export type OrderStatusType = 'en_route' | 'scheduled' | 'pending' | 'completed';

export interface OrderItem {
  id: string;
  orderNumber: string;
  tab: 'Active' | 'Pending' | 'Completed';
  cropName: string;
  cropVariety: string;
  grade: string;
  quantity: string;
  cropImage: string;
  buyerName: string;
  buyerType: string;
  totalValue: string;
  ratePerKg: string;
  netPayout: string;
  transportDeduction: string;
  pickupDate: string;
  pickupTime: string;
  location: string;
  statusLabel: string;
  statusType: OrderStatusType;
  stepIndex: number; // 1: Confirmed/Pending, 2: Vehicle Assigned, 3: En Route, 4: Delivered/Settled
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  etaMins?: number;
  paymentMode?: string;
  createdAt?: string;
}

export interface CreateOrderParams {
  cropName: string;
  cropVariety?: string;
  grade?: string;
  quantityKg: number;
  cropImage?: string;
  buyerName: string;
  buyerType?: string;
  ratePerKg: number;
  grossAmount: number;
  transportDeduction: number;
  netPayout: number;
  location?: string;
  paymentMode?: string;
}

interface OrderStoreState {
  orders: OrderItem[];

  // Actions
  createOrderFromSale: (params: CreateOrderParams) => OrderItem;
  acceptOrderOffer: (orderId: string) => void;
  updateOrderStatus: (orderId: string, updates: Partial<OrderItem>) => void;
  getOrderById: (orderId: string) => OrderItem | undefined;
}

const ONION_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

const TOMATO_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const POTATO_CROP_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

const WHEAT_CROP_URI =
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80';

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord_1',
    orderNumber: '#MK1024',
    tab: 'Active',
    cropName: 'Red Onion',
    cropVariety: 'Nashik Garwa Red',
    grade: 'Grade A',
    quantity: '1,000 KG',
    cropImage: ONION_CROP_URI,
    buyerName: 'ABC Foods & Retail Hub',
    buyerType: 'Verified Corporate Buyer',
    totalValue: '₹24,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹22,000',
    transportDeduction: '₹2,000',
    pickupDate: 'Today, 15 Sept 2026',
    pickupTime: '10:00 AM - 12:00 PM',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Vehicle En Route (6.2 km away)',
    statusType: 'en_route',
    stepIndex: 3,
    driverName: 'Ramesh Gurjar',
    driverPhone: '+91 98234 56789',
    vehicleNumber: 'MH 15 BX 4022',
    vehicleModel: 'Tata Ace Gold (1.5T)',
    etaMins: 22,
    paymentMode: 'IMPS Escrow Guaranteed',
  },
  {
    id: 'ord_2',
    orderNumber: '#MK1031',
    tab: 'Active',
    cropName: 'Hybrid Tomato',
    cropVariety: 'Semi-Ripe Fresh Harvest',
    grade: 'Grade A',
    quantity: '500 KG',
    cropImage: TOMATO_CROP_URI,
    buyerName: 'BigBasket Regional Sourcing',
    buyerType: 'Organized Retail Aggregator',
    totalValue: '₹11,500',
    ratePerKg: '₹23.00/kg',
    netPayout: '₹10,750',
    transportDeduction: '₹750',
    pickupDate: 'Tomorrow, 16 Sept 2026',
    pickupTime: '08:30 AM - 10:30 AM',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Pickup Slot Confirmed',
    statusType: 'scheduled',
    stepIndex: 2,
    driverName: 'Sunil Jadhav',
    driverPhone: '+91 94222 18904',
    vehicleNumber: 'MH 15 CT 8812',
    vehicleModel: 'Mahindra Bolero Maxi Truck',
    paymentMode: 'Direct UPI on Dispatch',
  },
  {
    id: 'ord_3',
    orderNumber: '#MK1018',
    tab: 'Pending',
    cropName: 'Jyoti Potato',
    cropVariety: 'Clean Washed Table Quality',
    grade: 'Grade A',
    quantity: '800 KG',
    cropImage: POTATO_CROP_URI,
    buyerName: 'Kalyan Agro Food Processors',
    buyerType: 'Food Processing Industry',
    totalValue: '₹18,000',
    ratePerKg: '₹22.50/kg',
    netPayout: '₹16,560',
    transportDeduction: '₹1,440',
    pickupDate: '17 Sept 2026 (Proposed)',
    pickupTime: 'Flexible Afternoon',
    location: 'Farmgate, Dindori, Nashik',
    statusLabel: 'Buyer Offer Awaiting Farmer Action',
    statusType: 'pending',
    stepIndex: 1,
    paymentMode: '100% Advance in Escrow',
  },
  {
    id: 'ord_4',
    orderNumber: '#MK1008',
    tab: 'Completed',
    cropName: 'Sharbati Wheat',
    cropVariety: 'Golden Sharbati Grain',
    grade: 'Premium Grade',
    quantity: '2,000 KG',
    cropImage: WHEAT_CROP_URI,
    buyerName: 'ITC e-Choupal Sourcing',
    buyerType: 'FMCG Corporate Client',
    totalValue: '₹48,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹45,000',
    transportDeduction: '₹3,000',
    pickupDate: 'Delivered on 01 Sept 2026',
    pickupTime: 'Completed at 02:15 PM',
    location: 'Delivered to Lasalgaon Hub',
    statusLabel: 'Delivered • Payment Credited',
    statusType: 'completed',
    stepIndex: 4,
    paymentMode: 'Paid via IMPS Ref #TXN9021',
  },
  {
    id: 'ord_5',
    orderNumber: '#MK0994',
    tab: 'Completed',
    cropName: 'Red Onion',
    cropVariety: 'Early Kharif Red',
    grade: 'Grade A',
    quantity: '1,500 KG',
    cropImage: ONION_CROP_URI,
    buyerName: 'Reliance Fresh Mandi Hub',
    buyerType: 'Direct Retail Network',
    totalValue: '₹36,000',
    ratePerKg: '₹24.00/kg',
    netPayout: '₹33,600',
    transportDeduction: '₹2,400',
    pickupDate: 'Delivered on 26 Aug 2026',
    pickupTime: 'Completed at 11:40 AM',
    location: 'Delivered to Nashik Hub',
    statusLabel: 'Delivered • Payment Settled',
    statusType: 'completed',
    stepIndex: 4,
    paymentMode: 'Paid via NEFT Ref #TXN8842',
  },
];

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: INITIAL_ORDERS,

  createOrderFromSale: (params) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#MK${randomSuffix}`;
    const newId = `ord_${Date.now()}`;

    // Get default crop image if none provided
    let fallbackImage = ONION_CROP_URI;
    const nameLower = params.cropName.toLowerCase();
    if (nameLower.includes('tomato')) fallbackImage = TOMATO_CROP_URI;
    else if (nameLower.includes('potato')) fallbackImage = POTATO_CROP_URI;
    else if (nameLower.includes('wheat') || nameLower.includes('grain')) fallbackImage = WHEAT_CROP_URI;

    const newOrder: OrderItem = {
      id: newId,
      orderNumber,
      tab: 'Active',
      cropName: params.cropName,
      cropVariety: params.cropVariety || 'Harvest Batch',
      grade: params.grade || 'Grade A',
      quantity: `${params.quantityKg.toLocaleString()} KG`,
      cropImage: params.cropImage || fallbackImage,
      buyerName: params.buyerName,
      buyerType: params.buyerType || 'Verified Agro Buyer',
      totalValue: `₹${params.grossAmount.toLocaleString()}`,
      ratePerKg: `₹${params.ratePerKg.toFixed(2)}/kg`,
      netPayout: `₹${params.netPayout.toLocaleString()}`,
      transportDeduction: `₹${params.transportDeduction.toLocaleString()}`,
      pickupDate: 'Today (Live Scheduled)',
      pickupTime: '11:30 AM - 01:30 PM',
      location: params.location || 'Farmgate, Main Farm Storage',
      statusLabel: 'Vehicle Dispatched (4.8 km away)',
      statusType: 'en_route',
      stepIndex: 3,
      driverName: 'Ramesh Pawar',
      driverPhone: '+91 98231 44510',
      vehicleNumber: `MH 15 CP ${randomSuffix}`,
      vehicleModel: 'Tata Ace Gold (1.5T)',
      etaMins: 18,
      paymentMode: params.paymentMode || 'MandiKart Escrow Guaranteed',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  acceptOrderOffer: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              tab: 'Active',
              statusType: 'scheduled',
              statusLabel: 'Offer Accepted • Vehicle Scheduled',
              stepIndex: 2,
              driverName: o.driverName || 'Sunil Jadhav',
              driverPhone: o.driverPhone || '+91 94222 18904',
              vehicleNumber: o.vehicleNumber || 'MH 15 CT 8812',
              vehicleModel: o.vehicleModel || 'Mahindra Bolero Maxi Truck',
              pickupDate: 'Tomorrow Morning',
              pickupTime: '09:00 AM - 11:00 AM',
            }
          : o
      ),
    }));
  },

  updateOrderStatus: (orderId, updates) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
    }));
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },
}));
