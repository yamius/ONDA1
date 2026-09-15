import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * First-run coachmarks (task 87). THREE mandatory steps, shown once, in order
 * base → expert: (1) connect your watch, (2) how signals work, (3) expert mode.
 * Navigation is Next (1→2→3) and Back (on 2 and 3) — there is NO skip/close by
 * design (a measured hypothesis: §3 tracks drop-off so we can revisit).
 *
 * Spotlight: a full-screen dim with a hole cut around the target element —
 * step 1 highlights the "connect watch" button, step 3 the burger menu; step 2
 * is informational (no hard highlight). The overlay blocks all app interaction
 * except its own Next/Back, so the coachmarks can't be tapped past.
 */

// The element each step points at (by data-testid). null → informational, no hole.
const STEP_TARGET: Record<number, string | null> = {
  1: '[data-testid="biometric-connect-watch"]',
  2: null,
  3: '[data-testid="button-menu"]',
};

interface Rect { left: number; top: number; width: number; height: number; }

export function Coachmarks({ onStepShown, onBack, onComplete }: {
  /** Fire coachmark_shown{step}. */
  onStepShown: (step: number) => void;
  /** Fire coachmark_back{step} (the step being left). */
  onBack: (step: number) => void;
  /** Fire coachmark_completed and dismiss. */
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [rect, setRect] = useState<Rect | null>(null);

  // coachmark_shown once per step entry. Intentionally depends on `step` ONLY —
  // the parent passes a fresh onStepShown each render, so including it would
  // re-fire on every render (hundreds of events). Read it through a ref.
  const onShownRef = React.useRef(onStepShown);
  onShownRef.current = onStepShown;
  useEffect(() => { onShownRef.current(step); }, [step]);

  // Bring the target into view and keep the spotlight glued to it. Robust to two
  // realities of this home: (1) the target may mount a frame or two late (lazy
  // lists, collapse animations); (2) the burger is position:fixed, so
  // scrollIntoView on it is a no-op / misbehaves — we skip scrolling fixed
  // targets and just measure them. We poll for ~1s: find → centre once (non-fixed
  // only) → track, then follow later scroll/resize.
  useLayoutEffect(() => {
    const sel = STEP_TARGET[step];
    setRect(null);
    if (!sel) return;
    let ticks = 0;
    let centred = false;
    // setInterval (not rAF) so it still fires when the webview isn't actively
    // painting (rAF is paused then), keeping the spotlight reliable.
    const measureEl = (el: HTMLElement) => {
      const fixed = getComputedStyle(el).position === 'fixed';
      const r0 = el.getBoundingClientRect();
      if (!fixed && (!centred || r0.top < 8 || r0.bottom > window.innerHeight - 8)) {
        try { el.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch { /* older webviews */ }
        centred = true;
      }
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    const tick = () => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) measureEl(el);
    };
    tick(); // immediate
    const id = window.setInterval(() => { tick(); ticks += 1; if (ticks >= 12) window.clearInterval(id); }, 90); // ~1.1s
    const follow = () => { const el = document.querySelector(sel) as HTMLElement | null; if (el) { const r = el.getBoundingClientRect(); setRect({ left: r.left, top: r.top, width: r.width, height: r.height }); } };
    window.addEventListener('scroll', follow, true);
    window.addEventListener('resize', follow);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('scroll', follow, true);
      window.removeEventListener('resize', follow);
    };
  }, [step]);

  const isLast = step === 3;
  const goNext = () => { if (isLast) onComplete(); else setStep((s) => s + 1); };
  const goBack = () => { if (step > 1) { onBack(step); setStep((s) => s - 1); } };

  const PAD = 10;
  const hole = rect
    ? { left: rect.left - PAD, top: rect.top - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }
    : null;

  const body = step === 1
    ? t('coach.step1', 'Для работы Базлайна подключи свои часы — ONDA покажет твой ритм за последние недели.')
    : step === 2
      ? t('coach.step2', 'Мы уведомим, если увидим отклонение от твоей нормы — просто продолжай носить часы.')
      : t('coach.step3', 'Хочешь больше деталей? В меню включается Экспертный режим — расширенные показатели и аннотации сигналов.');

  // Bubble anchored to the target (above it if it sits low, below otherwise);
  // centred when there is no target (step 2).
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const placeAbove = hole ? hole.top > vh * 0.5 : false;
  const bubbleStyle: React.CSSProperties = hole
    ? placeAbove
      ? { left: '50%', transform: 'translateX(-50%)', bottom: Math.max(16, vh - hole.top + 16) }
      : { left: '50%', transform: 'translateX(-50%)', top: hole.top + hole.height + 16 }
    : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div className="fixed inset-0 z-[200]" data-testid="coachmarks" aria-live="polite" role="dialog">
      {/* Dim + hole. The overlay div itself blocks all clicks (transparent but
          pointer-events auto); the hole is painted by a huge box-shadow. */}
      {hole ? (
        <div
          className="absolute"
          style={{
            left: hole.left, top: hole.top, width: hole.width, height: hole.height,
            borderRadius: 18, boxShadow: '0 0 0 9999px rgba(4,7,14,0.78)',
            border: '2px solid rgba(255,255,255,0.92)',
            transition: 'left 0.2s, top 0.2s, width 0.2s, height 0.2s',
          }}
          data-testid="coach-spotlight"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'rgba(4,7,14,0.78)' }} />
      )}

      {/* Text bubble + navigation. */}
      <div
        className="absolute w-[min(88vw,340px)] rounded-2xl p-5 text-center bg-slate-900/95 border border-white/15 shadow-2xl"
        style={bubbleStyle}
      >
        <div className="mb-1 text-[11px] font-semibold tracking-wide text-indigo-300">{step} / 3</div>
        <p className="text-sm leading-relaxed text-white/90">{body}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              data-testid="coach-back"
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 border border-white/15 hover:bg-white/10 transition-colors"
            >
              ← {t('coach.back', 'Назад')}
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            data-testid="coach-next"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 transition-colors"
          >
            {isLast ? t('coach.got_it', 'Понятно') : `${t('coach.next', 'Далее')} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
