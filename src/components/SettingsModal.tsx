import React, { useEffect, useState } from 'react';
import { X, Save, User as UserIcon, Activity, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
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

interface SettingsModalProps {
  user: any;
  profile: UserProfile | null;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  isLightTheme: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  profile,
  onClose,
  onProfileUpdate,
  isLightTheme,
}) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [dailyEnabled, setDailyEnabled] = useState<boolean>(() => getDailyEnabled());
  const [dailyTime, setDailyTime] = useState<string>(() => getDailyTime());
  const [streakEnabled, setStreakEnabled] = useState<boolean>(() => getStreakEnabled());
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

  // Hide Vitals Diagnostics in production unless debug mode is enabled
  const isProduction = import.meta.env.PROD;
  const debugModeEnabled = typeof window !== 'undefined' && localStorage.getItem('debugMode') === 'true';
  const showDiagnosticsButton = !isProduction || debugModeEnabled;

  const handleSave = async () => {
    if (!user) return;

    if (!displayName.trim()) {
      setError(t('settings.name_required'));
      return;
    }

    if (displayName.length > 30) {
      setError(t('settings.name_too_long'));
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({ 
          id: user.id,
          display_name: displayName.trim()
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onProfileUpdate(data);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || t('settings.save_error'));
    } finally {
      setIsSaving(false);
    }
  };

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
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
            {t('settings.customize_profile')}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm mb-2 ${
                isLightTheme ? 'text-gray-700' : 'text-white/80'
              }`}
            >
              {t('settings.your_name')}
            </label>
            <div className="relative">
              <UserIcon
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isLightTheme ? 'text-gray-400' : 'text-white/40'
                }`}
              />
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                maxLength={30}
                placeholder={t('settings.enter_name')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  isLightTheme
                    ? 'bg-gray-100 border-gray-300 focus:ring-gray-400 text-gray-900'
                    : 'bg-white/10 border-white/20 focus:ring-purple-500/50 text-white placeholder-white/40'
                }`}
                data-testid="input-display-name"
              />
            </div>
            <p
              className={`text-xs mt-1 ${
                isLightTheme ? 'text-gray-500' : 'text-white/50'
              }`}
            >
              {displayName.length}/30 {t('settings.characters')}
            </p>
          </div>

          {error && (
            <div
              className={`text-sm p-3 rounded-lg ${
                isLightTheme
                  ? 'bg-red-100 text-red-700'
                  : 'bg-red-500/20 text-red-400'
              }`}
              data-testid="text-settings-error"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={`text-sm p-3 rounded-lg ${
                isLightTheme
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-500/20 text-green-400'
              }`}
              data-testid="text-settings-success"
            >
              {t('settings.name_updated')}
            </div>
          )}

          <div>
            <button
              onClick={handleSave}
              disabled={isSaving || !displayName.trim()}
              className={`w-full py-3 sm:py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-sm sm:text-base ${
                isLightTheme
                  ? 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50'
              } ${isSaving || !displayName.trim() ? 'cursor-not-allowed' : ''}`}
              data-testid="button-save-settings"
            >
              <Save className="w-5 h-5" />
              {isSaving ? `${t('settings.saving')}...` : t('settings.save')}
            </button>

            <div
              className={`mt-3 p-4 rounded-lg ${
                isLightTheme ? 'bg-gray-100' : 'bg-white/5'
              }`}
            >
              <p
                className={`text-xs ${
                  isLightTheme ? 'text-gray-600' : 'text-white/60'
                }`}
              >
                {t('settings.name_info')}
              </p>
            </div>
          </div>

          {/* Reminders — local notifications (Sprint 1) */}
          <div className="pt-4 border-t border-white/10">
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

              {permDenied && (
                <div className={`text-xs p-2 rounded-lg ${isLightTheme ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/10 text-amber-300'}`}>
                  {t('settings.reminders_permission_denied', 'Notifications are off. Enable them in iOS Settings → Notifications → ONDA.')}
                </div>
              )}
            </div>
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
