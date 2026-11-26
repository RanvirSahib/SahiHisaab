import { LogOut, Volume2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '../translations';

export default function Header({
  lang,
  setLang,
  currentUser,
  onLogout,
  isSpeaking,
  onStopSpeech
}) {
  const t = (key) => getTranslation(lang, key);

  return (
    <header className="sticky top-0 z-30 bg-bahiteal-700 text-white scallop-border shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

        {/* Official Brand Logo without background */}
        <div className="flex items-center cursor-pointer select-none">
          <img 
            src="/logo/horizontalwebsiteheader_Without_Background.png" 
            alt="SahiHisaab - सही हिसाब" 
            className="h-8 sm:h-10 w-auto max-w-[150px] sm:max-w-[200px] object-contain drop-shadow-sm" 
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Speaking indicator */}
          {isSpeaking && (
            <button
              onClick={onStopSpeech}
              title={t('stopListen')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold animate-pulse hover:bg-red-700 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden xs:inline">{t('stopListen')}</span>
            </button>
          )}

          {/* Custom Handcrafted Language Selector */}
          <LanguageSelector currentLang={lang} onSelectLang={setLang} />

          {/* User badge & Quick Switch */}
          {currentUser && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onLogout}
                title={t('logout')}
                className="w-10 h-10 rounded-full border border-white/30 hover:bg-white/10 flex items-center justify-center text-white transition active:scale-95"
                aria-label={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
