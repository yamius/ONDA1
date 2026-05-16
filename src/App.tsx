import { useState, useEffect, lazy, Suspense } from 'react';
// Lazy-load the main scene. onda-level1-demo_27.tsx is ~7250 lines with 36
// transitive imports (Three.js, audio engine, all routes) — pulling it into
// the initial bundle pushed cold start to ~6 seconds on iOS. Splitting it
// off keeps the initial bundle small (~100ms total to first paint) and
// streams the heavy chunk in parallel.
const OndaLevel1 = lazy(() => import('./onda-level1-demo_27'));
const AudioTest = lazy(() => import('./pages/AudioTest'));
// Dev-спайк проверки eye-scan (getUserMedia + MediaPipe), роут /eye-scan
const EyeScanSpike = lazy(() => import('./pages/EyeScanSpike'));
// Регистрируем Android bridge для OAuth callback
import './lib/android-bridge';
// Инициализируем iOS auth handler
import { initIOSAuthHandler } from './lib/ios-auth-handler';

function App() {
  const [showTest, setShowTest] = useState(
    window.location.pathname === '/audio-test' || window.location.search.includes('test=audio')
  );
  const [showEyeScan] = useState(
    window.location.pathname === '/eye-scan' || window.location.search.includes('test=eyescan')
  );

  useEffect(() => {
    initIOSAuthHandler();
  }, []);

  if (showTest) {
    return (
      <Suspense fallback={null}>
        <div>
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => {
                setShowTest(false);
                window.history.pushState({}, '', '/');
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white font-medium transition-all border border-white/30"
              data-testid="button-back-to-app"
            >
              ← Вернуться в приложение
            </button>
          </div>
          <AudioTest />
        </div>
      </Suspense>
    );
  }

  if (showEyeScan) {
    return (
      <Suspense fallback={null}>
        <EyeScanSpike />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <OndaLevel1 />
    </Suspense>
  );
}

export default App;
