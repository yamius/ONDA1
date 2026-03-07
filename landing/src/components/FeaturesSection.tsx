const features = [
  {
    icon: '📊',
    iconAlt: 'Biometric data sync icon',
    title: 'Tracker Integration',
    description:
      'Connect Apple Watch, Oura Ring, Garmin. Watch your HRV, sleep, and stress metrics transform in real-time.',
  },
  {
    icon: '🎮',
    iconAlt: 'Gamification progression icon',
    title: 'Gamified Progression',
    description:
      'Earn OND tokens for each completed practice. Convert your consciousness into real value starting at Level 3.',
  },
  {
    icon: '⚙️',
    iconAlt: 'Structured system icon',
    title: 'Structured System',
    description:
      'No random meditations. Each practice is a firmware update for a specific system: breathing, emotions, mind, DNA.',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ FEATURES ]
        </h2>
        <h3 className="mb-10 text-2xl font-bold tracking-tight md:mb-16 md:text-4xl">
          Real-Time{' '}
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
            Bio-Sync
          </span>
        </h3>

        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10 md:p-8"
            >
              <span className="mb-6 block text-4xl" role="img" aria-label={feature.iconAlt}>
                {feature.icon}
              </span>
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
