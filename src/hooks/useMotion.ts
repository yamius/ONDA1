import { useEffect, useState } from "react";

export function useMotion() {
  const [rms, setRms] = useState(0);

  useEffect(() => {
    let last = 0;
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const ax = a.x ?? 0, ay = a.y ?? 0, az = a.z ?? 0;
      const now = performance.now();
      if (now - last < 200) return;
      last = now;
      const v = Math.sqrt(ax*ax + ay*ay + az*az);
      setRms(prev => prev === 0 ? v : prev*0.9 + v*0.1);
    };
    window.addEventListener("devicemotion", handler);
    return () => window.removeEventListener("devicemotion", handler);
  }, []);

  return { activity: rms };
}
