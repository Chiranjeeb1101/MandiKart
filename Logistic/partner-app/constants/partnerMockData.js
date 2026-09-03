// KisanLink / MandiKart Delivery Partner Mock Data
// Extracted from Stitch project 18346905377238271210

export const PARTNER_PROFILE = {
  id: 'KL-DP-9824',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@mandikart.in',
  role: 'Senior Delivery Partner',
  badge: 'Gold Tier Partner',
  rating: 4.92,
  totalDeliveries: 1248,
  joinDate: 'March 2024',
  city: 'Bhubaneswar, Odisha',
  vehicle: {
    type: 'Electric Cargo Two-Wheeler',
    model: 'Hero Electric Nyx HX',
    plateNumber: 'OD 02 BX 4910',
    maxLoadKg: 150,
  },
  kyc: {
    aadhaarStatus: 'VERIFIED',
    drivingLicenseStatus: 'VERIFIED',
    rcStatus: 'VERIFIED',
    panStatus: 'VERIFIED',
  },
  bank: {
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '•••• •••• •••• 4012',
    ifsc: 'HDFC0001289',
    holderName: 'RAHUL SHARMA',
  },
  emergencyContact: {
    name: 'Sunita Sharma (Spouse)',
    phone: '+91 98765 00000',
    relation: 'Wife',
  },
};

export const TODAY_STATS = {
  earnings: 720,
  earningsGrowthPercent: 12,
  deliveriesCompleted: 18,
  distanceKm: 64.2,
  onlineHours: '7h 20m',
  acceptanceRate: '98%',
  onTimeRate: '99.2%',
};

export const ACTIVE_DELIVERY = {
  id: 'MK10284',
  title: 'Fresh Tomatoes',
  quantity: '120 kg (6 Crates)',
  payout: 95,
  status: 'IN_TRANSIT', // 'PICKUP' | 'IN_TRANSIT' | 'DELIVERED'
  currentStepIndex: 1, // 0: Pickup, 1: In Transit, 2: Delivered
  requiresColdStorage: false,
  estimatedTimeMins: 18,
  distanceKm: 8.4,
  pickup: {
    name: 'Ramesh Farm & Greenhouse',
    contactPerson: 'Ramesh Patel (Farmer)',
    phone: '+91 94370 12345',
    address: 'Plot 42, Near Canal Road, Patia Agri Belt, Bhubaneswar',
    pin: '751024',
    time: '11:15 AM',
    isDone: true,
  },
  drop: {
    name: 'Bhubaneswar Central Mandi Hub',
    contactPerson: 'Manager Bijay Das',
    phone: '+91 94371 98765',
    address: 'Gate 3, Wholesale Produce Yard, Aiginia Mandi, Bhubaneswar',
    pin: '751019',
    time: '12:00 PM',
    isDone: false,
  },
  manifest: [
    { item: 'Hybrid Hybrid Desi Tomato', crates: 4, weightKg: 80, grade: 'Grade A' },
    { item: 'Roma Plum Tomato', crates: 2, weightKg: 40, grade: 'Grade A+' },
  ],
  otpCode: '4892', // OTP given by destination hub
};

export const AVAILABLE_DELIVERIES = [
  {
    id: 'MK10285',
    title: 'Fresh Cauliflower & Cabbage',
    quantity: '180 kg (8 Crates)',
    payout: 145,
    distanceKm: 9.2,
    pickupName: 'Biranchi Sahoo Farms, Balianta',
    dropName: 'Rasulgarh Mandi Warehouse',
    deadline: 'In 45 mins',
    tag: '⚡ High Surge',
  },
  {
    id: 'MK10286',
    title: 'Green Chillies & Mint Bundles',
    quantity: '45 kg (3 Crates)',
    payout: 85,
    distanceKm: 4.1,
    pickupName: 'Das Green Valley Nursery',
    dropName: 'Unit-4 Daily Market Hub',
    deadline: 'Immediate Pickup',
    tag: '🥬 Perishable',
  },
  {
    id: 'MK10287',
    title: 'Organic Purple Brinjal',
    quantity: '90 kg (4 Crates)',
    payout: 110,
    distanceKm: 6.8,
    pickupName: 'Mahapatra Agro Fields',
    dropName: 'Saheed Nagar Direct Store',
    deadline: 'In 1h 15m',
    tag: '🌱 100% Organic',
  },
];

