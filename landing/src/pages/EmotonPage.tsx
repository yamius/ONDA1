import { useEffect, useState } from 'react';
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
import { EmotonPractice } from '../components/emoton/EmotonPractice';

/**
 * Emoton — the deliberate, owned emotional check-in ("I name what I feel").
 * A 4-step contact cycle → wheel → named want → branch (practice with live camera
 * pulse / be-with visualization / release / support). EN-only v1, no persistence,
 * no free text, agency-never-assessment. Pure routing lives in emotonCore; this
 * page is the surface. The sensor connects ONLY in the practice branch.
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

// ── EN labels (v1: literal, not i18n) ───────────────────────────────────────
const ZONE_LABEL: Record<ZoneId, string> = {
  regulated: 'Calm · present',
  expansive: 'Joy · uplift',
  fight: 'Anger · pressure',
  flight: 'Anxiety · fear',
  grief: 'Sadness · grief',
  freeze: 'Numb · flat',
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const WANT_LABEL: Record<string, string> = {
  calm_down: 'Calm down',
  ground: 'Ground myself',
  gently_come_back: 'Gently come back',
  deepen: 'Deepen it',
  channel_action: 'Channel it into action',
  be_with: 'Be with it',
  describe: 'Describe the feeling',
  set_boundary: 'Set a boundary',
  live_it: 'Live it',
  nothing: "Nothing — I'm good",
  other: 'Something else',
};

// practiceId → friendly EN name + felt intent for the practice branch.
const PRACTICE_META: Record<string, { title: string; intent: string }> = {
  body_cocoon: { title: 'Body Cocoon', intent: 'settle the charge' },
  earth_pulse: { title: 'Earth Pulse', intent: 'come back to the ground' },
  inner_spark: { title: 'Inner Spark', intent: 'a gentle return' },
  earth_breath: { title: 'Earth Breath', intent: 'deepen the calm' },
  light_inhale: { title: 'Light Inhale', intent: 'carry the lift' },
};

const surface = 'rounded-2xl border border-white/10 bg-white/5';

export function EmotonPage() {
  const [step, setStep] = useState<Step>('presence');
  const [zone, setZone] = useState<ZoneId | null>(null);
  const [shade, setShade] = useState<string | null>(null);
  const [branch, setBranch] = useState<RoutedBranch | null>(null);
  // Я proportion for the be-with gauge — drives graded moves + the support
  // trigger. NEVER shown as a number; conveyed via the circle region sizes.
  const [selfFraction, setSelfFraction] = useState(0.5);
  const [describePick, setDescribePick] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Emoton — name what you feel | ONDA';
  }, []);

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
      return setStep(b.beWithMode === 'describe' ? 'be_with' : 'be_with');
    }
    // practice
    if (requiresFirstMove(zone)) return setStep('freeze_move');
    return setStep('practice');
  };

  const z = zone ? ZONES[zone] : null;
  const moves = beWithMoves(selfFraction);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center px-5 py-10 text-white">
      <style>{`
        @keyframes emoton-swell { 0% { transform: scale(0.7); opacity:.7 } 50% { transform: scale(1.06); opacity:1 } 100% { transform: scale(0.74); opacity:.8 } }
        @keyframes emoton-rise  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
      `}</style>

      {/* ── 1. Presence (Я) ─────────────────────────────────────────────── */}
      {step === 'presence' && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/15 to-transparent" style={{ animation: 'emoton-rise 6s ease-in-out infinite' }}>
            <span className="text-3xl font-light tracking-wide text-white/90">I</span>
          </div>
          <h1 className="mt-8 text-2xl font-semibold">Here you are.</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            Take one breath. When you're ready, name what's most alive right now — one feeling, the one that's loudest.
          </p>
          <button onClick={() => setStep('wheel')} className="mt-8 rounded-full bg-cyan-500/20 px-8 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/30">
            Begin
          </button>
        </div>
      )}

      {/* ── 2. Wheel → zone → shade ─────────────────────────────────────── */}
      {step === 'wheel' && (
        <div className="flex w-full flex-1 flex-col items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">What's most alive?</p>
          <div className="relative mt-6 h-[300px] w-[300px]">
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg text-white/80">
              I
            </div>
            {ZONE_ORDER.map((zid, i) => {
              const angle = (-90 + i * 60) * (Math.PI / 180);
              const left = 50 + 40 * Math.cos(angle);
              const top = 50 + 40 * Math.sin(angle);
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
                  {ZONE_LABEL[zid]}
                </button>
              );
            })}
          </div>

          {z && (
            <div className="mt-2 w-full text-center">
              <p className="text-xs text-white/45">Tap the shade closest to it</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {z.shades.map((sh) => (
                  <button
                    key={sh}
                    onClick={() => pickShade(sh)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10"
                  >
                    {cap(sh)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 3. Own it + name the want ───────────────────────────────────── */}
      {step === 'own' && zone && shade && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">You named it</p>
          <h2 className="mt-2 text-2xl font-semibold">I feel {shade}.</h2>
          <p className="mt-2 text-sm text-white/55">It's here, and it's yours. What do you want with it right now?</p>
          <div className="mt-6 w-full space-y-2">
            {wantsForZone(zone).map((w) => (
              <button
                key={w.id}
                onClick={() => pickWant(w)}
                className={`${surface} w-full px-5 py-3 text-left text-sm text-white/85 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10`}
              >
                {WANT_LABEL[w.id] ?? w.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Freeze first-move (tiny, impossible-to-fail) → gentle-up ─────── */}
      {step === 'freeze_move' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">One small move</p>
          <h2 className="mt-2 text-xl font-semibold">Just one stroke.</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            No need for a breath yet. Draw a single line in the circle — any line. That's enough to start coming back.
          </p>
          <FreezeStroke onDone={() => setStep('practice')} />
          <button onClick={restart} className="mt-4 text-xs text-white/40 underline underline-offset-4 hover:text-white/70">
            Not now
          </button>
        </div>
      )}

      {/* ── Practice branch (the ONLY sensor branch) ────────────────────── */}
      {step === 'practice' && branch?.practiceId && (
        <div className="flex w-full flex-1 flex-col justify-center">
          <EmotonPractice
            practiceId={branch.practiceId}
            title={PRACTICE_META[branch.practiceId]?.title ?? 'Breathe'}
            intent={PRACTICE_META[branch.practiceId]?.intent ?? 'a moment with the breath'}
            direction={branch.practiceDirection}
            onDone={() => setStep('assimilation')}
          />
        </div>
      )}

      {/* ── Be-with visualization (no sensor) ───────────────────────────── */}
      {step === 'be_with' && shade && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">Being with it</p>
          {/* Я is the larger field; the feeling is held WITHIN it. */}
          <div className="relative mt-6 flex h-64 w-64 items-center justify-center">
            <div
              className="absolute rounded-full border border-cyan-300/30 bg-cyan-400/5"
              style={{ width: `${Math.round(60 + selfFraction * 40)}%`, height: `${Math.round(60 + selfFraction * 40)}%` }}
            >
              <span className="absolute left-3 top-2 font-mono text-[10px] uppercase tracking-widest text-cyan-200/50">I</span>
            </div>
            <div
              className="rounded-full bg-gradient-to-b from-rose-400/40 to-rose-500/10"
              style={{
                width: `${Math.round(46 - selfFraction * 22)}%`,
                height: `${Math.round(46 - selfFraction * 22)}%`,
                animation: 'emoton-swell 16s ease-in-out infinite',
              }}
            />
            <span className="absolute bottom-6 text-xs text-white/70">my {shade}</span>
          </div>

          {describePick ? (
            <p className="mt-4 text-sm text-white/70">It feels <span className="text-rose-200">{describePick}</span>. Noticed — that's enough.</p>
          ) : (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              You're bigger than this feeling — it lives within you. Let it rise, and let it settle on its own.
            </p>
          )}

          <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
            <button onClick={() => setSelfFraction((f) => Math.min(0.9, f + 0.15))} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">
              Grow the Self around it
            </button>
            {moves.includes('describe') && (
              <DescribeWords value={describePick} onPick={setDescribePick} />
            )}
            {moves.includes('ease') && (
              <button onClick={() => setSelfFraction((f) => Math.min(0.95, f + 0.2))} className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs text-amber-200/90 hover:bg-amber-400/20">
                Ease it a notch
              </button>
            )}
          </div>

          <button onClick={() => setStep('own')} className="mt-8 rounded-full bg-cyan-500/20 px-7 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30">
            When you're ready
          </button>
          <button onClick={restart} className="mt-2 text-xs text-white/40 underline underline-offset-4 hover:text-white/70">
            Stay longer · or close
          </button>
        </div>
      )}

      {/* ── Release branch (real-world action / "other" / "nothing") ─────── */}
      {step === 'release' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-3xl">↗</div>
          <h2 className="mt-6 text-xl font-semibold">Then that's your answer.</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            Go do it — the breath can wait. Naming what you need is the practice, this time.
          </p>
          <button onClick={restart} className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
            Close
          </button>
        </div>
      )}

      {/* ── Support off-ramp (gentle, never an alarm) ───────────────────── */}
      {step === 'support' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-2xl">♡</div>
          <h2 className="mt-6 text-xl font-semibold">This seems like a lot right now.</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
            It can help not to be alone with it. Talking to someone is a strong move, not a weak one.
          </p>
          <div className={`${surface} mt-6 w-full px-5 py-4 text-sm`}>
            <p className="font-semibold text-white/90">988 — Suicide &amp; Crisis Lifeline</p>
            <p className="mt-1 text-white/60">Call or text <span className="text-cyan-300">988</span> (US, 24/7), or chat at <a href="https://988lifeline.org" className="text-cyan-300 underline underline-offset-2" target="_blank" rel="noreferrer">988lifeline.org</a>.</p>
          </div>
          <button onClick={restart} className="mt-6 text-xs text-white/45 underline underline-offset-4 hover:text-white/70">
            Close
          </button>
        </div>
      )}

      {/* ── Assimilation close (after a practice; no new cycle) ──────────── */}
      {step === 'assimilation' && (
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/15 to-transparent text-3xl" style={{ animation: 'emoton-rise 6s ease-in-out infinite' }}>✓</div>
          <h2 className="mt-6 text-xl font-semibold">You stayed with it.</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            You breathed even when it wasn't easy. That's the capacity you're building — carry it with you.
          </p>
          <button onClick={restart} className="mt-8 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
            Close
          </button>
        </div>
      )}

      {/* persistent gentle restart for mid-flow steps */}
      {step !== 'presence' && step !== 'release' && step !== 'support' && step !== 'assimilation' && (
        <button onClick={restart} className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60">
          start over
        </button>
      )}
    </div>
  );
}

// ── Describe-the-feeling: SELECT a quality word (Gendlin), never free text ───
function DescribeWords({ value, onPick }: { value: string | null; onPick: (w: string) => void }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10">
        Describe the feeling
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
          {w}
        </button>
      ))}
    </div>
  );
}

// ── Freeze first-move: one impossible-to-fail stroke unlocks the gentle-up ──
function FreezeStroke({ onDone }: { onDone: () => void }) {
  const [drawn, setDrawn] = useState(false);
  return (
    <div className="mt-6">
      <div
        onPointerDown={() => setDrawn(true)}
        onPointerMove={(e) => { if (e.buttons === 1) setDrawn(true); }}
        className={`flex h-44 w-44 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors ${drawn ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-white/20 bg-white/5'}`}
      >
        <span className="text-xs text-white/50">{drawn ? 'there it is' : 'drag here'}</span>
      </div>
      {drawn && (
        <button onClick={onDone} className="mt-5 rounded-full bg-cyan-500/20 px-7 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/30">
          Gently come back
        </button>
      )}
    </div>
  );
}
