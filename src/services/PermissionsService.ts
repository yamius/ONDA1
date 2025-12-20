import { Capacitor } from '@capacitor/core';

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
    const [microphone, healthRead, healthWrite, notifications] = await Promise.all([
      this.checkMicrophonePermission(),
      this.checkHealthReadPermission(),
      this.checkHealthWritePermission(),
      this.checkNotificationPermission(),
    ]);

    return {
      microphone,
      healthRead,
      healthWrite,
      notifications,
    };
  }

  /**
   * Проверяет разрешение на микрофон
   */
  static async checkMicrophonePermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      // Сначала проверяем localStorage флаг
      const wasRequested = localStorage.getItem('onda_microphone_requested') === 'true';
      if (wasRequested) {
        return true;
      }

      // Проверяем через Permissions API если доступен
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          return result.state === 'granted';
        } catch (e) {
          // Permissions API может не поддерживаться на iOS
          console.log('[Permissions] Permissions API not available, assuming not granted');
          return false;
        }
      }

      // На iOS Permissions API не работает, поэтому не можем проверить
      // Возвращаем false (пусть пользователь нажмёт кнопку)
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
      return false;
    }

    try {
      // На iOS НЕВОЗМОЖНО проверить HealthKit статус без запроса (Apple privacy)
      // Используем localStorage для запоминания что пользователь уже настроил
      const wasRequested = localStorage.getItem('onda_healthkit_requested') === 'true';
      return wasRequested;
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
    try {
      // Проверяем через Capacitor Notifications
      const PushNotifications = (window as any).PushNotifications;
      if (!PushNotifications) {
        return false;
      }

      const result = await PushNotifications.checkPermissions();
      return result.receive === 'granted';
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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[Permissions] MediaDevices not available');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Останавливаем сразу, нам нужно только разрешение
      stream.getTracks().forEach(track => track.stop());
      
      // Сохраняем флаг что разрешение получено
      localStorage.setItem('onda_microphone_requested', 'true');
      
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
      const result = await CapacitorHealth.requestAuthorization({
        read: ['HKQuantityTypeIdentifierHeartRate', 'HKCategoryTypeIdentifierSleepAnalysis', 'HKQuantityTypeIdentifierActiveEnergyBurned'],
        write: ['HKWorkoutTypeIdentifier', 'HKCategoryTypeIdentifierMindfulSession']
      });

      console.log('[Permissions] HealthKit authorization result:', result);
      
      // Сохраняем флаг что разрешение было запрошено
      localStorage.setItem('onda_healthkit_requested', 'true');
      
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
    try {
      const PushNotifications = (window as any).PushNotifications;
      if (!PushNotifications) {
        return false;
      }

      const result = await PushNotifications.requestPermissions();
      return result.receive === 'granted';
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

    // 1. HealthKit (read + write) - самое важное
    console.log('[Permissions] Requesting HealthKit permissions...');
    const healthGranted = await this.requestHealthPermissions();
    status.healthRead = healthGranted;
    status.healthWrite = healthGranted;
    onProgress?.('healthRead', healthGranted);
    onProgress?.('healthWrite', healthGranted);
    
    await this.delay(1000);

    // 2. Микрофон
    console.log('[Permissions] Requesting microphone permission...');
    status.microphone = await this.requestMicrophonePermission();
    onProgress?.('microphone', status.microphone);
    
    // 3. Уведомления пока не запрашиваем (пакет не установлен)
    status.notifications = false;

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
      // Отправляем команду на Watch для запуска через WCSession
      const OndaWatch = (window as any).OndaWatch;
      if (OndaWatch) {
        // Оповещаем Watch что нужно открыться и начать мониторинг
        await OndaWatch.requestWatchAppOpen();
        console.log('[Permissions] Watch оповещены о начале мониторинга');
      }
    } catch (error) {
      console.error('[Permissions] Error starting HR monitoring:', error);
    }
  }

  /**
   * Проверяет нужно ли показывать баннер с запросом разрешений
   */
  static needsPermissionSetup(status: PermissionStatus): boolean {
    // Показываем баннер если НЕТ хотя бы одного из критичных разрешений
    return !status.microphone || !status.healthRead || !status.healthWrite;
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
