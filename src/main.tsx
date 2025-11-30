import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import './i18n';
import './bridge/healthConnectBridge';

window.onerror = function(message, source, lineno, colno, error) {
  console.error('[ONDA Global Error]:', { message, source, lineno, colno, error });
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
