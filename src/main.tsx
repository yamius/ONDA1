import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
    dsn: 'https://89007b674e33e62ef933bb71670f885f@o451107803417048.ingest.us.sentry.io/4511078050889728',
    integrations: [
      SentryReact.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE,
    release: 'onda-life@1.0.0',
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
