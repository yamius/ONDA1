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

      // Проверяем через Permissions API если доступен
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return result.state === 'granted';
      }

      // Fallback: пробуем получить доступ
      // Если уже есть разрешение, это быстро вернётся без диалога
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('[Permissions] Error checking microphone permission:', error);
      return false;
    }
  }

  /**
   * Проверяет разрешение на чтение HealthKit
   */
  static async checkHealthReadPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      // Проверяем через OndaWatch plugin
      const OndaWatch = (window as any).OndaWatch;
      if (!OndaWatch) {
        return false;
      }

      const status = await OndaWatch.getStatus();
      // Если Watch app установлен и paired, считаем что разрешение есть
      return status.paired && status.watchAppInstalled;
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
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const OndaWatch = (window as any).OndaWatch;
      if (!OndaWatch) {
        console.error('[Permissions] OndaWatch plugin not available');
        return false;
      }

      // Запрашиваем разрешения через активацию session
      // WorkoutManager на часах запросит разрешения при первом запуске
      await OndaWatch.startRealtime();
      
      // Даём время на системный диалог
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Останавливаем (чтобы не начинать workout)
      await OndaWatch.stopRealtime();

      return true;
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
    
    await this.delay(500);

    // 2. Микрофон
    console.log('[Permissions] Requesting microphone permission...');
    status.microphone = await this.requestMicrophonePermission();
    onProgress?.('microphone', status.microphone);
    
    await this.delay(500);

    // 3. Уведомления
    console.log('[Permissions] Requesting notification permission...');
    status.notifications = await this.requestNotificationPermission();
    onProgress?.('notifications', status.notifications);

    console.log('[Permissions] All permissions requested:', status);
    return status;
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
