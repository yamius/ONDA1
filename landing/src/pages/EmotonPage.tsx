import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ZONE_ORDER,
  ZONES,
  wantsForZone,
  resolveBranch,
  requiresFirstMove,
  isHopelessnessShade,
  beWithMoves,
  QUALITY_WORDS,
  type ZoneId,
  type WantOption,
  type RoutedBranch,
} from '../lib/emotonCore';
import { LandingPractice } from '../components/emoton/LandingPractice';
import { ADAPTIVE_PRACTICES } from '../data/adaptivePractices';

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
  const [step, setStep] = useState<Step>('presence');
  const [zone, setZone] = useState<ZoneId | null>(null);
  const [shade, setShade] = useState<string | null>(null);
  const [branch, setBranch] = useState<RoutedBranch | null>(null);
  // Я proportion for the be-with gauge — drives graded moves + the support
  // trigger. NEVER shown as a number; conveyed via the circle region sizes.
  const [selfFraction, setSelfFraction] = useState(0.5);
  const [describePick, setDescribePick] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('page_title');
  }, [t]);

  const restart = () => {
    setStep('presence');
    setZone(null);
    setShade(null);
    setBranch(null);
    setSelfFraction(0.5);
    setDescribePick(null);
  };

  const pickShade = (shadeId: string) => {
    setShade(shadeId);
    // A hopelessness/meaninglessness shade routes straight to the gentle off-ramp.
    if (isHopelessnessShade(shadeId)) {
      setStep('support');
      return;
    }
    setStep('own');
  };

  const pickWant = (want: WantOption) => {
    if (!zone) return;
    const b = resolveBranch(zone, want);
    setBranch(b);
    if (b.branch === 'support') return setStep('support');
    if (b.branch === 'release') return setStep('release');
    if (b.branch === 'be_with') {
      setDescribePick(null);
      return setStep('be_with');
    }
    // practice
    if (requiresFirstMove(zone)) return setStep('freeze_move');
    return setStep('practice');
  };

  const z = zone ? ZONES[zone] : null;
  const moves = beWithMoves(selfFraction);
  const shadeLabel = shade ? t(`shade.${shade}`) : '';

  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-md flex-col items-center px-5 pb-10 pt-0 text-white">
      <style>{`
        @keyframes emoton-swell { 0% { transform: scale(0.7); opacity:.7 } 50% { transform: scale(1.06); opacity:1 } 100% { transform: scale(0.74); opacity:.8 } }
        @keyframes emoton-rise  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes emoton-breathe { 0%,100% { transform: scale(1); opacity:.9 } 50% { transform: scale(1.06); opacity:1 } }
      `}</style>

      {/* ── 1. Presence (Я) ─────────────────────────────────────────────── */}
      {step === 'presence' && (
        <div className="flex flex-1 flex-col items-center justify-start text-center">
          {/* The orb is the tap target — touch it to begin (the copy below invites
              "коснись своего Я"). Top-anchored with a margin that lands the orb at
              the SAME centre as the wheel orb (prompt + wheel half) — no jump on
              presence → wheel. The title/description float below it absolutely. */}
          <div className="relative mt-[132px]">
            <button
              onClick={() => setStep('wheel')}
              aria-label={t('presence.cta')}
              className="flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/15 to-transparent transition-shadow hover:border-cyan-300/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
              style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}
            >
              <span className="text-3xl font-light tracking-wide text-white/90">{t('be_with.self_label')}</span>
            </button>
            <div className="absolute left-1/2 top-full w-[80vw] max-w-xs -translate-x-1/2 text-center">
              <h1 className="mt-8 text-2xl font-semibold">{t('presence.title')}</h1>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{t('presence.description')}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Wheel → zone → shade ─────────────────────────────────────── */}
      {step === 'wheel' && (
        <div className="flex w-full flex-1 flex-col items-center justify-start">
          {/* Top-anchored: the prompt sits just under the header, the wheel hangs
              below it. The presence orb is given a matching top margin so its
              centre lines up with this wheel's centre orb — no jump. The shade
              picker floats below the wheel (absolute) so it never shifts the orb. */}
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{t('wheel.prompt')}</p>
          <div className="relative mt-6 h-[360px] w-[360px]">
            {/* Center orb — identical to the presence orb (size + cyan gradient
                + breathe) so the "Я" reads as the same orb carried across. */}
            <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/15 to-transparent text-3xl font-light tracking-wide text-white/90" style={{ animation: 'emoton-breathe 5.5s ease-in-out infinite' }}>
              {t('be_with.self_label')}
            </div>
            {ZONE_ORDER.map((zid, i) => {
              const angle = (-90 + i * 60) * (Math.PI / 180);
              // 44% ring radius — pushes the zones clear of the larger (176px)
              // centre orb while the 360px wheel still fits a 375px viewport.
              const left = 50 + 44 * Math.cos(angle);
              const top = 50 + 44 * Math.sin(angle);
              const active = zone === zid;
              return (
                <button
                  key={zid}
                  onClick={() => setZone(zid)}
                  className={`absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2 py-2 text-center text-[11px] font-medium leading-tight transition-colors ${
                    active ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  {t(`zone.${zid}`)}
                </button>
              );
            })}
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
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{t('own.meta')}</p>
          <h2 className="mt-2 text-2xl font-semibold">{t('own.title', { shade: shadeLabel })}</h2>
          <p className="mt-2 text-sm text-white/55">{t('own.description')}</p>
          <div className="mt-6 w-full space-y-2">
            {wantsForZone(zone).map((w) => (
              <button
                key={w.id}
                onClick={() => pickWant(w)}
                className={`${surface} w-full px-5 py-3 text-left text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10`}
              >
                {t(`want.${w.id}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Freeze first-move (tiny, impossible-to-fail) → gentle-up ─────── */}
      {step === 'freeze_move' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
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
          onDone={() => setStep('assimilation')}
        />
      )}

      {/* ── Be-with visualization (no sensor) ───────────────────────────── */}
      {step === 'be_with' && shade && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{t('be_with.meta')}</p>
          {/* Я is the larger field; the feeling is held WITHIN it. */}
          <div className="relative mt-6 flex h-64 w-64 items-center justify-center">
            <div
              className="absolute rounded-full border border-cyan-300/30 bg-cyan-400/5"
              style={{ width: `${Math.round(60 + selfFraction * 40)}%`, height: `${Math.round(60 + selfFraction * 40)}%` }}
            >
              <span className="absolute left-3 top-2 font-mono text-[10px] uppercase tracking-widest text-cyan-200/50">{t('be_with.self_label')}</span>
            </div>
            <div
              className="rounded-full bg-gradient-to-b from-rose-400/40 to-rose-500/10"
              style={{
                width: `${Math.round(46 - selfFraction * 22)}%`,
                height: `${Math.round(46 - selfFraction * 22)}%`,
                animation: 'emoton-swell 16s ease-in-out infinite',
              }}
            />
            <span className="absolute bottom-6 text-xs text-white/70">{t('be_with.feeling_label', { shade: shadeLabel })}</span>
          </div>

          {describePick ? (
            <p className="mt-4 text-sm text-white/70">{t('be_with.description_with_pick', { word: t(`quality.${describePick}`) })}</p>
          ) : (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{t('be_with.description_no_pick')}</p>
          )}

          <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
            <button onClick={() => setSelfFraction((f) => Math.min(0.9, f + 0.15))} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">
              {t('be_with.grow_self_cta')}
            </button>
            {moves.includes('describe') && (
              <DescribeWords value={describePick} onPick={setDescribePick} />
            )}
            {moves.includes('ease') && (
              <button onClick={() => setSelfFraction((f) => Math.min(0.95, f + 0.2))} className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs text-amber-200/90 hover:bg-amber-400/20">
                {t('be_with.ease_cta')}
              </button>
            )}
          </div>

          <button onClick={() => setStep('own')} className="mt-8 rounded-full bg-cyan-500/20 px-7 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30">
            {t('be_with.ready_cta')}
          </button>
          <button onClick={restart} className="mt-2 text-xs text-white/40 underline underline-offset-4 hover:text-white/70">
            {t('be_with.stay_longer')}
          </button>
        </div>
      )}

      {/* ── Release branch (real-world action / "other" / "nothing") ─────── */}
      {step === 'release' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-3xl">↗</div>
          <h2 className="mt-6 text-xl font-semibold">{t('release.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">{t('release.description')}</p>
          <button onClick={restart} className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
            {t('release.close_cta')}
          </button>
        </div>
      )}

      {/* ── Support off-ramp (gentle, never an alarm) ───────────────────── */}
      {step === 'support' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-2xl">♡</div>
          <h2 className="mt-6 text-xl font-semibold">{t('support.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">{t('support.description')}</p>
          <div className={`${surface} mt-6 w-full px-5 py-4 text-sm`}>
            <p className="font-semibold text-white/90">{t('support.lifeline_title')}</p>
            <p className="mt-1 text-white/60">
              {t('support.lifeline_call')} <span className="text-cyan-300">{t('support.lifeline_number')}</span> {t('support.lifeline_hours')}{' '}
              <a href="https://988lifeline.org" className="text-cyan-300 underline underline-offset-2" target="_blank" rel="noreferrer">988lifeline.org</a>.
            </p>
          </div>
          <button onClick={restart} className="mt-6 text-xs text-white/45 underline underline-offset-4 hover:text-white/70">
            {t('support.close_cta')}
          </button>
        </div>
      )}

      {/* ── Assimilation close (after a practice; no new cycle) ──────────── */}
      {step === 'assimilation' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/15 to-transparent text-3xl" style={{ animation: 'emoton-rise 6s ease-in-out infinite' }}>✓</div>
          <h2 className="mt-6 text-xl font-semibold">{t('assimilation.title')}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">{t('assimilation.description')}</p>
          <button onClick={restart} className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
            {t('assimilation.close_cta')}
          </button>
        </div>
      )}

      {/* Persistent gentle restart for mid-flow steps. Pinned absolutely to the
          bottom so it never eats into the flex-1 centring area — otherwise it
          would pull the wheel orb up and break the presence → wheel orb match. */}
      {step !== 'presence' && step !== 'release' && step !== 'support' && step !== 'assimilation' && (
        <button onClick={restart} className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
          {t('start_over')}
        </button>
      )}
    </div>
  );
}

// ── Describe-the-feeling: SELECT a quality word (Gendlin), never free text ───
function DescribeWords({ value, onPick }: { value: string | null; onPick: (w: string) => void }) {
  const { t } = useTranslation('emoton');
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">
        {t('be_with.describe_cta')}
      </button>
    );
  }
  return (
    <div className="flex w-full flex-wrap justify-center gap-2">
      {QUALITY_WORDS.map((w) => (
        <button
          key={w}
          onClick={() => { onPick(w); setOpen(false); }}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${value === w ? 'border-rose-300/50 bg-rose-400/15 text-rose-100' : 'border-white/15 bg-white/5 text-white/75 hover:bg-white/10'}`}
        >
          {t(`quality.${w}`)}
        </button>
      ))}
    </div>
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
        className={`flex h-44 w-44 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors ${drawn ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-white/20 bg-white/5'}`}
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
