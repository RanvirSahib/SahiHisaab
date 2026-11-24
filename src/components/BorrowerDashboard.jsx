import React, { useState } from 'react';
import { Volume2, Printer, ShieldCheck, ChevronRight, CheckCircle2, AlertTriangle, Phone, MapPin, Store, BookOpen, Clock, Coins, Sparkles } from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee, formatPhone } from '../utils/storage';
import { speakText, stopSpeech } from '../utils/speech';

export default function BorrowerDashboard({
  lang,
  currentUser,
  debts,
  onSelectLoan,
  onOpenReceipt
}) {
  const [isSpeakingLocal, setIsSpeakingLocal] = useState(false);
  const t = (key) => getTranslation(lang, key);

  // Filter debts taken by this borrower
  const myBorrowedDebts = debts.filter(d => d.borrowerPhone === currentUser.phone);

  // Compute aggregate metrics
  let totalRemaining = 0;
  let totalOriginal = 0;
  let totalInterest = 0;
  let totalRepaid = 0;

  myBorrowedDebts.forEach(d => {
    const m = calculateLoanMetrics(d);
    totalRemaining += m.remaining;
    totalOriginal += m.principal;
    totalInterest += m.totalInterest;
    totalRepaid += m.totalRepaid;
  });

  const overallProgress = totalOriginal + totalInterest > 0
    ? Math.min(100, Math.round((totalRepaid / (totalOriginal + totalInterest)) * 100))
    : 100;

  const handleVoiceSummary = () => {
    if (isSpeakingLocal) {
      stopSpeech();
      setIsSpeakingLocal(false);
      return;
    }

    const name = currentUser.name || 'रमेश कुमार';
    let text = '';

    if (totalRemaining <= 0) {
      text = t('sayZero').replace('{name}', name);
    } else {
      text = t('sayRemaining')
        .replace('{name}', name)
        .replace('{amount}', Math.round(totalRemaining))
        .replace('{orig}', Math.round(totalOriginal))
        .replace('{repaid}', Math.round(totalRepaid));
    }

    speakText(
      text,
      lang,
      () => setIsSpeakingLocal(true),
      () => setIsSpeakingLocal(false)
    );
  };

  return (
    <div className="space-y-6 pb-28">

      {/* Borrower Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Persona Avatar Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bahiteal-50 to-bahiteal-100 border-2 border-bahiteal-300 flex items-center justify-center shadow-sm text-bahiteal-900 shrink-0">
            <Coins className="w-6 h-6 text-bahiteal-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-bahiteal-900 tracking-tight flex items-center gap-2">
                <span>{lang === 'pa' ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' : (lang === 'hi' ? 'नमस्ते' : 'Namaste')}!</span>
              </h2>
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bahigold-50 text-bahigold-900 border border-bahigold-200">
                <ShieldCheck className="w-3 h-3 text-bahigold-700" />
                {t('borrower')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
                <span>+91 {formatPhone(currentUser.phone)}</span>
              </p>
              {currentUser.name && (
                <span className="text-xs font-bold text-bahiteal-900 bg-bahiteal-50 px-2 py-0.5 rounded-md border border-bahiteal-200">
                  {currentUser.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleVoiceSummary}
          className={`py-2.5 px-4 rounded-full font-extrabold text-sm flex items-center gap-2 shadow transition active:scale-95 ${isSpeakingLocal
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-bahiteal-700 hover:bg-bahiteal-800 text-white'
            }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>{isSpeakingLocal ? t('stopListen') : `🔊 ${t('listen')}`}</span>
        </button>
      </div>

      {/* Giant "Bachi Hui Rashi" Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bahi border-2 border-bahipaper-line text-center relative overflow-hidden">
        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
          {t('totalToPay')}
        </span>

        <div className="text-5xl sm:text-6xl font-black text-bahiteal-900 my-3 tracking-tight">
          {formatRupee(totalRemaining)}
        </div>

        {/* Status Stamp */}
        <div className="my-2 inline-block">
          {totalRemaining <= 0 ? (
            <span className="bahi-stamp text-sm text-bahigreen-600 border-bahigreen-600 bg-bahigreen-50 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t('cleared')}</span>
            </span>
          ) : (
            <span className="bahi-stamp text-sm text-amber-800 border-amber-600 bg-amber-50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{t('dueSoon')}</span>
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
            <span>{t('repaymentProgress')}</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-bahigreen-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Three Itemized Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t-2 border-dashed border-gray-200 text-center">
          <div>
            <div className="text-xs font-bold text-gray-500">
              {t('originalLoan')}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-bahiteal-900 mt-0.5">
              {formatRupee(totalOriginal)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">
              {t('interestAdded')}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-amber-800 mt-0.5">
              {formatRupee(totalInterest)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500">
              {t('totalRepaid')}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-bahigreen-600 mt-0.5">
              {formatRupee(totalRepaid)}
            </div>
          </div>
        </div>
      </div>

      {/* List of Active & Completed Debts */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xl text-bahiteal-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-bahiteal-700" />
          <span>{lang === 'hi' ? 'आपके उधार खाते' : 'Your Loan Ledgers'}</span>
        </h3>

        {myBorrowedDebts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500 border border-bahipaper-line shadow-sm">
            <span className="text-4xl block mb-2">🎉</span>
            <span className="font-extrabold text-lg">
              {lang === 'hi' ? 'आपके ऊपर कोई उधार बकाया नहीं है!' : 'No active debts found!'}
            </span>
          </div>
        ) : (
          myBorrowedDebts.map((d) => {
            const m = calculateLoanMetrics(d);

            return (
              <div
                key={d.id}
                onClick={() => onSelectLoan(d)}
                className="bg-white rounded-3xl p-4 shadow-bahi border-2 border-bahipaper-line hover:border-bahiteal-700/60 cursor-pointer transition active:scale-99 flex items-center justify-between gap-3"
              >
                <div className="w-13 h-13 rounded-full bg-bahiteal-700 text-white flex items-center justify-center font-extrabold text-xl flex-shrink-0 shadow">
                  <Store className="w-6 h-6 text-bahigold-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xl text-bahiteal-900 truncate">
                    {d.lenderName || 'Harpreet Store'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                    <Phone className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
                    <span>+91 {formatPhone(d.lenderPhone)}</span>
                  </div>
                  {d.purpose && (
                    <div className="text-[11px] text-gray-600 font-medium truncate mt-1">
                      {d.purpose}
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <div>
                    <div className="font-extrabold text-xl sm:text-2xl text-bahiteal-900">
                      {formatRupee(m.remaining)}
                    </div>
                    <div className={`text-xs font-extrabold flex items-center justify-end gap-1 ${m.status === 'cleared' ? 'text-bahigreen-600' : 'text-amber-800'
                      }`}>
                      {m.status === 'cleared' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-bahigreen-600" />
                          <span>{t('cleared')}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                          <span>{t('dueSoon')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Direct Guarantee & Dispute Assurance */}
      <div className="bg-bahiteal-50 rounded-2xl p-4 border border-bahiteal-200 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-bahiteal-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-semibold text-bahiteal-900 leading-relaxed">
          {lang === 'hi'
            ? 'सही हिसाब गारंटी: जब भी आप कोई किस्त नकद या यूपीआई से देंगे, आप खाते में जाकर खुद पुष्टि (👍 हाँ, दिया) कर सकते हैं। कोई भी बिना आपकी जानकारी के हिसाब नहीं बदल सकता।'
            : 'SahiHisaab Guarantee: Every time an installment is paid, you can verify it directly in the app. No transaction can be modified without mutual shared visibility.'}
        </div>
      </div>
    </div>
  );
}
