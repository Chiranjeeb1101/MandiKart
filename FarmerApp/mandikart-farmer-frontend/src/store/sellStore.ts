/**
 * MandiKart Farmer App — Sell Domain Store (Zustand)
 *
 * Core selling marketplace state:
 * - Verified buyers directory
 * - Buyer requests & negotiations with offer history
 * - Active selling listings created by farmer
 * - Sales history & transaction receipts
 * - Recommendation & matching engine
 * - Atomic order handoff contract
 */

import { create } from 'zustand';
import { useProduceStore } from './produceStore';
import { useOrderStore } from './orderStore';

export interface ExecuteSaleParams {
  cropId?: string;
  cropName: string;
  variety?: string;
  quantityKg: number;
  grade?: string;
  pricePerKg: number;
  buyerName: string;
  buyerType?: BuyerType | string;
  transportPerKg?: number;
  cropImage?: string;
  paymentMethod?: string;
  location?: string;
}

export type BuyerRequestStatus = 'New' | 'Pending' | 'Negotiating' | 'Accepted' | 'Rejected';
export type ListingStatus = 'Available' | 'Buyer Interested' | 'Under Discussion' | 'Reserved' | 'Sold';
export type BuyerType = 'Wholesale Buyer' | 'Food Processor' | 'Retail Chain Hub' | 'Institutional Buyer' | 'Exporter';

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'farmer';
  senderName: string;
  pricePerKg: number;
  quantityKg: number;
  message?: string;
  timestamp: string;
}

export interface BuyerProfile {
  id: string;
  name: string;
  businessType: BuyerType;
  verified: boolean;
  rating: number;
  totalDeals: number;
  location: string;
  distanceKm: number;
  avatar: string;
  paymentTerms: string;
  pickupPreference: string;
}

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: BuyerType;
  verified: boolean;
  avatar: string;
  rating: number;
  cropName: string;
  variety?: string;
  quantityKg: number;
  qualityGrade: string;
  offerPricePerKg: number;
  marketReferencePricePerKg: number;
  distanceKm: number;
  estimatedTransportPerKg: number;
  estimatedNetReturnPerKg: number;
  pickupDate: string;
  receivedAt: string;
  expiresInHours: number;
  status: BuyerRequestStatus;
  history: NegotiationMessage[];
  farmerNote?: string;
  rejectionReason?: string;
}

export interface SellingListing {
  id: string;
  cropId: string;
  cropName: string;
  variety?: string;
  totalKg: number;
  availableKg: number;
  grade: string;
  targetPricePerKg: number;
  availableFrom: string;
  pickupLocation: string;
  notes?: string;
  status: ListingStatus;
  createdAt: string;
  interestedBuyersCount: number;
}

export interface CompletedSale {
  id: string;
  orderId: string;
  cropName: string;
  variety?: string;
  quantityKg: number;
  agreedPricePerKg: number;
  grossAmount: number;
  transportCost: number;
  platformFee: number;
  netPayout: number;
  buyerName: string;
  buyerType: BuyerType;
  saleDate: string;
  status: 'Completed' | 'Payment Pending' | 'In Transit';
  paymentMethod: string;
  transactionRef: string;
}

export interface SellingOpportunity {
  id: string;
  buyer: BuyerProfile;
  cropName: string;
  requiredKg: number;
  requiredGrade: string;
  offerPricePerKg: number;
  marketReferencePricePerKg: number;
  demandStatus: 'High' | 'Medium' | 'Low';
  estimatedTransportPerKg: number;
  estimatedNetReturnPerKg: number;
  matchScorePct: number;
  isRecommended: boolean;
  recommendationReason: string;
  matchChecklist: {
    cropMatches: boolean;
    quantityMatches: boolean;
    qualityMatches: boolean;
    locationSuitable: boolean;
    availabilityMatches: boolean;
  };
}

interface SellStoreState {
  buyers: BuyerProfile[];
  requests: BuyerRequest[];
  listings: SellingListing[];
  salesHistory: CompletedSale[];

