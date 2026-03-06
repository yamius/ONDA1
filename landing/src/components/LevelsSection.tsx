import { Link } from 'react-router-dom'

interface PartData {
  label: string
  slug?: string
}

interface ResearchLink {
  label: string
  url: string
}

interface LevelData {
  number: number
  emoji: string
  name: string
  parts: PartData[]
  color: string
  borderColor: string
  accentColor: string
  description?: string
  researchLinks?: ResearchLink[]
}

const levels: LevelData[] = [
  {
    number: 1,
    emoji: '🌍',
    name: 'BODY / TERRA',
    parts: [
      { label: '1) I Am', slug: 'i-am' },
      { label: '2) I Move', slug: 'i-move' },
      { label: '3) I Adapt', slug: 'i-adapt' },
    ],
    color: 'from-purple-500/20 to-purple-900/10',
    borderColor: 'border-purple-500/20',
    accentColor: 'text-purple-400',
    description: 'Breathing, diaphragm, and HRV — the foundation of parasympathetic activation.',
  },
  {
    number: 2,
    emoji: '💧',
    name: 'EMOTIONS / AQUA',
    parts: [
      { label: '4) I Maneuver', slug: 'i-maneuver' },
      { label: '5) I Guard Territory', slug: 'i-guard-territory' },
      { label: "6) I'm Part of the Pack", slug: 'i-am-part-of-the-pack' },
    ],
    color: 'from-cyan-500/20 to-cyan-900/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
    description: 'HPA axis, DHEA, and Mirror Neurons — the architecture of emotional mastery.',
  },
  {
    number: 3,
    emoji: '🌬️',
    name: 'MIND / AER',
    parts: [
      { label: '7. I Distinguish', slug: 'i-distinguish' },
      { label: '8. I Focus', slug: 'i-focus' },
      { label: '9. I Shape the Vision', slug: 'i-shape-the-vision' },
    ],
    color: 'from-sky-500/20 to-sky-900/10',
    borderColor: 'border-sky-500/20',
    accentColor: 'text-sky-400',
    description: 'PFC, Norepinephrine, and Gamma Binding — the fuel of cognitive clarity.',
  },
  {
    number: 4,
    emoji: '🔥',
    name: 'SOCIETY / IGNIS',
    parts: [
      { label: '10. I Express', slug: 'i-express' },
      { label: '11. I Interact', slug: 'i-interact' },
      { label: '12. I Co-Create', slug: 'i-co-create' },
    ],
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'border-amber-500/20',
    accentColor: 'text-amber-400',
    description: 'Oxytocin, Mirror Neurons, and Ventral Vagus — the fuel of social resonance.',
  },
  {
    number: 5,
    emoji: '🧘',
    name: 'BODY II / TERRA II',
    parts: [
      { label: '13. I Sense', slug: 'i-sense' },
      { label: '14. I Channel', slug: 'i-channel' },
      { label: '15. I Attune', slug: 'i-attune' },
    ],
    color: 'from-rose-500/20 to-rose-900/10',
    borderColor: 'border-rose-500/20',
    accentColor: 'text-rose-400',
    description:
      'The body as conductor. I Sense → I Channel → I Attune: informational fluidity, flow states, neurosomatic fusion.',
  },
  {
    number: 6,
    emoji: '🧠',
    name: 'BRAIN / AQUA II',
    parts: [
      { label: '16. I Witness', slug: 'i-witness' },
      { label: '17. I Integrate', slug: 'i-integrate' },
      { label: '18. I Synchronize', slug: 'i-synchronize' },
    ],
    color: 'from-indigo-500/20 to-indigo-900/10',
    borderColor: 'border-indigo-500/20',
    accentColor: 'text-indigo-400',
    description: 'Neuroplasticity and hemispheric synchronization.',
  },
  {
    number: 7,
    emoji: '🧬',
    name: 'DNA / AER II',
    parts: [
      { label: '19. I Remember', slug: 'i-remember' },
      { label: '20. I Restore', slug: 'i-restore' },
      { label: '21. I Synthesize', slug: 'i-synthesize' },
    ],
    color: 'from-emerald-500/20 to-emerald-900/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
  },
  {
    number: 8,
    emoji: '🌌',
    name: 'ATOMIC / IGNIS II',
    parts: [
      { label: '22. I Resonate', slug: 'i-resonate' },
      { label: '23. I Am Wholeness', slug: 'i-am-wholeness' },
      { label: '24. I Am the Source', slug: 'i-am-the-source' },
    ],
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/20',
    accentColor: 'text-white/80',
  },
]

export function LevelsSection() {
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ SYSTEM ARCHITECTURE ]
        </div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
          <span className="text-terminal-green">Clear Hierarchy.</span>{' '}
          <span className="text-terminal-cyan">No Chaos.</span>
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/40 md:mb-16">
          Unlike fragmented meditation apps, ONDA Life provides a structured
          progression through 8 levels of consciousness development. Each level
          builds upon the previous one.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {levels.map((level) => (
            <LevelCard key={level.number} level={level} />
          ))}
        </div>
      </div>
    </section>
  )
}

const levelsWithPages = [1, 2, 3, 4, 5] // Levels that have dedicated parent pages

function LevelCard({ level }: { level: LevelData }) {
  const hasLevelPage = levelsWithPages.includes(level.number)
  return (
    <div
      className={`glass-card rounded-xl border ${level.borderColor} bg-gradient-to-br ${level.color} p-4 transition-all hover:scale-[1.02] md:p-6`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`font-mono text-xs font-semibold ${level.accentColor}`}>
          {hasLevelPage ? (
            <Link to={`/level/${level.number}`} className="transition-colors hover:opacity-80">
              Level {level.number} →
            </Link>
          ) : (
            `Level ${level.number}`
          )}
        </span>
        <span className="text-2xl">{level.emoji}</span>
      </div>
      <h3 className="mb-2 font-mono text-xl font-bold tracking-wide text-white md:text-2xl">
        {level.name}
      </h3>
      {level.description && (
        <p className="mb-3 font-mono text-[11px] leading-relaxed text-white/40">
          {level.description}
        </p>
      )}
      <div className="flex flex-col gap-0.5 font-mono text-[11px] leading-relaxed text-white/40">
        {level.parts.map((part) =>
          part.slug ? (
            <Link
              key={part.label}
              to={`/part/${part.slug}`}
              className={`rounded px-1 py-0.5 transition-colors hover:bg-white/5 hover:text-white/70 ${level.accentColor}`}
            >
              {part.label} →
            </Link>
          ) : (
            <span key={part.label} className={`px-1 py-0.5 ${level.accentColor}`}>{part.label}</span>
          )
        )}
      </div>
      {level.researchLinks && level.researchLinks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
          {level.researchLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors hover:bg-white/5 hover:text-white/70 ${level.accentColor}`}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
