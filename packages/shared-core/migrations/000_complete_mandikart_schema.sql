-- ==============================================================================
-- MANDIKART — COMPLETE UNIFIED DATABASE SCHEMA & STORAGE MIGRATION
-- Run this entire script once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/keietktvnoyzexcmydyf/sql/new
-- ==============================================================================

-- 0. Enable Cryptographic Functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS (Custom Types)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('FARMER', 'BUYER', 'LOGISTICS_DRIVER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'PLACED', 'CONFIRMED', 'PICKUP_SCHEDULED', 'PICKUP_IN_PROGRESS', 
    'COLLECTED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'FAILED', 'DISPUTED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE produce_grade AS ENUM ('A', 'B', 'C');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE buyer_target AS ENUM ('RETAIL', 'BULK', 'BOTH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE buyer_type AS ENUM ('RETAIL', 'BULK');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED_HOLD');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER_REFUND', 'RESOLVED_FARMER_PAYOUT', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE otp_channel AS ENUM ('SMS', 'EMAIL', 'WHATSAPP');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 2. CORE USERS & ENTITIES (FPOs, Farmers, Buyers)
-- ------------------------------------------------------------------------------

-- FPOs (Farmer Producer Organizations)
CREATE TABLE IF NOT EXISTS public.fpos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  registration_number VARCHAR(50) UNIQUE,
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(15),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farmers Profile Table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  preferred_language VARCHAR(5) DEFAULT 'en',
  avatar_url TEXT,
  aadhaar_number_encrypted TEXT,
  aadhaar_last4 VARCHAR(4),
  is_verified BOOLEAN DEFAULT FALSE,
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  taluka VARCHAR(50),
  village VARCHAR(50),
  farm_size_acres NUMERIC(6, 2) DEFAULT 0.0,
  ownership_type VARCHAR(30) DEFAULT 'Owner',
  primary_crops TEXT[] DEFAULT '{}',
  upi_id VARCHAR(50),
  bank_account_number_encrypted TEXT,
  bank_account_last4 VARCHAR(4),
  bank_ifsc VARCHAR(15),
  bank_account_name VARCHAR(100),
  fpo_id UUID REFERENCES public.fpos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  full_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  buyer_type buyer_type NOT NULL DEFAULT 'RETAIL',
  company_name VARCHAR(150),
  gstin VARCHAR(20),
  addresses JSONB DEFAULT '[]'::jsonb,
  is_verified BOOLEAN DEFAULT FALSE,
  preferred_language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farm Plots & Land Records (7/12 land extract, plot geometry, photos)
CREATE TABLE IF NOT EXISTS public.farm_plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  survey_number VARCHAR(50) NOT NULL,
  land_area_acres NUMERIC(8, 2) NOT NULL,
  ownership_type VARCHAR(30) DEFAULT 'Owner',
  soil_type VARCHAR(50),
  irrigation_source VARCHAR(50),
  plot_image_url TEXT,
  doc_7_12_url TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS & INVENTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  crop_variety VARCHAR(100),
  grade produce_grade DEFAULT 'A',
  category VARCHAR(50) NOT NULL,
  total_quantity NUMERIC(10, 2) NOT NULL,
  available_quantity NUMERIC(10, 2) NOT NULL,
  reserved_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  quantity_unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  base_price_per_unit NUMERIC(10, 2) NOT NULL,
  min_order_quantity NUMERIC(10, 2) DEFAULT 1.0,
  target_buyer buyer_target DEFAULT 'BOTH',
  images TEXT[] DEFAULT '{}',
  pickup_address TEXT,
  pickup_latitude NUMERIC(9, 6),
  pickup_longitude NUMERIC(9, 6),
  is_active BOOLEAN DEFAULT TRUE,
  harvest_date DATE,
  shelf_life_days INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_quantity_nonneg CHECK (available_quantity >= 0 AND reserved_quantity >= 0),
  CONSTRAINT chk_reserved_within_total CHECK (reserved_quantity <= total_quantity)
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS & FULFILLMENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id),
  buyer_id UUID NOT NULL,
  status order_status NOT NULL DEFAULT 'PLACED',
  total_amount NUMERIC(12, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) DEFAULT 0.0,
  farmer_payout_amount NUMERIC(12, 2) NOT NULL,
  pickup_otp VARCHAR(6),
  delivery_otp VARCHAR(6),
  pickup_scheduled_at TIMESTAMPTZ,
  driver_id UUID,
  driver_name VARCHAR(100),
  driver_phone VARCHAR(15),
  vehicle_number VARCHAR(20),
  cancellation_reason TEXT,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  crop_name VARCHAR(100) NOT NULL,
  grade produce_grade NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL
);

-- Order State Transitions Audit History
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by UUID,
  role user_role NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PAYMENTS & ESCROW LEDGER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(100) UNIQUE,
  stripe_charge_id VARCHAR(100),
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'PENDING',
  escrow_status escrow_status NOT NULL DEFAULT 'HELD',
  payment_method VARCHAR(30) DEFAULT 'stripe',
  metadata JSONB DEFAULT '{}'::jsonb,
  escrow_released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id),
  reason TEXT NOT NULL,
  evidence_photos TEXT[] DEFAULT '{}',
  disputed_amount NUMERIC(12, 2) NOT NULL,
  status dispute_status NOT NULL DEFAULT 'OPEN',
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. APMC MARKET RATES & NEGOTIATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  market_mandi_name VARCHAR(100) NOT NULL,
  commodity VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  min_price NUMERIC(10, 2) NOT NULL,
  max_price NUMERIC(10, 2) NOT NULL,
  modal_price NUMERIC(10, 2) NOT NULL,
  price_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id),
  buyer_id UUID NOT NULL,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id),
  original_price NUMERIC(10, 2) NOT NULL,
  offered_price NUMERIC(10, 2) NOT NULL,
  counter_price NUMERIC(10, 2),
  quantity NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. AUTH, OTPS & PLATFORM AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(100) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  channel otp_channel NOT NULL DEFAULT 'SMS',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id VARCHAR(100) NOT NULL,
  role user_role NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_crop_active ON public.products(crop_name, is_active);
CREATE INDEX IF NOT EXISTS idx_products_farmer_active ON public.products(farmer_id, is_active);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_status ON public.orders(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON public.orders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_district_commodity ON public.market_prices(district, commodity, price_date);
CREATE INDEX IF NOT EXISTS idx_buyers_phone ON public.buyers(phone);
CREATE INDEX IF NOT EXISTS idx_farm_plots_farmer ON public.farm_plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_pi ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_otps_identifier ON public.otps(identifier, expires_at);

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKETS (Avatars, Products, Land Records, POD)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('land_records', 'land_records', false),
  ('pod', 'pod', false)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products and market rates
DO $$ BEGIN
  CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read market rates" ON public.market_prices FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;
