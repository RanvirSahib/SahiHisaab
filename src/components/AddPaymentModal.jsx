import React, { useState } from 'react';
import { X, Check, HandCoins, Banknote, QrCode, Calendar, Coins, ShieldCheck } from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function AddPaymentModal({ lang, loan, onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState('cash'); // 'cash' | 'upi'
  const [note, setNote] = useState('');

  const t = (key) => getTranslation(lang, key);
  const metrics = calculateLoanMetrics(loan);

  const parsedAmount = Number(amount) || 0;
  // Calculate breakdown between interest & principal for this payment
  const interestDue = Math.max(0, metrics.totalInterest - metrics.interestPaid);
  const interestPortion = Math.min(parsedAmount, interestDue);
  const principalPortion = Math.max(0, parsedAmount - interestPortion);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSave({
      amount: parsedAmount,
      date: paymentDate || new Date().toISOString().slice(0, 10),
      mode,
      note: note.trim() || (mode === 'cash' ? t('cash') : t('upi')),
      confirmed: 0 // unconfirmed until borrower acknowledges
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-bahipaper-ledger w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-2 border-bahiteal-700 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 bg-bahiteal-700 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-bahigold-400 shrink-0">
              <HandCoins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl tracking-tight">
                {t('addPayment')}
              </h3>
              <p className="text-bahigold-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 mt-0.5">
                <span>{loan.borrowerName}</span>
                <span className="opacity-60">•</span>
                <span>{loan.borrowerVillage}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition active:scale-95"
            aria-label={t('close')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Remaining Balance Summary Card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-bahipaper-line shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-bahiteal-50 border border-bahiteal-200/60 flex items-center justify-center text-bahiteal-700 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-700 text-base">
                {t('totalToPay')}:
              </span>
            </div>
            <span className="font-black text-2xl sm:text-3xl text-bahiteal-900 tracking-tight">
              {formatRupee(metrics.remaining)}
            </span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1.5">
              {t('amount')} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-2xl text-bahiteal-700 select-none">
                ₹
              </span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                required
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-2xl font-extrabold rounded-2xl border-2 border-bahiteal-700 focus:ring-4 focus:ring-bahiteal-200 bg-white shadow-sm"
              />
            </div>

            {/* Quick preset chips */}
            <div className="grid grid-cols-4 gap-2 mt-2.5">
              {[500, 1000, 2000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className="py-2.5 px-1 rounded-xl bg-bahigold-100/70 hover:bg-bahigold-200 border border-bahigold-300 font-extrabold text-sm text-bahiteal-950 transition active:scale-95 shadow-xs"
                >
                  +{formatRupee(preset)}
                </button>
              ))}
              {metrics.remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(metrics.remaining))}
                  className="py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-extrabold text-sm text-emerald-800 transition active:scale-95 truncate shadow-xs"
                >
                  {lang === 'hi' ? 'पूरा' : (lang === 'pa' ? 'ਪੂਰਾ' : 'Full')}
                </button>
              )}
            </div>
          </div>

          {/* Payment Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-extrabold text-base text-bahiteal-900">
                {lang === 'hi' ? 'भुगतान की तारीख' : (lang === 'pa' ? 'ਕਿਸ਼ਤ ਦੀ ਮਿਤੀ' : 'Payment Date')}
              </label>
              <button
                type="button"
                onClick={() => setPaymentDate(new Date().toISOString().slice(0, 10))}
                className="text-xs font-bold text-bahiteal-700 hover:text-bahiteal-900 bg-bahiteal-50 hover:bg-bahiteal-100 px-2 py-0.5 rounded-full border border-bahiteal-200 transition"
              >
                📅 {t('today')}
              </button>
            </div>
            <div className="flex items-center rounded-2xl border-2 border-bahiteal-700 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-bahiteal-200 shadow-sm transition">
              <div className="flex items-center px-3.5 py-2.5 bg-bahiteal-50 border-r-2 border-bahiteal-200 select-none shrink-0 text-bahiteal-800">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="flex-1 min-w-0 pl-3 pr-2 py-2.5 text-base font-bold tracking-normal outline-none text-bahiteal-900 bg-transparent"
              />
            </div>
          </div>

          {/* Dynamic Split Breakdown - 2-Tile Financial Card */}
          {parsedAmount > 0 && (
            <div className="bg-amber-50/80 rounded-2xl p-4 border-2 border-amber-200/90 shadow-sm text-sm animate-in fade-in duration-150">
              <div className="font-extrabold text-amber-950 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  {lang === 'hi' ? 'किस्त का पारदर्शी बँटवारा:' : (lang === 'pa' ? 'ਕਿਸ਼ਤ ਦੀ ਵੰਡ:' : 'Transparent Payment Split:')}
                </span>
                <span className="text-xs bg-amber-200/70 text-amber-900 px-2.5 py-0.5 rounded-full font-extrabold">
                  ₹{parsedAmount}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-white border border-amber-300/80 shadow-xs">
                  <div className="text-xs font-bold text-gray-500 mb-0.5">
                    {t('interestPart')}
                  </div>
                  <div className="text-xl font-black text-amber-900">
                    {formatRupee(interestPortion)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-emerald-300/80 shadow-xs">
                  <div className="text-xs font-bold text-gray-500 mb-0.5">
                    {t('principalPart')}
                  </div>
                  <div className="text-xl font-black text-emerald-700">
                    {formatRupee(principalPortion)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Mode Selection (Zero Emojis, Pure Vectors) */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-2">
              {t('paymentMode')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('cash')}
                className={`py-3 px-4 rounded-2xl border-2 font-extrabold text-base flex items-center justify-center gap-2.5 transition active:scale-98 ${
                  mode === 'cash'
                    ? 'border-bahiteal-700 bg-bahiteal-700 text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Banknote className="w-5 h-5 shrink-0" />
                <span>{t('cash')}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('upi')}
                className={`py-3 px-4 rounded-2xl border-2 font-extrabold text-base flex items-center justify-center gap-2.5 transition active:scale-98 ${
                  mode === 'upi'
                    ? 'border-bahiteal-700 bg-bahiteal-700 text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <span>{t('upi')}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={parsedAmount <= 0}
              className="flex-1 min-h-[56px] rounded-full bg-bahigold-500 hover:bg-bahigold-400 disabled:opacity-50 text-bahiteal-900 font-extrabold text-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Check className="w-6 h-6" />
              <span>{t('save')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 min-h-[56px] rounded-full border-2 border-gray-400 font-bold text-gray-700 hover:bg-gray-100 transition active:scale-98"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