  // Actions
  executeSale: (params: ExecuteSaleParams) => { success: boolean; orderId?: string; saleId?: string; error?: string };
  acceptRequest: (requestId: string) => { success: boolean; orderId?: string; error?: string };
  counterOffer: (requestId: string, counterPrice: number, counterQty: number, message?: string) => void;
  rejectRequest: (requestId: string, reason?: string) => void;
  createListing: (listing: Omit<SellingListing, 'id' | 'createdAt' | 'interestedBuyersCount'>) => SellingListing;
  getOpportunitiesForCrop: (cropName: string, availableKg: number, grade: string) => SellingOpportunity[];
  getRequestById: (requestId: string) => BuyerRequest | undefined;
  getSaleById: (saleId: string) => CompletedSale | undefined;
}

// Initial Realistic Buyers
const INITIAL_BUYERS: BuyerProfile[] = [
  {
    id: 'buyer_abc',
    name: 'ABC Foods & Agro Procurements',
    businessType: 'Food Processor',
    verified: true,
    rating: 4.8,
    totalDeals: 1240,
    location: 'Nashik Industrial Area, MIDC',
    distanceKm: 40,
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    paymentTerms: 'Instant Bank Transfer upon Weighbridge slip',
    pickupPreference: 'Buyer vehicle farmgate pickup',
  },
  {
    id: 'buyer_freshmart',
    name: 'FreshMart Supermarkets Regional Hub',
    businessType: 'Retail Chain Hub',
    verified: true,
    rating: 4.9,
    totalDeals: 2150,
    location: 'Kalyan Logistics Park',
    distanceKm: 48,
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    paymentTerms: 'MandiKart Escrow (Released in 12h)',
    pickupPreference: 'Daily morning farmgate collection',
  },
  {
    id: 'buyer_reliance',
    name: 'Reliance Fresh Sourcing Center',
    businessType: 'Retail Chain Hub',
    verified: true,
    rating: 4.7,
    totalDeals: 3400,
    location: 'Bhiwandi Sourcing Terminal',
    distanceKm: 65,
    avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
    paymentTerms: 'Direct IMPS / NEFT on dispatch',
    pickupPreference: 'Dedicated Reefer Truck provided',
  },
  {
    id: 'buyer_local',
    name: 'Kalyan Wholesale APMC Traders',
    businessType: 'Wholesale Buyer',
    verified: true,
    rating: 4.6,
    totalDeals: 880,
    location: 'Kalyan APMC Yard',
    distanceKm: 32,
    avatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=120&auto=format&fit=crop&q=80',
    paymentTerms: 'Same-day bank settlement',
    pickupPreference: 'Mandi drop or shared transit',
  },
];

