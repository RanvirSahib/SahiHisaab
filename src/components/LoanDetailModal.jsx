import React, { useState } from 'react';
import { 
  X, Volume2, PlusCircle, Share2, Printer, 
  CheckCircle2, AlertTriangle, Clock, ArrowLeft,
  Calendar, CreditCard, Banknote, MapPin, Phone, Tag
} from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee, formatPhone } from '../utils/storage';
import { speakText, stopSpeech } from '../utils/speech';
import confetti from 'canvas-confetti';

export default function LoanDetailModal({ 
  lang, 
  loan, 
  isLenderView, 
  onClose, 
  onAddPayment, 
  onTogglePaymentAck,
  onOpenReceipt
}) {
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);
  const t = (key) => getTranslation(lang, key);
  const metrics = calculateLoanMetrics(loan);

  // Status mapping
  const statusConfig = {
    cleared: {
      label: t('cleared'),
      colorClass: 'text-bahigreen-600 border-bahigreen-600 bg-bahigreen-50',
      icon: CheckCircle2
    },
    dueSoon: {
      label: t('dueSoon'),
      colorClass: 'text-amber-700 border-amber-600 bg-amber-50',
      icon: Clock
    },
    overdue: {
      label: t('overdue'),
      colorClass: 'text-red-600 border-red-600 bg-red-50',
      icon: AlertTriangle
    }
  };

  const currentStatus = statusConfig[metrics.status] || statusConfig.dueSoon;

  const handleListen = () => {
    if (isSpeakingLocal) {
      stopSpeech();
      setIsSpeakingLocal(false);
      return;
    }

    const name = isLenderView ? loan.borrowerName : (loan.lenderName || 'हरप्रीत स्टोर');
    let speechText = '';

    if (metrics.remaining <= 0) {
      speechText = t('sayZero').replace('{name}', name);
    } else {
      speechText = t('sayRemaining')
        .replace('{name}', name)
        .replace('{amount}', Math.round(metrics.remaining))
        .replace('{orig}', Math.round(loan.principal))
        .replace('{repaid}', Math.round(metrics.totalRepaid));

      if (loan.payments && loan.payments.length > 0) {
        const last = loan.payments[loan.payments.length - 1];
        speechText += ' ' + t('sayPaymentNotice')
          .replace('{amount}', last.amount)
          .replace('{date}', last.date);
      }
    }

    speakText(
      speechText,
      lang,
      () => setIsSpeakingLocal(true),
      () => setIsSpeakingLocal(false)
    );
  };

  const handleAck = (paymentIndex, confirmed) => {
    if (confirmed === 1) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    onTogglePaymentAck(loan.id, paymentIndex, confirmed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-bahipaper-ledger w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-2 border-bahiteal-700 max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <div className="p-4 bg-bahiteal-700 text-white flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 font-extrabold text-sm hover:text-bahigold-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>

          <span className="font-extrabold text-base tracking-wide">
            {loan.borrowerName}
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Ledger Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Borrower Profile Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-bahipaper-line flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-bahiteal-700 text-white flex items-center justify-center font-extrabold text-2xl flex-shrink-0 shadow">
              {loan.borrowerName.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-2xl text-bahiteal-900 truncate">
                {loan.borrowerName}
              </h2>
              <div className="text-sm text-gray-500 font-medium flex items-center gap-2 flex-wrap mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
                  <span>{loan.borrowerVillage}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
                  <span>+91 {formatPhone(loan.borrowerPhone)}</span>
                </span>
              </div>
              {loan.purpose && (
                <div className="text-xs text-bahiteal-800 font-bold bg-bahiteal-50 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 mt-1">
                  <Tag className="w-3 h-3 text-bahiteal-700 shrink-0" />
                  <span>{loan.purpose}</span>
                </div>
              )}
            </div>
          </div>

          {/* Outstanding Balance Banner */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-bahipaper-line text-center relative overflow-hidden">
            <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              {t('totalToPay')}
            </div>
            <div className="text-5xl font-extrabold text-bahiteal-900 my-2 tracking-tight">
              {formatRupee(metrics.remaining)}
            </div>

            {/* Status Stamp */}
            <div className="inline-block my-2">
              <span className={`bahi-stamp text-sm flex items-center gap-1.5 ${currentStatus.colorClass}`}>
                {React.createElement(currentStatus.icon, { className: 'w-3.5 h-3.5 shrink-0' })}
                <span>{currentStatus.label}</span>
              </span>
            </div>

            {/* Repayment Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>{t('repaymentProgress')}</span>
                <span>{metrics.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bahigreen-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${metrics.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleListen}
              className={`flex-1 min-h-[54px] rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition shadow-sm active:scale-98 ${
                isSpeakingLocal
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-bahiteal-700 hover:bg-bahiteal-800 text-white'
              }`}
            >
              <Volume2 className="w-6 h-6" />
              <span>{isSpeakingLocal ? t('stopListen') : `🔊 ${t('listen')}`}</span>
            </button>

            {isLenderView && metrics.remaining > 0 && (
              <button
                onClick={() => onAddPayment(loan)}
                className="flex-1 min-h-[54px] rounded-2xl bg-bahigold-500 hover:bg-bahigold-400 text-bahiteal-900 font-extrabold text-lg flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
              >
                <PlusCircle className="w-6 h-6" />
                <span>💰 {t('addPayment')}</span>
              </button>
            )}
          </div>

          {/* Itemized Loan Ledger Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-bahipaper-line space-y-2.5 text-base">
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span>🤝 {t('originalLoan')}</span>
              <span className="font-extrabold text-bahiteal-900 text-lg">
                {formatRupee(loan.principal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span>📈 {t('interestAdded')} ({loan.monthlyRate}%/mo)</span>
              <span className="font-extrabold text-amber-900 text-lg">
                {formatRupee(metrics.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span>✅ {t('totalRepaid')}</span>
              <span className="font-extrabold text-bahigreen-600 text-lg">
                {formatRupee(metrics.totalRepaid)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold pt-1">
              <span>📅 {lang === 'hi' ? 'उधार शुरू होने की तारीख' : 'Loan Start Date'}</span>
              <span className="font-mono text-sm text-gray-600">
                {loan.startDate || '2026-09-01'}
              </span>
            </div>
          </div>

          {/* Payment Installments Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-extrabold text-xl text-bahiteal-900 flex items-center gap-2">
                <span>📅</span>
                <span>{lang === 'hi' ? 'अब तक की किस्तें' : 'Payments Timeline'}</span>
                <span className="text-sm font-bold bg-bahiteal-100 text-bahiteal-800 px-2 py-0.5 rounded-full">
                  {loan.payments ? loan.payments.length : 0}
                </span>
              </h3>

              <button
                onClick={() => onOpenReceipt(loan, null)}
                className="text-xs font-extrabold text-bahiteal-700 hover:underline flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('printReceipt')}</span>
              </button>
            </div>

            {(!loan.payments || loan.payments.length === 0) ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500 font-bold border border-bahipaper-line">
                🌱 {t('noPayments')}
              </div>
            ) : (
              <div className="space-y-2.5">
                {loan.payments.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="bg-white rounded-2xl p-3.5 shadow-sm border border-bahipaper-line flex items-center justify-between gap-3"
                  >
                    {/* Status Badge */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg flex-shrink-0 ${
                      p.confirmed === 1 
                        ? 'bg-bahigreen-500 text-white' 
                        : (p.confirmed === -1 ? 'bg-red-500 text-white' : 'bg-amber-400 text-bahiteal-900')
                    }`}>
                      {p.confirmed === 1 ? '✔' : (p.confirmed === -1 ? '!' : '⏳')}
                    </div>

                    {/* Payment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-xl text-bahiteal-900">
                          {formatRupee(p.amount)}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {p.mode === 'upi' ? '📱 UPI' : '💵 Cash'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-semibold flex items-center gap-2">
                        <span>{p.date}</span>
                        {p.note && <span>• {p.note}</span>}
                      </div>
                    </div>

                    {/* Mutual Confirmation Actions for Borrower */}
                    {!isLenderView && p.confirmed === 0 ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleAck(idx, 1)}
                          title={t('confirmPaid')}
                          className="px-3 py-1.5 rounded-xl bg-bahigreen-500 hover:bg-bahigreen-600 text-white text-xs font-extrabold flex items-center gap-1 shadow transition"
                        >
                          <span>👍</span>
                          <span>{t('confirmPaid')}</span>
                        </button>
                        <button
                          onClick={() => handleAck(idx, -1)}
                          title={t('flagDispute')}
                          className="px-2.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold flex items-center gap-1 shadow transition"
                        >
                          <span>👎</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                          p.confirmed === 1
                            ? 'text-bahigreen-600 bg-bahigreen-50'
                            : (p.confirmed === -1 ? 'text-red-600 bg-red-50' : 'text-amber-800 bg-amber-50')
                        }`}>
                          {p.confirmed === 1 ? t('confirmed') : (p.confirmed === -1 ? t('flagged') : 'प्रतीक्षारत (Pending)')}
                        </span>

                        <button
                          onClick={() => onOpenReceipt(loan, p)}
                          title={t('printReceipt')}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-bahiteal-700 transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
