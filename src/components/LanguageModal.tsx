import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { i18n, t } = useTranslation();
  const isLight = useTheme().resolved === 'light';

  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl p-6 max-w-md w-full shadow-2xl border ${
          isLight
            ? 'bg-gradient-to-br from-white via-indigo-50 to-violet-50 border-violet-200'
            : 'bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {t('language_select', 'Select Language')}
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
            data-testid="button-close-language-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Список языков */}
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                i18n.language === lang.code
                  ? isLight
                    ? 'bg-indigo-500/25 border-indigo-400/60 text-slate-800'
                    : 'bg-purple-600/40 border-purple-400/50 text-white'
                  : isLight
                    ? 'bg-indigo-500/15 border-indigo-400/40 text-slate-800 hover:bg-indigo-500/25'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
              data-testid={`button-language-${lang.code}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{lang.nativeName}</div>
                  <div className="text-sm text-gray-400">{lang.name}</div>
                </div>
                {i18n.language === lang.code && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
