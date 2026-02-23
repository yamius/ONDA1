const levels = [
  {
    number: 1,
    emoji: '🌍',
    name: 'BODY / TERRA',
    parts: 'I AM • I MOVE • I ADAPT',
    color: 'from-purple-500/20 to-purple-900/10',
    borderColor: 'border-purple-500/20',
    accentColor: 'text-purple-400',
    dotColor: 'bg-purple-500',
  },
  {
    number: 2,
    emoji: '💧',
    name: 'EMOTIONS / AQUA',
    parts: 'I MANEUVER • I GUARD • I BELONG',
    color: 'from-cyan-500/20 to-cyan-900/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
    dotColor: 'bg-cyan-500',
  },
  {
    number: 3,
    emoji: '🌬️',
    name: 'MIND / AER',
    parts: 'I DISCERN • I FOCUS • I CREATE',
    color: 'from-sky-500/20 to-sky-900/10',
    borderColor: 'border-sky-500/20',
    accentColor: 'text-sky-400',
    dotColor: 'bg-sky-500',
  },
  {
    number: 4,
    emoji: '🔥',
    name: 'SOCIETY / IGNIS',
    parts: 'I EXPRESS • I INTERACT • I CO-CREATE',
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'border-amber-500/20',
    accentColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    number: 5,
    emoji: '🧘',
    name: 'BODY II / SOMA',
    parts: 'I SENSE • I CONDUCT • I UNITE',
    color: 'from-rose-500/20 to-rose-900/10',
    borderColor: 'border-rose-500/20',
    accentColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
  },
  {
    number: 6,
    emoji: '🧠',
    name: 'BRAIN AWARENESS',
    parts: 'I OBSERVE • I INTEGRATE • I SYNCHRONIZE',
    color: 'from-indigo-500/20 to-indigo-900/10',
    borderColor: 'border-indigo-500/20',
    accentColor: 'text-indigo-400',
    dotColor: 'bg-indigo-500',
  },
  {
    number: 7,
    emoji: '🧬',
    name: 'DNA AWARENESS',
    parts: 'I REMEMBER • I RESTORE • I SYNTHESIZE',
    color: 'from-emerald-500/20 to-emerald-900/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  {
    number: 8,
    emoji: '🌌',
    name: 'ATOM AWARENESS',
    parts: 'I VIBRATE • I AM WHOLE • I AM SOURCE',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/20',
    accentColor: 'text-white/80',
    dotColor: 'bg-white',
  },
]

export function LevelsSection() {
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ SYSTEM ARCHITECTURE ]
        </div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-4xl">
          Clear Hierarchy.{' '}
          <span className="text-white/40">No Chaos.</span>
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

function LevelCard({ level }: { level: (typeof levels)[number] }) {
  return (
    <div
      className={`glass-card rounded-xl border ${level.borderColor} bg-gradient-to-br ${level.color} p-4 transition-all hover:scale-[1.02] md:p-6`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`font-mono text-xs font-semibold ${level.accentColor}`}>
          Level {level.number}
        </span>
        <span className="text-2xl">{level.emoji}</span>
      </div>
      <h3 className="mb-2 font-mono text-lg font-bold tracking-wide">
        {level.name}
      </h3>
      <p className="font-mono text-[11px] leading-relaxed text-white/40">
        {level.parts}
      </p>
    </div>
  )
}
