import { useState, useEffect, lazy, Suspense } from 'react';
// Lazy-load the main scene. onda-level1-demo_27.tsx is ~7250 lines with 36
// transitive imports (Three.js, audio engine, all routes) — pulling it into
// the initial bundle pushed cold start to ~6 seconds on iOS. Splitting it
// off lets the boot splash from index.html stay visible while the chunk
// streams in, and the main bundle stays small enough that React mounts and
// fades the splash right away.
const OndaLevel1 = lazy(() => {
  (window as any).ondaBootMark?.('lazy_chunk_import_start');
  return import('./onda-level1-demo_27').then((m) => {
    (window as any).ondaBootMark?.('lazy_chunk_loaded');
    return m;
  });
});
const AudioTest = lazy(() => import('./pages/AudioTest'));
// Регистрируем Android bridge для OAuth callback
import './lib/android-bridge';
// Инициализируем iOS auth handler
import { initIOSAuthHandler } from './lib/ios-auth-handler';

function App() {
  const [showTest, setShowTest] = useState(
    window.location.pathname === '/audio-test' || window.location.search.includes('test=audio')
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

  return (
    <Suspense fallback={null}>
      <MainScene />
    </Suspense>
  );
}

// Thin wrapper around the lazy-loaded scene so we can fire the boot-splash
// fade-out only AFTER the heavy chunk has actually mounted. Putting the
// fade-out in main.tsx (right after createRoot) would have hidden the splash
// while Suspense was still waiting on the dynamic import — leaving an empty
// black screen for those seconds. With this effect the splash stays visible
// for the full chunk load, then crossfades to the live UI.
function MainScene() {
  useEffect(() => {
    (window as any).ondaBootMark?.('main_scene_mounted');
    const splash = document.getElementById('onda-boot-splash');
    if (!splash) return;
    // Hold the splash visible for one extra second so the timing readout
    // is actually readable while we're debugging cold-start perf.
    const fade = setTimeout(() => splash.classList.add('onda-fade-out'), 1000);
    const remove = setTimeout(() => splash.remove(), 1400);
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
    };
  }, []);
  return <OndaLevel1 />;
}

export default App;
