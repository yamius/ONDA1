import React, { useEffect, useState } from 'react';
import { X, Activity, Bell, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { VitalsDiagnostics } from './VitalsDiagnostics';
import {
  checkPermission,
  requestPermission,
  getDailyEnabled,
  getDailyTime,
  scheduleDailyReminder,
  disableDailyReminder,
  getStreakEnabled,
  setStreakEnabled as setStreakEnabledSvc,
} from '../services/notifications';
import { getMarketingOptIn, setMarketingOptIn } from '../services/pushNotifications';

interface SettingsModalProps {
  onClose: () => void;
  isLightTheme: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  isLightTheme,
}) => {
  const { t } = useTranslation();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [dailyEnabled, setDailyEnabled] = useState<boolean>(() => getDailyEnabled());
  const [dailyTime, setDailyTime] = useState<string>(() => getDailyTime());
  const [streakEnabled, setStreakEnabled] = useState<boolean>(() => getStreakEnabled());
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(() => getMarketingOptIn());
  const [permDenied, setPermDenied] = useState(false);

  useEffect(() => {
    checkPermission().then((p) => {
      if (p === 'denied') setPermDenied(true);
    });
  }, []);

  const handleDailyToggle = async (next: boolean) => {
    if (next) {
      const perm = await requestPermission();
      if (perm !== 'granted') {
        setPermDenied(perm === 'denied');
        setDailyEnabled(false);
        return;
      }
      setPermDenied(false);
      setDailyEnabled(true);
      await scheduleDailyReminder(dailyTime);
    } else {
      setDailyEnabled(false);
      await disableDailyReminder();
    }
  };

  const handleDailyTimeChange = async (next: string) => {
    setDailyTime(next);
    if (dailyEnabled) await scheduleDailyReminder(next);
  };

  const handleStreakToggle = async (next: boolean) => {
    if (next) {
      const perm = await requestPermission();
      if (perm !== 'granted') {
        setPermDenied(perm === 'denied');
        setStreakEnabled(false);
        return;
      }
      setPermDenied(false);
    }
    setStreakEnabled(next);
    await setStreakEnabledSvc(next);
  };

  // Marketing (OneSignal-side tag). Does NOT request a separate iOS
  // permission — uses the same base notification permission. The toggle
  // just flips a server-side tag that the Edge Function checks before
  // sending anything promotional. Apple compliance: default OFF.
  const handleMarketingToggle = async (next: boolean) => {
    if (next) {
      const perm = await requestPermission();
      if (perm !== 'granted') {
        setPermDenied(perm === 'denied');
        setMarketingEnabled(false);
        return;
      }
      setPermDenied(false);
    }
    setMarketingEnabled(next);
    setMarketingOptIn(next);
  };

  // Hide Vitals Diagnostics in production unless debug mode is enabled
  const isProduction = import.meta.env.PROD;
  const debugModeEnabled = typeof window !== 'undefined' && localStorage.getItem('debugMode') === 'true';
  const showDiagnosticsButton = !isProduction || debugModeEnabled;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className={`max-w-md w-full rounded-2xl border p-6 sm:p-8 relative ${
          isLightTheme
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-gray-900 to-black border-purple-500/30'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-white/10'
          }`}
          data-testid="button-close-settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-light mb-2">{t('auth.settings')}</h2>
        </div>

        <div className="space-y-6">
          {/* Reminders — local notifications (Sprint 1) */}
          <div className="pt-2">
            <div className={`flex items-center gap-2 mb-3 ${isLightTheme ? 'text-gray-700' : 'text-white/80'}`}>
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{t('settings.reminders_section', 'Reminders')}</span>
            </div>

            <div className={`p-3 rounded-xl ${isLightTheme ? 'bg-gray-100' : 'bg-white/5'} space-y-3`}>
              {/* Daily reminder */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isLightTheme ? 'text-gray-800' : 'text-white/90'}`}>
                    {t('settings.daily_reminder', 'Daily practice reminder')}
                  </div>
                  {dailyEnabled && (
                    <input
                      type="time"
                      value={dailyTime}
                      onChange={(e) => handleDailyTimeChange(e.target.value)}
                      className={`mt-2 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                        isLightTheme
                          ? 'bg-white border border-gray-300 text-gray-900 focus:ring-gray-400'
                          : 'bg-white/10 border border-white/20 text-white focus:ring-purple-500/50'
                      }`}
                      data-testid="input-daily-reminder-time"
                    />
                  )}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dailyEnabled}
                  onClick={() => handleDailyToggle(!dailyEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    dailyEnabled
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : isLightTheme
                        ? 'bg-gray-300'
                        : 'bg-white/20'
                  }`}
                  data-testid="toggle-daily-reminder"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dailyEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Streak reminder */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isLightTheme ? 'text-gray-800' : 'text-white/90'}`}>
                    {t('settings.streak_reminder', 'Streak protection')}
                  </div>
                  <div className={`text-xs mt-0.5 ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                    {t('settings.streak_reminder_hint', 'Evening nudge at 20:00 when today\'s practice is missing.')}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={streakEnabled}
                  onClick={() => handleStreakToggle(!streakEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    streakEnabled
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : isLightTheme
                        ? 'bg-gray-300'
                        : 'bg-white/20'
                  }`}
                  data-testid="toggle-streak-reminder"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      streakEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Promotional / marketing — OneSignal tag. Default OFF (Apple compliance). */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isLightTheme ? 'text-gray-800' : 'text-white/90'}`}>
                    {t('settings.promotional_reminder', 'Promotional notifications')}
                  </div>
                  <div className={`text-xs mt-0.5 ${isLightTheme ? 'text-gray-500' : 'text-white/50'}`}>
                    {t('settings.promotional_reminder_hint', 'News, updates, and special offers from ONDA.')}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketingEnabled}
                  onClick={() => handleMarketingToggle(!marketingEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    marketingEnabled
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : isLightTheme
                        ? 'bg-gray-300'
                        : 'bg-white/20'
                  }`}
                  data-testid="toggle-promotional-reminder"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      marketingEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {permDenied && (
                <div className={`text-xs p-2 rounded-lg ${isLightTheme ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/10 text-amber-300'}`}>
                  {t('settings.reminders_permission_denied', 'Notifications are off. Enable them in iOS Settings → Notifications → ONDA.')}
                </div>
              )}
            </div>
          </div>

          {/* Contact developers — simple mailto with diagnostics pre-filled */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                const subject = encodeURIComponent(t('settings.contact_subject', 'ONDA — Feedback'));
                const version = import.meta.env.VITE_BUILD_NUMBER || '';
                const platform = Capacitor.getPlatform();
                const lang = (typeof navigator !== 'undefined' && navigator.language) || 'unknown';
                const diag = `\n\n---\nApp: ONDA\nPlatform: ${platform}\nBuild: ${version}\nLocale: ${lang}`;
                const body = encodeURIComponent(t('settings.contact_body_hint', 'Hi ONDA team,') + diag);
                window.location.href = `mailto:hello@onda-life.com?subject=${subject}&body=${body}`;
              }}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                isLightTheme
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
              data-testid="button-contact-developers"
            >
              <Mail className="w-4 h-4" />
              {t('settings.contact_developers', 'Write to developers')}
            </button>
          </div>

          {/* Diagnostics Button - Hidden in production for App Store compliance */}
          {showDiagnosticsButton && (
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setShowDiagnostics(true)}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                  isLightTheme
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
                data-testid="button-open-diagnostics"
              >
                <Activity className="w-4 h-4" />
                Vitals Diagnostics
              </button>
            </div>
          )}
        </div>
      </div>

      {showDiagnostics && (
        <VitalsDiagnostics 
          onClose={() => setShowDiagnostics(false)} 
          isLightTheme={isLightTheme}
        />
      )}
    </div>
  );
};
