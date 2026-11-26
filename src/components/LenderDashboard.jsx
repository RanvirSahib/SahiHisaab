import { useState } from 'react';
import {
  Search, Plus, Filter, AlertCircle, Clock, CheckCircle2,
  Phone, MapPin, ChevronRight, ArrowUpDown, Coins, ArrowUpRight, ArrowDownLeft, AlertTriangle,
  BookOpen, ShieldCheck
} from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee, formatPhone } from '../utils/storage';

export default function LenderDashboard({
  lang,
  currentUser,
  debts,
  onSelectLoan,
  onOpenAddLoan
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'due' | 'overdue' | 'cleared'

  const t = (key) => getTranslation(lang, key);

  // Filter debts given by this lender
  const myLentDebts = debts.filter(d => d.lenderPhone === currentUser.phone);

  // Compute aggregate statistics
  let totalLent = 0;
  let totalRecovered = 0;
  let totalPending = 0;
  let overdueCount = 0;
  let dueSoonCount = 0;

  myLentDebts.forEach(d => {
    const m = calculateLoanMetrics(d);
    totalLent += m.principal;
    totalRecovered += m.totalRepaid;
    totalPending += m.remaining;
    if (m.status === 'overdue') overdueCount++;
    if (m.status === 'dueSoon') dueSoonCount++;
  });

  // Filter list by search query
  const matchesSearch = (d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.borrowerName.toLowerCase().includes(q) ||
      d.borrowerVillage.toLowerCase().includes(q) ||
      d.borrowerPhone.includes(q)
    );
  };

  const searchedDebts = myLentDebts.filter(matchesSearch);
  const activeDebts = searchedDebts.filter(d => calculateLoanMetrics(d).remaining > 0);
  const settledDebts = searchedDebts.filter(d => calculateLoanMetrics(d).remaining <= 0);

  // When filtering by specific status
  const filteredActiveDebts = activeDebts.filter(d => {
    const m = calculateLoanMetrics(d);
    if (statusFilter === 'due') return m.status === 'dueSoon';
    if (statusFilter === 'overdue') return m.status === 'overdue';
    return true;
  });

  // Render card for Active borrower accounts
  const renderActiveCard = (d, index) => {
    const m = calculateLoanMetrics(d);
    const avatarBg = ['#0b4f4a', '#2457c5', '#9b2d6f', '#4a5d6b', '#1f9d55'][index % 5];

    return (
      <div
        key={d.id}
        onClick={() => onSelectLoan(d)}
        className="bg-white rounded-3xl p-4 shadow-bahi border-2 border-bahipaper-line hover:border-bahiteal-700/60 cursor-pointer transition active:scale-99 flex items-center justify-between gap-3"
      >
        {/* Avatar Initials */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] min-h-[48px] aspect-square rounded-full text-white flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-sm select-none"
          style={{ backgroundColor: avatarBg }}
        >
          {d.borrowerName.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* Middle details */}
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-xl text-bahiteal-900 truncate">
            {d.borrowerName}
          </div>
          <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
              <span>{d.borrowerVillage}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
              <span>{formatPhone(d.borrowerPhone)}</span>
            </span>
          </div>
          {d.purpose && (
            <div className="text-[11px] text-gray-600 font-medium truncate mt-1">
              {d.purpose}
            </div>
          )}
        </div>

        {/* Right side amount & status */}
        <div className="text-right flex-shrink-0 flex items-center gap-2">
          <div>
            <div className="font-extrabold text-xl sm:text-2xl text-bahiteal-900">
              {formatRupee(m.remaining)}
            </div>
            <div className={`text-xs font-extrabold flex items-center justify-end gap-1 ${
              m.status === 'overdue' ? 'text-red-600' : 'text-amber-800'
            }`}>
              {m.status === 'overdue' && <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />}
              {m.status === 'dueSoon' && <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />}
              <span>{m.status === 'overdue' ? t('overdue') : t('dueSoon')}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 hidden sm:block" />
        </div>
      </div>
    );
  };

  // Render card for Settled historical accounts
  const renderSettledCard = (d) => {
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
            {d.borrowerName}
          </div>
          <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{d.borrowerVillage}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{formatPhone(d.borrowerPhone)}</span>
            </span>
          </div>
          {d.purpose && (
            <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
              {d.purpose}
            </div>
          )}
        </div>

        <div className="text-right flex-shrink-0 flex items-center gap-2">
          <div>
            <div className="font-bold text-sm sm:text-base text-gray-400 line-through">
              {formatRupee(m.principal)}
            </div>
            <div className="text-xs font-extrabold text-bahigreen-600 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-bahigreen-600" />
              <span>{t('cleared')}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 hidden sm:block" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-28">

      {/* Lender Greeting Banner */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Persona Avatar Badge - Traditional Bahi-Khata Ledger */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-bahigold-100 to-bahigold-200 border-2 border-bahigold-400 flex items-center justify-center shadow-sm text-bahiteal-900 shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-bahiteal-900" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-bahiteal-900 tracking-tight">
                <span>{lang === 'pa' ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' : (lang === 'hi' ? 'नमस्ते' : 'Namaste')}!</span>
              </h2>
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bahiteal-50 text-bahiteal-800 border border-bahiteal-200 shrink-0">
                <ShieldCheck className="w-3 h-3 text-bahiteal-700" />
                {t('lender')}
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
          onClick={onOpenAddLoan}
          className="hidden sm:inline-flex items-center gap-2 py-3 px-5 rounded-full bg-bahigold-500 hover:bg-bahigold-400 text-bahiteal-900 font-extrabold text-base shadow transition active:scale-98"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addLoan')}</span>
        </button>
      </div>

      {/* Overview Stat Cards in Bahi-Khata Double Ruled Frame */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 bg-white rounded-3xl p-2.5 sm:p-4 shadow-bahi border-2 border-bahipaper-line">
        <div className="text-center py-2.5 px-1 sm:p-3 rounded-2xl bg-bahiteal-50/60 border border-bahiteal-100 flex flex-col justify-center min-w-0">
          <small className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-gray-600 mb-0.5 truncate">
            <Coins className="w-3.5 h-3.5 text-bahiteal-700 shrink-0" />
            <span className="truncate">{t('lent')}</span>
          </small>
          <b className="text-base sm:text-2xl font-black text-bahiteal-900 tracking-tight truncate">
            {formatRupee(totalLent)}
          </b>
        </div>

        <div className="text-center py-2.5 px-1 sm:p-3 rounded-2xl bg-bahigreen-50/60 border border-bahigreen-100 flex flex-col justify-center min-w-0">
          <small className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-gray-600 mb-0.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-bahigreen-600 shrink-0" />
            <span className="truncate">{t('recovered')}</span>
          </small>
          <b className="text-base sm:text-2xl font-black text-bahigreen-600 tracking-tight truncate">
            {formatRupee(totalRecovered)}
          </b>
        </div>

        <div className="text-center py-2.5 px-1 sm:p-3 rounded-2xl bg-bahigold-50/70 border border-bahigold-200 flex flex-col justify-center min-w-0">
          <small className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-bahigold-900 mb-0.5 truncate">
            <Clock className="w-3.5 h-3.5 text-bahigold-700 shrink-0" />
            <span className="truncate">{t('leftToReceive')}</span>
          </small>
          <b className="text-base sm:text-2xl font-black text-bahigold-900 tracking-tight truncate">
            {formatRupee(totalPending)}
          </b>
        </div>
      </div>

      {/* Alert Notices */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-500 text-white font-extrabold text-sm shadow">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            {lang === 'hi' ? `सावधान: ${overdueCount} खातों में भुगतान की तारीख निकल गई है` : `Notice: ${overdueCount} accounts have overdue payments`}
          </span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-bahiteal-700/40 focus:border-bahiteal-700 bg-white font-bold text-base text-gray-800 shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: t('all'), icon: null },
            { id: 'overdue', label: t('overdue'), icon: AlertTriangle, iconColor: 'text-red-500' },
            { id: 'due', label: t('dueSoon'), icon: Clock, iconColor: 'text-amber-500' },
            { id: 'cleared', label: t('cleared'), icon: CheckCircle2, iconColor: 'text-emerald-500' }
          ].map(f => {
            const Icon = f.icon;
            const isSelected = statusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2.5 rounded-2xl font-extrabold text-xs whitespace-nowrap transition flex items-center gap-1.5 ${isSelected
                  ? 'bg-bahiteal-700 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {Icon && (
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : f.iconColor}`} />
                )}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Borrower Accounts Ledger List */}
      {statusFilter === 'cleared' ? (
        // When user explicitly taps "Fully Paid" filter pill
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg sm:text-xl text-gray-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-bahigreen-600" />
              <span>{t('previousLoans')}</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-bahigreen-50 text-bahigreen-700 border border-bahigreen-200">
              {settledDebts.length} {t('fullyPaidCount')}
            </span>
          </div>

          {settledDebts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-bahipaper-line shadow-bahi flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-bahiteal-50 border border-bahiteal-200 flex items-center justify-center text-bahiteal-700 mb-3 shadow-xs">
                <BookOpen className="w-7 h-7 text-bahiteal-700" />
              </div>
              <span className="font-extrabold text-base sm:text-lg text-bahiteal-900">{t('noDebts')}</span>
            </div>
          ) : (
            settledDebts.map(renderSettledCard)
          )}
        </div>
      ) : statusFilter === 'due' || statusFilter === 'overdue' ? (
        // When user taps "Overdue" or "Due Soon"
        <div className="space-y-3">
          {filteredActiveDebts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-bahipaper-line shadow-bahi flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-bahiteal-50 border border-bahiteal-200 flex items-center justify-center text-bahiteal-700 mb-3 shadow-xs">
                <BookOpen className="w-7 h-7 text-bahiteal-700" />
              </div>
              <span className="font-extrabold text-base sm:text-lg text-bahiteal-900">{t('noDebts')}</span>
            </div>
          ) : (
            filteredActiveDebts.map((d, idx) => renderActiveCard(d, idx))
          )}
        </div>
      ) : (
        // Default "All" view: Cleanly separated into Active Accounts and Settled History!
        <div className="space-y-5">
          {/* Section 1: Active Accounts */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xl text-bahiteal-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bahiteal-700" />
              <span>{t('activeLoans')}</span>
              {activeDebts.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-bahiteal-100 text-bahiteal-800">
                  {activeDebts.length}
                </span>
              )}
            </h3>

            {activeDebts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-bahipaper-line shadow-bahi">
                <div className="w-14 h-14 mx-auto rounded-full bg-bahigreen-50 border border-bahigreen-200 flex items-center justify-center text-bahigreen-600 mb-3 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg sm:text-xl text-bahiteal-900">
                  {lang === 'hi' ? 'सभी उधार पूरे वसूल हो चुके हैं!' : (lang === 'pa' ? 'ਸਾਰੇ ਉਧਾਰ ਪੂਰੇ ਵਸੂਲ ਹੋ ਚੁੱਕੇ ਹਨ!' : 'All loans have been fully recovered!')}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
                  {lang === 'hi' 
                    ? (settledDebts.length > 0 ? 'कोई सक्रिय बकाया नहीं है। पुराने चुकता खाते नीचे देखें।' : 'अभी कोई सक्रिय उधार नहीं है।')
                    : (lang === 'pa' 
                      ? (settledDebts.length > 0 ? 'ਕੋਈ ਸਰਗਰਮ ਬਕਾਇਆ ਨਹੀਂ ਹੈ। ਪਿਛਲੇ ਚੁਕਤਾ ਖਾਤੇ ਹੇਠਾਂ ਵੇਖੋ।' : 'ਹਾਲੇ ਕੋਈ ਸਰਗਰਮ ਉਧਾਰ ਨਹੀਂ ਹੈ।')
                      : (settledDebts.length > 0 ? 'No active dues pending collection. See settled history below.' : 'No active debts outstanding.')
                    )}
                </p>
              </div>
            ) : (
              activeDebts.map((d, idx) => renderActiveCard(d, idx))
            )}
          </div>

          {/* Section 2: Previous Settled Accounts (Only shown when there are settled loans) */}
          {settledDebts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg sm:text-xl text-gray-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-bahigreen-600" />
                  <span>{t('previousLoans')}</span>
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-bahigreen-50 text-bahigreen-700 border border-bahigreen-200">
                  {settledDebts.length} {t('fullyPaidCount')}
                </span>
              </div>

              {settledDebts.map(renderSettledCard)}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) for mobile */}
      <button
        onClick={onOpenAddLoan}
        className="sm:hidden fixed right-5 bottom-6 z-40 px-5 py-3.5 rounded-full bg-bahigold-500 text-bahiteal-900 font-extrabold text-base shadow-2xl flex items-center gap-2 active:scale-95 border-2 border-bahigold-600"
      >
        <Plus className="w-6 h-6" />
        <span>{t('addLoan')}</span>
      </button>
    </div>
  );
}
