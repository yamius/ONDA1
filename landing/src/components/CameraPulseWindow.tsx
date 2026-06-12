import { useTranslation } from 'react-i18next';
import { MetricsWaveform } from './MetricsWaveform';
import type { useCameraPpg } from '../hooks/useCameraPpg';

interface CameraPulseWindowProps {
  /** Whether a live Apple Watch heart rate is present. This drives the whole
   *  branch: watch → Coherence hero (with Pulse/Breathing corners); no watch →
   *  camera offer card or the live Pulse window. */
  hasWatch: boolean;
  /** The resolved pulse to display — watch HR when present, otherwise the
   *  camera/other source HR (already resolved upstream by useVitals). */
  displayHeartRate: number | null;
  /** vitalsData.hrSource — 'camera' switches the hero readout to "Pulse" and
   *  enables wave smoothing + the rose pulse tone. */
  hrSource: string | null;
  /** vitalsData.coherence — already watch-gated to null for the camera source
   *  (the honesty invariant lives in coherenceForSource). */
  coherence: number | null;
  /** vitalsData.br — the RSA-derived breathing estimate (shown ≈N on watch). */
  breathing: number | null;
  /** The camera-PPG hook instance owned by the parent surface. */
  cameraPpg: ReturnType<typeof useCameraPpg>;
  /** True once the user chose "Continue without" — hides the offer card. */
  cameraOfferDismissed: boolean;
  /** Called when the user dismisses the camera offer. */
  onDismissOffer: () => void;
  /** Window height in px (wave + offer card). Defaults to the basic-practice 176. */
  heightPx?: number;
}

/**
 * The camera-pulse "hero window" extracted verbatim from the basic practice
 * active screen so every practice surface (basic, adaptive, onboarding) shows
 * the SAME thing. The source of truth for the layout lives here now.
 *
 * Renders a fragment: the frosted window box, then the below-window line block.
 * The caller provides the outer `w-full max-w-md` wrapper + its own margins.
 *
 *   no watch + camera idle + offer not dismissed → the OFFER fills the window
 *   otherwise                                     → the live wave + readout
 *
 * Coherence is watch-only; for the camera source the readout is "Pulse" and the
 * below-window line invites an Apple Watch upgrade. Never hard-gated — the offer
 * always shows an equal "Continue without".
 */
