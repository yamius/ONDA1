import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { langFromPath, langHref } from '../i18n';
import {
  ZONE_ORDER,
  ZONES,
  requiresFirstMove,
  isHopelessnessShade,
  type ZoneId,
  type RoutedBranch,
} from '../lib/emotonCore';
import { LandingPractice } from '../components/emoton/LandingPractice';
import { FeelingShape } from '../components/emoton/FeelingShape';
import { ADAPTIVE_PRACTICES } from '../data/adaptivePractices';
import { useCameraPpg } from '../hooks/useCameraPpg';
import { appStoreUrl } from '../config/appStore';
import { rdtTrack } from '../lib/redditPixel';
import { startEmotonSession, track, trackDownloadClick } from '../lib/emotonAnalytics';

// be-with register shown for a zone (stable analytics key, not a UI string).
const registerFor = (z: ZoneId | null): 'soak' | 'settle' | 'near' | 'soft' =>
  z === 'regulated' || z === 'expansive' ? 'soak' : z === 'grief' ? 'near' : z === 'freeze' ? 'soft' : 'settle';

/**
 * Emoton — the deliberate, owned emotional check-in ("I name what I feel").
 * A 4-step contact cycle → wheel → named want → branch (practice with live camera
 * pulse / be-with visualization / release / support). EN + RU (i18n namespace
 * 'emoton'), no persistence, no free text, agency-never-assessment. Pure routing
 * lives in emotonCore; this page is the surface. The sensor connects ONLY in the
 * practice branch.
 */

type Step =
  | 'presence'
  | 'wheel'
  | 'own'
  | 'freeze_move'
  | 'practice'
  | 'be_with'
  | 'release'
  | 'support'
  | 'assimilation';

const surface = 'rounded-2xl border border-white/10 bg-white/5';