export const COMPLETED_DELIVERIES = [
  {
    id: 'MK10283',
    title: 'Farm Strawberries',
    quantity: '30 kg',
    payout: 90,
    deliveredAt: '10:42 AM',
    customer: 'Gourmet Greens Cafe',
    rating: 5,
  },
  {
    id: 'MK10282',
    title: 'Spinach & Coriander',
    quantity: '60 kg',
    payout: 80,
    deliveredAt: '09:55 AM',
    customer: 'Bapuji Nagar Mandi',
    rating: 5,
  },
  {
    id: 'MK10281',
    title: 'Baby Potatoes',
    quantity: '150 kg',
    payout: 125,
    deliveredAt: '08:30 AM',
    customer: 'Unit-1 Vegetable Association',
    rating: 5,
  },
];

export const WEEKLY_EARNINGS = {
  totalWeek: 4850,
  days: [
    { day: 'Mon', amount: 680, trips: 14 },
    { day: 'Tue', amount: 740, trips: 17 },
    { day: 'Wed', amount: 810, trips: 19 },
    { day: 'Thu', amount: 650, trips: 13 },
    { day: 'Fri', amount: 720, trips: 18 },
    { day: 'Sat', amount: 890, trips: 22 },
    { day: 'Sun', amount: 360, trips: 8 },
  ],
  breakdown: {
    basePay: 3420,
    distancePay: 760,
    surgeBonus: 450,
    tips: 220,
  },
};

export const PAYOUT_HISTORY = [
  {
    id: 'TXN-882109',
    date: '31 Aug 2026',
    amount: '₹4,850.00',
    status: 'CREDITED',
    account: 'HDFC Bank •• 4012',
    utr: 'HDFC00928174628',
    tdsDeducted: '₹48.50',
  },
  {
    id: 'TXN-881944',
    date: '24 Aug 2026',
    amount: '₹5,120.00',
    status: 'CREDITED',
    account: 'HDFC Bank •• 4012',
    utr: 'HDFC00881920194',
    tdsDeducted: '₹51.20',
  },
  {
    id: 'TXN-881023',
    date: '17 Aug 2026',
    amount: '₹4,310.00',
    status: 'CREDITED',
    account: 'HDFC Bank •• 4012',
    utr: 'HDFC00810239102',
    tdsDeducted: '₹43.10',
  },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Amit Mohanty', deliveries: 34, earnings: 1820, badge: '🥇 Gold', city: 'Bhubaneswar' },
  { rank: 2, name: 'Suresh Behera', deliveries: 29, earnings: 1540, badge: '🥈 Silver', city: 'Cuttack' },
  { rank: 3, name: 'Rajesh Swain', deliveries: 24, earnings: 1290, badge: '🥉 Bronze', city: 'Puri' },
  { rank: 4, name: 'Rahul Sharma (You)', deliveries: 18, earnings: 720, badge: '⭐ Rising Star', isCurrent: true, city: 'Bhubaneswar' },
  { rank: 5, name: 'Manoj Jena', deliveries: 16, earnings: 650, badge: '🌟 Top 5', city: 'Khurda' },
  { rank: 6, name: 'Pradeep Nayak', deliveries: 15, earnings: 610, badge: 'Driver', city: 'Bhubaneswar' },
];

export const NOTIFICATIONS = [
  {
    id: 'N1',
    title: '🌧️ Monsoon Safety Alert',
    time: '15 mins ago',
    message: 'Heavy rain forecasted near Khandagiri-Patia route. Drive with caution and protect crates with waterproof tarpaulin.',
    type: 'WARNING',
    unread: true,
  },
  {
    id: 'N2',
    title: '⚡ Evening Surge Bonus Active!',
    time: '1 hour ago',
    message: 'Earn +₹25 extra per farm pickup between 4:00 PM and 8:30 PM today.',
    type: 'PROMO',
    unread: true,
  },
  {
    id: 'N3',
    title: '✅ Weekly Settlement Sent',
    time: 'Yesterday',
    message: 'Your payout of ₹4,850 has been successfully processed to HDFC Bank A/C ending 4012.',
    type: 'SUCCESS',
    unread: false,
  },
  {
    id: 'N4',
    title: '🎯 Daily Target Reached!',
    time: '2 days ago',
    message: 'Congratulations! You completed 15 deliveries on Sunday and unlocked the ₹150 Weekend Bonus.',
    type: 'SUCCESS',
    unread: false,
  },
];
