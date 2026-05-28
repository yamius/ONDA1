/**
 * Scoring criteria per review category. Weights sum to 1.0 within a
 * category — a review's overallScore is the weighted mean of its
 * CriterionScores. These definitions are the single source of truth for
 * the public /reviews/methodology page.
 */
import type { Criterion, ReviewCategory } from './types'

/** HRV wearables: rings, straps and watches that measure heart-rate
 *  variability. HRV accuracy is weighted highest — it is the metric
 *  ONDA's whole product is built on. */
const HRV_WEARABLE_CRITERIA: Criterion[] = [
  {
    id: 'hrv-accuracy',
    label: 'HRV measurement accuracy',
    weight: 0.25,
    description:
      'Agreement of measured HRV (RMSSD) with an ECG chest-strap reference, drawn from peer-reviewed validation studies and side-by-side testing.',
  },
  {
    id: 'sensor',
    label: 'Sensor and signal quality',
    weight: 0.15,
    description:
      'Sensor type (optical PPG vs electrical ECG), sampling approach, and how well a clean signal holds during movement and overnight.',
  },
  {
    id: 'sleep-accuracy',
    label: 'Sleep tracking accuracy',
    weight: 0.15,
    description:
      'How closely sleep staging and total sleep time track polysomnography or validated references — HRV is read mostly during sleep.',
  },
  {
    id: 'data-access',
    label: 'Data access and export',
    weight: 0.15,
    description:
      'Access to raw and detailed data: export, an open API, and integration with third-party tools rather than a closed app.',
  },
  {
    id: 'wearability',
    label: 'Wearability and battery',
    weight: 0.1,
    description:
      'Comfort and form factor for 24/7 wear, plus battery life and how much charging interrupts continuous measurement.',
  },
  {
    id: 'app-ux',
    label: 'App and software experience',
    weight: 0.1,
    description:
      'Clarity of the app, quality of the guidance, and whether metrics are explained rather than reduced to one opaque score.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Hardware price together with any mandatory subscription, weighed against what the device delivers.',
  },
]

/** Meditation and mindfulness apps. Library breadth and teaching quality
 *  carry the most weight — they are what a daily practice is built on. */
const MEDITATION_APP_CRITERIA: Criterion[] = [
  {
    id: 'content-library',
    label: 'Content library',
    weight: 0.25,
    description:
      'Breadth, depth and quality of the guided library — meditations, courses and series across topics and levels.',
  },
  {
    id: 'teaching',
    label: 'Teaching quality',
    weight: 0.2,
    description:
      'Calibre of the instructors and the teaching itself — how clearly and credibly practice is taught, from beginner to advanced.',
  },
  {
    id: 'personalization',
    label: 'Personalisation',
    weight: 0.15,
    description:
      'How well the app adapts to you — structured courses, progress tracking, recommendations and daily guidance.',
  },
  {
    id: 'app-experience',
    label: 'App experience',
    weight: 0.15,
    description:
      'Clarity and friction of the app itself — interface, navigation and how easily a session starts.',
  },
  {
    id: 'free-tier',
    label: 'Free tier',
    weight: 0.1,
    description:
      'How much genuine practice is possible without paying — a usable free tier versus a locked product tour.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Subscription price weighed against what the library and the teaching deliver.',
  },
  {
    id: 'evidence',
    label: 'Evidence base',
    weight: 0.05,
    description:
      'How far the app is grounded in research and credible teaching lineages rather than vague wellness claims.',
  },
]

/** Sleep apps: trackers and wind-down tools. Tracking accuracy and
 *  wind-down content carry the most weight — a sleep app is judged on
 *  whether it measures sleep, helps you get it, or both. */
