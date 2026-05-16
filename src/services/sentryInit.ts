// Sentry init split out of main.tsx so the @sentry/* bundles don't sit on
// the cold-start critical path. main.tsx loads this module via runWhenIdle
// after createRoot has already painted React's first frame.

import * as Sentry from '@sentry/capacitor';
import * as SentryReact from '@sentry/react';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  initialized = true;

  Sentry.init(
    {
      dsn: 'https://bea86caf3d64a1f98bcd6e9a50307008@o4511245722386432.ingest.de.sentry.io/4511245753778256',
      // browserTracingIntegration was the heaviest piece — it patches fetch,
      // history, sets up performance observers. Dropped from the deferred
      // init: we don't surface trace data anywhere and the runtime cost on
      // a Capacitor WebView didn't earn its keep.
      integrations: [],
      tracesSampleRate: 0,
      // The native Sentry-Cocoa SDK auto-captures every failed HTTP request
      // (4xx/5xx) as an `HTTPClientError` event. In practice that's pure
      // noise: transient 5xx from third-party SDKs (Firebase Installations,
      // Google, OneSignal, Tenjin, Supabase, RevenueCat) — all auto-retried
      // by those SDKs, none user-facing, none our bug. Real app failures
      // surface as crashes / unhandled exceptions, which are still captured.
      // Disabling this kills the noise category without losing signal.
      enableCaptureFailedRequests: false,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_SENTRY_RELEASE || 'onda-life@1.0.1',
    },
    SentryReact.init,
  );

  // main.tsx's window.onerror / onunhandledrejection handlers look up
  // window.__sentryCapacitor to forward exceptions through Sentry once
  // it's ready. Before this lands they only write to localStorage.
  (window as any).__sentryCapacitor = Sentry;
}
