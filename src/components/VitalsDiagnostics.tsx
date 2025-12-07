import { useState, useEffect } from 'react';
import { heartRateStore } from '../hooks/heartRateStore';
import { useHeartRate } from '../hooks/useHeartRate';
import { useHealthKitHeartRate } from '../hooks/useHealthKitHeartRate';
import { useWatchHeartRate } from '../hooks/useWatchHeartRate';
import { useNotificationHeartRate } from '../hooks/useNotificationHeartRate';

interface DiagnosticsProps {
  onClose: () => void;
  isLightTheme?: boolean;
}

export function VitalsDiagnostics({ onClose, isLightTheme = false }: DiagnosticsProps) {
  const bleHR = useHeartRate();
  const healthKitHR = useHealthKitHeartRate();
  const watchHR = useWatchHeartRate();
  const notificationHR = useNotificationHeartRate();
  
  const [bufferLength, setBufferLength] = useState(0);
  const [lastSamples, setLastSamples] = useState<Array<{t: number, hr: number}>>([]);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const buffer = heartRateStore.getBuffer();
      setBufferLength(buffer.length);
      setLastSamples(buffer.slice(-5)); // Last 5 samples
      setUpdateCount(c => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (t: number) => {
    const date = new Date(t * 1000);
    return date.toLocaleTimeString();
  };

  const StatusBadge = ({ ok, label }: { ok: boolean, label: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-mono ${
      ok 
        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
        : 'bg-red-500/20 text-red-400 border border-red-500/30'
    }`}>
      {label}: {ok ? 'YES' : 'NO'}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] overflow-auto p-4">
      <div className={`max-w-lg mx-auto rounded-xl p-4 ${
        isLightTheme ? 'bg-white text-black' : 'bg-gray-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Vitals Diagnostics</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 text-red-400"
          >
            Close
          </button>
        </div>

        {/* Buffer Status */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">HeartRate Buffer</h3>
          <div className="font-mono text-2xl mb-2">
            Length: <span className={bufferLength > 0 ? 'text-green-400' : 'text-red-400'}>{bufferLength}</span>
          </div>
          <div className="text-xs text-gray-400">
            Need 10+ samples for vitals calculation
          </div>
          {lastSamples.length > 0 && (
            <div className="mt-2 text-xs font-mono">
              Last samples:
              {lastSamples.map((s, i) => {
                const delta = i > 0 ? (s.t - lastSamples[i-1].t).toFixed(2) : '—';
                return (
                  <div key={i} className="text-gray-300">
                    {formatTime(s.t)} → {s.hr} BPM (Δ{delta}s)
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BLE Status */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">BLE (Bluetooth)</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <StatusBadge ok={bleHR.connected} label="Connected" />
          </div>
          <div className="font-mono">
            HR: {bleHR.hr ?? 'null'}
          </div>
        </div>

        {/* HealthKit Status */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">HealthKit (iOS)</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <StatusBadge ok={healthKitHR.isAvailable === true} label="Available" />
            <StatusBadge ok={healthKitHR.isAuthorized === true} label="Authorized" />
            <StatusBadge ok={healthKitHR.isMonitoring} label="Monitoring" />
          </div>
          <div className="font-mono">
            HR: {healthKitHR.heartRate ?? 'null'}
          </div>
          {healthKitHR.error && (
            <div className="text-red-400 text-xs mt-1">Error: {healthKitHR.error}</div>
          )}
        </div>

        {/* Watch Status */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Apple Watch</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <StatusBadge ok={watchHR.isConnected} label="Connected" />
          </div>
          <div className="font-mono">
            HR: {watchHR.heartRate ?? 'null'}
          </div>
        </div>

        {/* Notification HR Status (Android) */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Notification HR (Android)</h3>
          <div className="font-mono">
            HR: {notificationHR.hr ?? 'null'}
          </div>
        </div>

        {/* Priority Logic */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Active Source Priority</h3>
          <div className="text-xs text-gray-400 mb-2">
            1. BLE → 2. Watch → 3. HealthKit → 4. Notification
          </div>
          <div className="font-mono">
            Active: {
              bleHR.connected ? 'BLE' :
              (watchHR.isConnected && watchHR.heartRate) ? 'Watch' :
              (healthKitHR.isMonitoring && healthKitHR.heartRate) ? 'HealthKit' :
              notificationHR.hr ? 'Notification' : 'NONE'
            }
          </div>
        </div>

        {/* Conditions Check */}
        <div className={`p-3 rounded-lg ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Data Flow Check</h3>
          <div className="text-xs space-y-1 font-mono">
            <div className={bleHR.connected ? 'text-yellow-400' : 'text-green-400'}>
              BLE not connected: {!bleHR.connected ? 'PASS' : 'BLOCKED (BLE active)'}
            </div>
            <div className={healthKitHR.isMonitoring ? 'text-green-400' : 'text-red-400'}>
              HealthKit monitoring: {healthKitHR.isMonitoring ? 'PASS' : 'FAIL'}
            </div>
            <div className={healthKitHR.heartRate != null ? 'text-green-400' : 'text-red-400'}>
              HealthKit has HR: {healthKitHR.heartRate != null ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4 text-center">
          Update #{updateCount} | Refresh: 1s
        </div>
      </div>
    </div>
  );
}