const SLEEP_APP_CRITERIA: Criterion[] = [
  {
    id: 'tracking-accuracy',
    label: 'Sleep tracking accuracy',
    weight: 0.2,
    description:
      'How accurately the app measures sleep — timing, stages and disturbances — by accelerometer, microphone, sonar or a paired wearable.',
  },
  {
    id: 'wind-down-content',
    label: 'Wind-down content',
    weight: 0.2,
    description:
      'Breadth and quality of content for falling asleep — soundscapes, sleep stories, guided audio and white noise.',
  },
  {
    id: 'sleep-science',
    label: 'Sleep science',
    weight: 0.15,
    description:
      'Grounding in real sleep science — circadian methods, CBT-I, smart-wake timing — rather than vague relaxation claims.',
  },
  {
    id: 'insights',
    label: 'Insights and guidance',
    weight: 0.15,
    description:
      'Quality of the analysis the app gives back — trends, explanations and actionable recommendations, not just a score.',
  },
  {
    id: 'app-experience',
    label: 'App experience',
    weight: 0.1,
    description:
      'Clarity and friction of the app — interface, navigation and how easily it fits a nightly routine.',
  },
  {
    id: 'free-tier',
    label: 'Free tier',
    weight: 0.1,
    description:
      'How much is genuinely usable without paying — a working free tier versus a locked sample.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Price — one-time or subscription — weighed against what the app delivers.',
  },
]

/** Vagus-nerve stimulators: non-invasive (and one reference implanted)
 *  devices targeting the vagus nerve. Evidence and mechanism carry the
 *  most weight — the field is full of marketing claims weakly tied to
 *  what the hardware actually does. */
const VAGUS_STIM_CRITERIA: Criterion[] = [
  {
    id: 'evidence',
    label: 'Evidence and clinical backing',
    weight: 0.25,
    description:
      'Quality and quantity of peer-reviewed studies on the device itself — not the vagus nerve in general — plus FDA / CE clearances and the conditions they cover.',
  },
  {
    id: 'mechanism',
    label: 'Stimulation mechanism',
    weight: 0.2,
    description:
      'What the device does to the vagus nerve — electrical (transcutaneous tVNS at the ear or neck), implanted, vibrotactile or infrasonic — and how transparent its dosing parameters are.',
  },
  {
    id: 'protocols',
    label: 'Protocol flexibility',
    weight: 0.15,
    description:
      'Range and customisability of programmes — session lengths, intensities, modes (sleep, stress, focus, recovery) and whether parameters are documented or hidden behind a black-box app.',
  },
  {
    id: 'comfort',
    label: 'Comfort and wearability',
    weight: 0.15,
    description:
      'Form factor, skin tolerance and how realistic daily or session-based use is — handheld, ear clip, neck collar, chest pebble or wearable patch.',
  },
  {
    id: 'biofeedback',
    label: 'Biofeedback and data',
    weight: 0.15,
    description:
      'On-device or paired HRV measurement, session logging and integration with health apps — does it just stimulate, or close the loop with measurable output.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Hardware price together with any mandatory subscription or prescription, weighed against the evidence and what the device delivers.',
  },
]

/** Continuous Glucose Monitors for non-diabetic / biohacker use. Insight
 *  quality and sensor accuracy carry the most weight — eight out of ten
 *  CGM programmes on the consumer market are software/coaching wrappers
 *  around two underlying sensors (Abbott Libre 3 and Dexcom G7), so the
 *  real differentiator is what the app does with the data, not the
 *  hardware itself. */
const CGM_CRITERIA: Criterion[] = [
  {
    id: 'sensor-accuracy',
    label: 'Sensor accuracy and reliability',
    weight: 0.2,
    description:
      'Mean absolute relative difference (MARD) of the underlying sensor versus reference plasma glucose, sensor lifespan, drop-out and warm-up behaviour. Most consumer CGMs ride on either Abbott Libre 3 or Dexcom G7 — both well-validated, with G7 marginally more accurate in independent comparison.',
  },
  {
    id: 'insights',
    label: 'Insights and analysis quality',
    weight: 0.25,
    description:
      'How the app interprets glucose curves — meal scoring, food-by-food impact, time-in-range, fasting and overnight metrics, AUC and variability. This is the category’s real differentiator and the metric biohackers are paying for.',
  },
  {
    id: 'coaching',
    label: 'Coaching and guidance',
    weight: 0.15,
    description:
      'Form and quality of human or AI coaching included — registered dietitian, certified coach, AI agent or none. Substance of the guidance, not the marketing claim.',
  },
  {
    id: 'app-integration',
    label: 'App and integration UX',
    weight: 0.15,
    description:
      'Clarity of the app itself plus integration with the wider stack — Apple Health, Google Fit, Oura, Whoop, MyFitnessPal — so the CGM data composes with other biomarkers rather than living in a silo.',
  },
  {
    id: 'flexibility',
    label: 'Programme flexibility and data access',
    weight: 0.15,
    description:
      'Subscription terms, ability to pause or buy single sensors, whether raw glucose data can be exported, and how easy it is to leave without losing access to historical insights.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Total monthly or annual cost — hardware, sensors and any coaching subscription — weighed against insight depth and the credibility of the coaching layer.',
  },
]

