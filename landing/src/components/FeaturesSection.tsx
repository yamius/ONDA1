const features = [
  {
    icon: '📊',
    title: 'Tracker Integration',
    description:
      'Connect Apple Watch, Oura Ring, Garmin. Watch your HRV, sleep, and stress metrics transform in real-time.',
  },
  {
    icon: '🎮',
    title: 'Gamified Progression',
    description:
      'Earn OND tokens for each completed practice. Convert your consciousness into real value starting at Level 3.',
  },
  {
    icon: '⚙️',
    title: 'Structured System',
    description:
      'No random meditations. Each practice is a firmware update for a specific system: breathing, emotions, mind, DNA.',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ FEATURES ]
        </div>
        <h2 className="mb-16 text-3xl font-bold tracking-tight md:text-4xl">
          Real-Time{' '}
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
            Bio-Sync
          </span>
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card group rounded-xl p-8 transition-all hover:border-terminal-green/10"
            >
              <div className="mb-6 text-4xl">{feature.icon}</div>
              <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
              <p className="font-mono text-xs leading-relaxed text-white/40">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
