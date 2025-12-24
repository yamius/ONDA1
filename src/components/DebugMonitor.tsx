import React, { useState, useEffect } from 'react';
import { Bug, Download, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
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

  useEffect(() => {
    // Перехватываем console.log, console.warn, console.error
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

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

      setLogs(prev => [...prev.slice(-2499), log]); // Храним последние 2500 логов
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
    // Добавляем заголовок с метаинформацией
    const header = [
      '='.repeat(80),
      'ONDA Debug Logs',
      '='.repeat(80),
      `Generated: ${new Date().toISOString()}`,
      `Build: ${buildNumber || 'dev'}`,
      `Commit: ${commitHash || 'local'}`,
      `Platform: ${Capacitor.getPlatform()}`,
      `Native: ${Capacitor.isNativePlatform()}`,
      `Total logs: ${logs.length}`,
      '='.repeat(80),
      ''
    ].join('\n');

    const logText = header + logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.category}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const commit = commitHash ? `-${commitHash.slice(0, 7)}` : '';
    const fileName = `onda-debug-${timestamp}-${logs.length}logs${commit}.txt`;

    console.log(`[DebugMonitor] 📥 Preparing to download ${logs.length} log entries (commit: ${commitHash || 'local'})`);

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
