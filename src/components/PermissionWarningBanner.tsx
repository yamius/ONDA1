import React from 'react';
import { useTranslation } from 'react-i18next';

interface PermissionWarningBannerProps {
  onSetupClick: () => void;
  className?: string;
}

export function PermissionWarningBanner({ onSetupClick, className = '' }: PermissionWarningBannerProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 ${className}`}>
      <div className="flex flex-col items-center text-center">
        <p className="text-amber-200/80 text-sm mb-3">
          {t('permissions.description')}
        </p>
        <button
          onClick={onSetupClick}
          className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-100 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          {t('permissions.setup_button')}
        </button>
      </div>
    </div>
  );
}
