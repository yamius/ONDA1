type HRPoint = { t: number; hr: number };

class HeartRateStore {
  private buffer: HRPoint[] = [];
  private listeners: Set<(hr: number | null) => void> = new Set();
  private connectedListeners: Set<(connected: boolean) => void> = new Set();
  private currentHR: number | null = null;
  private isConnected = false;
  private device: any | null = null;

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
    this.notifyListeners();
  }

  setConnected(connected: boolean) {
    this.isConnected = connected;
    this.notifyConnectionListeners();
  }

  setDevice(device: any | null) {
    this.device = device;
  }

  getDevice(): any | null {
    return this.device;
  }

  clear() {
    this.buffer = [];
    this.currentHR = null;
  }
}

export const heartRateStore = new HeartRateStore();
