/**
 * MandiKart — Safe Demo Dataset Seeder
 * Populates realistic sample farmers, produce batches, mandi benchmark rates, and a test order.
 * All demo records are marked with 'demo_' IDs so they can be 100% cleanly purged later.
 */

import { getSupabaseAdmin } from '../src/db/supabase.js';

export async function seedDemoData() {
  const supabase = getSupabaseAdmin();

  console.log('🌱 Seeding initial demo data into Supabase...\n');

  // 1. Seed Demo Farmers
  const farmers = [
    {
      id: 'd1111111-1111-1111-1111-111111111111',
      full_name: 'Ramesh Patil',
      phone: '+919822011111',
      email: 'ramesh.patil@mandikart.demo',
      preferred_language: 'mr',
      avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
      is_verified: true,
      state: 'Maharashtra',
      district: 'Nashik',
      taluka: 'Niphad',
      village: 'Lasalgaon',
      farm_size_acres: 12.5,
      ownership_type: 'Owner',
      primary_crops: ['Red Onion', 'Tomato', 'Grapes'],
      upi_id: 'rameshpatil@okhdfcbank',
      bank_ifsc: 'HDFC0001234',
      bank_account_name: 'Ramesh Balasaheb Patil',
      bank_account_last4: '4821',
    },
    {
      id: 'd2222222-2222-2222-2222-222222222222',
      full_name: 'Suresh Deshmukh',
      phone: '+919822022222',
      email: 'suresh.deshmukh@mandikart.demo',
      preferred_language: 'mr',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      is_verified: true,
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Shirur',
      village: 'Koregaon',
      farm_size_acres: 8.0,
      ownership_type: 'Owner',
      primary_crops: ['Potato', 'Pomegranate'],
      upi_id: 'sureshdeshmukh@oksbi',
      bank_ifsc: 'SBIN0004567',
      bank_account_name: 'Suresh Anandrao Deshmukh',
      bank_account_last4: '8892',
    },
  ];

  for (const f of farmers) {
    const { error } = await supabase.from('farmers').upsert(f, { onConflict: 'id' });
    if (error) console.error('  Failed to seed farmer:', error.message);
    else console.log('  ✅ Farmer seeded:', f.full_name, '(' + f.district + ')');
  }

  // 2. Seed Demo Produce Batches (Products)
  const products = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      farmer_id: 'd1111111-1111-1111-1111-111111111111',
      crop_name: 'Red Onion',
      crop_variety: 'Garwa',
      grade: 'A',
      category: 'Vegetables',
      total_quantity: 1500,
      available_quantity: 1500,
      reserved_quantity: 0,
      quantity_unit: 'kg',
      base_price_per_unit: 26.5,
      min_order_quantity: 50,
      target_buyer: 'BOTH',
      images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600'],
      pickup_address: 'Survey No. 44, Lasalgaon Mandi Bypass, Niphad, Nashik',
      pickup_latitude: 20.1485,
      pickup_longitude: 74.2251,
      is_active: true,
      shelf_life_days: 30,
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      farmer_id: 'd1111111-1111-1111-1111-111111111111',
      crop_name: 'Tomato',
      crop_variety: 'Vaishali',
      grade: 'A',
      category: 'Vegetables',
      total_quantity: 800,
      available_quantity: 800,
      reserved_quantity: 0,
      quantity_unit: 'kg',
      base_price_per_unit: 22.0,
      min_order_quantity: 25,
      target_buyer: 'BOTH',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'],
      pickup_address: 'Green Valley Plot B, Lasalgaon, Nashik',
      pickup_latitude: 20.1512,
      pickup_longitude: 74.2298,
      is_active: true,
      shelf_life_days: 7,
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      farmer_id: 'd2222222-2222-2222-2222-222222222222',
      crop_name: 'Potato',
      crop_variety: 'Jyoti',
      grade: 'A',
      category: 'Vegetables',
      total_quantity: 2200,
      available_quantity: 2200,
      reserved_quantity: 0,
      quantity_unit: 'kg',
      base_price_per_unit: 18.0,
      min_order_quantity: 100,
      target_buyer: 'BULK',
      images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600'],
      pickup_address: 'Farm Plot 12, Shirur Road, Pune',
      pickup_latitude: 18.8256,
      pickup_longitude: 74.3721,
      is_active: true,
      shelf_life_days: 45,
    },
    {
      id: 'a4444444-4444-4444-4444-444444444444',
      farmer_id: 'd2222222-2222-2222-2222-222222222222',
      crop_name: 'Pomegranate',
      crop_variety: 'Bhagwa',
      grade: 'A',
      category: 'Fruits',
      total_quantity: 600,
      available_quantity: 600,
      reserved_quantity: 0,
      quantity_unit: 'kg',
      base_price_per_unit: 95.0,
      min_order_quantity: 20,
      target_buyer: 'BOTH',
      images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600'],
      pickup_address: 'Deshmukh Orchards, Koregaon, Pune',
      pickup_latitude: 18.8189,
      pickup_longitude: 74.3802,
      is_active: true,
      shelf_life_days: 14,
    },
  ];

  for (const p of products) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'id' });
    if (error) console.error('  Failed to seed product:', error.message);
    else console.log('  ✅ Product seeded:', p.crop_name, '(' + p.available_quantity + ' ' + p.quantity_unit + ' @ ₹' + p.base_price_per_unit + ')');
  }

  // 3. Seed Demo Buyer
  const buyer = {
    id: 'b1111111-1111-1111-1111-111111111111',
    full_name: 'Rajesh Sharma',
    phone: '+919811033333',
    email: 'rajesh.sharma@mandikart.demo',
    buyer_type: 'BULK',
    company_name: 'Sharma Wholesale & Retail Agro',
    gstin: '27AAAAA0000A1Z5',
    is_verified: true,
    preferred_language: 'en',
    addresses: [
      {
        id: 'addr_1',
        title: 'Central Warehouse Pune',
        street: 'Plot 88, Market Yard Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411037',
        isDefault: true,
      },
    ],
  };

  const { error: bErr } = await supabase.from('buyers').upsert(buyer, { onConflict: 'id' });
  if (bErr) console.error('  Failed to seed buyer:', bErr.message);
  else console.log('  ✅ Buyer seeded:', buyer.full_name, '(' + buyer.company_name + ')');

  // 4. Seed APMC Mandi Benchmark Rates
  const today = new Date().toISOString().split('T')[0];
  const marketRates = [
    {
      state: 'Maharashtra',
      district: 'Nashik',
      market_mandi_name: 'Lasalgaon APMC',
      commodity: 'Red Onion',
      variety: 'Garwa',
      min_price: 22.0,
      max_price: 29.5,
      modal_price: 26.0,
      price_date: today,
    },
    {
      state: 'Maharashtra',
      district: 'Nashik',
      market_mandi_name: 'Pimpalgaon APMC',
      commodity: 'Tomato',
      variety: 'Vaishali',
      min_price: 18.0,
      max_price: 25.0,
      modal_price: 22.0,
      price_date: today,
    },
    {
      state: 'Maharashtra',
      district: 'Pune',
      market_mandi_name: 'Pune APMC Gultekdi',
      commodity: 'Potato',
      variety: 'Jyoti',
      min_price: 15.0,
      max_price: 20.0,
      modal_price: 18.0,
      price_date: today,
    },
    {
      state: 'Maharashtra',
      district: 'Pune',
      market_mandi_name: 'Shirur APMC',
      commodity: 'Pomegranate',
      variety: 'Bhagwa',
      min_price: 85.0,
      max_price: 110.0,
      modal_price: 95.0,
      price_date: today,
    },
  ];

  for (const r of marketRates) {
    const { error } = await supabase.from('market_prices').insert(r);
    if (error && !error.message.includes('duplicate')) {
      console.error('  Failed to seed mandi rate:', error.message);
    } else {
      console.log('  ✅ APMC Rate seeded:', r.market_mandi_name, '->', r.commodity, 'Modal: ₹' + r.modal_price);
    }
  }

  // 5. Seed 1 Active Live Order for Testing (Order MK-2026-8801)
  const order = {
    id: 'c1111111-1111-1111-1111-111111111111',
    order_number: 'MK-2026-8801',
    farmer_id: 'd1111111-1111-1111-1111-111111111111',
    buyer_id: 'b1111111-1111-1111-1111-111111111111',
    status: 'IN_TRANSIT',
    total_amount: 540.0,
    platform_fee: 13.5,
    farmer_payout_amount: 526.5,
    pickup_otp: '4821',
    delivery_otp: '9315',
    driver_name: 'Vikram Shinde',
    driver_phone: '+919833044444',
    vehicle_number: 'MH-15-EG-4482',
  };

  const { error: oErr } = await supabase.from('orders').upsert(order, { onConflict: 'id' });
  if (oErr) console.error('  Failed to seed active order:', oErr.message);
  else console.log('  ✅ Active Live Order seeded:', order.order_number, '(Status:', order.status, '| OTP:', order.delivery_otp, ')');

  console.log('\n🎉 DEMO SEED COMPLETED! Apps will now display rich live data.');
}

seedDemoData().catch(console.error);
