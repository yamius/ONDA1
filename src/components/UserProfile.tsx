import React, { useState } from 'react';
import { User, LogOut, X } from 'lucide-react';
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
      </div>
    </div>
  );
};
