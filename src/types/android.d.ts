// Типизация для Android JavaScript Bridge
interface AndroidBridge {
  openExternalBrowser(url: string): void;
  isHealthConnectAvailable(): boolean;
  requestHealthConnectPermissions(): void;
  readHealthConnectData(): void;
  // Bluetooth methods
  isBluetoothAvailable(): boolean;
  requestBluetoothPermissions(): void;
  startBluetoothScan(): void;
  stopBluetoothScan(): void;
  connectBluetoothDevice(deviceAddress: string): void;
  disconnectBluetoothDevice(): void;
  isBluetoothConnected(): boolean;
  // Notification Listener methods
  isNotificationListenerEnabled(): boolean;
  requestNotificationListenerPermission(): void;
}

interface Window {
  Android?: AndroidBridge;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}