// Initial Realistic Incoming Buyer Requests
const INITIAL_REQUESTS: BuyerRequest[] = [
  {
    id: 'req_101',
    buyerId: 'buyer_abc',
    buyerName: 'ABC Foods & Agro Procurements',
    buyerType: 'Food Processor',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    rating: 4.8,
    cropName: 'Red Onion',
    variety: 'Nashik Red Garwa',
    quantityKg: 800,
    qualityGrade: 'Grade A',
    offerPricePerKg: 24.5,
    marketReferencePricePerKg: 22.0,
    distanceKm: 40,
    estimatedTransportPerKg: 1.5,
    estimatedNetReturnPerKg: 23.0,
    pickupDate: 'Tomorrow, 10:00 AM',
    receivedAt: 'Today, 11:20 AM',
    expiresInHours: 8,
    status: 'New',
    history: [
      {
        id: 'msg_1',
        sender: 'buyer',
        senderName: 'ABC Foods',
        pricePerKg: 24.5,
        quantityKg: 800,
        message: 'Looking for 800 kg Grade A Garwa Onion for institutional processing.',
        timestamp: '11:20 AM',
      },
    ],
  },
  {
    id: 'req_102',
    buyerId: 'buyer_freshmart',
    buyerName: 'FreshMart Supermarkets',
    buyerType: 'Retail Chain Hub',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    rating: 4.9,
    cropName: 'Hybrid Tomato',
    variety: 'Semi-Ripe Fresh Harvest',
    quantityKg: 300,
    qualityGrade: 'Grade B',
    offerPricePerKg: 20.0,
    marketReferencePricePerKg: 18.0,
    distanceKm: 28,
    estimatedTransportPerKg: 1.2,
    estimatedNetReturnPerKg: 18.8,
    pickupDate: 'Today, 4:00 PM',
    receivedAt: 'Today, 09:45 AM',
    expiresInHours: 4,
    status: 'Pending',
    history: [
      {
        id: 'msg_2',
        sender: 'buyer',
        senderName: 'FreshMart',
        pricePerKg: 20.0,
        quantityKg: 300,
        message: 'Need 300 kg fresh semi-ripe tomato for evening supermarket shelves.',
        timestamp: '09:45 AM',
      },
    ],
  },
  {
    id: 'req_103',
    buyerId: 'buyer_local',
    buyerName: 'Kalyan Wholesale APMC Traders',
    buyerType: 'Wholesale Buyer',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=120&auto=format&fit=crop&q=80',
    rating: 4.6,
    cropName: 'Jyoti Potato',
    variety: 'Clean Washed Table Quality',
    quantityKg: 500,
    qualityGrade: 'Grade A',
    offerPricePerKg: 21.0,
    marketReferencePricePerKg: 20.0,
    distanceKm: 32,
    estimatedTransportPerKg: 1.0,
    estimatedNetReturnPerKg: 20.0,
    pickupDate: '06 Sep, Morning',
    receivedAt: 'Yesterday, 04:15 PM',
    expiresInHours: 18,
    status: 'Negotiating',
    history: [
      {
        id: 'msg_3',
        sender: 'buyer',
        senderName: 'Kalyan Traders',
        pricePerKg: 20.0,
        quantityKg: 500,
        message: 'Initial wholesale inquiry at ₹20/kg.',
        timestamp: 'Yesterday 04:15 PM',
      },
      {
        id: 'msg_4',
        sender: 'farmer',
        senderName: 'You',
        pricePerKg: 21.5,
        quantityKg: 500,
        message: 'Cold storage premium Grade A stock. Can offer at ₹21.50/kg.',
        timestamp: 'Yesterday 06:30 PM',
      },
      {
        id: 'msg_5',
        sender: 'buyer',
        senderName: 'Kalyan Traders',
        pricePerKg: 21.0,
        quantityKg: 500,
        message: 'Counter offer: ₹21.00/kg with prompt farm pickup.',
        timestamp: 'Today 08:30 AM',
      },
    ],
  },
];

// Initial Listings
const INITIAL_LISTINGS: SellingListing[] = [
  {
    id: 'list_1',
    cropId: 'crop_1',
    cropName: 'Red Onion',
    variety: 'Nashik Red Garwa',
    totalKg: 1000,
    availableKg: 800,
    grade: 'Grade A',
    targetPricePerKg: 24.0,
    availableFrom: 'Immediate',
    pickupLocation: 'Dindori Farm Shed #2',
    notes: 'Well cured neck, dry storage in wooden slatted chawl.',
    status: 'Buyer Interested',
    createdAt: '02 Sep 2026',
    interestedBuyersCount: 6,
  },
  {
    id: 'list_2',
    cropId: 'crop_4',
    cropName: 'Lokwan Wheat',
    variety: 'Clean Dried Grain',
    totalKg: 300,
    availableKg: 300,
    grade: 'Grade A',
    targetPricePerKg: 29.0,
    availableFrom: 'Within 3 Days',
    pickupLocation: 'Farm Granary Silo #1',
    notes: 'Moisture < 12%, stored with organic neem leaves.',
    status: 'Available',
    createdAt: '03 Sep 2026',
    interestedBuyersCount: 2,
  },
];