export function CameraPulseWindow({
  hasWatch,
  displayHeartRate,
  hrSource,
  coherence,
  breathing,
  cameraPpg,
  cameraOfferDismissed,
  onDismissOffer,
  heightPx = 176,
}: CameraPulseWindowProps) {
  const { t } = useTranslation();
  const isCamera = hrSource === 'camera';

  return (
    <>
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/25 overflow-hidden">
        {!hasWatch && cameraPpg.status === 'idle' && !cameraOfferDismissed ? (
          /* No-watch + camera idle → the OFFER fills the window slot (in place
             of the wave), like the home Connect-Watch CTA sits where the wave
             would be. Keeps the screen compact — no extra card. Never hard-
             gated: "continue without" is equally shown. */
          <div className="flex flex-col items-center justify-center text-center px-5" style={{ height: heightPx }}>
            <div className="text-sm sm:text-base font-medium text-white mb-1">{t('camera.offer_title', 'See your pulse respond live')}</div>
            <p className="text-xs text-white/70 mb-3 max-w-xs">{t('camera.offer_body', 'Rest a fingertip on the rear camera and watch your pulse move with your breath.')}</p>
            <button
              onClick={() => cameraPpg.start()}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all"
              data-testid="camera-offer-start"
            >
              {t('camera.offer_cta', 'Use camera')}
            </button>
            <button
              onClick={onDismissOffer}
              className="mt-2 px-4 py-1 text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors"
              data-testid="camera-offer-skip"
            >
              {t('camera.offer_skip', 'Continue without')}
            </button>
          </div>
        ) : (
          <>
            {/* HR-RSA trend line. For camera, smoothHr eases the 1 Hz integer-bpm
                steps into a calm line while keeping the slow RSA swing (no per-
                beat pulsation). Watch unchanged. */}
            <MetricsWaveform
              heartRate={displayHeartRate}
              stress={null}
              energy={null}
              forceDark
              hrOnly
              smoothHr={isCamera}
              pulseTone={isCamera}
              heightPx={heightPx}
            />
            {/* Top scrim — keeps the readouts legible over the wave */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
            {/* Hero readout — SOURCE-AWARE. Camera → "Pulse" (the wave is your
                pulse; coherence is watch-only). Watch → Coherence centre + Pulse
                (left) / Breathing (right) corners. */}
            {isCamera ? (
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <div className="font-bold leading-none drop-shadow" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {displayHeartRate != null ? (
                    <span className="text-3xl sm:text-4xl">{displayHeartRate}<span className="text-base sm:text-lg font-semibold text-white/70"> bpm</span></span>
                  ) : (
                    <span className="text-2xl sm:text-3xl text-white/60">--</span>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/75 leading-none mb-0.5">
                    {t('practices.coherence')}
                  </div>
                  <div className="font-bold leading-none drop-shadow" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {coherence != null ? (
                      <span className="text-3xl sm:text-4xl">{coherence}<span className="text-lg sm:text-xl font-semibold">%</span></span>
                    ) : (
                      <span className="text-2xl sm:text-3xl text-white/60">--</span>
                    )}
                  </div>
                </div>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white/60">{t('labels.pulse')}</span>
                  <span className="text-xs sm:text-sm font-semibold tabular-nums">{displayHeartRate != null ? displayHeartRate : '--'}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-xs sm:text-sm font-semibold tabular-nums">{breathing != null ? `≈${Math.round(breathing)}` : '--'}</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white/60">{t('settings.br_unit', '/min')}</span>
                </div>
              </>
            )}
            {/* Camera status — instruction text laid directly over the window
                (drop-shadow for legibility, NO background bar). */}
            {!hasWatch && cameraPpg.status !== 'idle' && (
              <div className="absolute inset-x-0 bottom-2 px-4 text-center pointer-events-none">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white drop-shadow-lg">
                  <span className={`w-2 h-2 rounded-full ${cameraPpg.status === 'reading' ? 'bg-emerald-400 animate-pulse' : cameraPpg.fingerOn ? 'bg-amber-300 animate-pulse' : 'bg-white/50'}`} />
                  <span>
                    {cameraPpg.status === 'reading'
                      ? t('camera.live', 'Live — your pulse is responding')
                      : cameraPpg.status === 'requesting'
                        ? t('camera.opening', 'Opening camera…')
                        : cameraPpg.status === 'denied' || cameraPpg.status === 'error'
                          ? t('camera.denied', 'Camera unavailable — continuing without it.')
                          : cameraPpg.fingerOn
                            ? t('camera.reading', 'Got your finger — hold still, reading your pulse…')
                            : t('camera.place_finger', 'Rest a fingertip on the rear camera')}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Landing is pulse-only — no Apple-Watch coherence upsell below the
          window. Keep just the no-torch hint while the camera is running. */}
      {!hasWatch && (cameraPpg.status === 'searching' || cameraPpg.status === 'reading') && !cameraPpg.torchOn && (
        <div className="mt-1 text-center leading-tight">
          <p className="text-[11px] text-amber-300/80">{t('camera.no_torch', "Couldn't turn on the flash — try in good light.")}</p>
        </div>
      )}
      {import.meta.env.VITE_PPG_DEBUG === 'true' && cameraPpg.status !== 'idle' && (
        <div className="mt-1 text-center text-[10px] font-mono text-white/50">
          ppg bpm={cameraPpg.bpm ?? '—'} conf={cameraPpg.confidence.toFixed(2)} {cameraPpg.status} finger={String(cameraPpg.fingerOn)} torch={String(cameraPpg.torchOn)} r={cameraPpg.debug.r} clip={cameraPpg.debug.clip.toFixed(2)} red={cameraPpg.debug.redness.toFixed(2)}
        </div>
      )}
    </>
  );
}
