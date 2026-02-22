const levels = [
  {
    number: 1,
    emoji: '\uD83C\uDF0D',
    name: '\u0422\u0415\u041B\u041E / TERRA',
    parts: '\u042F \u0415\u0421\u0422\u042C \u2022 \u042F \u0414\u0412\u0418\u0413\u0410\u042E\u0421\u042C \u2022 \u042F \u0410\u0414\u0410\u041F\u0422\u0418\u0420\u0423\u042E\u0421\u042C',
    color: 'from-purple-500/20 to-purple-900/10',
    borderColor: 'border-purple-500/20',
    accentColor: 'text-purple-400',
    dotColor: 'bg-purple-500',
  },
  {
    number: 2,
    emoji: '\uD83D\uDCA7',
    name: '\u042D\u041C\u041E\u0426\u0418\u0418 / AQUA',
    parts: '\u042F \u041C\u0410\u041D\u0415\u0412\u0420\u0418\u0420\u0423\u042E \u2022 \u042F \u041E\u0425\u0420\u0410\u041D\u042F\u042E \u2022 \u042F \u0412 \u0421\u0422\u0410\u0415',
    color: 'from-cyan-500/20 to-cyan-900/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
    dotColor: 'bg-cyan-500',
  },
  {
    number: 3,
    emoji: '\uD83C\uDF2C\uFE0F',
    name: '\u0420\u0410\u0417\u0423\u041C / AER',
    parts: '\u042F \u0420\u0410\u0417\u041B\u0418\u0427\u0410\u042E \u2022 \u042F \u0424\u041E\u041A\u0423\u0421\u0418\u0420\u0423\u042E\u0421\u042C \u2022 \u042F \u0421\u041E\u0417\u0414\u0410\u042E',
    color: 'from-sky-500/20 to-sky-900/10',
    borderColor: 'border-sky-500/20',
    accentColor: 'text-sky-400',
    dotColor: 'bg-sky-500',
  },
  {
    number: 4,
    emoji: '\uD83D\uDD25',
    name: '\u0421\u041E\u0426\u0418\u0423\u041C / IGNIS',
    parts: '\u042F \u0412\u042B\u0420\u0410\u0416\u0410\u042E \u2022 \u042F \u0412\u0417\u0410\u0418\u041C\u041E\u0414\u0415\u0419\u0421\u0422\u0412\u0423\u042E \u2022 \u042F \u0421\u041E-\u0422\u0412\u041E\u0420\u042E',
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'border-amber-500/20',
    accentColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    number: 5,
    emoji: '\uD83E\uDDD8',
    name: '\u0422\u0415\u041B\u041E II / SOMA',
    parts: '\u042F \u041E\u0429\u0423\u0429\u0410\u042E \u2022 \u042F \u041F\u0420\u041E\u0412\u041E\u0416\u0423 \u2022 \u042F \u0421\u041E\u0415\u0414\u0418\u041D\u042F\u042E\u0421\u042C',
    color: 'from-rose-500/20 to-rose-900/10',
    borderColor: 'border-rose-500/20',
    accentColor: 'text-rose-400',
    dotColor: 'bg-rose-500',
  },
  {
    number: 6,
    emoji: '\uD83E\uDDE0',
    name: '\u0421\u041E\u0417\u041D\u0410\u041D\u0418\u0415 \u041C\u041E\u0417\u0413\u0410',
    parts: '\u042F \u041D\u0410\u0411\u041B\u042E\u0414\u0410\u042E \u2022 \u042F \u0418\u041D\u0422\u0415\u0413\u0420\u0418\u0420\u0423\u042E \u2022 \u042F \u0421\u0418\u041D\u0425\u0420\u041E\u041D\u0418\u0417\u0418\u0420\u0423\u042E\u0421\u042C',
    color: 'from-indigo-500/20 to-indigo-900/10',
    borderColor: 'border-indigo-500/20',
    accentColor: 'text-indigo-400',
    dotColor: 'bg-indigo-500',
  },
  {
    number: 7,
    emoji: '\uD83E\uDDEC',
    name: '\u0421\u041E\u0417\u041D\u0410\u041D\u0418\u0415 \u0414\u041D\u041A',
    parts: '\u042F \u0412\u0421\u041F\u041E\u041C\u0418\u041D\u0410\u042E \u2022 \u042F \u0412\u041E\u0421\u0421\u0422\u0410\u041D\u0410\u0412\u041B\u0418\u0412\u0410\u042E \u2022 \u042F \u0421\u0418\u041D\u0422\u0415\u0417\u0418\u0420\u0423\u042E',
    color: 'from-emerald-500/20 to-emerald-900/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  {
    number: 8,
    emoji: '\uD83C\uDF0C',
    name: '\u0421\u041E\u0417\u041D\u0410\u041D\u0418\u0415 \u0410\u0422\u041E\u041C\u0410',
    parts: '\u042F \u0412\u0418\u0411\u0420\u0410\u0426\u0418\u042F \u2022 \u042F \u0426\u0415\u041B\u041E\u0421\u0422\u041D\u041E\u0421\u0422\u042C \u2022 \u042F \u0418\u0421\u0422\u041E\u0427\u041D\u0418\u041A',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/20',
    accentColor: 'text-white/80',
    dotColor: 'bg-white',
  },
]

export function LevelsSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ SYSTEM ARCHITECTURE ]
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Clear Hierarchy.{' '}
          <span className="text-white/40">No Chaos.</span>
        </h2>
        <p className="mb-16 max-w-2xl text-sm leading-relaxed text-white/40">
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
      className={`glass-card rounded-xl border ${level.borderColor} bg-gradient-to-br ${level.color} p-6 transition-all hover:scale-[1.02]`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`font-mono text-xs font-semibold ${level.accentColor}`}>
          \u0423\u0440\u043E\u0432\u0435\u043D\u044C {level.number}
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
