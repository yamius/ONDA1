import { useCallback, useEffect, useRef, useState } from "react";
import { heartRateStore } from "./heartRateStore";

type HRPoint = { t: number; hr: number };

export function useHeartRate() {
  const [hr, setHr] = useState<number | null>(heartRateStore.getCurrentHR());
  const [connected, setConnected] = useState(heartRateStore.isDeviceConnected());
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

  const parseHR = (data: DataView) => {
    const flags = data.getUint8(0);
    let offset = 1;
    const hrValue =
      (flags & 0x01) === 0
        ? data.getUint8(offset++)
        : data.getUint16(offset, true);
    return hrValue;
  };

  const connect = useCallback(async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
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
    } catch (err) {
      console.error(err);
      heartRateStore.setConnected(false);
    }
  }, []);

  return { hr, connected, connect, seriesRef: bufferRef };
}
