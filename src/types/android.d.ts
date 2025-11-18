// Типизация для Android JavaScript Bridge
interface AndroidBridge {
  openExternalBrowser(url: string): void;
  isHealthConnectAvailable(): boolean;
  requestHealthConnectPermissions(): void;
  readHealthConnectData(): void;
}

interface Window {
  Android?: AndroidBridge;
  handleOAuthCallback: (accessToken: string, refreshToken: string) => Promise<void>;
}
