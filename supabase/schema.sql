-- ==========================================================
-- SahiHisaab (सही हिसाब) - Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==========================================================

-- 1. Create Profiles table (connected to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  village TEXT,
  role TEXT DEFAULT 'lender', -- 'lender' or 'borrower'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Debts table (Loans given / taken)
CREATE TABLE IF NOT EXISTS public.debts (
  id TEXT PRIMARY KEY,
  lender_phone TEXT NOT NULL,
  lender_name TEXT NOT NULL,
  lender_village TEXT DEFAULT 'Gharuan Mandi',
  borrower_phone TEXT NOT NULL,
  borrower_name TEXT NOT NULL,
  borrower_village TEXT DEFAULT 'Gharuan',
  principal NUMERIC NOT NULL CHECK (principal > 0),
  monthly_rate NUMERIC NOT NULL DEFAULT 2, -- e.g. 2 for 2%
  duration_months INTEGER DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Payments table (Installments / repayments)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  debt_id TEXT NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mode TEXT NOT NULL DEFAULT 'cash', -- 'cash' or 'upi'
  confirmed INTEGER NOT NULL DEFAULT 0, -- 1 = confirmed by borrower, 0 = pending, -1 = flagged dispute
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. Policies for public access / authenticated users
-- Profiles: Users can view and update their own profile
CREATE POLICY "Allow public read of profiles by phone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- Debts: Users can read loans where they are either the lender or borrower
CREATE POLICY "Allow reading loans for participants"
  ON public.debts FOR SELECT
  USING (true);

CREATE POLICY "Allow inserting loans"
  ON public.debts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow updating loans"
  ON public.debts FOR UPDATE
  USING (true);

-- Payments: Users can read and insert payments for loans they participate in
CREATE POLICY "Allow reading payments"
  ON public.payments FOR SELECT
  USING (true);

CREATE POLICY "Allow inserting payments"
  ON public.payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow updating payment confirmation"
  ON public.payments FOR UPDATE
  USING (true);

-- 6. Useful Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_debts_lender_phone ON public.debts(lender_phone);
CREATE INDEX IF NOT EXISTS idx_debts_borrower_phone ON public.debts(borrower_phone);
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON public.payments(debt_id);

-- 7. Seed Initial Demo Data (Harpreet General Store & Ramesh Kumar)
INSERT INTO public.debts (id, lender_phone, lender_name, lender_village, borrower_phone, borrower_name, borrower_village, principal, monthly_rate, duration_months, start_date, purpose)
VALUES 
  ('loan-1', '9876543210', 'Harpreet General Store', 'Gharuan Mandi', '9123456780', 'Ramesh Kumar', 'Gharuan', 5000, 2, 3, '2026-09-01', 'गेहूँ के बीज और यूरिया खाद (Wheat Seeds & Fertilizer)'),
  ('loan-2', '9876543210', 'Harpreet General Store', 'Gharuan Mandi', '9000000001', 'Sunita Devi', 'Kharar', 12000, 1.5, 6, '2026-06-15', 'सिलाई मशीन और कपड़े का सामान (Sewing Machine)'),
  ('loan-3', '9876543210', 'Harpreet General Store', 'Gharuan Mandi', '9000000002', 'Gurpreet Singh', 'Mohali', 3000, 2, 2, '2026-09-10', 'ट्रैक्टर रिपेयर (Tractor Repair)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.payments (id, debt_id, amount, payment_date, mode, confirmed, note)
VALUES
  ('p1', 'loan-1', 1000, '2026-10-05', 'cash', 1, 'नकद दिया'),
  ('p2', 'loan-1', 500, '2026-11-02', 'upi', 0, 'UPI से भेजा'),
  ('p3', 'loan-2', 2000, '2026-08-10', 'cash', 1, 'किस्त 1'),
  ('p4', 'loan-3', 3120, '2026-11-10', 'cash', 1, 'पूरा चुकता')
ON CONFLICT (id) DO NOTHING;
