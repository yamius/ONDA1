import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import OndaWatch from '../plugins/ondaWatch';

export interface PermissionStatus {
  microphone: boolean;
  healthRead: boolean;
  healthWrite: boolean;
  notifications: boolean;
}

export class PermissionsService {
  /**
   * Проверяет статус всех разрешений
   */
  static async checkAllPermissions(): Promise<PermissionStatus> {
    // 🔍 DEBUG: Проверяем localStorage при старте
    console.log('[Permissions] 🔍 checkAllPermissions() - localStorage dump:', {
      microphone: localStorage.getItem('onda_microphone_granted'),
      healthkit: localStorage.getItem('onda_healthkit_granted')
    });

    const [microphone, healthRead, healthWrite, notifications] = await Promise.all([
      this.checkMicrophonePermission(),
      this.checkHealthReadPermission(),
      this.checkHealthWritePermission(),
      this.checkNotificationPermission(),
    ]);

    const result = {
      microphone,
      healthRead,
      healthWrite,
      notifications,
    };

    console.log('[Permissions] checkAllPermissions() result:', result);
    return result;
  }

  /**
   * Проверяет разрешение на микрофон
   */
  static async checkMicrophonePermission(): Promise<boolean> {
    try {
      // 🔥 ПРИОРИТЕТ 1: localStorage (самый надежный на iOS)
      const savedStatus = localStorage.getItem('onda_microphone_granted');
      if (savedStatus === 'true') {
        console.log('[Permissions] ✅ Microphone already granted (localStorage)');
        return true;
      }
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('[Permissions] checkMicrophonePermission: MediaDevices not available');
        return false;
      }

      // 🔥 ПРИОРИТЕТ 2: Permissions API (дополнительная проверка)
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          const granted = result.state === 'granted';
          console.log('[Permissions] Microphone Permissions API status:', result.state);
          
          // Сохраняем статус если granted (синхронизируем с localStorage)
          if (granted) {
            localStorage.setItem('onda_microphone_granted', 'true');
            console.log('[Permissions] ✅ Microphone permission saved to localStorage');
          }
          
          return granted;
        } catch (e) {
          // Permissions API может не поддерживаться на iOS
          console.log('[Permissions] Permissions API not available on this platform (likely iOS)');
        }
      }

      // Если ничего не нашли - возвращаем false
      console.log('[Permissions] ❌ Microphone permission unknown, assuming not granted');
      return false;
    } catch (error) {
      console.error('[Permissions] Error checking microphone permission:', error);
      return false;
    }
  }

  /**
   * Проверяет разрешение на чтение HealthKit
   */
  static async checkHealthReadPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      console.log('[Permissions] checkHealthReadPermission: Not iOS native platform');
      return false;
    }

    try {
      // На iOS НЕВОЗМОЖНО проверить HealthKit статус через API (Apple privacy)
      // Поэтому проверяем localStorage - сохранённый флаг после успешного запроса
      const savedStatus = localStorage.getItem('onda_healthkit_granted');
      console.log('[Permissions] checkHealthReadPermission localStorage value:', savedStatus);
      if (savedStatus === 'true') {
        console.log('[Permissions] ✅ HealthKit permission from saved state: granted');
        return true;
      }
      
      console.log('[Permissions] ❌ HealthKit permission unknown, assuming not granted');
      return false;
    } catch (error) {
      console.error('[Permissions] Error checking health read permission:', error);
      return false;
    }
  }

  /**
   * Проверяет разрешение на запись в HealthKit
   */
  static async checkHealthWritePermission(): Promise<boolean> {
    // На iOS нельзя проверить write permission напрямую
    // Apple не раскрывает этот статус по privacy
    // Считаем что если read есть, то write тоже был запрошен
    return this.checkHealthReadPermission();
  }

  /**
   * Проверяет разрешение на уведомления
   */
  static async checkNotificationPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('[Permissions] Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * Запрашивает разрешение на микрофон
   */
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      // 🔥 ВАЖНО: Проверяем localStorage ПЕРЕД запросом
      const savedStatus = localStorage.getItem('onda_microphone_granted');
      if (savedStatus === 'true') {
        console.log('[Permissions] ✅ Microphone already granted (from localStorage), skipping request');
        return true;
      }
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[Permissions] MediaDevices not available');
        return false;
      }

      console.log('[Permissions] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Останавливаем сразу, нам нужно только разрешение
      stream.getTracks().forEach(track => track.stop());
      
      // ✅ Сохраняем статус в localStorage для последующих запусков
      localStorage.setItem('onda_microphone_granted', 'true');
      
      console.log('[Permissions] ✅ Microphone permission granted');
      return true;
    } catch (error) {
      console.error('[Permissions] Error requesting microphone permission:', error);
      return false;
    }
  }

  /**
   * Запрашивает разрешения HealthKit (read + write)
   */
  static async requestHealthPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      return false;
    }

    try {
      const CapacitorHealth = (window as any).CapacitorHealth;
      if (!CapacitorHealth) {
        console.error('[Permissions] CapacitorHealth plugin not available');
        return false;
      }

      // Запрашиваем разрешения на чтение и запись
      // READ: HeartRate (пульс) + Sleep (сон для Ритма Жизни)
      // WRITE: Workout + MindfulSession (сохранение практик в Здоровье)
      const result = await CapacitorHealth.requestAuthorization({
        read: ['HKQuantityTypeIdentifierHeartRate', 'HKCategoryTypeIdentifierSleepAnalysis'],
        write: ['HKWorkoutTypeIdentifier', 'HKCategoryTypeIdentifierMindfulSession']
      });

      console.log('[Permissions] HealthKit authorization result:', result);
      return true; // Apple всегда возвращает success даже если пользователь отказал
    } catch (error) {
      console.error('[Permissions] Error requesting health permissions:', error);
      return false;
    }
  }

  /**
   * Запрашивает разрешение на уведомления
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const result = await LocalNotifications.requestPermissions();
      const granted = result.display === 'granted';
      // Snapshot for service-level helpers (e.g. notifications.ts streak
      // reconciliation logic that reads localStorage to know whether to
      // proceed before re-checking with the OS).
      localStorage.setItem('onda_reminders_last_permission', granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('[Permissions] Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Запрашивает ВСЕ разрешения последовательно
   */
  static async requestAllPermissions(
    onProgress?: (permission: keyof PermissionStatus, granted: boolean) => void
  ): Promise<PermissionStatus> {
    const status: PermissionStatus = {
      microphone: false,
      healthRead: false,
      healthWrite: false,
      notifications: false,
    };

    // Микрофон НЕ запрашиваем на главном экране (чтобы не отпугивать).
    // Он будет запрошен только в момент, когда реально нужен (эмоциональная проверка).
    status.microphone = await this.checkMicrophonePermission();

    // HealthKit (только read) - capacitor-health не установлен
    // Пульс работает через нативный HKHealthStore в OndaWatchPlugin
    console.log('[Permissions] HealthKit works via native OndaWatchPlugin');
    status.healthRead = true; // Считаем что разрешение есть (работает нативно)
    status.healthWrite = false; // Не используем
    onProgress?.('healthRead', true);
    
    // 3. Уведомления — запрашиваем через @capacitor/local-notifications.
    //    Пользователь увидит этот системный prompt после HealthKit-prompt
    //    на том же первом онбординг-экране. UX-инвариант: prompt только
    //    после клика "Grant all", никогда при холодном старте.
    status.notifications = await this.requestNotificationPermission();
    onProgress?.('notifications', status.notifications);

    console.log('[Permissions] All permissions requested:', status);
    
    // 🎯 После получения разрешений → запускаем HR мониторинг
    if ((status.healthRead || status.healthWrite) && Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      console.log('[Permissions] ✅ Разрешения получены → запускаем HR мониторинг');
      await this.startHeartRateMonitoring();
    }
    
    return status;
  }

  /**
   * Запускает HR мониторинг после получения разрешений
   */
  private static async startHeartRateMonitoring(): Promise<void> {
    try {
      const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
      console.log('[Permissions] 🔍 startHeartRateMonitoring() - OndaWatch plugin check:', {
        isPluginAvailable,
        platform: Capacitor.getPlatform()
      });

      if (!isPluginAvailable) {
        console.error('[Permissions] ❌ OndaWatch plugin NOT AVAILABLE!');
        return;
      }

      console.log('[Permissions] Запускаем HR мониторинг...');
      
      // ❌ УБРАНО: requestWatchAppOpen() - избыточные вибрации если пользователь сам открыл app
      // Пользователь должен сам открыть ONDA app на часах вручную
      
      // Запускаем мониторинг на iPhone (настраиваем канал связи)
      await OndaWatch.startRealtime();
      console.log('[Permissions] ✅ startRealtime() вызван → канал настроен (без вибраций)');
      
      // 3. Сохраняем флаг что HealthKit разрешения получены
      localStorage.setItem('onda_healthkit_granted', 'true');
      console.log('[Permissions] ✅ HealthKit permission saved to localStorage');
    } catch (error) {
      console.error('[Permissions] Error starting HR monitoring:', error);
    }
  }

  /**
   * Проверяет нужно ли показывать баннер с запросом разрешений
   */
  static needsPermissionSetup(status: PermissionStatus): boolean {
    // Показываем экран setup только для Heart Rate (микрофон запрашиваем позже, по месту).
    return !status.healthRead;
  }

  /**
   * Открывает системные настройки приложения
   */
  static async openSettings(): Promise<void> {
    try {
      const App = (window as any).App;
      if (App?.openSettings) {
        await App.openSettings();
      }
    } catch (error) {
      console.error('[Permissions] Error opening settings:', error);
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
