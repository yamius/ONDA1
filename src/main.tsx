import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './i18n';

// Render IMMEDIATELY. Everything that isn't required to paint the first
// frame — Sentry, resourceTracker, crash detector, analytics, deep-link
// handlers — used to be loaded as static imports at module init, dragging
// each one's module-evaluation cost into the cold-start critical path.
// They now run via runWhenIdle() below, after React has mounted.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
// Boot splash (index.html → #onda-boot-splash) is removed by the MainScene
// wrapper inside App.tsx after the lazy onda-level1-demo_27 chunk mounts.

// requestIdleCallback isn't available in WKWebView (only Chromium). Fall
// back to a short setTimeout so we still defer past the first paint.
function runWhenIdle(fn: () => void, fallbackDelay = 100): void {
  const ric = (window as any).requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => number)
    | undefined;
  if (typeof ric === 'function') {
    ric(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, fallbackDelay);
  }
}

runWhenIdle(() => {
  // Sentry — wire up error capture. Until this lands the global handlers
  // below just push to localStorage; once Sentry is ready those same
  // errors get captured via captureException. The first 100ms of a fresh
  // launch don't tend to throw anyway.
  import('./services/sentryInit')
    .then((m) => m.initSentry())
    .catch((e) => console.warn('[ONDA] Sentry init failed:', e));

  // Resource tracker monkey-patches AudioContext/fetch/setInterval for the
  // OOM post-mortem. It used to be the very first import in main.tsx so
  // patches were live before any audio/timer code ran. Deferring it means
  // we miss patching anything created during the first ~100ms (the
  // splash period), which is acceptable — practice_view and the audio
  // engine only spin up well after that, deep inside the lazy chunk.
  import('./services/resourceTracker')
    .then(({ installResourceTracker, startHeartbeat }) => {
      installResourceTracker();
      startHeartbeat(500);
    })
    .catch((e) => console.warn('[ONDA] resourceTracker init failed:', e));

  // Crash detector — looks at the previous session's last practice_view
  // marker to flag suspected OOM kills. Must run before the user starts
  // a new practice; deferring by ~100ms is safe because the user can't
  // even reach the practice list until the lazy main scene mounts (≫100ms).
  import('./services/crashRecovery')
    .then((m) => m.runCrashRecovery())
    .catch((e) => console.warn('[ONDA] crash recovery check failed:', e));

  // Reset per-session practice counter on fresh cold start.
  try {
    if (!sessionStorage.getItem('onda_session_started')) {
      sessionStorage.setItem('onda_session_started', String(Date.now()));
      localStorage.setItem('onda_session_practice_count', '0');
    }
  } catch {}

  // Firebase Analytics — already wraps the native plugin, very light JS,
  // but the dynamic import keeps it off the initial chunk.
  import('./services/analytics')
    .then(({ initializeAnalytics }) => initializeAnalytics())
    .then(() => console.log('[ONDA] Firebase Analytics initialized'))
    .catch((error) => console.error('[ONDA] Failed to initialize Firebase Analytics:', error));

  // Airbridge deep-link handler.
  import('./lib/airbridge')
    .then(({ initAirbridgeDeepLinkHandler }) => {
      initAirbridgeDeepLinkHandler();
      console.log('[ONDA] Airbridge deep link handler initialized');
    })
    .catch((e) => console.warn('[ONDA] Airbridge initialization failed:', e));

  // Health Connect bridge — Android-only side-effect registration.
  import('./bridge/healthConnectBridge').catch(() => {});
});

// Lightweight error capture that works BEFORE Sentry is initialized.
// Once Sentry loads, sentryInit re-routes captureException through it.
window.onerror = function (message, source, lineno, colno, error) {
  console.error('[ONDA Global Error]:', { message, source, lineno, colno, error });
  const Sentry = (window as any).__sentryCapacitor;
  if (Sentry && error) Sentry.captureException(error);
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
  } catch {}
};

window.onunhandledrejection = function (event) {
  console.error('[ONDA Unhandled Promise]:', event.reason);
  const Sentry = (window as any).__sentryCapacitor;
  if (Sentry) Sentry.captureException(event.reason);
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
  } catch {}
};
