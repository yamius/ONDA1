import { supabase } from './supabase';

/**
 * Обработчик OAuth callback от Android deep link
 * Эта функция вызывается из MainActivity.kt после успешной OAuth авторизации
 */
export async function handleOAuthCallback(accessToken: string, refreshToken: string): Promise<void> {
  console.log('[OAuth] handleOAuthCallback called with tokens');
  
  try {
    // Устанавливаем сессию напрямую через Supabase
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    if (error) {
      console.error('[OAuth] Failed to set session:', error);
      throw error;
    }
    
    console.log('[OAuth] Session set successfully!', {
      user: data.user?.email,
      expiresAt: data.session?.expires_at,
    });
    
    // Обновляем UI - закрываем модальное окно авторизации
    window.dispatchEvent(new CustomEvent('oauth-success'));
  } catch (error) {
    console.error('[OAuth] Error in handleOAuthCallback:', error);
    window.dispatchEvent(new CustomEvent('oauth-error', { detail: error }));
  }
}

// Экспортируем функцию в глобальный scope для Android bridge
if (typeof window !== 'undefined') {
  (window as any).handleOAuthCallback = handleOAuthCallback;
  console.log('[Android Bridge] OAuth callback handler registered');
}
