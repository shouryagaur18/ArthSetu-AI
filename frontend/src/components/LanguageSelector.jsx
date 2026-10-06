import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGE_OPTIONS } from '../utils/translations';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

export default function LanguageSelector({ variant = 'dropdown', className = '' }) {
  const { lang, toggleLang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === lang) || LANGUAGE_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    toggleLang(code);
    setIsOpen(false);
  };

  if (variant === 'tabs') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" /> Select Website Language (एक समय में एक भाषा)
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Key terms preserved in English/Hinglish</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = opt.code === lang;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{opt.flag}</span>
                <span>{opt.nativeName}</span>
                {active && <Check className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 text-xs font-bold border border-slate-200/90 transition-all cursor-pointer shadow-2xs"
        title="Select Website Language"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span className="text-sm">{currentLangObj.flag}</span>
        <span className="font-bold text-slate-900">{currentLangObj.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options Box */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-indigo-700">
              <Sparkles className="w-3 h-3 text-indigo-600" /> Website Language
            </span>
            <span className="text-[10px] text-slate-400 font-normal">10 Languages</span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = opt.code === lang;
              return (
                <button
                  key={opt.code}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <div>
                      <span className="block text-slate-900 font-bold leading-tight">{opt.nativeName}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{opt.name}</span>
                    </div>
                  </div>

                  {active && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 mt-1 border-t border-slate-100 bg-slate-50/70 rounded-b-xl text-[10px] text-slate-500 font-medium">
            💡 Technical keywords (PMEGP, NSFDC, EMI, NPA) are preserved in English.
          </div>
        </div>
      )}
    </div>
  );
}