/** EEG / brain-training headsets: consumer and developer wearables that
 *  measure (EEG, fNIRS) or modulate (tDCS) brain activity for focus,
 *  meditation, sleep or clinical neurofeedback. Signal quality and
 *  training-content depth lead the rubric — a noisy signal or an empty
 *  app turn the headset into a paperweight regardless of price. */
const EEG_HEADSET_CRITERIA: Criterion[] = [
  {
    id: 'signal-quality',
    label: 'Signal quality and sensor pedigree',
    weight: 0.2,
    description:
      'Sensor type and count (EEG channels, fNIRS optodes, tDCS electrode pairs), sampling rate, dry vs wet electrodes and how well a clean signal holds during a real session. For non-measurement devices (tDCS) this scores stimulation parameter transparency.',
  },
  {
    id: 'training-content',
    label: 'Training programmes and content',
    weight: 0.2,
    description:
      'Breadth and depth of guided sessions — meditations, focus exercises, neurofeedback protocols, clinical programmes — and whether the experience evolves with the user over months of use.',
  },
  {
    id: 'insights',
    label: 'Insights and analysis quality',
    weight: 0.15,
    description:
      'How the app interprets the brain signal — EEG band breakdowns, focus and calm metrics, session-by-session progression, sleep-stage analysis where applicable. The translation from raw signal to actionable feedback.',
  },
  {
    id: 'comfort',
    label: 'Comfort and wearability',
    weight: 0.1,
    description:
      'Headset weight, fit, electrode pressure and how realistic 20–60 minute sessions or overnight wear is in practice.',
  },
  {
    id: 'app-ux',
    label: 'App and integration UX',
    weight: 0.1,
    description:
      'Clarity of the app, friction of starting a session and whether data integrates with Apple Health, Google Fit and other wearables.',
  },
  {
    id: 'open-data',
    label: 'Open data and developer access',
    weight: 0.1,
    description:
      'Raw-signal export, SDK availability, third-party app ecosystem and how locked the user is into the manufacturer’s interpretation. Biohackers and researchers value this disproportionately.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.15,
    description:
      'Hardware price together with any required subscription, weighed against signal quality, content depth and developer access.',
  },
]

/** Red-light therapy panels: consumer LED photobiomodulation hardware for
 *  skin, joints and mitochondrial-function adjunct use. The category is
 *  notorious for inflated marketing claims around irradiance; independent
 *  measurement and EMF/flicker discipline are weighted accordingly. */
