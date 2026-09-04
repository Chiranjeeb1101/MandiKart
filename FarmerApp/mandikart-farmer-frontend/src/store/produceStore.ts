/**
 * MandiKart Farmer App — Produce Domain Store (Zustand)
 *
 * Backs "My Crop Intelligence Center" with strict data integrity:
 * - Real user crops & stock allocation (Total, Available, Reserved, Sold)
 * - Condition state: 'Good' | 'Needs Attention' | 'Deteriorating' | 'Condition not updated'
 * - Estimated freshness window (Shelf-life estimate)
 * - Reference market data with verified source (AGMARKNET/e-NAM) and timestamp
 * - 7D, 30D, 90D price trend history points
 * - Crop watch and action alerts
 */

import { create } from 'zustand';

export type CropCondition = 'Good' | 'Needs Attention' | 'Deteriorating' | 'Condition not updated';
export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C' | 'Unsorted';
export type StorageType = 'Farm' | 'Warehouse' | 'Cold Storage' | 'Other';
export type DemandStatus = 'High' | 'Medium' | 'Low' | 'Stable';

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface CropItem {
  id: string;
  cropName: string;
  variety?: string;
  category: string;
  totalKg: number;
  availableKg: number;
  reservedKg: number;
  soldKg: number;
  unit: string;
  grade: QualityGrade;
  harvestDate: string;
  availableFrom: string;
  location: string;
  storageType: StorageType;
  storageDetails?: string;
  condition: CropCondition;
  conditionUpdatedAt?: string;
  conditionNote?: string;
  imageUri: string;
  expectedPricePerKg?: number;

  // Shelf-life Intelligence (Always labelled Approx / Estimated)
  shelfLifeDaysEstMin: number;
  shelfLifeDaysEstMax: number;
  shelfLifeBasis: string;

  // Market Intelligence (Observed Reference Data)
  referencePricePerKg: number;
  priceMovementPct: number; // e.g. +8, -5, 0
  priceMovementTrend: 'up' | 'down' | 'stable';
  marketDemand: DemandStatus;
  marketName: string;
  marketDistanceKm: number;
  marketSource: string; // e.g. "AGMARKNET"
  marketLastUpdated: string; // e.g. "04 Sep, 10:30 AM"

  // Price History
  history7D: PriceHistoryPoint[];
  history30D: PriceHistoryPoint[];
  history90D: PriceHistoryPoint[];

  // Watch status
  watchTag: string; // e.g. "Demand badh rahi hai"
  watchUrgency: 'positive' | 'warning' | 'neutral';
  attentionMessage?: string;
  attentionActionLabel?: string;
  attentionActionRoute?: string;
}

interface ProduceStoreState {
  crops: CropItem[];

  // Actions
  addCrop: (crop: Omit<CropItem, 'id'>) => CropItem;
  updateCropCondition: (id: string, condition: CropCondition, note?: string) => void;
  updateCropQuantity: (id: string, availableKg: number, reservedKg?: number) => void;
  getCropById: (id: string) => CropItem | undefined;
}

const ONION_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5juCGxLQ_5fyI4TU5ZyfZdhObSJDnZM42ZAzHiJlSBs31EGGnUyK0QRdyoFAXloh0SkLFb_apbQR_O0o3CiqCV8ckf9U5kVPC_outsYrPisSJV7GpxGLs2L-xGzfoEsXeXb0RDHma0B3LZpqIpwp37q8QDENvGkvpIupjr3XK_RaWZAC1mYGgc0fh9NxnbqD6YkA-qI6_ktMQlwdFD5eo5P3iTDMZmUTjkFoBSsrDOCIoRU8BehqDTw';

const TOMATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ecH_gXE_S9dnNXqZtMNZsTsKwUugK5npqrXQo96EGz87CNfJWQR-HFQcD_gqEoawXV7pG5-hAyd6KZco66Pdavo3jYBsP6NadIKCnghQ8lYLYXnuyMeQuBB2LxBykis0pTs786s14moakUB0ZH0QgH7VlNElFN4Ns5uWVxgvecQv248hBqi_2ENXcSCSj6gx8CL7fz5xwRqaIpshL2s-Xue0Qb10lRmnHBlDimQ82nr7RG_vmqfBw';

const POTATO_PHOTO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC10xdTnKHpvZre-LhDKBTaZdjrNRAMZKasKH7sJK1nrX10RGhhP2dGCyuePJimnKwCfuueO0HuC0216Hy6PAuxsQXjsHtSvKxV7SDDJosrU95YRzT4oVRjJqioCNfX15LiH_iPMrU7YeT2od9_cv81dzfyjd6LRPtPRGTt1AbXyWGTo6qD1K7KloqXwfi7HTDD6X5PP72m_RLR77_lBfwoQWyjBj1HvTxGZsl55rQEEpNHyiMzAeHoHQ';

const WHEAT_PHOTO_URI =
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80';

