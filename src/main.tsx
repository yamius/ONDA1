import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Install resource tracker BEFORE any module that might schedule timers.
// Must be the very first import so monkey-patches are in place when App.tsx
// and its deps initialize setInterval / new AudioContext at module load.
import { installResourceTracker, startHeartbeat, getHeartbeats, clearHeartbeats } from './services/resourceTracker';
installResourceTracker();
// 500ms rolling ring-buffer of resource snapshots, so the post-mortem can
// show what was growing in the 10 seconds before the iOS WebView OOM-kill.
startHeartbeat(500);
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './i18n';
import './bridge/healthConnectBridge';
import { initializeAnalytics } from './services/analytics';
import * as Sentry from '@sentry/capacitor';
import * as SentryReact from '@sentry/react';

Sentry.init(
  {
    dsn: 'https://bea86caf3d64a1f98bcd6e9a50307008@o4511245722386432.ingest.de.sentry.io/4511245753778256',
    integrations: [
      SentryReact.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE,
    // Must match SENTRY_RELEASE used during source map upload in CI,
    // otherwise stacks won't resolve. VITE_SENTRY_RELEASE is injected
    // at build time (see .github/workflows/ios-deploy.yml).
    release: import.meta.env.VITE_SENTRY_RELEASE || 'onda-life@1.0.1',
  },
  SentryReact.init
);

window.onerror = function(message, source, lineno, colno, error) {
  console.error('[ONDA Global Error]:', { message, source, lineno, colno, error });
  if (error) Sentry.captureException(error);
  const errorLog = {
    type: 'global',
    timestamp: new Date().toISOString(),
    message: String(message),
    source,
    line: lineno,
    column: colno,
    stack: error?.stack,
  };
  try {
    const logs = JSON.parse(localStorage.getItem('onda_error_logs') || '[]');
    logs.push(errorLog);
    if (logs.length > 10) logs.shift();
    localStorage.setItem('onda_error_logs', JSON.stringify(logs));
  } catch (e) {}
};

window.onunhandledrejection = function(event) {
  console.error('[ONDA Unhandled Promise]:', event.reason);
  Sentry.captureException(event.reason);
  const errorLog = {
    type: 'promise',
    timestamp: new Date().toISOString(),
    message: String(event.reason),
    stack: event.reason?.stack,
  };
  try {
    const logs = JSON.parse(localStorage.getItem('onda_error_logs') || '[]');
    logs.push(errorLog);
    if (logs.length > 10) logs.shift();
    localStorage.setItem('onda_error_logs', JSON.stringify(logs));
  } catch (e) {}
};

// Crash recovery: if the previous session died right after a practice_view
// (e.g. iOS WebView OOM-kill), emit app_crash_suspected with context.
// Must happen BEFORE any new practice_view, so we do it synchronously here.
(async () => {
  try {
    const markerRaw = localStorage.getItem('onda_last_practice_view');
    if (!markerRaw) return;
    localStorage.removeItem('onda_last_practice_view');
    const marker = JSON.parse(markerRaw);
    const sinceLastView = Date.now() - (marker.ts || 0);
    // Only report if last practice_view was very recent (<10s) — otherwise it's a clean restart.
    if (sinceLastView > 10000) return;
    const errorLogsRaw = localStorage.getItem('onda_error_logs') || '[]';
    const errorLogs = JSON.parse(errorLogsRaw);
    // Fetch the heartbeat ring buffer BEFORE clearing — it holds the last
    // ~10 seconds of resource snapshots leading up to the crash.
    const heartbeats = getHeartbeats();
    clearHeartbeats();
    const { analytics } = await import('./services/AnalyticsService');
    await analytics.track('app_crash_suspected', {
      crashed_practice_id: marker.practiceId,
      ms_since_practice_view: sinceLastView,
      session_practice_count: marker.sessionPracticeCount,
      prev_session_id: marker.sessionId,
      last_error_logs: errorLogs.slice(-5),
      // Only send last 10 heartbeats to stay under payload limits.
      pre_crash_heartbeats: heartbeats.slice(-10),
      platform: 'ios',
    });
    console.warn('[ONDA] Detected suspected crash after practice_view', {
      practiceId: marker.practiceId,
      sinceLastView,
      sessionPracticeCount: marker.sessionPracticeCount,
    });
  } catch (e) {
    console.error('[ONDA] Crash recovery check failed:', e);
  }
})();

// Reset per-session practice counter on fresh app load (page reload / cold start).
// Note: localStorage survives, so we use a sessionStorage flag to detect fresh session.
try {
  if (!sessionStorage.getItem('onda_session_started')) {
    sessionStorage.setItem('onda_session_started', String(Date.now()));
    localStorage.setItem('onda_session_practice_count', '0');
  }
} catch (e) {}

// Initialize Firebase Analytics
initializeAnalytics().then(() => {
  console.log('[ONDA] Firebase Analytics initialized');
}).catch((error) => {
  console.error('[ONDA] Failed to initialize Firebase Analytics:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