// Initial Sales History
const INITIAL_SALES: CompletedSale[] = [
  {
    id: 'sale_801',
    orderId: 'MK-ORD-9021',
    cropName: 'Red Onion',
    variety: 'Nashik Red Garwa',
    quantityKg: 1000,
    agreedPricePerKg: 24.0,
    grossAmount: 24000,
    transportCost: 1200,
    platformFee: 0,
    netPayout: 22800,
    buyerName: 'ABC Foods & Agro Procurements',
    buyerType: 'Food Processor',
    saleDate: '28 Aug 2026',
    status: 'Completed',
    paymentMethod: 'Instant Bank Transfer (IMPS)',
    transactionRef: 'IMPS-MK-90218844',
  },
  {
    id: 'sale_802',
    orderId: 'MK-ORD-8944',
    cropName: 'Jyoti Potato',
    variety: 'Table Grade A',
    quantityKg: 500,
    agreedPricePerKg: 21.0,
    grossAmount: 10500,
    transportCost: 600,
    platformFee: 0,
    netPayout: 9900,
    buyerName: 'Kalyan Wholesale APMC Traders',
    buyerType: 'Wholesale Buyer',
    saleDate: '22 Aug 2026',
    status: 'Completed',
    paymentMethod: 'Bank Transfer (NEFT)',
    transactionRef: 'NEFT-MK-89441029',
  },
  {
    id: 'sale_803',
    orderId: 'MK-ORD-9102',
    cropName: 'Hybrid Tomato',
    variety: 'Semi-Ripe Fresh Harvest',
    quantityKg: 250,
    agreedPricePerKg: 19.5,
    grossAmount: 4875,
    transportCost: 350,
    platformFee: 0,
    netPayout: 4525,
    buyerName: 'FreshMart Supermarkets',
    buyerType: 'Retail Chain Hub',
    saleDate: '01 Sep 2026',
    status: 'Completed',
    paymentMethod: 'MandiKart Escrow',
    transactionRef: 'ESCROW-MK-910234',
  },
];

