import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../translations';

export default function LanguageSelector({ currentLang, onSelectLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const active = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* Clean, Simple Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-bahiteal-900 hover:bg-bahiteal-50 font-extrabold text-sm shadow-sm transition active:scale-95 border border-white/40 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-bahiteal-700" />
        <span className="tracking-wide">{active.label}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-bahiteal-700' : ''
          }`} 
        />
      </button>

      {/* Sleek, Minimal, High-End Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl shadow-black/10 border border-slate-100 p-1.5 z-50 transition ease-out duration-150">
          <div className="space-y-1">
            {LANGUAGES.map((l) => {
              const isSelected = l.code === currentLang;

              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    if (onSelectLang) onSelectLang(l.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition text-left ${
                    isSelected
                      ? 'bg-bahiteal-700 text-white font-extrabold shadow-sm'
                      : 'text-gray-700 hover:bg-slate-50 font-bold active:bg-slate-100'
                  }`}
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base">{l.label}</span>
                    <span className={`text-[11px] ${
                      isSelected ? 'text-bahigold-300 font-semibold' : 'text-gray-400 font-normal'
                    }`}>
                      {l.sublabel}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-bahigold-400 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
