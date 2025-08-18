import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'km', name: 'ខ្មែរ' },
  { code: 'ar', name: 'العربية' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' }
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState<'left' | 'right'>('left');

  // 检测下拉框位置，防止溢出屏幕
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 176; // min-w-[11rem] = 176px
      const screenWidth = window.innerWidth;
      const rightSpace = screenWidth - buttonRect.right;
      
      // 如果右侧空间不足，则显示在左侧
      if (rightSpace < dropdownWidth) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('left');
      }
    }
  }, [isOpen]);

  return (
    <div className="relative z-[100]">
      <button
        ref={buttonRef}
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
          {/* 智能定位的下拉框 - 防止移动端溢出 */}
          <div 
            className={`absolute mt-2 rounded-xl border border-white/10 bg-zinc-950/85 backdrop-blur-md shadow-2xl py-2 z-[60] ${
              dropdownPosition === 'left' 
                ? 'left-0' 
                : 'right-0'
            } ${
              // 响应式宽度：在小屏幕上使用更小的宽度
              'w-40 xs:w-44 sm:w-48 max-w-[12rem]'
            }`}
          >
            <div className="max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    language === lang.code
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate block">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}