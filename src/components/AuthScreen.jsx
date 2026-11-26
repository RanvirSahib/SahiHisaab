import { useState } from 'react';
import {
  Phone, ArrowRight, CheckCircle2, AlertCircle,
  BookOpen, Volume2, ShieldCheck, Store, User,
  Smartphone, Bell
} from 'lucide-react';
import { getTranslation } from '../translations';
import { sendSupabaseOtp, verifySupabaseOtp, isSupabaseConfigured } from '../utils/supabase';
import confetti from 'canvas-confetti';

export default function AuthScreen({ lang, onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']); // support up to 6 digits for Supabase SMS
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabaseActive = isSupabaseConfigured();

  const t = (key) => getTranslation(lang, key);

  const handleSendOtp = async (num) => {
    const target = num || phoneNumber;
    const clean = target.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर डालें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (supabaseActive) {
        const { error } = await sendSupabaseOtp(clean);
        if (error) {
          setErrorMsg(error.message || 'SMS OTP failed. Verify Supabase Twilio/SMS settings.');
          setIsLoading(false);
          return;
        }
      } else {
        const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
        setGeneratedOtp(randomOtp);
      }
      setPhoneNumber(clean);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpValue];
    updated[index] = digit;
    setOtpValue(updated);

    const maxIdx = supabaseActive ? 5 : 3;
    if (digit && index < maxIdx) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (digit && index === maxIdx && updated.slice(0, maxIdx + 1).every(d => d !== '')) {
      verifyOtp(updated.slice(0, maxIdx + 1).join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOtp = async (codeToVerify) => {
    const maxDigits = supabaseActive ? 6 : 4;
    const entered = codeToVerify || otpValue.slice(0, maxDigits).join('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (supabaseActive) {
        const { error } = await verifySupabaseOtp(phoneNumber, entered);
        if (error) {
          setErrorMsg(error.message || (lang === 'hi' ? 'गलत ओटीपी डाला है' : 'Invalid OTP code'));
          setOtpValue(['', '', '', '', '', '']);
          const first = document.getElementById('otp-0');
          if (first) first.focus();
          setIsLoading(false);
          return;
        }
      } else {
        if (entered !== generatedOtp && entered !== '1234') {
          setErrorMsg(lang === 'hi' ? 'गलत ओटीपी डाला है' : 'Invalid OTP code');
          setOtpValue(['', '', '', '', '', '']);
          const first = document.getElementById('otp-0');
          if (first) first.focus();
          setIsLoading(false);
          return;
        }
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      onLogin({
        phone: phoneNumber,
        name: phoneNumber === '9876543210' ? 'Harpreet General Store' : (phoneNumber === '9123456780' ? 'Ramesh Kumar' : `User (${phoneNumber.slice(-4)})`)
      });
    } catch (err) {
      setErrorMsg(err.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant one-click demo login
  const handleQuickDemo = (demoPhone, demoName) => {
    setPhoneNumber(demoPhone);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 }
    });
    onLogin({
      phone: demoPhone,
      name: demoName
    });
  };

  return (
    <div className="max-w-md mx-auto pt-2 pb-10 px-1 sm:px-4">
      {/* Official Stacked Brand Logo (Without Background) */}
      <div className="text-center py-4 sm:py-5 px-3 sm:px-4 rounded-3xl bg-bahiteal-700 text-white shadow-bahi relative overflow-hidden mb-5 flex items-center justify-center">
        <img
          src="/logo/stackedlogo_withoutbackground.png"
          alt="SahiHisaab - सही हिसाब"
          className="w-auto h-28 sm:h-36 max-w-[280px] sm:max-w-[320px] object-contain drop-shadow-md"
        />
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-bahi border-2 border-bahiteal-100">
        {step === 'phone' ? (
          <div>
            <label className="block text-bahiteal-900 font-extrabold text-base sm:text-lg mb-2">
              {t('phone')}
            </label>

            {/* Seamless Phone Input Container */}
            <div className="flex items-center rounded-2xl border-2 border-bahiteal-700 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-bahiteal-200 mb-4 transition shadow-sm">
              <div className="flex items-center px-4 py-3.5 bg-bahiteal-50 border-r-2 border-bahiteal-200 select-none shrink-0">
                <span className="font-extrabold text-bahiteal-900 text-base sm:text-lg">
                  +91
                </span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                className="flex-1 min-w-0 bg-transparent text-lg sm:text-xl font-bold tracking-normal pl-4 pr-3 py-3 outline-none text-bahiteal-900 placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {errorMsg && (
              <div className="text-red-600 font-bold text-sm mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={() => handleSendOtp()}
              className="w-full min-h-[54px] sm:min-h-[58px] rounded-full bg-bahigold-500 hover:bg-bahigold-400 active:scale-98 text-bahiteal-900 font-extrabold text-lg sm:text-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{t('getOtp')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-0.5">
              {lang === 'hi' ? 'ओटीपी भेजा गया:' : 'OTP sent to:'}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-bahiteal-900 mb-4">
              +91 {phoneNumber}
            </div>

            {/* Supabase SMS or Demo OTP Banner */}
            {supabaseActive ? (
              <div className="bg-bahiteal-50 border border-bahiteal-200 rounded-2xl p-2.5 sm:p-3 text-center mb-4">
                <div className="text-xs font-bold text-bahiteal-800 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'hi' ? 'आपके फोन पर एसएमएस द्वारा ओटीपी भेजा गया है' : 'Real SMS OTP sent to your phone'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-bahigold-300/40 border border-bahigold-500 rounded-2xl p-2.5 sm:p-3 text-center mb-4">
                <div className="text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t('demoOtp')}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-bahiteal-900 tracking-widest mt-0.5">
                  {generatedOtp}
                </div>
              </div>
            )}

            <label className="block text-bahiteal-900 font-extrabold text-base sm:text-lg mb-2 text-center">
              {t('enterOtp')}
            </label>
            <div className="flex justify-center gap-1.5 sm:gap-2.5 mb-5 max-w-full">
              {(supabaseActive ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]).map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpValue[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`${supabaseActive ? 'w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl' : 'w-12 h-14 sm:w-14 sm:h-16 text-2xl sm:text-3xl'} text-center font-extrabold rounded-xl border-2 border-bahiteal-700 focus:ring-4 focus:ring-bahiteal-200 bg-bahipaper-ledger outline-none`}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="text-red-600 font-bold text-sm text-center mb-3 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={() => verifyOtp()}
              className="w-full min-h-[54px] sm:min-h-[58px] rounded-full bg-bahigold-500 hover:bg-bahigold-400 active:scale-98 text-bahiteal-900 font-extrabold text-lg sm:text-xl shadow-md transition flex items-center justify-center gap-2 mb-3"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{t('verifyAndLogin')}</span>
            </button>

            <button
              onClick={() => {
                setStep('phone');
                setOtpValue(['', '', '', '']);
                setErrorMsg('');
              }}
              className="w-full py-2 text-bahiteal-700 hover:underline font-bold text-sm sm:text-base text-center"
            >
              ← {t('changeNumber')}
            </button>
          </div>
        )}

        {/* Quick Demo Login Chips */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-bahipaper-line">
          <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3 text-center">
            {t('demoProfiles')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => handleQuickDemo('9876543210', 'Harpreet General Store')}
              className="flex-1 py-3 px-3 rounded-2xl bg-bahiteal-50 hover:bg-bahiteal-100 border-2 border-bahiteal-500/30 text-left transition flex items-center gap-2.5 active:scale-98"
            >
              <div className="w-10 h-10 rounded-full bg-bahiteal-700 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                <Store className="w-5 h-5 text-bahigold-300 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-bahiteal-700 font-bold">1-Click Login</div>
                <div className="font-extrabold text-sm text-bahiteal-900 truncate">
                  {t('lenderProfile')}
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo('9123456780', 'Ramesh Kumar')}
              className="flex-1 py-3 px-3 rounded-2xl bg-bahigold-50 hover:bg-bahigold-100 border-2 border-bahigold-500/40 text-left transition flex items-center gap-2.5 active:scale-98"
            >
              <div className="w-10 h-10 rounded-full bg-bahigold-400 text-bahiteal-900 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                <User className="w-5 h-5 text-bahiteal-900 stroke-[2.5]" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-bahigold-800 font-bold">1-Click Login</div>
                <div className="font-extrabold text-sm text-bahiteal-900 truncate">
                  {t('borrowerProfile')}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Simple, Attractive & Human Bahi-Khata Trust Bar */}
      <div className="mt-6 text-center">
        {/* Subtle Brand Motto */}
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-bahiteal-800/80 mb-2.5 flex items-center justify-center gap-2">
          <span className="w-5 h-[1.5px] bg-bahiteal-300/80 rounded-full"></span>
          <span>✦ {t('tagline')} ✦</span>
          <span className="w-5 h-[1.5px] bg-bahiteal-300/80 rounded-full"></span>
        </div>

        {/* 3 Clean Floating Badges - Exactly 1 Row on Mobile (No awkward 2+1 wrap) */}
        <div className="w-full max-w-sm mx-auto p-1 bg-white/95 backdrop-blur-xs rounded-2xl border border-bahiteal-200/80 shadow-xs mb-3">
          <div className="grid grid-cols-3 gap-1">
            <span className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1.5 rounded-xl bg-bahiteal-50/90 text-bahiteal-900 font-extrabold text-[11px] sm:text-xs">
              <BookOpen className="w-3.5 h-3.5 text-bahiteal-700 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('trustPillar1Title')}</span>
            </span>
            <span className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1.5 rounded-xl bg-amber-50/90 text-bahiteal-900 font-extrabold text-[11px] sm:text-xs">
              <Volume2 className="w-3.5 h-3.5 text-amber-700 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('trustPillar2Title')}</span>
            </span>
            <span className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2.5 py-1.5 rounded-xl bg-emerald-50/90 text-bahiteal-900 font-extrabold text-[11px] sm:text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.2] shrink-0" />
              <span className="truncate">{t('trustPillar3Title')}</span>
            </span>
          </div>
        </div>

        {/* Reassuring Mutual Consent Line */}
        <div className="text-[11px] sm:text-xs text-gray-600 font-bold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t('trustSafetyNote')}</span>
        </div>
      </div>
    </div>
  );
}