const RED_LIGHT_CRITERIA: Criterion[] = [
  {
    id: 'irradiance',
    label: 'Irradiance and spec verification',
    weight: 0.2,
    description:
      'Measured power density (mW/cm²) at the manufacturer-specified treatment distance, cross-referenced against independent meter readings rather than marketing-stated peak figures. The single biggest source of consumer confusion in this category.',
  },
  {
    id: 'wavelengths',
    label: 'Wavelength coverage',
    weight: 0.15,
    description:
      'Spectrum coverage — most consumer panels combine red 660 nm (skin) with near-infrared 850 nm (deeper tissue); some add 630, 810, 830 or 940 nm. The mix and the published peaks matter more than the LED count.',
  },
  {
    id: 'build-emf-flicker',
    label: 'Build, EMF and flicker',
    weight: 0.15,
    description:
      'Hardware build quality, independent EMF measurements at typical treatment distance, and driver flicker rate. Cheaper panels often skip the driver hardware that keeps both clean.',
  },
  {
    id: 'coverage',
    label: 'Panel coverage and form factor',
    weight: 0.15,
    description:
      'Treatment area for the panel size — full-body, half-body, targeted or handheld — and ergonomics for unattended sessions (stand, hanging hardware, door mount).',
  },
  {
    id: 'evidence',
    label: 'Evidence and regulatory status',
    weight: 0.15,
    description:
      'Quality of the published photobiomodulation literature backing the device’s claimed indications, FDA registration / Class II clearances where applicable, and how honestly the manufacturer represents what its panel does versus the published evidence.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Hardware price weighed against measured irradiance × coverage area × build quality. Premium pricing is acceptable when independent verification matches; thin when it does not.',
  },
]

/** Cold-plunge / ice-bath hardware: chillers, tubs and inflatable plunges
 *  for cold-exposure protocols. Chiller capacity dominates the rubric —
 *  the whole category exists to deliver and hold water under 13°C, and
 *  the rest is form factor and longevity. */
const COLD_PLUNGE_CRITERIA: Criterion[] = [
  {
    id: 'chiller-capacity',
    label: 'Chiller capacity and temperature range',
    weight: 0.25,
    description:
      'How cold the unit can hold (target range, minimum temperature), how fast it recovers after a plunge, and how it behaves in summer heat. The single criterion the category exists for.',
  },
  {
    id: 'build',
    label: 'Build quality and longevity',
    weight: 0.15,
    description:
      'Tub materials and insulation, exterior finish, expected lifespan and warranty terms. Cold-plunge hardware lives outdoors or in damp environments — the build either holds up for a decade or starts failing in year two.',
  },
  {
    id: 'water-management',
    label: 'Filtration and water management',
    weight: 0.15,
    description:
      'Ozone or UV sanitisation, filter quality and how often the water actually needs changing in practice. The maintenance pattern that determines whether the plunge stays usable for daily protocols.',
  },
  {
    id: 'form-factor',
    label: 'Form factor and footprint',
    weight: 0.15,
    description:
      'Indoor vs outdoor, footprint, install requirements (power, drainage, level surface) and how realistic the device is in a typical home setup.',
  },
  {
    id: 'evidence',
    label: 'Evidence and protocol guidance',
    weight: 0.1,
    description:
      'How honestly the manufacturer represents cold-exposure benefits relative to the published research, and whether the included protocols are grounded in real science or in marketing language.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Total cost of ownership including install, electricity and water — weighed against chiller capability, build longevity and the realistic daily-use pattern.',
  },
]

/** Saunas and infrared saunas: traditional Finnish, full-spectrum IR,
 *  near-IR incandescent and portable blanket form factors. Heat source
 *  and EMF discipline lead the rubric — consumer claims about IR
 *  wavelengths are the dominant source of category confusion. */
const SAUNA_CRITERIA: Criterion[] = [
  {
    id: 'heat-source',
    label: 'Heat source and wavelength coverage',
    weight: 0.25,
    description:
      'Traditional convection vs full-spectrum IR vs near-IR incandescent — and within IR, which emitter type (carbon, ceramic, incandescent) and what wavelength bands the device actually puts out. The single biggest source of consumer confusion in the category.',
  },
  {
    id: 'build',
    label: 'Build quality and wood',
    weight: 0.15,
    description:
      'Cabin wood (cedar, hemlock, basswood, eucalyptus), joinery, insulation and expected lifespan. Sauna hardware that holds up matches the wood to the use case rather than to the marketing budget.',
  },
  {
    id: 'emf',
    label: 'EMF discipline',
    weight: 0.15,
    description:
      'Independently measured EMF at the seated treatment position, with documentation. Cheap IR saunas can run high EMF without the user knowing; the premium brands publish numbers.',
  },
  {
    id: 'form-factor',
    label: 'Form factor and footprint',
    weight: 0.15,
    description:
      'Cabin (1 / 2 / 4-person), portable, blanket or barrel — and the install requirements for each (power, footprint, ventilation, outdoor weather rating).',
  },
  {
    id: 'evidence',
    label: 'Evidence and regulatory status',
    weight: 0.1,
    description:
      'Quality of the published sauna and IR-therapy literature backing the device’s claimed benefits, FDA Class II where applicable, and honest representation of indication versus marketing language.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Hardware price plus install plus annual electricity — weighed against heat-source quality, build longevity, EMF profile and form factor fit.',
  },
]

