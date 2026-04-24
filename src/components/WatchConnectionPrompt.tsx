import React, { useEffect, useState } from 'react';
import { Watch, AlertTriangle, Lock } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import OndaWatch, { WatchHealthAuthStatus } from '../plugins/ondaWatch';

interface WatchConnectionPromptProps {
  visible: boolean;
  onConnected: () => void;
}

/**
 * Блок, который показывается после получения разрешений на телефоне
 * и автоматически исчезает, когда Watch подключится (reachable)
 * И при этом доступ к пульсу в HealthKit на часах действительно выдан.
 *
 * Часы присылают свой статус разрешений через applicationContext
 * (см. WorkoutManager.sendPermissionStatus → OndaWatchPlugin кеширует
 * и отдаёт в getStatus()). На основе этого показываем одну из трёх
 * форм баннера:
 *  - «ждём подключения часов» (unknown / ещё не прислали статус)
 *  - «ты пропустил(а) окно разрешений на часах» (notDetermined)
 *  - «разрешение на пульс отключено» с пошаговой инструкцией (denied)
 *
 * authorized + reachable → баннер скрывается через onConnected.
 */
export function WatchConnectionPrompt({ visible, onConnected }: WatchConnectionPromptProps) {
  const { t } = useTranslation();
  const [reachable, setReachable] = useState(false);
  const [authStatus, setAuthStatus] = useState<WatchHealthAuthStatus>('unknown');
  const [paired, setPaired] = useState<boolean | null>(null);
  const [watchAppInstalled, setWatchAppInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!visible || Capacitor.getPlatform() !== 'ios') {
      return;
    }

    let statusCheckInterval: ReturnType<typeof setInterval> | null = null;
    let listener: any = null;

    const checkWatchStatus = async () => {
      try {
        const status = await OndaWatch.getStatus();
        const isReachable = !!status.reachable;
        const nextAuth: WatchHealthAuthStatus = status.healthAuthStatus ?? 'unknown';

        setReachable(isReachable);
        setAuthStatus(nextAuth);
        setPaired(status.paired ?? null);
        setWatchAppInstalled(status.watchAppInstalled ?? null);

        // Часы считаются готовыми, только если они видимы И пульс реально разрешён
        if (isReachable && nextAuth === 'authorized') {
          console.log('[WatchConnectionPrompt] ✅ Watch connected and authorized');
          onConnected();
        }
      } catch (error) {
        console.error('[WatchConnectionPrompt] Error checking status:', error);
      }
    };

    // Проверяем статус сразу
    checkWatchStatus();

    // Проверяем каждые 3 секунды
    statusCheckInterval = setInterval(checkWatchStatus, 3000);

    // Слушаем события от Watch plugin
    const setupListener = async () => {
      try {
        listener = await OndaWatch.addListener('watchConnectionChanged', (event) => {
          console.log('[WatchConnectionPrompt] Watch connection changed:', event);
          const isReachable = !!event.isWatchConnected;
          const nextAuth: WatchHealthAuthStatus = event.healthAuthStatus ?? 'unknown';
          setReachable(isReachable);
          setAuthStatus(nextAuth);
          if (isReachable && nextAuth === 'authorized') {
            onConnected();
          }
        });
      } catch (error) {
        console.log('[WatchConnectionPrompt] Could not setup listener:', error);
      }
    };

    setupListener();

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      listener?.remove();
    };
  }, [visible, onConnected]);

  // Не показываем если не visible, или не iOS, или всё уже хорошо
  if (!visible || Capacitor.getPlatform() !== 'ios') {
    return null;
  }
  if (reachable && authStatus === 'authorized') {
    return null;
  }

  // Часы сопряжены, но приложение не установлено → инструкция по установке
  if (paired === true && watchAppInstalled === false) {
    return (
      <div className="mb-6 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl border border-indigo-500/30 overflow-hidden backdrop-blur-sm">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Watch className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-indigo-200 leading-relaxed mb-1">
                {t('watch.not_installed_title')}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {t('watch.not_installed_body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Выбираем конкретную форму баннера
  if (authStatus === 'notDetermined') {
    return (
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/30 overflow-hidden backdrop-blur-sm">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-200 leading-relaxed mb-1">
                {t('watch.permission_not_determined_title')}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('watch.permission_not_determined_body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'denied') {
    return (
      <div className="mb-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/30 overflow-hidden backdrop-blur-sm">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-200 leading-relaxed mb-2">
                {t('watch.permission_denied_title')}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {t('watch.permission_denied_body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 'unknown' / 'authorized' but not reachable → стандартный банер ожидания
  return (
    <div className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 overflow-hidden backdrop-blur-sm">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Watch className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('watch.open_app_prompt')}
            </p>

            {/* Animated dots */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-400">{t('watch.waiting_connection')}</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
