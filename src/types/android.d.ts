// Типизация для Android JavaScript Bridge
interface AndroidBridge {
  openExternalBrowser(url: string): void;
}

interface Window {
  Android?: AndroidBridge;
}