const INITIAL_CROPS: CropItem[] = [
  {
    id: 'crop_1',
    cropName: 'Red Onion',
    variety: 'Nashik Red Garwa',
    category: 'Vegetables',
    totalKg: 1200,
    availableKg: 1000,
    reservedKg: 200,
    soldKg: 0,
    unit: 'KG',
    grade: 'Grade A',
    harvestDate: '12 Aug 2026',
    availableFrom: 'Immediate',
    location: 'Dindori Farm Shed #2',
    storageType: 'Warehouse',
    storageDetails: 'Ventilated wooden slatted chawl, dry ambient condition',
    condition: 'Good',
    conditionUpdatedAt: '02 Sep 2026',
    imageUri: ONION_PHOTO_URI,
    expectedPricePerKg: 24,

    shelfLifeDaysEstMin: 8,
    shelfLifeDaysEstMax: 12,
    shelfLifeBasis: 'Nashik garwa variety with cured neck stored in dry aerated chawl',

    referencePricePerKg: 22.0,
    priceMovementPct: 8,
    priceMovementTrend: 'up',
    marketDemand: 'High',
    marketName: 'Nashik APMC Mandi',
    marketDistanceKm: 18,
    marketSource: 'AGMARKNET Official Feed',
    marketLastUpdated: '04 Sep, 10:30 AM',

    history7D: [
      { date: '29 Aug', price: 20.0 },
      { date: '31 Aug', price: 20.5 },
      { date: '02 Sep', price: 21.2 },
      { date: '04 Sep', price: 22.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 18.5 },
      { date: '15 Aug', price: 19.5 },
      { date: '25 Aug', price: 20.8 },
      { date: '04 Sep', price: 22.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 16.0 },
      { date: '05 Jul', price: 17.5 },
      { date: '05 Aug', price: 18.5 },
      { date: '04 Sep', price: 22.0 },
    ],

    watchTag: 'Demand badh rahi hai',
    watchUrgency: 'positive',
    attentionMessage: 'Onion ki mandi demand pichhle 3 din mein +8% badhi hai. 18 verified buyers active hain.',
    attentionActionLabel: 'View Best Buyers',
    attentionActionRoute: '/sell/best-options',
  },
  {
    id: 'crop_2',
    cropName: 'Hybrid Tomato',
    variety: 'Semi-Ripe Fresh Harvest',
    category: 'Vegetables',
    totalKg: 350,
    availableKg: 350,
    reservedKg: 0,
    soldKg: 0,
    unit: 'KG',
    grade: 'Grade B',
    harvestDate: '31 Aug 2026',
    availableFrom: 'Immediate',
    location: 'Farm Shaded Polyhouse',
    storageType: 'Farm',
    storageDetails: 'Ambient plastic crates in farm shade',
    condition: 'Needs Attention',
    conditionUpdatedAt: '03 Sep 2026',
    conditionNote: 'Ripening accelerating due to high humidity. Shelf life decreasing.',
    imageUri: TOMATO_PHOTO_URI,
    expectedPricePerKg: 20,

    shelfLifeDaysEstMin: 3,
    shelfLifeDaysEstMax: 5,
    shelfLifeBasis: 'High perishability semi-ripe tomato stored at ambient farm temperature',

    referencePricePerKg: 18.0,
    priceMovementPct: -5,
    priceMovementTrend: 'down',
    marketDemand: 'Medium',
    marketName: 'Pimpalgaon Mandi',
    marketDistanceKm: 14,
    marketSource: 'AGMARKNET Official Feed',
    marketLastUpdated: '04 Sep, 10:30 AM',

    history7D: [
      { date: '29 Aug', price: 19.5 },
      { date: '31 Aug', price: 19.0 },
      { date: '02 Sep', price: 18.5 },
      { date: '04 Sep', price: 18.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 21.0 },
      { date: '15 Aug', price: 20.0 },
      { date: '25 Aug', price: 19.2 },
      { date: '04 Sep', price: 18.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 24.0 },
      { date: '05 Jul', price: 22.5 },
      { date: '05 Aug', price: 21.0 },
      { date: '04 Sep', price: 18.0 },
    ],

    watchTag: 'Freshness window kam ho raha hai',
    watchUrgency: 'warning',
    attentionMessage: 'Tomato ka estimated freshness window kam ho raha hai (3–5 din bache hain). Sell consider karein.',
    attentionActionLabel: 'Sell Soon',
    attentionActionRoute: '/sell/best-options',
  },
  {
    id: 'crop_3',
    cropName: 'Jyoti Potato',
    variety: 'Clean Washed Table Quality',
    category: 'Vegetables',
    totalKg: 1500,
    availableKg: 1200,
    reservedKg: 300,
    soldKg: 0,
    unit: 'KG',
    grade: 'Grade A',
    harvestDate: '20 Jul 2026',
    availableFrom: 'Immediate',
    location: 'Cold Storage Room B-4',
    storageType: 'Cold Storage',
    storageDetails: 'Cold storage unit 7°C, controlled humidity, sprout inhibitor treated',
    condition: 'Good',
    conditionUpdatedAt: '01 Sep 2026',
    imageUri: POTATO_PHOTO_URI,
    expectedPricePerKg: 22,

    shelfLifeDaysEstMin: 25,
    shelfLifeDaysEstMax: 35,
    shelfLifeBasis: 'Cold storage at controlled 7°C temperature with zero sprouting observed',

    referencePricePerKg: 20.0,
    priceMovementPct: 0,
    priceMovementTrend: 'stable',
    marketDemand: 'High',
    marketName: 'Lasalgaon Mandi Hub',
    marketDistanceKm: 26,
    marketSource: 'AGMARKNET Official Feed',
    marketLastUpdated: '04 Sep, 10:30 AM',

    history7D: [
      { date: '29 Aug', price: 20.0 },
      { date: '31 Aug', price: 20.0 },
      { date: '02 Sep', price: 20.0 },
      { date: '04 Sep', price: 20.0 },
    ],
    history30D: [
      { date: '05 Aug', price: 19.5 },
      { date: '15 Aug', price: 19.8 },
      { date: '25 Aug', price: 20.0 },
      { date: '04 Sep', price: 20.0 },
    ],
    history90D: [
      { date: '05 Jun', price: 18.0 },
      { date: '05 Jul', price: 19.0 },
      { date: '05 Aug', price: 19.5 },
      { date: '04 Sep', price: 20.0 },
    ],

    watchTag: 'Price stable hai, stock surakshit',
    watchUrgency: 'neutral',
  },
  {
    id: 'crop_4',
    cropName: 'Lokwan Wheat',
    variety: 'Clean Dried Grain',
    category: 'Grains',
    totalKg: 300,
    availableKg: 300,
    reservedKg: 0,
    soldKg: 0,
    unit: 'KG',
    grade: 'Grade A',
    harvestDate: '10 Apr 2026',
    availableFrom: 'Immediate',
    location: 'Farm Granary Silo #1',
    storageType: 'Warehouse',
    storageDetails: 'Moisture content < 12%, sealed airtight bags with neem leaves',
    condition: 'Good',
    conditionUpdatedAt: '28 Aug 2026',
    imageUri: WHEAT_PHOTO_URI,
    expectedPricePerKg: 29,

    shelfLifeDaysEstMin: 90,
    shelfLifeDaysEstMax: 120,
    shelfLifeBasis: 'Dry cereal grain stored below 12% moisture in sealed bags',

    referencePricePerKg: 28.5,
    priceMovementPct: 1,
    priceMovementTrend: 'stable',
    marketDemand: 'High',
    marketName: 'Nashik Central APMC',
    marketDistanceKm: 22,
    marketSource: 'e-NAM National Portal',
    marketLastUpdated: '04 Sep, 10:30 AM',

    history7D: [
      { date: '29 Aug', price: 28.0 },
      { date: '31 Aug', price: 28.2 },
      { date: '02 Sep', price: 28.5 },
      { date: '04 Sep', price: 28.5 },
    ],
    history30D: [
      { date: '05 Aug', price: 27.5 },
      { date: '15 Aug', price: 28.0 },
      { date: '25 Aug', price: 28.2 },
      { date: '04 Sep', price: 28.5 },
    ],
    history90D: [
      { date: '05 Jun', price: 26.5 },
      { date: '05 Jul', price: 27.0 },
      { date: '05 Aug', price: 27.5 },
      { date: '04 Sep', price: 28.5 },
    ],

    watchTag: 'Demand stable hai',
    watchUrgency: 'neutral',
  },
];

export const useProduceStore = create<ProduceStoreState>((set, get) => ({
  crops: INITIAL_CROPS,

  addCrop: (newCropData) => {
    const id = `crop_${Date.now()}`;
    const newCrop: CropItem = {
      ...newCropData,
      id,
    };

    set((state) => ({
      crops: [newCrop, ...state.crops],
    }));

    return newCrop;
  },

  updateCropCondition: (id, condition, note) => {
    set((state) => ({
      crops: state.crops.map((c) =>
        c.id === id
          ? {
              ...c,
              condition,
              conditionNote: note || c.conditionNote,
              conditionUpdatedAt: 'Today',
            }
          : c
      ),
    }));
  },

  updateCropQuantity: (id, availableKg, reservedKg) => {
    set((state) => ({
      crops: state.crops.map((c) =>
        c.id === id
          ? {
              ...c,
              availableKg,
              reservedKg: reservedKg !== undefined ? reservedKg : c.reservedKg,
              totalKg: availableKg + (reservedKg !== undefined ? reservedKg : c.reservedKg) + c.soldKg,
            }
          : c
      ),
    }));
  },

  getCropById: (id) => {
    return get().crops.find((c) => c.id === id);
  },
}));
