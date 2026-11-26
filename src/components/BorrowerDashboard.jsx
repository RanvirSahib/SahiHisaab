import { useState } from 'react';
import { Volume2, ShieldCheck, ChevronRight, CheckCircle2, Phone, Store, BookOpen, Clock, Coins } from 'lucide-react';
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

  // Split into active (unpaid) and previous (fully paid) debts
  const activeDebts = myBorrowedDebts.filter(d => calculateLoanMetrics(d).remaining > 0);
  const previousDebts = myBorrowedDebts.filter(d => calculateLoanMetrics(d).remaining <= 0);

  // Compute aggregate metrics for ACTIVE loans (so settled past loans don't inflate active principal)
  let totalRemaining = 0;
  let totalOriginal = 0;
  let totalInterest = 0;
  let totalRepaid = 0;

  activeDebts.forEach(d => {
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Persona Avatar Badge */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-bahiteal-50 to-bahiteal-100 border-2 border-bahiteal-300 flex items-center justify-center shadow-sm text-bahiteal-900 shrink-0">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-bahiteal-800" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-bahiteal-900 tracking-tight">
                <span>{lang === 'pa' ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' : (lang === 'hi' ? 'नमस्ते' : 'Namaste')}!</span>
              </h2>
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bahigold-50 text-bahigold-900 border border-bahigold-200 shrink-0">
                <ShieldCheck className="w-3 h-3 text-bahigold-700" />
                {t('borrower')}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1 whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
                <span>+91 {formatPhone(currentUser.phone)}</span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleVoiceSummary}
          className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow transition active:scale-95 shrink-0 whitespace-nowrap ${isSpeakingLocal
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-bahiteal-700 hover:bg-bahiteal-800 text-white'
            }`}
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>{isSpeakingLocal ? t('stopListen') : t('listen')}</span>
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
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-5 pt-5 sm:mt-6 sm:pt-6 border-t-2 border-dashed border-gray-200 text-center">
          <div className="flex flex-col justify-between p-2 rounded-2xl bg-slate-50/80 border border-slate-200/60 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-gray-500 min-h-[28px] sm:min-h-[32px] flex items-center justify-center leading-tight">
              {t('originalLoan')}
            </span>
            <span className="text-base sm:text-xl font-black text-bahiteal-900 mt-1 tracking-tight truncate">
              {formatRupee(totalOriginal)}
            </span>
          </div>

          <div className="flex flex-col justify-between p-2 rounded-2xl bg-amber-50/70 border border-amber-200/60 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-amber-900/80 min-h-[28px] sm:min-h-[32px] flex items-center justify-center leading-tight">
              {t('interestAdded')}
            </span>
            <span className="text-base sm:text-xl font-black text-amber-800 mt-1 tracking-tight truncate">
              {formatRupee(totalInterest)}
            </span>
          </div>

          <div className="flex flex-col justify-between p-2 rounded-2xl bg-bahigreen-50/70 border border-bahigreen-200/60 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-bahigreen-800/80 min-h-[28px] sm:min-h-[32px] flex items-center justify-center leading-tight">
              {t('totalRepaid')}
            </span>
            <span className="text-base sm:text-xl font-black text-bahigreen-600 mt-1 tracking-tight truncate">
              {formatRupee(totalRepaid)}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Active Loans */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xl text-bahiteal-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-bahiteal-700" />
          <span>{t('activeLoans')}</span>
        </h3>

        {activeDebts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-bahipaper-line shadow-bahi">
            <div className="w-14 h-14 mx-auto rounded-full bg-bahigreen-50 border border-bahigreen-200 flex items-center justify-center text-bahigreen-600 mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-lg sm:text-xl text-bahiteal-900">
              {t('noActiveLoans')}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
              {t('noActiveLoansSub')}
            </p>
          </div>
        ) : (
          activeDebts.map((d) => {
            const m = calculateLoanMetrics(d);

            return (
              <div
                key={d.id}
                onClick={() => onSelectLoan(d)}
                className="bg-white rounded-3xl p-4 shadow-bahi border-2 border-bahipaper-line hover:border-bahiteal-700/60 cursor-pointer transition active:scale-99 flex items-center justify-between gap-3"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] min-h-[48px] aspect-square rounded-full bg-bahiteal-700 text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-sm select-none">
                  <BookOpen className="w-6 h-6 text-bahigold-300" />
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
                    <div className="text-xs font-extrabold flex items-center justify-end gap-1 text-amber-800">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                      <span>{t('dueSoon')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Section 2: Previous Settled Loans */}
      {previousDebts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg sm:text-xl text-gray-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-bahigreen-600" />
              <span>{t('previousLoans')}</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-bahigreen-50 text-bahigreen-700 border border-bahigreen-200">
              {previousDebts.length} {t('fullyPaidCount')}
            </span>
          </div>

          {previousDebts.map((d) => {
            const m = calculateLoanMetrics(d);

            return (
              <div
                key={d.id}
                onClick={() => onSelectLoan(d)}
                className="bg-white/90 rounded-3xl p-4 shadow-sm border-2 border-slate-200 hover:border-bahiteal-700/60 cursor-pointer transition active:scale-99 flex items-center justify-between gap-3 opacity-95 hover:opacity-100"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] min-h-[48px] aspect-square rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-extrabold text-xl shrink-0 shadow-xs select-none">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-lg sm:text-xl text-gray-800 truncate">
                    {d.lenderName || 'Harpreet Store'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>+91 {formatPhone(d.lenderPhone)}</span>
                  </div>
                  {d.purpose && (
                    <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                      {d.purpose}
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <div>
                    <div className="font-extrabold text-lg sm:text-xl text-gray-500 line-through">
                      {formatRupee(m.principal)}
                    </div>
                    <div className="text-xs font-black text-bahigreen-600 flex items-center justify-end gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-bahigreen-600" />
                      <span>{t('cleared')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}

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
