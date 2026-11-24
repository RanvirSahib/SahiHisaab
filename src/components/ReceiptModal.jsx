import React from 'react';
import { X, Printer, Share2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee, formatPhone } from '../utils/storage';

export default function ReceiptModal({ lang, loan, payment, onClose }) {
  const t = (key) => getTranslation(lang, key);
  const metrics = calculateLoanMetrics(loan);

  const receiptNumber = `SH-${loan.id.slice(-4).toUpperCase()}-${payment ? payment.id : 'FULL'}`;
  const currentDate = payment ? payment.date : new Date().toISOString().slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📒 *सही हिसाब (SahiHisaab) डिजिटल पावती*\n` +
      `रसीद संख्या: ${receiptNumber}\n` +
      `तारीख: ${currentDate}\n` +
      `-------------------------\n` +
      `दुकान / ऋणदाता: ${loan.lenderName}\n` +
      `ग्राहक / ऋणी: ${loan.borrowerName} (${loan.borrowerVillage})\n` +
      `मोबाइल: +91 ${formatPhone(loan.borrowerPhone)}\n` +
      `-------------------------\n` +
      (payment 
        ? `जमा की गई राशि: *${formatRupee(payment.amount)}* (${payment.mode.toUpperCase()})\n`
        : `मूल उधार राशि: ${formatRupee(loan.principal)}\n`
      ) +
      `कुल बकाया बाकी: *${formatRupee(metrics.remaining)}*\n` +
      `स्थिति: ${metrics.remaining <= 0 ? '✔ पूरा चुकता' : '⏳ सक्रिय बकाया'}\n` +
      `-------------------------\n` +
      `"न गलती, न झंझट, पूरा विश्वास"`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-4 border-bahiteal-700 overflow-hidden">
        
        {/* Receipt Header */}
        <div className="p-4 bg-bahiteal-700 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <span className="font-extrabold text-xl">{t('printReceipt')}</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Traditional Bahi-Khata Receipt Voucher */}
        <div className="p-6 bg-[#fffef9] border-b-2 border-dashed border-gray-300 relative">
          
          {/* Watermark / Seal with Official Brand Lockup from logo/horizontallockup.webp */}
          <div className="text-center pb-3 border-b-2 border-bahiteal-700">
            <img 
              src="/logo/horizontallockup.webp" 
              alt="SahiHisaab Logo" 
              className="h-12 sm:h-14 w-auto max-w-[240px] mx-auto object-contain drop-shadow-sm mb-1" 
            />
            <div className="text-xs font-extrabold text-bahiteal-800 tracking-tight">
              ✦ {t('tagline')} ✦
            </div>
            <div className="text-[11px] text-gray-500 font-mono mt-1">
              Receipt No: {receiptNumber} · {currentDate}
            </div>
          </div>

          {/* Party details */}
          <div className="my-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-200 py-1.5">
              <span className="text-gray-500 font-bold">{t('receiptLender')}:</span>
              <span className="font-extrabold text-bahiteal-900">{loan.lenderName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1.5">
              <span className="text-gray-500 font-bold">{t('receiptBorrower')}:</span>
              <span className="font-extrabold text-bahiteal-900">{loan.borrowerName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1.5">
              <span className="text-gray-500 font-bold">{t('receiptVillage')}:</span>
              <span className="font-bold text-gray-800">{loan.borrowerVillage}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-1.5">
              <span className="text-gray-500 font-bold">{t('receiptPhone')}:</span>
              <span className="font-mono font-bold text-gray-800">+91 {formatPhone(loan.borrowerPhone)}</span>
            </div>
          </div>

          {/* Transaction highlight box */}
          <div className="my-5 p-4 rounded-2xl bg-amber-50/90 border-2 border-bahigold-500 text-center shadow-sm">
            {payment ? (
              <>
                <div className="text-xs font-extrabold uppercase tracking-wider text-gray-600">
                  {lang === 'hi' ? 'जमा की गई राशि' : 'Installment Paid'}
                </div>
                <div className="text-4xl font-extrabold text-bahiteal-900 my-1">
                  {formatRupee(payment.amount)}
                </div>
                <div className="text-xs font-extrabold text-bahigreen-600">
                  {payment.mode === 'cash' ? '💵 Cash' : '📱 UPI'} · {payment.date}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-extrabold uppercase tracking-wider text-gray-600">
                  {t('receiptOriginal')}
                </div>
                <div className="text-4xl font-extrabold text-bahiteal-900 my-1">
                  {formatRupee(loan.principal)}
                </div>
                <div className="text-xs font-extrabold text-gray-600">
                  {loan.monthlyRate}% {lang === 'hi' ? 'प्रति माह ब्याज' : 'per month interest'}
                </div>
              </>
            )}
          </div>

          {/* Balance Breakdown */}
          <div className="space-y-1.5 text-sm pt-2">
            <div className="flex justify-between text-gray-600 font-semibold">
              <span>{t('receiptOriginal')}:</span>
              <span>{formatRupee(loan.principal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-semibold">
              <span>{t('receiptInterest')}:</span>
              <span>{formatRupee(metrics.totalInterest)}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-semibold">
              <span>{t('receiptRepaid')}:</span>
              <span className="text-bahigreen-600 font-bold">{formatRupee(metrics.totalRepaid)}</span>
            </div>
            
            <div className="flex justify-between text-base font-extrabold text-bahiteal-900 pt-2.5 border-t-2 border-bahiteal-900">
              <span>{t('receiptRemaining')}:</span>
              <span className="text-xl text-red-600">{formatRupee(metrics.remaining)}</span>
            </div>
          </div>

          {/* Stamp */}
          <div className="mt-5 text-center">
            <div className="inline-block border-2 border-bahiteal-700 bg-bahiteal-50/50 rounded-xl px-4 py-1.5 text-bahiteal-800 font-extrabold text-xs tracking-wider uppercase shadow-sm">
              ✔ {metrics.remaining <= 0 ? t('cleared') : t('receiptConfirmed')}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-gray-50 flex gap-2 no-print">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow transition active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareWhatsApp')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-2xl bg-bahiteal-700 hover:bg-bahiteal-800 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow transition active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
