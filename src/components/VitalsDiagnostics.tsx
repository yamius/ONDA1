import { useState, useEffect } from 'react';
import { heartRateStore } from '../hooks/heartRateStore';
import { useHeartRate } from '../hooks/useHeartRate';
import { useHealthKitHeartRate } from '../hooks/useHealthKitHeartRate';
import { useWatchHeartRate } from '../hooks/useWatchHeartRate';
import { useNotificationHeartRate } from '../hooks/useNotificationHeartRate';
import { useVitals } from '../hooks/useVitals';

interface DiagnosticsProps {
  onClose: () => void;
  isLightTheme?: boolean;
}

// Platform detection
const isAndroidWebView = typeof window !== 'undefined' && window.Android !== undefined;
const hasWindowAndroid = typeof window !== 'undefined' && !!window.Android;

export function VitalsDiagnostics({ onClose, isLightTheme = false }: DiagnosticsProps) {
  const bleHR = useHeartRate();
  const healthKitHR = useHealthKitHeartRate();
  const watchHR = useWatchHeartRate();
  const notificationHR = useNotificationHeartRate();
  const vitals = useVitals();
  
  const [bufferLength, setBufferLength] = useState(0);
  const [lastSamples, setLastSamples] = useState<Array<{t: number, hr: number}>>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [vitalsUpdateTime, setVitalsUpdateTime] = useState<string>('—');

  useEffect(() => {
    const interval = setInterval(() => {
      const buffer = heartRateStore.getBuffer();
      setBufferLength(buffer.length);
      setLastSamples(buffer.slice(-5)); // Last 5 samples
      setUpdateCount(c => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track vitals updates
  useEffect(() => {
    if (vitals.stress !== null) {
      setVitalsUpdateTime(new Date().toLocaleTimeString());
    }
  }, [vitals.stress, vitals.energy, vitals.br]);

  // Listen for bluetooth events
  useEffect(() => {
    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setEventLog(prev => [`${time}: ${msg}`, ...prev.slice(0, 9)]);
    };

    const onHRUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ hr: number }>;
      addLog(`HR: ${ce.detail?.hr} BPM`);
    };
    const onConnected = () => addLog('BLE Connected');
    const onDisconnected = () => addLog('BLE Disconnected');
    const onError = (e: Event) => {
      const ce = e as CustomEvent<{ error: string }>;
      addLog(`Error: ${ce.detail?.error}`);
    };

    window.addEventListener('bluetooth-hr-update', onHRUpdate);
    window.addEventListener('bluetooth-connected', onConnected);
    window.addEventListener('bluetooth-disconnected', onDisconnected);
    window.addEventListener('bluetooth-error', onError);

    addLog('Diagnostics opened');

    return () => {
      window.removeEventListener('bluetooth-hr-update', onHRUpdate);
      window.removeEventListener('bluetooth-connected', onConnected);
      window.removeEventListener('bluetooth-disconnected', onDisconnected);
      window.removeEventListener('bluetooth-error', onError);
    };
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

        {/* Platform Info */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Platform</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <StatusBadge ok={isAndroidWebView} label="Android WebView" />
            <StatusBadge ok={hasWindowAndroid} label="window.Android" />
          </div>
          <div className="font-mono text-sm">
            Platform: {bleHR.platform}
          </div>
        </div>

        {/* Event Log */}
        <div className={`p-3 rounded-lg mb-3 ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Event Log (last 10)</h3>
          <div className="font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
            {eventLog.length === 0 ? (
              <div className="text-gray-500">No events yet...</div>
            ) : (
              eventLog.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-green-400' : 'text-gray-400'}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculated Vitals - THIS IS THE KEY SECTION */}
        <div className={`p-3 rounded-lg mb-3 border-2 ${
          vitals.stress !== null 
            ? 'border-green-500/50' 
            : 'border-red-500/50'
        } ${isLightTheme ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <h3 className="font-semibold mb-2">Calculated Vitals (realtime)</h3>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            <div>Stress: <span className={vitals.stress !== null ? 'text-green-400' : 'text-red-400'}>{vitals.stress ?? 'null'}</span></div>
            <div>Energy: <span className={vitals.energy !== null ? 'text-green-400' : 'text-red-400'}>{vitals.energy ?? 'null'}</span></div>
            <div>BR: <span className={vitals.br !== null ? 'text-green-400' : 'text-red-400'}>{vitals.br ?? 'null'}</span></div>
            <div>HRV: <span className={vitals.hrv !== null ? 'text-green-400' : 'text-red-400'}>{vitals.hrv ?? 'null'}</span></div>
            <div>Calm: <span className="text-blue-400">{vitals.calm ?? 'null'}</span></div>
            <div>Focus: <span className="text-blue-400">{vitals.focus ?? 'null'}</span></div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Last update: <span className={vitalsUpdateTime !== '—' ? 'text-green-400' : 'text-red-400'}>{vitalsUpdateTime}</span>
          </div>
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
