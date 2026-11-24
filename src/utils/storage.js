// LocalStorage persistence and calculation helpers

const STORAGE_KEY = 'sahihisaab_v2_db';
const USER_KEY = 'sahihisaab_v2_me';
const LANG_KEY = 'sahihisaab_v2_lang';

export const INITIAL_DEBTS = [
  {
    id: 'loan-1',
    lenderPhone: '9876543210',
    lenderName: 'Harpreet General Store',
    lenderVillage: 'Gharuan Mandi',
    borrowerPhone: '9123456780',
    borrowerName: 'Ramesh Kumar',
    borrowerVillage: 'Gharuan',
    principal: 5000,
    monthlyRate: 2, // 2% per month
    durationMonths: 3,
    startDate: '2026-09-01',
    purpose: 'गेहूँ के बीज और यूरिया खाद (Wheat Seeds & Fertilizer)',
    payments: [
      { id: 'p1', amount: 1000, date: '2026-10-05', mode: 'cash', confirmed: 1, note: 'नकद दिया' },
      { id: 'p2', amount: 500, date: '2026-11-02', mode: 'upi', confirmed: 0, note: 'UPI से भेजा' }
    ]
  },
  {
    id: 'loan-2',
    lenderPhone: '9876543210',
    lenderName: 'Harpreet General Store',
    lenderVillage: 'Gharuan Mandi',
    borrowerPhone: '9000000001',
    borrowerName: 'Sunita Devi',
    borrowerVillage: 'Kharar',
    principal: 12000,
    monthlyRate: 1.5,
    durationMonths: 6,
    startDate: '2026-06-15',
    purpose: 'सिलाई मशीन और कपड़े का सामान (Sewing Machine)',
    payments: [
      { id: 'p3', amount: 2000, date: '2026-08-10', mode: 'cash', confirmed: 1, note: 'किस्त 1' }
    ]
  },
  {
    id: 'loan-3',
    lenderPhone: '9876543210',
    lenderName: 'Harpreet General Store',
    lenderVillage: 'Gharuan Mandi',
    borrowerPhone: '9000000002',
    borrowerName: 'Gurpreet Singh',
    borrowerVillage: 'Mohali',
    principal: 3000,
    monthlyRate: 2,
    durationMonths: 2,
    startDate: '2026-09-10',
    purpose: 'ट्रैक्टर रिपेयर (Tractor Repair)',
    payments: [
      { id: 'p4', amount: 3120, date: '2026-11-10', mode: 'cash', confirmed: 1, note: 'पूरा चुकता' }
    ]
  },
  {
    id: 'loan-4',
    lenderPhone: '9000000001',
    lenderName: 'Sunita Devi',
    lenderVillage: 'Kharar',
    borrowerPhone: '9876543210',
    borrowerName: 'Harpreet General Store',
    borrowerVillage: 'Gharuan Mandi',
    principal: 2000,
    monthlyRate: 1,
    durationMonths: 2,
    startDate: '2026-10-01',
    purpose: 'सामुदायिक स्वयं सहायता समूह फंड (SHG Emergency)',
    payments: [
      { id: 'p5', amount: 500, date: '2026-11-01', mode: 'cash', confirmed: 0, note: 'प्रथम किश्त' }
    ]
  }
];

export const getStoredDebts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed reading debts from localStorage:', err);
  }
  return INITIAL_DEBTS;
};

export const saveStoredDebts = (debts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
  } catch (err) {
    console.error('Failed saving debts to localStorage:', err);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export const saveStoredUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (e) {}
};

export const getStoredLang = () => {
  try {
    return localStorage.getItem(LANG_KEY) || 'hi';
  } catch (e) {
    return 'hi';
  }
};

export const saveStoredLang = (lang) => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {}
};

// Simple Interest Calculation & Remaining Balance Breakdown
export const calculateLoanMetrics = (loan) => {
  const principal = Number(loan.principal) || 0;
  const rate = Number(loan.monthlyRate) || 0;
  
  // Calculate months elapsed or defined duration
  let months = loan.durationMonths || 1;
  if (loan.startDate) {
    const start = new Date(loan.startDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    months = Math.max(1, diffMonths || loan.durationMonths || 1);
  }

  // Simple interest: (P * R * M) / 100
  const totalInterest = Math.round((principal * rate * months) / 100);
  const totalPayable = principal + totalInterest;

  const totalRepaid = (loan.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const remaining = Math.max(0, totalPayable - totalRepaid);

  // Status computation
  let status = 'dueSoon'; // amber
  if (remaining <= 0) {
    status = 'cleared'; // green
  } else if (months >= 3 && totalRepaid < totalPayable * 0.3) {
    status = 'overdue'; // red
  }

  // Interest vs Principal paid split
  const interestPaid = Math.min(totalInterest, totalRepaid);
  const principalPaid = Math.max(0, totalRepaid - interestPaid);

  return {
    principal,
    rate,
    months,
    totalInterest,
    totalPayable,
    totalRepaid,
    remaining,
    status,
    interestPaid,
    principalPaid,
    progressPercent: Math.min(100, Math.round((totalRepaid / (totalPayable || 1)) * 100))
  };
};

// Format currency as Indian Rupee (e.g., ₹ 5,000)
export const formatRupee = (num) => {
  const rounded = Math.round(Number(num) || 0);
  return '₹' + rounded.toLocaleString('en-IN');
};

// Format Indian phone number nicely (e.g. 98765 43210)
export const formatPhone = (phone = '') => {
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    return clean.slice(0, 5) + ' ' + clean.slice(5);
  }
  return clean;
};
