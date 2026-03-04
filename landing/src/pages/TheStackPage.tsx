import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProtocolUniqueId, PROTOCOL_STORAGE_PREFIX, PROTOCOL_TO_ARTICLE } from '../data/protocol-ids'

const PAGE_TITLE = 'The Stack | System Configuration | ONDA Life'
const PAGE_DESC =
  'Complete daily operational protocol for human hardware optimization. All 13 system upgrades in one dashboard.'

interface Protocol {
  id: string
  name: string
  params?: string
}

interface Component {
  name: string
  protocols: Protocol[]
}

const STACK_COMPONENTS: Component[] = [
  {
    name: 'OS_STATES',
    protocols: [
      { id: 'delta-wave-amplification', name: 'DELTA_WAVE_AMPLIFICATION', params: '(PHASE_LOCKED)' },
      { id: 'sleep-posture', name: 'GRAVITATIONAL_DRAINAGE', params: '(LATERAL_10-15deg)' },
      { id: 'thermal-flush', name: 'THERMAL_FLUSH', params: '(HOT_BATH_90min)' },
      { id: 'insulin-block', name: 'DIETARY_FIREWALL', params: '(3-4h_PRE_SLEEP)' },
    ],
  },
  {
    name: 'NEURAL_HARDWARE',
    protocols: [
      { id: 'closed-loop-neural-sync', name: 'CLOSED_LOOP_NEURAL_SYNC', params: '(EEG_DRIVEN)' },
      { id: 'vagus-reset', name: 'VAGUS_NERVE_RESET', params: '(10min_PULSETTO)' },
      { id: 'cognitive-focus', name: 'COGNITIVE_FOCUS', params: '(tDCS_F3_1.5mA)' },
      { id: 'ces-sleep', name: 'ELECTRICAL_SLEEP_CALIBRATION', params: '(CES_30min)' },
    ],
  },
  {
    name: 'NERVOUS_SYSTEM',
    protocols: [
      { id: 'resonant-frequency', name: 'RESONANT_FREQUENCY', params: '(5.5-5.5)' },
      { id: 'box-breathing', name: 'BOX_BREATHING', params: '(4-4-4-4)' },
      { id: 'physiological-sigh', name: 'PHYSIOLOGICAL_SIGH', params: '(INSTANT_REBOOT)' },
      { id: 'nasal-only', name: 'NITRIC_OXIDE_BOOST', params: '(NASAL_ONLY)' },
      { id: 'ocular-vagal', name: 'OCULAR_VAGAL_RECENTERING', params: '' },
      { id: 'hrv-baseline', name: 'MORNING_BASELINE_SCAN', params: '(HRV)' },
      { id: 'biofeedback-resync', name: 'BIOFEEDBACK_RESYNC', params: '(5.5s_BREATH)' },
      { id: 'cold-spike', name: 'COLD_EXPOSURE_SPIKE', params: '(30s)' },
      { id: 'cross-lateral', name: 'CROSS_LATERAL_RESET', params: '(5min_BEAR_CRAWL)' },
      { id: 'cadence-hack', name: 'RHYTHMIC_ENTRAINMENT', params: '(120-140_BPM)' },
      { id: 'sensory-override', name: 'SENSORY_OVERRIDE', params: '(UNEVEN_SURFACES)' },
      { id: 'bolt-test', name: 'BOLT_TEST', params: '(BODY_OXYGEN_LEVEL)' },
      { id: 'co2-box-calibration', name: 'CO2_BOX_CALIBRATION', params: '(4-4-4-4_10min)' },
      { id: 'apnea-tables', name: 'APNEA_TABLES', params: '(PROGRESSIVE_STRESS)' },
    ],
  },
  {
    name: 'REWARD_LOGIC',
    protocols: [
      { id: 'intermittent-reward', name: 'INTERMITTENT_REWARD', params: '(COIN_FLIP)' },
      { id: 'morning-light', name: 'MORNING_LIGHT_TRIGGER', params: '(10-15min)' },
      { id: 'cold-baseline', name: 'COLD_INDUCED_BASELINE', params: '(2min)' },
      { id: 'analog-morning', name: 'ANALOG_MORNING', params: '(60min_NO_DIGITAL)' },
      { id: 'monotasking', name: 'MONOTASKING_BLOCKS', params: '(90min_DEEP_WORK)' },
      { id: 'dopamine-fast', name: 'DOPAMINE_FAST', params: '(4h_SUNDAY)' },
    ],
  },
  {
    name: 'ENERGY_GRID',
    protocols: [
      { id: 'first-photon', name: 'FIRST_PHOTON', params: '(MORNING_SUN)' },
      { id: 'photonic-anchor', name: 'PHOTONIC_ANCHOR', params: '(10k_LUX)' },
      { id: 'blue-firewall', name: 'BLUE_LIGHT_FIREWALL', params: '(POST_SUNSET)' },
      { id: 'spectral-shift', name: 'SPECTRAL_SHIFT', params: '(RED_2000K)' },
      { id: 'photic-firewall', name: 'PHOTIC_FIREWALL', params: '(ORANGE_LENSES)' },
      { id: 'temp-down', name: 'TEMPERATURE_DOWNREGULATION', params: '(18C_BEDROOM)' },
      { id: 'fasted-window', name: 'FASTED_WINDOW', params: '(8h_EATING)' },
      { id: 'glucose-buffer', name: 'GLUCOSE_BUFFER', params: '(POST_MEAL_WALK)' },
      { id: 'zone2', name: 'ZONE_2_AEROBIC', params: '(45min)' },
      { id: 'fiber-pre-loading', name: 'FIBER_PRE_LOADING', params: '(10-15g_PRE_MEAL)' },
      { id: 'berberine-pulsing', name: 'BERBERINE_PULSING', params: '(500mg)' },
      { id: 'protein-leverage-16', name: 'PROTEIN_LEVERAGE_1.6', params: '(g/KG)' },
    ],
  },
  {
    name: 'REGENERATION_MATRIX',
    protocols: [
      { id: 'cellular-ignition', name: 'CELLULAR_IGNITION', params: '(DECAF_CACAO)' },
      { id: 'micro-circulation-loop', name: 'MICRO_CIRCULATION_LOOP', params: '(ZONE_1)' },
      { id: 'recovery-firewall', name: 'RECOVERY_FIREWALL', params: '(RED_LIGHT_660nm)' },
    ],
  },
  {
    name: 'POWER_GRID',
    protocols: [
      { id: 'thermal-shock', name: 'THERMAL_SHOCK', params: '(SAUNA_80C)' },
      { id: 'photonic-charging', name: 'PHOTONIC_CHARGING', params: '(660nm_850nm)' },
      { id: 'nad-fuel', name: 'NAD+_FUEL_CELL', params: '(HIIT)' },
      { id: 'photonic-mtdna', name: 'PHOTONIC_CHARGING', params: '(660nm_850nm)' },
      { id: 'system-flush', name: 'SYSTEM_FLUSH', params: '(36-72h_FAST)' },
      { id: 'senolytics', name: 'QUERCETIN_FISETIN', params: '(STRAWBERRIES_CAPERS)' },
      { id: 'senolytic-purge', name: 'SENOLYTIC_PURGE', params: '(HIT_AND_RUN)' },
      { id: 'sauna-cold', name: 'SAUNA_COLD_CYCLE', params: '(20min_3min)' },
      { id: 'grip-strength', name: 'GRIP_STRENGTH_CALIBRATION', params: '(WEEKLY_DYNAMOMETER)' },
      { id: 'metabolic-overclocking', name: 'METABOLIC_OVERCLOCKING', params: '(TABATA_4min)' },
      { id: 'peptide-patch', name: 'RECOVERY_FIRMWARE', params: '(BPC157_TB500)' },
    ],
  },
  {
    name: 'COGNITIVE_ENGINE',
    protocols: [
      { id: 'alpha-priming', name: 'DEEP_WORK_PRIMING', params: '(ALPHA_8-12Hz)' },
      { id: 'bdnf-trigger', name: 'BDNF_TRIGGER', params: '(3min_HIIT)' },
      { id: 'nsdr', name: 'NSDR_RECOVERY', params: '(20min_YOGA_NIDRA)' },
      { id: 'focus-baseline', name: 'FOCUS_BASELINE', params: '(CAFFEINE_THEANINE_1:2)' },
      { id: 'memory-encoder', name: 'MEMORY_ENCODER', params: '(ALPHA_GPC_BACOPA)' },
      { id: 'recovery-loop', name: 'RECOVERY_LOOP', params: '(MAGNESIUM_L_THREONATE)' },
    ],
  },
  {
    name: 'SYSTEM_FORECASTING',
    protocols: [
      { id: 'anomaly-detection-pulse', name: 'ANOMALY_DETECTION_PULSE', params: '(PREDICTIVE_SYNC)' },
      { id: 'cortisol-sync', name: 'STRESS_RESPONSE_CALIBRATION', params: '(CORTISOL_SYNC)' },
      { id: 'performance-window', name: 'PERFORMANCE_WINDOW_OPTIMIZATION', params: '(PEAK_TESTOSTERONE)' },
      { id: 'crash-prevention', name: 'HORMONAL_CRASH_PREVENTION', params: '(BASELINE_ALERT)' },
      { id: 'phase-sync', name: 'PHASE_SYNCHRONIZATION', params: '(CYCLE_SYNCING_DAYS_7-14)' },
      { id: 'bbt-tracking', name: 'THERMAL_MONITORING', params: '(BBT_OURA_EVIE)' },
      { id: 'micronutrient-load', name: 'NUTRITIONAL_PATCH', params: '(MG_CARBS_PRE_CYCLE)' },
    ],
  },
  {
    name: 'GUT_BRAIN_LINK',
    protocols: [
      { id: 'microbiome-patch', name: 'MICROBIOME_PATCH', params: '(30g_FIBER)' },
      { id: 'polyphenol', name: 'POLYPHENOL_BOOST', params: '(DARK_CHOCOLATE_BERRIES)' },
      { id: 'cold-restart', name: 'COLD_RESTART', params: '(24h_FAST_MONTHLY)' },
    ],
  },
]