export const useSellStore = create<SellStoreState>((set, get) => ({
  buyers: INITIAL_BUYERS,
  requests: INITIAL_REQUESTS,
  listings: INITIAL_LISTINGS,
  salesHistory: INITIAL_SALES,

  executeSale: (params: ExecuteSaleParams) => {
    const produceStore = useProduceStore.getState();
    const matchingCrop = params.cropId
      ? produceStore.getCropById(params.cropId)
      : produceStore.crops.find(
          (c) => c.cropName.toLowerCase() === params.cropName.toLowerCase()
        );

    if (matchingCrop && matchingCrop.availableKg < params.quantityKg) {
      return {
        success: false,
        error: `Insufficient available stock. You have ${matchingCrop.availableKg.toLocaleString()} kg available, but attempted to sell ${params.quantityKg.toLocaleString()} kg.`,
      };
    }

    const grossVal = params.quantityKg * params.pricePerKg;
    const transportTotal = Math.round(params.quantityKg * (params.transportPerKg ?? 0.8));
    const netTotal = grossVal - transportTotal;
    const saleId = `sale_${Date.now()}`;

    // 1. Deduct from produceStore
    if (matchingCrop) {
      const remainingAvailable = Math.max(0, matchingCrop.availableKg - params.quantityKg);
      const updatedSold = (matchingCrop.soldKg || 0) + params.quantityKg;
      produceStore.updateCropDetails(matchingCrop.id, {
        availableKg: remainingAvailable,
        soldKg: updatedSold,
        totalKg: remainingAvailable + matchingCrop.reservedKg + updatedSold,
      });
    }

    // 2. Create real order in orderStore
    const newOrder = useOrderStore.getState().createOrderFromSale({
      cropName: params.cropName,
      cropVariety: params.variety || matchingCrop?.variety || 'Harvest Batch',
      grade: params.grade || matchingCrop?.grade || 'Grade A',
      quantityKg: params.quantityKg,
      cropImage: params.cropImage || matchingCrop?.imageUri,
      buyerName: params.buyerName,
      buyerType: typeof params.buyerType === 'string' ? params.buyerType : undefined,
      ratePerKg: params.pricePerKg,
      grossAmount: grossVal,
      transportDeduction: transportTotal,
      netPayout: netTotal,
      location: params.location || matchingCrop?.location || 'Farmgate, Main Farm Storage',
      paymentMode: params.paymentMethod || 'MandiKart Escrow Guaranteed',
    });

    const orderId = newOrder.orderNumber;

    // 3. Record in salesHistory
    const completedSale: CompletedSale = {
      id: saleId,
      orderId: orderId,
      cropName: params.cropName,
      variety: params.variety || matchingCrop?.variety,
      quantityKg: params.quantityKg,
      agreedPricePerKg: params.pricePerKg,
      grossAmount: grossVal,
      transportCost: transportTotal,
      platformFee: 0,
      netPayout: netTotal,
      buyerName: params.buyerName,
      buyerType: (params.buyerType as BuyerType) || 'Food Processor',
      saleDate: 'Today (Just now)',
      status: 'In Transit',
      paymentMethod: params.paymentMethod || 'MandiKart Escrow (Guaranteed)',
      transactionRef: `TXN-${orderId.replace('#', '')}`,
    };

    set((state) => ({
      salesHistory: [completedSale, ...state.salesHistory],
    }));

    return { success: true, orderId, saleId };
  },

  acceptRequest: (requestId: string) => {
    const req = get().requests.find((r) => r.id === requestId);
    if (!req) {
      return { success: false, error: 'Request not found' };
    }

    // Safety check against produce inventory
    const produceStore = useProduceStore.getState();
    const matchingCrop = produceStore.crops.find(
      (c) => c.cropName.toLowerCase() === req.cropName.toLowerCase()
    );

    if (matchingCrop && matchingCrop.availableKg < req.quantityKg) {
      return {
        success: false,
        error: `Insufficient available stock. You have ${matchingCrop.availableKg.toLocaleString()} kg available, but the buyer requested ${req.quantityKg.toLocaleString()} kg.`,
      };
    }

    const grossVal = req.quantityKg * req.offerPricePerKg;
    const transportTotal = Math.round(req.quantityKg * req.estimatedTransportPerKg);
    const netTotal = grossVal - transportTotal;
    const saleId = `sale_${Date.now()}`;

    // 1. Move available inventory to sold in produceStore
    if (matchingCrop) {
      const remainingAvailable = Math.max(0, matchingCrop.availableKg - req.quantityKg);
      const updatedSold = (matchingCrop.soldKg || 0) + req.quantityKg;
      produceStore.updateCropDetails(matchingCrop.id, {
        availableKg: remainingAvailable,
        soldKg: updatedSold,
        totalKg: remainingAvailable + matchingCrop.reservedKg + updatedSold,
      });
    }

    // 2. Create real order in orderStore
    const newOrder = useOrderStore.getState().createOrderFromSale({
      cropName: req.cropName,
      cropVariety: req.variety || matchingCrop?.variety || 'Harvest Batch',
      grade: req.qualityGrade || matchingCrop?.grade || 'Grade A',
      quantityKg: req.quantityKg,
      cropImage: matchingCrop?.imageUri || req.avatar,
      buyerName: req.buyerName,
      buyerType: req.buyerType,
      ratePerKg: req.offerPricePerKg,
      grossAmount: grossVal,
      transportDeduction: transportTotal,
      netPayout: netTotal,
      location: matchingCrop?.location || 'Farmgate, Main Farm Storage',
      paymentMode: 'Direct Bank Settlement (Escrow)',
    });

    const orderId = newOrder.orderNumber;

    // 3. Mark request as Accepted & record in salesHistory
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Accepted' } : r
      ),
      salesHistory: [
        {
          id: saleId,
          orderId: orderId,
          cropName: req.cropName,
          variety: req.variety,
          quantityKg: req.quantityKg,
          agreedPricePerKg: req.offerPricePerKg,
          grossAmount: grossVal,
          transportCost: transportTotal,
          platformFee: 0,
          netPayout: netTotal,
          buyerName: req.buyerName,
          buyerType: req.buyerType,
          saleDate: 'Today (Just now)',
          status: 'In Transit',
          paymentMethod: 'Direct Bank Settlement (Escrow)',
          transactionRef: `TXN-${orderId.replace('#', '')}`,
        },
        ...state.salesHistory,
      ],
    }));

    return { success: true, orderId };
  },

  counterOffer: (requestId: string, counterPrice: number, counterQty: number, message?: string) => {
    set((state) => ({
      requests: state.requests.map((r) => {
        if (r.id === requestId) {
          const newMsg: NegotiationMessage = {
            id: `msg_${Date.now()}`,
            sender: 'farmer',
            senderName: 'You',
            pricePerKg: counterPrice,
            quantityKg: counterQty,
            message: message || `Countered at ₹${counterPrice}/kg for ${counterQty} kg.`,
            timestamp: 'Just now',
          };
          return {
            ...r,
            offerPricePerKg: counterPrice,
            quantityKg: counterQty,
            status: 'Negotiating',
            history: [...r.history, newMsg],
          };
        }
        return r;
      }),
    }));
  },

  rejectRequest: (requestId: string, reason?: string) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Rejected', rejectionReason: reason || 'Not suitable' }
          : r
      ),
    }));
  },

  createListing: (listingData) => {
    const newListing: SellingListing = {
      ...listingData,
      id: `list_${Date.now()}`,
      createdAt: 'Today',
      interestedBuyersCount: 1,
    };

    set((state) => ({
      listings: [newListing, ...state.listings],
    }));

    return newListing;
  },

  getOpportunitiesForCrop: (cropName: string, availableKg: number, grade: string) => {
    const buyers = get().buyers;

    return buyers.map((buyer, index) => {
      // Benchmark adjustments based on crop
      let basePrice = 22;
      let marketRef = 22;
      let demand: 'High' | 'Medium' | 'Low' = 'High';

      if (cropName.toLowerCase().includes('tomato')) {
        basePrice = 20;
        marketRef = 18;
      } else if (cropName.toLowerCase().includes('potato')) {
        basePrice = 21;
        marketRef = 20;
      } else if (cropName.toLowerCase().includes('wheat')) {
        basePrice = 29;
        marketRef = 28.5;
      }

      // Slightly vary offers by buyer type
      const priceModifier = index === 0 ? 2.5 : index === 1 ? 1.8 : index === 2 ? 3.0 : 0.5;
      const offer = basePrice + priceModifier;
      const transportPerKg = Number((buyer.distanceKm * 0.035).toFixed(2));
      const estNet = Number((offer - transportPerKg).toFixed(2));

      // Match score calculation
      const matchScore = index === 0 ? 94 : index === 1 ? 89 : index === 2 ? 85 : 78;

      return {
        id: `opp_${buyer.id}_${cropName}`,
        buyer,
        cropName,
        requiredKg: Math.min(availableKg, 1500),
        requiredGrade: grade || 'Grade A',
        offerPricePerKg: offer,
        marketReferencePricePerKg: marketRef,
        demandStatus: demand,
        estimatedTransportPerKg: transportPerKg,
        estimatedNetReturnPerKg: estNet,
        matchScorePct: matchScore,
        isRecommended: index === 0,
        recommendationReason:
          index === 0
            ? "Your quantity and Grade A quality match this buyer's requirement, and the estimated transport cost is relatively low."
            : `Verified buyer with ${buyer.totalDeals}+ completed deals and prompt farmgate collection.`,
        matchChecklist: {
          cropMatches: true,
          quantityMatches: availableKg >= 200,
          qualityMatches: true,
          locationSuitable: buyer.distanceKm <= 75,
          availabilityMatches: true,
        },
      };
    });
  },

  getRequestById: (requestId: string) => {
    return get().requests.find((r) => r.id === requestId);
  },

  getSaleById: (saleId: string) => {
    return get().salesHistory.find((s) => s.id === saleId);
  },
}));
