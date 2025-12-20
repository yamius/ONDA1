import React, { useState } from 'react';
import { X, Heart, Mic, Check } from 'lucide-react';
import { PermissionStatus } from '../services/PermissionsService';

interface PermissionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAll: (onProgress: (permission: keyof PermissionStatus, granted: boolean) => void) => Promise<PermissionStatus>;
  currentStatus: PermissionStatus;
  isRequesting: boolean;
  onPermissionsGranted?: () => void;
}

const PERMISSION_INFO = {
  microphone: {
    icon: Mic,
    title: 'Микрофон',
    description: 'Когда вы желаете пройти Эмоциональную сверку мы будем записывать ваш голос',
    color: 'blue',
  },
  healthRead: {
    icon: Heart,
    title: 'Пульс',
    description: 'Чтобы видеть ваш прогресс во время практик мы наблюдаем за вашим пульсом',
    color: 'red',
  },
} as const;

export function PermissionSetupModal({
  isOpen,
  onClose,
  onRequestAll,
  currentStatus,
  isRequesting,
  onPermissionsGranted,
}: PermissionSetupModalProps) {
  const [requestStatus, setRequestStatus] = useState<PermissionStatus>(currentStatus);

  if (!isOpen) return null;

  const handleRequestAll = async () => {
    try {
      const status = await onRequestAll((permission, granted) => {
        setRequestStatus(prev => ({ ...prev, [permission]: granted }));
      });
      
      // Если критичные разрешения получены, закрываем модалку и показываем Watch prompt
      if (status.microphone && status.healthRead) {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-sm border-b border-white/10 p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-light text-white mb-1">🔐 Настройка ONDA</h2>
              <p className="text-sm text-gray-400">
                Для полноценной работы приложения необходимо предоставить доступ:
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Microphone - ПЕРВЫЙ (проще!) */}
          {PERMISSION_INFO.microphone && (
            <PermissionCard
              icon={PERMISSION_INFO.microphone.icon}
              title={PERMISSION_INFO.microphone.title}
              description={PERMISSION_INFO.microphone.description}
              color={PERMISSION_INFO.microphone.color}
              granted={requestStatus.microphone}
              colorClasses={getColorClasses(PERMISSION_INFO.microphone.color)}
            />
          )}

          {/* Health Read - ВТОРОЙ */}
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
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-sm border-t border-white/10 p-6 pt-4 space-y-3">
          {/* Кнопка "Предоставить все разрешения" */}
          <button
            onClick={handleRequestAll}
            disabled={isRequesting}
            className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 hover:border-white/30 text-white font-medium py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? 'Запрашиваем разрешения...' : 'Предоставить все разрешения'}
          </button>

          {/* Кнопка "Настроить позже" - такая же по размеру */}
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium py-4 rounded-xl transition-all"
          >
            Настроить позже
          </button>
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
    <div className={`border rounded-xl p-4 transition-all ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {granted ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 bg-white/10 rounded-full border border-white/20" />
          )}
        </div>
      </div>
    </div>
  );
}
