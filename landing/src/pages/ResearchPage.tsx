/**
 * /research — dedicated landing for academic & clinical research partners.
 *
 * Linked from the final slide of the Eurostar deck ("Join the ONDA Research
 * Network"). Page audience: research-grant reviewers, university PIs,
 * clinical researchers, science journalists, peer-reviewed-journal editors.
 *
 * Voice: clinical/professional — no biohacker tone, no marketing fluff.
 * Every claim either ties to a real biomarker / peer-reviewed concept,
 * or is clearly labelled as a roadmap / collaboration opportunity.
 *
 * EN-only by design — research audience reads English; localising this
 * page would dilute peer-review credibility and is not on the roadmap.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const RESEARCH_URL = `${SITE_URL}/research`
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`
// Until a dedicated research@ inbox is provisioned, partnership enquiries
// land in the main inbox alongside other comms. Swap to research@ when
// the alias is live.
const RESEARCH_EMAIL = 'info@onda-life.com'
const TECHNICAL_DOCS_URL = 'https://onda-life.com/p/info'

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOrCreateScript(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

export function ResearchPage() {
  const location = useLocation()

  useEffect(() => {
    void location // unused but kept for parity with sister pages
    const title = 'ONDA Research Network — Validating the 24-Step Neuro-Physiological Framework'
    const desc =
      'Academic and clinical partnership programme for validating the 24-step ONDA framework: longitudinal HRV, eye-scan ANS markers, BDNF, EEG coherence, DMN dynamics.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', RESEARCH_URL, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)

    // ResearchProject schema (schema.org/ResearchProject extension via
    // the Project type). Plus an Organization stamp and a sameAs back to
    // the main brand entry. Identifier ties citations to the URL.
    setOrCreateScript('ld-research-project', {
      '@context': 'https://schema.org',
      '@type': 'ResearchProject',
      '@id': `${RESEARCH_URL}#project`,
      name: 'The 24-Step Neuro-Physiological Framework',
      url: RESEARCH_URL,
      description: desc,
      sponsor: {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'ONDA Life',
        url: SITE_URL,
      },
      funder: {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'ONDA Life',
      },
      keywords: [
        'heart rate variability',
        'autonomic nervous system',
        'interoceptive accuracy',
        'BDNF',
        'cortisol awakening response',
        'EEG coherence',
        'default mode network',
        'salience network',
        'transient hypofrontality',
        'allostatic load',
        'digital therapeutics',
        'neurophysiology',
      ],
      about: [
        { '@type': 'Thing', name: 'Autonomic Homeostasis' },
        { '@type': 'Thing', name: 'Executive Function' },
        { '@type': 'Thing', name: 'Network Integration' },
        { '@type': 'Thing', name: 'Structural Neuroplasticity' },
        { '@type': 'Thing', name: 'Peak States' },
      ],
    })

    return () => {
      const home = document.getElementById('ld-research-project')
      if (home) home.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* ───────────── HERO ───────────── */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">
          [ ONDA_RESEARCH_NETWORK / OPEN_CALL ]
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          The ONDA Research Network
        </h1>
        <p className="mb-3 font-mono text-base text-white/80 md:text-lg">
          A partnership programme validating the 24-Step Neuro-Physiological
          Framework — from autonomic stability to high-density neural coherence.
        </p>
        <p className="font-mono text-sm text-white/55">
          We invite academic laboratories, clinical research groups and
          independent investigators to co-design longitudinal studies using
          the ONDA biofeedback platform as instrumentation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
          <a href="#mission" className="rounded border border-terminal-green/40 px-3 py-1.5 text-terminal-green hover:bg-terminal-green/10">Mission</a>
          <a href="#framework" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">24-Step Framework</a>
          <a href="#questions" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">Open Questions</a>
          <a href="#what-we-bring" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">Platform &amp; Data</a>
          <a href="#models" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">Collaboration Models</a>
          <a href="#ethics" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">Ethics &amp; Privacy</a>
          <a href="#contact" className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">Contact</a>
        </div>
      </header>

      {/* ───────────── 1. MISSION ───────────── */}
      <section id="mission" className="mt-14 scroll-mt-20">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 01 / MISSION ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">Why this programme exists</h2>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Consumer biofeedback applications routinely make implicit clinical
          claims — improved stress, attention, sleep, mood — without
          longitudinal biomarker validation. ONDA's mission is to invert
          that asymmetry: ship the product, then collaborate with
          independent researchers on rigorous, pre-registered evaluation.
        </p>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          The 24-Step Framework formalises a progression hypothesis — that
          stable autonomic homeostasis is a prerequisite for cognitive
          control, which in turn supports network integration, structural
          plasticity, and ultimately peak-state coherence. Each step in the
          framework binds to measurable biomarkers (HRV indices, plasma
          BDNF, cortisol dynamics, EEG coherence, fMRI network metrics).
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          We are looking for partners to operationalise that hypothesis:
          design the studies, define the cohorts, supervise the analyses,
          and co-author the results.
        </p>
      </section>

      {/* ───────────── 2. FRAMEWORK ───────────── */}
      <section id="framework" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 02 / FRAMEWORK ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          The 24-Step Framework at a glance
        </h2>
        <p className="mb-8 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Twenty-four sequential steps grouped into five blocks. Each block
          maps to a primary anatomical / functional target and a defined
          biomarker set. The mobile app currently ships an 8-level subset
          spanning every block; the remaining steps are activated as the
          longitudinal data supports each phase.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <BlockCard
            n="1"
            title="Autonomic Homeostasis"
            steps="Steps 1–6"
            anatomy="Brainstem · Spinal Cord · Vestibular nuclei"
            markers="HRV (rMSSD, SDNN, DFA α1) · VOR gain · interoceptive accuracy"
            summary="Establishing the physiological baseline. Vagal-tone optimisation, resonance breathing (0.1 Hz), CPG-driven motor coordination, defensive circuit regulation."
          />
          <BlockCard
            n="2"
            title="Executive Function & Social Intelligence"
            steps="Steps 7–12"
            anatomy="Prefrontal Cortex · Default Mode Network · Mirror neuron system"
            markers="Attention span · DMN deactivation efficiency · interpersonal neural synchronization (hyperscanning EEG/fNIRS)"
            summary="Sustained attention, working memory, cognitive flexibility. Transition into social-emotional regulation and group-state coupling."
          />
          <BlockCard
            n="3"
            title="Network Integration & Interoceptive Accuracy"
            steps="Steps 13–18"
            anatomy="Insula · Somatosensory cortex (S1/S2) · Thalamus · Salience/CEN/DMN"
            markers="Heartbeat-counting (Schandry task) · galvanic skin response · EEG Phase-Locking Value (PLV) · cross-network functional connectivity (fMRI)"
            summary="Visceral integration via the insular cortex. Tri-network metastability between DMN, Salience and CEN. Vagal-modulation of large-scale coherence."
          />
          <BlockCard
            n="4"
            title="Structural Neuroplasticity"
            steps="Steps 19–21"
            anatomy="Amygdala · HPA axis · Hippocampus · Prefrontal cortex"
            markers="Plasma BDNF · Cortisol Awakening Response (CAR) · IL-6, TNF-α · gray-matter density (structural MRI)"
            summary="Allostatic-load downregulation. LTP-driven amygdala remodelling. Epigenetic regulation of HPA-axis stress markers. Long-term cortical thickness changes."
          />
          <BlockCard
            n="5"
            title="Peak States & Transient Hypofrontality"
            steps="Steps 22–24"
            anatomy="Thalamo-cortical loops · Reticular formation · Whole-brain networks"
            markers="EEG gamma synchrony · Lempel-Ziv complexity (Brain Entropy index) · PET glucose metabolism · DMN decoupling (fMRI)"
            summary="Global phase coherence. Cross-frequency coupling. DMN suppression and transient hypofrontality consistent with Dietrich's flow-state framework."
          />
          <div className="rounded-lg border border-terminal-green/30 bg-terminal-green/5 p-5">
            <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green">
              SHIPPED IN MVP
            </div>
            <p className="font-mono text-sm leading-relaxed text-white/75">
              The user-facing app currently exposes Levels 1–8, covering
              Blocks 1, 2, 4 and 5 of the framework. Block 3 (Network
              Integration) is the natural next dependency — pending the
              longitudinal Eye-Scan v2 baseline that supplies the required
              biomarker pipeline.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── 3. OPEN QUESTIONS ───────────── */}
      <section id="questions" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 03 / OPEN_QUESTIONS ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Where partners help most
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Below are the specific empirical questions we cannot answer
          internally and that we are scoping with partner laboratories.
          Each item below is a candidate co-authored study.
        </p>

        <div className="space-y-4">
          <QuestionCard
            id="Q1"
            title="Cardiac-coherence dose-response in 30-day cohorts"
            body="Does daily 10-minute resonance-breathing (0.1 Hz) practice produce dose-dependent improvements in rMSSD and DFA α1 across naive vs experienced cohorts? Power calculation: n ≈ 60 per arm for medium effect size."
            collab="Ambulatory ECG validation against PPG-derived HRV is the natural co-investigator contribution."
          />
          <QuestionCard
            id="Q2"
            title="Eye-Scan as a non-contact ANS marker"
            body="How well do pupil oscillation amplitude and spontaneous blink rate (extracted via MediaPipe Tasks Vision from the front-facing phone camera) correlate with simultaneously recorded HRV indices and salivary cortisol? Cross-modal validation needed before clinical use."
            collab="Looking for partners with parallel pupillometry hardware (Tobii / Eyelink) to anchor camera-derived signal to gold-standard."
          />
          <QuestionCard
            id="Q3"
            title="Longitudinal BDNF response to 12-week practice protocols"
            body="Does sustained engagement with Block 4 (Structural Neuroplasticity) protocols elevate plasma BDNF beyond exercise-only controls? Pre-registered RCT design preferred."
            collab="Clinical-research partners with biobank infrastructure for plasma processing and BDNF assays."
          />
          <QuestionCard
            id="Q4"
            title="DMN dynamics during peak-state induction"
            body="Does the Block 5 protocol produce reliable DMN deactivation visible in fMRI? If so, does the deactivation profile differ from established meditation paradigms (focused attention, open monitoring, non-dual)?"
            collab="Imaging centres with 3T+ fMRI capacity and resting-state-network analysis pipelines."
          />
          <QuestionCard
            id="Q5"
            title="Interpersonal neural synchronisation in dyadic protocols"
            body="Block 2's social-intelligence steps invoke mirror-neuron-system activation. Does dyadic ONDA practice produce measurable hyperscanning EEG/fNIRS phase-locking that exceeds same-room non-practice controls?"
            collab="Hyperscanning laboratories with dual-EEG or fNIRS rigs."
          />
          <QuestionCard
            id="Q6"
            title="Burnout-risk prediction from longitudinal Life-Rhythm trajectories"
            body="The proprietary Life-Rhythm algorithm fuses HRV + sleep + motion + Eye-Scan + subjective check-ins into a 24-hour personal energy curve. We hypothesise that multi-week trajectory drift predicts clinical burnout markers (Maslach Burnout Inventory, salivary cortisol slope) 14+ days before clinical onset."
            collab="Occupational-health partners with longitudinal cohorts of healthcare workers, first-responders, or shift-workers."
          />
        </div>
      </section>

      {/* ───────────── 4. WHAT WE BRING ───────────── */}
      <section id="what-we-bring" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 04 / PLATFORM &amp; DATA ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          What ONDA brings to the collaboration
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          ONDA is not a research-only platform — it is a shipped consumer
          product with continuous data flow. Partners gain access to a
          mature instrumentation stack and a recruited user base, without
          building anything from scratch.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <BringCard
            title="Multi-channel biosignal capture"
            body="Three independent heart-rate ingestion channels (Apple Watch / WCSession, BLE GATT chest-straps and rings, Android notification-listener ingestion from third-party fitness apps). Source arbitration in useVitals.ts picks the highest-fidelity signal automatically."
          />
          <BringCard
            title="Touchless ANS measurement (Eye-Scan)"
            body="MediaPipe Tasks Vision pipeline extracts pupil oscillation and blink dynamics from the front-facing camera. 30-second protocol returns stress / energy / Life-Rhythm-aligned recommendations. No additional hardware required for participants."
          />
          <BringCard
            title="Edge-computed sensor fusion"
            body="HR + HRV (rMSSD, SDNN, DFA α1) + sleep (HealthKit / Health Connect) + motion + Eye-Scan ANS markers + subjective check-in fuse client-side into Stress and Energy scores plus a personal Life-Rhythm curve. Raw high-frequency signals never leave the device; only derived metrics are persisted."
          />
          <BringCard
            title="Validated audio-guided practice library"
            body="Library of 5–30 minute audio practices mapped to Blocks 1–5. Adaptive cueing engine (AdaptivePracticeModal) adjusts pace and depth in real time from client-side HRV computation. Practice-completion telemetry pre-aggregated for between-cohort analysis."
          />
          <BringCard
            title="Cross-platform deployment"
            body="iOS (Capacitor 7 + Apple Watch WatchKit companion app), Android (WebView + Kotlin Health Connect + BLE + foreground service). Five-language UI (EN, ES, RU, UK, ZH) — cross-cultural cohort design becomes a possibility, not a logistical block."
          />
          <BringCard
            title="GDPR-aligned backend"
            body="Supabase PostgreSQL with Row-Level Security per auth.uid(). Twenty managed migrations, deterministic schema. delete-account Edge Function performs cascading wipe for participant withdrawal (GDPR Article 17 right-to-erasure)."
          />
        </div>
      </section>

      {/* ───────────── 5. COLLABORATION MODELS ───────────── */}
      <section id="models" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 05 / COLLABORATION_MODELS ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Three ways to collaborate
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          We are flexible on collaboration structure — the choice depends
          on the question, the cohort, and partner institutional
          requirements. The three frames below cover most cases.
        </p>

        <div className="space-y-4">
          <ModelCard
            n="A"
            title="Co-designed pre-registered study"
            body="Partner laboratory leads protocol design, IRB / ethics submission, and statistical analysis. ONDA provides instrumentation, recruitment funnel, and engineering support for any custom telemetry. Publication co-authored. ONDA does not gate negative findings — pre-registration includes the analysis plan."
            bestFor="Established research groups with IRB infrastructure and an existing cohort or recruitment pipeline."
          />
          <ModelCard
            n="B"
            title="Data-access partnership"
            body="ONDA shares pseudonymised, opt-in aggregated telemetry from consenting users (HRV summary metrics, practice-completion patterns, Eye-Scan-derived ANS markers) under a Data Use Agreement. Partner runs analysis independently. Outputs cite ONDA as data source; co-authorship case-by-case."
            bestFor="Groups doing secondary analysis, methodology papers, or feasibility studies before larger-cohort work."
          />
          <ModelCard
            n="C"
            title="Joint grant application"
            body="ONDA acts as the technology / industry partner on EU Horizon, Eureka / Eurostar, Marie Curie, NIH or national-fund consortia. Partner institution is the academic PI; ONDA contributes platform, technical leadership, and a dedicated work-package on instrumentation and data engineering."
            bestFor="Established laboratories scoping a 2–5 year programme who need an industry technology partner with shipped product."
          />
        </div>
      </section>

      {/* ───────────── 6. VALIDATION PIPELINE ───────────── */}
      <section id="pipeline" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 06 / VALIDATION_PIPELINE ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Biomarker validation roadmap
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          The framework's clinical defensibility rests on a small set of
          biomarker chains. Each chain begins with a passively-collected
          ONDA signal and ends with an established clinical reference. We
          are actively scoping work-packages against each chain.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-terminal-green/70">
                <th className="px-2 py-2">Chain</th>
                <th className="px-2 py-2">ONDA signal</th>
                <th className="px-2 py-2">Reference / gold-standard</th>
                <th className="px-2 py-2">Block</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">HRV-1</td>
                <td className="px-2 py-2">rMSSD from Apple Watch / BLE</td>
                <td className="px-2 py-2">Polar H10 ambulatory ECG</td>
                <td className="px-2 py-2">1</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">HRV-2</td>
                <td className="px-2 py-2">DFA α1 from continuous PPG</td>
                <td className="px-2 py-2">Holter-derived nonlinear HRV</td>
                <td className="px-2 py-2">1, 3</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">ANS-1</td>
                <td className="px-2 py-2">Eye-Scan pupil oscillation</td>
                <td className="px-2 py-2">Tobii / EyeLink pupillometry</td>
                <td className="px-2 py-2">1, 3</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">INT-1</td>
                <td className="px-2 py-2">Interoceptive accuracy via in-app heartbeat-counting</td>
                <td className="px-2 py-2">Lab-administered Schandry task</td>
                <td className="px-2 py-2">3</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">HPA-1</td>
                <td className="px-2 py-2">Sleep-rhythm-derived cortisol prediction</td>
                <td className="px-2 py-2">Salivary cortisol slope, CAR</td>
                <td className="px-2 py-2">1, 4</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">PLAS-1</td>
                <td className="px-2 py-2">12-week practice-adherence telemetry</td>
                <td className="px-2 py-2">Plasma BDNF ELISA</td>
                <td className="px-2 py-2">4</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-2 py-2">EEG-1</td>
                <td className="px-2 py-2">Practice-induced HRV state shifts</td>
                <td className="px-2 py-2">Resting-state EEG coherence (PLV, gamma synchrony)</td>
                <td className="px-2 py-2">3, 5</td>
              </tr>
              <tr>
                <td className="px-2 py-2">fMRI-1</td>
                <td className="px-2 py-2">Block-5 protocol completion telemetry</td>
                <td className="px-2 py-2">DMN deactivation (resting-state fMRI)</td>
                <td className="px-2 py-2">5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────────── 7. ETHICS ───────────── */}
      <section id="ethics" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 07 / ETHICS &amp; PRIVACY ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Data governance, ethics and participant rights
        </h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70">
          <p>
            <span className="text-terminal-green">▸ GDPR-aligned by default.</span> The
            ONDA backend (Supabase, EU region) enforces Row-Level Security
            per auth.uid(). Participants exercise right-to-access,
            right-to-rectification and right-to-erasure through the in-app
            account-management flow. The delete-account Edge Function
            performs cascading wipe across user_profiles, practice_rewards,
            user_progress and the auth record.
          </p>
          <p>
            <span className="text-terminal-green">▸ Edge-computed sensor fusion.</span> Raw
            high-frequency biosignals (HR samples, HRV beat intervals,
            Eye-Scan video frames) are processed client-side and discarded.
            Only derived scores (Stress, Energy, Life-Rhythm,
            practice-completion telemetry) are persisted to the backend.
            The Eye-Scan video stream never leaves the device.
          </p>
          <p>
            <span className="text-terminal-green">▸ Opt-in research data sharing.</span> Any
            participation in a research study is gated by an explicit,
            study-specific consent screen presented inside the app. Consent
            is revocable at any time; revocation triggers immediate
            withdrawal of subsequent data from the partner's data feed.
          </p>
          <p>
            <span className="text-terminal-green">▸ IRB / ethics-board responsibility.</span> ONDA
            does not act as an IRB. Studies designed under Collaboration
            Model A (co-designed pre-registered) require ethics approval
            from the partner institution's review board before any
            study-specific data flow begins.
          </p>
          <p>
            <span className="text-terminal-green">▸ Negative-result publishing.</span> All
            pre-registered studies are published regardless of outcome —
            including negative results. ONDA does not gate manuscripts on
            commercial impact.
          </p>
        </div>
      </section>

      {/* ───────────── 8. TEAM ───────────── */}
      <section id="team" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 08 / TEAM ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">Who you will work with</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70">
          <p>
            <span className="text-white">Yakiv Bilenko</span> — founder,
            product and technical lead. Authored the 24-Step framework,
            owns the engineering of the multi-channel HR pipeline, the
            Eye-Scan computer-vision module and the Life-Rhythm fusion
            algorithm.
            {' '}
            <a className="text-terminal-green hover:underline" href="https://www.linkedin.com/in/yamius/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
          <p className="text-white/55">
            Clinical advisory board and partner-laboratory PIs are being
            announced as Model A and Model C collaborations are formalised.
            Open spots remain for advisors in psychophysiology, clinical
            neuroscience, neuroendocrinology and biomedical signal
            processing — see contact below.
          </p>
        </div>
      </section>

      {/* ───────────── 9. REFERENCES ───────────── */}
      <section id="references" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 09 / REFERENCES ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Framework backbone — selected citations
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          The framework is grounded in published neurophysiology. The
          short list below cites the canonical works for each block; the
          full bibliography is provided to partners under DUA.
        </p>
        <ul className="space-y-3 font-mono text-xs leading-relaxed text-white/60">
          <li>
            <span className="text-terminal-green">Block 1 — Autonomic.</span> Thayer JF &amp; Lane RD (2009).
            Claustrophobic to integrative: heart rate variability and the
            neurovisceral integration model. <em>Neurosci Biobehav Rev</em>, 33(2), 81–88.
          </li>
          <li>
            <span className="text-terminal-green">Block 1 — Resonance breathing.</span> Lehrer PM &amp; Gevirtz R (2014).
            Heart rate variability biofeedback: how and why does it work? <em>Front Psychol</em>, 5, 756.
          </li>
          <li>
            <span className="text-terminal-green">Block 2 — Executive networks.</span> Menon V (2011).
            Large-scale brain networks and psychopathology: a unifying triple network model.
            {' '}<em>Trends Cogn Sci</em>, 15(10), 483–506.
          </li>
          <li>
            <span className="text-terminal-green">Block 3 — Interoception.</span> Garfinkel SN, Seth AK, Barrett AB, Suzuki K, Critchley HD (2015).
            Knowing your own heart: distinguishing interoceptive accuracy from interoceptive awareness.
            {' '}<em>Biol Psychol</em>, 104, 65–74.
          </li>
          <li>
            <span className="text-terminal-green">Block 3 — Default Mode Network.</span> Raichle ME (2015).
            The brain's default mode network. <em>Annu Rev Neurosci</em>, 38, 433–447.
          </li>
          <li>
            <span className="text-terminal-green">Block 4 — Allostasis &amp; BDNF.</span> McEwen BS (2007).
            Physiology and neurobiology of stress and adaptation: central role of the brain.
            {' '}<em>Physiol Rev</em>, 87(3), 873–904.
          </li>
          <li>
            <span className="text-terminal-green">Block 5 — Flow / hypofrontality.</span> Dietrich A (2004).
            Neurocognitive mechanisms underlying the experience of flow. <em>Conscious Cogn</em>, 13(4), 746–761.
          </li>
          <li>
            <span className="text-terminal-green">Block 5 — Brain entropy.</span> Carhart-Harris RL et al. (2014).
            The entropic brain: a theory of conscious states informed by neuroimaging research with psychedelic drugs.
            {' '}<em>Front Hum Neurosci</em>, 8, 20.
          </li>
          <li>
            <span className="text-terminal-green">Eye-Scan / pupillometry.</span> Joshi S, Li Y, Kalwani RM, Gold JI (2016).
            Relationships between pupil diameter and neuronal activity in the locus coeruleus, colliculi, and cingulate cortex.
            {' '}<em>Neuron</em>, 89(1), 221–234.
          </li>
        </ul>
      </section>

      {/* ───────────── 10. CONTACT ───────────── */}
      <section id="contact" className="mt-16 scroll-mt-20 border-t border-white/10 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">[ 10 / CONTACT ]</div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          Start a conversation
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Send a short note describing your laboratory's focus area, the
          question you want to investigate, and the collaboration model
          that fits your institutional setup. We respond within five
          working days.
        </p>
        <div className="rounded-lg border border-terminal-green/40 bg-terminal-green/5 p-6">
          <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/70">RESEARCH ENQUIRIES</div>
          <a
            href={`mailto:${RESEARCH_EMAIL}?subject=ONDA%20Research%20Network%20%E2%80%94%20Partnership%20enquiry`}
            className="font-mono text-lg text-white hover:text-terminal-green md:text-xl"
          >
            {RESEARCH_EMAIL}
          </a>
          <p className="mt-4 font-mono text-xs text-white/55">
            For grant-application work-packages (Model C), please attach
            the call reference, deadline and the work-package you want
            ONDA to lead.
          </p>
        </div>

        {/* Documentation pointer — the engineering / clinical-research
            documentation deck (PDF + supplementary materials) lives at
            /p/info on the main site. Surfaced separately from the
            mailto so reviewers landing here can grab the full doc
            without needing to email first. */}
        <div className="mt-6 rounded-lg border border-white/15 bg-white/[0.02] p-6">
          <div className="mb-2 font-mono text-xs tracking-widest text-white/55">TECHNICAL DOCUMENTATION</div>
          <a
            href={TECHNICAL_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-base text-white hover:text-terminal-green md:text-lg break-all"
          >
            {TECHNICAL_DOCS_URL}
          </a>
          <p className="mt-4 font-mono text-xs text-white/55">
            Engineering &amp; clinical-research deck — Technical
            Architecture, Product Ecosystem and the 24-Step
            Neuro-Physiological Framework. Reviewers and prospective
            partners should consult this document before initial
            contact.
          </p>
        </div>

        <p className="mt-12 text-center font-mono text-xs text-white/40">
          ONDA Life · 2026 · Mapping the path from autonomic stability to high-density neural coherence
        </p>
      </section>
    </main>
  )
}

