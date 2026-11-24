import React, { useState } from 'react';
import { X, Check, UserPlus, Sparkles, Calendar, Clock } from 'lucide-react';
import { getTranslation } from '../translations';
import confetti from 'canvas-confetti';

export default function AddLoanModal({ lang, lender, onClose, onSave }) {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerVillage, setBorrowerVillage] = useState('');
  const [principal, setPrincipal] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [monthlyRate, setMonthlyRate] = useState('2');
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState('');
  const [durationMonths, setDurationMonths] = useState('3');
  const [purpose, setPurpose] = useState('');

  const t = (key) => getTranslation(lang, key);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = borrowerPhone.replace(/\D/g, '');
    const numPrincipal = Number(principal);
    const finalRate = isCustomRate ? (parseFloat(customRate) || 0) : (parseFloat(monthlyRate) || 0);

    if (!borrowerName.trim() || cleanPhone.length !== 10 || numPrincipal <= 0) {
      alert(lang === 'hi' ? 'कृपया सभी जानकारी सही से भरें (१० अंकों का मोबाइल नंबर)' : 'Please fill all required details correctly (10-digit mobile number)');
      return;
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSave({
      id: `loan-${Date.now()}`,
      lenderPhone: lender.phone,
      lenderName: lender.name || 'Lender',
      lenderVillage: lender.village || 'Gharuan Mandi',
      borrowerPhone: cleanPhone,
      borrowerName: borrowerName.trim(),
      borrowerVillage: borrowerVillage.trim() || (lang === 'hi' ? 'गाँव' : 'Village'),
      principal: numPrincipal,
      monthlyRate: finalRate,
      durationMonths: Number(durationMonths) || 1,
      startDate: startDate || new Date().toISOString().slice(0, 10),
      purpose: purpose.trim() || (lang === 'hi' ? 'सामान्य ऋण' : 'General loan'),
      payments: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-bahipaper-ledger w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-2 border-bahiteal-700 max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="p-5 bg-bahiteal-700 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-bahigold-400" />
            <h3 className="font-extrabold text-2xl">
              {t('addLoan')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Borrower Name */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1">
              {t('borrowerName')} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              className="w-full px-4 py-3 text-lg font-bold rounded-2xl border-2 border-bahiteal-700 focus:ring-4 focus:ring-bahiteal-200 bg-white"
            />
          </div>

          {/* Borrower Phone */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1">
              {t('borrowerPhone')} *
            </label>
            <div className="flex items-center rounded-2xl border-2 border-bahiteal-700 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-bahiteal-200 shadow-sm transition">
              <div className="flex items-center px-4 py-3 bg-bahiteal-50 border-r-2 border-bahiteal-200 select-none shrink-0">
                <span className="font-extrabold text-bahiteal-900 text-base">
                  +91
                </span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                placeholder="91234 56780"
                value={borrowerPhone}
                onChange={(e) => setBorrowerPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 min-w-0 pl-4 pr-3 py-3 text-lg font-bold tracking-normal outline-none text-bahiteal-900 placeholder:text-gray-400 placeholder:font-normal bg-transparent"
              />
            </div>
          </div>

          {/* Village */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1">
              {t('village')}
            </label>
            <input
              type="text"
              placeholder="e.g. Gharuan / Kharar"
              value={borrowerVillage}
              onChange={(e) => setBorrowerVillage(e.target.value)}
              className="w-full px-4 py-3 text-lg font-bold rounded-2xl border-2 border-bahiteal-700 focus:ring-4 focus:ring-bahiteal-200 bg-white"
            />
          </div>

          {/* Principal Amount */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1">
              {t('amount')} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-xl text-bahiteal-700">
                ₹
              </span>
              <input
                type="number"
                inputMode="numeric"
                min="100"
                step="50"
                required
                placeholder="5000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xl font-extrabold rounded-2xl border-2 border-bahiteal-700 focus:ring-4 focus:ring-bahiteal-200 bg-white"
              />
            </div>
          </div>

          {/* Loan Start Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-extrabold text-base text-bahiteal-900">
                  {t('startDate')} *
                </label>
                <button
                  type="button"
                  onClick={() => setStartDate(new Date().toISOString().slice(0, 10))}
                  className="text-xs font-bold text-bahiteal-700 hover:text-bahiteal-900 bg-bahiteal-50 hover:bg-bahiteal-100 px-2 py-0.5 rounded-full border border-bahiteal-200 transition"
                >
                  📅 {t('today')}
                </button>
              </div>
              <div className="flex items-center rounded-2xl border-2 border-bahiteal-700 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-bahiteal-200 shadow-sm transition">
                <div className="flex items-center px-3.5 py-3 bg-bahiteal-50 border-r-2 border-bahiteal-200 select-none shrink-0 text-bahiteal-800">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 min-w-0 pl-3 pr-2 py-3 text-base font-bold tracking-normal outline-none text-bahiteal-900 bg-transparent"
                />
              </div>
            </div>

            {/* Duration (Months) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-extrabold text-base text-bahiteal-900">
                  {t('durationMonths')}
                </label>
                <span className="text-xs font-bold text-bahiteal-700 bg-bahiteal-50 px-2 py-0.5 rounded-full border border-bahiteal-100">
                  {durationMonths} {lang === 'hi' ? 'महीने' : (lang === 'pa' ? 'ਮਹੀਨੇ' : 'mo')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-[52px]">
                {['1', '2', '3', '6'].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setDurationMonths(m)}
                    className={`rounded-2xl border-2 font-extrabold text-sm transition flex items-center justify-center ${
                      durationMonths === m
                        ? 'bg-bahiteal-700 border-bahiteal-700 text-white shadow'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-extrabold text-base text-bahiteal-900">
                {t('interestRate')}
              </label>
              <span className="text-xs font-bold text-bahiteal-700 bg-bahiteal-50 px-2.5 py-0.5 rounded-full border border-bahiteal-100">
                {isCustomRate ? `${customRate || 0}%` : `${monthlyRate}%`} {lang === 'hi' ? 'मासिक' : 'monthly'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {['1', '1.5', '2', '3'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => {
                    setIsCustomRate(false);
                    setMonthlyRate(r);
                  }}
                  className={`py-2 px-1 rounded-xl border-2 font-extrabold text-sm sm:text-base transition ${
                    !isCustomRate && monthlyRate === r
                      ? 'bg-bahiteal-700 border-bahiteal-700 text-white shadow'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {r}%
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsCustomRate(true);
                  if (!customRate) setCustomRate(monthlyRate);
                }}
                className={`py-2 px-1 rounded-xl border-2 font-extrabold text-xs sm:text-sm transition ${
                  isCustomRate
                    ? 'bg-bahiteal-700 border-bahiteal-700 text-white shadow'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('other')}
              </button>
            </div>

            {/* Custom Rate Input with Points/Decimals */}
            {isCustomRate && (
              <div className="mt-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center rounded-2xl border-2 border-bahiteal-700 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-bahiteal-200 shadow-sm transition">
                  <div className="flex items-center px-3.5 py-2.5 bg-bahiteal-50 border-r-2 border-bahiteal-200 select-none shrink-0">
                    <span className="font-extrabold text-bahiteal-900 text-sm">
                      % {lang === 'hi' ? 'दर' : 'Rate'}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    autoFocus
                    placeholder={t('customRatePlaceholder')}
                    value={customRate}
                    onChange={(e) => {
                      setCustomRate(e.target.value);
                      setMonthlyRate(e.target.value);
                    }}
                    className="flex-1 min-w-0 pl-4 pr-3 py-2.5 text-base font-bold tracking-normal outline-none text-bahiteal-900 placeholder:text-gray-400 placeholder:font-normal bg-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-1 pl-1">
                  💡 {lang === 'hi' ? 'दशमलव / पॉइंट्स में भी लिख सकते हैं (उदा. 1.25%, 2.75%)' : 'You can enter decimal points (e.g. 1.25%, 2.75%)'}
                </p>
              </div>
            )}
          </div>

          {/* Purpose / Note */}
          <div>
            <label className="block font-extrabold text-base text-bahiteal-900 mb-1">
              {t('notes')}
            </label>
            <input
              type="text"
              placeholder={lang === 'hi' ? 'उदा. बीज, खाद, बच्चों की फीस' : 'e.g. Seeds, fertilizer, health'}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 text-base font-semibold rounded-2xl border-2 border-gray-300 focus:border-bahiteal-700 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="flex-1 min-h-[56px] rounded-full bg-bahigold-500 hover:bg-bahigold-400 text-bahiteal-900 font-extrabold text-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Check className="w-6 h-6" />
              <span>{t('save')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 min-h-[56px] rounded-full border-2 border-gray-400 font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
