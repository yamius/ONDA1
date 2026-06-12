import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCameraPpg } from '../../hooks/useCameraPpg';
import type { PracticeDirection } from '../../lib/emotonCore';

/**
 * EmotonPractice — the ONLY branch that touches the sensor (brief: sensor connects
 * only at the practice branch). A simplified breathing practice with a LIVE camera
 * pulse: lead with the responsive visual (a breathing pacer + the pulse trend
 * moving with the breath), NOT a precise number. ppgCore commits a bpm only when
 * confident and blanks otherwise — never smoothed into fake precision.
 *
 * Camera = PULSE ONLY. No coherence/HRV here — that stays the watch/app upgrade.
 * Never hard-gated: "Continue without the camera" runs the pacer alone.
 */

interface EmotonPracticeProps {
  /** Existing in-app practice id this maps to (for the upgrade continuation). */
  practiceId: string;
  /** Localized label of the practice / its felt intent (resolved by the page). */
  title: string;
  intent: string;
  /** Regulation direction — keeps the web pacer honest to the brief's asymmetry:
   *  freeze/expansive get a gentler-but-brisker rise (NOT a calming pacer). */
  direction?: PracticeDirection;
  onDone: () => void;
}

const MAX_TREND = 48;

export function EmotonPractice({ practiceId, title, intent, direction, onDone }: EmotonPracticeProps) {
  const { t } = useTranslation('emoton');
  const cam = useCameraPpg();
  const [offered, setOffered] = useState(true); // show the camera offer first
  const [usingCamera, setUsingCamera] = useState(false);

  // Direction-aware pacer: down/deepen = slow settle; gentle_up/channel = a
  // brisker gentle rise (so freeze is never given a calming pacer). The
  // differentiated, audio-guided practice itself is in-app.
  const up = direction === 'gentle_up' || direction === 'channel';
  const cycleSec = up ? 7 : 12;
  const cue = up ? t('practice.pacer_cue_rise') : t('practice.pacer_cue_breathe');

  // Pulse trend ring-buffer — the "responsive visual". Pushed only on a committed
  // reading; blanks when the engine isn't confident (no fabricated line).
  const trendRef = useRef<number[]>([]);
  const [, force] = useState(0);
  useEffect(() => {
    if (cam.status === 'reading' && cam.bpm != null) {
      const tr = trendRef.current;
      tr.push(cam.bpm);
      if (tr.length > MAX_TREND) tr.shift();
      force((n) => n + 1);
    }
  }, [cam.status, cam.bpm]);

  const startCamera = () => {
    setOffered(false);
    setUsingCamera(true);
    cam.start();
  };
  const skipCamera = () => {
    setOffered(false);
    setUsingCamera(false);
  };
  const finish = () => {
    cam.stop();
    onDone();
  };

  // Build the trend polyline (delta-from-mean so the breath-linked rise/fall reads
  // as movement, not absolute level). Calm flat line when we have too little.
  const trend = trendRef.current;
  const W = 320, H = 90;
  let path = '';
  if (trend.length >= 2) {
    const min = Math.min(...trend), max = Math.max(...trend);
    const span = Math.max(4, max - min);
    path = trend
      .map((v, i) => {
        const x = (i / (MAX_TREND - 1)) * W;
        const y = H - 8 - ((v - min) / span) * (H - 16);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <div className="flex flex-col items-center text-center">
      <style>{`
        @keyframes emoton-breathe { 0%,100% { transform: scale(0.62); } 45%,55% { transform: scale(1); } }
        @keyframes emoton-glow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.7; } }
      `}</style>

      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{intent}</p>
      <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>

      {offered ? (
        <div className="mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/80">{t('practice.camera_offer_title')}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/55">{t('practice.camera_offer_description')}</p>
          <button
            onClick={startCamera}
            className="mt-4 w-full rounded-full bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/30"
          >
            {t('practice.camera_use_cta')}
          </button>
          <button
            onClick={skipCamera}
            className="mt-2 w-full text-xs text-white/45 underline underline-offset-4 transition-colors hover:text-white/70"
          >
            {t('practice.camera_skip')}
          </button>
        </div>
      ) : (
        <>
          {/* Breathing pacer — the lead visual, always present. Follow it in/out. */}
          <div className="relative mt-8 flex h-56 w-56 items-center justify-center">
            <div
              className="absolute h-40 w-40 rounded-full bg-cyan-400/15"
              style={{ animation: `emoton-glow ${cycleSec}s ease-in-out infinite` }}
            />
            <div
              className="h-40 w-40 rounded-full border border-cyan-300/40 bg-gradient-to-b from-cyan-400/25 to-transparent"
              style={{ animation: `emoton-breathe ${cycleSec}s ease-in-out infinite` }}
            />
            <span className="absolute font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
              {cue}
            </span>
          </div>

          {usingCamera && (
            <div className="mt-6 w-full max-w-sm">
              {/* Live pulse trend — responsive visual; blanks when not confident */}
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} aria-hidden="true">
                {path ? (
                  <path d={path} fill="none" stroke="rgba(244,63,94,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 6" />
                )}
              </svg>
              <div className="mt-1 flex items-center justify-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full ${cam.status === 'reading' ? 'bg-rose-400' : cam.fingerOn ? 'bg-amber-300' : 'bg-white/40'}`} style={cam.status === 'reading' ? { animation: 'emoton-glow 1.2s ease-in-out infinite' } : undefined} />
                <span className="text-white/70">
                  {cam.status === 'reading'
                    ? t('practice.camera_status_reading')
                    : cam.status === 'requesting'
                      ? t('practice.camera_status_requesting')
                      : cam.status === 'denied' || cam.status === 'error'
                        ? t('practice.camera_status_denied')
                        : cam.fingerOn
                          ? t('practice.camera_status_finger_on')
                          : t('practice.camera_status_waiting')}
                </span>
              </div>
              {/* Pulse number is SECONDARY and blanks when not confident — never bluffs. */}
              <div className="mt-1 font-mono text-sm text-white/60">
                {cam.status === 'reading' && cam.bpm != null ? (
                  <span>{cam.bpm}<span className="text-white/40"> {t('practice.camera_bpm_label')}</span></span>
                ) : (
                  <span className="text-white/30">{t('practice.camera_bpm_no_reading')}</span>
                )}
              </div>
              {!cam.torchOn && (cam.status === 'searching' || cam.status === 'reading') && (
                <p className="mt-1 text-[11px] text-amber-300/70">{t('practice.camera_no_flash_note')}</p>
              )}
              <p className="mt-1 text-[11px] text-white/35">{t('practice.camera_coherence_note')}</p>
            </div>
          )}

          <button
            onClick={finish}
            className="mt-8 rounded-full bg-emerald-500/20 px-8 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/30"
          >
            {t('practice.done_cta')}
          </button>

          {/* Upgrade hook — the download is the precision/coherence/journey upgrade,
              not "see anything live at all" (you already saw it live above). */}
          <a
            href="/#download"
            className="mt-3 text-xs text-white/45 underline underline-offset-4 transition-colors hover:text-white/70"
            data-practice={practiceId}
          >
            {t('practice.upgrade_link')}
          </a>
        </>
      )}
    </div>
  );
}
