-- ==============================================================================
-- MandiKart Canonical Schema Migration
-- 002_buyers_payments_storage_disputes.sql
-- Comprehensive additions: Buyers, Stripe Payments, Escrow, Disputes,
-- Land Records / Farm Plots, OTPs, and Storage Buckets
-- ==============================================================================

-- 1. Additional Canonical Enums
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

-- 2. Buyers Table
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

-- 3. Farm Plots & Land Records (7/12 land extract, plot geometry, photos)
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

-- 4. Stripe Payments & Escrow Ledger
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

-- 5. Quality Disputes Table
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

-- 6. OTP Verification Table (SMS, Email, Phone Authenticator)
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(100) NOT NULL, -- phone or email
  code_hash VARCHAR(255) NOT NULL,
  channel otp_channel NOT NULL DEFAULT 'SMS',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_buyers_phone ON public.buyers(phone);
CREATE INDEX IF NOT EXISTS idx_farm_plots_farmer ON public.farm_plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_pi ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_otps_identifier ON public.otps(identifier, expires_at);

-- 7. Supabase Storage Buckets Initializer (Execute in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('land_records', 'land_records', false),
  ('pod', 'pod', false)
ON CONFLICT (id) DO NOTHING;
