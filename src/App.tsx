import { useState, useEffect } from 'react';
import OndaLevel1 from './onda-level1-demo_27';
import AudioTest from './pages/AudioTest';
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
    );
  }

  return (
    <div>
      {/* DEBUG: Audio Test button hidden in production */}
      {/* <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => {
            setShowTest(true);
            window.history.pushState({}, '', '/audio-test');
          }}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-md rounded-lg text-white font-medium transition-all border border-purple-400/30"
          data-testid="button-audio-test"
        >
          🎵 Тест Аудио
        </button>
      </div> */}
      <OndaLevel1 />
    </div>
  );
}

export default App;