/* ────────────────────── Sub-components ────────────────────── */

function BlockCard({
  n,
  title,
  steps,
  anatomy,
  markers,
  summary,
}: {
  n: string
  title: string
  steps: string
  anatomy: string
  markers: string
  summary: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="font-mono text-xs tracking-widest text-terminal-green/70">BLOCK {n}</div>
        <div className="font-mono text-xs text-white/40">{steps}</div>
      </div>
      <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="mb-3 font-mono text-xs leading-relaxed text-white/70">{summary}</p>
      <dl className="space-y-1.5 font-mono text-[11px]">
        <div>
          <dt className="inline text-terminal-green/60">Anatomy:</dt>{' '}
          <dd className="inline text-white/60">{anatomy}</dd>
        </div>
        <div>
          <dt className="inline text-terminal-green/60">Biomarkers:</dt>{' '}
          <dd className="inline text-white/60">{markers}</dd>
        </div>
      </dl>
    </div>
  )
}

function QuestionCard({
  id,
  title,
  body,
  collab,
}: {
  id: string
  title: string
  body: string
  collab: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="rounded bg-terminal-green/15 px-2 py-0.5 font-mono text-xs text-terminal-green">{id}</span>
        <h3 className="text-base font-bold text-white md:text-lg">{title}</h3>
      </div>
      <p className="mb-2 font-mono text-sm leading-relaxed text-white/70">{body}</p>
      <p className="font-mono text-xs italic text-white/50">{collab}</p>
    </div>
  )
}

function BringCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
      <p className="font-mono text-xs leading-relaxed text-white/65">{body}</p>
    </div>
  )
}

function ModelCard({
  n,
  title,
  body,
  bestFor,
}: {
  n: string
  title: string
  body: string
  bestFor: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="rounded border border-terminal-green/40 px-2 py-0.5 font-mono text-xs text-terminal-green">
          MODEL {n}
        </span>
        <h3 className="text-base font-bold text-white md:text-lg">{title}</h3>
      </div>
      <p className="mb-3 font-mono text-sm leading-relaxed text-white/70">{body}</p>
      <p className="font-mono text-xs italic text-white/50">
        <span className="not-italic text-terminal-green/60">Best for:</span> {bestFor}
      </p>
    </div>
  )
}
