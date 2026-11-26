import { useState, createElement } from 'react';
import { 
  X, Volume2, PlusCircle, Printer, 
  CheckCircle2, AlertTriangle, Clock, ArrowLeft,
  Calendar, Banknote, MapPin, Phone, Tag,
  Coins, TrendingUp, History, ReceiptIndianRupee, Check, AlertCircle, QrCode, Smartphone
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
    <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
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
                {createElement(currentStatus.icon, { className: 'w-3.5 h-3.5 shrink-0' })}
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
              <span>{isSpeakingLocal ? t('stopListen') : t('listen')}</span>
            </button>

            {isLenderView && metrics.remaining > 0 && (
              <button
                onClick={() => onAddPayment(loan)}
                className="flex-1 min-h-[54px] rounded-2xl bg-bahigold-500 hover:bg-bahigold-400 text-bahiteal-900 font-extrabold text-lg flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
              >
                <PlusCircle className="w-6 h-6" />
                <span>{t('addPayment')}</span>
              </button>
            )}
          </div>

          {/* Itemized Loan Ledger Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-bahipaper-line space-y-2.5 text-base">
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-bahiteal-700 shrink-0" />
                <span>{t('originalLoan')}</span>
              </span>
              <span className="font-extrabold text-bahiteal-900 text-lg">
                {formatRupee(loan.principal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t('interestAdded')} ({loan.monthlyRate}%/mo)</span>
              </span>
              <span className="font-extrabold text-amber-900 text-lg">
                {formatRupee(metrics.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold border-b border-dashed border-gray-200 pb-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bahigreen-600 shrink-0" />
                <span>{t('totalRepaid')}</span>
              </span>
              <span className="font-extrabold text-bahigreen-600 text-lg">
                {formatRupee(metrics.totalRepaid)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 font-bold pt-1">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bahiteal-700 shrink-0" />
                <span>{lang === 'hi' ? 'उधार शुरू होने की तारीख' : 'Loan Start Date'}</span>
              </span>
              <span className="font-mono text-sm text-gray-600">
                {loan.startDate || '2026-09-01'}
              </span>
            </div>
          </div>

          {/* Payment Installments Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-extrabold text-xl text-bahiteal-900 flex items-center gap-2">
                <History className="w-5 h-5 text-bahiteal-700 shrink-0" />
                <span>{lang === 'hi' ? 'अब तक की किस्तें' : 'Payments Timeline'}</span>
                <span className="text-sm font-bold bg-bahiteal-100 text-bahiteal-800 px-2 py-0.5 rounded-full">
                  {loan.payments ? loan.payments.length : 0}
                </span>
              </h3>

              <button
                onClick={() => onOpenReceipt(loan, null)}
                className="text-xs font-extrabold text-bahiteal-700 hover:underline flex items-center gap-1"
              >
                <ReceiptIndianRupee className="w-3.5 h-3.5" />
                <span>{t('printReceipt')}</span>
              </button>
            </div>

            {(!loan.payments || loan.payments.length === 0) ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500 font-bold border border-bahipaper-line flex flex-col items-center">
                <ReceiptIndianRupee className="w-8 h-8 text-gray-300 mb-1.5" />
                <span>{t('noPayments')}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {loan.payments.map((p, idx) => {
                  const isPending = p.confirmed === 0;
                  const isConfirmed = p.confirmed === 1;
                  const isDisputed = p.confirmed === -1;

                  return (
                    <div
                      key={p.id || idx}
                      className={`rounded-2xl p-3.5 sm:p-4 transition border shadow-xs ${
                        isPending
                          ? 'bg-amber-50/50 border-amber-200/90'
                          : isDisputed
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-bahipaper-line'
                      }`}
                    >
                      {/* Top Row: Status Badge + Amount + Payment Mode + Status Tag / Receipt Button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Micro Status Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                              isConfirmed
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : isDisputed
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'bg-amber-100 border-amber-300 text-amber-700'
                            }`}
                          >
                            {isConfirmed ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : isDisputed ? (
                              <AlertCircle className="w-5 h-5 stroke-[2]" />
                            ) : (
                              <Clock className="w-5 h-5 stroke-[2]" />
                            )}
                          </div>

                          {/* Amount & Mode Pill */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xl text-bahiteal-900 tracking-tight">
                              {formatRupee(p.amount)}
                            </span>
                            {p.mode === 'upi' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 shrink-0">
                                <Smartphone className="w-3 h-3 text-indigo-600 shrink-0" />
                                <span>UPI</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                                <Coins className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{lang === 'hi' ? 'नकद' : (lang === 'pa' ? 'ਨਕਦ' : 'Cash')}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side: Status Tag & Receipt Button */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isConfirmed && (
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{t('confirmed')}</span>
                            </span>
                          )}
                          {isDisputed && (
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <AlertCircle className="w-3 h-3" />
                              <span>{t('flagged')}</span>
                            </span>
                          )}
                          {isPending && isLenderView && (
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              <span>{lang === 'hi' ? 'पुष्टि बाकी' : 'Pending'}</span>
                            </span>
                          )}

                          {/* Modern Indian Rupee Receipt Action Button */}
                          <button
                            onClick={() => onOpenReceipt(loan, p)}
                            title={t('printReceipt')}
                            aria-label={t('printReceipt')}
                            className="p-1.5 rounded-xl border border-bahiteal-200 bg-bahiteal-50/70 hover:bg-bahiteal-100 hover:border-bahiteal-400 text-bahiteal-800 transition shadow-xs flex items-center justify-center"
                          >
                            <ReceiptIndianRupee className="w-4 h-4 stroke-[2.2]" />
                          </button>
                        </div>
                      </div>

                      {/* Date & Note Row: Aligned with full width and whitespace-nowrap */}
                      <div className="text-xs text-gray-500 font-semibold flex items-center gap-2 mt-2 pl-11">
                        <span className="font-mono text-gray-600 whitespace-nowrap">{p.date}</span>
                        {p.note && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-700 truncate">{p.note}</span>
                          </>
                        )}
                      </div>

                      {/* Borrower Confirmation Action Buttons: In dedicated bottom row with zero congestion! */}
                      {!isLenderView && isPending && (
                        <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-center gap-2">
                          <button
                            onClick={() => handleAck(idx, 1)}
                            className="flex-1 min-h-[42px] rounded-xl bg-bahiteal-700 hover:bg-bahiteal-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition"
                          >
                            <CheckCircle2 className="w-4 h-4 text-bahigold-300 stroke-[2.5]" />
                            <span>{t('confirmPaid')}</span>
                          </button>
                          <button
                            onClick={() => handleAck(idx, -1)}
                            className="min-h-[42px] px-3.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-500 stroke-[2]" />
                            <span>{t('flagDispute')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
