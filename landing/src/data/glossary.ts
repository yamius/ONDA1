import { SLUG_TO_CATEGORY } from './glossary-categories'

export interface GlossaryTerm {
  slug: string
  title: string
  category: string
  shortDescription: string
  content: string
  /** Optional: 3 most logically related terms for internal linking (SEO). */
  relatedSlugs?: string[]
}

const rawGlossaryTerms: GlossaryTerm[] = [
  {
    slug: 'biocomputer',
    title: 'Biocomputer',
    category: 'Core Concepts',
    shortDescription:
      'The human body viewed as a complex biological computing system capable of running consciousness programs.',
    content: `

The **Biocomputer** is the foundational metaphor of ONDA Life. Your body is not just a vessel — it is the most sophisticated computing system known to exist.

### Key Principles

- **Hardware**: Your physical body — organs, nervous system, endocrine glands, fascia, muscles
- **Software**: Behavioral patterns, emotional reactions, cognitive frameworks
- **Firmware**: Deep biological programs inherited through evolution — fight-or-flight, social bonding, territorial behavior
- **Operating System**: Your consciousness — the layer that can observe and modify all other layers

### Why This Matters

Most people run on autopilot — executing ancient firmware without awareness. ONDA Life provides tools to:

1. **Observe** your current biological programs
2. **Debug** malfunctioning patterns (chronic stress, emotional reactivity)
3. **Upgrade** your firmware through structured practices
4. **Optimize** your system for peak performance

### In the ONDA System

The Biocomputer concept maps directly to the 8-level architecture. Levels 1-4 work with the "hardware" (body, emotions, mind, social systems), while Levels 5-8 access deeper "source code" (cellular, genetic, planetary, universal).

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'firmware-update',
    title: 'Firmware Update',
    category: 'Core Concepts',
    shortDescription:
      'A structured practice session that rewrites deep biological programs — breathing patterns, stress responses, emotional regulation.',
    content: `

In ONDA Life, a **Firmware Update** is what traditional apps call a "meditation" or "practice session." But it's fundamentally different.

### What Makes It Different

Unlike random meditation, each Firmware Update targets a **specific biological system**:

- **Breathing firmware**: Autonomic nervous system regulation
- **Emotional firmware**: Amygdala response patterns, vagal tone
- **Motor firmware**: Proprioception, body schema, movement patterns
- **Social firmware**: Mirror neuron activation, empathy circuits

### How It Works

Each practice follows a precise protocol:

1. **System Check** — Brief assessment of current state (HRV, subjective stress level)
2. **Initialization** — Guided preparation of the target system
3. **Execution** — The core practice with real-time biometric feedback
4. **Integration** — Cool-down period where new patterns consolidate
5. **Verification** — Post-practice metrics comparison

### Measurable Results

Because each Firmware Update targets a specific system, results are measurable:
- HRV changes after breathing practices
- Sleep quality improvements after evening protocols
- Stress response changes tracked over weeks

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'psycho-neural-network',
    title: 'Psycho-Neural Network',
    category: 'Neuroscience',
    shortDescription:
      'The interconnected web of psychological patterns and neural pathways that form your behavioral operating system.',
    content: `

The **Psycho-Neural Network** (PNN) describes the bidirectional relationship between psychological states and neural architecture.

### The Feedback Loop

Your thoughts shape your brain, and your brain shapes your thoughts:

- **Repeated thoughts** → strengthened neural pathways → habitual patterns
- **New practices** → neuroplasticity → new behavioral options
- **Emotional states** → neurochemical cascades → physical sensations
- **Physical practices** → bottom-up regulation → emotional shifts

### In ONDA Life

Each Level of the ONDA system works with a different layer of the PNN:

| Level | PNN Layer | Focus |
|-------|-----------|-------|
| Body (TERRA) | Sensorimotor | Interoception, proprioception |
| Emotions (AQUA) | Limbic | Amygdala, vagal tone, emotional regulation |
| Mind (AER) | Cortical | Prefrontal cortex, attention networks |
| Society (IGNIS) | Social | Mirror neurons, theory of mind |

### Molecular Psychology Connection

The PNN is not abstract — it has a molecular basis. Every psychological state corresponds to specific neurotransmitter and hormone profiles. ONDA practices are designed to shift these profiles systematically.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'molecular-psychology',
    title: 'Molecular Psychology',
    category: 'Neuroscience',
    shortDescription:
      'Understanding psychological states through their molecular basis — hormones, neurotransmitters, and peptides.',
    content: `

**Molecular Psychology** bridges the gap between subjective experience and biochemistry. Every emotion, thought, and behavior has a molecular signature.

### Key Molecules in ONDA

| Molecule | Role | ONDA Practice |
|----------|------|---------------|
| **Cortisol** | Stress response | Breathing practices (Level 1) |
| **Oxytocin** | Social bonding | Group practices (Level 4) |
| **BDNF** | Neuroplasticity | Cognitive practices (Level 3) |
| **Serotonin** | Mood regulation | Rhythmic movement (Level 1-2) |
| **Dopamine** | Motivation & reward | Gamified progression system |
| **GABA** | Calm & inhibition | Stillness practices (Level 2) |

### Why It Matters

Traditional meditation apps say "feel calmer." ONDA Life says "reduce cortisol by activating the parasympathetic nervous system through specific breathing ratios." The difference is precision.

### Hormonal Firmware

Your endocrine system is the "firmware" that runs beneath conscious awareness. Hormonal patterns established in childhood continue to run unless deliberately updated. ONDA practices target these patterns at the molecular level.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'interoception',
    title: 'Interoception',
    category: 'Body Systems',
    shortDescription:
      'The sense of the internal state of your body — the foundation of all self-awareness and emotional intelligence.',
    content: `

**Interoception** is your body's ability to sense its own internal state — heartbeat, breathing, gut feelings, temperature, pain, hunger.¹ It is the most fundamental sense, and the foundation of the entire ONDA system.

### Why Interoception First

ONDA Level 1 (TERRA) begins with interoception because:

1. **It's the base layer** — You cannot regulate what you cannot sense
2. **Emotional awareness depends on it** — Emotions are first felt as body sensations²
3. **It's measurable** — Interoceptive accuracy correlates with emotional intelligence
4. **It's trainable** — Unlike many cognitive abilities, interoception improves rapidly with practice

### The Interoceptive Hierarchy

| Layer | What You Sense | ONDA Part |
|-------|---------------|-----------|
| **Basic** | Heartbeat, breath, temperature | Part 1: I Exist |
| **Dynamic** | Movement, balance, proprioception | Part 2: I Move |
| **Adaptive** | Stress signals, energy levels, recovery | Part 3: I Adapt |

### Research Basis

Studies show that people with higher interoceptive accuracy:
- Make better decisions (Dunn et al., 2010)
- Have greater emotional regulation (Füstös et al., 2013)
- Experience less anxiety (Paulus & Stein, 2010)
- Show enhanced empathy (Ernst et al., 2013)

---

### References

1. [Craig, Nat Rev Neurosci (2002)](https://pubmed.ncbi.nlm.nih.gov/12030437/) — interoception and insula
2. [Füstös et al., Biol Psychol (2013)](https://pubmed.ncbi.nlm.nih.gov/23153889/) — interoception and emotional regulation
`,
  },
  {
    slug: 'ond-tokens',
    title: 'OND Tokens',
    category: 'Gamification',
    shortDescription:
      'The internal reward currency earned through completed practices — converting consciousness work into measurable progress.',
    content: `

**OND Tokens** are the gamification layer of ONDA Life — a reward system that makes consciousness development measurable and motivating.

### How You Earn

Each completed practice awards OND tokens based on:

- **Base reward** — Fixed amount per practice type (60-200 OND)
- **Quality multiplier** — Based on biometric data during practice (if tracker connected)
- **Artifact bonus** — Accumulated bonus from collected artifacts (+20% to +50%)
- **Streak bonus** — Consecutive daily practice multiplier

### Earning Requirements

A practice counts as completed when:
- ≥80% of the target time is completed
- ≥33% quality score (without tracker, this is automatic)

### Artifacts

Each Part has an associated **Artifact** — a collectible that provides permanent OND bonus:

| Part | Artifact | Bonus |
|------|----------|-------|
| Part 1 | Crystal of Grounding | +20% |
| Part 2 | Wave of Rhythm | +25% |
| Part 3 | Shield of Adaptation | +50% |

### Future: Real Value

Starting at Level 3, OND tokens will be convertible to real value through the ONDA ecosystem. The exact mechanism is under development.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'homeostasis',
    title: 'Homeostasis',
    category: 'Body Systems',
    shortDescription:
      'The body\'s ability to maintain stable internal conditions — temperature, pH, blood sugar — despite external changes.',
    relatedSlugs: ['hypothalamus', 'primary-interoception', 'autonomic-nervous-system'],
    content: `

**Homeostasis** is the dynamic process by which living organisms maintain a stable internal environment.¹ It is the biological foundation of the "I Am" state in ONDA Level 1.

### How It Works

The hypothalamus acts as the body's thermostat, constantly monitoring and adjusting:

- **Temperature** — vasodilation/constriction, sweating, shivering
- **Blood sugar** — insulin/glucagon balance
- **pH levels** — respiratory and renal buffering
- **Fluid balance** — thirst signals, kidney filtration
- **Blood pressure** — baroreceptor feedback loops

### In ONDA Life

Level 1 (TERRA) begins with homeostatic alignment — the practice of sensing and supporting these automatic processes. When homeostasis is disrupted (chronic stress, poor sleep, inflammation), the entire system operates in deficit mode.

### Why It Matters

A body in homeostatic balance is a body ready for growth. Without this foundation, higher-level practices (emotional regulation, cognitive focus, social connection) lack the biological substrate they need.

---

### References

1. [Saper & Lowell, Cell (2014)](https://pubmed.ncbi.nlm.nih.gov/24679536/) — hypothalamus and homeostasis
`,
  },
  {
    slug: 'primary-interoception',
    title: 'Primary Interoception',
    category: 'Body Systems',
    shortDescription:
      'The most fundamental layer of body sensing — awareness of heartbeat, breath, gut signals, and internal organ states.',
    content: `

**Primary Interoception** is the raw, unfiltered sensing of your body's internal state.¹ It is the connection between the brainstem and the insular cortex — the most ancient pathway of self-awareness.

### Layers of Interoception

| Layer | What You Sense | Brain Region |
|-------|---------------|-------------|
| **Primary** | Heartbeat, breath rhythm, gut motility | Brainstem → Insula |
| **Emotional** | Feelings as body sensations | Insula → Anterior Cingulate |
| **Reflective** | Conscious body awareness | Prefrontal Cortex |

### In ONDA Life

Part 1 ("I Am") focuses exclusively on primary interoception — learning to detect the most basic signals before interpreting them emotionally or cognitively. This is the "biological zero" from which all awareness emerges.

### Training Primary Interoception

Practices include:
- Heartbeat detection exercises
- Breath observation without modification
- Gut-feeling awareness scans
- Temperature gradient sensing

---

### References

1. [Craig, Nat Rev Neurosci (2009)](https://pubmed.ncbi.nlm.nih.gov/12030437/) — interoception and insula
`,
  },
  {
    slug: 'metabolism',
    title: 'Metabolism',
    category: 'Body Systems',
    shortDescription:
      'The sum of all chemical reactions in the body that convert food into energy and building materials for cells.',
    content: `

**Metabolism** encompasses every chemical reaction occurring in your body — from cellular respiration to protein synthesis. In ONDA Life, metabolism is understood as the energetic foundation of consciousness.

### Two Phases

- **Catabolism** — breaking down molecules to release energy (ATP production)
- **Anabolism** — building complex molecules from simpler ones (repair, growth)

### Metabolic States and Consciousness

| State | Metabolic Mode | Consciousness Quality |
|-------|---------------|---------------------|
| **Stress** | Catabolic dominance | Reactive, narrow focus |
| **Recovery** | Anabolic dominance | Restorative, diffuse awareness |
| **Flow** | Dynamic balance | Optimal performance, expanded awareness |

### In ONDA Life

Level 1 practices help shift the metabolic balance from chronic catabolic stress toward dynamic equilibrium. When metabolism is balanced, the nervous system has the energy resources needed for higher-order functions like emotional regulation and focused attention.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'metabolic-flexibility',
    title: 'Metabolic Flexibility',
    category: 'Biological Software',
    shortDescription:
      'The ability of mitochondria to seamlessly switch between glucose and fat (ketones) as fuel sources based on availability and demand.',
    content: `

**Metabolic Flexibility** is the capacity of your cells—especially mitochondria—to switch between fuel sources based on availability and demand. A metabolically flexible system burns glucose when it's abundant and fat (ketones) when glucose is low.

### Key Features

- **Dual-fuel capability** — glucose and ketones as interchangeable energy sources
- **Insulin sensitivity** — low insulin allows fat oxidation; high insulin blocks it
- **Mitochondrial health** — efficient mitochondria oxidize fatty acids readily
- **Stable energy** — no more "glucose-locked" spikes and crashes

### In ONDA Life

Metabolic Flexibility is "Power Management 2.0." When you unlock it, you eliminate brain fog, stabilize mood, and access a near-limitless reserve of stored metabolic energy. The Metabolic Firmware Upgrades (fasting, post-meal movement, Zone 2 training) target this flexibility.
`,
  },
  {
    slug: 'insulin-sensitivity',
    title: 'Insulin Sensitivity',
    category: 'Biological Software',
    shortDescription:
      'How responsive your cells are to insulin — high sensitivity means efficient glucose uptake and fat-burning capability.',
    content: `

**Insulin Sensitivity** describes how well your cells respond to insulin. When sensitivity is high, cells take up glucose efficiently with smaller insulin signals. When sensitivity is low (insulin resistance), the pancreas must pump out more insulin to achieve the same effect—and fat-burning is blocked.

### Key Effects

- **Glucose gatekeeper** — insulin determines which fuel your system burns
- **Software lock** — high insulin prevents access to stored fat
- **Fat-burning** — low insulin signals allow fat oxidation and ketone production
- **Metabolic flexibility** — sensitivity enables seamless fuel switching

### In ONDA Life

To unlock dual-fuel capability, you must master Insulin Sensitivity. Intermittent fasting, post-meal movement, and Zone 2 training all improve this metric. The Metabolic Flexibility article details the protocols.
`,
  },
  {
    slug: 'glucose-spikes',
    title: 'Glucose Spikes',
    category: 'Biological Software',
    shortDescription:
      'Rapid rises in blood sugar after eating — followed by insulin spikes and energy crashes. A sign of glucose-locked metabolism.',
    content: `

**Glucose Spikes** are rapid increases in blood sugar after a meal, often followed by a sharp insulin response and subsequent energy crash. They indicate a "glucose-locked" system—one that struggles to access fat for fuel.

### Why They Matter

- **Energy crash** — spikes lead to crashes; unstable energy throughout the day
- **Insulin resistance** — chronic spikes can reduce insulin sensitivity over time
- **Brain fog** — volatile glucose impairs cognitive function
- **Fat storage** — excess glucose is stored as fat when insulin is high

### In ONDA Life

The Glucose Buffer protocol (10-minute brisk walk after your largest meal) flattens glucose spikes by activating GLUT4 transporters. This pulls glucose into muscle without a massive insulin spike.

`,
  },
  {
    slug: 'mitochondria',
    title: 'Mitochondria',
    category: 'Neural Hardware',
    shortDescription:
      'The cellular power plants — produce ATP from glucose and fatty acids. Metabolic flexibility depends on their health.',
    content: `

**Mitochondria** are organelles inside your cells that produce ATP—the energy currency of life. They can oxidize both glucose and fatty acids. Metabolic flexibility depends on mitochondrial health and efficiency.

### Key Functions

- **ATP production** — cellular respiration converts fuel to usable energy
- **Fat oxidation** — healthy mitochondria burn fatty acids efficiently
- **Ketone utilization** — mitochondria can burn ketones when glucose is low
- **Out of shape** — when mitochondria struggle, you become dependent on the next sugar hit

### In ONDA Life

Zone 2 aerobic training specifically targets and "trains" mitochondria to become more efficient at burning fat. The Metabolic Flexibility article details the protocols for mitochondrial optimization.
`,
  },
  {
    slug: 'atp',
    title: 'ATP',
    category: 'Biological Software',
    shortDescription:
      'Adenosine triphosphate — the universal energy currency of life. Produced by mitochondria from glucose and fat.',
    content: `

**ATP** (adenosine triphosphate) is the molecule that stores and transfers energy within cells. Every metabolic process—from muscle contraction to neural firing—depends on ATP. Mitochondria produce ATP from glucose and fatty acids.

### Key Properties

- **Energy currency** — all cells use ATP for work
- **Continuous production** — mitochondria constantly regenerate ATP
- **Breakdown product** — ATP breakdown produces adenosine (sleep pressure)
- **Dual fuel** — ATP can be made from glucose or from fat oxidation

### In ONDA Life

Metabolic flexibility means your mitochondria can produce ATP from either fuel source. When glucose is locked, ATP production suffers—leading to fatigue and brain fog. The Metabolic Firmware Upgrades optimize ATP production capacity.
`,
  },
  {
    slug: 'ketosis',
    title: 'Ketosis',
    category: 'Biological Software',
    shortDescription:
      'A metabolic state where the body burns fat and produces ketones for fuel — a high-performance alternative to glucose.',
    content: `

**Ketosis** is a metabolic state in which the body burns fat and produces ketones (beta-hydroxybutyrate, acetoacetate) as fuel. The brain can use ketones efficiently—often with fewer reactive oxygen species than glucose.

### Key Properties

- **Fat-burning mode** — liver converts fat to ketones when glucose is low
- **Clean fuel** — ketones produce fewer ROS than glucose for the brain
- **Stable power** — like switching your CPU to a more stable power supply
- **Fasting trigger** — extended fasting or ketogenic diet induces ketosis

### In ONDA Life

Ketosis isn't just a diet; it's a high-performance metabolic state. The Fasted Window protocol (intermittent fasting) lowers insulin long enough to initialize fat-burning mode and access ketosis. See the Metabolic Flexibility article.
`,
  },
  {
    slug: 'autophagy',
    title: 'Autophagy',
    category: 'Biological Software',
    shortDescription:
      'The cellular cleanup process that removes damaged proteins and organelles — "deletes damaged code" for cellular renewal.',
    content: `

**Autophagy** (literally "self-eating") is the process by which cells break down and recycle damaged proteins, organelles, and other cellular debris. It is a "cellular cleanup" that removes "damaged code" and supports renewal.

### Key Functions

- **Cellular cleanup** — removes damaged mitochondria, proteins, aggregates
- **Fasting trigger** — extended low-insulin periods activate autophagy
- **Longevity** — linked to healthy aging and longevity in research
- **Metabolic flexibility** — supports mitochondrial health and efficiency

### In ONDA Life

The Fasted Window protocol (intermittent fasting) triggers autophagy by lowering insulin for an extended period. This "deletes" damaged cellular components and supports metabolic flexibility. See the Metabolic Flexibility article.
`,
  },
  {
    slug: 'ketones',
    title: 'Ketones',
    category: 'Biological Software',
    shortDescription:
      'Molecules produced from fat when glucose is low — beta-hydroxybutyrate (BHB) and others. A "cleaner" fuel for the brain.',
    content: `

**Ketones** (ketone bodies) are molecules produced by the liver when the body burns fat for fuel. The main ketone used by the brain is beta-hydroxybutyrate (BHB). Ketones are a "cleaner" fuel—producing fewer reactive oxygen species than glucose.

### Key Properties

- **Fat-derived** — produced when glucose is low and insulin is low
- **Brain fuel** — the brain can use ketones when glucose is scarce
- **Stable energy** — fewer spikes and crashes than glucose
- **Metabolic flexibility** — ketones indicate your system has accessed fat storage

### In ONDA Life

Accessing ketones is like switching your CPU to a more stable power supply. The Fasted Window and Zone 2 protocols support ketone production. See the Metabolic Flexibility article for full protocols.
`,
  },
  {
    slug: 'brain',
    title: 'Brain',
    category: 'Neuroscience',
    shortDescription:
      'The central organ of the nervous system — a biological supercomputer processing 11 million bits of sensory information per second.',
    content: `

The **brain** is the master control center of the biocomputer. In ONDA Life, we work with the brain not as an abstract concept but as a layered system with distinct evolutionary origins.

### Evolutionary Layers

| Layer | Structure | Function | ONDA Level |
|-------|-----------|----------|-----------|
| **Reptilian** | Brainstem, cerebellum | Survival, homeostasis | Level 1 (TERRA) |
| **Mammalian** | Limbic system | Emotions, social bonds | Level 2 (AQUA) |
| **Neocortical** | Cortex, prefrontal | Thinking, planning | Level 3 (AER) |
| **Social** | Mirror neurons, TPJ | Empathy, cooperation | Level 4 (IGNIS) |

### Key Principle

ONDA Life works bottom-up: we stabilize the brainstem before engaging the limbic system, and regulate emotions before training cognitive focus. Skipping layers leads to unstable results.

### Neuroplasticity

The brain rewires itself based on repeated experience. Every ONDA practice is designed to strengthen specific neural pathways through deliberate, structured repetition.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'mind',
    title: 'Mind',
    category: 'Core Concepts',
    shortDescription:
      'The emergent phenomenon of consciousness arising from brain activity — the "software" running on biological "hardware."',
    content: `

In ONDA Life, the **mind** is distinguished from the brain. The brain is hardware; the mind is the software — the patterns of thought, perception, and awareness that emerge from neural activity.

### Mind vs. Brain

| Aspect | Brain | Mind |
|--------|-------|------|
| Nature | Physical organ | Emergent process |
| Access | Neuroscience, imaging | Introspection, practice |
| Change via | Neuroplasticity | Awareness, training |
| ONDA approach | Bottom-up (body → brain) | Top-down (attention → pattern) |

### Levels of Mind in ONDA

- **Level 1-2**: Pre-reflective mind — body awareness and emotional sensing
- **Level 3 (AER)**: Reflective mind — attention, focus, discrimination
- **Level 4 (IGNIS)**: Social mind — expression, interaction, co-creation
- **Level 5-8**: Transpersonal mind — cellular, genetic, atomic consciousness

### The Observer

The ultimate goal of ONDA is to develop the "observer" — the aspect of mind that can witness its own processes without being captured by them.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'insular-cortex',
    title: 'Insular Cortex',
    category: 'Neuroscience',
    shortDescription:
      'A deep brain region (the insula) that serves as the primary hub for interoception, self-awareness, and emotional processing.',
    content: `

The **insular cortex** (or insula) is a region of the cerebral cortex folded deep within the lateral sulcus. It is the brain's primary center for interoception — the sense of the body's internal state.

### Functions

- **Interoceptive awareness** — sensing heartbeat, breath, gut signals
- **Emotional experience** — translating body signals into felt emotions
- **Self-awareness** — the neural basis of "I exist" experience
- **Empathy** — understanding others' internal states through simulation
- **Decision-making** — gut feelings that guide choices

### Anterior vs. Posterior Insula

| Region | Function | ONDA Relevance |
|--------|----------|---------------|
| **Posterior** | Raw body signals | Level 1: Primary interoception |
| **Anterior** | Emotional interpretation | Level 2: Emotional awareness |

### In ONDA Life

The insula is the key target of Level 1 practices. By training interoceptive accuracy, you strengthen the insula's ability to provide clear, reliable signals about your internal state — the foundation of all self-regulation.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'vagus-nerve',
    title: 'Vagus Nerve',
    category: 'Body Systems',
    shortDescription:
      'The longest cranial nerve, connecting the brain to the heart, lungs, and gut — the highway of the parasympathetic nervous system.',
    content: `

The **vagus nerve** (cranial nerve X) is the primary channel of the parasympathetic nervous system.¹ It wanders from the brainstem through the neck, thorax, and abdomen — connecting the brain to virtually every major organ.

### Key Functions

- **Heart rate regulation** — slowing heart rate for calm states
- **Breathing control** — coordinating diaphragm and respiratory rhythm
- **Digestive activation** — stimulating "rest and digest" mode
- **Inflammation control** — the cholinergic anti-inflammatory pathway²
- **Social engagement** — facial expression, voice tone, listening

### Vagal Tone

**Vagal tone** is measured through Heart Rate Variability (HRV).³ Higher vagal tone = greater ability to shift between activation and recovery. ONDA Level 1 practices directly train vagal tone through:

- Diaphragmatic breathing (mechanical stimulation)
- Extended exhale patterns (parasympathetic activation)
- Cold exposure protocols (vagal resilience)

### Polyvagal Theory

Stephen Porges' polyvagal theory⁴ describes three states:

| State | Nerve Branch | Experience |
|-------|-------------|-----------|
| **Ventral vagal** | Myelinated vagus | Safety, social engagement |
| **Sympathetic** | Spinal nerves | Fight or flight |
| **Dorsal vagal** | Unmyelinated vagus | Freeze, shutdown |

ONDA Level 1 aims to establish a stable ventral vagal state — the biological foundation of safety.

---

### References

1. [Berthoud & Neuhuber, Physiol Rev (2000)](https://pubmed.ncbi.nlm.nih.gov/10696521/) — vagal anatomy and function
2. [Tracey, Nature (2002)](https://pubmed.ncbi.nlm.nih.gov/11967552/) — cholinergic anti-inflammatory pathway
3. [Thayer & Lane, Neurosci Biobehav Rev (2009)](https://pubmed.ncbi.nlm.nih.gov/19463818/) — HRV as vagal tone marker
4. [Porges, Biol Psychol (2007)](https://pubmed.ncbi.nlm.nih.gov/17049418/) — Polyvagal Theory
`,
  },
  {
    slug: 'mammalian-dive-reflex',
    title: 'Mammalian Dive Reflex',
    category: 'Neural Hardware',
    shortDescription:
      'A set of physiological responses to cold water immersion that optimizes respiration and slows the heart rate, mediated by the vagus nerve.',
    content: `

The **Mammalian Dive Reflex** is an automatic physiological response triggered when the face is immersed in cold water. It optimizes oxygen use and redirects blood flow. The vagus nerve mediates the heart-rate-slowing component of this reflex.

### Key Effects

- **Bradycardia** — heart rate slows immediately
- **Peripheral vasoconstriction** — blood shifts to core organs
- **Vagal activation** — the parasympathetic system takes control
- **Stress reset** — can interrupt sympathetic dominance

### In ONDA Life

Cold exposure protocols (face immersion, cold showers) leverage the Mammalian Dive Reflex to build vagal resilience. The reflex provides a biological "hard reset" that forces the autonomic nervous system to recalibrate.
`,
  },
  {
    slug: 'thalamus',
    title: 'Thalamus',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s sensory relay station — filters and routes incoming sensory information to the cortex.',
    content: `

The **thalamus** is a paired structure in the center of the brain that acts as the main relay station for sensory information. Almost all sensory input (except smell) passes through the thalamus before reaching the cerebral cortex.

### Functions

- **Sensory gating** — filters redundant or irrelevant stimuli before they reach consciousness
- **Attention modulation** — determines which signals get amplified or suppressed
- **Integration** — combines multiple sensory streams into coherent perception
- **Arousal regulation** — part of the reticular activating system

### In ONDA Life

Level 1 practices include "thalamic calibration" — training the thalamus to filter out redundant stimuli and reduce the load on the nervous system. When the thalamus is overwhelmed (chronic stress, sensory overload), the system operates in deficit mode.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'proto-consciousness',
    title: 'Proto-consciousness',
    category: 'Core Concepts',
    shortDescription:
      'The most basic form of awareness — pre-reflective sensing of existence before thought or emotion.',
    content: `

**Proto-consciousness** is the earliest, most fundamental layer of awareness. It exists before the mind labels experience, before emotions are named, before the sense of "I" solidifies.

### Characteristics

- **Pre-reflective** — you sense without thinking about sensing
- **Bodily** — rooted in interoception and physiological rhythms
- **Present-moment** — no narrative, no past or future
- **Unconditional** — the raw fact of existence

### In ONDA Life

The main objective of Part 1 ("I Am") is the activation of proto-consciousness and the creation of an unconditional sense of safety. This is the "biological zero" — the foundation from which all higher consciousness emerges.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'physiological-rhythms',
    title: 'Physiological Rhythms',
    category: 'Body Systems',
    shortDescription:
      'The natural oscillating patterns of the body — heartbeat, breath, gut motility, circadian cycles.',
    content: `

**Physiological rhythms** are the body's built-in oscillating patterns that govern life at the cellular and systemic level. They operate largely outside conscious awareness.

### Key Rhythms

| Rhythm | Frequency | Function |
|--------|-----------|----------|
| **Cardiac** | ~1 Hz | Heartbeat, circulation |
| **Respiratory** | 0.2–0.3 Hz | Gas exchange, vagal tone |
| **Gastric** | 0.05 Hz | Digestion, peristalsis |
| **Circadian** | 1/24 hr | Sleep-wake, hormones |
| **Ultradian** | 90–120 min | Attention cycles, rest |

### In ONDA Life

Part 1 activates proto-consciousness "through contact with physiological rhythms." Practices bring attention to breath, heartbeat, and gut sensations — aligning awareness with the body's natural tempo rather than overriding it.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'hypothalamus',
    title: 'Hypothalamus',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s master regulator of homeostasis — temperature, hunger, thirst, sleep, and stress response.',
    content: `

The **hypothalamus** is a small region at the base of the brain that acts as the body's control center for homeostasis.¹ It constantly monitors internal state and coordinates responses to maintain equilibrium.

### Key Functions

- **Temperature regulation** — sweating, shivering, vasodilation
- **Hunger and thirst** — appetite signals, fluid balance
- **Sleep-wake cycle** — circadian rhythm coordination
- **Stress response** — HPA axis activation (cortisol release)
- **Autonomic balance** — sympathetic/parasympathetic tone

### In ONDA Life

Level 1 "Homeostatic Alignment" works directly with the hypothalamus to establish internal equilibrium. When the hypothalamus is chronically activated (stress), the entire system operates in survival mode.

---

### References

1. [Saper & Lowell, Cell (2014)](https://pubmed.ncbi.nlm.nih.gov/24679536/) — hypothalamus and homeostasis
`,
  },
  {
    slug: 'psychoneuroimmunology',
    title: 'Psychoneuroimmunology',
    category: 'Neuroscience',
    shortDescription:
      'The study of links between mind, nervous system, and immune function — how mental states affect immunity.',
    content: `

**Psychoneuroimmunology** (PNI) is the field studying the bidirectional communication between the nervous system, endocrine system, and immune system. Mental states directly influence immune function at the cellular level.

### Key Findings

- **Stress** → suppressed immune function, increased inflammation
- **Relaxation** → enhanced natural killer cell activity
- **Social connection** → stronger immune response
- **Meditation** → reduced inflammatory markers

### In ONDA Life

Level 1 "Sensory Filtering & PNI" leverages neuroplasticity to strengthen the link between mental states and immune responses. Calming the nervous system through interoceptive practices has measurable effects on immune function.

### Scientific Basis
Built on: [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'diaphragm',
    title: 'Diaphragm',
    category: 'Body Systems',
    shortDescription:
      'The primary respiratory muscle — a dome-shaped sheet separating chest and abdomen, central to breath and vagal tone.',
    content: `

The **diaphragm** is the main muscle of respiration — a dome-shaped sheet that separates the thoracic cavity from the abdomen.¹ It contracts and relaxes with each breath, and its health is intimately linked to the vagus nerve and parasympathetic system.

### Functions

- **Breathing** — primary driver of inhalation
- **Pressure regulation** — creates pressure gradient for venous return
- **Core stability** — part of the inner unit
- **Vagal stimulation** — mechanical massage of the vagus nerve with each breath²

### In ONDA Life

"Diaphragmatic Release" in Part 1 aims to release spasms in this muscle. Chronic stress and shallow breathing can cause diaphragmatic holding patterns that restrict the vagus nerve and prevent deep parasympathetic recovery.

---

### References

1. [Lehrer et al., Appl Psychophysiol Biofeedback (2000)](https://pubmed.ncbi.nlm.nih.gov/19246382/) — diaphragmatic breathing and HRV
2. [Thayer & Lane, Neurosci Biobehav Rev (2009)](https://pubmed.ncbi.nlm.nih.gov/19463818/) — vagal tone and respiration
`,
  },
  {
    slug: 'parasympathetic-nervous-system',
    title: 'Parasympathetic Nervous System',
    category: 'Body Systems',
    shortDescription:
      'The "rest and digest" branch of the autonomic nervous system — promotes recovery, digestion, and calm.',
    content: `

The **parasympathetic nervous system** (PNS) is one of two branches of the autonomic nervous system. It promotes "rest and digest" — slowing heart rate, stimulating digestion, and enabling recovery.

### Key Effects

- Slowed heart rate
- Deep, diaphragmatic breathing
- Activated digestion and peristalsis
- Reduced cortisol
- Social engagement capacity

### In ONDA Life

Level 1 practices aim to activate the parasympathetic system through diaphragmatic breathing, extended exhales, and interoceptive awareness. The vagus nerve is the primary channel of parasympathetic influence.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [HRV & vagal tone](https://pubmed.ncbi.nlm.nih.gov/19463818/) (Thayer & Lane).
`,
  },
  {
    slug: 'sympathetic-nervous-system',
    title: 'Sympathetic Nervous System',
    category: 'Body Systems',
    shortDescription:
      'The "fight or flight" branch of the autonomic nervous system — mobilizes the body for action and threat response.',
    content: `

The **sympathetic nervous system** (SNS) is the "fight or flight" branch of the autonomic nervous system. It mobilizes the body for action — increasing heart rate, redirecting blood flow, and releasing stress hormones.

### Key Effects

- Increased heart rate and blood pressure
- Redirected blood flow to muscles
- Cortisol and adrenaline release
- Suppressed digestion
- Heightened alertness

### In ONDA Life

Chronic sympathetic activation (stress) keeps the body in deficit mode. Level 1 practices help restore balance by activating the parasympathetic system, allowing the sympathetic branch to return to baseline when not needed.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'insula',
    title: 'Insula',
    category: 'Neuroscience',
    shortDescription:
      'The insular cortex — the brain\'s primary hub for interoception, self-awareness, and emotional feeling.',
    content: `

The **insula** (or insular cortex) is a region of the cerebral cortex folded deep within the lateral sulcus. It is often called the "island" of the brain and serves as the primary hub for interoception and self-awareness.

### Functions

- **Interoceptive awareness** — sensing heartbeat, breath, gut
- **Emotional experience** — translating body signals into felt emotions
- **Self-awareness** — the neural basis of "I exist"
- **Empathy** — simulating others' internal states

### Relation to Insular Cortex

The terms "insula" and "insular cortex" refer to the same structure. The insula is the primary target of Level 1 interoceptive practices.

### Scientific Basis
Built on: [Interoception & insula](https://pubmed.ncbi.nlm.nih.gov/12030437/) (Craig); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'cortisol',
    title: 'Cortisol',
    category: 'Neuroscience',
    shortDescription:
      'The primary stress hormone — released by the adrenal glands, elevated in chronic stress.',
    content: `

**Cortisol** is the main glucocorticoid hormone produced by the adrenal glands.¹ It is essential for life but becomes problematic when chronically elevated.

### Normal Functions

- Regulates metabolism and blood sugar
- Modulates immune response
- Supports wakefulness and alertness
- Part of the stress response (HPA axis)

### Chronic Elevation

- Suppressed immune function
- Impaired digestion and peristalsis
- Reduced HRV
- Anxiety, sleep disruption
- Metabolic dysfunction

### In ONDA Life

One marker of Part 1 progress is "reduced levels of basal cortisol." Level 1 practices activate the parasympathetic system, which downregulates the HPA axis and allows cortisol to return to healthy baseline levels.

---

### References

1. [Sapolsky, Arch Intern Med (2004)](https://pubmed.ncbi.nlm.nih.gov/15557597/) — stress and cortisol
`,
  },
  {
    slug: 'peristalsis',
    title: 'Peristalsis',
    category: 'Body Systems',
    shortDescription:
      'The wave-like muscular contractions that move food through the digestive tract.',
    content: `

**Peristalsis** is the coordinated, wave-like contraction of smooth muscle that moves contents through the digestive tract — from esophagus to intestines. It operates largely automatically, regulated by the enteric nervous system and vagal tone.

### Stress and Peristalsis

Under sympathetic activation (stress), peristalsis slows or stops — the body prioritizes survival over digestion. Chronic stress leads to irregular, sluggish peristalsis.

### In ONDA Life

"Restoration of rhythmic peristalsis" is a biological marker of Part 1 completion. When the parasympathetic system is activated and cortisol drops, the gut can return to its natural rhythmic movement — a sign that the body perceives safety.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [HRV & vagal tone](https://pubmed.ncbi.nlm.nih.gov/19463818/) (Thayer & Lane).
`,
  },
  {
    slug: 'heart-rate-variability',
    title: 'Heart Rate Variability',
    category: 'Body Systems',
    shortDescription:
      'The variation in time between heartbeats — a key marker of nervous system flexibility and recovery capacity.',
    content: `

**Heart Rate Variability** (HRV) is the variation in the time interval between successive heartbeats.¹ Contrary to intuition, a healthy heart does not beat like a metronome — it constantly adjusts its rhythm in response to breathing, stress, and environmental demands.

### What It Measures

- **Parasympathetic tone** — higher HRV generally indicates stronger vagal influence
- **Stress resilience** — ability to recover quickly after challenge
- **Nervous system flexibility** — capacity to shift between activation and recovery
- **Recovery capacity** — readiness for physical and mental load

### In ONDA Life

Increased HRV is a biological marker of Part 1 ("I Am") and Part 2 ("I Move") progress.² Part 1 practices activate the parasympathetic system, raising baseline HRV. Part 2 "Rhythmic Coherence" further increases HRV by synchronizing axial movements with the respiratory cycle.

---

### References

1. [Thayer & Lane, Neurosci Biobehav Rev (2009)](https://pubmed.ncbi.nlm.nih.gov/19463818/) — HRV as vagal tone marker
2. [Lehrer et al., Appl Psychophysiol Biofeedback (2000)](https://pubmed.ncbi.nlm.nih.gov/19246382/) — resonance breathing and HRV
`,
  },
  {
    slug: 'central-pattern-generators',
    title: 'Central Pattern Generators',
    category: 'Neuroscience',
    shortDescription:
      'Spinal cord circuits that generate rhythmic movement patterns — the neural basis of "autopilot" locomotion.',
    content: `

**Central Pattern Generators** (CPGs) are neural circuits in the spinal cord that produce rhythmic, coordinated movement patterns without continuous input from the brain. They underlie walking, swimming, breathing, and other cyclical behaviors.

### How They Work

CPGs are "half-center" networks — mutually inhibiting neuron groups that alternate activation, creating oscillating output. Once activated, they can sustain rhythm with minimal sensory feedback.

### In ONDA Life

Part 2 ("I Move") activates CPGs to create natural, effortless locomotion. Movement becomes "as effortless as swimming" — the body's built-in motor programs take over, reducing conscious effort and enabling fluid navigation through space.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'vestibulo-ocular-reflex',
    title: 'Vestibulo-Ocular Reflex',
    category: 'Neuroscience',
    shortDescription:
      'The reflex that stabilizes gaze during head movement — keeps vision clear while moving.',
    content: `

The **Vestibulo-Ocular Reflex** (VOR) is a reflex that stabilizes visual images on the retina during head movement. When the head turns, the eyes automatically move in the opposite direction to maintain a stable view of the world.

### Function

- Enables clear vision during movement
- Foundation for visual navigation
- Contributes to the feeling of stability within flow
- Involves vestibular system, brainstem, and eye muscles

### In ONDA Life

Part 2 trains VOR as part of "stabilizing gaze while the head is in motion." This is the foundation for visual navigation and the feeling of stability within the flow — essential for moving through space with confidence.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'vestibular-system',
    title: 'Vestibular System',
    category: 'Body Systems',
    shortDescription:
      'The inner ear balance system — the body\'s primary gyroscope for orientation and spatial awareness.',
    content: `

The **vestibular system** is the sensory system in the inner ear that provides the sense of balance and spatial orientation. It detects head position, movement, and acceleration.

### Components

- **Semicircular canals** — detect rotational movement
- **Otolith organs** — detect linear acceleration and gravity
- **Vestibular nerve** — carries signals to brainstem and cerebellum

### In ONDA Life

Part 2 targets the vestibular system as "the primary gyroscope for orientation within the flow." A well-calibrated vestibular system enables intuitive navigation — you sense where you are in space without conscious calculation.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'cerebellum',
    title: 'Cerebellum',
    category: 'Neuroscience',
    shortDescription:
      'The "little brain" — coordinates movement, balance, and motor learning; modulates smoothness.',
    content: `

The **cerebellum** ("little brain") is a structure at the back of the brain that coordinates voluntary movement, balance, and motor learning. It receives input from the spinal cord, vestibular system, and cortex, and fine-tunes motor output.

### Functions

- **Motor coordination** — smooth, precise movement
- **Balance** — postural control
- **Motor learning** — refining movement through practice
- **Noise reduction** — eliminating jerky, uncoordinated output

### In ONDA Life

Part 2 works with "spinal neural circuits and cerebellum" as "centers for rhythmic movement; modulating smoothness and eliminating noise." The cerebellum learns to produce fluid, efficient movement with minimal effort.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'fascia',
    title: 'Fascia',
    category: 'Body Systems',
    shortDescription:
      'The connective tissue web that wraps muscles and organs — transmits force through the body.',
    content: `

**Fascia** is the connective tissue that wraps muscles, organs, bones, and nerves into a continuous web. It transmits mechanical force throughout the body and is essential for coordinated movement.

### Key Properties

- **Continuity** — forms fascial chains that link distant body parts
- **Gliding** — healthy fascia allows smooth sliding between layers
- **Force transmission** — transfers force efficiently when aligned
- **Proprioception** — contains sensory receptors for body awareness

### In ONDA Life

Part 2 "Intermuscular Coordination" trains "transferring force through fascial chains, allowing the whole body to move as a single vector." Improved fascial gliding and synovial joint lubrication are markers of Part 2 progress.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'neurophysiology',
    title: 'Neurophysiology',
    category: 'Neuroscience',
    shortDescription:
      'The study of how the nervous system functions — from single neurons to brain-wide circuits.',
    content: `

**Neurophysiology** is the branch of physiology that studies the function of the nervous system. It examines how neurons, neural circuits, and brain regions generate behavior, perception, and consciousness.

### Scope

- **Cellular** — ion channels, action potentials, synaptic transmission
- **Circuit** — how neurons connect and communicate
- **Systems** — brainstem, cerebellum, cortex, autonomic nervous system
- **Integrative** — how neural activity produces movement, emotion, thought

### In ONDA Life

ONDA practices are grounded in neurophysiology. Part 3 works with "the deepest, automated processes" — brainstem, reticular formation, sensorimotor cortex — from a neurophysiological perspective. Each protocol targets specific neural structures with measurable outcomes.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'reticular-formation',
    title: 'Reticular Formation',
    category: 'Neuroscience',
    shortDescription:
      'A network in the brainstem that regulates arousal, consciousness, and motor control.',
    content: `

The **reticular formation** is a diffuse network of neurons in the brainstem that extends from the medulla to the midbrain. It plays a central role in regulating arousal, sleep-wake cycles, attention, and motor control.

### Key Functions

- **Arousal** — activates the cortex for wakefulness and attention
- **Motor control** — modulates muscle tone, posture, locomotion
- **Sensory filtering** — gates incoming sensory information
- **Autonomic regulation** — influences heart rate, breathing

### In ONDA Life

Part 3 aims to "tune the brainstem and reticular formation." A well-regulated reticular formation supports the rapid switching between "relaxation/fluidity" and "tone/stability" — essential for adaptive movement and gravity mastery.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'sensorimotor-cortex',
    title: 'Sensorimotor Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain region that integrates sensation and movement — the primary motor and somatosensory cortex.',
    content: `

The **sensorimotor cortex** refers to the brain regions that integrate sensory input with motor output — primarily the primary motor cortex (M1) and primary somatosensory cortex (S1), which lie adjacent to each other in the frontal and parietal lobes.

### Functions

- **Motor execution** — M1 sends commands to muscles
- **Sensory feedback** — S1 receives touch, proprioception, pain
- **Sensorimotor integration** — the loop that enables precise, adaptive movement
- **Motor learning** — plasticity for skill acquisition

### In ONDA Life

Part 3 activates "the primary sensorimotor cortex" as part of gravity mastery. Training this region improves the brain-muscle-brain feedback loop — the foundation for efficient movement and the elimination of parasitic tension.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'locomotion',
    title: 'Locomotion',
    category: 'Body Systems',
    shortDescription:
      'The ability to move through space — walking, running, swimming — driven by spinal pattern generators.',
    content: `

**Locomotion** is the act of moving from one place to another — walking, running, swimming, crawling. It is one of the most fundamental motor behaviors, largely controlled by Central Pattern Generators (CPGs) in the spinal cord.

### Key Features

- **Rhythmic** — alternating limb movements in coordinated patterns
- **Automatic** — CPGs can generate rhythm without continuous brain input
- **Adaptive** — modulated by sensory feedback (terrain, obstacles)
- **Energy-efficient** — when well-tuned, uses minimal effort

### In ONDA Life

Parts 2 and 3 work with "spinal pattern generators for natural locomotion." The goal is to transform movement from effortful "pushing" to effortless "flow" — the body navigating space using inertia, rhythm, and the natural curves of the spine.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'body-armor',
    title: 'Body Armor',
    category: 'Core Concepts',
    shortDescription:
      'Chronic muscular tension that holds repressed emotions — a concept from Wilhelm Reich, widely used in body-oriented therapy.',
    content: `

**Body armor** (German: *Körperpanzer*; Russian: *телесный панцирь*) is a concept introduced by Wilhelm Reich. It refers to chronic muscular tension and rigidity that develops as a defense against repressed emotions, trauma, or unacceptable impulses.

### Reich's Theory

Reich observed that psychological defenses manifest physically — the body "armors" itself by holding tension in specific muscle groups. This armor:

- **Blocks** the free flow of energy and emotion
- **Stores** unresolved experience in tissue
- **Restricts** breathing, movement, and expression
- **Creates** a feedback loop: tension → numbness → more tension

### In Body-Oriented Therapy

The concept is central to Western body-oriented psychotherapy (Bioenergetics, Somatic Experiencing, and related approaches). The goal is to soften the armor through breath, movement, and awareness — releasing held tension and restoring vitality.

### In ONDA Life

Part 3 ("I Adapt") targets "reduction of muscular tension (the \u2018body armor\u2019)." As you master gravity and develop interoceptive efficiency, chronic holding patterns release. The body transitions from defensive rigidity to responsive fluidity.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'polyvagal-theory',
    title: 'Polyvagal Theory',
    category: 'Neuroscience',
    shortDescription:
      'Stephen Porges\' theory of the vagus nerve — three neural states: ventral vagal (safety), sympathetic (mobilization), dorsal vagal (shutdown).',
    content: `

**Polyvagal Theory**, developed by Stephen Porges,¹ describes how the vagus nerve has evolved in layers, each supporting a different survival strategy. The nervous system doesn't simply switch between "on" and "off" — it navigates between distinct physiological states.

### Three States

| State | Branch | Experience | Behavior |
|-------|--------|------------|----------|
| **Ventral vagal** | Myelinated vagus | Safety, connection | Social engagement |
| **Sympathetic** | Spinal nerves | Mobilization | Fight or flight |
| **Dorsal vagal** | Unmyelinated vagus | Shutdown | Freeze, collapse |

### Key Insight

We can "drift" between states. The goal is not to eliminate sympathetic activation but to use it skillfully — accessing energy for action without collapsing into panic or rage.

### In ONDA Life

Part 4 trains the nervous system to transition smoothly between Ventral Vagus (safety, social engagement) and Sympathetic (energy for maneuver). Sympathetic tone becomes fuel for precision rather than a trigger for overwhelm.

---

### References

1. [Porges, Biol Psychol (2007)](https://pubmed.ncbi.nlm.nih.gov/17049418/) — Polyvagal Theory
`,
  },
  {
    slug: 'neuroception',
    title: 'Neuroception',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s unconscious detection of safety or threat — happens before conscious perception.',
    content: `

**Neuroception** is a term coined by Stephen Porges¹ to describe the nervous system's automatic, unconscious evaluation of the environment for safety or threat. It occurs before we consciously perceive or think — the body "reads" the situation and responds.

### How It Works

- **Below awareness** — we don't choose to feel safe or threatened
- **Multi-sensory** — integrates facial cues, voice tone, body language, context
- **Rapid** — bypasses slow cognitive processing
- **Drives state** — determines which polyvagal state we occupy

### The Chain

Reticular Formation → Thalamus → Motor Cortex. This pathway allows the brain to detect environmental changes and issue reactions "before the thought" — bypassing slow cognitive filters.

### In ONDA Life

Part 4 trains "the chain: Reticular Formation → Thalamus → Motor Cortex" so the brain can read environmental changes (neuroception) and respond with precision. You react to flow, not to thought.

---

### References

1. [Porges, Biol Psychol (2007)](https://pubmed.ncbi.nlm.nih.gov/17049418/) — neuroception and Polyvagal Theory
`,
  },
  {
    slug: 'neuroplasticity',
    title: 'Neuroplasticity',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s ability to reorganize itself by forming new neural connections throughout life.',
    relatedSlugs: ['prefrontal-cortex', 'hippocampus', 'psycho-neural-network'],
    content: `

**Neuroplasticity** is the brain's capacity to change its structure and function in response to experience, learning, and practice. Contrary to the old belief that the adult brain is fixed, research shows that neural pathways can be rewired at any age.

### Key Mechanisms

- **Synaptic plasticity** — strengthening or weakening connections between neurons
- **Neurogenesis** — birth of new neurons (in hippocampus and other regions)
- **Cortical remapping** — brain regions can take on new functions after injury or training

### In ONDA Life

ONDA practices leverage neuroplasticity at every level. Level 1 interoceptive calibration rewires the brainstem-insula connection. Level 3 cognitive protocols strengthen prefrontal circuits. The entire system is designed to systematically update your "firmware" through repeated, structured practice.

### Scientific Basis
Built on: [Neuroplasticity research](https://pubmed.ncbi.nlm.nih.gov/17329479/) (Doidge et al.); [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen).
`,
  },
  {
    slug: 'bdnf',
    title: 'BDNF',
    category: 'Biological Software',
    shortDescription:
      'Brain-Derived Neurotrophic Factor — the "Miracle-Gro" for your brain. Supports neuron survival and growth.',
    content: `

**BDNF** (Brain-Derived Neurotrophic Factor) is a protein that supports the survival of existing neurons and encourages the growth of new ones. It is often called the "Miracle-Gro" for the brain—high levels make your brain more plastic, allowing you to learn new skills and overwrite old habits at an accelerated rate.

### Key Functions

- **Neuron survival** — protects existing neurons from degeneration
- **Neurogenesis** — supports birth of new neurons, especially in the Hippocampus
- **Synaptic plasticity** — strengthens connections; enables rapid learning
- **Flow trigger** — intense exercise triggers massive BDNF release

### In ONDA Life

The Neuroplasticity & Flow article details the BDNF Trigger protocol: 3 minutes of high-intensity movement before learning opens a "Plasticity Window" where your brain is physically more capable of forming new synaptic connections for the next 60–90 minutes.
`,
  },
  {
    slug: 'myelin',
    title: 'Myelin',
    category: 'Neural Hardware',
    shortDescription:
      'The insulating sheath around neural pathways — increases signal speed. Rapid myelination = rapid skill acquisition.',
    content: `

**Myelin** is a fatty insulating sheath that wraps around axons (neural pathways). Each time you repeat a high-quality action, your brain adds more myelin to that pathway—increasing the speed of electrical signals up to 100x. Mastering a skill is essentially a process of rapid myelination.

### Key Properties

- **Insulation** — wraps axons like rubber around a wire
- **Speed** — myelinated pathways conduct signals faster
- **Skill** — "practice makes perfect" because practice adds myelin
- **Quality matters** — only correct repetitions add productive myelin

### In ONDA Life

Mastering Flow is a process of rapid myelination. The Neuroplasticity & Flow article details protocols for entering the Flow State—where high-quality repetitions build myelin on the right circuits. See also Basal Ganglia for habit formation.
`,
  },
  {
    slug: 'hpa-axis',
    title: 'HPA Axis',
    category: 'Neuroscience',
    shortDescription:
      'Hypothalamus-Pituitary-Adrenal axis — the body\'s central stress response system that releases cortisol.',
    content: `

The **HPA axis** (Hypothalamus-Pituitary-Adrenal) is the body's primary stress response system. When activated, it triggers the release of cortisol and other stress hormones, mobilizing the body for challenge.

### The Pathway

1. **Hypothalamus** — releases CRH (corticotropin-releasing hormone)
2. **Pituitary** — releases ACTH (adrenocorticotropic hormone)
3. **Adrenal glands** — release cortisol (and adrenaline from the medulla)

### Cortisol: Poison or Fuel?

Chronically elevated cortisol is damaging. But in acute, controlled doses, cortisol and adrenaline sharpen focus and provide energy. The key is regulation — teaching the body to control release rather than being controlled by it.

### In ONDA Life

Part 4 "Neuroendocrinology" directly impacts the HPA axis. We teach the body to control cortisol and adrenaline release, turning them "from poison into fuel for precision."

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'proprioception',
    title: 'Proprioception',
    category: 'Body Systems',
    shortDescription:
      'The sense of body position and movement in space — "where am I" and "how am I moving."',
    relatedSlugs: ['interoception', 'vestibular-system', 'sensorimotor-cortex'],
    content: `

**Proprioception** is the sense of your body's position, movement, and orientation in space. Unlike interoception (internal state), proprioception tells you where your limbs are, how they're moving, and your relationship to gravity — without looking.

### Receptors

- **Muscle spindles** — detect muscle length and stretch
- **Golgi tendon organs** — detect muscle tension
- **Joint receptors** — detect joint angle and position
- **Vestibular system** — head position and movement

### In ONDA Life

Part 4 develops proprioception as "a sense of trajectory and the boundaries of one's \u2018safety bubble.\u2019" Combined with vestibular precision and diffuse perception, it enables maneuverability — feeling the trajectory and flowing through it.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'lymphatic-system',
    title: 'Lymphatic System',
    category: 'Body Systems',
    shortDescription:
      'The body\'s drainage network — clears metabolic waste and supports immune function; pumped by muscle movement.',
    content: `

The **lymphatic system** is a network of vessels and nodes that drains fluid, metabolic waste, and cellular debris from tissues. Unlike the circulatory system, it has no central pump — it relies on muscle contraction and movement to circulate.

### Key Functions

- **Drainage** — removes metabolic byproducts, excess fluid
- **Immune function** — lymph nodes filter pathogens
- **Fat absorption** — from the digestive tract
- **Stress clearance** — lactic acid, inflammatory markers

### Muscle as Pump

Muscle tone and movement act as a natural pump for lymph. Sedentary states and chronic tension impair lymphatic flow; rhythmic movement enhances it.

### In ONDA Life

Part 4 "Lymphology" uses muscle tone as a natural pump to clear the body of stress metabolic byproducts, ensuring physical freshness even under high-load conditions.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'motor-cortex',
    title: 'Motor Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain region that sends movement commands to muscles — primary motor cortex (M1) and premotor areas.',
    content: `

The **motor cortex** is the region of the cerebral cortex responsible for planning, controlling, and executing voluntary movements. The primary motor cortex (M1) sends direct commands to muscles; premotor and supplementary motor areas plan and sequence movements.

### Key Areas

- **Primary motor cortex (M1)** — direct output to spinal cord and muscles
- **Premotor cortex** — movement preparation, sensory-guided action
- **Supplementary motor area** — internally guided movement, sequences

### In ONDA Life

Part 4 trains the chain "Reticular Formation → Thalamus → Motor Cortex" — enabling reactions "before the thought." The motor cortex executes maneuverability; when fed by rapid neuroception, it produces precise, adaptive responses without slow cognitive filtering.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'neurobiology',
    title: 'Neurobiology',
    category: 'Neuroscience',
    shortDescription:
      'The study of the nervous system at all levels — from molecules and cells to circuits and behavior.',
    content: `

**Neurobiology** is the scientific study of the nervous system — its structure, function, development, and role in behavior. It spans levels from single neurons to brain-wide networks.

### Scope

- **Molecular** — ion channels, neurotransmitters, receptors
- **Cellular** — neuron structure, synaptic plasticity
- **Circuit** — how neurons connect and communicate
- **Systems** — brain regions, neural pathways
- **Behavioral** — how neural activity produces action and experience

### In ONDA Life

Part 4 "Neurobiology and Neuroception" trains the chain Reticular Formation → Thalamus → Motor Cortex. Understanding neurobiology allows us to target specific circuits — turning scientific knowledge into precise, measurable practices.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'cognitive-system',
    title: 'Cognitive System',
    category: 'Core Concepts',
    shortDescription:
      'The brain networks involved in thinking, attention, memory, and decision-making — slower than sensory-motor processing.',
    content: `

The **cognitive system** refers to the brain networks that support higher-order mental processes: attention, memory, reasoning, planning, and conscious decision-making. These processes are relatively slow compared to sensory-motor reflexes.

### Key Regions

- **Prefrontal cortex** — planning, inhibition, working memory
- **Hippocampus** — memory formation and recall
- **Parietal cortex** — spatial attention, integration
- **Anterior cingulate** — conflict monitoring, effort

### Speed of Processing

Cognitive processing operates on the order of hundreds of milliseconds. Sensory-motor pathways (reticular formation → thalamus → motor cortex) can respond in tens of milliseconds — "before the thought."

### In ONDA Life

Part 4 bypasses "slow cognitive filters" for maneuverability. Emotional navigation becomes a sensory process, not a cognitive calculation. The cognitive system remains available for reflection — but doesn't bottleneck action.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'neuroendocrinology',
    title: 'Neuroendocrinology',
    category: 'Neuroscience',
    shortDescription:
      'The study of interactions between the nervous system and endocrine system — how the brain regulates hormones.',
    content: `

**Neuroendocrinology** is the study of how the nervous system and endocrine (hormonal) system interact. The brain regulates hormone release; hormones in turn influence brain function and behavior.

### Key Pathways

- **HPA axis** — hypothalamus → pituitary → adrenal (stress response)
- **Hypothalamic-pituitary** — growth, reproduction, metabolism
- **Autonomic-endocrine** — sympathetic/parasympathetic effects on hormone release

### In ONDA Life

Part 4 "Neuroendocrinology" directly impacts the HPA axis. We teach the body to control cortisol and adrenaline release — turning stress hormones from "poison" (chronic elevation) into "fuel for precision" (acute, regulated mobilization).
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'pituitary',
    title: 'Pituitary Gland',
    category: 'Body Systems',
    shortDescription:
      'The "master gland" at the base of the brain — regulates growth, stress response, and other hormones.',
    content: `

The **pituitary gland** is a small gland at the base of the brain, often called the "master gland" because it controls many other endocrine glands. It receives signals from the hypothalamus and releases hormones into the bloodstream.

### Key Functions

- **Stress response** — releases ACTH, which stimulates the adrenal glands to release cortisol
- **Growth** — growth hormone
- **Reproduction** — gonadotropins
- **Metabolism** — thyroid-stimulating hormone
- **Fluid balance** — antidiuretic hormone

### In the HPA Axis

Hypothalamus → CRH → Pituitary → ACTH → Adrenal → Cortisol. The pituitary is the middle link in the stress response chain.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'adrenal',
    title: 'Adrenal Glands',
    category: 'Body Systems',
    shortDescription:
      'Small glands above the kidneys that release cortisol and adrenaline — the stress hormones.',
    content: `

The **adrenal glands** are two small glands located above each kidney. Each has two parts: the cortex (outer) and medulla (inner), which produce different hormones.

### Cortex (outer)

- **Cortisol** — glucocorticoid, stress response, metabolism
- **Aldosterone** — fluid and electrolyte balance
- **Androgens** — minor sex hormones

### Medulla (inner)

- **Adrenaline (epinephrine)** — rapid mobilization, fight or flight
- **Noradrenaline (norepinephrine)** — arousal, attention

### In ONDA Life

Part 4 teaches the body to control adrenal output. Instead of chronic cortisol and adrenaline release (stress), we develop the ability to mobilize acutely when needed — and return to baseline quickly.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'adrenaline',
    title: 'Adrenaline',
    category: 'Neuroscience',
    shortDescription:
      'Epinephrine — the hormone that mobilizes the body for action; released by the adrenal medulla.',
    content: `

**Adrenaline** (epinephrine) is a hormone and neurotransmitter released by the adrenal medulla in response to stress or excitement. It prepares the body for rapid action.

### Effects

- Increased heart rate and blood pressure
- Redirected blood flow to muscles
- Dilated airways
- Heightened alertness and focus
- Increased blood sugar

### Poison or Fuel?

Chronically elevated adrenaline contributes to anxiety and burnout. But in acute, controlled doses, it sharpens focus and provides energy for precision. Part 4 aims to use adrenaline as "fuel for precision" rather than a trigger for panic.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'lymphology',
    title: 'Lymphology',
    category: 'Body Systems',
    shortDescription:
      'The study of the lymphatic system — drainage, immune function, and the role of movement in lymph flow.',
    content: `

**Lymphology** is the branch of medicine and physiology that studies the lymphatic system — its structure, function, and disorders. It encompasses lymph flow, immune function, and the role of muscle movement in drainage.

### Key Concepts

- **Lymph** — fluid that drains from tissues, carrying waste and immune cells
- **Lymph nodes** — filter and immune activation sites
- **Lymphatic vessels** — no central pump; rely on muscle contraction
- **Stress metabolites** — lactic acid, inflammatory markers cleared via lymph

### In ONDA Life

Part 4 "Lymphology" uses muscle tone as a natural pump to clear the body of stress metabolic byproducts. Rhythmic movement and optimal muscle tone ensure lymphatic flow — physical freshness even under high-load conditions.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'dhea',
    title: 'DHEA',
    category: 'Neuroscience',
    shortDescription:
      'Dehydroepiandrosterone — the hormone of vitality and longevity; precursor to sex hormones.',
    content: `

**DHEA** (dehydroepiandrosterone) is a hormone produced primarily by the adrenal glands. It is a precursor to testosterone and estrogen and is often called the "hormone of vitality" or "anti-aging hormone."

### Key Functions

- **Vitality** — supports energy, mood, and resilience
- **Longevity** — levels decline with age; maintaining balance supports healthy aging
- **Precursor** — converts to testosterone and estrogen as needed
- **Stress balance** — under chronic stress, cortisol rises and DHEA falls

### Cortisol/DHEA Ratio

Chronic stress shifts adrenal output from DHEA toward cortisol. Part 5 aims to reverse this — the adrenals switch from "emergency cortisol release" to DHEA production, supporting the "winner's state" of calm dominance.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'testosterone',
    title: 'Testosterone',
    category: 'Neuroscience',
    shortDescription:
      'The primary male sex hormone — also in women; supports dominance, confidence, and metabolic vigor.',
    content: `

**Testosterone** is a steroid hormone produced in the testes (men), ovaries (women), and adrenal glands. It supports muscle mass, bone density, libido, and — at moderate levels — confidence and assertiveness without aggression.

### Key Effects

- **Metabolic** — muscle building, fat distribution
- **Psychological** — confidence, risk-taking, status
- **Neuroprotective** — supports brain function
- **Balance** — moderate levels support "calm dominance"

### In ONDA Life

Part 5 engages the Pituitary-Gonadal axis for "moderate testosterone stimulation" — the "winner's state." The feedback loop: Hypothalamus activation → Increased testosterone → Decreased cortisol = calm dominance without aggression.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'thymus',
    title: 'Thymus',
    category: 'Body Systems',
    shortDescription:
      'The gland behind the breastbone that trains T-cells — links immune function with social safety.',
    content: `

The **thymus** is a gland located behind the breastbone that plays a key role in immune function. It is where T-cells mature and learn to distinguish self from non-self. The thymus is largest in childhood and gradually shrinks with age.

### Key Functions

- **T-cell maturation** — trains immune cells
- **Immune competence** — strong thymus = robust immune response
- **Stress sensitivity** — chronic stress can impair thymic function

### In ONDA Life

Part 5 aims to "restore the link between the sense of social safety and a powerful immune response" through the thymus. When the nervous system perceives safety (ventral vagal state), immune function can operate optimally.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'basal-ganglia',
    title: 'Basal Ganglia',
    category: 'Neuroscience',
    shortDescription:
      'Deep brain structures that control movement, posture, and habit formation — "unshakeable" stability.',
    content: `

The **basal ganglia** are a group of nuclei deep in the brain that control voluntary movement, posture, habit formation, and reward-based learning. They modulate the motor cortex and support smooth, stable action.

### Key Functions

- **Movement control** — initiation, scaling, sequencing
- **Posture** — stable, "unshakeable" positions
- **Habits** — automatic, well-learned behaviors
- **Reward** — dopamine-driven motivation

### In ONDA Life

Part 5 engages the basal ganglia for "formation of stable, \u2018unshakeable\u2019 postures." Combined with deep postural muscles, this creates an internal framework of strength — the body as territory, occupied with calm dominance.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'endocrine-system',
    title: 'Endocrine System',
    category: 'Body Systems',
    shortDescription:
      'The system of glands that release hormones into the bloodstream — regulates metabolism, growth, stress, and reproduction.',
    content: `

The **endocrine system** is a network of glands that produce and secrete hormones directly into the bloodstream. Hormones regulate virtually every bodily function: metabolism, growth, stress response, reproduction, mood, and energy.

### Key Glands

- **Hypothalamus** — control center, releases releasing hormones
- **Pituitary** — "master gland," stimulates other glands
- **Adrenal** — cortisol, adrenaline, DHEA
- **Thyroid** — metabolism
- **Gonads** — testosterone, estrogen (reproduction, vitality)
- **Thymus** — immune function
- **Pancreas** — insulin, blood sugar

### In ONDA Life

Part 5 "Endocrine System (Dominance Hormonal Circuit)" reconfigures the body through hormonal balance: adrenals shift from cortisol to DHEA, pituitary-gonadal axis supports the "winner's state," thymus links safety with immune strength.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'gonads',
    title: 'Gonads',
    category: 'Body Systems',
    shortDescription:
      'The reproductive glands — testes and ovaries — produce sex hormones (testosterone, estrogen).',
    content: `

The **gonads** are the primary reproductive glands: the **testes** in men and **ovaries** in women. They produce sex hormones (testosterone, estrogen, progesterone) and gametes (sperm, eggs).

### Key Hormones

- **Testosterone** — produced mainly by testes (men) and adrenal cortex (both); supports muscle, bone, libido, confidence
- **Estrogen** — produced mainly by ovaries (women) and adrenal cortex; supports bone, mood, metabolism
- **Progesterone** — produced by ovaries; supports pregnancy, calm

### Pituitary-Gonadal Axis

The hypothalamus and pituitary regulate gonadal function through gonadotropins (LH, FSH). Part 5 engages this axis for "moderate testosterone stimulation" — the hormonal basis of calm dominance.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'autonomic-nervous-system',
    title: 'Autonomic Nervous System',
    category: 'Body Systems',
    shortDescription:
      'The involuntary nervous system — regulates heart, breath, digestion, and stress response.',
    content: `

The **autonomic nervous system** (ANS) controls involuntary bodily functions: heart rate, breathing, digestion, blood pressure, temperature regulation. It operates largely outside conscious control.

### Two Branches

| Branch | Function | State |
|--------|----------|-------|
| **Sympathetic** | Mobilization | Fight or flight |
| **Parasympathetic** | Recovery | Rest and digest |

### Polyvagal Refinement

Stephen Porges' Polyvagal Theory further divides the parasympathetic into ventral vagal (social engagement, safety) and dorsal vagal (freeze, shutdown). The ANS can be trained toward "smart parasympathetic" — calm alertness.

### In ONDA Life

Part 5 activates the Ventral Vagus for "calm alertness" — the heart beats powerfully and steadily, the brain is ready for effective dominance rather than panic.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'ventral-vagus',
    title: 'Ventral Vagus',
    category: 'Neuroscience',
    shortDescription:
      'The myelinated vagal branch — supports social engagement, safety, and calm alertness.',
    content: `

The **ventral vagal** (or ventral vagus) is the myelinated branch of the vagus nerve that supports the "social engagement" state. In Polyvagal Theory, it is the evolutionarily newest branch — enabling connection, safety, and calm presence.

### Characteristics

- **Myelinated** — fast, precise control
- **Social engagement** — facial expression, voice tone, listening
- **Calm alertness** — heart beats powerfully and steadily
- **Safety** — the body perceives no threat

### In ONDA Life

Part 5 "Smart Parasympathetic" activates the Ventral Vagus. This is a state of "calm alertness" — ready for effective dominance rather than panic. The heart beats powerfully and steadily; the brain is primed for presence.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'quantum-biology',
    title: 'Quantum Biology',
    category: 'Core Concepts',
    shortDescription:
      'The study of quantum effects in biological systems — coherence, biophotonics, and cellular communication.',
    content: `

**Quantum biology** explores how quantum mechanical phenomena (coherence, entanglement, tunneling) may operate in living systems. It bridges physics and biology, suggesting that cells and organisms may exploit quantum effects for efficiency and coordination.

### Key Concepts

- **Coherence** — synchronized oscillation; ordered rather than random
- **Biophotonics** — ultra-weak photon emission from cells; possible signaling
- **Electromagnetic fields** — cells generate and may respond to EM fields

### In ONDA Life

Part 5 "Quantum Biology (Coherence)" works on the "density of presence." From a biophotonics perspective, this is high coherence in the electromagnetic field of cells. Your presence becomes palpable to others on a physical level.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'coherence',
    title: 'Coherence',
    category: 'Core Concepts',
    shortDescription:
      'Synchronized, ordered oscillation — in physics, biology, and the subjective sense of "density of presence."',
    content: `

**Coherence** describes a state of synchronized, ordered oscillation — as opposed to random, chaotic fluctuation. In physics, coherent waves align in phase; in biology, coherent systems exhibit coordinated activity.

### Levels of Coherence

- **Physical** — laser light, superconducting states
- **Biological** — heart-brain coherence (HRV), cellular EM field alignment
- **Psychological** — the subjective sense of "density of presence," integrated awareness

### In ONDA Life

Part 5 works on "the density of presence" through "high coherence in the electromagnetic field of the cells." Coherent presence is palpable — others register your stability before you speak.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'biophotonics',
    title: 'Biophotonics',
    category: 'Core Concepts',
    shortDescription:
      'The study of light emission from living systems — ultra-weak photon emission and possible cellular signaling.',
    content: `

**Biophotonics** is the study of light (photons) in biological systems. Living cells emit ultra-weak photons — too faint for normal vision but detectable by sensitive instruments. The function of this emission is debated; hypotheses include cellular signaling and coherence.

### Key Findings

- **Ultra-weak photon emission** — cells emit light in the visible range
- **Coherence** — emission may be coherent under certain conditions
- **Stress correlation** — emission patterns may change with stress/health

### In ONDA Life

Part 5 "Quantum Biology (Coherence)" references biophotonics: "high coherence in the electromagnetic field of the cells" makes your presence palpable. The body's coherent state may be detectable by others at a subtle level.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'limbic-system',
    title: 'Limbic System',
    category: 'Neuroscience',
    shortDescription:
      'The emotional brain — a network of structures that process emotions, memory, and social behavior.',
    content: `

The **limbic system** is a network of brain structures involved in emotion, memory, motivation, and social behavior. It sits between the brainstem and the cortex, acting as a bridge between primitive survival and higher cognition.

### Key Structures

- **Amygdala** — threat detection, emotional arousal, fear
- **Hippocampus** — memory formation, spatial navigation
- **Hypothalamus** — links emotion to physiology (hormones, autonomic)
- **Cingulate cortex** — conflict monitoring, emotional regulation
- **Nucleus accumbens** — reward, motivation

### Functions

- **Emotional processing** — feeling and interpreting emotions
- **Memory** — especially emotional memories
- **Social behavior** — attachment, empathy, bonding
- **Motivation** — drive and reward

### In ONDA Life

Part 5 "Limbic Influence" describes how others register your stability and limbic confidence before you speak. A well-regulated limbic system broadcasts calm dominance — others sense it through limbic-to-limbic communication.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'mirror-neurons',
    title: 'Mirror Neurons',
    category: 'Neuroscience',
    shortDescription:
      'Neurons that fire when we observe others\' actions — the biological basis of empathy and social intuition.',
    content: `

**Mirror neurons** are a class of neurons that fire both when we perform an action and when we observe someone else performing the same action. They were first discovered in the premotor cortex of macaque monkeys and are thought to exist in humans.

### Key Functions

- **Action understanding** — inferring intentions from observed movement
- **Empathy** — resonating with others' emotional states
- **Imitation** — learning through observation
- **Social intuition** — "reading" others without conscious analysis

### In ONDA Life

Part 6 trains the "Mirror Neuron System (Premotor Cortex)" — your "biological Wi-Fi." We develop the ability to instantaneously read the intentions and states of others through micro-expressions and gestures, turning intuition into a precise navigational tool.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'oxytocin',
    title: 'Oxytocin',
    category: 'Neuroscience',
    shortDescription:
      'The "bonding hormone" — promotes trust, belonging, and social connection; lowers anxiety and aggression.',
    relatedSlugs: ['amygdala', 'vagus-nerve', 'anterior-cingulate-cortex'],
    content: `

**Oxytocin** is a hormone and neuropeptide produced in the hypothalamus and released by the pituitary. It is often called the "love hormone" or "bonding hormone" for its role in social connection, trust, and attachment.

### Key Effects

- **Trust** — increases willingness to cooperate
- **Bonding** — strengthens attachment (parent-child, romantic, social)
- **Anxiety reduction** — lowers baseline anxiety (counteracts amygdala reactivity)
- **Aggression reduction** — dampens defensive aggression
- **Social salience** — enhances attention to social cues

### In ONDA Life

Part 6 "Oxytocin Profile" works with the hormone of trust and belonging. The goal is to train the system to produce oxytocin in response to safe social contact — which automatically lowers baseline anxiety and aggression, enabling social engagement without fear.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'anterior-cingulate-cortex',
    title: 'Anterior Cingulate Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain region for conflict monitoring, social sensing, and emotional regulation.',
    content: `

The **anterior cingulate cortex** (ACC) is a region of the cingulate cortex that wraps around the corpus callosum. It is involved in conflict monitoring, error detection, pain processing, and — critically — social and emotional regulation.

### Key Functions

- **Conflict monitoring** — detecting when actions conflict with goals
- **Social sensing** — detecting social errors and signals
- **Emotional regulation** — modulating emotional responses
- **Empathy** — emotional resonance with others

### In ONDA Life

Part 6 trains the ACC as the "detector for social errors and signals." We learn "emotional osmosis" — the exchange of states with others — while maintaining autonomy and avoiding being pulled into someone else's chaos.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'emotional-osmosis',
    title: 'Emotional Osmosis',
    category: 'Core Concepts',
    shortDescription:
      'The unconscious exchange of emotional states between people — feeling what others feel while maintaining autonomy.',
    content: `

**Emotional osmosis** describes the process by which emotional states are exchanged between people without conscious effort — like osmosis, where substances pass through a membrane by diffusion. We "absorb" the emotional tone of those around us and, in turn, influence theirs.

### How It Works

- **Unconscious** — happens below awareness
- **Bidirectional** — we both receive and transmit
- **Limbic resonance** — limbic systems influence each other
- **Mirror neurons** — we simulate others' states internally

### The Challenge

Emotional osmosis can pull us into someone else's chaos — we lose our "coherent center." The skill is to participate in the exchange while maintaining autonomy.

### In ONDA Life

Part 6 trains "emotional osmosis" through the Anterior Cingulate Cortex. We learn to exchange states with others — feeling the "pack," influencing it — while avoiding being pulled into chaos. Your presence becomes the "glue" that unites the group.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'social-sensing',
    title: 'Social Sensing',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s ability to process social signals — gaze, tone, posture, micro-expressions — often below conscious awareness.',
    content: `

**Social sensing** is the brain's capacity to process and interpret social signals from others. This includes gaze direction, voice tone, body posture, facial micro-expressions, and subtle gestures — often below conscious awareness.

### Key Channels

- **Gaze** — where someone is looking; eye contact or avoidance
- **Tone** — prosody, pitch, rhythm of speech
- **Posture** — openness, tension, orientation toward or away
- **Micro-expressions** — brief, involuntary facial cues
- **Gesture** — hand movements, body language

### Neural Basis

Social sensing involves the mirror neuron system, anterior cingulate cortex, and limbic structures. The brain integrates these signals to infer intentions, emotional states, and social dynamics — enabling "reading" others without explicit analysis.

### In ONDA Life

Part 6 trains "Social Sensing" through the Anterior Cingulate Cortex — the detector for social errors and signals. We develop the ability to read and broadcast signals of safety and status through the subtlest movements, turning social intuition into a precise navigational tool.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'norepinephrine',
    title: 'Norepinephrine',
    category: 'Neuroscience',
    shortDescription:
      'A neurotransmitter that enhances alertness, attention, and inhibitory control — supports cognitive clarity.',
    content: `

**Norepinephrine** (noradrenaline) is a neurotransmitter and hormone that plays a key role in arousal, attention, and the stress response. It is produced in the locus coeruleus (brainstem) and adrenal medulla.

### Key Effects

- **Alertness** — increases wakefulness and vigilance
- **Attention** — enhances focus on salient stimuli
- **Inhibitory control** — supports suppression of impulsive reactions
- **Signal-to-noise** — improves extraction of signal from noise

### In ONDA Life

Part 7 "Neural Clarity (Norepinephrine)" utilizes norepinephrine modulation to enhance alertness and inhibitory control over impulsive reactions. Metacognitive monitoring trains the medial PFC to separate objective facts from subjective interpretations.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'prefrontal-cortex',
    title: 'Prefrontal Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s command center for executive functions — attention, planning, inhibition, and cognitive control.',
    relatedSlugs: ['amygdala', 'dorsolateral-prefrontal-cortex', 'anterior-cingulate-cortex'],
    content: `

The **prefrontal cortex** (PFC) is the front part of the frontal lobe, responsible for executive functions: planning, decision-making, working memory, attention control, and inhibition of inappropriate responses.

### Key Regions

- **Dorsolateral PFC (dlPFC)** — cognitive clarity, focus retention, working memory
- **Medial PFC (mPFC)** — self-reflection, metacognition, separating fact from interpretation
- **Ventromedial PFC** — emotional regulation, social decision-making

### In ONDA Life

Part 7 activates the PFC as the "command center for attention and executive functions." We strengthen the link between PFC and Anterior Cingulate Cortex for instantaneous detection of inconsistencies — the foundation of discernment.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'dorsolateral-prefrontal-cortex',
    title: 'Dorsolateral Prefrontal Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The dlPFC — supports cognitive clarity, working memory, and sustained focus.',
    content: `

The **dorsolateral prefrontal cortex** (dlPFC) is the upper outer region of the PFC. It is critical for "cold" cognitive functions: working memory, sustained attention, planning, and cognitive flexibility.

### Key Functions

- **Working memory** — holding and manipulating information
- **Cognitive clarity** — sharp, undistracted thinking
- **Focus retention** — maintaining attention under load
- **Inhibition** — suppressing irrelevant responses

### In ONDA Life

Part 7 targets the dlPFC for "cognitive clarity and focus retention." A well-tuned dlPFC creates the "cognitive gap" between stimulus and reaction — the space for discernment rather than reflexive response.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'visual-cortex',
    title: 'Visual Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain region that processes visual information — V1 through V5, from raw input to complex perception.',
    content: `

The **visual cortex** is the region of the occipital lobe that processes visual information. It is organized in a hierarchy from V1 (primary) to V5 (MT), each layer extracting more complex features.

### Hierarchy (V1–V5)

- **V1 (Primary)** — edges, orientation, basic features
- **V2** — contours, texture, simple shapes
- **V3** — form, dynamic form
- **V4** — color, object recognition
- **V5 (MT)** — motion, movement vectors

### In ONDA Life

Part 7 "Sensorimotor Integration" develops deep processing of contours, shapes, and movement vectors through the visual cortex (V1–V5). We train the ability to isolate key signals from a dense flow of external stimuli.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'biofeedback',
    title: 'Biofeedback',
    category: 'Core Concepts',
    shortDescription:
      'Real-time feedback of physiological signals — learning to consciously regulate heart rate, brain waves, muscle tension.',
    content: `

**Biofeedback** is a technique that provides real-time information about physiological processes (heart rate, brain waves, muscle tension, skin conductance) so that a person can learn to consciously regulate them.

### Common Modalities

- **Heart rate variability (HRV)** — breathing coherence, stress resilience
- **EEG/Neurofeedback** — brain wave patterns (alpha, theta, beta)
- **EMG** — muscle tension
- **Galvanic skin response** — arousal level

### In ONDA Life

Biofeedback principles underlie many ONDA practices. Connecting a fitness tracker or smartwatch provides real-time vitals during practice. Part 7 biomarkers (P300, saccadic stability, theta/alpha states) can be measured and trained through biofeedback approaches.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'p300',
    title: 'P300',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s electrical response to something significant, novel, or expected in the information stream — an ERP component.',
    content: `

The **P300** (or P3) is an event-related potential (ERP) — an electrical response of the brain that occurs about 300 milliseconds after the presentation of a significant, novel, or expected stimulus. It reflects the brain's detection and processing of meaningful information.

### Key Properties

- **Latency** — ~300 ms after stimulus
- **Amplitude** — stronger when stimulus is more salient or surprising
- **Location** — maximal over parietal cortex
- **Function** — attention allocation, context updating, decision-making

### In ONDA Life

Part 7 lists "P300 Amplitude Increase" as a progress biomarker — indicating how quickly and efficiently the brain recognizes a significant stimulus. Higher P300 amplitude suggests improved signal-to-noise optimization and cognitive clarity.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'saccades',
    title: 'Saccades',
    category: 'Neuroscience',
    shortDescription:
      'Rapid, ballistic eye movements that shift gaze from one point to another — the basis of visual scanning.',
    content: `

**Saccades** are rapid, ballistic eye movements that shift the point of gaze from one location to another. They are the primary way we scan the visual world — we don't move our eyes smoothly across a scene, we jump in discrete "saccades."

### Key Properties

- **Speed** — very fast (up to 900°/sec)
- **Ballistic** — once initiated, trajectory is largely fixed
- **Suppressed vision** — we are effectively "blind" during the movement
- **Precision** — can be trained for stability and controllability

### In ONDA Life

Part 7 "Saccadic Stability" refers to the precision and controllability of eye micro-movements when scanning space. Training saccadic stability supports perceptual clarity and reduces cognitive load when processing visual information.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'theta-state',
    title: 'Theta State',
    category: 'Neuroscience',
    shortDescription:
      'Brain waves in the 4–8 Hz range — associated with deep relaxation, meditation, and creative insight.',
    content: `

**Theta state** refers to brain activity in the theta frequency band (4–8 Hz). Theta waves are associated with deep relaxation, meditation, light sleep, and the threshold between waking and sleep.

### Characteristics

- **Frequency** — 4–8 Hz
- **Location** — often prominent in frontal and temporal regions during meditation
- **Subjective** — dreamy, diffuse awareness, creative flow
- **Memory** — theta in hippocampus supports memory consolidation

### In ONDA Life

Part 7 "Perceptual Stabilization" involves "entering a Theta/Alpha state to ground the mind." Theta supports the transition from reactive thinking to observational presence — the cognitive gap that enables discernment.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'alpha-state',
    title: 'Alpha State',
    category: 'Neuroscience',
    shortDescription:
      'Brain waves in the 8–12 Hz range — associated with relaxed wakefulness and focused attention.',
    content: `

**Alpha state** refers to brain activity in the alpha frequency band (8–12 Hz). Alpha waves are prominent during relaxed wakefulness with eyes closed, and during certain meditative and focused states.

### Characteristics

- **Frequency** — 8–12 Hz
- **Location** — dominant in occipital (visual) cortex when eyes closed
- **Subjective** — calm, alert, present
- **Attention** — alpha can reflect "inhibition" of irrelevant processing, supporting focus

### In ONDA Life

Part 7 "Perceptual Stabilization" involves "entering a Theta/Alpha state to ground the mind." Alpha supports relaxed alertness — the optimal state for cognitive clarity and signal-to-noise optimization.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'cognitive-gap',
    title: 'Cognitive Gap',
    category: 'Core Concepts',
    shortDescription:
      'The pause between an event and our reaction — the space where freedom of choice is born.',
    content: `

The **cognitive gap** is the crucial pause between a stimulus (event) and our reaction. In that gap, we are not compelled to respond reflexively — we have the space to choose.

### Why It Matters

Without a cognitive gap, we react automatically: stimulus → limbic response → action. With a cognitive gap, we insert observation: stimulus → pause → discernment → chosen response. This is the foundation of mental autonomy.

### How to Create It

The gap is built through:
- **Prefrontal activation** — dlPFC sustains focus and inhibits impulsive reaction
- **Signal-to-noise optimization** — clearer perception reduces reactive "noise"
- **Perceptual stabilization** — theta/alpha states ground the mind
- **Metacognitive monitoring** — observing our own reactions before acting

### In ONDA Life

Part 7 ("I Distinguish") aims to create a cognitive gap between stimulus and reaction. Discernment — the ability to see clearly and choose consciously — is the first step toward true mental autonomy. The gap is where freedom of choice is born.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'default-mode-network',
    title: 'Default Mode Network',
    category: 'Neuroscience',
    shortDescription:
      'The "mind-wandering" network — active when we\'re not focused on the external world; suppressed during deep focus.',
    content: `

The **Default Mode Network** (DMN) is a network of brain regions that are active when we are not focused on the external world — during mind-wandering, self-reflection, daydreaming, and autobiographical thinking.

### Key Regions

- **Medial prefrontal cortex**
- **Posterior cingulate cortex**
- **Parietal cortex**
- **Hippocampus** (parts)

### The Trade-off

When we engage in focused, goal-directed tasks, the DMN is typically deactivated. Strong DMN activity during tasks is associated with distraction and poor performance. Training involves "timely deactivation" of the DMN for deep immersion.

### In ONDA Life

Part 8 trains the brain to "timely deactivate the Default Mode Network (DMN) — the \u2018mind-wandering mode\u2019 — for deep immersion in the task." This enables sustained, voluntary attention.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'dorsal-attention-network',
    title: 'Dorsal Attention Network',
    category: 'Neuroscience',
    shortDescription:
      'The network for voluntary, goal-directed attention — top-down control of focus.',
    content: `

The **Dorsal Attention Network** (DAN) is a network of brain regions that support voluntary, goal-directed attention — "top-down" control of what we focus on, as opposed to "bottom-up" capture by salient stimuli.

### Key Regions

- **Intraparietal sulcus**
- **Frontal eye fields**
- **Superior parietal lobule**

### Function

The DAN directs attention to task-relevant stimuli and suppresses irrelevant ones. It works in opposition to the Default Mode Network — when DAN is active, DMN tends to be suppressed.

### In ONDA Life

Part 8 activates the "network of voluntary, directed attention." Training the DAN enables the shift from reactive attention (chaotic) to voluntary attention (controlled) — the heart of "I Focus."
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'acetylcholine',
    title: 'Acetylcholine',
    category: 'Neuroscience',
    shortDescription:
      'A neurotransmitter that "highlights" relevant neural connections — supports attention and learning.',
    content: `

**Acetylcholine** (ACh) is a neurotransmitter that plays a key role in attention, learning, and memory. It is produced in the basal forebrain and brainstem and projects widely to the cortex.

### Key Effects

- **Attention** — enhances signal-to-noise by "highlighting" relevant neural connections
- **Learning** — supports plasticity and memory formation
- **Arousal** — modulates wakefulness and alertness
- **Cortical activation** — selectively amplifies task-relevant processing

### In ONDA Life

Part 8 "Gamma Binding and Cholinergic Modulation" works with acetylcholine, which "literally \u2018highlights\u2019 the necessary neural connections." This supports the assembly of scattered perceptual elements into a single, cohesive image during deep focus.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'locus-coeruleus',
    title: 'Locus Coeruleus',
    category: 'Neuroscience',
    shortDescription:
      'The brainstem nucleus that produces norepinephrine — regulates alertness and attention.',
    content: `

The **locus coeruleus** is a small nucleus in the brainstem that is the primary source of norepinephrine in the brain. It projects widely to the cortex, hippocampus, and cerebellum, regulating alertness, attention, and the stress response.

### Key Functions

- **Alertness** — modulates wakefulness and vigilance
- **Attention** — enhances focus on salient stimuli
- **Stress response** — activates under threat or challenge
- **Cognitive flexibility** — supports task switching

### In ONDA Life

Part 8 "Locus Coeruleus" regulates alertness levels through norepinephrine. The ACC monitors distractions and detects errors. Optimal locus coeruleus function supports sustained focus without burnout.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'dopamine',
    title: 'Dopamine',
    category: 'Neuroscience',
    shortDescription:
      'The neurotransmitter of motivation and reward — supports working memory and sustained focus.',
    relatedSlugs: ['prefrontal-cortex', 'neuroplasticity', 'neurotransmitters'],
    content: `

**Dopamine** is a neurotransmitter that plays a central role in motivation, reward, movement, and working memory. It is produced in the substantia nigra and ventral tegmental area and projects to the striatum and prefrontal cortex.

### Key Effects

- **Motivation** — drive and reward anticipation
- **Working memory** — sustained representation of information
- **Focus** — supports goal-directed behavior
- **Micro-rewards** — small rewards maintain engagement

### In ONDA Life

Part 8 "Dopamine Calibration" utilizes micro-rewards to maintain high motivation and working memory capacity. This prevents cognitive burnout and supports "Deep Work" mode — sustained focus without excessive strain.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'ventral-tegmental-area',
    title: 'Ventral Tegmental Area',
    category: 'Neuroscience',
    shortDescription:
      'The brainstem nucleus that produces dopamine — core of the reward and motivation circuitry.',
    content: `

The **Ventral Tegmental Area** (VTA) is a group of neurons in the midbrain that is the primary source of dopamine for the mesolimbic and mesocortical pathways. It projects to the Nucleus Accumbens, prefrontal cortex, and other regions.

### Key Functions

- **Reward signaling** — encodes prediction error and reward anticipation
- **Motivation** — drives goal-directed behavior
- **Learning** — reinforces successful actions
- **Addiction vulnerability** — overstimulation leads to compulsive seeking

### In ONDA Life

Part 8 "Dopamine Calibration" works with VTA-driven motivation. Protecting the VTA from synthetic overstimulation (scrolling, sugar, notifications) preserves natural drive for high-value pursuits.
`,
  },
  {
    slug: 'nucleus-accumbens',
    title: 'Nucleus Accumbens',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s reward hub — integrates motivation, pleasure, and goal-directed behavior.',
    content: `

The **Nucleus Accumbens** is a key structure in the ventral striatum that receives dopamine from the Ventral Tegmental Area. It integrates reward signals and drives motivated behavior.

### Key Functions

- **Reward processing** — responds to anticipated and received rewards
- **Motivation** — translates desire into action
- **Addiction** — central to compulsive reward-seeking
- **Social reward** — responds to social cues and connection

### In ONDA Life

Part 8 works with the Nucleus Accumbens through intermittent rewards and high-yield pursuits. Calibrating this circuit prevents "Cheap Dopamine" traps and supports sustained motivation.
`,
  },
  {
    slug: 'ultradian-rhythm',
    title: 'Ultradian Rhythm',
    category: 'Body Systems',
    shortDescription:
      'Biological cycles shorter than 24 hours — e.g., 90-minute focus cycles, 20-minute rest.',
    content: `

**Ultradian rhythms** are biological cycles that repeat more than once per 24 hours. Examples include the 90-minute sleep cycle, the 90–120 minute basic rest-activity cycle (BRAC), and shorter attention cycles.

### Key Cycles

- **90-minute cycle** — deep work, creative flow
- **20-minute cycle** — short breaks, recovery
- **Neurotransmitter depletion** — focus depletes; rest restores

### In ONDA Life

Part 8 "Ultradian Optimization" works within natural rhythms (90/20-minute cycles) for the timely restoration of neurotransmitters. Working against these rhythms leads to cognitive burnout; working with them supports neural resilience.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'gamma-binding',
    title: 'Gamma Binding',
    category: 'Neuroscience',
    shortDescription:
      'Synchronization of neurons at gamma frequency (30–100 Hz) — assembles scattered perceptual elements into a coherent whole.',
    content: `

**Gamma binding** (or gamma synchronization) refers to the coordinated firing of neurons at gamma frequency (approximately 30–100 Hz). This synchronization is thought to "bind" scattered elements of perception — features processed in different brain regions — into a single, coherent experience.

### Key Properties

- **Frequency** — 30–100 Hz (often 40 Hz)
- **Function** — temporal binding, feature integration
- **Attention** — gamma increases during focused attention
- **Consciousness** — some theories link gamma to conscious perception

### In ONDA Life

Part 8 "Gamma Binding and Cholinergic Modulation" synchronizes neurons at gamma frequency to assemble scattered elements of perception into a single, cohesive image. Combined with acetylcholine, this supports deep focus and unified perceptual experience.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'cholinergic-modulation',
    title: 'Cholinergic Modulation',
    category: 'Neuroscience',
    shortDescription:
      'The regulation of neural activity by acetylcholine — enhances attention and selectively amplifies relevant signals.',
    content: `

**Cholinergic modulation** refers to the regulation of brain function by acetylcholine (ACh). The cholinergic system projects from the basal forebrain to the cortex, modulating attention, learning, and the signal-to-noise ratio of neural processing.

### Key Effects

- **Attention** — enhances processing of relevant stimuli
- **Signal-to-noise** — "highlights" important neural connections
- **Learning** — supports plasticity and memory
- **Cortical activation** — selectively amplifies task-relevant circuits

### In ONDA Life

Part 8 works with acetylcholine, which "literally \u2018highlights\u2019 the necessary neural connections." Cholinergic modulation supports the assembly of scattered perceptual elements into a single, cohesive image during deep focus.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'neurotransmitters',
    title: 'Neurotransmitters',
    category: 'Neuroscience',
    shortDescription:
      'Chemical messengers that transmit signals between neurons — dopamine, serotonin, norepinephrine, acetylcholine, and others.',
    content: `

**Neurotransmitters** are chemical messengers that transmit signals across synapses from one neuron to another. They enable all brain function — from basic reflexes to complex thought.

### Key Neurotransmitters in ONDA

| Neurotransmitter | Role | ONDA Relevance |
|------------------|------|----------------|
| **Dopamine** | Motivation, reward, working memory | Part 8: focus, micro-rewards |
| **Norepinephrine** | Alertness, attention | Part 7–8: cognitive clarity |
| **Acetylcholine** | Attention, learning | Part 8: signal highlighting |
| **Serotonin** | Mood, regulation | Part 1–2: calm, rhythm |
| **GABA** | Inhibition, calm | Part 1–2: parasympathetic |

### Depletion and Restoration

Sustained focus depletes neurotransmitters. Ultradian rhythms (90/20-minute cycles) allow timely restoration. Working against these cycles leads to cognitive burnout.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'beta-rhythm',
    title: 'Beta Rhythm',
    category: 'Neuroscience',
    shortDescription:
      'Brain waves in the 12–30 Hz range — associated with active thinking, focus, and alert wakefulness.',
    content: `

**Beta rhythm** refers to brain activity in the beta frequency band (12–30 Hz). Beta waves are prominent during active, focused thinking, problem-solving, and alert wakefulness.

### Characteristics

- **Frequency** — 12–30 Hz
- **Location** — often strongest in frontal lobes during focused tasks
- **Subjective** — alert, engaged, thinking
- **Function** — sustained attention, cognitive control

### In ONDA Life

Part 8 lists "increased beta-rhythm power in the frontal lobes" as a biological marker of progress. It indicates improved neural resilience — the brain's ability to sustain focus and maintain cognitive control.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'frontal-lobes',
    title: 'Frontal Lobes',
    category: 'Neuroscience',
    shortDescription:
      'The front part of the brain — executive functions, planning, attention, and motor control.',
    content: `

The **frontal lobes** are the largest of the four cerebral lobes, occupying the front of the brain. They are responsible for executive functions, planning, decision-making, attention control, and voluntary movement.

### Key Regions

- **Prefrontal cortex** — planning, inhibition, working memory
- **Motor cortex** — voluntary movement
- **Broca's area** — speech production (left side)

### Executive Functions

The frontal lobes enable us to set goals, resist impulses, and maintain focus. They are the "conductor" of the brain — coordinating other regions for goal-directed behavior.

### In ONDA Life

Part 8 targets the frontal lobes for "Deep Work" mode. Increased beta-rhythm power in the frontal lobes, along with dlPFC stabilization, supports sustained focus and neural resilience.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'hippocampus',
    title: 'Hippocampus',
    category: 'Neuroscience',
    shortDescription:
      'The brain structure for memory formation and spatial navigation — reconstructs past experiences to model future scenarios.',
    content: `

The **hippocampus** is a structure in the medial temporal lobe critical for memory formation, spatial navigation, and the imagination of future scenarios. It is part of the limbic system and connects to the Default Mode Network.

### Key Functions

- **Memory** — formation of new memories, consolidation
- **Spatial navigation** — cognitive maps, "mental GPS"
- **Future simulation** — reconstructing past experiences to model new scenarios
- **Context** — binding events to time and place

### In ONDA Life

Part 9 links the hippocampus and medial PFC for "mental modeling" — playing out future scenarios. The hippocampus reconstructs past experiences to model new possibilities, enabling imagination as a tool for behavioral engineering.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'predictive-coding',
    title: 'Predictive Coding',
    category: 'Neuroscience',
    shortDescription:
      'The brain\'s model of reality — predicts sensory input and updates based on prediction errors.',
    content: `

**Predictive coding** is a theory of how the brain processes information: it maintains an internal model of reality, generates predictions about incoming sensory input, and updates the model based on prediction errors (the difference between predicted and actual input).

### Key Principles

- **Top-down predictions** — the brain predicts what it will sense
- **Prediction errors** — mismatches drive learning and attention
- **Efficiency** — only unexpected signals need full processing
- **Reality as model** — perception is the brain's "best guess"

### In ONDA Life

Part 9 aims to create a "precise Predictive Coding model of reality." Mental simulation and visualization train the brain to generate accurate predictions — enabling proactive mastery and "pre-writing" events at the neural level.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'posterior-parietal-cortex',
    title: 'Posterior Parietal Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The brain region for spatial representation, attention, and integrating body with environment.',
    content: `

The **posterior parietal cortex** (PPC) is a region of the parietal lobe that integrates sensory information for spatial representation, attention, and the planning of actions. It creates and maintains spatial maps.

### Key Functions

- **Spatial maps** — representation of body and environment
- **Attention** — directing attention in space
- **Sensorimotor integration** — linking perception to action
- **Body schema** — sense of body position and boundaries

### In ONDA Life

Part 9 engages the PPC for "assembling spatial maps and placing the image within the environmental context." It synchronizes the mental sketch with the body's physiological response — the vision becomes grounded in space.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'reticular-activating-system',
    title: 'Reticular Activating System',
    category: 'Neuroscience',
    shortDescription:
      'The brainstem network that filters sensory input and regulates arousal — can be tuned to notice what matches your vision.',
    content: `

The **Reticular Activating System** (RAS) is a diffuse network in the brainstem that regulates arousal, consciousness, and the filtering of sensory information. It determines what reaches conscious awareness.

### Key Functions

- **Arousal** — wakefulness, alertness
- **Sensory filtering** — gates what gets attention
- **Selective attention** — prioritizes relevant stimuli
- **Pattern matching** — notices what aligns with expectations

### In ONDA Life

Part 9 "Proactive Programming (RAS)" tunes the Reticular Activating System to automatically search for opportunities that match the internal vision. The brain begins to notice what aligns with your mental model — turning imagination into a program for reality.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'galvanic-skin-response',
    title: 'Galvanic Skin Response',
    category: 'Body Systems',
    shortDescription:
      'Changes in skin conductance due to emotional arousal — a biomarker that the body "believes" in the mental image.',
    content: `

**Galvanic Skin Response** (GSR), also called electrodermal activity, measures changes in the electrical conductance of the skin. Sweat gland activity increases with emotional arousal — even when we are not consciously aware of it.

### Key Properties

- **Unconscious** — reflects autonomic nervous system activity
- **Emotional arousal** — increases with stress, excitement, engagement
- **Belief indicator** — body responds to imagined scenarios as if real
- **Biofeedback** — can be measured and trained

### In ONDA Life

Part 9 "Biological Belief" references changes in GSR as an indicator that the body "believes" in the created image as if it were real. When mental simulation is vivid enough, the autonomic system responds — the vision becomes physiologically real.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'flow-state',
    title: 'Flow State',
    category: 'Core Concepts',
    shortDescription:
      'A state of optimal performance — deep immersion, effortless action, and loss of self-consciousness.',
    content: `

**Flow state** (or "being in the zone") is a mental state of full immersion in an activity, characterized by focused concentration, loss of self-consciousness, distorted sense of time, and a feeling of effortless action.

### Key Characteristics

- **Deep focus** — complete absorption in the task
- **Effortless action** — skill matches challenge
- **Alpha and theta rhythms** — characteristic brain wave patterns
- **Creative insight** — novel solutions emerge naturally

### In ONDA Life

Part 9 lists "Flow State: Predominance of Alpha and Theta rhythms, characteristic of creative flow and insight" as a result. When imagination becomes a precise program and the brain acts as an efficient executor, flow emerges — the vision and action unite.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'hormones',
    title: 'Hormones',
    category: 'Body Systems',
    shortDescription:
      'Chemical messengers released by endocrine glands — regulate metabolism, stress, growth, and emotional states.',
    content: `

**Hormones** are chemical messengers produced by the endocrine glands (pituitary, thyroid, adrenal, gonads, etc.) and released into the bloodstream. They regulate metabolism, growth, stress response, reproduction, and emotional states.

### Key Hormones in ONDA Life

- **Cortisol** — stress hormone; high baseline indicates chronic stress
- **DHEA, Testosterone** — vitality, dominance, "winner state"
- **Oxytocin** — trust, social bonding
- **Adrenaline** — acute arousal, energy for action

### In ONDA Life

Part 9 "Biochemical Resonance" trains the hypothalamus to generate the "victory state" through hormonal release — even before real action begins. The mental image triggers the same chemical response as actual success.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'occipital-cortex',
    title: 'Occipital Cortex (V1–V4)',
    category: 'Neuroscience',
    shortDescription:
      'The primary visual cortex — processes and renders images; V1–V4 are the hierarchical stages of visual processing.',
    content: `

The **occipital cortex** is the visual processing center at the back of the brain. Areas V1 through V4 form a hierarchy: V1 (primary) detects edges and orientation; V2–V4 build increasingly complex representations (shapes, color, motion).

### Key Functions

- **V1** — primary visual input, edge detection
- **V2** — contour integration, texture
- **V3** — motion, form
- **V4** — color, object recognition

### In ONDA Life

Part 9 engages the occipital cortex for "visualizing and rendering images in the absence of external stimuli" — mental imagery activates the same regions as real vision, creating a tangible internal experience.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'gamma-synchronization',
    title: 'γ-Synchronization',
    category: 'Neuroscience',
    shortDescription:
      'High-frequency neural oscillation (30–100 Hz) that binds scattered brain regions into a unified conscious experience.',
    content: `

**γ-Synchronization** (gamma synchronization) refers to neural oscillations in the 30–100 Hz range. When distributed brain regions fire in phase at gamma frequency, they form a temporary "binding" — assembling scattered elements into a single, coherent perception or thought.

### Key Properties

- **Binding** — unifies disparate neural ensembles
- **Attention** — gamma increases with focused attention
- **Insight** — "aha" moments correlate with gamma bursts
- **Consciousness** — proposed marker of conscious processing

### In ONDA Life

Part 9 describes "instantaneous unification of neural ensembles for a 'flash' of understanding and image integrity." Gamma synchronization enables the mental image to cohere — the vision becomes a single, vivid whole.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'medial-prefrontal-cortex',
    title: 'Medial Prefrontal Cortex (mPFC)',
    category: 'Neuroscience',
    shortDescription:
      'The inner prefrontal region for self-reflection, value judgment, and mental simulation of future scenarios.',
    content: `

The **medial prefrontal cortex** (mPFC) is the midline region of the prefrontal cortex, involved in self-referential processing, value assessment, and the simulation of future scenarios. It connects strongly with the hippocampus and Default Mode Network.

### Key Functions

- **Self-reflection** — "Who am I?" processing
- **Value and reward** — what matters, what to pursue
- **Mental simulation** — playing out future scenarios
- **Emotional regulation** — top-down control of limbic responses

### In ONDA Life

Part 9 "Mental Modeling" links the hippocampus and medial PFC to "play out future scenarios." The mPFC evaluates and directs the creative process — it is the conductor of the internal "rendering" of reality.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'proactive-programming',
    title: 'Proactive Programming (RAS)',
    category: 'Neuroscience',
    shortDescription:
      'Tuning the Reticular Activating System to automatically notice opportunities that match your internal vision.',
    content: `

**Proactive Programming** is the practice of training the Reticular Activating System (RAS) to filter sensory input in favor of information that aligns with your internal vision. Instead of passively receiving the world, you "program" the brain to seek what matters.

### How It Works

- **Vision** — a clear mental image of the desired outcome
- **RAS tuning** — the brainstem filter prioritizes matching stimuli
- **Automatic noticing** — opportunities appear without conscious search
- **Reinforcement** — each match strengthens the program

### In ONDA Life

Part 9 lists "Proactive Programming (RAS)" as a Biological Protocol item. The vision becomes a program; the brain acts as an efficient executor, finding the shortest paths to the goal by automatically detecting relevant signals in the environment.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'neural-reframing',
    title: 'Neural Reframing',
    category: 'Neuroscience',
    shortDescription:
      'Using cognitive metaphors and new interpretations to alter synaptic connections and change behavioral patterns.',
    content: `

**Neural Reframing** is the practice of changing the meaning assigned to experiences, events, or sensations through new cognitive frameworks. By shifting interpretation, we alter which neural pathways fire and strengthen — effectively rewiring the brain.

### Key Mechanisms

- **Cognitive metaphors** — new lenses change perception
- **Synaptic plasticity** — "neurons that fire together wire together"
- **Reconsolidation** — memories can be updated when recalled
- **Top-down modulation** — prefrontal cortex influences limbic and sensory processing

### In ONDA Life

Part 9 "Neural Reframing" uses cognitive metaphors to alter synaptic connections. Imagination is not idle — it is a biological tool for behavioral engineering. New frames create new neural patterns.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'synaptic-connections',
    title: 'Synaptic Connections',
    category: 'Neuroscience',
    shortDescription:
      'The junctions between neurons where signals are transmitted — the physical substrate of learning and memory.',
    content: `

**Synaptic connections** (synapses) are the points of contact between neurons where chemical or electrical signals are transmitted. They are the physical basis of learning, memory, and all behavioral change.

### Key Principles

- **Plasticity** — synapses strengthen or weaken with use
- **Hebb's rule** — "neurons that fire together wire together"
- **Pruning** — unused connections weaken; used ones strengthen
- **Reconsolidation** — memories can be modified when recalled

### In ONDA Life

Part 9 "Neural Reframing" aims to alter synaptic connections through cognitive metaphors. Mental simulation and visualization create new firing patterns — imagination literally rewires the brain at the synaptic level.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'brocas-area',
    title: "Broca's Area",
    category: 'Neuroscience',
    shortDescription:
      'The brain region for speech production — assembles and delivers the motor programs of language.',
    content: `

**Broca's area** is a region in the left frontal lobe (inferior frontal gyrus) responsible for speech production. It assembles the motor programs for articulation and coordinates the muscles of the mouth, tongue, and larynx.

### Key Functions

- **Speech production** — grammatical structure, word retrieval
- **Articulation** — motor planning for vocal output
- **Expressive language** — turning thought into spoken words

### In ONDA Life

Part 10 engages Broca's area as one of the "centers for assembling and delivering speech structures." Together with Wernicke's area and the Ventral Vagus, it enables sovereign expression — clear, authentic self-expression supported by calm social engagement.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'wernickes-area',
    title: "Wernicke's Area",
    category: 'Neuroscience',
    shortDescription:
      'The brain region for language comprehension — processes and interprets spoken and written words.',
    content: `

**Wernicke's area** is a region in the left temporal lobe responsible for language comprehension. It processes incoming speech, assigns meaning to words, and supports the understanding of context and nuance.

### Key Functions

- **Language comprehension** — decoding auditory and written input
- **Semantic processing** — meaning, context, nuance
- **Receptive language** — understanding what others say

### In ONDA Life

Part 10 lists Wernicke's area as part of the "centers for assembling and delivering speech structures." Effective expression requires both production (Broca's) and comprehension (Wernicke's) — you must understand before you speak, and monitor your own output in real time.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'amygdala',
    title: 'Amygdala',
    category: 'Neuroscience',
    shortDescription:
      'The brain structure for threat detection and emotional reactivity — the source of social fear and anxiety.',
    relatedSlugs: ['prefrontal-cortex', 'limbic-system', 'cognitive-reappraisal'],
    content: `

The **amygdala** is an almond-shaped structure in the temporal lobe, part of the limbic system. It is the primary detector of threat and the driver of fear, anxiety, and defensive responses.

### Key Functions

- **Threat detection** — rapid, unconscious scanning for danger
- **Emotional reactivity** — fear, anxiety, fight-or-flight
- **Social fear** — fear of judgment, rejection, visibility
- **Memory** — emotional tagging of experiences

### In ONDA Life

Part 10 aims to "reduce amygdala reactivity to suppress paralyzing social fear." Cognitive Reappraisal is a prefrontal technique that physiologically dampens amygdala activity — replacing fear with excitement. The goal is to exit "social paralysis" and enter sovereign expression.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'thyroid-gland',
    title: 'Thyroid Gland',
    category: 'Body Systems',
    shortDescription:
      'The endocrine gland that regulates metabolic tempo — the driver of energy and manifestation.',
    content: `

The **thyroid gland** is located in the neck and produces hormones (T3, T4) that regulate metabolism, energy levels, body temperature, and growth. It sets the overall "tempo" of the body.

### Key Functions

- **Metabolic rate** — how fast the body burns energy
- **Energy and vitality** — physical and mental stamina
- **Temperature regulation** — body heat production
- **Growth and development** — especially in early life

### In ONDA Life

Part 10 describes the Thyroid as "the driver of metabolic tempo and the energy of manifestation." Optimal thyroid function supports the physical energy needed for vocal projection, presence, and sustained social engagement.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'cognitive-reappraisal',
    title: 'Cognitive Reappraisal',
    category: 'Neuroscience',
    shortDescription:
      'A prefrontal technique that reframes emotional stimuli — physiologically dampens amygdala and replaces fear with excitement.',
    content: `

**Cognitive reappraisal** is an emotion regulation strategy in which you change the meaning or interpretation of a situation. Instead of "this is threatening," you reframe: "this is exciting," "this is an opportunity," "my body is preparing me for peak performance."

### Key Mechanisms

- **Prefrontal control** — top-down modulation of limbic responses
- **Amygdala dampening** — reduced fear reactivity
- **Reframing** — threat → challenge, fear → excitement
- **Physiological shift** — same arousal, different interpretation

### In ONDA Life

Part 10 lists "Cognitive Reappraisal" as a Biological Protocol item. It is a prefrontal control technique that physiologically dampens amygdala activity, replacing social fear with excitement. You no longer fear being noticed — you use attention as fuel.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'theory-of-mind',
    title: 'Theory of Mind (ToM)',
    category: 'Neuroscience',
    shortDescription:
      'The ability to attribute mental states to others — understanding perspectives, intentions, and beliefs.',
    content: `

**Theory of Mind** (ToM) is the cognitive capacity to attribute mental states — thoughts, beliefs, intentions, emotions — to oneself and others. It enables us to understand that others have different perspectives and to predict their behavior.

### Key Functions

- **Perspective-taking** — "walking in someone else's shoes"
- **Intentionality** — understanding goals and motives
- **Belief attribution** — knowing what others know or believe
- **Social prediction** — forecasting reactions and responses

### In ONDA Life

Part 11 "Cognitive Flexibility (ToM)" trains the ability to "walk in someone else's shoes." The mPFC is the center for understanding the "Self" of another. Theory of Mind is the foundation for instantaneous empathy and nutritious interaction.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'orbitofrontal-cortex',
    title: 'Orbitofrontal Cortex',
    category: 'Neuroscience',
    shortDescription:
      'The prefrontal region for social harmony, value judgment, and ethical choices in the moment.',
    content: `

The **orbitofrontal cortex** (OFC) is the ventral part of the prefrontal cortex, located above the orbits of the eyes. It integrates emotional and social information for decision-making, value assessment, and adaptive behavior.

### Key Functions

- **Value and reward** — what is good, bad, worth pursuing
- **Social cognition** — reading social cues, maintaining harmony
- **Emotional regulation** — modulating limbic responses
- **Ethical choices** — moral reasoning in real-time

### In ONDA Life

Part 11 pairs the Orbitofrontal Cortex with the Ventral Vagus to ensure "social harmony and ethical choices in the moment." The OFC helps prevent interaction from turning into conflict or manipulation.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'right-temporoparietal-junction',
    title: 'Right Temporoparietal Junction (rTPJ)',
    category: 'Neuroscience',
    shortDescription:
      'The brain region for reading non-verbal signals and managing the mental model of others.',
    content: `

The **right temporoparietal junction** (rTPJ) is a region at the boundary of the temporal and parietal lobes. It is a key node for social cognition — particularly for understanding others' perspectives and reading non-verbal signals.

### Key Functions

- **Perspective-taking** — shifting attention to others' viewpoints
- **Mental model of others** — representing what others think or feel
- **Non-verbal reading** — body language, gaze, gesture
- **Self-other distinction** — knowing where "I" ends and "you" begins

### In ONDA Life

Part 11 describes the rTPJ as "a key node for reading non-verbal signals and managing the 'mental model' of others." Together with the mPFC, it enables the balance between autonomy ("I") and deep connection ("We").
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'vasopressin',
    title: 'Vasopressin',
    category: 'Body Systems',
    shortDescription:
      'The hormone of boundary protection and pair-bonding — balances trust (oxytocin) with territorial defense.',
    content: `

**Vasopressin** is a hormone and neurotransmitter produced in the hypothalamus. It regulates water retention, blood pressure, and — in the social domain — pair-bonding, territorial behavior, and boundary protection.

### Key Functions

- **Pair-bonding** — long-term attachment (especially in males)
- **Territoriality** — defense of resources and relationships
- **Boundary protection** — "us vs. them" modulation
- **Stress response** — HPA axis modulation

### In ONDA Life

Part 11 references the "Oxytocin-Vasopressin System" as the "biochemical balance between trust and boundary protection." Deep connection (oxytocin) requires healthy boundaries (vasopressin) — preventing either total merging or alienation.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'inter-brain-synchrony',
    title: 'Inter-brain Synchrony',
    category: 'Neuroscience',
    shortDescription:
      'The phenomenon where brain rhythms of partners begin to operate in a coherent mode during interaction.',
    content: `

**Inter-brain synchrony** (or neural synchrony) is the phenomenon where the brain activity of two or more people becomes correlated during social interaction. Their neural rhythms — EEG, HRV — begin to align.

### Key Properties

- **Coherence** — brain rhythms operate in phase
- **HRV synchronization** — heart rate variability aligns between partners
- **Alpha-rhythm coherence** — relaxed, attentive states synchronize
- **Bidirectional** — both participants influence and are influenced

### In ONDA Life

Part 11 lists "Inter-brain Synchrony" as a target: "the brain rhythms of partners begin to operate in a coherent mode." Biological markers include "synchronization of Heart Rate Variability (HRV) between partners and Alpha-rhythm brain coherence." This is co-resonance at the physiological level.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'interference',
    title: 'Interference',
    category: 'Core Concepts',
    shortDescription:
      'In physics: when two waves overlap, creating a new, complex pattern. In ONDA: the moment of genuine interaction between two people.',
    content: `

**Interference** is a physics concept: when two waves meet, they overlap and create a new, complex pattern — neither wave simply passes through the other unchanged. The result is amplification (constructive) or cancellation (destructive) depending on phase.

### In ONDA Life

Part 11 describes the transition from self-expression to **interference** — "the moment when two waves overlap, creating a new, complex pattern." In ONDA, this is the tuning of your "neural Wi-Fi." We learn to be with another so that interaction does not turn into conflict or manipulation, but into co-resonance.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'feelings',
    title: 'Feelings',
    category: 'Core Concepts',
    shortDescription:
      'Subjective emotional experiences — the felt sense of what we value, desire, or experience in relation to ourselves and others.',
    content: `

**Feelings** are the subjective, conscious experience of emotions. They are the "felt sense" — how we register and interpret our emotional state. Feelings arise from the integration of bodily sensations, cognitive appraisal, and social context.

### Key Aspects

- **Subjective** — personal, first-person experience
- **Integrated** — body + mind + context
- **Relational** — often tied to connection, belonging, meaning
- **Distinct from emotions** — feelings are the conscious layer; emotions include unconscious physiological components

### In ONDA Life

Part 10 aims to "synchronize the heart (feelings), the brain (vision), and the throat (the instrument of manifestation)." Feelings are one pole of the triad — they must align with vision and expression for sovereign manifestation.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'emotions',
    title: 'Emotions',
    category: 'Core Concepts',
    shortDescription:
      'Multicomponent responses — physiological, behavioral, and experiential — to internal or external events.',
    content: `

**Emotions** are multicomponent responses that include physiological changes (hormones, autonomic nervous system), behavioral expressions (facial, vocal, postural), and subjective experience (feelings). They are rapid, often automatic reactions to events that matter for survival or well-being.

### Key Components

- **Physiological** — heart rate, cortisol, adrenaline, vagal tone
- **Behavioral** — facial expression, posture, voice
- **Experiential** — the felt sense (feelings)
- **Functional** — prepare the body for action (approach, avoid, connect)

### In ONDA Life

The ONDA system works with emotions at multiple levels — from limbic regulation (Parts 4–6) to cognitive reappraisal (Part 10) to empathic calibration (Part 11). Emotions are not enemies to suppress but signals to integrate.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'thoughts',
    title: 'Thoughts',
    category: 'Core Concepts',
    shortDescription:
      'Mental representations — ideas, beliefs, inner speech — generated by the cognitive system.',
    content: `

**Thoughts** are mental representations — ideas, beliefs, inner speech, images — generated by the cognitive system. They arise from the prefrontal cortex, default mode network, and language centers (Broca's, Wernicke's).

### Key Aspects

- **Cognitive** — distinct from raw sensation or emotion
- **Linguistic** — often in the form of inner speech
- **Predictive** — the brain generates thoughts to model and anticipate reality
- **Modifiable** — cognitive reappraisal, reframing, and metacognition can alter thought patterns

### In ONDA Life

Parts 7–9 train the mind to distinguish signal from noise, focus attention, and shape vision through mental simulation. Thoughts become tools rather than masters — you learn to observe and direct them.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'sensations',
    title: 'Sensations',
    category: 'Core Concepts',
    shortDescription:
      'Raw sensory input — what we feel in the body before interpretation (interoception, proprioception, touch).',
    content: `

**Sensations** are the raw, pre-interpretive input from the body — what we feel before we label it as emotion, thought, or meaning. They include interoception (internal organs, heartbeat, breath), proprioception (body position, movement), and exteroception (touch, temperature, pressure).

### Key Aspects

- **Bodily** — grounded in the physical body
- **Pre-cognitive** — arise before conscious interpretation
- **Foundation** — emotions and thoughts are built on sensation
- **Trainable** — practices like interoceptive calibration increase sensitivity

### In ONDA Life

Part 1 "Interoceptive Calibration" develops the ability to feel pulsation, pressure, and internal movement. Part 11 "Interoception in Contact" uses sensations to feel one's own and others' boundaries in real-time. Sensations are the bedrock of self-awareness.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'pelvic-diaphragm',
    title: 'Pelvic Diaphragm',
    category: 'Body Systems',
    shortDescription:
      'The muscular floor of the pelvis — supports organs, regulates breath and tone; chronic stress can create deep blocks here.',
    content: `

The **pelvic diaphragm** (or pelvic floor) is the muscular layer that forms the floor of the pelvis. It supports the bladder, rectum, and reproductive organs, and works in coordination with the respiratory diaphragm during breathing.

### Key Functions

- **Support** — holds pelvic organs in place
- **Sphincter control** — continence
- **Breath coordination** — moves with the diaphragm in the breath cycle
- **Tone** — chronic stress can create hypertonicity (holding) or hypotonicity (collapse)

### In ONDA Life

Part 11 "Resonance Strategy" includes "relaxation of the pelvic diaphragm and the release of deep bodily blocks." Chronic stress blocks both the respiratory diaphragm and the pelvic floor; releasing them supports the shift from "social survival" to "social resonance."
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'joint-attention',
    title: 'Joint Attention',
    category: 'Neuroscience',
    shortDescription:
      'The shared focus of two or more individuals on the same object or goal — the center of group synergy.',
    content: `

**Joint attention** is the ability to share focus with another person on the same object, event, or goal. It emerges in infancy and is foundational for social cognition, language development, and cooperative action.

### Key Functions

- **Shared focus** — "we are looking at the same thing"
- **Triadic** — self, other, and object of attention
- **Coordinating** — aligns intentions and actions
- **Synergy** — creates a single focus as the group's center

### In ONDA Life

Part 12 "DMN Inhibition and Joint Attention" shifts from protecting personal boundaries to realizing a common goal. Joint Attention forms "a single focus as the group's center of synergy" — the foundation for collective co-creation and We-Consciousness.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'endorphins',
    title: 'Endorphins',
    category: 'Body Systems',
    shortDescription:
      'Endogenous opioids that reduce pain and produce euphoria — the "hormonal glue" of collective cohesion.',
    content: `

**Endorphins** are endogenous opioid peptides produced by the brain and pituitary gland. They reduce pain, produce feelings of euphoria and well-being, and are released during exercise, laughter, social bonding, and collective achievement.

### Key Functions

- **Pain relief** — natural analgesia
- **Euphoria** — "runner's high," collective flow
- **Social bonding** — released during synchronized activities
- **Stress buffering** — counteract cortisol effects

### In ONDA Life

Part 12 pairs the "Endorphin-Oxytocin Systems" as the "hormonal glue" of collective cohesion. Celebrating collective victories (Dopaminergic Reinforcement) and synchronized group activities trigger endorphin release — reinforcing cooperative behavior and We-Consciousness.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'neural-coupling',
    title: 'Neural Coupling',
    category: 'Neuroscience',
    shortDescription:
      'The state where neural patterns of two or more individuals mirror one another — entering a shared neural field.',
    content: `

**Neural coupling** (нейронная сцепка) is the state where the brain activity of two or more people becomes aligned — their neural patterns mirror one another. Attention, breathing rhythms, and brain waves begin to operate in a shared field.

### Key Properties

- **Inter-brain alignment** — neural patterns mirror across participants
- **Shared field** — a collective "space" of coordinated activity
- **Bidirectional** — each participant influences and is influenced
- **Measurable** — EEG, HRV, breathing can show coupling

### In ONDA Life

Part 12 "Neural Coupling" practices synchronize attention and breathing rhythms to enter a shared neural field. This is the foundation for collective co-creation — the transition from "I" to "WE" without loss of individuality.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'synchronization',
    title: 'Synchronization',
    category: 'Core Concepts',
    shortDescription:
      'The alignment of rhythms across systems — breath, heart, brain waves — between individuals or within the body.',
    content: `

**Synchronization** (синхронизация) is the alignment of rhythms — temporal, physiological, or neural — across systems. When two oscillators (or people) synchronize, their cycles align in phase or frequency.

### Key Forms

- **Breath synchronization** — aligned breathing cycles
- **Heart rate variability (HRV)** — cardiac rhythms align between partners
- **Neural synchronization** — brain waves (alpha, gamma) align
- **Inter-brain** — multiple brains operating in coherent mode

### In ONDA Life

Part 9 engages gamma synchronization for image integrity. Part 11 targets HRV synchronization between partners. Part 12 uses "Intentional Synchronization" for seamless joint task execution. Synchronization is the biological substrate of coordination and collective flow.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'oxytocin-system',
    title: 'Oxytocin System',
    category: 'Body Systems',
    shortDescription:
      'The neurohormonal network for trust, bonding, and social cooperation — the biochemical foundation of "We."',
    content: `

The **oxytocin system** (окситоциновая система) refers to the production, release, and receptor distribution of oxytocin — the hormone of trust, bonding, and social cooperation. It is produced in the hypothalamus and released by the pituitary.

### Key Functions

- **Trust** — lowers social anxiety, facilitates connection
- **Bonding** — pair-bonding, mother-infant, group cohesion
- **Cooperation** — "hormonal glue" of collective action
- **Amygdala modulation** — reduces fear reactivity in social contexts

### In ONDA Life

Part 9 links the hippocampus and mPFC for mental modeling. Part 10 "Oxytocin Loops" build social trust. Part 11 "Oxytocin Loop Stimulation" shifts into deep cooperation. Part 12 "Oxytocin Resonance" lowers amygdala reactivity within the group through radical trust. The oxytocin system is central to the transition from "I" to "WE."
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'inter-brain-coherence',
    title: 'Inter-brain Coherence',
    category: 'Neuroscience',
    shortDescription:
      'The phenomenon where brain rhythms of multiple individuals operate in a coherent, phase-aligned mode.',
    content: `

**Inter-brain coherence** (межмозговая когерентность) is the phenomenon where the brain activity of two or more people becomes phase-aligned — their neural rhythms operate in a coherent mode. Coherence implies not just correlation but organized, in-phase oscillation.

### Key Properties

- **Phase alignment** — oscillations in phase, not just correlated
- **Coherent mode** — organized, ordered brain activity across participants
- **Collective** — the group functions as a unified neural network
- **Measurable** — EEG coherence, HRV alignment, gamma synchronization

### In ONDA Life

Part 12 lists "Inter-brain coherence" as a biological marker — alongside group HRV alignment and collective dopamine surges. Together with Gamma Synchronization, it enables collective insight and the instantaneous synthesis of ideas. The group becomes a living neural network.
### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.

`,
  },
  {
    slug: 'circadian-rhythm',
    title: 'Circadian Rhythm',
    category: 'Biomarkers & Metrics',
    shortDescription:
      'Internal 24-hour cycles that regulate sleep-wake patterns, hormone levels, and metabolism — your biological clock.',
    content: `

**Circadian rhythms** are internal 24-hour cycles of biological processes that regulate sleep-wake patterns, hormone levels, and metabolism. In the ONDA system, this term is fundamental to Level 1 (Body / Terra), as synchronizing with natural light and dark cycles determines your baseline energy levels.

### Key Mechanisms

- **Suprachiasmatic Nucleus (SCN)** — The "master clock" in the hypothalamus that receives light information through the retina.
- **Melatonin & Cortisol** — A light-sensitive balance: melatonin prepares the body for sleep, while the morning cortisol spike initializes the system for action.

### ONDA Protocol

- **Light Exposure** — Get bright sunlight within the first 30 minutes of waking to suppress melatonin and set the timer for your sleep cycle.
- **Blue Light Block** — Limit blue spectrum light 2–3 hours before sleep to initiate the natural recovery process.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
  },
  {
    slug: 'suprachiasmatic-nucleus',
    title: 'Suprachiasmatic Nucleus',
    category: 'Neural Hardware',
    shortDescription:
      'The master clock in the hypothalamus — receives light via the retina and synchronizes every cellular clock in your body.',
    content: `

The **Suprachiasmatic Nucleus** (SCN) is a small region of the hypothalamus that acts as the body's master oscillator. It receives light signals directly from the retina via the retinohypothalamic tract and synchronizes circadian rhythms throughout the organism.

### Key Functions

- **Master clock** — sets the phase for all peripheral clocks
- **Light input** — photoreceptors in the retina send signals to the SCN
- **Output signals** — regulates melatonin, cortisol, body temperature
- **Entrainment** — adjusts to light-dark cycles (jet lag recovery)

### In ONDA Life

The Circadian Reset protocols work with the SCN: morning light exposure triggers a timed Cortisol pulse and sets the timer for Melatonin release. Blocking blue light at night allows the natural shutdown sequence to initialize.
`,
  },
  {
    slug: 'melatonin',
    title: 'Melatonin',
    category: 'Biological Software',
    shortDescription:
      'The sleep hormone — released by the pineal gland in darkness, triggers the body\'s shutdown sequence.',
    content: `

**Melatonin** is a hormone produced by the pineal gland in response to darkness. It signals the body to prepare for sleep and regulates the sleep-wake cycle.

### Key Functions

- **Sleep trigger** — initiates the natural shutdown sequence
- **Light-sensitive** — suppressed by blue light, even artificial
- **Circadian marker** — release typically begins ~16 hours after morning light exposure
- **Antioxidant** — secondary roles in cellular protection

### In ONDA Life

Morning light exposure sets a 16-hour countdown for Melatonin release. Blue light at night suppresses melatonin by tricking the SCN into thinking it's still noon. The Blue Light Firewall protocol protects this critical signal.
`,
  },
  {
    slug: 'adenosine',
    title: 'Adenosine',
    category: 'Biological Software',
    shortDescription:
      'A neuromodulator that builds up during wakefulness — the "sleep debt" variable that drives sleep pressure.',
    content: `

**Adenosine** is a neuromodulator that accumulates in the brain during wakefulness. It creates "sleep pressure" — the longer you're awake, the more adenosine builds up, and the stronger the drive to sleep.

### Key Functions

- **Sleep debt** — builds like cache files that need clearing
- **ATP breakdown** — adenosine is a byproduct of energy metabolism
- **Caffeine antagonist** — caffeine blocks adenosine receptors (temporary wakefulness)
- **Homeostasis** — sleep clears adenosine; wakefulness resets the cycle

### In ONDA Life

Understanding adenosine helps explain why consistent sleep timing matters. Sleep deprivation leaves adenosine "uncleared" — leading to metabolic lag and chronic brain fog. The Circadian Reset protocols ensure your system clears this cache properly.
`,
  },
  {
    slug: 'blue-light',
    title: 'Blue Light',
    category: 'Neural Hardware',
    shortDescription:
      'Short-wavelength light that suppresses melatonin and signals the SCN that it\'s daytime — a "digital caffeine" at night.',
    content: `

**Blue light** (wavelengths ~450–495 nm) is the portion of the visible spectrum that most strongly affects the circadian system. Photoreceptors in the retina (particularly melanopsin-containing retinal ganglion cells) are most sensitive to blue light.

### Key Effects

- **Melatonin suppression** — blue light at night blocks the natural shutdown sequence
- **SCN activation** — signals "daytime" to the master clock
- **Digital caffeine** — screens at 11 PM act as a "Force Quit" for sleep architecture
- **Morning benefit** — blue light in the AM helps set the circadian timer

### In ONDA Life

The Blue Light Firewall protocol: use 100% blue-blocking glasses or "Red Mode" on all devices after sunset. This allows the natural shutdown sequence to initialize.
`,
  },
  {
    slug: 'deep-sleep',
    title: 'Deep Sleep',
    category: 'OS States',
    shortDescription:
      'Slow-wave sleep (N3) — the most restorative phase, when the brain clears adenosine and repairs tissue.',
    content: `

**Deep sleep** (slow-wave sleep, N3) is the most restorative phase of the sleep cycle. It is characterized by slow delta waves and is essential for physical recovery, memory consolidation, and adenosine clearance.

### Key Functions

- **Adenosine clearance** — sleep debt is "cleared" during deep sleep
- **Tissue repair** — growth hormone release, cellular restoration
- **Temperature drop** — core body temperature must drop 1–2°C to initiate
- **Immune function** — critical for immune system maintenance

### In ONDA Life

The Temperature Down-Regulation protocol supports deep sleep: a warm bath 90 minutes before bed or a cool bedroom (18°C) helps the core temperature drop. This "Thermal Handshake" signals the brain that it's time for the most restorative phase.
`,
  },
  {
    slug: 'enteric-nervous-system',
    title: 'Enteric Nervous System',
    category: 'Neurobiology',
    shortDescription:
      'The "second brain" — over 100 million neurons lining the gut, capable of independent function and influencing mood and mental clarity.',
    content: `

The **Enteric Nervous System** (ENS) is a complex network of over 100 million neurons lining the gastrointestinal tract. Often called the "second brain," it is capable of functioning independently of the central nervous system. In the ONDA system, the ENS is a key node of Level 2 (Visceral Wisdom).

### Key Mechanisms

- **Gut-Brain Axis** — A constant bidirectional data exchange between the gut and the brain via the Vagus Nerve.
- **Neurotransmitter Production** — Approximately 95% of the body's serotonin and 50% of its dopamine are produced in the gut, directly influencing emotional states and mental clarity.

### ONDA Protocol

- **Visceral Awareness** — Practice scanning sensations in the abdominal area to decode "gut feelings" and intuitive signals.
- **Microbiome Support** — Maintaining a healthy microbiome is viewed as a foundation for cognitive performance and emotional stability.

### Scientific Basis
Built on: [Polyvagal Theory](https://pubmed.ncbi.nlm.nih.gov/17049418/) (Porges); [Psychoneuroimmunology](https://pubmed.ncbi.nlm.nih.gov/6657789/) (Ader & Cohen); [neuroplasticity](https://pubmed.ncbi.nlm.nih.gov/17329479/) research.
`,
    relatedSlugs: ['vagus-nerve', 'microbiome', 'serotonin'],
  },
  {
    slug: 'serotonin',
    title: 'Serotonin',
    category: 'Biological Software',
    shortDescription:
      'A neurotransmitter regulating mood, sleep, and appetite — 95% produced in the gut by the microbiome.',
    content: `

**Serotonin** (5-HT) is a key neurotransmitter that regulates mood, sleep, appetite, and social behavior. Remarkably, approximately 95% of the body's serotonin is produced in the gut—not the brain—by enterochromaffin cells and influenced by the microbiome.

### Key Functions

- **Mood regulation** — low serotonin linked to anxiety and depression
- **Sleep** — precursor to melatonin
- **Gut-brain axis** — gut-produced serotonin influences brain via the Vagus Nerve
- **Appetite** — modulates satiety and food intake

### In ONDA Life

A healthy microbiome and diverse fiber intake support serotonin production. The Gut-Brain Axis article covers protocols for optimizing your "Serotonin Factory."
`,
    relatedSlugs: ['microbiome', 'vagus-nerve', 'neurotransmitters', 'enteric-nervous-system'],
  },
  {
    slug: 'microbiome',
    title: 'Microbiome',
    category: 'Biological Software',
    shortDescription:
      'The community of trillions of bacteria, fungi, and viruses in your gut — your "biological modem" for gut-brain communication.',
    content: `

The **microbiome** is the ecosystem of trillions of microorganisms (bacteria, fungi, viruses) living in your gastrointestinal tract. It acts as a "biological modem"—producing neurotransmitters, metabolites, and signaling molecules that influence your brain via the Vagus Nerve and bloodstream.

### Key Functions

- **Neurotransmitter production** — bacteria produce serotonin, GABA, and other molecules
- **SCFA production** — fiber fermentation yields short-chain fatty acids that cross the Blood-Brain Barrier
- **Immune modulation** — shapes systemic inflammation and neuroinflammation
- **Gut-brain axis** — constant bidirectional communication with the brain

### In ONDA Life

The Gut-Brain Axis article covers protocols for microbiome optimization: prebiotic loading, polyphenol boost, and fasting for microbial reset.
`,
    relatedSlugs: ['vagus-nerve', 'serotonin', 'blood-brain-barrier', 'enteric-nervous-system'],
  },
  {
    slug: 'blood-brain-barrier',
    title: 'Blood-Brain Barrier',
    category: 'Neural Hardware',
    shortDescription:
      'A selective membrane that controls which molecules enter the brain from the bloodstream — protecting and filtering neural tissue.',
    content: `

The **Blood-Brain Barrier** (BBB) is a semi-permeable membrane of endothelial cells that separates the bloodstream from the brain's extracellular fluid. It tightly controls which molecules can enter the brain—protecting neural tissue from toxins while allowing essential nutrients and signaling molecules.

### Key Functions

- **Protection** — blocks pathogens, toxins, and many drugs
- **Selective transport** — allows glucose, amino acids, and specific metabolites
- **SCFA passage** — short-chain fatty acids from gut fermentation can cross and reduce neuroinflammation
- **Gut-brain link** — microbiome metabolites influence brain health through BBB transport

### In ONDA Life

Prebiotic fiber and a healthy microbiome produce SCFAs that cross the Blood-Brain Barrier to support cognitive function. See the Gut-Brain Axis article.
`,
    relatedSlugs: ['microbiome', 'neurotransmitters'],
  },
  {
    slug: 'co2-tolerance',
    title: 'CO2 Tolerance',
    category: 'OS States',
    shortDescription:
      'Your body\'s ability to tolerate elevated CO2 before triggering a breath urge — like RAM for metabolic stress resilience.',
    content: `

**CO2 Tolerance** is your body's capacity to tolerate elevated carbon dioxide levels before the brainstem triggers an urgent breath response. Contrary to popular belief, the primary driver of the urge to breathe is CO2 accumulation—not lack of oxygen.

### Key Functions

- **Metabolic buffer** — higher tolerance = more capacity under stress
- **Oxygen delivery** — the Bohr effect: CO2 helps release oxygen from hemoglobin to tissues
- **Prefrontal cortex** — high CO2 tolerance supports cognitive clarity under pressure
- **Trainable** — breath-hold exercises and controlled breathing can increase tolerance

### In ONDA Life

The Breathwork CLI article covers protocols (Box Breathing, Physiological Sigh) that improve CO2 tolerance and give you Root Access to your nervous system.
`,
    relatedSlugs: ['vagus-nerve', 'diaphragm', 'prefrontal-cortex'],
  },
  {
    slug: 'nitric-oxide',
    title: 'Nitric Oxide',
    category: 'Biological Software',
    shortDescription:
      'A potent vasodilator produced in the paranasal sinuses — nasal breathing boosts NO and increases oxygen uptake by ~20%.',
    content: `

**Nitric Oxide** (NO) is a signaling molecule that dilates blood vessels, improving blood flow and oxygen delivery. Your paranasal sinuses produce NO continuously; nasal breathing carries it into the lungs, where it enhances gas exchange.

### Key Functions

- **Vasodilation** — widens blood vessels for better perfusion
- **Oxygen uptake** — nasal breathing increases oxygen absorption by ~20%
- **Air conditioning** — nasal passages filter, warm, and humidify air
- **Antimicrobial** — NO has mild antimicrobial properties in the respiratory tract

### In ONDA Life

The Breathwork CLI article recommends strict nasal breathing for low-to-moderate intensity as the "Nitric Oxide Boost" protocol.
`,
    relatedSlugs: ['vagus-nerve', 'diaphragm', 'autonomic-nervous-system'],
  },
]

// Apply 4-cluster category mapping (Neural Hardware, Biological Software, OS States, ONDA Protocol)
export const glossaryTerms = rawGlossaryTerms.map((t) => ({
  ...t,
  category: SLUG_TO_CATEGORY[t.slug] ?? t.category,
}))

export const categories = [...new Set(glossaryTerms.map((t) => t.category))]

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug)
}
