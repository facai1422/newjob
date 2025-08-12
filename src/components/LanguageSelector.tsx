import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'km', name: 'ខ្មែរ' },
  { code: 'ar', name: 'العربية' },
  { code: 'ja', name: '日本語' }
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative z-[100]">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <Globe className="h-5 w-5" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={() => setIsOpen(false)}
          />
          {/* Themed dropdown matching site style */}
          <div className="absolute left-0 mt-2 min-w-[11rem] rounded-xl border border-white/10 bg-zinc-950/85 backdrop-blur-md shadow-2xl py-2 z-[60]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}