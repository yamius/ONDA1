import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { requestPermission } from '../services/notifications';

interface NotificationPrimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGranted?: () => void;
}

/**
 * Standalone primer for the iOS Notifications permission.
 *
 * Why this exists separately from PermissionSetupModal:
 *  - HealthKit is for users who actively want Watch heart-rate tracking.
 *    They'll discover the orange 'Set Up Now' banner when they care.
 *  - Notifications are a retention tool — the only way to bring a user
 *    back who installed and forgot. So they get their own auto-shown,
 *    one-purpose primer right after ATT on first cold start.
 */
export function NotificationPrimerModal({ isOpen, onClose, onGranted }: NotificationPrimerModalProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setBusy(true);
    try {
      const result = await requestPermission();
      if (result === 'granted') onGranted?.();
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="max-w-md w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-black p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 p-2 rounded-full transition-all hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-500/20 border border-purple-400/40 mb-4">
            <Bell className="w-7 h-7 text-purple-300" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-light mb-3">
            {t('notification_primer.title', 'Stay in rhythm')}
          </h2>

          <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">
            {t(
              'notification_primer.body',
              "We'll send a gentle daily nudge so you don't lose your streak. You choose the time inside Settings — and you can turn it off anytime.",
            )}
          </p>

          <button
            onClick={handleAllow}
            disabled={busy}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            {busy
              ? t('notification_primer.requesting', 'Requesting...')
              : t('notification_primer.allow', 'Enable reminders')}
          </button>

          <button
            onClick={onClose}
            className="mt-3 text-sm text-white/50 hover:text-white/80 transition-all"
          >
            {t('notification_primer.skip', 'Maybe later')}
          </button>
        </div>
      </div>
    </div>
  );
}
