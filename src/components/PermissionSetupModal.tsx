import React, { useState } from 'react';
import { X, Heart, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PermissionStatus } from '../services/PermissionsService';

interface PermissionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAll: (onProgress: (permission: keyof PermissionStatus, granted: boolean) => void) => Promise<PermissionStatus>;
  currentStatus: PermissionStatus;
  isRequesting: boolean;
  onPermissionsGranted?: () => void;
}

export function PermissionSetupModal({
  isOpen,
  onClose,
  onRequestAll,
  currentStatus,
  isRequesting,
  onPermissionsGranted,
}: PermissionSetupModalProps) {
  const { t } = useTranslation();
  const [requestStatus, setRequestStatus] = useState<PermissionStatus>(currentStatus);

  const PERMISSION_INFO = {
    healthRead: {
      icon: Heart,
      title: t('permissions.heart_rate_title'),
      description: t('permissions.heart_rate_description'),
      color: 'red',
    },
  } as const;

  if (!isOpen) return null;

  const handleRequestAll = async () => {
    try {
      const status = await onRequestAll((permission, granted) => {
        setRequestStatus(prev => ({ ...prev, [permission]: granted }));
      });
      
      // Если критичные разрешения получены, закрываем модалку и показываем Watch prompt
      // healthWrite не проверяем - capacitor-health не установлен
      if (status.healthRead) {
        setTimeout(() => {
          onClose();
          onPermissionsGranted?.();
        }, 500);
      }
    } catch (error) {
      console.error('[PermissionSetupModal] Error requesting permissions:', error);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'green':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      {/* Modal */}
      <div className="max-w-md w-full h-auto max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-3rem)] rounded-2xl border border-border/15 relative flex flex-col bg-bg text-text-primary">
        {/* Header */}
        <div className="sticky top-0 z-10 pt-6 px-6 sm:pt-8 sm:px-8 pb-4 rounded-t-2xl bg-bg">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full transition-all hover:bg-border/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-light mb-2">🔐 {t('permissions.modal_title')}</h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              {t('permissions.modal_description')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-4 mt-4">
            {/* Heart Rate */}
            {PERMISSION_INFO.healthRead && (
              <PermissionCard
                icon={PERMISSION_INFO.healthRead.icon}
                title={PERMISSION_INFO.healthRead.title}
                description={PERMISSION_INFO.healthRead.description}
                color={PERMISSION_INFO.healthRead.color}
                granted={requestStatus.healthRead}
                colorClasses={getColorClasses(PERMISSION_INFO.healthRead.color)}
              />
            )}

            {/* Buttons */}
            <div className="pt-4 space-y-3">
              {/* Grant all permissions button */}
              <button
                onClick={handleRequestAll}
                disabled={isRequesting}
                className="w-full bg-green-500/20 hover:bg-green-500/30 disabled:bg-green-500/10 text-green-400 disabled:text-green-400/50 font-medium py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRequesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                    {t('permissions.requesting')}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t('permissions.grant_all')}
                  </>
                )}
              </button>

              {/* Setup later button */}
              <button
                onClick={onClose}
                className="w-full bg-surface-2 hover:opacity-80 text-text-secondary hover:text-text-primary font-medium py-3 px-6 rounded-xl transition-all"
              >
                {t('permissions.setup_later')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PermissionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  granted: boolean;
  colorClasses: string;
}

function PermissionCard({ icon: Icon, title, description, granted, colorClasses }: PermissionCardProps) {
  return (
    <div className={`border rounded-xl p-4 transition-all ${
      granted
        ? 'bg-green-500/10 border-green-500/30'
        : 'bg-surface-2 border-border/10'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${granted ? 'text-green-400' : 'text-text-secondary'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 ${granted ? 'text-green-400' : 'text-text-primary'}`}>
            {title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0">
          {granted ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 bg-border/10 rounded-full border border-border/20" />
          )}
        </div>
      </div>
    </div>
  );
}
