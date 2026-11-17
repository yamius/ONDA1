/**
 * Article → ONDA Science pages ("The science behind this topic" block at the end of an article).
 * Added 2026-11-16: most /science pages had zero inbound links from the rest of the site
 * (scripts/science-inbound.mjs). Keys are article slugs, values are science keys "<kind>/<slug>".
 * Labels come from src/generated/science-link-titles.ts (built by generate-science-pages.ts,
 * only for keys used here, only languages where that page is published).
 */
export const ARTICLE_SCIENCE_LINKS: Record<string, readonly string[]> = {
  'anxiety-panic-breathing-hrv': ['mechanisms/depression-anxiety-and-hrv', 'mechanisms/acute-stress-and-hrv', 'evidence/box-breathing'],
  'bhastrika-pranayama-brain-anxiety': ['evidence/yoga', 'evidence/fast-breathing'],
  'box-breathing-how-it-works': ['evidence/box-breathing', 'evidence/slow-breathing'],
  'breathing-altitude-acclimatization': ['mechanisms/altitude-and-hrv'],
  'breathing-exercises-older-adults': ['mechanisms/hrv-and-age', 'evidence/tai-chi-and-qigong'],
  'breathing-lowers-stress-hormones': ['mechanisms/acute-stress-and-hrv', 'mechanisms/burnout-work-stress-and-hrv'],
  'caffeine-half-life-sleep-pressure': ['mechanisms/caffeine-and-hrv', 'mechanisms/sleep-and-hrv'],
  'caffeine-hrv-resting-heart-rate': ['mechanisms/caffeine-and-hrv'],
  'cardiac-coherence-insomnia-sleep': ['mechanisms/sleep-and-hrv'],
  'chronic-stress-nervous-system-never-off': ['mechanisms/burnout-work-stress-and-hrv', 'mechanisms/acute-stress-and-hrv'],
  'chronotherapy-light-dark-timing': ['mechanisms/light-and-hrv', 'mechanisms/shift-work-and-hrv'],
  'circadian-lighting-dark-therapy': ['mechanisms/light-and-hrv'],
  'circadian-reset-mastering-light': ['mechanisms/light-and-hrv', 'mechanisms/shift-work-and-hrv'],
  'dysautonomia-long-covid-breathing': ['mechanisms/long-covid-pots-and-hrv'],
  'endocrine-social-drive-oxytocin-testosterone': ['mechanisms/loneliness-social-connections-and-hrv'],
  'forest-bathing-shinrin-yoku-science': ['evidence/virtual-reality-and-stress'],
  'heart-rate-recovery-fitness-marker': ['mechanisms/exercise-and-hrv'],
  'high-blood-pressure-slow-breathing': ['mechanisms/hypertension-and-hrv'],
  'how-long-does-alcohol-stay-in-your-system': ['mechanisms/alcohol-and-hrv'],
  'how-much-alcohol-lowers-hrv': ['mechanisms/alcohol-and-hrv'],
  'how-much-sleep-do-you-need': ['mechanisms/sleep-and-hrv'],
  'normal-hrv-by-age': ['mechanisms/hrv-and-age'],
  'overtraining-hrv-resting-heart-rate': ['mechanisms/exercise-and-hrv', 'mechanisms/illness-and-hrv'],
  'resting-heart-rate-by-age': ['mechanisms/hrv-and-age'],
  'social-jet-lag-irregular-sleep': ['mechanisms/shift-work-and-hrv', 'mechanisms/sleep-and-hrv'],
  'sudarshan-kriya-yoga-breathing': ['evidence/yoga'],
  'what-to-do-after-low-hrv-reading': ['mechanisms/illness-and-hrv', 'mechanisms/alcohol-and-hrv', 'mechanisms/sleep-and-hrv'],
  'why-is-my-apple-watch-hrv-low': ['mechanisms/illness-and-hrv', 'mechanisms/alcohol-and-hrv', 'mechanisms/sleep-and-hrv'],
  'yoga-breathing-diabetes-blood-sugar': ['mechanisms/type-2-diabetes-and-hrv', 'evidence/yoga'],
  'yoga-nidra-sleep-science': ['evidence/yoga-nidra-nsdr', 'evidence/yoga'],
  'yoga-poses-heart-rate-blood-pressure': ['evidence/yoga', 'mechanisms/hypertension-and-hrv'],
  'zone-2-training-aerobic-base': ['mechanisms/exercise-and-hrv', 'mechanisms/strength-training-and-hrv'],
}

/** Glossary term → ONDA Science pages (same block on the term page). Added 2026-11-16 for science
 *  pages that no article covers (pregnancy, menopause, menstrual cycle, chronic pain, noise, method). */
