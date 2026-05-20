import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

interface PermissionWarningBannerProps {
  onSetupClick: () => void;
  className?: string;
}

export function PermissionWarningBanner({ onSetupClick, className = '' }: PermissionWarningBannerProps) {
  const { t } = useTranslation();
  const isLight = useTheme().resolved === 'light';

  return (
    <div className={`bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 ${className}`}>
      <div className="flex flex-col items-center text-center">
        <p className={`text-base mb-3 ${isLight ? 'text-sky-700' : 'text-amber-200/80'}`}>
          {t('permissions.description')}
        </p>
        <button
          onClick={onSetupClick}
          className={`px-4 py-2 rounded-lg text-base font-medium transition-all border ${
            isLight
              ? 'bg-amber-400/30 hover:bg-amber-400/40 border-amber-500/50 text-sky-800'
              : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-100'
          }`}
        >
          {t('permissions.setup_button')}
        </button>
      </div>
    </div>
  );
}
