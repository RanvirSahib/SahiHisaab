import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

/**
 * Send real SMS OTP to phone number using Supabase Phone Auth
 * @param {string} cleanPhone 10-digit phone number (without country code)
 */
export const sendSupabaseOtp = async (cleanPhone) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using demo mode.');
    return { data: null, error: null, isDemo: true };
  }

  const phoneWithCode = `+91${cleanPhone}`;
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneWithCode,
  });

  return { data, error, isDemo: false };
};

/**
 * Verify 6-digit or 4-digit SMS OTP using Supabase Phone Auth
 * @param {string} cleanPhone 10-digit phone number
 * @param {string} token OTP entered by user
 */
export const verifySupabaseOtp = async (cleanPhone, token) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null, isDemo: true };
  }

  const phoneWithCode = `+91${cleanPhone}`;
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneWithCode,
    token,
    type: 'sms',
  });

  return { data, error, isDemo: false };
};

/**
 * Fetch all debts and their nested payments for a user (as lender or borrower)
 * @param {string} phone 10-digit phone number
 */
export const fetchUserDebts = async (phone) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  const { data, error } = await supabase
    .from('debts')
    .select(`
      *,
      payments (*)
    `)
    .or(`lender_phone.eq.${phone},borrower_phone.eq.${phone}`)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  // Map snake_case DB columns to camelCase expected by components
  const mapped = (data || []).map(d => ({
    id: d.id,
    lenderPhone: d.lender_phone,
    lenderName: d.lender_name,
    lenderVillage: d.lender_village,
    borrowerPhone: d.borrower_phone,
    borrowerName: d.borrower_name,
    borrowerVillage: d.borrower_village,
    principal: Number(d.principal),
    monthlyRate: Number(d.monthly_rate),
    durationMonths: Number(d.duration_months),
    startDate: d.start_date,
    purpose: d.purpose,
    payments: (d.payments || []).map(p => ({
      id: p.id,
      amount: Number(p.amount),
      date: p.payment_date,
      mode: p.mode,
      confirmed: p.confirmed,
      note: p.note
    }))
  }));

  return { data: mapped, error: null };
};

/**
 * Save new debt to Supabase
 */
export const insertSupabaseDebt = async (debt) => {
  if (!isSupabaseConfigured()) return { data: null, isDemo: true };

  const payload = {
    id: debt.id,
    lender_phone: debt.lenderPhone,
    lender_name: debt.lenderName,
    lender_village: debt.lenderVillage,
    borrower_phone: debt.borrowerPhone,
    borrower_name: debt.borrowerName,
    borrower_village: debt.borrowerVillage,
    principal: debt.principal,
    monthly_rate: debt.monthlyRate,
    duration_months: debt.durationMonths,
    start_date: debt.startDate,
    purpose: debt.purpose
  };

  const { data, error } = await supabase
    .from('debts')
    .insert([payload])
    .select();

  return { data, error, isDemo: false };
};

/**
 * Record a payment in Supabase
 */
export const insertSupabasePayment = async (debtId, payment) => {
  if (!isSupabaseConfigured()) return { data: null, isDemo: true };

  const payload = {
    id: `pay-${Date.now()}`,
    debt_id: debtId,
    amount: payment.amount,
    payment_date: payment.date,
    mode: payment.mode,
    confirmed: payment.confirmed,
    note: payment.note
  };

  const { data, error } = await supabase
    .from('payments')
    .insert([payload])
    .select();

  return { data, error, isDemo: false };
};
