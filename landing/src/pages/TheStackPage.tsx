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
      { id: 'phase-lock-delta-wave-amplification', name: 'DELTA_WAVE_AMPLIFICATION', params: '(PHASE_LOCKED)' },
      { id: 'glymph-sleep-posture', name: 'GRAVITATIONAL_DRAINAGE', params: '(LATERAL_10-15deg)' },
      { id: 'glymph-thermal-flush', name: 'THERMAL_FLUSH', params: '(HOT_BATH_90min)' },
      { id: 'glymph-insulin-block', name: 'DIETARY_FIREWALL', params: '(3-4h_PRE_SLEEP)' },
    ],
  },
  {
    name: 'NEURAL_HARDWARE',
    protocols: [
      { id: 'neural-ent-closed-loop-neural-sync', name: 'CLOSED_LOOP_NEURAL_SYNC', params: '(EEG_DRIVEN)' },
      { id: 'neuromod-vagus-reset', name: 'VAGUS_NERVE_RESET', params: '(10min_PULSETTO)' },
      { id: 'neuromod-cognitive-focus', name: 'COGNITIVE_FOCUS', params: '(tDCS_F3_1.5mA)' },
      { id: 'neuromod-ces-sleep', name: 'ELECTRICAL_SLEEP_CALIBRATION', params: '(CES_30min)' },
    ],
  },
  {
    name: 'NERVOUS_SYSTEM',
    protocols: [
      { id: 'breathwork-resonant-frequency', name: 'RESONANT_FREQUENCY', params: '(5.5-5.5)' },
      { id: 'breathwork-box-breathing', name: 'BOX_BREATHING', params: '(4-4-4-4)' },
      { id: 'breathwork-physiological-sigh', name: 'PHYSIOLOGICAL_SIGH', params: '(INSTANT_REBOOT)' },
      { id: 'breathwork-nasal-only', name: 'NITRIC_OXIDE_BOOST', params: '(NASAL_ONLY)' },
      { id: 'vagus-ocular-vagal', name: 'OCULAR_VAGAL_RECENTERING', params: '' },
      { id: 'hrv-hrv-baseline', name: 'MORNING_BASELINE_SCAN', params: '(HRV)' },
      { id: 'hrv-biofeedback-resync', name: 'BIOFEEDBACK_RESYNC', params: '(5.5s_BREATH)' },
      { id: 'vagus-cold-spike', name: 'COLD_EXPOSURE_SPIKE', params: '(30s_VAGUS)' },
      { id: 'hrv-cold-spike', name: 'COLD_EXPOSURE_SPIKE', params: '(30s_HRV)' },
      { id: 'cpg-cross-lateral', name: 'CROSS_LATERAL_RESET', params: '(5min_BEAR_CRAWL)' },
      { id: 'cpg-cadence-hack', name: 'RHYTHMIC_ENTRAINMENT', params: '(120-140_BPM)' },
      { id: 'cpg-sensory-override', name: 'SENSORY_OVERRIDE', params: '(UNEVEN_SURFACES)' },
      { id: 'co2-bolt-test', name: 'BOLT_TEST', params: '(BODY_OXYGEN_LEVEL)' },
      { id: 'co2-box-calibration', name: 'CO2_BOX_CALIBRATION', params: '(4-4-4-4_10min)' },
      { id: 'co2-apnea-tables', name: 'APNEA_TABLES', params: '(PROGRESSIVE_STRESS)' },
      { id: 'hpa-forced-deceleration', name: 'FORCED_DECELERATION', params: '(PHYSIOLOGICAL_SIGH)' },
      { id: 'hpa-micro-loading', name: 'STATIC_DISCHARGE', params: '(MICRO_LOADING)' },
      { id: 'hpa-cognitive-reframing', name: 'CONTROL_INTERCEPT', params: '(COGNITIVE_REFRAME)' },
    ],
  },
  {
    name: 'REWARD_LOGIC',
    protocols: [
      { id: 'dopamine-intermittent-reward', name: 'INTERMITTENT_REWARD', params: '(COIN_FLIP)' },
      { id: 'dopamine-morning-light', name: 'MORNING_LIGHT_TRIGGER', params: '(10-15min)' },
      { id: 'dopamine-cold-baseline', name: 'COLD_INDUCED_BASELINE', params: '(2min)' },
      { id: 'digital-analog-morning', name: 'ANALOG_MORNING', params: '(60min_NO_DIGITAL)' },
      { id: 'digital-monotasking', name: 'MONOTASKING_BLOCKS', params: '(90min_DEEP_WORK)' },
      { id: 'digital-dopamine-fast', name: 'DOPAMINE_FAST', params: '(4h_SUNDAY)' },
      { id: 'dopamine-stacking-monotasking', name: 'MONOTASKING_KERNEL', params: '(ONE_ACTIVITY_AT_A_TIME)' },
      { id: 'dopamine-stacking-zero-input', name: 'ZERO_INPUT_FAST', params: '(90min_NO_SCREENS)' },
      { id: 'dopamine-stacking-cold-shock', name: 'COLD_SHOCK_BASELINE', params: '(2min_3-10C)' },
    ],
  },
  {
    name: 'ENERGY_GRID',
    protocols: [
      { id: 'circadian-first-photon', name: 'FIRST_PHOTON', params: '(MORNING_SUN)' },
      { id: 'circadian-light-photonic-anchor', name: 'PHOTONIC_ANCHOR', params: '(10k_LUX)' },
      { id: 'circadian-blue-firewall', name: 'BLUE_LIGHT_FIREWALL', params: '(POST_SUNSET)' },
      { id: 'circadian-light-spectral-shift', name: 'SPECTRAL_SHIFT', params: '(RED_2000K)' },
      { id: 'circadian-light-photic-firewall', name: 'PHOTIC_FIREWALL', params: '(ORANGE_LENSES)' },
      { id: 'circadian-temp-down', name: 'TEMPERATURE_DOWNREGULATION', params: '(18C_BEDROOM)' },
      { id: 'metabolic-fasted-window', name: 'FASTED_WINDOW', params: '(8h_EATING)' },
      { id: 'metabolic-glucose-buffer', name: 'GLUCOSE_BUFFER', params: '(POST_MEAL_WALK)' },
      { id: 'metabolic-zone2', name: 'ZONE_2_AEROBIC', params: '(45min)' },
      { id: 'glp1-fiber-pre-loading', name: 'FIBER_PRE_LOADING', params: '(10-15g_PRE_MEAL)' },
      { id: 'glp1-berberine-pulsing', name: 'BERBERINE_PULSING', params: '(500mg)' },
      { id: 'glp1-protein-leverage-16', name: 'PROTEIN_LEVERAGE_1.6', params: '(g/KG)' },
      { id: 'glp1-bitter-signaling', name: 'BITTER_GLP1_SIGNALING', params: '(BITTER_FOODS)' },
      { id: 'leptin-silence-window', name: 'SILENCE_WINDOW', params: '(14-16h_FAST)' },
      { id: 'leptin-protein-first', name: 'FIRST_SIGNAL_RULE', params: '(PROTEIN_FIRST)' },
      { id: 'leptin-thermal-reset', name: 'THERMAL_RESET', params: '(COLD_PLUNGE)' },
      { id: 'tsh-fuel-check', name: 'FUEL_CHECK', params: '(IODINE_SELENIUM)' },
      { id: 'tsh-thermal-test', name: 'THERMAL_TEST', params: '(BASAL_TEMP)' },
      { id: 'tsh-stress-bypass', name: 'STRESS_BYPASS', params: '(BREATHWORK_PM)' },
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
      { id: 'longevity-thermal-shock', name: 'THERMAL_SHOCK', params: '(SAUNA_80C)' },
      { id: 'mito-photonic-charging', name: 'PHOTONIC_CHARGING', params: '(660nm_850nm_MITO)' },
      { id: 'mito-nad-fuel', name: 'NAD+_FUEL_CELL', params: '(HIIT)' },
      { id: 'mt-dna-photonic-mtdna', name: 'PHOTONIC_MTDNA', params: '(660nm_850nm_DNA)' },
      { id: 'longevity-system-flush', name: 'SYSTEM_FLUSH', params: '(36-72h_FAST)' },
      { id: 'longevity-senolytics', name: 'QUERCETIN_FISETIN', params: '(STRAWBERRIES_CAPERS)' },
      { id: 'senolytic-senolytic-purge', name: 'SENOLYTIC_PURGE', params: '(HIT_AND_RUN)' },
      { id: 'longevity-sauna-cold', name: 'SAUNA_COLD_CYCLE', params: '(20min_3min)' },
      { id: 'muscle-grip-strength', name: 'GRIP_STRENGTH_CALIBRATION', params: '(WEEKLY_DYNAMOMETER)' },
      { id: 'muscle-metabolic-overclocking', name: 'METABOLIC_OVERCLOCKING', params: '(TABATA_4min)' },
      { id: 'muscle-peptide-patch', name: 'RECOVERY_FIRMWARE', params: '(BPC157_TB500)' },
      { id: 'range-frac-mechanical', name: 'MECHANICAL_RANGE_FRAC', params: '(1-3_8-12_VELOCITY)' },
      { id: 'range-frac-thermal', name: 'THERMAL_RANGE_FRAC', params: '(ICE_BATH→SAUNA)' },
      { id: 'range-frac-amplitude-shift', name: 'AMPLITUDE_SHIFT', params: '(HIGH↔LOW_LOAD)' },
      { id: 'range-frac-micro-dosing', name: 'MICRO_FRACTIONATION', params: '(DAILY_DOSE+WEEKLY_IMPACT)' },
    ],
  },
  {
    name: 'COGNITIVE_ENGINE',
    protocols: [
      { id: 'neuro-alpha-priming', name: 'DEEP_WORK_PRIMING', params: '(ALPHA_8-12Hz)' },
      { id: 'neuro-bdnf-trigger', name: 'BDNF_TRIGGER', params: '(3min_HIIT)' },
      { id: 'neuro-nsdr', name: 'NSDR_RECOVERY', params: '(20min_YOGA_NIDRA)' },
      { id: 'neural-circuit-digital-sunset', name: 'DIGITAL_SUNSET', params: '(60min_PRE_SLEEP)' },
      { id: 'neural-lipid-fuel', name: 'LIPID_FUEL_INPUT', params: '(OMEGA3_ANTIOXIDANTS)' },
      { id: 'neural-co-regulation', name: 'NEURAL_CO_REGULATION', params: '(IN_PERSON_SYNC)' },
      { id: 'neural-photic-anchor', name: 'PHOTIC_ANCHOR', params: '(10k_LUX_30min)' },
      { id: 'cognitive-focus-baseline', name: 'FOCUS_BASELINE', params: '(CAFFEINE_THEANINE_1:2)' },
      { id: 'cognitive-memory-encoder', name: 'MEMORY_ENCODER', params: '(ALPHA_GPC_BACOPA)' },
      { id: 'cognitive-recovery-loop', name: 'RECOVERY_LOOP', params: '(MAGNESIUM_L_THREONATE)' },
      { id: 'estrogen-phyto-patch', name: 'PHYTO_INQUIRY_PATCH', params: '(DIM_FLAXSEED)' },
      { id: 'estrogen-resistance-training', name: 'INTENSIVE_RENDERING', params: '(3-4x_WEEK)' },
      { id: 'estrogen-omega3-shield', name: 'OMEGA3_NEURAL_SHIELD', params: '(2g_DHA_EPA)' },
    ],
  },
  {
    name: 'SYSTEM_FORECASTING',
    protocols: [
      { id: 'predictive-anomaly-detection-pulse', name: 'ANOMALY_DETECTION_PULSE', params: '(PREDICTIVE_SYNC)' },
      { id: 'chm-cortisol-sync', name: 'STRESS_RESPONSE_CALIBRATION', params: '(CORTISOL_SYNC)' },
      { id: 'chm-performance-window', name: 'PERFORMANCE_WINDOW_OPTIMIZATION', params: '(PEAK_TESTOSTERONE)' },
      { id: 'chm-crash-prevention', name: 'HORMONAL_CRASH_PREVENTION', params: '(BASELINE_ALERT)' },
      { id: 'femtech-phase-sync', name: 'PHASE_SYNCHRONIZATION', params: '(CYCLE_SYNCING_DAYS_7-14)' },
      { id: 'femtech-bbt-tracking', name: 'THERMAL_MONITORING', params: '(BBT_OURA_EVIE)' },
      { id: 'femtech-micronutrient-load', name: 'NUTRITIONAL_PATCH', params: '(MG_CARBS_PRE_CYCLE)' },
      { id: 'visual-calibration', name: 'DIRECT_NEURAL_LINK', params: '(DIRECT_EYE_CONTACT)' },
      { id: 'vocal-resonance', name: 'VOCAL_RESONANCE_MOD', params: '(DEEPER_TONE)' },
      { id: 'tactile-input', name: 'TACTILE_DATA_INPUT', params: '(INTENTIONAL_TOUCH)' },
    ],
  },
  {
    name: 'GUT_BRAIN_LINK',
    protocols: [
      { id: 'gut-microbiome-patch', name: 'MICROBIOME_PATCH', params: '(30g_FIBER)' },
      { id: 'gut-polyphenol', name: 'POLYPHENOL_BOOST', params: '(DARK_CHOCOLATE_BERRIES)' },
      { id: 'gut-cold-restart', name: 'COLD_RESTART', params: '(24h_FAST_MONTHLY)' },
      { id: 'serotonin-posture-patch', name: 'STRUCTURAL_ALIGNMENT', params: '(UPRIGHT_STANCE)' },
      { id: 'serotonin-solar-loading', name: 'PHOTIC_TRIGGER', params: '(MORNING_SUN)' },
      { id: 'serotonin-prebiotic-input', name: 'SERVER_MAINTENANCE', params: '(FIBER_PREBIOTICS)' },
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
