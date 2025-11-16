import { useState, useEffect } from 'react';
import { Activity, Trash2, Download, RefreshCw } from 'lucide-react';

interface EventLog {
  id: string;
  timestamp: number;
  type: string;
  payload: any;
  source: 'debug' | 'health_connect' | 'unknown';
}

export function HealthConnectDebugPanel() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newEvent: EventLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'hc-update',
        payload: customEvent.detail,
        source: customEvent.detail?.source || 'unknown',
      };
      
      setEvents((prev) => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
      console.log('[HC Debug] Event received:', newEvent);
    };

    window.addEventListener('hc-update', handleEvent);
    console.log('[HC Debug] Panel initialized, listening for events');

    return () => {
      window.removeEventListener('hc-update', handleEvent);
    };
  }, []);

  const clearEvents = () => {
    setEvents([]);
    console.log('[HC Debug] Events cleared');
  };

  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hc-events-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    console.log('[HC Debug] Events exported');
  };

  const triggerDebugEvent = () => {
    const debugPayload = {
      source: 'debug',
      timestamp: Date.now(),
      activity: {
        calories: Math.floor(Math.random() * 500) + 1500,
        vo2_max: Math.random() * 20 + 40,
        steps: Math.floor(Math.random() * 5000) + 5000,
      },
      vitals: {
        heart_rate: Math.floor(Math.random() * 40) + 60,
        blood_pressure_systolic: Math.floor(Math.random() * 20) + 110,
        blood_pressure_diastolic: Math.floor(Math.random() * 10) + 70,
        spo2: Math.random() * 2 + 97,
        body_temperature: Math.random() * 1 + 36.5,
      },
      sleep: {
        sessions: [{
          start: Date.now() - 8 * 60 * 60 * 1000,
          end: Date.now() - 30 * 60 * 1000,
          duration: 7.5,
          stages: {
            deep: 1.5,
            light: 4.0,
            rem: 2.0,
            awake: 0.5,
          },
        }],
      },
      body: {
        weight: Math.random() * 20 + 70,
        body_fat_percentage: Math.random() * 10 + 15,
        lean_body_mass: Math.random() * 15 + 55,
      },
      wellness: {
        mindfulness_minutes: Math.floor(Math.random() * 30) + 10,
        nutrition_calories: Math.floor(Math.random() * 500) + 1800,
        hydration_ml: Math.floor(Math.random() * 1000) + 1500,
      },
    };

    window.dispatchEvent(new CustomEvent('hc-update', { detail: debugPayload }));
    console.log('[HC Debug] Test event dispatched:', debugPayload);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
  };

  return (
    <div className="w-full border border-gray-700 rounded-lg bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">HC Debug Monitor</h3>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-600 text-gray-300">
            {events.length} events
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={triggerDebugEvent}
            data-testid="button-trigger-debug-event"
            title="Trigger test event"
            className="p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <RefreshCw className="h-3 w-3 text-gray-300" />
          </button>
          <button
            onClick={exportEvents}
            disabled={events.length === 0}
            data-testid="button-export-events"
            title="Export events"
            className="p-2 hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3 w-3 text-gray-300" />
          </button>
          <button
            onClick={clearEvents}
            disabled={events.length === 0}
            data-testid="button-clear-events"
            title="Clear events"
            className="p-2 hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3 w-3 text-gray-300" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-toggle-expand"
            className="px-3 py-1 text-xs border border-gray-600 hover:bg-gray-800 rounded transition-colors text-gray-300"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-2">
          <div className="h-[400px] overflow-y-auto">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Activity className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No events yet</p>
                <p className="text-xs mt-1">Click "Connect" or trigger test event</p>
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            event.source === 'health_connect'
                              ? 'bg-green-900 text-green-300 border border-green-700'
                              : 'bg-gray-700 text-gray-300 border border-gray-600'
                          }`}>
                            {event.source === 'health_connect' ? 'Android' : 'Debug'}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-900 border border-gray-600 text-gray-300">
                          {event.type}
                        </span>
                      </div>

                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
                          View payload
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-900 rounded overflow-x-auto text-[10px] leading-tight text-gray-300">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </details>

                      {event.payload && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                          {event.payload.activity && (
                            <div>
                              <span className="text-gray-500">Activity:</span>{' '}
                              {event.payload.activity.steps || 0} steps
                            </div>
                          )}
                          {event.payload.vitals && (
                            <div>
                              <span className="text-gray-500">HR:</span>{' '}
                              {event.payload.vitals.heart_rate || event.payload.vitals.heartRate || 0} bpm
                            </div>
                          )}
                          {event.payload.sleep && event.payload.sleep.sessions && (
                            <div>
                              <span className="text-gray-500">Sleep:</span>{' '}
                              {event.payload.sleep.sessions.length} session(s)
                            </div>
                          )}
                          {event.payload.body && (
                            <div>
                              <span className="text-gray-500">Weight:</span>{' '}
                              {event.payload.body.weight?.toFixed(1) || 0} kg
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Events are logged in real-time. Maximum 50 events are kept in memory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
