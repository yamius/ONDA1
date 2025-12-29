import { useState } from 'react';
import { RemoteAudioPlayer } from '../components/RemoteAudioPlayer';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function AudioTest() {
  const [isPlayingSingle, setIsPlayingSingle] = useState(false);
  const [isPlayingMulti, setIsPlayingMulti] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [totalTracks, setTotalTracks] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Relative paths for useAudioCache (bucket prefix is added automatically)
  const singleTrackPath = 'p1/p1-1_Breath of Life/p1-1_Breath of Life-1.mp3';
  
  const multiTrackPaths = [
    'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3',
    'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-2.mp3',
    'Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-3.mp3',
  ];

  const handleReset = () => {
    setIsPlayingSingle(false);
    setIsPlayingMulti(false);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
            🎵 Тест загрузки аудио с CDN
          </h1>
          <p className="text-blue-200 text-sm sm:text-base">
            Проверка системы lazy loading и кеширования аудио файлов
          </p>
        </div>

        <div className="space-y-6">
          {/* Single Track Test */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-2 text-white">Тест одиночного трека</h2>
            <p className="text-blue-200 text-sm mb-4">
              Загрузка и воспроизведение одного аудио файла
            </p>

            <div className="space-y-4">
              <button
                data-testid="button-play-single"
                onClick={() => setIsPlayingSingle(!isPlayingSingle)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isPlayingSingle
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isPlayingSingle ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Воспроизвести
                  </>
                )}
              </button>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Загрузка...</span>
                    <span className="font-medium text-white">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-blue-200 bg-white/5 p-3 rounded-lg">
                <p>📁 <strong>Файл:</strong> p1-1_Breath of Life-1.mp3</p>
                <p>🌐 <strong>Источник:</strong> Supabase Storage CDN</p>
              </div>

              <RemoteAudioPlayer
                isPlaying={isPlayingSingle}
                audioPath={singleTrackPath}
                fadeInDuration={1000}
                fadeOutDuration={1000}
                volume={0.8}
                resetKey={resetKey}
                onLoadingChange={(loading, progress) => {
                  setIsLoading(loading);
                  setLoadingProgress(progress);
                }}
              />
            </div>
          </div>

          {/* Multi Track Test */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-2 text-white">Тест мультитрека</h2>
            <p className="text-blue-200 text-sm mb-4">
              Автоматическое переключение между треками с предзагрузкой
            </p>

            <div className="space-y-4">
              <button
                data-testid="button-play-multi"
                onClick={() => setIsPlayingMulti(!isPlayingMulti)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isPlayingMulti
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isPlayingMulti ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Воспроизвести плейлист
                  </>
                )}
              </button>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Трек</span>
                  <span className="font-medium text-white">
                    {currentTrack} из {totalTracks}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentTrack / totalTracks) * 100}%` }}
                  />
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Загрузка трека {currentTrack}...</span>
                    <span className="font-medium text-white">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-blue-200 bg-white/5 p-3 rounded-lg">
                <p>📀 <strong>Плейлист:</strong> Adaptive Body Cocoon (3 трека)</p>
                <p>🔄 <strong>Функции:</strong> Автопереключение с предзагрузкой</p>
              </div>

              <RemoteAudioPlayer
                isPlaying={isPlayingMulti}
                audioPath={multiTrackPaths}
                fadeInDuration={1000}
                fadeOutDuration={1000}
                volume={0.8}
                resetKey={resetKey}
                onTrackChange={(current, total) => {
                  setCurrentTrack(current);
                  setTotalTracks(total);
                }}
                onLoadingChange={(loading, progress) => {
                  setIsLoading(loading);
                  setLoadingProgress(progress);
                }}
                showLoadingIndicator
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <button
              data-testid="button-reset"
              onClick={handleReset}
              className="w-full px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white"
            >
              <RotateCcw className="w-5 h-5" />
              Сбросить все плееры
            </button>
          </div>

          {/* Cache Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-4 text-white">ℹ️ Информация о кешировании</h2>
            <div className="space-y-3 text-sm text-blue-100">
              <p>✅ <strong className="text-white">Cache API:</strong> Быстрый доступ к закешированным файлам</p>
              <p>✅ <strong className="text-white">IndexedDB:</strong> Персистентное хранилище (выживает перезагрузку)</p>
              <p>✅ <strong className="text-white">Retry Logic:</strong> 3 попытки с exponential backoff</p>
              <p>✅ <strong className="text-white">AbortController:</strong> Корректная отмена загрузок</p>
              <p>✅ <strong className="text-white">Blob URL Cleanup:</strong> Предотвращение утечек памяти</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
