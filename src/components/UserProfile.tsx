import React, { useState } from 'react';
import { User, LogOut, Trash2, X, Save, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile as UserProfileType } from '../lib/supabase';

interface UserProfileProps {
  user: any;
  profile: UserProfileType | null;
  onClose: () => void;
  /** Устаревший проп — тема теперь через ThemeProvider. Не используется. */
  isLightTheme?: boolean;
  // Bubbles the updated profile up so the parent can refresh its cached
  // userProfile state (used by leaderboard / greeting).
  onProfileUpdate?: (profile: UserProfileType) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, profile, onClose, onProfileUpdate }) => {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);

  const handleSaveName = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      setNameError(t('settings.name_required'));
      return;
    }
    if (displayName.length > 30) {
      setNameError(t('settings.name_too_long'));
      return;
    }
    setNameError('');
    setIsSavingName(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({ id: user.id, display_name: displayName.trim() })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        onProfileUpdate?.(data);
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 1800);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setNameError(err.message || t('settings.save_error'));
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Ошибка при выходе из аккаунта');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await supabase.auth.signOut();
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setDeleteError(error.message || t('auth.delete_error', 'Failed to delete account'));
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full rounded-2xl border border-border/15 p-6 sm:p-8 relative my-4 bg-bg text-text-primary">
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            'hover:bg-border/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-light mb-1">
            {profile?.display_name || 'Пользователь'}
          </h2>
          <p className={`text-xs sm:text-sm ${'text-text-secondary'} break-all px-4`}>
            {user.email}
          </p>
        </div>

        {/* Display name editor */}
        <div className="mb-4">
          <label className={`block text-sm mb-2 ${'text-text-primary/80'}`}>
            {t('settings.your_name')}
          </label>
          <div className="relative">
            <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${'text-text-muted'}`} />
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setNameError(''); setNameSuccess(false); }}
              maxLength={30}
              placeholder={t('settings.enter_name')}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                'bg-surface border border-border/20 focus:ring-accent/50 text-text-primary placeholder-text-muted'
              }`}
            />
          </div>
          <p className={`text-xs mt-1 ${'text-text-muted'}`}>
            {displayName.length}/30 {t('settings.characters')}
          </p>

          {nameError && (
            <div className={`text-sm p-2 mt-2 rounded-lg ${'bg-red-500/15 text-red-400'}`}>
              {nameError}
            </div>
          )}
          {nameSuccess && (
            <div className={`text-sm p-2 mt-2 rounded-lg ${'bg-green-500/15 text-green-400'}`}>
              {t('settings.name_updated')}
            </div>
          )}

          <button
            onClick={handleSaveName}
            disabled={isSavingName || !displayName.trim() || displayName === (profile?.display_name || '')}
            className={`w-full mt-3 py-2.5 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
              'bg-accent hover:opacity-90 text-white disabled:opacity-50'
            } ${isSavingName || !displayName.trim() ? 'cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4" />
            {isSavingName ? `${t('settings.saving')}...` : t('settings.save')}
          </button>
        </div>

        <div className={`rounded-xl p-4 mb-6 ${
          'bg-surface-2'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${'text-text-secondary'}`}>
              {t('auth.account_created')}
            </span>
            <span className="text-sm font-medium">
              {new Date(profile?.created_at || user.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${'text-text-secondary'}`}>
              {t('auth.provider')}
            </span>
            <span className="text-sm font-medium capitalize">
              {user.app_metadata.provider || 'email'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className={`w-full py-3 sm:py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-sm sm:text-base ${
            'bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400'
          } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? `${t('auth.sign_out')}...` : t('auth.sign_out')}
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={`w-full mt-3 py-2 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
            'text-text-muted hover:text-red-400'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {t('auth.delete_account', 'Delete Account')}
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className={`max-w-sm w-full rounded-2xl p-6 ${
            'bg-bg border border-red-500/30'
          }`}>
            <h3 className={`text-lg font-bold mb-2 ${'text-text-primary'}`}>
              {t('auth.delete_confirm_title', 'Delete Account?')}
            </h3>
            <p className={`text-sm mb-6 ${'text-text-secondary'}`}>
              {t('auth.delete_confirm_message', 'This will permanently delete your account and all associated data. This action cannot be undone.')}
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm text-center">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                disabled={isDeleting}
                className={`flex-1 py-3 rounded-xl font-medium text-sm ${
                  'bg-surface-2 hover:opacity-80 text-text-primary'
                }`}
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`flex-1 py-3 rounded-xl font-medium text-sm bg-red-600 hover:bg-red-700 text-white ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting
                  ? t('auth.deleting', 'Deleting...')
                  : t('auth.delete_confirm', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