/** Smart sleep-climate hardware: bed-temperature systems that cool, heat
 *  or actively regulate bed-surface temperature overnight. Eight Sleep
 *  defined the modern premium tier; Sleepme (ChiliPad) holds the
 *  water-only chiller niche; BedJet runs the air-flow alternative. Active
 *  climate control plus app/sleep-tracking dominate the rubric. */
const SLEEP_CLIMATE_CRITERIA: Criterion[] = [
  {
    id: 'climate-range',
    label: 'Climate range and capacity',
    weight: 0.25,
    description:
      'Cooling and heating range delivered (e.g. 13–43 °C at the bed surface), dual-zone capability, recovery time after a temperature change, and how the system holds the target through real ambient swings — the criterion the whole category exists to serve.',
  },
  {
    id: 'build',
    label: 'Build, install and longevity',
    weight: 0.15,
    description:
      'Hardware build quality (cover, hub, water hose / air duct), install footprint, water-tank or filter maintenance burden, and the multi-year reliability track record on the actual hardware shipped today.',
  },
  {
    id: 'app-tracking',
    label: 'App, tracking and integration',
    weight: 0.15,
    description:
      'Quality of the companion app, sleep-staging and HRV tracking on the device, integration with Apple Health / Oura / Whoop and the depth of insights surfaced — sleep-climate is increasingly bought as a tracker as well as a heater.',
  },
  {
    id: 'form-factor',
    label: 'Form factor flexibility',
    weight: 0.15,
    description:
      'Cover vs full-mattress vs blanket, fit on existing beds, dual-zone (his/her) capability, and whether the system survives travel or rentals — install flexibility is the second-most-asked question after cooling.',
  },
  {
    id: 'subscription',
    label: 'Subscription model and ownership cost',
    weight: 0.15,
    description:
      'Whether ongoing membership is required for full features (Eight Sleep), how locked the device is to the manufacturer’s app, and the realistic 3-year total cost of ownership. Eight Sleep’s subscription model is the category’s biggest editorial point of contention.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.15,
    description:
      'Hardware price plus subscription weighed against climate capability, build longevity and tracking depth. The category spans $500 (BedJet) to $5,000+ (Eight Sleep Pod 4 Ultra) — value is a real differentiator.',
  },
]

/** PEMF (pulsed electromagnetic field) devices: mats, coils and wearable
 *  applicators that deliver low-intensity pulsed magnetic fields for
 *  recovery, sleep, circulation and bone-density adjunct use. Field
 *  strength and waveform-research grounding lead the rubric — the category
 *  has wide variance between mats with credible specs and Amazon-tier
 *  hardware running undocumented coils. */
const PEMF_CRITERIA: Criterion[] = [
  {
    id: 'field-strength',
    label: 'Field strength and dose',
    weight: 0.2,
    description:
      'Measured magnetic field intensity at the treatment surface (microTesla / Gauss), pulse-rate range, and how documented the dose is. Marketing-stated peaks are common; usable continuous output is what matters and is rarely published.',
  },
  {
    id: 'waveform-evidence',
    label: 'Waveform and research evidence',
    weight: 0.2,
    description:
      'Whether the specific waveforms and frequencies used are tied to published research (Bemer biorhythmic pulse, FDA-cleared bone-healing waveforms, Schumann-resonance frequencies) or are proprietary patterns without independent backing.',
  },
  {
    id: 'build',
    label: 'Build quality and longevity',
    weight: 0.15,
    description:
      'Hardware build, control-unit electronics, coil quality, included applicators and warranty. PEMF hardware lives 5–10+ years when built right; cheap mats degrade in 12–24 months.',
  },
  {
    id: 'programmability',
    label: 'Programmability and protocols',
    weight: 0.1,
    description:
      'Range and customisability of programmes — preset protocols, intensity steps, session lengths, app control where present. Black-box single-button devices score lower than systems exposing real parameters.',
  },
  {
    id: 'form-factor',
    label: 'Form factor and applicator range',
    weight: 0.15,
    description:
      'Full-body mat vs coil/loop applicator vs wearable patch — and the range of included applicators (whole-body mat plus pillow plus spot applicator vs single mat only). Form-factor flexibility drives real-world session frequency.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Hardware price weighed against measured field strength, waveform research backing and applicator range. The category spans $299 (wearable) to $10,000+ (clinical coil systems) — value gap is large.',
  },
]