export function EmotonPage() {
  const { t } = useTranslation('emoton');
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const [step, setStep] = useState<Step>('presence');
  const [zone, setZone] = useState<ZoneId | null>(null);
  const [shade, setShade] = useState<string | null>(null);
  const [branch, setBranch] = useState<RoutedBranch | null>(null);
  // Я proportion for the be-with gauge — drives graded moves + the support
  // trigger. NEVER shown as a number; conveyed via the circle region sizes.
  const [selfFraction, setSelfFraction] = useState(0.5);
  // Live camera pulse for the be-with step (idle until the user taps "connect").
  const cameraPpg = useCameraPpg();
  const haloRef = useRef<HTMLDivElement | null>(null);
  const bpmRef = useRef<number | null>(null);
  bpmRef.current = cameraPpg.bpm;

  useEffect(() => {
    document.title = t('page_title');
  }, [t]);

  // Analytics: open the in-tool funnel session once on mount (PostHog only).
  useEffect(() => {
    void startEmotonSession();
  }, []);

  // Analytics: funnel milestones with multiple entry points are tracked on step
  // entry, deduped by step so StrictMode's double-invoked effect can't double-count.
  const lastTrackedStep = useRef<Step | null>(null);
  useEffect(() => {
    if (lastTrackedStep.current === step) return;
    lastTrackedStep.current = step;
    if (step === 'be_with') track('bewith_entered', { register: registerFor(zone), zone });
    else if (step === 'assimilation') {
      track('assimilation_reached');
      track('download_cta_viewed', { placement: 'emoton_post_practice' });
    } else if (step === 'release') {
      track('download_cta_viewed', { placement: 'emoton_post_practice' });
    }
  }, [step, zone]);

  // Heartbeat halo: a rAF phase-accumulator writes --fs-halo-op on the be-with orb
  // wrapper. Phase runs continuously; the period EASES toward 60/bpm and amplitude
  // eases in/out — so a new pulse rate transitions smoothly (no blink jump). Reads
  // the live bpm via a ref, so the loop never restarts (and never resets phase).
  useEffect(() => {
    if (step !== 'be_with') return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let phase = 0;
    let period = 0.9; // s — smoothed toward 60/bpm
    let amp = 0; // 0 = no pulse (static), 1 = full beat
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const bpm = bpmRef.current;
      if (bpm) period += (120 / bpm - period) * Math.min(1, dt * 1.2); // ×2 → flash every OTHER beat
      phase = (phase + dt / period) % 1;
      const beat =
        phase < 0.18 ? 1 - 0.55 * (phase / 0.18) // longer bright phase → gentle decay
          : phase < 0.9 ? 0.45 // softer rest floor (less aggressive contrast)
            : 0.45 + 0.55 * ((phase - 0.9) / 0.1); // gentle rise into next pulse
      amp += ((bpm ? 1 : 0) - amp) * Math.min(1, dt * 2);
      const op = 1 - amp * (1 - beat);
      haloRef.current?.style.setProperty('--fs-halo-op', op.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const restart = () => {
    track('restarted');
    cameraPpg.stop();
    setStep('presence');
    setZone(null);
    setShade(null);
    setBranch(null);
    setSelfFraction(0.5);
  };

  // Tapping the "Emoton" nav item while already on /emoton doesn't remount this
  // page (same route), so the in-flow step would persist. The nav fires an
  // `emoton:reset` event on click; reset the whole flow back to the start. (All
  // setters are stable, so no deps are needed.)
  useEffect(() => {
    const onReset = () => {
      setStep('presence');
      setZone(null);
      setShade(null);
      setBranch(null);
      setSelfFraction(0.5);
    };
    window.addEventListener('emoton:reset', onReset);
    return () => window.removeEventListener('emoton:reset', onReset);
  }, []);

  const pickShade = (shadeId: string) => {
    setShade(shadeId);
    // A hopelessness/meaninglessness shade routes straight to the gentle off-ramp.
    // The crisis path is deliberately NOT eventized (no shade_selected, no
    // conversion) — see the analytics brief's privacy rules.
    if (isHopelessnessShade(shadeId)) {
      setStep('support');
      return;
    }
    // Check-in complete: the feeling is named and the 'own' step shows the result.
    // This is the genuine "tool used" moment.
    track('shade_selected', { zone, shade: shadeId }); // PostHog only (most sensitive)
    rdtTrack('Custom', { customEventName: 'emoton_used' }); // generic ad conversion — no emotion
    setStep('own');
  };

  // The own step now offers exactly THREE universal actions (identical on every
  // feeling): practice (the cluster's route) · be-with · "I know what to do"
  // (acknowledge & close). No per-zone custom wants.
  const goPractice = () => {
    if (!zone) return;
    track('route_selected', { route: 'practice', zone });
    const z = ZONES[zone];
    if (!z.practiceId || !z.practiceDirection) return setStep('be_with');
    setBranch({ branch: 'practice', practiceId: z.practiceId, practiceDirection: z.practiceDirection });
    if (requiresFirstMove(zone)) return setStep('freeze_move');
    return setStep('practice');
  };

  const z = zone ? ZONES[zone] : null;
  const shadeLabel = shade ? t(`shade.${shade}`) : '';
  // All gendered forms are read from PER-LANGUAGE maps in the locale JSON — each
  // language supplies its own grammar (RU/UK: 3 genders; ES: mi + tuyo/tuya, él/ella;
  // ZH: invariant). No grammar derivation in code. Sensible fallbacks for the rest.
  const g = (map: string, dflt: string) => (shade ? t(`${map}.${shade}`, { defaultValue: dflt }) : dflt);
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const shadeAcc = g('shade_acc', shadeLabel); // accusative of the feeling
  const ownPoss = g('own_poss', ''); // "my" (gendered): моя/мій/mi/我的
  const ownPron = g('own_pron', 'it'); // "it": оно/воно/él/它
  const ownPronCap = cap(ownPron);
  const ownPronInst = g('own_pron_inst', ownPron); // "with it": с ней/нею/con él
  const ownPronDat = g('own_pron_dat', ownPron); // "to it": ей/їй/le
  const ownPossYour = g('own_poss_your', ownPoss); // "yours": твоя/твій/tuya
  const ownPossYourCap = cap(ownPossYour);
  // Per-emotion "be with it" copy; fight/flight keep the default "settle" line.
  const beWithDescKey =
    zone === 'regulated' || zone === 'expansive'
      ? 'soak'
      : zone === 'grief'
        ? 'near'
        : zone === 'freeze'
          ? 'soft'
          : 'description_no_pick';

  return (
    <>
      <div className="relative mx-auto flex min-h-[80vh] max-w-md flex-col items-center overflow-x-hidden px-5 pb-10 -mt-4 pt-0 text-white">
      <style>{`
        @keyframes emoton-swell { 0% { transform: scale(0.7); opacity:.7 } 50% { transform: scale(1.06); opacity:1 } 100% { transform: scale(0.74); opacity:.8 } }
        @keyframes emoton-rise  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes emoton-breathe { 0%,100% { transform: scale(1); opacity:.9 } 50% { transform: scale(1.06); opacity:1 } }
        /* Each step fades in on mount. Opacity-only — no transform — so the
           centre orb stays anchored across steps (no jump). */
        @keyframes emoton-step-in { from { opacity: 0 } to { opacity: 1 } }
        .emoton-step { animation: emoton-step-in .5s ease both }
        @media (prefers-reduced-motion: reduce) { .emoton-step { animation: none } }
      `}</style>

      {/* ── 1. Presence (Я) ─────────────────────────────────────────────── */}
      {step === 'presence' && (
        <div className="emoton-step flex flex-1 flex-col items-center justify-start text-center">
          {/* The orb is the tap target — touch it to begin (the copy below invites
              "коснись своего Я"). Top-anchored with a margin that lands the orb at
              the SAME centre as the wheel orb (prompt + wheel half) — no jump on
              presence → wheel. The title/description float below it absolutely. */}
          <div className="relative mt-[99px]">
            <button
              onClick={() => { track('presence_started'); setStep('wheel'); }}
              aria-label={t('presence.cta')}
              className="flex h-[162px] w-[162px] items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/10 to-transparent transition-shadow hover:border-cyan-300/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
              style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}
            >
              <span className="text-3xl font-light tracking-wide text-white/90">{t('be_with.self_label')}</span>
            </button>
            <div className="absolute left-1/2 top-full w-[80vw] max-w-xs -translate-x-1/2 text-center">
              <p className="mt-8 text-2xl font-semibold">{t('presence.title')}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{t('presence.description')}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Wheel → zone → shade ─────────────────────────────────────── */}
      {step === 'wheel' && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-start">
          {/* Raised: the wheel hangs from the very top (Спокойствие's top edge sits
              at the old prompt line). The section prompt sits just BELOW the wheel and
              is swapped IN PLACE for the shade prompt + chips once a zone is picked.
              presence/own share the same raised top margin so the centre orb never
              jumps between steps; the picker floats absolutely so it never shifts it. */}
          <div className="relative mt-0 h-[360px] w-[360px]">
            {/* Center orb — identical to the presence orb (size + cyan gradient
                + breathe). Tapping "Я" returns to centre: it clears the current
                zone choice (and the shade picker), so you can re-feel the wheel. */}
            <button
              onClick={() => { setZone(null); setShade(null); }}
              className="absolute left-1/2 top-1/2 flex h-[162px] w-[162px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/10 to-transparent text-3xl font-light tracking-wide text-white/90 transition-shadow hover:border-cyan-300/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50" style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}>
              {t('be_with.self_label')}
            </button>
            {ZONE_ORDER.map((zid, i) => {
              const angle = (-90 + i * 60) * (Math.PI / 180);
              // 44% ring radius; the TOP (i=0) and BOTTOM (i=3) zones sit a bit
              // closer to the orb (only their vertical offset changes — cos=0 there).
              const ringR = i === 0 || i === 3 ? 40 : 44;
              const left = 50 + ringR * Math.cos(angle);
              const top = 50 + ringR * Math.sin(angle);
              const active = zone === zid;
              return (
                <button
                  key={zid}
                  onClick={() => { setZone(zid); track('zone_selected', { zone: zid }); }}
                  className={`absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2 py-2 text-center text-[11px] font-medium leading-tight transition-colors ${
                    active ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  {t(`zone.${zid}`)}
                </button>
              );
            })}
            {/* Below the wheel: the section prompt — swapped IN PLACE for the shade
                prompt + chips once a zone is picked (same slot, step 1 → step 2). */}
            {!z && (
              <p className="absolute left-1/2 top-full mt-3 w-[92vw] max-w-md -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">
                {t('wheel.prompt')}
              </p>
            )}
            {z && (
              <div className="absolute left-1/2 top-full mt-3 w-[92vw] max-w-md -translate-x-1/2 text-center">
                <p className="text-xs text-white/45">{t('wheel.shade_prompt')}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {z.shades.map((sh) => (
                    <button
                      key={sh}
                      onClick={() => pickShade(sh)}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10"
                    >
                      {t(`shade.${sh}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Own it + name the want ───────────────────────────────────── */}
      {step === 'own' && zone && shade && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-start text-center">
          {/* Я orb — SAME size + place as presence/wheel (the constant anchor:
              176px, centred, same top margin). The feeling is a SEPARATE entity
              beside it, positioned absolutely so the orb itself never moves —
              "я и оно", together but not merged. Copy + wants flow below. */}
          <div className="relative mt-[99px]">
            {/* Ambient feeling field — the darkness around the orb stirs/gathers.
                In the diffuse state it PERMEATES and surrounds the orb (you're
                partly in it, no boundary); the "two beside each other" separation
                only appears once it gathers form (formedness → 1, a later step). */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 0 }}>
              <FeelingShape zone={zone} />
            </div>
            <div className="relative z-10 flex h-[162px] w-[162px] items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/10 to-transparent text-3xl font-light tracking-wide text-white/90" style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}>
              {t('be_with.self_label')}
            </div>
          </div>
          <h2 className="mt-7 text-2xl font-semibold">{t('own.title', { shade: shadeLabel, poss: ownPoss })}</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-white/55">{t('own.description', { pron: ownPron, pronCap: ownPronCap, possYour: ownPossYour })}</p>
          <div className="mt-5 w-full space-y-2">
            <button
              onClick={goPractice}
              className={`${surface} w-full px-5 py-3 text-left text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10`}
            >
              {t(`action.practice.${zone}`, { shadeAcc })}
            </button>
            <button
              onClick={() => { track('route_selected', { route: 'be_with', zone }); setStep('be_with'); }}
              className={`${surface} w-full px-5 py-3 text-left text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10`}
            >
              {t('action.be_with', { pronInst: ownPronInst })}
            </button>
            <button
              onClick={() => { track('route_selected', { route: 'know', zone }); setStep('release'); }}
              className={`${surface} w-full px-5 py-3 text-left text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10`}
            >
              {t('action.know')}
            </button>
          </div>
        </div>
      )}

      {/* ── Freeze first-move (tiny, impossible-to-fail) → gentle-up ─────── */}
      {step === 'freeze_move' && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{t('freeze_move.meta')}</p>
          <h2 className="mt-2 text-xl font-semibold">{t('freeze_move.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">{t('freeze_move.description')}</p>
          <FreezeStroke onDone={() => setStep('practice')} />
          <button onClick={restart} className="mt-4 text-xs text-white/40 underline underline-offset-4 hover:text-white/70">
            {t('freeze_move.cancel')}
          </button>
        </div>
      )}

      {/* ── Practice branch (the ONLY sensor branch) ────────────────────── */}
      {/* The real adaptive practice, ported 1:1 from the app: 3D backdrop +
          guided audio + live camera pulse. Renders as a full-screen overlay. */}
      {step === 'practice' && branch?.practiceId && ADAPTIVE_PRACTICES[branch.practiceId] && (
        <LandingPractice
          practice={ADAPTIVE_PRACTICES[branch.practiceId]}
          onStart={() => track('practice_started', { practice_id: branch?.practiceId, camera: false })}
          onComplete={({ camera, durationS }) =>
            track('practice_completed', { practice_id: branch?.practiceId, duration_s: durationS, camera })
          }
          onDone={() => setStep('assimilation')}
        />
      )}

      {/* ── Be-with visualization (no sensor) ───────────────────────────── */}
      {step === 'be_with' && shade && (
        <div className="emoton-step relative flex w-full flex-1 flex-col items-center justify-start text-center">
          {/* Our Я orb with the emotion's ray field behind it, anchored at the SAME
              spot as presence/wheel/own (mt-[99px] → centre 180) so it never jumps.
              "Growing the Self" recedes the feeling: the rays scale down as
              selfFraction rises above the 0.5 baseline; the orb stays the anchor. */}
          <div ref={haloRef} className="relative mt-[99px] flex items-center justify-center">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{
                zIndex: 0,
                transform: `translate(-50%, -50%) scale(${(1 - Math.max(0, selfFraction - 0.5) * 0.8).toFixed(3)})`,
                transition: 'transform 1.2s ease',
              }}
            >
              {zone && <FeelingShape zone={zone} />}
            </div>
            <div
              className="relative z-10 flex h-[162px] w-[162px] items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/10 to-transparent text-3xl font-light tracking-wide text-white/90"
              style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}
            >
              {t('be_with.self_label')}
            </div>
          </div>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{t(`be_with.${beWithDescKey}`, { pronCap: ownPronCap, pronDat: ownPronDat, pronInst: ownPronInst, possYourCap: ownPossYourCap, shade: shadeLabel })}</p>

          {cameraPpg.status === 'idle' ? (
            <div className="mt-8 flex flex-col items-center">
              <button onClick={() => cameraPpg.start()} className="rounded-full bg-cyan-500/20 px-7 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30">
                {t('be_with.camera_cta')}
              </button>
              <p className="mt-3 text-sm font-medium text-white/70">{t('be_with.camera_title')}</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-white/45">{t('be_with.camera_hint')}</p>
            </div>
          ) : (
            /* Camera connecting / live — accompanying status text + bpm, right here. */
            <div className="mt-7 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 text-sm text-white/80">
                <span className={`h-2 w-2 rounded-full ${cameraPpg.status === 'reading' ? 'bg-emerald-400' : cameraPpg.fingerOn ? 'bg-amber-300' : 'bg-white/40'} ${cameraPpg.status === 'denied' || cameraPpg.status === 'error' ? '' : 'animate-pulse'}`} />
                <span>
                  {cameraPpg.status === 'requesting'
                    ? t('practice.camera_status_requesting')
                    : cameraPpg.status === 'reading'
                      ? t('practice.camera_status_reading')
                      : cameraPpg.status === 'denied' || cameraPpg.status === 'error'
                        ? t('practice.camera_status_denied')
                        : cameraPpg.fingerOn
                          ? t('practice.camera_status_finger_on')
                          : t('practice.camera_status_waiting')}
                </span>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-cyan-100">{cameraPpg.bpm != null ? cameraPpg.bpm : '—'}</div>
            </div>
          )}

          {/* Finish + start-over — matched footer styling, a divider between them. */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <button onClick={() => { cameraPpg.stop(); setStep('assimilation'); }} className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
              {t('be_with.finish_cta')}
            </button>
            <span className="h-px w-12 bg-white/15" />
            <button onClick={restart} className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
              {t('start_over')}
            </button>
          </div>
        </div>
      )}

      {/* ── Release branch (real-world action / "other" / "nothing") ─────── */}
      {step === 'release' && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-3xl">↗</div>
          <h2 className="mt-6 text-xl font-semibold">{t('release.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">{t('release.description')}</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">{t('assimilation.invite')}</p>
          <div className="mt-5 flex w-full max-w-xs flex-col gap-3">
            <a
              href={appStoreUrl('emoton')}
              target="_blank"
              rel="noopener"
              onClick={() => trackDownloadClick('emoton_post_practice')}
              className="flex items-center justify-center rounded-full bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/30"
            >
              {t('assimilation.app_store')}
            </a>
            <a
              href="/#download"
              onClick={() => trackDownloadClick('emoton_post_practice')}
              className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              {t('assimilation.google_play')}
            </a>
          </div>
          <button onClick={restart} className="mt-5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
            {t('start_over')}
          </button>
        </div>
      )}

      {/* ── Support off-ramp (gentle, never an alarm) ───────────────────── */}
      {step === 'support' && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-2xl">♡</div>
          <h2 className="mt-6 text-xl font-semibold">{t('support.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">{t('support.description')}</p>
          <div className={`${surface} mt-6 w-full px-5 py-4 text-sm`}>
            <p className="font-semibold text-white/90">{t('support.lifeline_title')}</p>
            <p className="mt-1 text-white/60">
              {t('support.lifeline_call')}{' '}
              <a href={t('support.lifeline_url')} className="text-cyan-300 underline underline-offset-2" target="_blank" rel="noreferrer">{t('support.lifeline_number')}</a>
              {t('support.lifeline_hours') ? ` ${t('support.lifeline_hours')}` : ''}
            </p>
          </div>
          <button onClick={restart} className="mt-6 text-xs text-white/45 underline underline-offset-4 hover:text-white/70">
            {t('support.close_cta')}
          </button>
        </div>
      )}

      {/* ── Assimilation close (after a practice; no new cycle) ──────────── */}
      {step === 'assimilation' && (
        <div className="emoton-step flex w-full flex-1 flex-col items-center justify-start text-center">
          {/* Same Я orb + ray field as the rest of the flow (anchored at centre 180). */}
          <div className="relative mt-[99px] flex items-center justify-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 0 }}>
              {zone && <FeelingShape zone={zone} />}
            </div>
            <div
              className="relative z-10 flex h-[162px] w-[162px] items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/10 to-transparent text-3xl font-light tracking-wide text-white/90"
              style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}
            >
              {t('be_with.self_label')}
            </div>
          </div>
          <h2 className="mt-7 text-xl font-semibold">{t('assimilation.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">{t('assimilation.description')}</p>
          {/* Invitation into the app instead of a bare "close". */}
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">{t('assimilation.invite')}</p>
          <div className="mt-5 flex w-full max-w-xs flex-col gap-3">
            <a
              href={appStoreUrl('emoton')}
              target="_blank"
              rel="noopener"
              onClick={() => trackDownloadClick('emoton_post_practice')}
              className="flex items-center justify-center rounded-full bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/30"
            >
              {t('assimilation.app_store')}
            </a>
            <a
              href="/#download"
              onClick={() => trackDownloadClick('emoton_post_practice')}
              className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              {t('assimilation.google_play')}
            </a>
          </div>
          <button onClick={restart} className="mt-5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
            {t('start_over')}
          </button>
        </div>
      )}

      {/* Persistent gentle restart for mid-flow steps. Pinned absolutely to the
          bottom so it never eats into the flex-1 centring area — otherwise it
          would pull the wheel orb up and break the presence → wheel orb match. */}
      {step !== 'presence' && step !== 'release' && step !== 'support' && step !== 'assimilation' && step !== 'be_with' && (
        <button onClick={restart} className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
          {t('start_over')}
        </button>
      )}
      </div>

      {/* SEO: prerendered text + FAQ below the immersive tool (the page's only H1).
          Lands in the SSR/prerendered HTML — the main ranking lever for a tool with
          almost no copy. Lead from the searched concept ("feelings wheel"). */}
      <section className="mx-auto max-w-2xl px-5 pb-16 text-left text-white/80">
        <h1 className="text-2xl font-bold tracking-tight text-white">{t('seo.h1')}</h1>

        <h2 className="mt-8 text-lg font-semibold text-white">{t('seo.intro_h2')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{t('seo.intro_p')}</p>

        <h2 className="mt-6 text-lg font-semibold text-white">{t('seo.how_h2')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{t('seo.how_p')}</p>

        <h2 className="mt-6 text-lg font-semibold text-white">{t('seo.bewith_h2')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{t('seo.bewith_p')}</p>

        <h2 className="mt-6 text-lg font-semibold text-white">{t('seo.felt_h2')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{t('seo.felt_p')}</p>

        <h2 className="mt-8 text-lg font-semibold text-white">{t('seo.faq_h2')}</h2>
        <div className="mt-3 space-y-4">
          {(t('seo.faq', { returnObjects: true }) as unknown as Array<{ q: string; a: string }>).map((f) => (
            <div key={f.q}>
              <h3 className="text-sm font-semibold text-white/90">{f.q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
          {t('seo.related_label')}{' '}
          <Link to={langHref('/tools/hrv', lang)} className="text-cyan-300 underline-offset-2 hover:underline">{t('seo.related_hrv')}</Link>
          <span className="mx-2 text-white/25">·</span>
          <Link to={langHref('/', lang)} className="text-cyan-300 underline-offset-2 hover:underline">{t('seo.related_home')}</Link>
        </div>
      </section>
    </>
  );
}

// ── Freeze first-move: one impossible-to-fail stroke unlocks the gentle-up ──
function FreezeStroke({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation('emoton');
  const [drawn, setDrawn] = useState(false);
  return (
    <div className="mt-6">
      <div
        onPointerDown={() => setDrawn(true)}
        onPointerMove={(e) => { if (e.buttons === 1) setDrawn(true); }}
        className={`flex h-[162px] w-[162px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors ${drawn ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-white/20 bg-white/5'}`}
      >
        <span className="text-xs text-white/50">{drawn ? t('freeze_move.stroke_prompt_done') : t('freeze_move.stroke_prompt_idle')}</span>
      </div>
      {drawn && (
        <button onClick={onDone} className="mt-5 rounded-full bg-cyan-500/20 px-7 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30">
          {t('freeze_move.cta')}
        </button>
      )}
    </div>
  );
}
