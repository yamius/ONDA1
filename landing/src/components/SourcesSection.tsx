import type { ScienceSource } from '../data/sources'

/**
 * "Sources & methodology" block shown near the foot of a tool page (before the
 * FAQ). A plain-English derivation note plus a numbered list of peer-reviewed
 * citations with stable links — the same pattern across every calculator that
 * publishes normative numbers, so the figures are defensible to a "source?"
 * challenge from a numbers-savvy audience.
 */
export function SourcesSection({
  methodology,
  sources,
}: {
  methodology: string
  sources: ScienceSource[]
}) {
  return (
    <>
      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">
        Sources &amp; methodology
      </h2>
      <p className="mb-5 font-mono text-xs leading-relaxed text-white/50">{methodology}</p>
      <ol className="mb-10 space-y-3">
        {sources.map((s, i) => (
          <li key={s.url} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-1 font-mono text-xs text-white/80">
              <span className="text-terminal-cyan">[{i + 1}]</span> {s.authors} ({s.year}).{' '}
              <a
                href={s.url}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="text-terminal-green underline decoration-dotted hover:decoration-solid"
              >
                {s.title}
              </a>
              . <span className="italic text-white/50">{s.journal}</span>.
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-white/40">{s.contributes}</p>
          </li>
        ))}
      </ol>
    </>
  )
}
