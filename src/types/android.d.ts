// Типизация для Android JavaScript Bridge
interface AndroidBridge {
  openExternalBrowser(url: string): void;
  isHealthConnectAvailable(): boolean;
  requestHealthConnectPermissions(): void;
  readHealthConnectData(): void;
  // Bluetooth methods
  isBluetoothAvailable(): boolean;
  enableBluetooth(): void;
  requestBluetoothPermissions(): void;
  startBluetoothScan(): void;
  stopBluetoothScan(): void;
  connectBluetoothDevice(deviceAddress: string): void;
  disconnectBluetoothDevice(): void;
  isBluetoothConnected(): boolean;
  // Notification Listener methods
  isNotificationListenerEnabled(): boolean;
  requestNotificationListenerPermission(): void;
  // Heart Rate Service methods (Foreground Service for background survival)
  startHeartRateService(): void;
  stopHeartRateService(): void;
  isHeartRateServiceRunning(): boolean;
  // Firebase Analytics methods
  trackEvent(eventName: string, eventParamsJson: string): void;
  setAnalyticsUserId(userId: string): void;
  setUserProperty(propertyName: string, propertyValue: string): void;
}

interface Window {
  Android?: AndroidBridge;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}
