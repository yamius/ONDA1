interface CoherenceOrbProps {
  /** Light theme (results screen passes completeLight; onboarding passes isLight). */
  light: boolean;
  /** Emit the sonar-style ripples (results screen). Off on first-run / intro. */
  ripples?: boolean;
  /** Wrapper margins, e.g. "mb-6 sm:mb-8" — spacing differs per screen. */
  className?: string;
}

/**
 * The signature ONDA coherence orb — a solid disc with the breathing wave and a
 * soft glow, optionally emitting ripples. Shared by the first-run, practice-intro
 * and results screens so the orb stays identical across the onboarding flow.
 *
 * The wave path mirrors the burger menu's curve (M4 22 Q 22 6 36 22 T 68 22).
 * Animations (.onda-breathe / .onda-ripple) live in index.css and honor
 * prefers-reduced-motion. Only one orb renders at a time, so the gradient id is
 * shared.
 */
export function CoherenceOrb({ light, ripples = false, className = '' }: CoherenceOrbProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
        {ripples && (
          <>
            <span className="onda-ripple" aria-hidden="true" />
            <span className="onda-ripple onda-ripple-2" aria-hidden="true" />
            <span className="onda-ripple onda-ripple-3" aria-hidden="true" />
          </>
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/25 to-cyan-400/25 blur-2xl onda-breathe" />
        {/* Opaque disc so ripples read as emitted from behind the orb. */}
        <div className={`absolute inset-2 rounded-full ${light ? 'bg-white shadow-lg shadow-violet-200/60' : 'bg-slate-800/90'}`} />
        <div className={`absolute inset-2 rounded-full border ${light ? 'border-violet-400/30' : 'border-violet-300/25'}`} />
        {/* Animation on a <div> wrapper, not the <svg> root — SVG-root transforms
            can sit on a non-composited layer in WKWebView and freeze. */}
        <div className="relative onda-breathe">
          <svg viewBox="0 0 72 44" className="w-16 h-16 sm:w-20 sm:h-20" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="ondaOrbWaveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path d="M4 30 Q 22 14 36 30 T 68 30" stroke="url(#ondaOrbWaveGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
            <path d="M4 22 Q 22 6 36 22 T 68 22" stroke="url(#ondaOrbWaveGrad)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