export const GLOSSARY_SCIENCE_LINKS: Record<string, readonly string[]> = {
  'hormones': ['mechanisms/menstrual-cycle-and-hrv', 'mechanisms/pregnancy-and-hrv', 'mechanisms/menopause-and-hrv'],
  'gonads': ['mechanisms/menstrual-cycle-and-hrv', 'mechanisms/menopause-and-hrv'],
  'free-hormonal-index': ['mechanisms/menstrual-cycle-and-hrv', 'mechanisms/menopause-and-hrv'],
  'endocrine-system': ['mechanisms/pregnancy-and-hrv', 'mechanisms/type-2-diabetes-and-hrv'],
  'endorphins': ['mechanisms/chronic-pain-and-hrv'],
  'interoception': ['mechanisms/chronic-pain-and-hrv'],
  'psychoneuroimmunology': ['mechanisms/illness-and-hrv', 'mechanisms/chronic-pain-and-hrv'],
  'allostatic-load': ['mechanisms/air-pollution-noise-and-hrv', 'mechanisms/burnout-work-stress-and-hrv'],
  'heart-rate-variability': ['measurements/how-we-evaluate-research', 'mechanisms/hrv-and-age', 'mechanisms/sleep-and-hrv'],
  'rmssd': ['measurements/how-we-evaluate-research'],
  'sdnn': ['measurements/how-we-evaluate-research'],
  'hrv-baseline': ['mechanisms/illness-and-hrv', 'mechanisms/alcohol-and-hrv'],
  'cortisol': ['mechanisms/acute-stress-and-hrv', 'mechanisms/burnout-work-stress-and-hrv'],
  'adrenaline': ['mechanisms/acute-stress-and-hrv'],
  'blue-light': ['mechanisms/light-and-hrv'],
  'circadian-rhythm': ['mechanisms/light-and-hrv', 'mechanisms/shift-work-and-hrv'],
  'melatonin': ['mechanisms/light-and-hrv', 'mechanisms/shift-work-and-hrv'],
  'deep-sleep': ['mechanisms/sleep-and-hrv'],
  'insulin-sensitivity': ['mechanisms/type-2-diabetes-and-hrv'],
  'glucose-spikes': ['mechanisms/type-2-diabetes-and-hrv'],
  'vasomotricity': ['mechanisms/hypertension-and-hrv'],
  'co-regulation': ['mechanisms/loneliness-social-connections-and-hrv'],
  'sarcopenia': ['mechanisms/strength-training-and-hrv', 'mechanisms/hrv-and-age'],
  'co2-tolerance': ['mechanisms/altitude-and-hrv'],
}

/** Article / glossary → psychology pages (/science/psychology/<topic>, EN only; pages come from onda-psych at
 *  build time). Added 2026-11-17: no page outside the section linked to them. A topic that is not published
 *  (no ONDA_PSYCH_TOKEN, or not merged yet) is simply skipped, never a build error. */
export const ARTICLE_PSYCH_LINKS: Record<string, readonly string[]> = {
  'anxiety-panic-breathing-hrv': ['anxiety', 'breathing-ans'],
  'breathing-lowers-stress-hormones': ['breathing-ans', 'stress-emotion-regulation'],
  'box-breathing-how-it-works': ['breathing-ans'],
  'chronic-stress-nervous-system-never-off': ['burnout', 'stress-emotion-regulation'],
  'calm-your-nervous-system-down': ['stress-emotion-regulation'],
  'how-to-regulate-emotions': ['stress-emotion-regulation', 'cbt-self-help'],
  'how-much-sleep-do-you-need': ['sleep'],
  'cardiac-coherence-insomnia-sleep': ['sleep'],
  'wind-down-before-sleep-breathing': ['sleep', 'rumination'],
  'attention-trainable-skill-meditation': ['mindfulness'],
  'meditation-vs-breathwork': ['mindfulness', 'breathing-ans'],
  'does-dopamine-detox-work': ['motivation-habits', 'procrastination'],
  'endocrine-social-drive-oxytocin-testosterone': ['loneliness'],
}
export const GLOSSARY_PSYCH_LINKS: Record<string, readonly string[]> = {
  'amygdala': ['anxiety'],
  'emotions': ['stress-emotion-regulation', 'rumination'],
  'feelings': ['stress-emotion-regulation', 'gestalt'],
  'sensations': ['gestalt', 'mindfulness'],
  'thoughts': ['rumination', 'cbt-self-help'],
  'cognitive-reappraisal': ['cbt-self-help', 'stress-emotion-regulation'],
  'neural-reframing': ['cbt-self-help'],
  'default-mode-network': ['rumination', 'mindfulness'],
  'interoception': ['mindfulness'],
  'social-sensing': ['loneliness'],
  'co-regulation': ['loneliness', 'self-compassion'],
  'oxytocin': ['loneliness', 'gratitude'],
  'dopamine': ['motivation-habits', 'procrastination'],
  'motivational-salience': ['motivation-habits'],
  'prefrontal-cortex': ['procrastination', 'motivation-habits'],
  'cortisol': ['burnout'],
  'allostatic-load': ['burnout'],
  'deep-sleep': ['sleep'],
  'melatonin': ['sleep'],
  'adenosine': ['sleep'],
  'anterior-cingulate-cortex': ['self-compassion', 'mindfulness'],
}

/** Every science key referenced above (the generator emits titles only for these). */
export const CROSSLINKED_SCIENCE_KEYS: string[] = [...new Set([...Object.values(ARTICLE_SCIENCE_LINKS), ...Object.values(GLOSSARY_SCIENCE_LINKS)].flat())]
