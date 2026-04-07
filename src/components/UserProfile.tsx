import React, { useState } from 'react';
import { User, LogOut, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import type { UserProfile as UserProfileType } from '../lib/supabase';

interface UserProfileProps {
  user: any;
  profile: UserProfileType | null;
  onClose: () => void;
  isLightTheme: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, profile, onClose, isLightTheme }) => {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      <div
        className={`max-w-md w-full rounded-2xl border p-6 sm:p-8 relative my-4 ${
          isLightTheme
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-gray-900 to-black border-purple-500/30'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            isLightTheme
              ? 'hover:bg-gray-200'
              : 'hover:bg-white/10'
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
          <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'} break-all px-4`}>
            {user.email}
          </p>
        </div>

        <div className={`rounded-xl p-4 mb-6 ${
          isLightTheme ? 'bg-gray-100' : 'bg-white/5'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
              {t('auth.account_created')}
            </span>
            <span className="text-sm font-medium">
              {new Date(profile?.created_at || user.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
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
            isLightTheme
              ? 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400'
          } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? `${t('auth.sign_out')}...` : t('auth.sign_out')}
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={`w-full mt-3 py-2 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
            isLightTheme
              ? 'text-gray-400 hover:text-red-500'
              : 'text-white/30 hover:text-red-400'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {t('auth.delete_account', 'Delete Account')}
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className={`max-w-sm w-full rounded-2xl p-6 ${
            isLightTheme ? 'bg-white' : 'bg-gray-900 border border-red-500/30'
          }`}>
            <h3 className={`text-lg font-bold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {t('auth.delete_confirm_title', 'Delete Account?')}
            </h3>
            <p className={`text-sm mb-6 ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
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
                  isLightTheme
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-white/10 hover:bg-white/20 text-white'
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
