import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PermissionWarningBannerProps {
  onSetupClick: () => void;
  className?: string;
}

export function PermissionWarningBanner({ onSetupClick, className = '' }: PermissionWarningBannerProps) {
  return (
    <div className={`bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-amber-100 font-medium mb-1">Настройте разрешения</h3>
          <p className="text-amber-200/80 text-sm mb-3">
            Для полноценной работы ONDA необходим доступ к микрофону, пульсу и данным о сне
          </p>
          <button
            onClick={onSetupClick}
            className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-100 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Настроить сейчас
          </button>
        </div>
      </div>
    </div>
  );
}
