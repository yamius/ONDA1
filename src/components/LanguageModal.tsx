import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { i18n, t } = useTranslation();

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
        className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t('settings.language') || 'Language'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                i18n.language === lang.code
                  ? 'bg-purple-600/40 border border-purple-400/50 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
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

        {/* Описание */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          {t('settings.languageDescription') || 'Select your preferred language'}
        </p>
      </div>
    </div>
  );
}
