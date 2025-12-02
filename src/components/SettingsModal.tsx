import React, { useState } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';

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
        </div>
      </div>
    </div>
  );
};
