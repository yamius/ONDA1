/**
 * Task 108 SEO — internal links for /science/psychology/<topic> (EN only). Pure data, no imports: resolved at build time
 * by scripts/fetch-psych.ts against the real catalogs (EN articles, live tools, glossary), so a slug that does not exist
 * (or a tool that is not live) is silently dropped. Rules are matched on "<topic id> <title>"; every matching rule
 * contributes in order, then DEFAULT fills up; 3–6 links per page.
 * `hubs` = ONDA Library topic hubs (/articles/topic/<hub>) that show a "From the psychology section" block linking back.
 */
export type PsychLinkRef = { kind: 'article' | 'tool' | 'glossary'; slug: string }
export interface PsychRelatedRule { match: RegExp; links: PsychLinkRef[]; hubs: string[] }

const a = (slug: string): PsychLinkRef => ({ kind: 'article', slug })
const t = (slug: string): PsychLinkRef => ({ kind: 'tool', slug })
const g = (slug: string): PsychLinkRef => ({ kind: 'glossary', slug })

export const PSYCH_RELATED_RULES: PsychRelatedRule[] = [
  { match: /anxi|panic|worry|fear/i, hubs: ['stress-vagus', 'breathing'],
    links: [a('anxiety-panic-breathing-hrv'), t('breathing'), a('physiological-sigh'), a('calm-your-nervous-system-down'), t('nervous-system'), g('vagus-nerve')] },
  { match: /stress|emotion|regulat|burnout|anger|rumina/i, hubs: ['stress-vagus'],
    links: [a('how-to-regulate-emotions'), a('chronic-stress-nervous-system-never-off'), t('burnout'), a('breathing-lowers-stress-hormones'), t('breathing'), g('emotions')] },
  { match: /sleep|insomnia|night|dream/i, hubs: ['sleep-body-clock'],
    links: [t('sleep-cycle'), a('how-much-sleep-do-you-need'), a('cardiac-coherence-insomnia-sleep'), a('wind-down-before-sleep-breathing'), t('sleep-debt'), g('deep-sleep')] },
  { match: /mindful|meditat|attention|focus/i, hubs: ['meditation', 'brain-focus-aging'],
    links: [a('meditation-vs-breathwork'), a('breathing-for-focus-and-attention'), a('short-daily-breathing-routine'), t('breathing')] },
  { match: /habit|motivat|procrastinat|digital|screen/i, hubs: ['lifestyle'],
    links: [t('dopamine-detox'), t('digital-detox'), a('screen-apnea-breathing')] },
]
export const PSYCH_RELATED_DEFAULT: PsychLinkRef[] = [a('calm-your-nervous-system-down'), t('breathing'), t('nervous-system'), a('how-to-regulate-emotions')]
export const PSYCH_RELATED_MAX = 6