function getActiveProtocolIds(): Set<string> {
  const active = new Set<string>()
  if (typeof window === 'undefined') return active
  for (const comp of STACK_COMPONENTS) {
    for (const p of comp.protocols) {
      const uniqueId = getProtocolUniqueId(p.id)
      if (localStorage.getItem(PROTOCOL_STORAGE_PREFIX + uniqueId) === 'active') {
        active.add(p.id)
      }
    }
  }
  return active
}

export function TheStackPage() {
  const [activeProtocolIds, setActiveProtocolIds] = useState<Set<string>>(getActiveProtocolIds)

  useEffect(() => {
    document.title = PAGE_TITLE
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', PAGE_DESC)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      const d = document.querySelector('meta[name="description"]')
      if (d) d.setAttribute('content', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
    }
  }, [])

  const toggleStatus = (id: string) => {
    const uniqueId = getProtocolUniqueId(id)
    setActiveProtocolIds((prev) => {
      const next = new Set(prev)
      const isActive = next.has(id)
      if (isActive) {
        next.delete(id)
        localStorage.removeItem(PROTOCOL_STORAGE_PREFIX + uniqueId)
      } else {
        next.add(id)
        localStorage.setItem(PROTOCOL_STORAGE_PREFIX + uniqueId, 'active')
      }
      return next
    })
  }

  const isProtocolActive = (id: string) => activeProtocolIds.has(id)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 font-mono md:px-6">
      <nav className="mb-8 flex items-center gap-2 text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          The Stack
        </span>
      </nav>

      <h1 className="mb-10 text-xl font-mono tracking-wider text-white/90 md:text-2xl">
        [ SYSTEM_CONFIGURATION_V1.0 ]
      </h1>

      <div className="space-y-10">
        {STACK_COMPONENTS.map((comp) => (
          <section key={comp.name} id={comp.name.toLowerCase().replace(/_/g, '-')}>
            <h2 className="mb-4 text-sm font-mono tracking-wider text-terminal-green/80">
              [ COMPONENT: {comp.name} ]
            </h2>
            <div className="space-y-2 pl-2">
              {comp.protocols.map((p) => {
                const isActive = isProtocolActive(p.id)
                const status = isActive ? 'ACTIVE' : 'PENDING'
                const articleSlug = PROTOCOL_TO_ARTICLE[p.id]
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 font-mono text-xs text-white/50"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-1">
                      <span className="text-white/50">&gt;</span>
                      {articleSlug ? (
                        <Link
                          to={`/articles/${articleSlug}#${getProtocolUniqueId(p.id)}`}
                          className="group/link flex cursor-pointer items-center gap-1 truncate transition-colors hover:text-white hover:underline"
                        >
                          {p.name}
                          {p.params ? ` ${p.params}` : ''}
                          <span className="ml-0.5 shrink-0 text-terminal-green/60 opacity-0 transition-opacity group-hover/link:opacity-100">
                            →
                          </span>
                        </Link>
                      ) : (
                        <span>
                          {p.name}
                          {p.params ? ` ${p.params}` : ''}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStatus(p.id)}
                      className="shrink-0 cursor-pointer whitespace-nowrap pl-2 transition-colors hover:text-white/70"
                      aria-pressed={isActive}
                    >
                      // STATUS:{' '}
                      <span
                        className={
                          isActive ? 'text-terminal-green' : 'text-white/40'
                        }
                      >
                        {status}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-white/5 pt-8">
        <Link
          to="/articles"
          className="text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Articles
        </Link>
      </div>
    </div>
  )
}
