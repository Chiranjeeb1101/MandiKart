import type { FarmerUser } from '../types/admin';

export const mockFarmers: FarmerUser[] = [
  {
    id: 'frm-101',
    farmerCode: '#FMR-8921',
    fullName: 'Ramesh Patel',
    phone: '+91 98230 41122',
    mandiName: 'Nashik Main Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    landAreaAcres: 1,
    verificationStatus: 'VERIFIED',
    rating: 5.0,
    totalSalesAmount: 1,
    joinedDate: '12 Jan 2024',
    kycRecords: [
      { documentType: 'AADHAAR', documentNumber: 'XXXX-XXXX-9012', verifiedStatus: 'VERIFIED', uploadedAt: '12 Jan 2024', verifiedAt: '13 Jan 2024' },
    ],
    activeListings: [
      { id: 'lst-1', cropName: 'Tomatoes (Hybrid)', category: 'Vegetables', availableKg: 1, pricePerKg: 1, qualityGrade: 'GRADE_A', harvestDate: '02 Sep 2026', status: 'ACTIVE' },
    ],
  },
];
