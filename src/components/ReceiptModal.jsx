import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Share2, ReceiptIndianRupee, CheckCircle2, Store, User, Tag, Coins, Smartphone, Clock, ShieldCheck } from 'lucide-react';
import { getTranslation } from '../translations';
import { calculateLoanMetrics, formatRupee, formatPhone } from '../utils/storage';

export default function ReceiptModal({ lang, loan, payment, onClose }) {
  const t = (key) => getTranslation(lang, key);
  const metrics = calculateLoanMetrics(loan);
  const voucherRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Clean, authentic receipt serial number without cryptic programmer codes
  const rawNum = loan.id.replace(/[^0-9]/g, '');
  const cleanSerial = rawNum ? rawNum.slice(-4).padStart(2, '0') : '01';
  const receiptNumber = payment
    ? `SH-${cleanSerial}-${payment.id.replace(/[^0-9]/g, '') || '1'}`
    : `SH-${cleanSerial}`;
  const currentDate = payment ? payment.date : new Date().toISOString().slice(0, 10);

  // Calculate historical allocation and balance for this specific payment
  let priorRepaid = 0;
  if (payment && loan.payments) {
    const paymentIndex = loan.payments.findIndex(p => p.id === payment.id || (p.date === payment.date && Number(p.amount) === Number(payment.amount)));
    const priorPayments = paymentIndex >= 0 ? loan.payments.slice(0, paymentIndex) : [];
    priorRepaid = priorPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }

  const totalInterest = metrics.totalInterest;
  const interestRemainingBefore = Math.max(0, totalInterest - priorRepaid);
  const thisPaymentAmount = payment ? Number(payment.amount) || 0 : 0;
  const thisInterestPaid = Math.min(thisPaymentAmount, interestRemainingBefore);
  const thisPrincipalPaid = Math.max(0, thisPaymentAmount - thisInterestPaid);

  const totalRepaidUpToThis = priorRepaid + thisPaymentAmount;
  const interestPendingAfterThis = Math.max(0, totalInterest - totalRepaidUpToThis);
  const balanceAfterThis = Math.max(0, (loan.principal + totalInterest) - totalRepaidUpToThis);

  const handleDownloadImage = async () => {
    if (!voucherRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(voucherRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f7fbff',
        logging: false
      });
      const imgUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imgUrl;
      downloadLink.download = `SahiHisaab_${receiptNumber}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Failed to generate receipt image:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const isPaymentReceipt = Boolean(payment);
    const text = encodeURIComponent(
      `📒 *सही हिसाब (SahiHisaab) ${isPaymentReceipt ? 'किस्त भुगतान पावती' : 'कुल खाता बही रसीद'}*\n` +
      `रसीद संख्या: ${receiptNumber}\n` +
      `तारीख: ${currentDate}\n` +
      `-------------------------\n` +
      `दुकान / ऋणदाता: ${loan.lenderName}\n` +
      `ग्राहक / ऋणी: ${loan.borrowerName} (${loan.borrowerVillage})\n` +
      `मोबाइल: +91 ${formatPhone(loan.borrowerPhone)}\n` +
      `-------------------------\n` +
      (isPaymentReceipt
        ? `*किस्त भुगतान विवरण (Payment Details):*\n` +
          `जमा की गई राशि: *${formatRupee(payment.amount)}* (${payment.mode.toUpperCase()})\n` +
          `• ब्याज में जमा: ${thisInterestPaid > 0 ? formatRupee(thisInterestPaid) : '₹0'}\n` +
          `• मूलधन में जमा: ${formatRupee(thisPrincipalPaid)}\n` +
          `• ब्याज स्थिति: ${interestPendingAfterThis <= 0 ? '✔ ब्याज पूरा चुकता' : `${formatRupee(interestPendingAfterThis)} ब्याज बाकी`}\n` +
          `-------------------------\n` +
          `*इस किश्त के बाद शेष बकाया: ${formatRupee(balanceAfterThis)}*\n` +
          `स्थिति: ${balanceAfterThis <= 0 ? '✔ खाता चुकता' : '⏳ सक्रिय बकाया'}\n`
        : `*कुल खाता विवरण (Complete Account Summary):*\n` +
          `मूल उधार राशि: ${formatRupee(loan.principal)}\n` +
          `कुल जुड़ा ब्याज: + ${formatRupee(metrics.totalInterest)}\n` +
          `अब तक कुल चुकाया: - ${formatRupee(metrics.totalRepaid)}\n` +
          `कुल बकाया बाकी: *${formatRupee(metrics.remaining)}*\n` +
          `स्थिति: ${metrics.remaining <= 0 ? '✔ पूरा चुकता (Fully Settled)' : '⏳ सक्रिय बकाया (Active)'}\n`
      ) +
      `-------------------------\n` +
      `"न गलती, न झंझट, पूरा विश्वास"`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="receipt-modal-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="receipt-printable-card bg-white w-full max-w-md rounded-3xl shadow-2xl border-4 border-bahiteal-700 overflow-hidden my-auto">

        {/* Receipt Header Bar (Hidden during print) */}
        <div className="p-4 bg-bahiteal-700 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ReceiptIndianRupee className="w-5 h-5 text-bahigold-300" />
            <span className="font-extrabold text-lg sm:text-xl">
              {payment 
                ? (lang === 'hi' ? 'किस्त भुगतान पावती' : (lang === 'pa' ? 'ਕਿਸ਼ਤ ਭੁਗਤਾਨ ਰਸੀਦ' : 'Installment Payment Slip'))
                : (lang === 'hi' ? 'कुल खाता बही रसीद' : (lang === 'pa' ? 'ਕੁੱਲ ਖਾਤਾ ਬਹੀ ਰਸੀਦ' : 'Complete Ledger Statement'))}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Traditional Bahi-Khata Receipt Voucher */}
        <div 
          ref={voucherRef} 
          className="p-5 sm:p-6 border-b-2 border-dashed border-bahigold-300 relative select-none overflow-hidden"
          style={{
            backgroundColor: '#f7fbff',
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #cfe0f3 35px, #cfe0f3 36px)'
          }}
        >
          {/* Authentic Bahi-Khata Red Vertical Margin Line */}
          <div 
            className="absolute left-6 sm:left-7 top-0 bottom-0 w-[2px] bg-red-400/50 pointer-events-none z-0"
            aria-hidden="true"
          />

          {/* Top Auspicious Golden Scallop Border Trim */}
          <div 
            className="h-2.5 w-full -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-3 sm:mb-4 relative z-10"
            style={{
              width: 'calc(100% + 2.5rem)',
              background: 'radial-gradient(circle at 9px 0, #ebaa20 6px, transparent 7px) 0 0 / 18px 9px repeat-x'
            }}
          />

          {/* Top Auspicious Heading & Seal */}
          <div className="text-center pb-2.5 border-b-2 border-double border-bahiteal-800 relative z-10">
            <div className="text-[11px] font-bold text-amber-900 tracking-widest mb-1 opacity-90">
              ॥ श्री गणेशाय नमः ॥
            </div>
            <img
              src="/logo/horizontallockup.webp"
              alt="SahiHisaab Logo"
              className="h-11 sm:h-14 w-auto max-w-[230px] mx-auto object-contain drop-shadow-xs mb-1"
            />
            <div className="text-xs font-black text-bahiteal-800 tracking-tight">
              ✦ {t('tagline')} ✦
            </div>
          </div>

          {/* Receipt Metadata Bar */}
          <div className="my-2.5 py-1.5 px-3.5 rounded-xl bg-bahiteal-50/90 border border-bahiteal-200/90 flex items-center justify-between text-xs text-bahiteal-900 font-bold relative z-10 shadow-2xs">
            <div>
              <span className="text-gray-500 font-semibold">{t('receiptNo')} </span>
              <span className="font-mono text-bahiteal-900 font-extrabold">{receiptNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">{t('date')}: </span>
              <span className="font-mono text-bahiteal-900 font-extrabold">{currentDate}</span>
            </div>
          </div>

          {/* Parties Details Card - Unified spacious layout with zero congestion */}
          <div className="bg-white/95 rounded-2xl p-3 sm:p-3.5 border border-bahipaper-line shadow-xs space-y-2.5 my-2.5 relative z-10">
            {/* Lender Row */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-bahiteal-700 flex items-center gap-1">
                  <Store className="w-3 h-3 text-bahiteal-600 shrink-0" />
                  <span>{t('receiptLender')}</span>
                </div>
                <div className="font-black text-sm sm:text-base text-bahiteal-900 leading-tight mt-0.5">
                  {loan.lenderName}
                </div>
                <div className="text-gray-500 text-[11px] font-medium truncate mt-0.5">
                  {loan.lenderVillage}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-gray-700 font-bold bg-gray-50 border border-gray-200/80 px-2 py-1 rounded-lg">
                  +91 {formatPhone(loan.lenderPhone)}
                </span>
              </div>
            </div>

            {/* Borrower Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>{t('receiptBorrower')}</span>
                </div>
                <div className="font-black text-sm sm:text-base text-bahiteal-900 leading-tight mt-0.5">
                  {loan.borrowerName}
                </div>
                <div className="text-gray-500 text-[11px] font-medium truncate mt-0.5">
                  {loan.borrowerVillage}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs text-gray-700 font-bold bg-gray-50 border border-gray-200/80 px-2 py-1 rounded-lg">
                  +91 {formatPhone(loan.borrowerPhone)}
                </span>
              </div>
            </div>
          </div>

          {loan.purpose && (
            <div className="text-[11px] text-bahiteal-900 font-semibold bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-lg mb-2.5 flex items-center gap-1 relative z-10">
              <Tag className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">{loan.purpose}</span>
            </div>
          )}

          {/* Transaction Highlight Hero Box */}
          {payment ? (
            <div className="my-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 text-center shadow-xs relative z-10">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{lang === 'hi' ? 'जमा की गई किस्त' : (lang === 'pa' ? 'ਜਮ੍ਹਾਂ ਕੀਤੀ ਕਿਸ਼ਤ' : 'Installment Payment Received')}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-bahiteal-900 my-0.5 tracking-tight">
                {formatRupee(payment.amount)}
              </div>
              <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 flex-wrap">
                {payment.mode === 'cash' ? (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800">
                    <Coins className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{lang === 'hi' ? 'नकद भुगतान' : 'Cash'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-purple-200 text-purple-800">
                    <Smartphone className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>UPI</span>
                  </span>
                )}
                <span>· {payment.date}</span>
                {payment.note && <span className="text-gray-500 font-medium truncate">({payment.note})</span>}
              </div>
            </div>
          ) : (
            <div className={`my-2.5 p-3 rounded-2xl border-2 text-center shadow-xs relative z-10 ${metrics.remaining <= 0
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 border-bahigold-500'
              }`}>
              <div className={`text-[11px] font-black uppercase tracking-wider ${metrics.remaining <= 0 ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                {metrics.remaining <= 0
                  ? (lang === 'hi' ? 'खाता स्थिति: पूरा चुकता' : 'Account Status: Fully Settled')
                  : (lang === 'hi' ? 'वर्तमान कुल शेष बकाया' : 'Current Balance Due')}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-bahiteal-900 my-0.5 tracking-tight">
                {formatRupee(metrics.remaining)}
              </div>
              <div className="text-xs font-extrabold text-gray-600">
                {metrics.remaining <= 0
                  ? (lang === 'hi' ? '✦ सभी देनदारियां समाप्त ✦' : '✦ Zero Balance Outstanding ✦')
                  : `${t('interestAdded')}: ${loan.monthlyRate}%/mo`}
              </div>
            </div>
          )}

          {/* Conditional Detail Section: Individual Payment Slip vs Full Account Statement */}
          {payment ? (
            /* Specific Installment Payment Breakdown with Interest & Balance Left */
            <div className="my-2.5 bg-white/95 backdrop-blur-xs rounded-2xl p-3.5 border border-bahipaper-line shadow-xs space-y-2.5 text-xs sm:text-sm relative z-10">
              <div className="text-[11px] font-black uppercase tracking-wider text-bahiteal-800 pb-1.5 border-b border-gray-200 flex items-center justify-between">
                <span>{lang === 'hi' ? 'किस्त भुगतान एवं शेष हिसाब' : (lang === 'pa' ? 'ਕਿਸ਼ਤ ਭੁਗਤਾਨ ਤੇ ਬਾਕੀ ਹਿਸਾਬ' : 'Payment & Balance Breakdown')}</span>
                <span className="text-gray-400 font-mono text-[10px]">INR (₹)</span>
              </div>

              {/* Installment Amount Paid */}
              <div className="flex justify-between items-center text-gray-700 font-medium">
                <span>{lang === 'hi' ? 'जमा की गई राशि' : (lang === 'pa' ? 'ਜਮ੍ਹਾਂ ਕੀਤੀ ਰਕਮ' : 'Installment Paid')}:</span>
                <span className="font-black text-emerald-600 text-sm sm:text-base">{formatRupee(payment.amount)}</span>
              </div>

              {/* Transparent Split: Applied to Interest vs Applied to Principal */}
              <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/80 space-y-1.5">
                <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-amber-900">
                  {lang === 'hi' ? 'किस्त का बँटवारा (ब्याज व मूलधन):' : (lang === 'pa' ? 'ਕਿਸ਼ਤ ਦੀ ਵੰਡ (ਵਿਆਜ ਤੇ ਮੂਲ):' : 'Payment Split (Interest & Principal):')}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">
                    {lang === 'hi' ? 'ब्याज में जमा' : (lang === 'pa' ? 'ਵਿਆਜ ਵਿੱਚ ਜਮ੍ਹਾਂ' : 'Paid to Interest')}:
                  </span>
                  <span className="font-bold text-amber-900">
                    {thisInterestPaid > 0 ? `+ ${formatRupee(thisInterestPaid)}` : '₹0 (चुकता)'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">
                    {lang === 'hi' ? 'मूलधन में जमा' : (lang === 'pa' ? 'ਮੂਲ ਰਕਮ ਵਿੱਚ ਜਮ੍ਹਾਂ' : 'Paid to Principal')}:
                  </span>
                  <span className="font-bold text-emerald-700">
                    {thisPrincipalPaid > 0 ? `+ ${formatRupee(thisPrincipalPaid)}` : '₹0'}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-amber-200/70 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-gray-700">
                    {lang === 'hi' ? 'ब्याज स्थिति' : (lang === 'pa' ? 'ਵਿਆਜ ਸਥਿਤੀ' : 'Interest Status')}:
                  </span>
                  <span className={`font-black inline-flex items-center gap-1 ${
                    interestPendingAfterThis <= 0 ? 'text-emerald-700' : 'text-amber-800'
                  }`}>
                    {interestPendingAfterThis <= 0 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{lang === 'hi' ? 'ब्याज पूरा चुकता' : (lang === 'pa' ? 'ਵਿਆਜ ਪੂਰਾ ਚੁਕਤਾ' : 'Interest Fully Cleared')}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{lang === 'hi' ? `${formatRupee(interestPendingAfterThis)} ब्याज बाकी` : `${formatRupee(interestPendingAfterThis)} Interest Pending`}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Net Balance Remaining After This Payment */}
              <div className="pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center font-black">
                <div>
                  <div className="text-xs sm:text-sm text-bahiteal-900">
                    {lang === 'hi' ? 'इस किश्त के बाद शेष बकाया' : (lang === 'pa' ? 'ਇਸ ਕਿਸ਼ਤ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਰਕਮ' : 'Balance Left After This Payment')}:
                  </div>
                  <div className="text-[10px] text-gray-400 font-normal">
                    {balanceAfterThis <= 0 
                      ? (lang === 'hi' ? 'खाता पूरा चुकता' : 'Fully Settled') 
                      : (lang === 'hi' ? 'ब्याज सहित कुल बाकी' : 'Total due including interest')}
                  </div>
                </div>
                <span className={`text-base sm:text-xl ${balanceAfterThis <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatRupee(balanceAfterThis)}
                </span>
              </div>

              {/* Mode & Date Details */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{lang === 'hi' ? 'माध्यम' : 'Mode'}</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {payment.mode === 'cash' ? (lang === 'hi' ? 'नकद (Cash)' : 'Cash') : 'UPI'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">{lang === 'hi' ? 'तारीख' : 'Date'}</span>
                  <span className="font-mono font-bold text-gray-900">{payment.date}</span>
                </div>
              </div>

              {/* Verification & Note */}
              <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">{lang === 'hi' ? 'पुष्टि स्थिति' : 'Verification'}:</span>
                <span className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
                  payment.confirmed === 1 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : (payment.confirmed === -1 
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-300')
                }`}>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>
                    {payment.confirmed === 1 
                      ? (lang === 'hi' ? 'दोनों पक्षों द्वारा स्वीकृत' : 'Confirmed by Both') 
                      : (payment.confirmed === -1 ? 'Disputed' : 'Pending Confirmation')}
                  </span>
                </span>
              </div>

              {payment.note && (
                <div className="flex justify-between items-center text-gray-700 font-medium pt-1 border-t border-gray-100">
                  <span className="text-gray-400 text-[11px]">{lang === 'hi' ? 'टिप्पणी' : 'Note'}:</span>
                  <span className="font-bold text-gray-800 truncate max-w-[200px]">{payment.note}</span>
                </div>
              )}
            </div>
          ) : (
            /* Complete Full Account Ledger Statement with All Payments History */
            <div className="space-y-2.5 relative z-10">
              {/* Account Summary Table */}
              <div className="my-2.5 bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-bahipaper-line shadow-xs space-y-1.5 text-xs sm:text-sm">
                <div className="text-[11px] font-black uppercase tracking-wider text-bahiteal-800 pb-1.5 border-b border-gray-200 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'बही-खाता हिसाब सारांश' : 'Ledger Account Summary'}</span>
                  <span className="text-gray-400 font-mono text-[10px]">INR (₹)</span>
                </div>

                <div className="flex justify-between items-center text-gray-700 font-medium">
                  <span>{t('receiptOriginal')}:</span>
                  <span className="font-bold text-gray-900">{formatRupee(loan.principal)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-700 font-medium">
                  <span>{t('receiptInterest')} ({loan.monthlyRate}%/mo):</span>
                  <span className="font-bold text-amber-700">+ {formatRupee(metrics.totalInterest)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-700 font-medium">
                  <span>{t('receiptRepaid')}:</span>
                  <span className="font-bold text-emerald-600">- {formatRupee(metrics.totalRepaid)}</span>
                </div>

                <div className="pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center font-black text-bahiteal-900">
                  <span className="text-xs sm:text-sm">{t('receiptRemaining')}:</span>
                  <span className={`text-base sm:text-lg ${metrics.remaining <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatRupee(metrics.remaining)}
                  </span>
                </div>
              </div>

              {/* All Payments Breakdown List */}
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-bahipaper-line shadow-xs">
                <div className="text-[11px] font-black uppercase tracking-wider text-bahiteal-800 pb-1.5 mb-1.5 border-b border-gray-200 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'सभी किस्तों का विवरण' : (lang === 'pa' ? 'ਸਾਰੀਆਂ ਕਿਸ਼ਤਾਂ ਦਾ ਵੇਰਵਾ' : 'All Installments Recorded')}</span>
                  <span className="text-xs font-bold bg-bahiteal-100 text-bahiteal-800 px-2 py-0.5 rounded-full">
                    {loan.payments ? loan.payments.length : 0}
                  </span>
                </div>

                {(!loan.payments || loan.payments.length === 0) ? (
                  <div className="text-center py-2 text-xs text-gray-500 font-bold">
                    {t('noPayments')}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {loan.payments.map((p, pIdx) => (
                      <div key={p.id || pIdx} className="flex items-center justify-between py-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-bahiteal-50 text-bahiteal-700 font-mono font-bold text-[9px] flex items-center justify-center shrink-0">
                            {pIdx + 1}
                          </span>
                          <span className="font-mono text-gray-600 font-semibold">{p.date}</span>
                          <span className="uppercase text-[9px] font-bold text-gray-600 px-1 py-0.2 rounded bg-gray-100">
                            {p.mode}
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-1.5">
                          <span className="font-black text-emerald-700 text-xs sm:text-sm">
                            {formatRupee(p.amount)}
                          </span>
                          <span className={`text-[10px] font-bold ${p.confirmed === 1 ? 'text-emerald-600' : 'text-amber-700'}`}>
                            {p.confirmed === 1 ? '✔' : '⏳'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Official Verification Stamp */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-gray-300 text-center relative z-10">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase border-2 shadow-xs ${
              payment
                ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                : (metrics.remaining <= 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                    : 'bg-bahiteal-50 text-bahiteal-800 border-bahiteal-600')
              }`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {payment 
                  ? (lang === 'hi' ? 'सत्यापित किस्त भुगतान' : 'Verified Installment Payment') 
                  : (metrics.remaining <= 0 ? t('cleared') : t('receiptConfirmed'))}
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls (Hidden during print) */}
        <div className="p-3.5 bg-gray-50 flex gap-2 no-print">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow transition active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareWhatsApp')}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 py-3 px-3 rounded-2xl bg-bahiteal-700 hover:bg-bahiteal-800 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow transition active:scale-98 disabled:opacity-75"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></span>
                <span>{lang === 'hi' ? 'फोटो बन रही है...' : (lang === 'pa' ? 'ਫੋਟੋ ਬਣ ਰਹੀ ਹੈ...' : 'Saving Photo...')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span>{lang === 'hi' ? 'फोटो डाउनलोड' : (lang === 'pa' ? 'ਫੋਟੋ ਡਾਊਨਲੋਡ' : 'Download Photo')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