/** Breathwork apps: guided-session apps covering box breathing, 4-7-8,
 *  Wim Hof rounds, Tummo, holotropic, Buteyko, cyclic sighing and the
 *  rest of the documented technique landscape. Library breadth and
 *  evidence-grounding dominate the rubric — the category is full of
 *  thin apps with one technique and apps overstating physiological
 *  claims. */
const BREATHWORK_APP_CRITERIA: Criterion[] = [
  {
    id: 'session-library',
    label: 'Session library',
    weight: 0.25,
    description:
      'Breadth and depth of guided breath sessions — count, lengths, themes (sleep, focus, energy, anxiety, performance) and how the library evolves with use over months.',
  },
  {
    id: 'technique-coverage',
    label: 'Technique coverage',
    weight: 0.15,
    description:
      'Range of documented breathwork modalities covered — box breathing, 4-7-8, Wim Hof rounds, Tummo, holotropic, Buteyko, coherent breathing, cyclic sighing — vs single-technique apps.',
  },
  {
    id: 'evidence-grounding',
    label: 'Evidence grounding',
    weight: 0.15,
    description:
      'How far the app cites and follows published research (Stanford cyclic-sighing, polyvagal, Buteyko CO₂ tolerance) rather than vague wellness claims, and whether instructor credentials are real.',
  },
  {
    id: 'app-experience',
    label: 'App experience',
    weight: 0.15,
    description:
      'Clarity and friction of the app itself — interface, visual or audio guidance, session-start friction, Apple Watch / wearable support.',
  },
  {
    id: 'biofeedback',
    label: 'Biofeedback and integration',
    weight: 0.1,
    description:
      'HRV / breath-rate tracking, Apple Health and wearable integration, and whether the app closes the loop with measurable physiological output — most apps just guide; a few measure.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Free tier viability and subscription price weighed against library breadth, technique coverage and evidence depth. The category spans free (iBreathe, Breathe2Relax) to $150/yr (Othership) — value gap is large.',
  },
]

/** Red light face masks: wearable LED photobiomodulation hardware for
 *  facial skin — distinct from full-body panels by form factor, dose
 *  per session, and clinical-evidence framing around dermatology. The
 *  category split sharply in 2024–2026 between FDA-cleared clinical
 *  references (Omnilux, Dr. Dennis Gross, LightStim) and consumer-brand
 *  premium devices (CurrentBody, HigherDOSE, TheraFace). Irradiance
 *  honesty and clinical-evidence base lead the rubric. */
