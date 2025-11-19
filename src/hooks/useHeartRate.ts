import { useCallback, useEffect, useRef, useState } from "react";
import { heartRateStore } from "./heartRateStore";

type HRPoint = { t: number; hr: number };

// Определяем платформу
const isAndroidWebView = typeof window !== 'undefined' && window.Android !== undefined;
const isWebBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

export function useHeartRate() {
  const [hr, setHr] = useState<number | null>(heartRateStore.getCurrentHR());
  const [connected, setConnected] = useState(heartRateStore.isDeviceConnected());
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<Array<{ id: string; name: string }>>([]);
  const bufferRef = useRef<HRPoint[]>(heartRateStore.getBuffer());

  useEffect(() => {
    bufferRef.current = heartRateStore.getBuffer();
  });

  useEffect(() => {
    const unsubscribe = heartRateStore.subscribe((newHr) => {
      setHr(newHr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = heartRateStore.subscribeToConnection((isConnected) => {
      setConnected(isConnected);
    });
    return unsubscribe;
  }, []);

  // ========== Android WebView Bridge Listeners ==========
  useEffect(() => {
    if (!isAndroidWebView) return;

    console.log('[Bluetooth] Setting up Android WebView listeners');

    const handleDeviceFound = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; name: string }>;
      console.log('[Bluetooth] Device found:', customEvent.detail);
      setAvailableDevices(prev => {
        // Avoid duplicates
        if (prev.find(d => d.id === customEvent.detail.id)) return prev;
        return [...prev, customEvent.detail];
      });
    };

    const handleConnected = () => {
      console.log('[Bluetooth] Connected via Android bridge');
      heartRateStore.setConnected(true);
      setIsScanning(false);
    };

    const handleDisconnected = () => {
      console.log('[Bluetooth] Disconnected via Android bridge');
      heartRateStore.setConnected(false);
    };

    const handleHRUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ hr: number; timestamp: number }>;
      const { hr, timestamp } = customEvent.detail;
      const t = timestamp / 1000; // Convert to seconds
      heartRateStore.addDataPoint(t, hr);
    };

    const handleError = (event: Event) => {
      const customEvent = event as CustomEvent<{ error: string }>;
      console.error('[Bluetooth] Error:', customEvent.detail.error);
      setIsScanning(false);
    };

    window.addEventListener('bluetooth-device-found', handleDeviceFound);
    window.addEventListener('bluetooth-connected', handleConnected);
    window.addEventListener('bluetooth-disconnected', handleDisconnected);
    window.addEventListener('bluetooth-hr-update', handleHRUpdate);
    window.addEventListener('bluetooth-error', handleError);

    return () => {
      window.removeEventListener('bluetooth-device-found', handleDeviceFound);
      window.removeEventListener('bluetooth-connected', handleConnected);
      window.removeEventListener('bluetooth-disconnected', handleDisconnected);
      window.removeEventListener('bluetooth-hr-update', handleHRUpdate);
      window.removeEventListener('bluetooth-error', handleError);
    };
  }, []);

  // ========== Web Bluetooth API Helpers ==========
  const parseHR = (data: DataView) => {
    const flags = data.getUint8(0);
    let offset = 1;
    const hrValue =
      (flags & 0x01) === 0
        ? data.getUint8(offset++)
        : data.getUint16(offset, true);
    return hrValue;
  };

  // ========== Connect Function - Platform Detection ==========
  const connect = useCallback(async () => {
    try {
      if (isAndroidWebView && window.Android) {
        // ========== Android WebView Path ==========
        console.log('[Bluetooth] Using Android native bridge');
        
        // Check if Bluetooth is available
        const available = window.Android.isBluetoothAvailable();
        if (!available) {
          console.error('[Bluetooth] Bluetooth not available on device');
          alert('Bluetooth не доступен на этом устройстве');
          return;
        }

        // Clear previous devices
        setAvailableDevices([]);
        setIsScanning(true);

        // Start scan
        console.log('[Bluetooth] Starting scan...');
        window.Android.startBluetoothScan();

        // Wait for user to select device (UI will show list)
        // Connection happens when user calls connectToDevice()
        
      } else if (isWebBluetoothSupported) {
        // ========== Web Bluetooth API Path (Browser) ==========
        console.log('[Bluetooth] Using Web Bluetooth API');
        
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ services: ["heart_rate"] }],
          optionalServices: ["device_information"],
        });
        
        heartRateStore.setDevice(device);
        const server = await device.gatt!.connect();
        const service = await server.getPrimaryService("heart_rate");
        const char = await service.getCharacteristic("heart_rate_measurement");
        await char.startNotifications();
        
        char.addEventListener("characteristicvaluechanged", (e: any) => {
          const dv = e.target.value as DataView;
          const val = parseHR(dv);
          const t = performance.now() / 1000;
          heartRateStore.addDataPoint(t, val);
        });
        
        heartRateStore.setConnected(true);
        
        device.addEventListener("gattserverdisconnected", () => {
          heartRateStore.setConnected(false);
        });
        
      } else {
        console.error('[Bluetooth] Neither Android bridge nor Web Bluetooth API available');
        alert('Bluetooth не поддерживается на этой платформе');
      }
    } catch (err) {
      console.error('[Bluetooth] Connection error:', err);
      heartRateStore.setConnected(false);
      setIsScanning(false);
    }
  }, []);

  // ========== Connect to specific device (Android only) ==========
  const connectToDevice = useCallback((deviceId: string) => {
    if (!isAndroidWebView || !window.Android) {
      console.error('[Bluetooth] connectToDevice only available on Android');
      return;
    }

    console.log('[Bluetooth] Connecting to device:', deviceId);
    window.Android.connectBluetoothDevice(deviceId);
  }, []);

  // ========== Stop Scan (Android only) ==========
  const stopScan = useCallback(() => {
    if (!isAndroidWebView || !window.Android) return;
    
    console.log('[Bluetooth] Stopping scan');
    window.Android.stopBluetoothScan();
    setIsScanning(false);
  }, []);

  // ========== Disconnect Function - Platform Detection ==========
  const disconnect = useCallback(async () => {
    try {
      if (isAndroidWebView && window.Android) {
        // Android WebView path
        console.log('[Bluetooth] Disconnecting via Android bridge');
        window.Android.disconnectBluetoothDevice();
        
      } else if (isWebBluetoothSupported) {
        // Web Bluetooth API path
        console.log('[Bluetooth] Disconnecting via Web Bluetooth API');
        const device = heartRateStore.getDevice();
        if (device && device.gatt && device.gatt.connected) {
          await device.gatt.disconnect();
        }
      }
      
      heartRateStore.setConnected(false);
      heartRateStore.setDevice(null);
      heartRateStore.clear();
      setAvailableDevices([]);
      
    } catch (err) {
      console.error("[Bluetooth] Error disconnecting:", err);
    }
  }, []);

  return { 
    hr, 
    connected, 
    connect, 
    disconnect, 
    seriesRef: bufferRef,
    // Android-specific
    isScanning,
    availableDevices,
    connectToDevice,
    stopScan,
    platform: isAndroidWebView ? 'android' : 'web'
  };
}
