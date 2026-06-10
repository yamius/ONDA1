type HRPoint = { t: number; hr: number };

class HeartRateStore {
  private buffer: HRPoint[] = [];
  private listeners: Set<(hr: number | null) => void> = new Set();
  private connectedListeners: Set<(connected: boolean) => void> = new Set();
  private currentHR: number | null = null;
  private isConnected = false;
  private device: any | null = null;
  // Camera pulse channel (set by useCameraPpg, read by useVitals). Kept here so
  // the camera source and the watch/BLE sources share one buffer + one place
  // useVitals can observe — the pulse-source abstraction's shared bridge.
  private cameraActive = false;
  private cameraHr: number | null = null;
  private cameraListeners: Set<(s: { active: boolean; hr: number | null }) => void> = new Set();

  getBuffer(): HRPoint[] {
    return this.buffer;
  }

  getCurrentHR(): number | null {
    return this.currentHR;
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  subscribe(callback: (hr: number | null) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  subscribeToConnection(callback: (connected: boolean) => void): () => void {
    this.connectedListeners.add(callback);
    return () => this.connectedListeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentHR));
  }

  private notifyConnectionListeners() {
    this.connectedListeners.forEach(listener => listener(this.isConnected));
  }

  addDataPoint(t: number, hr: number) {
    this.buffer.push({ t, hr });
    const tMin = t - 180;
    while (this.buffer.length && this.buffer[0].t < tMin) {
      this.buffer.shift();
    }
    this.currentHR = hr;
    console.log('[heartRateStore] Added HR:', hr, 'buffer size:', this.buffer.length);
    this.notifyListeners();
  }

  setConnected(connected: boolean) {
    this.isConnected = connected;
    this.notifyConnectionListeners();
  }

  setDevice(device: any | null) {
    this.device = device;
  }

  // ── Camera pulse channel ──────────────────────────────────────────────
  subscribeCamera(callback: (s: { active: boolean; hr: number | null }) => void): () => void {
    this.cameraListeners.add(callback);
    return () => this.cameraListeners.delete(callback);
  }

  private notifyCamera() {
    const snapshot = { active: this.cameraActive, hr: this.cameraHr };
    this.cameraListeners.forEach(l => l(snapshot));
  }

  setCameraActive(active: boolean) {
    this.cameraActive = active;
    if (!active) this.cameraHr = null;
    this.notifyCamera();
  }

  setCameraHr(hr: number | null) {
    this.cameraHr = hr;
    this.notifyCamera();
  }

  isCameraActive(): boolean {
    return this.cameraActive;
  }

  getCameraHr(): number | null {
    return this.cameraHr;
  }

  getDevice(): any | null {
    return this.device;
  }

  clear() {
    // Clear buffer in-place to preserve reference for bufferRef.current
    this.buffer.length = 0;
    this.currentHR = null;
  }
}

export const heartRateStore = new HeartRateStore();
