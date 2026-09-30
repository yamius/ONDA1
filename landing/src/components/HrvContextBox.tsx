import { Link } from 'react-router-dom'

/**
 * "Are your numbers normal?" bridge on HRV-wearable reviews and duels. These
 * pages get the search traffic (GSC 2026-09); the by-age reference articles have
 * the demand but rank poorly, so the reviews pass them visitors and link equity.
 * EN only for now — the localized reviews keep their current layout.
 */
const LINKS = [
  {
    to: '/articles/normal-hrv-by-age',
    label: 'What is a normal HRV for your age?',
    note: 'Typical ranges by age and sex, and why your own trend matters more.',
  },
  {
    to: '/articles/resting-heart-rate-by-age',
    label: 'What is a normal resting heart rate by age?',
    note: 'Reference ranges and when a high or low reading is worth checking.',
  },
  {
    to: '/tools/camera-heart-rate',
    label: 'Check your heart rate with your phone camera',
    note: 'Free, in the browser, no wearable needed.',
  },
]

export default function HrvContextBox({ lang }: { lang: string }) {
  if (lang !== 'en') return null
  return (
    <section className="not-prose mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5" data-block="hrv-context">
      <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
        Are your numbers normal?
      </h2>
      <ul className="m-0 list-none space-y-3 p-0">
        {LINKS.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-terminal-green underline decoration-terminal-green/30 underline-offset-2 hover:text-terminal-green/80"
            >
              {l.label}
            </Link>
            <span className="block text-sm text-white/60">{l.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