const RED_LIGHT_MASK_CRITERIA: Criterion[] = [
  {
    id: 'irradiance',
    label: 'Irradiance and dose',
    weight: 0.2,
    description:
      'Measured power density (mW/cm²) at the skin during session, cross-referenced against independent meter readings rather than marketing-stated peak figures. Mask form factor delivers lower irradiance than panels by design; honesty about the dose is what separates serious devices from spec-inflation.',
  },
  {
    id: 'wavelength-coverage',
    label: 'Wavelength coverage',
    weight: 0.15,
    description:
      'Spectrum coverage — most face masks combine red 633 nm (skin surface, collagen) with near-infrared 830 nm (deeper tissue). Some add 590 nm amber (pigmentation) or blue 415 nm (acne). The mix and the published peaks matter more than the LED count.',
  },
  {
    id: 'led-count-coverage',
    label: 'LED count and facial coverage',
    weight: 0.15,
    description:
      'LED count and spatial distribution across the face — coverage of forehead, cheeks, jaw, neck. A 100-LED mask with poor distribution treats less skin than a 60-LED mask with even coverage. Neck flap inclusion is the 2026 spec war.',
  },
  {
    id: 'clinical-evidence',
    label: 'Clinical evidence and regulatory standing',
    weight: 0.2,
    description:
      'FDA Class II clearance, published peer-reviewed studies on the specific device for the claimed indications (fine lines, collagen, pigmentation, acne), and how honestly the manufacturer represents the published evidence. The category is full of marketing claims weakly tied to what the hardware actually does.',
  },
  {
    id: 'comfort-fit',
    label: 'Comfort and wearable fit',
    weight: 0.15,
    description:
      'Flexible silicone vs hard plastic, weight, strap design and whether the mask can be worn unattended during a session. Hard-shell masks are cheaper to build but compromise daily use; flexible-silicone is the 2026 reference.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.15,
    description:
      'Hardware price weighed against measured irradiance, wavelength mix, clinical evidence and wearability. The category spans $169 (handheld wand) to $650+ (premium silicone masks) — value gap is large.',
  },
]

/** Mouth taping and nasal breathing aids: mouth tape, nasal dilators
 *  (external strips and internal stents), and related sleep-breathing
 *  hardware. The category went mainstream in 2024–2026 driven by James
 *  Nestor\'s Breath, Wim Hof crossover and the Hostage Tape biohacker
 *  brand. Adhesion comfort and material safety lead the rubric — the
 *  category has wide variance between FDA-cleared medical tape and
 *  Amazon-tier products with skin-irritation issues. */
const BREATHING_AID_CRITERIA: Criterion[] = [
  {
    id: 'adhesion-comfort',
    label: 'Adhesion and comfort',
    weight: 0.2,
    description:
      'Does the tape or device stay on through a full night without falling off, with painless removal? Beard-friendliness for mouth tape, nostril-fit for dilators. The core daily-use criterion.',
  },
  {
    id: 'breathing-mechanism',
    label: 'Breathing mechanism and approach',
    weight: 0.15,
    description:
      'Full mouth seal vs porous mouth tape (allows emergency exhale), external nasal strip (dilates nostrils via leverage) vs internal stent (mechanically holds airway open). The mechanism dictates use case and risk profile.',
  },
  {
    id: 'evidence-grounding',
    label: 'Evidence grounding and safety',
    weight: 0.15,
    description:
      'How honestly the brand represents the published evidence (sleep-apnea caution is real — undiagnosed OSA + full mouth seal is contraindicated), and whether FDA registration / Class II clearance backs claims. The category is full of viral wellness marketing weakly tied to clinical reality.',
  },
  {
    id: 'form-factor',
    label: 'Form factor and design',
    weight: 0.15,
    description:
      'Strip vs cross vs single-piece vs dilator vs collar. Each form factor trades comfort, seal effectiveness and reapplication friction differently. Cross designs allow corner-of-mouth breathing if needed.',
  },
  {
    id: 'material-safety',
    label: 'Material safety and skin tolerance',
    weight: 0.15,
    description:
      'Adhesive composition (silicone gel vs acrylic vs hydrocolloid), hypoallergenic certification, skin-reaction reports in user feedback and lip-irritation patterns. Skin-tolerance issues are the #1 reason users drop the practice.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.2,
    description:
      'Cost per night including subscription (Hostage Tape model) or per-pack pricing (Somnifix, Breathe Right) vs the durability of the adhesive and reusable form factors. The category spans $0.30/night DIY medical tape to $13/month subscription brands — value gap is large.',
  },
]

