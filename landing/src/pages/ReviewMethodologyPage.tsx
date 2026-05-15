/**
 * /reviews/methodology — how ONDA scores biohacking tools.
 *
 * The trust anchor for the /reviews hub: the fixed scoring rubric,
 * criteria weights, what the score means, and how hands-on testing is
 * distinguished from evidence-based assessment. Criteria are rendered
 * straight from data/reviews/criteria.ts so the page can never drift
 * from the scores it explains.
 */
import { Link } from 'react-router-dom'
import { getCriteria } from '../data/reviews'

export function ReviewMethodologyPage() {
  const criteria = getCriteria('hrv-wearable')

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/reviews" className="transition-colors hover:text-white/50">Reviews</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">Methodology</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ METHODOLOGY ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        How ONDA scores tools
      </h1>
      <p className="mb-12 font-mono text-sm leading-relaxed text-white/60">
        Every review on ONDA is a single, named editorial assessment — not a crowd
        average and not an algorithm. This page is the fixed rubric behind those
        scores, so you can judge the judgement.
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">The score</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        Each tool gets an overall score from 0 to 10 (one decimal). It is the
        weighted mean of the criteria below — never a round number picked by
        feel. A single reviewer assigns it, so it is published as one editorial
        rating, not an aggregate of many.
      </p>

      <h2 className="mb-4 text-xl font-bold tracking-tight">
        Scoring criteria — HRV wearables
      </h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {criteria.map((c) => (
          <div key={c.id} className="py-4">
            <div className="mb-1 flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">{c.label}</h3>
              <span className="shrink-0 font-mono text-xs font-bold text-terminal-green">
                {Math.round(c.weight * 100)}%
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-white/50">
              {c.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xl font-bold tracking-tight">
        Hands-on tested vs evidence-based
      </h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        Every review carries one of two labels. <strong className="text-white/80">Hands-on
        tested</strong> means ONDA physically wore and used the device, with the
        test period stated. <strong className="text-white/80">Evidence-based
        assessment</strong> means the tool was scored from spec sheets and
        peer-reviewed validation studies, each cited in the review references. We
        never present an assessment as hands-on testing.
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">Independence</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        No vendor pays for placement or for a score. Product links are plain links
        to official sites and ONDA earns no commission from them. If that ever
        changes, affiliate links will be clearly labelled and disclosed on the page.
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">Who writes the reviews</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        Reviews are written by Yakiv Bilenko, founder of ONDA Life.{' '}
        <Link to="/about" className="text-terminal-green/70 hover:text-terminal-green">
          About the author
        </Link>
        .
      </p>

      <div className="mt-4">
        <Link
          to="/reviews"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← All reviews
        </Link>
      </div>
    </div>
  )
}
