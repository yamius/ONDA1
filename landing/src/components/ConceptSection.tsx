export function ConceptSection() {
  return (
    <section id="concept" className="relative -mt-20 px-4 py-16 md:-mt-0 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ CONCEPT ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          Your Body is the Most Complex{' '}
          <span className="bg-gradient-to-r from-terminal-green to-terminal-cyan bg-clip-text text-transparent">
            Computer
          </span>
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-white/40 md:text-base">
          Most people use only 10% of their biological potential. ONDA Life provides
          a step-by-step algorithm to upgrade your firmware — from cellular level to
          higher consciousness.
        </p>

        <div className="mt-10 grid gap-4 md:mt-16 md:gap-6 md:grid-cols-3">
          <ConceptCard
            number="01"
            title="Systematic"
            description="Not random meditations. A structured protocol based on evolutionary biology and neuroscience."
          />
          <ConceptCard
            number="02"
            title="Progressive"
            description="Each level builds upon the previous one. From basic body awareness to social intelligence."
          />
          <ConceptCard
            number="03"
            title="Measurable"
            description="Track your progress with biometric data. HRV, sleep quality, stress levels — real metrics."
          />
        </div>
      </div>
    </section>
  )
}

function ConceptCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/10">
      <div className="mb-4 font-mono text-xs text-terminal-green/40">{number}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="font-mono text-xs leading-relaxed text-white/40">{description}</p>
    </div>
  )
}
