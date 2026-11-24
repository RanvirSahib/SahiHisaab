import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import LenderDashboard from './components/LenderDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';
import LoanDetailModal from './components/LoanDetailModal';
import AddPaymentModal from './components/AddPaymentModal';
import AddLoanModal from './components/AddLoanModal';
import ReceiptModal from './components/ReceiptModal';
import { getTranslation } from './translations';
import {
  getStoredDebts, saveStoredDebts,
  getStoredUser, saveStoredUser,
  getStoredLang, saveStoredLang,
  calculateLoanMetrics, formatRupee
} from './utils/storage';
import { 
  fetchUserDebts, insertSupabaseDebt, insertSupabasePayment, 
  isSupabaseConfigured, supabase 
} from './utils/supabase';
import { stopSpeech } from './utils/speech';

export default function App() {
  const [lang, setLang] = useState(() => getStoredLang());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [debts, setDebts] = useState(() => getStoredDebts());
  const [activeTab, setActiveTab] = useState('gave'); // 'gave' | 'took'

  // Fetch debts from Supabase when user is logged in
  useEffect(() => {
    if (currentUser && isSupabaseConfigured()) {
      fetchUserDebts(currentUser.phone).then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setDebts(data);
          saveStoredDebts(data);
        }
      });
    }
  }, [currentUser]);

  // Modals
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [addPaymentLoan, setAddPaymentLoan] = useState(null);
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null); // { loan, payment }

  // Speech indicator
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  const t = (key) => getTranslation(lang, key);

  // Sync language change
  const handleSetLang = (newLang) => {
    setLang(newLang);
    saveStoredLang(newLang);
    document.documentElement.lang = newLang;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync user change
  const handleLogin = (user) => {
    setCurrentUser(user);
    saveStoredUser(user);
    // Determine active tab automatically
    const gaveCount = debts.filter(d => d.lenderPhone === user.phone).length;
    const tookCount = debts.filter(d => d.borrowerPhone === user.phone).length;
    setActiveTab(gaveCount >= tookCount ? 'gave' : 'took');
    showToast(`Namaste, ${user.name}!`);
  };

  const handleLogout = () => {
    stopSpeech();
    setCurrentUser(null);
    saveStoredUser(null);
    setSelectedLoan(null);
  };

  // Save updated debts to state & localStorage
  const updateDebts = (newDebts) => {
    setDebts(newDebts);
    saveStoredDebts(newDebts);
  };

  // Record a payment installment
  const handleSavePayment = (paymentData) => {
    if (!addPaymentLoan) return;

    const newPayment = {
      id: `p-${Date.now()}`,
      ...paymentData
    };

    const updated = debts.map((d) => {
      if (d.id === addPaymentLoan.id) {
        return {
          ...d,
          payments: [...(d.payments || []), newPayment]
        };
      }
      return d;
    });

    updateDebts(updated);

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      insertSupabasePayment(addPaymentLoan.id, newPayment).catch(err => console.error('Supabase payment sync:', err));
    }

    // Also update currently open detail modal if any
    if (selectedLoan && selectedLoan.id === addPaymentLoan.id) {
      setSelectedLoan(updated.find(d => d.id === selectedLoan.id));
    }

    setAddPaymentLoan(null);
    showToast(t('paymentSaved'));
  };

  // Create a new loan record
  const handleSaveLoan = (newLoan) => {
    const updated = [newLoan, ...debts];
    updateDebts(updated);

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      insertSupabaseDebt(newLoan).catch(err => console.error('Supabase debt sync:', err));
    }

    setIsAddLoanOpen(false);
    showToast(t('loanSaved'));
  };

  // Toggle borrower acknowledgment (1 = confirmed, -1 = flagged dispute)
  const handleTogglePaymentAck = (loanId, paymentIndex, confirmedStatus) => {
    const updated = debts.map((d) => {
      if (d.id === loanId) {
        const nextPayments = [...(d.payments || [])];
        if (nextPayments[paymentIndex]) {
          nextPayments[paymentIndex] = {
            ...nextPayments[paymentIndex],
            confirmed: confirmedStatus
          };
        }
        return { ...d, payments: nextPayments };
      }
      return d;
    });

    updateDebts(updated);

    if (selectedLoan && selectedLoan.id === loanId) {
      setSelectedLoan(updated.find(d => d.id === loanId));
    }

    showToast(confirmedStatus === 1 ? `✅ ${t('confirmed')}` : `⚠️ ${t('flagged')}`);
  };

  // Filter counts for tabs
  const gaveDebts = currentUser ? debts.filter(d => d.lenderPhone === currentUser.phone) : [];
  const tookDebts = currentUser ? debts.filter(d => d.borrowerPhone === currentUser.phone) : [];

  return (
    <div className="min-h-screen flex flex-col font-baloo selection:bg-bahigold-300">

      {/* Universal Top Header */}
      <Header
        lang={lang}
        setLang={handleSetLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        isSpeaking={isSpeaking}
        onStopSpeech={() => {
          stopSpeech();
          setIsSpeaking(false);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto pl-5 pr-2.5 sm:px-6 py-4 sm:py-6 bahi-margin-container">
        {!currentUser ? (
          <AuthScreen
            lang={lang}
            onLogin={handleLogin}
          />
        ) : (
          <div>
            {/* Elegant Segmented Perspective Switcher */}
            <div className="bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl border border-bahipaper-line shadow-sm flex gap-1.5 mb-5">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setActiveTab('gave');
                }}
                className={`flex-1 py-2.5 px-2.5 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-98 ${activeTab === 'gave'
                  ? 'bg-gradient-to-r from-bahiteal-700 to-bahiteal-800 text-white shadow-md shadow-bahiteal-900/15'
                  : 'text-gray-600 hover:text-bahiteal-900 hover:bg-bahipaper-creme/60 font-bold'
                  }`}
              >
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />
                <span className="whitespace-nowrap">{t('gaveTab')}</span>
                <span className={`shrink-0 min-w-[22px] h-5 px-2 rounded-full font-black text-xs flex items-center justify-center transition-all ${
                  activeTab === 'gave'
                    ? 'bg-white text-bahiteal-900 shadow-xs'
                    : 'bg-gray-100 text-gray-500 border border-gray-200/60'
                }`}>
                  {gaveDebts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setActiveTab('took');
                }}
                className={`flex-1 py-2.5 px-2.5 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-98 ${activeTab === 'took'
                  ? 'bg-gradient-to-r from-bahiteal-700 to-bahiteal-800 text-white shadow-md shadow-bahiteal-900/15'
                  : 'text-gray-600 hover:text-bahiteal-900 hover:bg-bahipaper-creme/60 font-bold'
                  }`}
              >
                <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />
                <span className="whitespace-nowrap">{t('tookTab')}</span>
                <span className={`shrink-0 min-w-[22px] h-5 px-2 rounded-full font-black text-xs flex items-center justify-center transition-all ${
                  activeTab === 'took'
                    ? 'bg-white text-bahiteal-900 shadow-xs'
                    : 'bg-gray-100 text-gray-500 border border-gray-200/60'
                }`}>
                  {tookDebts.length}
                </span>
              </button>
            </div>

            {/* Dashboard Views */}
            {activeTab === 'gave' ? (
              <LenderDashboard
                lang={lang}
                currentUser={currentUser}
                debts={debts}
                onSelectLoan={(loan) => setSelectedLoan(loan)}
                onOpenAddLoan={() => setIsAddLoanOpen(true)}
              />
            ) : (
              <BorrowerDashboard
                lang={lang}
                currentUser={currentUser}
                debts={debts}
                onSelectLoan={(loan) => setSelectedLoan(loan)}
                onOpenReceipt={(loan, payment) => setReceiptData({ loan, payment })}
              />
            )}
          </div>
        )}
      </main>

      {/* Loan Detail Ledger Modal */}
      {selectedLoan && (
        <LoanDetailModal
          lang={lang}
          loan={selectedLoan}
          isLenderView={activeTab === 'gave'}
          onClose={() => setSelectedLoan(null)}
          onAddPayment={(loan) => setAddPaymentLoan(loan)}
          onTogglePaymentAck={handleTogglePaymentAck}
          onOpenReceipt={(loan, payment) => setReceiptData({ loan, payment })}
        />
      )}

      {/* Add Payment Modal */}
      {addPaymentLoan && (
        <AddPaymentModal
          lang={lang}
          loan={addPaymentLoan}
          onClose={() => setAddPaymentLoan(null)}
          onSave={handleSavePayment}
        />
      )}

      {/* Add Loan Modal */}
      {isAddLoanOpen && (
        <AddLoanModal
          lang={lang}
          lender={currentUser}
          onClose={() => setIsAddLoanOpen(false)}
          onSave={handleSaveLoan}
        />
      )}

      {/* Printable / Downloadable Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          lang={lang}
          loan={receiptData.loan}
          payment={receiptData.payment}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed left-4 right-4 bottom-6 max-w-md mx-auto z-50 bg-bahiteal-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl font-extrabold text-sm flex items-center justify-between border-2 border-bahigold-400 animate-in slide-in-from-bottom duration-200">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-bahigold-300 hover:text-white ml-2 text-base"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