/** Criteria sets keyed by category. */
export const CRITERIA: Record<ReviewCategory, Criterion[]> = {
  'hrv-wearable': HRV_WEARABLE_CRITERIA,
  'meditation-app': MEDITATION_APP_CRITERIA,
  'sleep-app': SLEEP_APP_CRITERIA,
  'vagus-stim': VAGUS_STIM_CRITERIA,
  cgm: CGM_CRITERIA,
  'eeg-headset': EEG_HEADSET_CRITERIA,
  'red-light': RED_LIGHT_CRITERIA,
  'cold-plunge': COLD_PLUNGE_CRITERIA,
  sauna: SAUNA_CRITERIA,
  'sleep-climate': SLEEP_CLIMATE_CRITERIA,
  pemf: PEMF_CRITERIA,
  'breathwork-app': BREATHWORK_APP_CRITERIA,
  'red-light-mask': RED_LIGHT_MASK_CRITERIA,
  'breathing-aid': BREATHING_AID_CRITERIA,
}

/** Human-readable category labels for the hub and the methodology page. */
export const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  'hrv-wearable': 'HRV trackers',
  'meditation-app': 'Meditation apps',
  'sleep-app': 'Sleep apps',
  'vagus-stim': 'Vagus nerve stimulators',
  cgm: 'Continuous glucose monitors',
  'eeg-headset': 'EEG & brain-training headsets',
  'red-light': 'Red light therapy panels',
  'cold-plunge': 'Cold plunge & ice bath',
  sauna: 'Saunas & infrared saunas',
  'sleep-climate': 'Smart sleep climate',
  pemf: 'PEMF devices',
  'breathwork-app': 'Breathwork apps',
  'red-light-mask': 'Red light face masks',
  'breathing-aid': 'Mouth tape & nasal breathing',
}

/** Review categories in display order. */
export const REVIEW_CATEGORIES: ReviewCategory[] = [
  'hrv-wearable',
  'meditation-app',
  'sleep-app',
  'sleep-climate',
  'vagus-stim',
  'cgm',
  'eeg-headset',
  'red-light',
  'cold-plunge',
  'sauna',
  'pemf',
  'breathwork-app',
  'red-light-mask',
  'breathing-aid',
]

/** URL slugs for per-category landing pages — /reviews/<slug>. Chosen to
 *  match the dominant search keyword for each category ("best hrv tracker",
 *  "best cgm", "best eeg headset"), not the internal category id. Must not
 *  collide with any individual review slug. */
export const CATEGORY_URL_SLUGS: Record<ReviewCategory, string> = {
  'hrv-wearable': 'hrv-trackers',
  'meditation-app': 'meditation-apps',
  'sleep-app': 'sleep-apps',
  'vagus-stim': 'vagus-nerve-stimulators',
  cgm: 'cgm',
  'eeg-headset': 'eeg-headsets',
  'red-light': 'red-light-therapy',
  'cold-plunge': 'cold-plunge',
  sauna: 'infrared-sauna',
  'sleep-climate': 'smart-sleep-climate',
  pemf: 'pemf-devices',
  'breathwork-app': 'breathwork-apps',
  'red-light-mask': 'red-light-face-masks',
  'breathing-aid': 'mouth-tape-nasal-breathing',
}

/** Reverse lookup — URL slug → category id. Returns undefined if the slug
 *  does not match a known category. */
export function getCategoryByUrlSlug(slug: string): ReviewCategory | undefined {
  const entry = (Object.entries(CATEGORY_URL_SLUGS) as [ReviewCategory, string][]).find(
    ([, urlSlug]) => urlSlug === slug,
  )
  return entry?.[0]
}

/** Set of URL slugs reserved for category landing pages. Useful for route
 *  matching to distinguish /reviews/cgm (category) from /reviews/oura-ring-4
 *  (individual review). */
export const CATEGORY_URL_SLUG_SET: ReadonlySet<string> = new Set(
  Object.values(CATEGORY_URL_SLUGS),
)

/** All scoring criteria for a category, in display order. */
export function getCriteria(category: ReviewCategory): Criterion[] {
  return CRITERIA[category]
}

/** Look up one criterion by id within a category. */
export function getCriterion(
  category: ReviewCategory,
  id: string,
): Criterion | undefined {
  return CRITERIA[category].find((c) => c.id === id)
}
