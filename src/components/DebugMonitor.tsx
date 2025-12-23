import React, { useState, useEffect } from 'react';
import { Bug, Download, X, ChevronDown, ChevronUp, Watch, Smartphone, Activity, Radio } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import OndaWatch from '../plugins/ondaWatch';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
}

interface WatchDiagnostics {
  // WCSession статус
  wcSessionSupported: boolean;
  wcSessionPaired: boolean;
  wcSessionAppInstalled: boolean;
  wcSessionReachable: boolean;
  
  // HR данные
  lastHRValue: number | null;
  lastHRTimestamp: string | null;
  lastHRSource: string | null;
  hrUpdateCount: number;
  
  // Разрешения
  healthKitGranted: boolean;
  microphoneGranted: boolean;
  
  // События
  lastCommandSent: string | null;
  lastCommandTime: string | null;
  lastEventReceived: string | null;
  lastEventTime: string | null;
  
  // Связь
  connectionLostCount: number;
  connectionRestoredCount: number;
  lastConnectionChange: string | null;
}

interface DebugMonitorProps {
  buildNumber?: string;
  commitHash?: string;
}

/**
 * Debug Monitor - отслеживает и отображает логи приложения
 * Показывается только в development mode или при активации
 */
export function DebugMonitor({ buildNumber, commitHash }: DebugMonitorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [showWatchPanel, setShowWatchPanel] = useState(true);
  const [watchDiagnostics, setWatchDiagnostics] = useState<WatchDiagnostics>({
    wcSessionSupported: false,
    wcSessionPaired: false,
    wcSessionAppInstalled: false,
    wcSessionReachable: false,
    lastHRValue: null,
    lastHRTimestamp: null,
    lastHRSource: null,
    hrUpdateCount: 0,
    healthKitGranted: false,
    microphoneGranted: false,
    lastCommandSent: null,
    lastCommandTime: null,
    lastEventReceived: null,
    lastEventTime: null,
    connectionLostCount: 0,
    connectionRestoredCount: 0,
    lastConnectionChange: null,
  });

  // Отслеживание Watch диагностики
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;

    const updateWatchStatus = async () => {
      try {
        const status = await OndaWatch.getStatus();
        
        setWatchDiagnostics(prev => ({
          ...prev,
          wcSessionSupported: status.supported,
          wcSessionPaired: status.paired || false,
          wcSessionAppInstalled: status.watchAppInstalled || false,
          wcSessionReachable: status.reachable || false,
        }));

        // Отслеживаем изменения связи
        if (prev.wcSessionReachable !== status.reachable) {
          const now = new Date().toLocaleTimeString();
          setWatchDiagnostics(prev => ({
            ...prev,
            lastConnectionChange: now,
            connectionLostCount: !status.reachable ? prev.connectionLostCount + 1 : prev.connectionLostCount,
            connectionRestoredCount: status.reachable ? prev.connectionRestoredCount + 1 : prev.connectionRestoredCount,
          }));
        }
      } catch (err) {
        console.error('[DebugMonitor] Watch status check failed:', err);
      }
    };

    // Проверка разрешений
    const checkPermissions = () => {
      const healthKit = localStorage.getItem('onda_healthkit_granted') === 'true';
      const microphone = localStorage.getItem('onda_microphone_granted') === 'true';
      
      setWatchDiagnostics(prev => ({
        ...prev,
        healthKitGranted: healthKit,
        microphoneGranted: microphone,
      }));
    };

    // Слушатели событий Watch
    let hrListener: any = null;
    let reachabilityListener: any = null;

    const setupListeners = async () => {
      try {
        // HR события
        hrListener = await OndaWatch.addListener('heartRate', (event) => {
          setWatchDiagnostics(prev => ({
            ...prev,
            lastHRValue: event.value,
            lastHRTimestamp: new Date().toLocaleTimeString(),
            lastHRSource: 'watch',
            hrUpdateCount: prev.hrUpdateCount + 1,
            lastEventReceived: 'heartRate',
            lastEventTime: new Date().toLocaleTimeString(),
          }));
        });

        // Reachability события
        reachabilityListener = await OndaWatch.addListener('reachabilityChanged', (event: any) => {
          const now = new Date().toLocaleTimeString();
          setWatchDiagnostics(prev => ({
            ...prev,
            wcSessionReachable: event.reachable,
            lastConnectionChange: now,
            connectionLostCount: !event.reachable ? prev.connectionLostCount + 1 : prev.connectionLostCount,
            connectionRestoredCount: event.reachable ? prev.connectionRestoredCount + 1 : prev.connectionRestoredCount,
            lastEventReceived: 'reachabilityChanged',
            lastEventTime: now,
          }));
        });
      } catch (err) {
        console.error('[DebugMonitor] Failed to setup Watch listeners:', err);
      }
    };

    updateWatchStatus();
    checkPermissions();
    setupListeners();

    const statusInterval = setInterval(updateWatchStatus, 3000);
    const permissionInterval = setInterval(checkPermissions, 5000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(permissionInterval);
      hrListener?.remove();
      reachabilityListener?.remove();
    };
  }, []);

  useEffect(() => {
    // Перехватываем console.log, console.warn, console.error
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    let prevWatchDiagnostics = watchDiagnostics;

    const addLog = (level: 'info' | 'warn' | 'error', args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      // Извлекаем категорию из сообщения (например, "[HealthKit]", "[Watch]")
      const categoryMatch = message.match(/^\[([^\]]+)\]/);
      const category = categoryMatch ? categoryMatch[1] : 'General';

      const log: DebugLog = {
        timestamp: new Date().toLocaleTimeString(),
        level,
        category,
        message: message.replace(/^\[[^\]]+\]\s*/, '') // Убираем категорию из сообщения
      };

      setLogs(prev => [...prev.slice(-999), log]); // Храним последние 1000 логов
      
      // Отслеживаем команды в Watch категории
      if (category === 'Watch' || category === 'Permissions' || category === 'ONDA Plugin') {
        const now = new Date().toLocaleTimeString();
        
        // Отправленные команды
        if (message.includes('Starting realtime') || message.includes('Stopping realtime') || 
            message.includes('startRealtime') || message.includes('stopRealtime')) {
          const command = message.includes('start') ? 'START' : 'STOP';
          setWatchDiagnostics(prev => ({
            ...prev,
            lastCommandSent: command,
            lastCommandTime: now,
          }));
        }
        
        // События Watch
        if (message.includes('Command sent') || message.includes('оповещены') || 
            message.includes('канал настроен')) {
          setWatchDiagnostics(prev => ({
            ...prev,
            lastEventReceived: message.substring(0, 50),
            lastEventTime: now,
          }));
        }
      }
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('info', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    // Добавляем стартовый лог
    console.log('[DebugMonitor] Initialized');
    console.log(`[Build] Version: ${buildNumber || 'dev'}, Commit: ${commitHash || 'local'}`);
    console.log(`[Platform] ${Capacitor.getPlatform()}, Native: ${Capacitor.isNativePlatform()}`);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [buildNumber, commitHash]);

  const downloadLogs = async () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const fileName = `onda-debug-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;

    // Проверяем доступность Share API (работает на iOS)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName)] })) {
      try {
        const file = new File([blob], fileName, { type: 'text/plain' });
        await navigator.share({
          files: [file],
          title: 'ONDA Debug Logs',
          text: `Debug logs (${logs.length} entries)`
        });
        console.log('[DebugMonitor] ✅ Logs shared successfully');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('[DebugMonitor] Share error:', error);
          // Fallback to download
          downloadLogsFallback(blob, fileName);
        }
      }
    } else {
      // Fallback для браузеров без Share API
      downloadLogsFallback(blob, fileName);
    }
  };

  const downloadLogsFallback = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('[DebugMonitor] ✅ Logs downloaded');
  };

  const clearLogs = () => {
    setLogs([]);
    console.log('[DebugMonitor] Logs cleared');
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;

  // Тестовые команды для часов
  const sendTestCommand = async (command: string) => {
    try {
      console.log(`[DebugMonitor] Sending test command: ${command}`);
      
      switch (command) {
        case 'START':
          await OndaWatch.startRealtime();
          break;
        case 'STOP':
          await OndaWatch.stopRealtime();
          break;
        case 'STATUS':
          const status = await OndaWatch.getStatus();
          console.log('[DebugMonitor] Watch status:', status);
          break;
        case 'HEARTBEAT':
          await OndaWatch.sendHeartbeat();
          break;
        case 'REQUEST_OPEN':
          await OndaWatch.requestWatchAppOpen();
          break;
      }
      
      console.log(`[DebugMonitor] ✅ Command ${command} sent successfully`);
    } catch (err) {
      console.error(`[DebugMonitor] ❌ Command ${command} failed:`, err);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors"
        title="Open Debug Monitor"
      >
        <Bug className="w-5 h-5 text-gray-400" />
        {(errorCount > 0 || warnCount > 0) && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            {errorCount + warnCount}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 left-4 right-4 sm:right-auto sm:w-96'} z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white text-sm">Debug Monitor</span>
          {buildNumber && (
            <span className="text-xs text-gray-500">v{buildNumber}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={downloadLogs}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title="Download logs"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <div>
          Logs: <span className="text-white">{logs.length}</span>
          {errorCount > 0 && (
            <span className="ml-2 text-red-400">Errors: {errorCount}</span>
          )}
          {warnCount > 0 && (
            <span className="ml-2 text-yellow-400">Warnings: {warnCount}</span>
          )}
        </div>
        <button
          onClick={clearLogs}
          className="text-gray-500 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Watch Diagnostics Panel */}
      {Capacitor.getPlatform() === 'ios' && (
        <div className="border-b border-gray-700">
          <button
            onClick={() => setShowWatchPanel(!showWatchPanel)}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">Apple Watch Diagnostics</span>
            </div>
            {showWatchPanel ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {showWatchPanel && (
            <div className="px-3 py-3 bg-gray-800/30 space-y-3 text-xs">
              {/* WCSession Status */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-gray-300">WCSession Status</span>
                </div>
                <div className="grid grid-cols-2 gap-2 ml-5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.wcSessionSupported ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">Supported</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.wcSessionPaired ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400">Paired</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.wcSessionAppInstalled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400">App Installed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.wcSessionReachable ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                    <span className="text-gray-400">Reachable</span>
                  </div>
                </div>
              </div>

              {/* Heart Rate Data */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-semibold text-gray-300">Heart Rate Data</span>
                </div>
                <div className="ml-5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Value:</span>
                    <span className="text-white font-mono">
                      {watchDiagnostics.lastHRValue ? `${watchDiagnostics.lastHRValue} bpm` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="text-gray-300 font-mono">{watchDiagnostics.lastHRTimestamp || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source:</span>
                    <span className="text-blue-400 font-mono">{watchDiagnostics.lastHRSource || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Updates:</span>
                    <span className="text-green-400 font-mono">{watchDiagnostics.hrUpdateCount}</span>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-semibold text-gray-300">Permissions (iPhone)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 ml-5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.healthKitGranted ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400">HealthKit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${watchDiagnostics.microphoneGranted ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400">Microphone</span>
                  </div>
                </div>
              </div>

              {/* Communication */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-gray-300">Communication</span>
                </div>
                <div className="ml-5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Command:</span>
                    <span className="text-blue-400 font-mono">{watchDiagnostics.lastCommandSent || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Command Time:</span>
                    <span className="text-gray-300 font-mono">{watchDiagnostics.lastCommandTime || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Event:</span>
                    <span className="text-purple-400 font-mono text-[10px]">
                      {watchDiagnostics.lastEventReceived ? watchDiagnostics.lastEventReceived.substring(0, 30) + '...' : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Event Time:</span>
                    <span className="text-gray-300 font-mono">{watchDiagnostics.lastEventTime || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Connection Stats */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold text-gray-300">Connection Stats</span>
                </div>
                <div className="ml-5 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lost Count:</span>
                    <span className="text-red-400 font-mono">{watchDiagnostics.connectionLostCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Restored Count:</span>
                    <span className="text-green-400 font-mono">{watchDiagnostics.connectionRestoredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Change:</span>
                    <span className="text-gray-300 font-mono">{watchDiagnostics.lastConnectionChange || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Test Commands */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-3.5 h-3.5 text-green-400" />
                  <span className="font-semibold text-gray-300">Test Commands</span>
                </div>
                <div className="ml-5 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => sendTestCommand('START')}
                    className="px-2 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded text-green-300 font-mono text-[10px] transition-colors"
                  >
                    START
                  </button>
                  <button
                    onClick={() => sendTestCommand('STOP')}
                    className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded text-red-300 font-mono text-[10px] transition-colors"
                  >
                    STOP
                  </button>
                  <button
                    onClick={() => sendTestCommand('STATUS')}
                    className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded text-blue-300 font-mono text-[10px] transition-colors"
                  >
                    STATUS
                  </button>
                  <button
                    onClick={() => sendTestCommand('HEARTBEAT')}
                    className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 rounded text-purple-300 font-mono text-[10px] transition-colors"
                  >
                    💓 PING
                  </button>
                  <button
                    onClick={() => sendTestCommand('REQUEST_OPEN')}
                    className="px-2 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded text-cyan-300 font-mono text-[10px] transition-colors col-span-2"
                  >
                    📳 REQUEST OPEN
                  </button>
                </div>
              </div>

              {/* Quick Diagnostics */}
              <div className="pt-2 border-t border-gray-700/50">
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  {!watchDiagnostics.wcSessionPaired && (
                    <div className="text-red-400">⚠️ Watch not paired with iPhone</div>
                  )}
                  {watchDiagnostics.wcSessionPaired && !watchDiagnostics.wcSessionAppInstalled && (
                    <div className="text-red-400">⚠️ ONDA Watch app not installed</div>
                  )}
                  {watchDiagnostics.wcSessionAppInstalled && !watchDiagnostics.wcSessionReachable && (
                    <div className="text-orange-400">⚠️ Watch not reachable (app may be in background)</div>
                  )}
                  {!watchDiagnostics.healthKitGranted && (
                    <div className="text-yellow-400">⚠️ HealthKit permission not granted on iPhone</div>
                  )}
                  {watchDiagnostics.lastHRValue === null && watchDiagnostics.healthKitGranted && (
                    <div className="text-yellow-400">⚠️ No HR data received yet - check Watch permissions</div>
                  )}
                  {watchDiagnostics.wcSessionReachable && watchDiagnostics.healthKitGranted && watchDiagnostics.lastHRValue !== null && (
                    <div className="text-green-400">✅ All systems operational</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="px-3 py-2 border-b border-gray-700 flex gap-2">
        {(['all', 'info', 'warn', 'error'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className={`overflow-y-auto ${isExpanded ? 'flex-1' : 'max-h-64'} p-2 space-y-1`}>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No logs yet
          </div>
        ) : (
          filteredLogs.map((log, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg text-xs font-mono ${
                log.level === 'error'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                  : log.level === 'warn'
                  ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300'
                  : 'bg-gray-800/50 border border-gray-700 text-gray-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-gray-500">{log.timestamp}</span>
                <span className="font-bold text-blue-400">[{log.category}]</span>
              </div>
              <div className="mt-1 whitespace-pre-wrap break-words">
                {log.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {commitHash && (
        <div className="px-3 py-2 border-t border-gray-700 text-[10px] text-gray-600 font-mono">
          Commit: {commitHash.slice(0, 7)}
        </div>
      )}
    </div>
  );
}
