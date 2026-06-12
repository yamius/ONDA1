import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { X, Play, Pause, Minimize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCameraPpg } from '../../hooks/useCameraPpg';
import { CameraPulseWindow } from '../CameraPulseWindow';
import { RemoteAudioPlayer } from '../RemoteAudioPlayer';
import { PRACTICE_EXR, PRACTICE_JPEG_PREVIEW } from '../../constants/practiceAssets';
import { emotonCtaUrl } from '../../config/appStore';
import type { AdaptivePractice } from '../../data/adaptivePractices';

/**
 * LandingPractice — the SAME adaptive-practice experience as the app
 * (AdaptivePracticeModal), ported to the website: 3D HDR backdrop + timer +
 * live camera pulse + multi-track guided audio + rotating guiding texts +
 * minimal mode. Full-screen overlay, EN-only content.
 *
 * Web-only divergences from the app (by design): vitals are CAMERA-ONLY
 * (coherence stays null — the watch/app upgrade), and there is NO Supabase save,
 * NO paywall, NO OND persistence, NO analytics. The pure practice, nothing else.
 */

const WelcomeScene = lazy(() => import('../WelcomeScene'));

type PracticeState = 'intro' | 'practice' | 'complete';

interface LandingPracticeProps {
  practice: AdaptivePractice;
  onDone: () => void;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export function LandingPractice({ practice, onDone }: LandingPracticeProps) {
  const { t } = useTranslation('emoton');
  const cam = useCameraPpg();
  const [state, setState] = useState<PracticeState>('intro');
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimal, setIsMinimal] = useState(false);
  const [time, setTime] = useState(0);
  const [gtIndex, setGtIndex] = useState(0);
  const [gtTransition, setGtTransition] = useState(false);
  const [audioResetKey, setAudioResetKey] = useState(0);
  const [cameraOfferDismissed, setCameraOfferDismissed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const panoramaExr = PRACTICE_EXR['p1-1'];
  const panoramaJpeg = PRACTICE_JPEG_PREVIEW['p1-1'];

  // 1 Hz timer + guiding-text rotation (every 15 s), only while running.
  useEffect(() => {
    if (state === 'practice' && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => {
          const nt = prev + 1;
          const gt = practice.guidingTexts;
          if (gt.length > 0) {
            const ni = Math.floor(nt / 15) % gt.length;
            if (ni !== gtIndex) {
              setGtTransition(true);
              setTimeout(() => {
                setGtIndex(ni);
                setTimeout(() => setGtTransition(false), 50);
              }, 1000);
            }
          }
          return nt;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, isPaused, practice, gtIndex]);

  // Free the camera when the practice unmounts.
  useEffect(() => () => { cam.stop(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setState('practice');
    setTime(0);
    setGtIndex(0);
    setIsPaused(false);
    setIsMinimal(false);
    setCameraOfferDismissed(false);
    setAudioResetKey((k) => k + 1);
  };
  const complete = () => {
    cam.stop();
    setIsMinimal(false);
    setState('complete');
  };
  const exit = () => {
    cam.stop();
    onDone();
  };
  const tryAgain = () => {
    setState('intro');
    setTime(0);
    setIsPaused(false);
    setAudioResetKey((k) => k + 1);
  };

  const progress = Math.min(100, Math.round((time / practice.targetTime) * 100));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-3 text-white sm:p-6">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)' }} />

      {/* 3D HDR panorama — live backdrop only while the practice runs. */}
      {state === 'practice' && panoramaExr && (
        <Suspense fallback={null}>
          <WelcomeScene url={panoramaExr} previewUrl={panoramaJpeg} />
        </Suspense>
      )}

      {/* Close (hidden in minimal mode — tap the guiding card to restore). */}
      {!isMinimal && (
        <button
          onClick={exit}
          className="absolute right-6 top-[72px] z-50 rounded-full border border-white/25 bg-white/10 p-3 backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <div className="relative z-10 w-full max-w-2xl">
        {/* ── Intro ─────────────────────────────────────────────────── */}
        {state === 'intro' && (
          <div className="text-center">
            <div className="mb-6 animate-bounce text-5xl sm:text-6xl" style={{ animationDuration: '2s' }}>{practice.emoji}</div>
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{practice.name}</h1>
            <p className="mx-auto mb-8 max-w-md text-sm italic leading-relaxed text-white/75 sm:text-base">{practice.shortPhrase}</p>
            <button
              onClick={start}
              className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-base font-semibold backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20"
            >
              Start
            </button>
          </div>
        )}

        {/* ── Active practice ──────────────────────────────────────────── */}
        {state === 'practice' && (
          <div
            className={`flex flex-col items-center text-white ${isMinimal ? 'justify-end' : 'justify-center'}`}
          >
            {/* Timer circle */}
            {!isMinimal && (
              <div className="relative mx-auto mb-4 mt-1 h-48 w-48 sm:mb-6 sm:h-64 sm:w-64">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <circle
                    cx="128" cy="128" r="110" fill="none" stroke="url(#lpGrad)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 110}`}
                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - time / practice.targetTime)}`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="lpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative mb-2 flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full sm:mb-3 sm:h-16 sm:w-16 sm:-translate-y-5" style={{ animation: 'pulse 2s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))' }}>
                    <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(59,130,246,0.15) 50%, transparent 100%)', filter: 'blur(8px)' }} />
                    <div className="relative text-3xl sm:text-4xl">{practice.emoji}</div>
                  </div>
                  <div className="-translate-y-4 font-mono text-4xl tracking-wider drop-shadow-2xl sm:-translate-y-6 sm:text-6xl" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(time)}
                  </div>
                </div>
              </div>
            )}

            {/* Live camera-pulse window (kept mounted in minimal mode so the
                rolling wave buffer survives — hidden via CSS, not unmounted). */}
            <div className={`w-full max-w-md px-3 sm:px-0 ${isMinimal ? 'hidden' : 'mb-4 sm:mb-5'}`}>
              <CameraPulseWindow
                hasWatch={false}
                displayHeartRate={cam.bpm}
                hrSource="camera"
                coherence={null}
                breathing={null}
                cameraPpg={cam}
                cameraOfferDismissed={cameraOfferDismissed}
                onDismissOffer={() => setCameraOfferDismissed(true)}
              />
            </div>

            {/* Progress bar */}
            {!isMinimal && (
              <div className="mb-4 w-full max-w-md px-3 sm:mb-6 sm:px-0">
                <div className="mb-2 flex justify-between text-sm sm:mb-3 sm:text-base">
                  <span className="font-semibold">Progress</span>
                  <span className="text-xl font-bold sm:text-2xl">{progress}%</span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-full border border-white/20 bg-black/30 shadow-inner sm:h-6">
                  <div className="relative h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-300 transition-all duration-1000" style={{ width: `${progress}%` }}>
                    <div className="absolute inset-0 animate-pulse bg-white/30" />
                  </div>
                </div>
              </div>
            )}

            {/* Guiding text — coaching layer (the sole zen card in minimal mode;
                tap it to restore). */}
            {practice.guidingTexts.length > 0 && (
              <div
                className={`w-full max-w-md px-3 sm:px-0 ${isMinimal ? 'fixed inset-x-0 bottom-10 z-20 mx-auto sm:bottom-14' : 'mb-6 sm:mb-8'}`}
                onClick={isMinimal ? () => setIsMinimal(false) : undefined}
              >
                <div className={`flex flex-col items-center justify-center overflow-hidden rounded-2xl border backdrop-blur-2xl transition-all duration-300 ${isMinimal ? 'h-28 cursor-pointer border-white/30 bg-white/10 p-4 hover:bg-white/20 active:scale-95 sm:h-32 sm:p-6' : 'h-[78px] border-white/15 bg-white/5 px-4 sm:h-[88px] sm:px-6'}`}>
                  <p className={`whitespace-pre-line text-center italic leading-snug transition-all duration-1000 ${isMinimal ? 'text-sm text-white/90 sm:text-base' : 'text-xs text-white/75 sm:text-sm'} ${gtTransition ? 'translate-y-[-20px] opacity-0' : 'translate-y-0 opacity-100'}`}>
                    {practice.guidingTexts[gtIndex]}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            {!isMinimal && (
              <div className="flex gap-3 sm:gap-6">
                <button onClick={() => setIsPaused((p) => !p)} className="rounded-full border border-white/25 bg-white/10 p-3 text-white backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20 sm:p-5">
                  {isPaused ? <Play className="h-6 w-6 sm:h-8 sm:w-8" /> : <Pause className="h-6 w-6 sm:h-8 sm:w-8" />}
                </button>
                <button onClick={complete} className="rounded-full border border-emerald-400/50 bg-emerald-500/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur-2xl transition-all hover:scale-110 hover:bg-emerald-500/40 sm:px-8 sm:py-5 sm:text-base">
                  Complete
                </button>
                <button onClick={() => setIsMinimal((m) => !m)} className="rounded-full border border-white/25 bg-white/10 p-3 text-white backdrop-blur-2xl transition-all hover:scale-110 hover:bg-white/20 sm:p-5">
                  <Minimize2 className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Complete ─────────────────────────────────────────────────── */}
        {state === 'complete' && (
          <div className="text-center">
            <div className="mb-6 animate-bounce text-6xl sm:text-7xl" style={{ animationDuration: '1s' }}>✨</div>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{practice.name}</h2>
            {practice.finalPhrase && (
              <div className="mx-auto mb-6 max-w-md rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-2xl sm:p-6">
                <p className="whitespace-pre-line text-base italic leading-relaxed text-white/90 sm:text-lg">{practice.finalPhrase}</p>
              </div>
            )}

            {/* Post-practice app CTA — the highest-intent click ("your body
                answered"). Routes through the Emoton Tenjin click (source
                emoton_web) → Apple ct `emoton_post_practice`, so one tap feeds
                both Tenjin (install/revenue) and Apple Sources. See emotonCtaUrl
                + the download-tracking brief. */}
            <a
              href={emotonCtaUrl('emoton_post_practice')}
              className="mx-auto mb-6 block max-w-md rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-4 text-sm font-semibold leading-snug text-emerald-50 backdrop-blur-2xl transition-all hover:scale-[1.02] hover:bg-emerald-500/25"
            >
              {t('upgrade_link')}
            </a>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <button onClick={tryAgain} className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition-all hover:bg-white/20 sm:px-8 sm:py-4 sm:text-base">
                Again
              </button>
              <button onClick={onDone} className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition-all hover:bg-white/20 sm:px-8 sm:py-4 sm:text-base">
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guided audio — multi-track from Supabase, plays while running. */}
      {practice.audioSrc && practice.audioSrc.length > 0 && (
        <RemoteAudioPlayer
          isPlaying={state === 'practice' && !isPaused}
          audioPath={practice.audioSrc}
          resetKey={audioResetKey}
        />
      )}
    </div>
  );
}
