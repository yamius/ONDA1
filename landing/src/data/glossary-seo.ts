/**
 * SEO-optimized Titles and Descriptions for anchor glossary terms.
 * Used for <title>, meta description, og:title, og:description during SSG build.
 */
export const GLOSSARY_SEO: Record<string, { title: string; description: string }> = {
  'vagus-nerve': {
    title: 'Vagus Nerve: The Core of Mind-Body Connection',
    description:
      'Discover how the vagus nerve regulates the parasympathetic system, reduces stress, and manages interoception through ONDA biological protocols.',
  },
  neuroplasticity: {
    title: 'Neuroplasticity: Rewiring Your Brain for Growth',
    description:
      "Explore the brain's ability to reorganize itself by forming new neural connections. Learn ONDA protocols for accelerated learning and adaptation.",
  },
  'heart-rate-variability': {
    title: 'Heart Rate Variability (HRV): Biofeedback Guide',
    description:
      'HRV as a primary biomarker for autonomic nervous system health. Use heart rate variability to monitor recovery, stress, and readiness.',
  },
  'default-mode-network': {
    title: 'Default Mode Network (DMN): Inside the Social Brain',
    description:
      'The neuroscience of self-reflection and wandering thoughts. How the DMN shapes your sense of self and its role in creativity and mental focus.',
  },
  dopamine: {
    title: 'Understanding Dopamine Baseline & Motivation',
    description:
      'Master the neurochemistry of drive. Learn how to stabilize your dopamine baseline for consistent energy and avoid the "crash" cycle.',
  },
  // Alias for when you add a dedicated dopamine-baseline term
  'dopamine-baseline': {
    title: 'Understanding Dopamine Baseline & Motivation',
    description:
      'Master the neurochemistry of drive. Learn how to stabilize your dopamine baseline for consistent energy and avoid the "crash" cycle.',
  },

  // SEO pack: biology → social intelligence
  'prefrontal-cortex': {
    title: 'Prefrontal Cortex: The Seat of Executive Function',
    description:
      "Master your focus, decision-making, and emotional control by understanding the prefrontal cortex's role in the ONDA system.",
  },
  amygdala: {
    title: "Amygdala: Managing the Brain's Alarm System",
    description:
      'Learn how the amygdala processes fear and stress, and explore biological protocols to regulate emotional reactivity.',
  },
  oxytocin: {
    title: 'Oxytocin: The Neurobiology of Trust & Bonding',
    description:
      'Explore the role of oxytocin in social intelligence, leadership, and creating deep biological resonance with others.',
  },
  cortisol: {
    title: 'Cortisol Management: Balancing Stress & Energy',
    description:
      'Understand the biological impact of cortisol on your performance and learn ONDA protocols for healthy stress regulation.',
  },
  homeostasis: {
    title: 'Biological Homeostasis: The Key to Resilience',
    description:
      'How your body maintains internal balance. Learn to optimize your metabolic and neural stability for peak performance.',
  },
  'circadian-rhythm': {
    title: 'Circadian Rhythms: Optimizing Your Biological Clock',
    description:
      'Align your sleep and energy levels with your natural biological clock. Protocols for deep recovery and hormonal balance.',
  },
  'limbic-system': {
    title: 'Limbic System: The Engine of Emotions & Instincts',
    description:
      "Navigate the brain's emotional center. Learn how the limbic system interacts with logic to shape your daily reality.",
  },
  neurotransmitters: {
    title: "Neurotransmitters: Your Brain's Chemical Language",
    description:
      'A guide to dopamine, serotonin, and GABA. How chemical signaling affects your mood, drive, and cognitive state.',
  },
  'enteric-nervous-system': {
    title: 'Enteric Nervous System: The "Second Brain"',
    description:
      'Explore the gut-brain axis and how your digestive system influences your mental clarity and emotional intelligence.',
  },
  'sympathetic-nervous-system': {
    title: 'Sympathetic Nervous System: Managing "Fight or Flight"',
    description:
      'Master your response to high-pressure situations by regulating the sympathetic drive through ONDA protocols.',
  },
}
