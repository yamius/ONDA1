/**
 * Wim Hof breathing timer + cold-exposure protocol guide.
 *
 * SAFETY-CRITICAL TOOL. Wim Hof / cyclic-hyperventilation breathing causes
 * transient hypocapnia and can trigger fainting — it has caused drownings and
 * injuries when done in or near water. Cold exposure stresses the heart. This
 * tool ships with prominent, non-negotiable safety rules and an honest, not
 * hyped, read of the evidence. Educational only, not medical advice.
 */

import type { ScienceSource } from './sources'

export interface WhmConfig {
  rounds: number
  breaths: number
  recoverySec: number
}

export const WHM_DEFAULTS: WhmConfig = { rounds: 3, breaths: 30, recoverySec: 15 }
export const WHM_ROUND_OPTIONS = [2, 3, 4] as const
export const WHM_BREATH_OPTIONS = [25, 30, 35, 40] as const
/** Per half-breath (inhale OR exhale) animation duration, ms. */
export const WHM_HALF_MS = 1400

export const WHM_SOURCES: ScienceSource[] = [
  {
    authors: 'Kox M, van Eijk LT, Zwaag J, et al.',
    year: 2014,
    title: 'Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans',
    journal: 'PNAS, 111(20):7379–7384',
    contributes: 'The core Wim Hof Method study — the trained group voluntarily raised adrenaline and damped an inflammatory response.',
    url: 'https://doi.org/10.1073/pnas.1322174111',
  },
  {
    authors: 'Buijze GA, Sierevelt IN, van der Heijden BCJM, et al.',
    year: 2016,
    title: 'The effect of cold showering on health and work: a randomized controlled trial',
    journal: 'PLOS ONE, 11(9):e0161749',
    contributes: 'RCT (n≈3000): ending showers cold for 30–90 s cut self-reported sick-leave by ~29%.',
    url: 'https://doi.org/10.1371/journal.pone.0161749',
  },
  {
    authors: 'Tipton MJ, Collier N, Corbett J, et al.',
    year: 2017,
    title: 'Cold water immersion: kill or cure?',
    journal: 'Experimental Physiology, 102(11):1335–1355',
    contributes: 'The honest safety picture — cold-shock response, cardiac risk, and why caution and gradual exposure matter.',
    url: 'https://doi.org/10.1113/EP086283',
  },
  {
    authors: 'Søberg S, Löfgren J, Philipsen FE, et al.',
    year: 2021,
    title: 'Altered brown fat thermoregulation and enhanced cold-induced thermogenesis in young, healthy, winter-swimming men',
    journal: 'Cell Reports Medicine, 2(10):100408',
    contributes: 'Study of regular winter swimmers, the source of the widely cited ~11 minutes of cold per week.',
    url: 'https://doi.org/10.1016/j.xcrm.2021.100408',
  },
  {
    authors: 'Roberts LA, Raastad T, Markworth JF, et al.',
    year: 2015,
    title: 'Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training',
    journal: 'Journal of Physiology, 593(18):4285–4301',
    contributes: 'Cold-water immersion after strength training blunted long-term gains in muscle mass and strength.',
    url: 'https://doi.org/10.1113/JP270570',
  },
]
