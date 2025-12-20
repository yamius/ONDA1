import { useState, useEffect, useCallback } from 'react';
import { PermissionsService, PermissionStatus } from '../services/PermissionsService';

export function usePermissions() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    microphone: false,
    healthRead: false,
    healthWrite: false,
    notifications: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  /**
   * Проверяет текущий статус всех разрешений
   */
  const checkPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await PermissionsService.checkAllPermissions();
      setPermissionStatus(status);
    } catch (error) {
      console.error('[usePermissions] Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Запрашивает все разрешения последовательно
   */
  const requestAllPermissions = useCallback(async (
    onProgress?: (permission: keyof PermissionStatus, granted: boolean) => void
  ) => {
    setIsRequesting(true);
    try {
      const status = await PermissionsService.requestAllPermissions(onProgress);
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('[usePermissions] Error requesting permissions:', error);
      throw error;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  /**
   * Открывает системные настройки
   */
  const openSettings = useCallback(async () => {
    await PermissionsService.openSettings();
  }, []);

  /**
   * Проверяет нужно ли показывать setup баннер
   */
  const needsSetup = PermissionsService.needsPermissionSetup(permissionStatus);

  /**
   * Проверяем разрешения при монтировании
   */
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissionStatus,
    isLoading,
    isRequesting,
    needsSetup,
    checkPermissions,
    requestAllPermissions,
    openSettings,
  };
}
