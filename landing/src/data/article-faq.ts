/**
 * FAQ question/answer pairs per article slug.
 *
 * Single source of truth for both:
 *   - the FAQPage JSON-LD emitted at build time (scripts/meta-inject.ts)
 *   - the visible "Common Questions" section on the article page
 *     (src/pages/ArticlePage.tsx) — surfaces the Q&A as crawlable /
 *     AI-citable page text, not just structured data.
 */
export const ARTICLE_FAQ: Record<string, { question: string; answer: string }[]> = {
  "acetylcholine-lens-neuro-mechanics": [
    {
      question: "What does acetylcholine do for focus?",
      answer:
        "Acetylcholine acts as the brain\u2019s attention lens. When the basal forebrain releases it, neurons handling your target become hyper-sensitive while everything else is dampened \u2014 raising the signal-to-noise ratio of cognition. It does not carry information itself; it sharpens which signals get amplified.",
    },
    {
      question: "Why does my focus feel blurry even when I am rested?",
      answer:
        "A blurry attention lens is usually a calibration problem, not fatigue. The three common causes are choline scarcity (not enough precursor to synthesise acetylcholine), receptor desensitisation from caffeine or nicotine overdrive, and poor electrical conductivity from sodium, potassium and calcium imbalance.",
    },
    {
      question: "How can I sharpen acetylcholine-driven focus naturally?",
      answer:
        "Use a visual anchor \u2014 fix your gaze on one point for 2\u20133 minutes before deep work to lock the lens onto a single target. Keep choline precursor intake consistent through food, and use a short burst of strong inhales to prime arousal before a demanding task.",
    },
  ],
  "adaptation-hack-range-fractionation": [
    {
      question: "Why do I stop seeing results from the same workout?",
      answer:
        "When you train, eat or recover at one fixed intensity, the system adapts to that narrow range and receptors desensitise \u2014 a state of homeostatic stagnation. The fix is not more of the same; it is widening the range the system is exposed to.",
    },
    {
      question: "What is range fractionation?",
      answer:
        "Range fractionation is distributing a stimulus across extreme ends of a range instead of a single average point \u2014 ultra-heavy and light loads, hot and cold exposure, micro-doses and macro-loading. The constant recalibration forces continued adaptation and bypasses plateaus.",
    },
    {
      question: "How do I apply range fractionation in practice?",
      answer:
        "Never run two identical days: follow high load with low load and high recovery. Alternate sauna and cold to train the full vascular range. Combine small daily stimulus doses with one large weekly session. Track HRV \u2014 rising HRV alongside rising performance means the protocol is working.",
    },
  ],
  "ai-biomarker-tracking-predictive": [
    {
      question: "Can wearables predict illness before symptoms appear?",
      answer:
        "Yes. Resting heart rate, HRV and temperature often drift 24\u201372 hours before you feel sick. AI-driven analysis detects this micro-drift against your personal baseline and flags the anomaly early, while a corrective intervention is still cheap.",
    },
    {
      question: "What is the difference between reactive and predictive health tracking?",
      answer:
        "Reactive tracking logs what already happened \u2014 a static snapshot you review after the fact. Predictive tracking uses historical biomarker data and machine learning to forecast future states, so you intervene before burnout or illness rather than after.",
    },
  ],
  "biological-latency-optimizing-system-ping": [
    {
      question: "What is biological latency?",
      answer:
        "Biological latency is the delay between a stimulus arriving and your nervous system producing a processed response \u2014 your internal \"ping rate\". High latency shows up as slow reactions, decision ghosting and a feeling of always being a step behind.",
    },
    {
      question: "How do I improve my reaction time and processing speed?",
      answer:
        "Three levers: protect myelin integrity with consistent deep sleep (myelin sets raw conduction speed), use alpha-synchronisation breathing to lower neural jitter, and train predictive coding so the brain pre-loads likely outcomes instead of computing them from scratch.",
    },
  ],
  "chm-continuous-hormone-monitoring": [
    {
      question: "What is continuous hormone monitoring?",
      answer:
        "Continuous hormone monitoring (CHM) replaces occasional static bloodwork with a dynamic, ongoing read of your internal chemistry \u2014 tracking patterns like the daily cortisol curve and cyclical testosterone output rather than a single isolated data point.",
    },
    {
      question: "How can I track my cortisol rhythm without constant lab tests?",
      answer:
        "Cortisol follows a predictable daily curve \u2014 a sharp morning rise and a gradual evening fall. You can read its pattern through proxy signals: wake energy, afternoon dips, sleep onset and HRV. A disrupted curve (flat mornings, wired evenings) is the signal to recalibrate.",
    },
    {
      question: "How do I optimise my performance window with hormone data?",
      answer:
        "Map demanding cognitive and physical work onto your natural hormonal peaks rather than fighting them. Schedule high-stakes effort when cortisol and testosterone output is highest, and protect recovery windows when they fall \u2014 this prevents the hormonal crash that follows chronic mistiming.",
    },
  ],
  "co2-tolerance-expanding-oxygen-limit": [
    {
      question: "Is the urge to breathe caused by low oxygen?",
      answer:
        "No. The air hunger you feel is driven mainly by rising CO2, not falling oxygen. Chemoreceptors trigger breath urgency long before oxygen is actually low \u2014 which means CO2 tolerance, not lung capacity, is usually the real limiter.",
    },
    {
      question: "What is the BOLT score?",
      answer:
        "The BOLT (Body Oxygen Level Test) measures CO2 tolerance: after a normal exhale you time how long until the first definite urge to breathe. A low score signals oversensitive chemoreceptors; a rising score over weeks of training reflects calmer, more efficient breathing.",
    },
    {
      question: "How do I improve CO2 tolerance?",
      answer:
        "Train it gradually with box breathing to calibrate the chemoreceptors, then progress to structured apnea tables as a controlled stress test. Higher CO2 tolerance also improves oxygen delivery via the Bohr effect \u2014 hemoglobin releases oxygen more readily into the tissues.",
    },
  ],
  "cpg-neural-autopilot": [
    {
      question: "What are central pattern generators?",
      answer:
        "Central pattern generators (CPGs) are circuits in the spinal cord that produce rhythmic movement \u2014 walking, running, swimming \u2014 without continuous input from the brain. They act as locomotion microcontrollers, freeing cortical bandwidth for higher-order thought.",
    },
    {
      question: "How do I make movement feel effortless?",
      answer:
        "Hand rhythmic movement back to the CPGs instead of micromanaging it consciously. A cross-lateral reset re-establishes clean left-right coordination, cadence entrainment locks a steady rhythm, and sensory override (varying terrain or surface) retunes the pattern \u2014 turning effortful motion into flow.",
    },
  ],
  "dopamine-stacking-preventing-circuit-overload": [
    {
      question: "What is dopamine stacking?",
      answer:
        "Dopamine stacking is layering several stimulating inputs at once \u2014 music plus scrolling plus snacking plus a screen. Each adds a spike, and together they overdrive the reward circuit, flattening your baseline so ordinary tasks start to feel grey and effortful.",
    },
    {
      question: "How do I prevent dopamine burnout?",
      answer:
        "Protect the baseline rather than chasing spikes. Monotask to give the reward circuit one input at a time, run periodic \"data fasts\" from hyper-stimulating inputs to let receptors resensitise, and use cold exposure to raise baseline dopamine slowly and cleanly instead of with a crash-prone spike.",
    },
  ],
  "electric-medicine-neuromodulation": [
    {
      question: "What is neuromodulation?",
      answer:
        "Neuromodulation is the use of targeted electrical or sensory signals to shift the activity of the nervous system \u2014 calming an overactive stress state, sharpening focus, or improving sleep. It works with the body\u2019s existing electrical bus rather than through drugs.",
    },
    {
      question: "How can I stimulate the vagus nerve?",
      answer:
        "The vagus nerve responds to both natural and device-based input. Slow extended exhales, humming, gargling and cold exposure all activate it without hardware; dedicated vagus-nerve stimulators apply a gentle electrical signal. Either way the goal is a shift into the parasympathetic recovery state.",
    },
    {
      question: "Is tDCS safe to use?",
      answer:
        "Transcranial direct current stimulation uses very low current and is generally well tolerated in research settings, but it is not a casual consumer tool. Dose, electrode placement and timing matter, and it should be approached cautiously and ideally with informed guidance.",
    },
  ],
  "endocrine-social-drive-oxytocin-testosterone": [
    {
      question: "How do oxytocin and testosterone shape social behaviour?",
      answer:
        "They run two complementary protocols. Oxytocin is the trust code \u2014 it builds belonging, safety and connection. Testosterone is the status code \u2014 it drives assertiveness and presence. Charismatic, grounded social behaviour comes from balancing the two, not maxing either.",
    },
    {
      question: "How do I build natural presence and charisma?",
      answer:
        "Presence is largely physiological. Steady, calm eye contact calibrates the trust signal, lower and slower vocal resonance projects status without aggression, and appropriate, confident body language reinforces both \u2014 letting others\u2019 nervous systems read you as safe and grounded.",
    },
  ],
  "energy-governor-tsh": [
    {
      question: "What does TSH tell you about your metabolism?",
      answer:
        "TSH (thyroid-stimulating hormone) is the signal that sets your metabolic clock speed. It governs how fast cells produce energy \u2014 affecting body temperature, cognitive sharpness and stamina. A drifting TSH often shows up first as brain fog and cold extremities.",
    },
    {
      question: "Can stress cause low thyroid function and brain fog?",
      answer:
        "Yes. Chronic stress and elevated cortisol can suppress thyroid signalling and the conversion of thyroid hormone to its active form \u2014 an effect this article calls \"underclocking\". The result is fatigue and brain fog even when standard markers look borderline-normal.",
    },
    {
      question: "How do I support thyroid function naturally?",
      answer:
        "Ensure adequate iodine and selenium, the raw materials for thyroid hormone. Track basal body temperature as a low-cost proxy for metabolic rate, and address chronic stress directly \u2014 because cortisol control is often the missing lever behind a sluggish thyroid.",
    },
  ],
  "energy-sensor-leptin": [
    {
      question: "What is leptin resistance?",
      answer:
        "Leptin is the hormone fat cells use to report energy reserves to the brain. In leptin resistance the brain stops \"hearing\" that signal \u2014 so it perceives scarcity despite full stores, driving persistent hunger, cravings and a stalled metabolism.",
    },
    {
      question: "How do I restore leptin sensitivity?",
      answer:
        "Give the sensor quiet windows: a consistent overnight fasting window so leptin signalling can reset, protein at the start of meals to blunt the spike, and morning light plus solid sleep \u2014 leptin sensitivity is tightly tied to circadian rhythm. Cold exposure adds a further reset.",
    },
  ],
  "femtech-cyclical-architecture": [
    {
      question: "What is cycle syncing?",
      answer:
        "Cycle syncing means aligning training, nutrition and workload to the four phases of the roughly 28-day hormonal cycle. Instead of treating the cycle as noise, it treats each phase as a distinct operating mode with its own strengths.",
    },
    {
      question: "How do hormones change across the menstrual cycle?",
      answer:
        "Estrogen and progesterone rise and fall through four phases, shifting energy, strength, insulin sensitivity and mood. Higher-estrogen phases favour intensity and social output; later phases favour steadier effort and recovery. Tracking basal body temperature helps map where you are.",
    },
  ],
  "glymphatic-flush-clearing-neural-cache": [
    {
      question: "What is the glymphatic system?",
      answer:
        "The glymphatic system is the brain\u2019s waste-clearance network. During deep sleep, cerebrospinal fluid flushes through brain tissue and carries away metabolic by-products \u2014 the equivalent of clearing a cache. Poor deep sleep leaves that waste uncleared.",
    },
    {
      question: "How do I improve glymphatic clearance overnight?",
      answer:
        "Three levers: sleep on your side to assist gravitational drainage, keep the room cool so the brain can complete its cool-down, and avoid an insulin spike late at night \u2014 a heavy late meal blunts the deep-sleep flush. Protecting deep sleep is the foundation of all three.",
    },
  ],
  "hpa-axis-control-cortisol-aggression": [
    {
      question: "What is the HPA axis?",
      answer:
        "The HPA (hypothalamic-pituitary-adrenal) axis is the body\u2019s stress-response chain. It releases cortisol to mobilise energy under threat. The system is healthy when it switches off cleanly afterwards \u2014 problems come from cortisol that stays elevated.",
    },
    {
      question: "How do I calm a cortisol spike quickly?",
      answer:
        "Use the physiological sigh \u2014 a double inhale through the nose followed by a long, slow exhale. It is the fastest physiological brake on acute stress arousal, forcing a rapid shift from sympathetic activation back toward the recovery state.",
    },
    {
      question: "How do I stop reacting with anger under stress?",
      answer:
        "Reactive aggression is undischarged stress load. Intercept it with cognitive reframing \u2014 relabelling the trigger before it escalates \u2014 and discharge accumulated static load through short bursts of physical effort, so the charge does not surface as a hair-trigger response.",
    },
  ],
  "interoceptive-precision-sensor-calibration": [
    {
      question: "What is interoception?",
      answer:
        "Interoception is the sense of your body\u2019s internal state \u2014 heartbeat, breath, hunger, tension, temperature. It is the raw data stream beneath emotion and intuition. Most people read it as blurry static rather than a clear signal.",
    },
    {
      question: "How do I improve interoceptive awareness?",
      answer:
        "Train resolution deliberately: pair attention with objective HRV data to calibrate what you feel against what is measured, run a slow, structured body scan to map sensations, and use graded interoceptive exposure \u2014 noticing uncomfortable internal signals without reacting \u2014 to widen tolerance.",
    },
  ],
  "metabolic-redundancy-hybrid-power-architecture": [
    {
      question: "What is metabolic flexibility?",
      answer:
        "Metabolic flexibility is the ability to switch cleanly between fuel sources \u2014 glucose for high-octane bursts and fat or ketones for stable baseline energy. A flexible system has a redundancy layer, so a dip in one fuel does not crash performance.",
    },
    {
      question: "How do I stop the afternoon energy crash?",
      answer:
        "Crashes come from running on glucose alone. Build dual-fuel capacity with periodic glycogen-depletion cycles that train fat-burning, order meals to smooth the glucose curve (protein and fibre before starch), and add mild thermal stress \u2014 together they remove the spike-and-crash pattern.",
    },
  ],
  "muscle-metabolic-marker": [
    {
      question: "Why is muscle considered a marker of biological age?",
      answer:
        "Muscle is your largest metabolic organ. It acts as a glucose sink that buffers blood sugar, secretes signalling molecules called myokines, and its strength \u2014 grip strength in particular \u2014 is one of the strongest physical predictors of biological age and healthspan.",
    },
    {
      question: "What are myokines?",
      answer:
        "Myokines are signalling molecules released by muscle during contraction. They communicate with the brain, immune system and other organs \u2014 influencing neuroplasticity, fat metabolism and inflammation. This is why muscle contraction acts almost like running biological code system-wide.",
    },
    {
      question: "How do I train muscle as a longevity marker?",
      answer:
        "Track grip strength as a simple calibration metric, use brief high-intensity intervals to drive metabolic adaptation, and prioritise recovery \u2014 muscle benefit comes from the repair phase, not the load alone. Consistency over intensity is what compounds.",
    },
  ],
  "neural-entrainment-meditation-2": [
    {
      question: "What is neural entrainment?",
      answer:
        "Neural entrainment is nudging brainwave activity toward a target frequency using a rhythmic external stimulus \u2014 sound, light or pulsed signal. The brain tends to fall into step with the rhythm, a phenomenon known as the frequency-following response.",
    },
    {
      question: "Do binaural beats actually work?",
      answer:
        "Binaural beats can shift the dominant EEG frequency via the frequency-following response, with effects that vary between individuals. Closed-loop systems \u2014 which read your brain state in real time and adapt the stimulus \u2014 are more reliable than fixed, open-loop tracks.",
    },
  ],
  "neural-optimizer-estrogen": [
    {
      question: "How does estrogen affect the brain?",
      answer:
        "Estrogen is a powerful neural optimiser. It supports hippocampal architecture and memory, promotes synaptic plasticity, improves cerebral blood flow and acts as an anti-inflammatory and metabolic guardian for neural tissue \u2014 well beyond its reproductive role.",
    },
    {
      question: "Why does cognition change when estrogen drops?",
      answer:
        "As estrogen declines \u2014 for example through perimenopause \u2014 its protective and metabolic support for the brain weakens, which can surface as brain fog, slower recall and lower stress resilience. The hardware is intact; the optimiser signal has faded.",
    },
    {
      question: "How can I support estrogen-related brain health?",
      answer:
        "Resistance training drives plasticity and supports hormonal and metabolic health, omega-3 fatty acids provide an anti-inflammatory shield for neural tissue, and dietary phytoestrogens may offer mild support. Significant symptoms warrant a conversation with a clinician.",
    },
  ],
  "neural-signal-to-noise-cleaning-system-channel": [
    {
      question: "What causes mental noise and scattered thinking?",
      answer:
        "Scattered thinking is a low signal-to-noise ratio in the brain\u2019s electrical channel. It rises when the inhibitory buffer (GABA) is weak, the thalamic gate lets in irrelevant input, and the alpha-shield that suppresses distraction is thin \u2014 leaving cognitive static and jitter.",
    },
    {
      question: "How do I reduce cognitive noise and think more clearly?",
      answer:
        "Strengthen the damping system: use slow inhibitory breathwork to raise calming tone, practise sensory gating by deliberately reducing competing inputs, and train an alpha-dominant state \u2014 relaxed, alert focus \u2014 which acts as an active noise-cancellation layer for thought.",
    },
  ],
  "phase-locked-acoustic-sleep": [
    {
      question: "What is phase-locked acoustic stimulation?",
      answer:
        "It is the delivery of quiet sound pulses precisely timed to the slow brainwaves of deep sleep. By syncing the stimulus to the wave\u2019s phase, the technique reinforces the wave and amplifies deep-sleep amplitude without waking you.",
    },
    {
      question: "Can sound actually improve deep sleep quality?",
      answer:
        "Yes. Stimulation phase-locked to slow-wave sleep can increase delta-wave amplitude, which is linked to better memory consolidation and physical recovery. The key is precise timing \u2014 the sound must lock to the wave\u2019s phase, which is why real-time EEG matters.",
    },
  ],
  "physiological-concentration-flow-state-hardwired": [
    {
      question: "Is concentration a matter of willpower?",
      answer:
        "No. Concentration is a physiological lock state, not a moral effort. It appears when three neurochemicals align \u2014 norepinephrine for arousal, acetylcholine for selection, and dopamine for reward. When the triad is aligned, focus feels automatic; when it is not, willpower cannot force it.",
    },
    {
      question: "How do I get into a flow state on demand?",
      answer:
        "Engineer the inputs rather than forcing the output: narrow the visual field (visual tunnelling) to cue selective attention, use mild CO2 loading through slow breathing to steady arousal, and prime electrolytes so neural firing stays clean. The triad then locks far more reliably.",
    },
  ],
  "senolytic-high-dosing-longevity": [
    {
      question: "What are senolytics?",
      answer:
        "Senolytics are compounds that selectively clear senescent \"zombie\" cells \u2014 cells that have stopped dividing but stay metabolically active and leak inflammatory signals that damage surrounding tissue and drive aging.",
    },
    {
      question: "What is the \"hit and run\" senolytic protocol?",
      answer:
        "Because senescent cells are slow to re-accumulate, senolytics are studied as intermittent high-dose pulses \u2014 a short \"hit\" followed by a long break \u2014 rather than daily dosing. The pulse clears the cells; the gap avoids constant exposure.",
    },
    {
      question: "Are senolytics safe to take?",
      answer:
        "Senolytic dosing is still an emerging research area. Agents such as quercetin, fisetin and dasatinib are under active study, and protocols, doses and long-term safety are not settled. This is firmly a topic to approach with medical supervision, not self-experimentation.",
    },
  ],
  "system-stability-serotonin": [
    {
      question: "How do I raise serotonin naturally?",
      answer:
        "Three reliable levers: morning sunlight exposure as a photic trigger, a healthy gut \u2014 since most serotonin precursor activity happens there \u2014 supported by prebiotic fibre, and upright, open posture, which feeds the sense of stable status that underlies serotonin balance.",
    },
    {
      question: "Is most serotonin made in the gut?",
      answer:
        "Yes \u2014 roughly 90% of the body\u2019s serotonin is produced in the gut, not the brain. This is why gut health and microbiome quality have a direct line to mood stability, and why the article treats the gut as the \"serotonin server\".",
    },
    {
      question: "How does posture affect mood?",
      answer:
        "Posture is a two-way signal. Upright, expanded posture feeds back to the nervous system as a cue of stable status and safety, supporting serotonin balance and calm confidence \u2014 while a chronically collapsed posture reinforces the opposite state.",
    },
  ],
  'molecular-psychology-hormonal-firmware': [
    {
      question: 'What is molecular psychology?',
      answer:
        'Molecular Psychology is the framework that treats every psychological state — mood, confidence, anxiety, calm — as the runtime output of measurable molecules: hormones and neurotransmitters binding to receptors. Instead of analyzing feelings as abstract narrative, it identifies the chemical signal underneath and the physical inputs that produced it.',
    },
    {
      question: 'Can you actually change your emotional baseline?',
      answer:
        'Yes, but not by intention alone. Baselines are defended by set points and receptor density, so they resist single interventions. They respond to repeated physical input: consistent light timing, movement, sleep, and social contact shift the molecular profile over weeks. Consistency rewrites the firmware; intensity does not.',
    },
    {
      question: "Why doesn't positive thinking change how I feel?",
      answer:
        'Because thought sits on the application layer, and emotion is set by the firmware layer below it. When hormones and neurotransmitters have already biased the system toward threat, conscious reframing cannot override the chemistry — it can only narrate it. Durable change works bottom-up: fix the molecular inputs first, and the thoughts follow.',
    },
  ],
  'vagus-nerve-master-key': [
    {
      question: 'How can I stimulate my Vagus Nerve?',
      answer:
        'You can stimulate the Vagus Nerve through deep diaphragmatic breathing, cold exposure (face dunking), gargling, and singing. These activities trigger the parasympathetic nervous system and improve heart rate variability (HRV).',
    },
    {
      question: 'What are the signs of low vagal tone?',
      answer:
        'Common signs include chronic stress, difficulty relaxing, digestive issues, high resting heart rate, and poor emotional regulation.',
    },
  ],
  'dopamine-architecture-mastering-desire': [
    {
      question: 'How do I fix my dopamine levels?',
      answer:
        "To stabilize dopamine, implement a 'Dopamine Fast' by reducing hyper-stimulating inputs (social media, ultra-processed food), getting morning sunlight, and practicing delayed gratification.",
    },
    {
      question: 'What is a dopamine baseline?',
      answer:
        'The dopamine baseline is the steady level of dopamine circulating in your system. Spiking it too high with cheap rewards leads to a subsequent crash below the baseline, causing lack of motivation.',
    },
  ],
  'metabolic-flexibility-dual-fuel-system': [
    {
      question: 'How do I achieve metabolic flexibility?',
      answer:
        'By utilizing intermittent fasting, reducing refined carbohydrate intake, and performing zone 2 cardio. This trains your mitochondria to switch efficiently between burning glucose and stored body fat.',
    },
    {
      question: 'What is the benefit of being metabolically flexible?',
      answer:
        "It provides stable energy levels throughout the day, eliminates 'energy crashes' after meals, and improves cognitive clarity and physical endurance.",
    },
  ],
  'circadian-reset-mastering-light': [
    {
      question: 'How does morning light affect my circadian rhythm?',
      answer:
        'Viewing sunlight within 30 minutes of waking triggers a timed Cortisol pulse and sets a 16-hour countdown for Melatonin release. It is the single most important sync-signal for your biological clock.',
    },
    {
      question: 'Why does blue light at night disrupt sleep?',
      answer:
        'Blue light suppresses Melatonin by tricking the Suprachiasmatic Nucleus (SCN) into thinking it is still noon. Your brain never receives the shutdown signal, so you lie in bed with a body that thinks it is midday.',
    },
    {
      question: 'What is the First Photon protocol?',
      answer:
        'View sunlight within 30 minutes of waking—10 mins on a clear day, 20–30 mins on a cloudy day. This resyncs your System Clock with the solar cycle.',
    },
  ],
  'longevity-hardware-cellular-cleanup': [
    {
      question: 'What are senescent cells and why do they matter?',
      answer:
        'Senescent cells are "zombie cells" that stop dividing but refuse to die, leaking inflammatory signals (SASP) that corrupt neighboring healthy tissue. They accelerate aging across your entire system.',
    },
    {
      question: 'How do I trigger autophagy?',
      answer:
        'Extended fasting (36–72 hours), intermittent fasting, and zone 2 cardio trigger autophagy. During nutrient scarcity, your cells break down old proteins and damaged organelles to create new energy.',
    },
    {
      question: 'What are natural senolytics?',
      answer:
        'Quercetin (capers, red onions) and Fisetin (strawberries) act as targeted deletion tools. They selectively induce apoptosis in senescent cells while leaving healthy cells untouched.',
    },
  ],
  'neuroplasticity-flow-overclocking': [
    {
      question: 'What is BDNF and why does it matter for learning?',
      answer:
        'BDNF (Brain-Derived Neurotrophic Factor) is a protein that supports neuron survival and synaptic plasticity. It is the "growth hormone" for your brain—essential for learning, memory, and flow state.',
    },
    {
      question: 'How do I enter flow state more reliably?',
      answer:
        'Flow requires a challenge-skill balance, clear goals, immediate feedback, and elimination of distractions. Physical triggers include zone 2 cardio, cold exposure, and proper sleep.',
    },
  ],
  'gut-brain-axis-data-link': [
    {
      question: 'How does the gut affect the brain?',
      answer:
        'The gut-brain axis is a bidirectional communication system. Gut microbes produce neurotransmitters (e.g., serotonin), short-chain fatty acids, and inflammatory signals that directly influence mood, cognition, and stress response.',
    },
    {
      question: 'What improves gut-brain signaling?',
      answer:
        'High fiber intake (30g/day), polyphenols (dark chocolate, berries), fermented foods, and avoiding ultra-processed foods support a healthy microbiome and stronger vagal tone.',
    },
  ],
  'breathwork-command-line-interface': [
    {
      question: 'What is resonant frequency breathing?',
      answer:
        'Resonant frequency breathing (typically 5–6 breaths per minute) synchronizes heart rate with breathing, maximizing heart rate variability (HRV) and activating the parasympathetic nervous system.',
    },
    {
      question: 'When should I use the physiological sigh?',
      answer:
        'The physiological sigh (double inhale through nose, long exhale) is an instant reboot for acute stress. Use it before meetings, during anxiety spikes, or when you need to downshift quickly.',
    },
  ],
  'hrv-training-nervous-system-latency': [
    {
      question: 'What does HRV tell me about my nervous system?',
      answer:
        'HRV (Heart Rate Variability) reflects the balance between sympathetic and parasympathetic tone. Higher HRV indicates better stress resilience, faster recovery, and a more responsive nervous system.',
    },
    {
      question: 'How do I improve my HRV baseline?',
      answer:
        'Morning baseline scans, resonant breathing (5.5s inhale/exhale), cold exposure, and consistent sleep improve HRV. Track it daily to calibrate your recovery protocols.',
    },
  ],
  'digital-dementia-attentional-control': [
    {
      question: 'What is the attentional firewall?',
      answer:
        'The attentional firewall is a set of protocols that protect your focus from digital fragmentation: monotasking blocks, analog mornings, and dopamine fasting to reclaim sustained attention.',
    },
    {
      question: 'How does multitasking damage cognition?',
      answer:
        'Context-switching fragments working memory and prevents deep encoding. Each switch incurs a "cognitive tax" that accumulates as brain fog and reduced productivity.',
    },
  ],
  'cognitive-architecture-nootropic-stacks': [
    {
      question: 'What is the Focus Baseline stack?',
      answer:
        'A 1:2 ratio of Caffeine (100mg) to L-Theanine (200mg). Theanine smooths the caffeine edge while preserving alertness, reducing jitter and improving sustained focus.',
    },
    {
      question: 'How does Alpha-GPC support memory?',
      answer:
        'Alpha-GPC is a cholinergic precursor that crosses the blood-brain barrier. Paired with Bacopa Monnieri, it supports acetylcholine production for memory encoding and recall.',
    },
  ],
  'mitochondrial-biogenesis-cellular-power-grid': [
    {
      question: 'How do I build new mitochondria?',
      answer:
        'HIIT, zone 2 cardio, cold exposure, and photonic charging (red/NIR light) trigger mitochondrial biogenesis. The PGC-1α pathway is the master switch for creating new power units.',
    },
    {
      question: 'What is the sauna-cold cycle for?',
      answer:
        '20 minutes of sauna followed by 3 minutes of cold triggers heat shock and cold shock proteins. These molecular chaperones help proteins fold correctly and protect against cellular damage.',
    },
  ],
  'circadian-lighting-dark-therapy': [
    {
      question: 'What is dark therapy?',
      answer:
        'Dark therapy involves blocking blue light and reducing overall light exposure after sunset. Orange/red lenses or blue-blocking glasses allow natural melatonin release and circadian alignment.',
    },
    {
      question: 'Why use red light at night?',
      answer:
        'Red light (2000K or lower) does not suppress melatonin. It provides enough illumination for evening activities without disrupting the shutdown sequence for sleep.',
    },
  ],
  'glp1-biology-muscle-preservation': [
    {
      question: 'Can Berberine replace resistance training?',
      answer:
        'No. Berberine manages fuel efficiency (software), but resistance training is the only signal that tells the body to retain muscle mass (hardware).',
    },
    {
      question: 'Why not just use the drug?',
      answer:
        'Endogenous stimulation preserves your metabolism\'s natural feedback loops, preventing "Ozempic face" (the loss of facial fat pads and muscle tone) and rebound weight gain.',
    },
  ],
  'mitochondrial-dna-red-light': [
    {
      question: 'What wavelengths are best for NIR photobiomodulation?',
      answer:
        '660nm (red) penetrates surface tissue; 850nm (near-infrared) reaches deeper. Combined, they target both superficial and mitochondrial layers. Medical-grade panels typically use both.',
    },
    {
      question: 'Why does hydration matter for red light sessions?',
      answer:
        'Water serves as the substrate for the fourth-phase (EZ) structured layer around ATP Synthase. Adequate hydration ensures the viscosity-reducing effect can occur at biological membranes.',
    },
  ],
  'cacao-stem-cells': [
    {
      question: 'Why use decaffeinated cacao for stem cell protocols?',
      answer:
        'Caffeine and theobromine create adrenal spikes that conflict with deep recovery states. By filtering them out, polyphenols work directly on blood flow and stem cell mobilization without overclocking the nervous system.',
    },
    {
      question: 'What is the Micro-Circulation Loop protocol?',
      answer:
        '20 minutes of low-intensity movement (heart rate < 110 bpm) after cacao ingestion. Physical movement acts as the pump, ensuring cacao-driven signals reach the furthest capillaries of your vascular system.',
    },
    {
      question: 'How does red light therapy close the regeneration loop?',
      answer:
        'Red light (660nm) provides mitochondria with ATP to utilize stem cells produced during the day. It completes the regeneration sequence before sleep.',
    },
  ],
  'system-feedback-biometric-loop': [
    {
      question: 'What is the Biometric Feedback Loop?',
      answer:
        'A real-time system where HRV, resting heart rate, and sleep data are continuously ingested and used to select the correct protocol. Instead of fixed schedules, the system adapts: low HRV triggers Recovery Mode, high HRV enables Performance Mode.',
    },
    {
      question: 'What is the Delta Analysis in biometric optimization?',
      answer:
        'Delta Analysis compares current HRV and body temperature against your 14-day rolling average. Any drop in HRV more than 20% below baseline triggers the System Protection Protocol—replacing high-intensity plans with vagal reset and recovery protocols.',
    },
    {
      question: 'What is the difference between Performance, Maintenance, and Recovery Mode?',
      answer:
        'Performance Mode (high HRV): ideal for learning, complex tasks, and high physical load. Maintenance Mode (normal HRV): standard operational cycles. Recovery Mode (low HRV): forced digital detox, CO2 tolerance breathing, and early glymphatic flush.',
    },
  ],
  'cognitive-architecture-neural-throughput': [
    {
      question: 'What is the Digital Sunset protocol?',
      answer:
        'Initiate a blue-light block 60 minutes before sleep. This prevents Melatonin suppression and ensures the Glymphatic System can flush metabolic waste from neural hardware during deep sleep.',
    },
    {
      question: 'Why does the brain need Omega-3 and antioxidants?',
      answer:
        'The brain is 60% fat. Omega-3 fatty acids and structural antioxidants update the lipid layer of neurons, increasing signal conduction speed without insulin spikes—delivering a steady current of ATP.',
    },
    {
      question: 'How does social interaction reduce neural noise?',
      answer:
        'Social isolation increases Amygdala hyperactivity (System Noise). In-person group synchronization aligns brain frequencies and lowers baseline stress load, freeing CPU resources for analytical tasks.',
    },
  ],
  'protocol-circadian-hard-reset': [
    {
      question: 'How long does a Circadian Hard Reset take?',
      answer:
        'The ONDA Circadian Hard Reset runs for 72 hours. Three consecutive days of synchronized Zeitgeber inputs — morning photonic anchor, afternoon thermal spike, and timed metabolic gate — are required to fully reflash a severely drifted biological clock.',
    },
    {
      question: 'What is a Zeitgeber and why does it reset the clock?',
      answer:
        'A Zeitgeber (German: "time giver") is any environmental signal that synchronizes the internal biological clock to the external 24-hour cycle. The most powerful are light (photonic anchor), temperature (thermal spike), and food timing (metabolic gate). Applying all three in the correct sequence forces the Suprachiasmatic Nucleus to realign within 72 hours.',
    },
    {
      question: 'Can I do the Hard Reset without cold exposure?',
      answer:
        'The thermal spike (cold exposure after morning light) is the second Zeitgeber in the stack. Skipping it reduces the reset speed significantly. A minimum of 60 seconds of face-and-neck cold-water immersion at ≤15°C is sufficient to trigger the norepinephrine pulse that signals "daytime" to the sympathetic nervous system.',
    },
  ],
  'ancestral-sync-circadian-anchors': [
    {
      question: 'What are the three ancestral circadian anchors?',
      answer:
        'The three ancestral Zeitgeber anchors in the ONDA protocol are: 1) Photonic Trigger — morning light within 30 minutes of waking to set the cortisol pulse and 16-hour melatonin countdown; 2) Thermal Reset — cold exposure in natural light to lock the temperature-circadian axis; 3) Metabolic Gate — first meal no earlier than 90 minutes after waking to synchronize the peripheral clocks in organs.',
    },
    {
      question: 'Why must the first meal be delayed after waking?',
      answer:
        'The Metabolic Gate principle states that immediate eating on waking sends an "any-time is feeding time" signal to peripheral liver and gut clocks, decoupling them from the central SCN clock. Delaying the first meal by 90 minutes ensures the cortisol peak has passed and peripheral clocks synchronize with the central rhythm, reducing epigenetic drift.',
    },
    {
      question: 'How quickly do circadian anchors fix disrupted sleep?',
      answer:
        'Consistent application of all three ancestral anchors — Photonic Trigger, Thermal Reset, and Metabolic Gate — typically produces measurable improvement in sleep onset latency and HRV within 5–7 days. Full resynchronization of the biological clock after severe jet lag or shift work takes 10–14 days of consistent anchor implementation.',
    },
  ],
  'adrenal-governor-thermal-runaway': [
    {
      question: 'What is the Adrenal Governor and how does it intercept stress signals before cortisol release?',
      answer:
        'The Adrenal Governor is the ONDA framework\'s name for the neural filtering layer — primarily the prefrontal cortex exerting inhibitory control over the amygdala-HPA axis loop — that determines whether an incoming stimulus warrants a cortisol and adrenaline injection or constitutes informational noise that should be filtered. In a well-calibrated system operating in Alpha state, the prefrontal cortex\'s inhibitory projection to the amygdala is strong enough to evaluate stress signals before they propagate to the hypothalamus and trigger CRH release. In chronic Beta-mode, this inhibitory capacity is degraded — the amygdala fires unfiltered, the hypothalamus receives the signal, and the adrenals inject. The Governor protocol restores the prefrontal filtering capacity through HRV monitoring, Alpha-state maintenance, and anticipatory priming.',
    },
    {
      question: 'What is the difference between Performance Spiking and Redline cortisol output?',
      answer:
        'Performance Spiking is the appropriate, time-limited elevation of cortisol and adrenaline in response to a genuine challenge — a deadline, athletic effort, or acute stressor. The spike is sharp, purposeful, and followed by a rapid recovery as parasympathetic tone reasserts itself. Redline is the pathological state where cortisol is elevated continuously, not in response to specific challenges but as a default background state driven by chronic Beta-mode neural entrainment. The distinction is not in the cortisol level at peak, but in the baseline between peaks and the presence or absence of recovery. Redline is characterized by an elevated floor — basal cortisol never returns to the low range — rather than by higher individual peaks. This elevated floor is what drives receptor desensitization, hippocampal damage, and immune suppression.',
    },
    {
      question: 'Why does morning HRV measurement serve as the most reliable daily Adrenal Governor indicator?',
      answer:
        'Morning HRV — measured immediately after waking, before leaving the bed, before caffeine or screen exposure — reflects the overnight recovery state of the autonomic nervous system, free from acute stressors or deliberate interventions. It is the closest available proxy to the baseline autonomous tone of the HPA axis and the sympathovagal balance that will govern the day\'s stress response capacity. A drop below personal baseline HRV indicates that the previous day\'s load exceeded the system\'s recovery capacity — the adrenal-cardiac-neural system is still compensating. Measuring in this window provides a Governor Alert before any new load is added. Post-exercise or midday HRV measurements are more variable and reflect acute conditions rather than systemic recovery state.',
    },
  ],
  'spinal-intelligence-decentralized-control': [
    {
      question: 'What is spinal intelligence and how does the spinal cord function as an independent processor?',
      answer:
        'Spinal intelligence refers to the autonomous sensory-motor processing capacity of the spinal cord — its ability to receive sensory input, integrate it locally via spinal interneuron networks, and generate motor output without transmitting data to the brain. The spinal cord contains approximately 100 million neurons and processes reflex arcs entirely within its own circuitry: sensory input enters at the spinal level, is processed by spinal interneurons (including CPG networks), and motor output exits — all within 30–80 milliseconds, before the brain is even aware of the event. The spinal cord also possesses a form of "motor memory" — learned movement adaptations stored in the synaptic weights of spinal interneuron circuits — that can be demonstrated in spinalized animal preparations that retain locomotor patterns after complete brain separation.',
    },
    {
      question: 'What is the Choke Effect and why does thinking about movement cause errors?',
      answer:
        'The Choke Effect is the performance degradation that occurs when the prefrontal cortex becomes actively involved in motor execution rather than leaving execution to subcortical and spinal circuits. Prefrontal cortical involvement introduces 150–300ms of additional latency compared to subcortical-spinal execution of the same movement. At high speeds, this latency window is the interval in which injury, error, or failure occurs. The mechanism is straightforward: the prefrontal cortex processes movement information sequentially and deliberately — it is optimized for planning, not for millisecond-timescale reactive control. When it "takes over" from faster circuits, it imposes its processing speed on a system that was operating faster without it. Elite performers under pressure are characterized by lower, not higher, prefrontal activation during execution.',
    },
    {
      question: 'Why does training on unpredictable surfaces improve spinal intelligence more than stable-surface training?',
      answer:
        'Stable, predictable training surfaces allow the cortex to pre-plan motor responses rather than react in real-time. When the environment is predictable, the brain runs movement in "open-loop" mode — pre-selecting motor commands based on prior experience rather than responding to current sensory input. Unpredictable surfaces (unstable ground, shifting weights, varied terrain) force the system into "closed-loop" reactive mode: every step or rep introduces a novel perturbation that the spinal CPGs and reflex interneurons must resolve autonomously in real-time. Each unpredictable perturbation is a micro-learning event for the spinal interneuron network — strengthening the synaptic connections that enable faster, more adaptive future responses. Over weeks, this produces measurably denser, faster, and more adaptive spinal reflex patterns: the physiological substrate of reactive resilience.',
    },
  ],
  'rhythmic-entrainment-system-frequencies': [
    {
      question: 'Why is 0.1 Hz (6 breaths per minute) the specific frequency for maximum biological entrainment?',
      answer:
        '0.1 Hz is the resonant frequency of the baroreflex loop — the feedback cycle between blood pressure fluctuations, heart rate adjustments, and the vagus nerve. At this specific frequency, the baroreflex achieves maximum gain: each breath produces the largest possible swing in heart rate variability, and the respiratory, cardiovascular, and autonomic nervous systems reach peak coherence. Below 0.1 Hz, the respiratory drive falls out of sync with the baroreflex cycle. Above 0.1 Hz, each breath is too short for the full baroreflex response to complete. 0.1 Hz is the precise mathematical resonance point of the human cardiovascular system — not an arbitrary wellness target.',
    },
    {
      question: 'What is Phase Desync and how does it produce cognitive tremors and systemic inflammation?',
      answer:
        'Phase Desync occurs when the body\'s biological oscillators — respiratory, cardiac, motor, neural — run simultaneously but without phase-locking to each other. The result is constructive and destructive interference between their outputs: signals from different systems arrive at junction points slightly out of phase, producing compensatory micro-corrections that consume energy and generate low-level stress signals. These stress signals elevate inflammatory markers (IL-6, CRP) measurably in chronically desynchronized individuals. The cognitive effect — experienced as diffuse background discomfort without a clear source — is the result of the brain\'s processing budget being partially consumed by arbitrating between conflicting internal timing signals ("cognitive tremors").',
    },
    {
      question: 'What is Locomotor-Respiratory Coupling (LRC) and why does it make movement more efficient?',
      answer:
        'Locomotor-Respiratory Coupling (LRC) is the deliberate phase-locking of step rhythm to breath phases during locomotion — typically a 3:3 or 4:4 step-to-breath ratio (inhale for N steps, exhale for N steps). When step and breath are phase-locked, the respiratory muscles contribute to core stabilization (thoracic pressure changes assist trunk stiffness during each stance phase), reducing the metabolic overhead of separate stabilization effort. Simultaneously, the CPG locomotor oscillators receive a consistent phase reference from the respiratory system, reducing the energy cost of autonomous oscillator self-maintenance. The result is measurably lower oxygen consumption per unit of movement output — the physical mechanism behind why trained endurance athletes develop LRC naturally and why it is used in clinical gait rehabilitation.',
    },
  ],
  'spinal-harddrive-cpg-autonomous-scripts': [
    {
      question: 'What are Central Pattern Generators (CPGs) and where are they located in the body?',
      answer:
        'Central Pattern Generators (CPGs) are neural networks located primarily in the spinal cord — in the lumbar region for locomotion (walking, running) and the cervical region for respiratory and arm movement coordination. They are "half-center oscillator" networks: pairs of mutually inhibitory interneurons that alternate activity to produce rhythmic, coordinated muscular output. CPGs operate autonomously — once the brain issues an "Execute" command, CPGs continue running the movement sequence without requiring continuous descending input. They receive real-time feedback from proprioceptive sensors in muscles (muscle spindles), tendons (Golgi tendon organs), and joints (mechanoreceptors), adjusting their output to terrain conditions in 30–80 milliseconds — far faster than the conscious reaction window of 200–400ms.',
    },
    {
      question: 'Why does conscious motor control (micromanagement) cause fatigue and discoordination?',
      answer:
        'The prefrontal cortex — the seat of conscious motor control — is the most metabolically expensive neural tissue, consuming 20% of brain energy while representing 2% of brain mass. CPG output is rhythmically synchronized via gap junctions and chemical synapses calibrated by evolutionary refinement. When cortical override signals arrive, they are asynchronous — they disrupt the timing of the spinal oscillator network and introduce coordination errors, compensatory muscle tension, and accelerated fatigue. Skilled movers (elite athletes, dancers) are characterized not by greater cortical motor control, but by greater cortical withdrawal from it: they have better-calibrated CPGs and better-developed inhibition of the micromanagement reflex.',
    },
    {
      question: 'How does rhythmic entrainment synchronize CPGs and why does music improve endurance?',
      answer:
        'CPGs are oscillator networks that entrain to external rhythmic inputs via the auditory-motor pathway — a direct neural connection between auditory cortex and spinal motor circuits, used clinically in gait rehabilitation for stroke and Parkinson\'s patients. External rhythm provides a phase-locking signal that synchronizes CPG oscillators and shifts them toward maximum efficiency mode — where energy consumption per unit of movement output is minimized. This is the mechanism behind the well-documented ergogenic (performance-enhancing) effect of music during endurance exercise: it is not motivational in origin, it is a CPG synchronization tool. ONDA breathing at 0.1 Hz provides a complementary entrainment signal via the respiratory CPG, which cross-couples with locomotor CPGs and cardiac rhythm.',
    },
  ],
  'quiet-mode-alpha-cortisol-buffer': [
    {
      question: 'How do Alpha waves (8–12 Hz) actively suppress cortisol and sympathetic arousal?',
      answer:
        'Alpha dominance interrupts the stress cascade via the prefrontal cortex. Sustained High-Beta neural activity drives tonic CRH (corticotropin-releasing hormone) release through an amygdala-hypothalamus loop. When Alpha power increases, the prefrontal cortex shifts from task-positive to default-mode operation and exerts inhibitory control over amygdala activation — reducing the perceived threat signal forwarded to the hypothalamus. With a diminished HPA axis input signal, CRH and ACTH output decreases, and the adrenal glands deprioritize cortisol production. The suppression is active, not passive: Alpha directly engages the top-down regulatory pathway, not merely the absence of stress.',
    },
    {
      question: 'What is Thermal Runaway in the context of chronic stress and why does it prevent sleep?',
      answer:
        'Thermal Runaway is the self-amplifying failure cascade that occurs when the nervous system loses access to the Alpha-state buffer. In this mode, chronic High-Beta entrainment becomes the default state — the brain keeps scanning for threats even after the threat is gone, because the threat-detection loop has decoupled from actual threat input. Sleep latency increases because the Beta-to-Delta sleep transition requires Alpha as the mandatory intermediate state. A brain locked in Beta at bedtime cannot skip the bridge and enter Theta or Delta directly. The result is that more exhaustion without Alpha intervention worsens sleep latency, not improves it — the system needs access to the Alpha bridge, not simply "enough tiredness."',
    },
    {
      question: 'Why does a slight forward head tilt (the Alpha-Drop) enhance Alpha wave generation?',
      answer:
        'The slight forward head tilt (~10–15° chin lowering) in the Alpha-Drop protocol works via two physical mechanisms. First, it increases CSF pressure at the occipital pole — the primary location of Alpha generators in the cortex — marginally improving the electrochemical environment for 8–12 Hz oscillation. Second, it reduces activation of the cervical sympathetic chain, which runs adjacent to the cervical vertebrae and contributes to sympathetic tone when the head is in an upright or extended position. The head-forward tilt passively reduces this input. Combined with eyes-closed sensory reduction and exhale-extended breathing, the Alpha-Drop creates three simultaneous hardware conditions that facilitate occipital Alpha generation without requiring willpower or technique mastery.',
    },
  ],
  'neural-bridge-alpha-flow-gateway': [
    {
      question: 'What is the Alpha-Theta bridge and how does it enable creative insights?',
      answer:
        'The Alpha-Theta bridge is the transitional brain state at the border of Alpha (8–12 Hz) and Theta (4–8 Hz) where the conscious prefrontal workspace becomes permeable to subconscious Theta-stored material — deep memory traces, non-linear associations, and emotional pattern networks. In this state, the prefrontal "censor" that normally filters out divergent ideas partially relaxes, allowing Theta content to surface into Alpha-range awareness. Insights experienced as "Eureka moments" are this bridging event made conscious — the result of Alpha-Gamma coupling propagating Theta-generated associations into prefrontal attention.',
    },
    {
      question: 'What is cross-frequency coupling and why does Alpha act as a carrier for Gamma waves?',
      answer:
        'Cross-frequency coupling (CFC) is the mechanism by which oscillations at different frequencies modulate each other. In the neural bridge context, Alpha waves (8–12 Hz) act as the phase carrier for Gamma bursts (30–80 Hz) — a phenomenon called phase-amplitude coupling. Alpha phase determines when Gamma amplitude is high (insight windows) and when it is suppressed. Without a stable Alpha carrier, Gamma bursts occur at random phases and are not coordinated across brain regions — insights are generated but not broadcast to the conscious workspace. A stable Alpha bridge synchronizes the timing of Gamma insight events with prefrontal attention windows, making them accessible.',
    },
    {
      question: 'How does the diffused focus technique open the neural bridge faster than relaxation?',
      answer:
        'Narrow screen-focus activates the dorsal attention network and frontal eye fields in High-Beta mode — a target-seeking, threat-scanning posture that actively suppresses Alpha and the default mode network. Switching to panoramic, diffused vision (soft gaze, full peripheral awareness) shifts activation to the ventral attention network and default mode network, which are associated with Alpha dominance and creative synthesis. This visual-posture switch is a direct hardware trigger: it acts on the alpha generators in the occipital cortex within seconds via visuomotor feedback loops — bypassing the slow, top-down cognitive effort required to "try to relax." The bridge opens faster via the eyes than via conscious intention.',
    },
  ],
  'idle-state-alpha-rhythms': [
    {
      question: 'What is the Alpha State (8–12 Hz) and why is it the optimal baseline for high performance?',
      answer:
        'The Alpha State (8–12 Hz) is the brain\'s "neutral gear" — a state of synchronized, low-noise neural activity where the thalamocortical system is maximally ready to engage any cognitive mode without residual friction from previous states. Alpha dominance indicates high thalamocortical gating efficiency (irrelevant sensory signals filtered), default mode network activation (strategic, integrative thinking), and inter-regional coherence (prefrontal-limbic coordination). Unlike the popular misconception of Alpha as "relaxation," it is the technical prerequisite for flow state entry — the system cannot enter deep focus from High-Beta; it must transit through Alpha first.',
    },
    {
      question: 'What is the Beta Trap and how does it degrade cognitive performance over the workday?',
      answer:
        'The Beta Trap is the state of chronic High-Beta entrainment (15–30 Hz) from which the modern high-demand brain cannot exit without deliberate intervention. Sustained stress, continuous digital input, and context switching maintain constant Amygdala-prefrontal competition — suppressing Alpha and keeping the system in reactive threat-evaluation mode. The cognitive costs compound over the workday: High-Beta neural firing consumes up to 3x more glucose than Alpha baseline, depleting prefrontal resources faster and degrading decision quality progressively from morning to evening. The trap closes completely when the inability to return to Idle prevents restorative sleep, starting the next day from an already-depleted baseline.',
    },
    {
      question: 'How does 0.1 Hz resonance breathing shift the brain from Beta to Alpha?',
      answer:
        'At 0.1 Hz baroreflex resonance, the heart generates a coherent oscillation that propagates via vagal afferents to the brainstem nucleus tractus solitarius and then to the thalamus. This pathway shifts thalamic firing from High-Beta gating (high vigilance, high filtering against incoming signals) to Alpha-frequency gating (readiness mode, efficient filtering of irrelevant signals). The thalamic shift propagates to the cortex within 2–3 minutes of sustained resonance breathing. HRV and Alpha amplitude are bidirectionally coupled: high HRV predicts high resting Alpha power, and Alpha entrainment (via visual reset or resonance breathing) measurably increases HRV coherence.',
    },
  ],
  'anti-entropy-neural-architecture': [
    {
      question: 'What is Neural Drift and how does it relate to neurodegeneration?',
      answer:
        'Neural Drift is the gradual accumulation of metabolic entropy in the brain — the progressive buildup of beta-amyloid plaques and tau protein tangles that occurs when glymphatic clearance chronically underperforms. Each night of poor sleep or low HRV adds to a metabolic debt that compounds over years. When the accumulated protein burden crosses recovery thresholds, it begins to impair synaptic plasticity, inhibit axonal transport, and disrupt neural circuitry — the transition from recoverable suboptimality to irreversible neurodegeneration. The ONDA Anti-Entropy Protocol addresses this as an engineering failure, not an inevitable biological process.',
    },
    {
      question: 'How does intermittent fasting synchronize with glymphatic clearance for dual-channel detox?',
      answer:
        'Glymphatic flushing clears extracellular waste (beta-amyloid, tau, glutamate) from between neurons. Autophagy — triggered by mTOR suppression during fasting — clears intracellular waste (damaged organelles, misfolded proteins, dysfunctional mitochondria) from inside neurons. A 4-hour pre-sleep fasting window initiates both processes simultaneously: the glymphatic pump activates with N3 sleep onset, while autophagy is already running from the fast. Running both in the same time window creates a dual-channel purge that eliminates waste at both the extracellular and intracellular level — a combinatorial effect no single-mechanism approach achieves.',
    },
    {
      question: 'Why does brain temperature during sleep affect glymphatic clearance efficiency?',
      answer:
        'Glymphatic flow velocity is temperature-dependent. At lower brain temperatures (17–18°C ambient), two mechanisms amplify clearance: first, CSF viscosity decreases slightly, reducing hydraulic resistance in the perivascular channels and increasing flow velocity per arterial pump stroke. Second, the hypothalamic thermostat interprets head cooling as a deep-night signal, extending Stage N3 duration and allowing the glymphatic pump to operate longer per sleep cycle. Maintaining cool head temperature throughout the night — via cooling gel pillows and controlled room temperature — sustains both effects for the full glymphatic window.',
    },
  ],
  'neural-hydraulics-csf-flow': [
    {
      question: 'How do arteries function as the brain\'s hydraulic pump for CSF clearance?',
      answer:
        'With each heartbeat, arteries in the brain expand and contract — generating a pressure wave that physically pushes cerebrospinal fluid (CSF) through the perivascular glymphatic channels surrounding them. This arterial pulsatility is the primary active force driving CSF through brain tissue to flush metabolic byproducts (beta-amyloids, tau proteins, glutamate). Higher HRV = more elastic arterial walls = larger pulsation amplitude = deeper CSF penetration per heartbeat. Low HRV and arterial stiffness reduce this pump stroke, leaving metabolic waste in deeper tissue layers.',
    },
    {
      question: 'What is hydraulic stasis and how does it cause morning brain fog?',
      answer:
        'Hydraulic stasis occurs when CSF flow velocity drops below clearance-effective thresholds — due to low HRV, poor sleep architecture, or supine sleep positioning. The result is incomplete overnight metabolic clearance: beta-amyloid and tau proteins accumulate on neuronal membranes, increasing electrical signal latency and raising the synaptic noise floor. This manifests as morning brain fog, heavy-headedness, and slow cognitive boot-up. In chronic cases, repeated stasis nights create the protein accumulation pathway associated with long-term neurodegeneration.',
    },
    {
      question: 'Why does diaphragmatic breathing before sleep improve brain fluid drainage?',
      answer:
        'Deep diaphragmatic breathing creates negative intra-thoracic pressure on each inhale — a partial vacuum in the chest cavity that assists venous return from the head via the jugular veins. This reduces cerebral venous congestion and lowers the baseline intracranial pressure entering the sleep window. Lower pre-sleep intracranial pressure creates a wider hydrostatic gradient for CSF outflow, allowing the glymphatic system to initiate flow faster at N3 onset. Extended exhale (6s vs 4s) additionally activates the parasympathetic branch, clearing residual cortisol and accelerating the sleep-onset transition.',
    },
  ],
  'nightly-flush-glymphatic-neural-cache': [
    {
      question: 'What is the glymphatic system and why does it only activate during deep sleep?',
      answer:
        'The glymphatic system is the brain\'s waste-clearance network — a series of perivascular channels through which cerebrospinal fluid (CSF) flushes metabolic byproducts (beta-amyloids, tau proteins, glutamate) from neural tissue. It activates exclusively during Stage N3 (Deep Sleep) because this is the only phase when the brain\'s intercellular space expands by 60%, creating the hydraulic pressure differential needed to drive CSF through the tissue at clearance-effective flow rates. During wakefulness, the neural activity and cellular volume prevent this expansion, making active glymphatic flushing impossible.',
    },
    {
      question: 'How does HRV affect glymphatic clearance efficiency?',
      answer:
        'Arterial pulsatility — the pressure wave generated by each heartbeat — is the primary hydraulic pump driving CSF through glymphatic perivascular channels. High HRV indicates a strong, rhythmically coherent pulse wave that generates consistent perivascular pressure cycles and deep CSF tissue penetration. Low HRV produces a weak, arrhythmic pump with shallow perivascular flow — leaving metabolic waste in deeper tissue layers. Evening 0.1 Hz resonance breathing maximizes baroreflex coherence, steadying and amplifying the pulse wave to prime the glymphatic pump before sleep onset.',
    },
    {
      question: 'Why does lateral sleep positioning improve brain detoxification?',
      answer:
        'The glymphatic drainage network is gravity-sensitive — CSF outflow via cervical lymphatic ducts and spinal subarachnoid pathways is geometrically favored by lateral positioning. Studies measuring CSF tracer clearance in animal models and human neuroimaging show 25–30% improvement in glymphatic outflow efficiency in lateral (side-sleeping) vs. supine position. The lateral position reduces hydraulic resistance in the drainage channels, allowing CSF to flow through the entire glymphatic network rather than pooling in posterior regions with restricted outflow.',
    },
  ],
  'baroreflex-01hz-shift': [
    {
      question: 'What are Mayer Waves and why does 0.1 Hz breathing synchronize with them?',
      answer:
        'Mayer Waves are slow oscillations in blood pressure with a natural frequency of approximately 0.1 Hz — one cycle every 10 seconds — produced by the baroreflex feedback loop as it regulates arterial pressure. Normally, breathing runs out of phase with this oscillation, causing partial cancellation of the HRV signal. When breathing frequency matches Mayer Wave frequency at 0.1 Hz (6 breaths per minute), the respiratory and cardiovascular oscillations phase-lock, creating constructive resonance — HRV amplitude surges to its physiological ceiling and baroreflex sensitivity reaches its maximum.',
    },
    {
      question: 'How does 0.1 Hz breathing lower blood pressure without medication?',
      answer:
        'Repeated sessions of 0.1 Hz baroreflex resonance training sensitize arterial baroreceptors — they become faster and more precise at detecting pressure deviations and commanding compensatory responses. Over 4–8 weeks of daily 10–20 minute sessions, this produces measurable increases in baroreflex sensitivity (BRS) and arterial elasticity, resulting in systolic blood pressure reductions of 7–15 mmHg in hypertensive individuals. The mechanism is neuroplastic: the brainstem cardiovascular control centers recalibrate their setpoint downward in response to the improved signal-to-noise ratio delivered by resonance breathing.',
    },
    {
      question: 'How quickly does the 0.1 Hz baroreflex hook produce measurable effects?',
      answer:
        'The acute effects begin within 90 seconds of reaching resonance: vagal efferent output increases, heart rate variability rises, and cortisol begins dropping. A 5-minute session is the minimum effective dose for measurable parasympathetic activation and cognitive noise reduction. A full 20-minute session produces baroreflex sensitization that persists 4–6 hours post-session, making it practical as a pre-work or pre-decision protocol. Blood pressure reduction accumulates over 4–8 weeks of consistent daily practice.',
    },
  ],
  'resonant-frequency-system-coherence': [
    {
      question: 'What is resonant frequency breathing and how does it differ from standard breathing exercises?',
      answer:
        'Resonant frequency breathing targets the exact individual rhythm (typically 4.5–6.5 breaths/min) where the cardiovascular and respiratory systems enter phase-lock — called baroreflex resonance. Unlike generic "deep breathing" with fixed timing, resonant frequency is identified through a personalized frequency sweep and LF-HRV peak analysis. At this specific frequency, HRV surges to its ceiling, vascular resistance drops, and the Vagus Nerve broadcasts a system-wide safety signal simultaneously.',
    },
    {
      question: 'How long does it take to identify my personal resonant frequency?',
      answer:
        'A basic resonance scan takes 20–30 minutes. Test 5.0, 5.5, 6.0, and 6.5 breaths per minute, holding each pattern for 3–4 minutes while monitoring HRV in real time. The frequency producing the highest LF spectral power peak is your resonant frequency. Once identified, it remains stable and becomes a lifelong calibration reference. A starting point before scanning: the 5:5 ratio (5-second inhale, 5-second exhale = 6 breaths/min) is the most common resonant point for adults.',
    },
    {
      question: 'What is "vagal capture" and how does resonant breathing trigger it?',
      answer:
        'Vagal capture is the phenomenon where sustained breathing at resonant frequency forces the Vagus Nerve into synchronized, high-amplitude oscillation — increasing efferent vagal output to the heart, gut, and immune system simultaneously. This begins within 90 seconds of reaching resonance and escalates over 5–10 minutes. The result is measurable cortisol reduction, improved gut motility, enhanced immune cell activity, and a brain shift into Alpha/Theta border activity — the state of relaxed alertness optimal for creative work and recovery.',
    },
  ],
  'fault-tolerant-human-hrv-buffer': [
    {
      question: 'What is the HRV buffer and how does it relate to resilience?',
      answer:
        'The HRV buffer is the physiological "headroom" available to absorb stress without system failure. High HRV indicates multiple redundant regulatory pathways between the Sympathetic and Parasympathetic branches — meaning the system can absorb shocks, adapt, and continue operating at near-optimal state. Low HRV means the system is already at max capacity; any additional stressor triggers cascade failure: burnout, illness, or cognitive paralysis.',
    },
    {
      question: 'What is hormetic stress loading and how does it expand the HRV buffer?',
      answer:
        'Hormetic stress loading uses controlled, short-duration stress spikes — cold exposure (≤15°C, 2–3 min), CO₂ tolerance training, or HIIT at 80–90% max HR — to force the regulatory system to practice recovery. Each spike followed by complete recovery trains the system to exit stress states faster. Over 4–6 weeks, the HRV baseline rises and the recovery slope steepens, expanding the operational buffer.',
    },
    {
      question: 'How can morning HRV predict illness 48 hours in advance?',
      answer:
        'HRV trends reflect immune and autonomic load before subjective symptoms appear. A sustained drop of >10% from a 7-day rolling morning HRV average signals that the system is fighting an incoming threat — viral, bacterial, or accumulated stress overload — 24–72 hours before any symptoms manifest. Acting on this signal by reducing training intensity, increasing sleep, and adding VNS sessions allows the system to resolve the threat at the buffer level rather than escalating to full cascade failure.',
    },
  ],
  'nervous-system-ping-latency': [
    {
      question: 'What is HRV and why does it measure nervous system latency?',
      answer:
        'HRV (Heart Rate Variability) measures the millisecond variation between heartbeats (R-R intervals). High variability indicates that the Parasympathetic branch (Vagus Nerve) is actively modulating cardiac rhythm, meaning the system responds fast to incoming signals and returns to baseline quickly — low latency. A metronome-like, low-variability heartbeat signals Sympathetic overactivation: the network is stuck, recovery is slow, and the "ping" is high.',
    },
    {
      question: 'What is resonant frequency breathing and how does it reduce ANS latency?',
      answer:
        'Resonant frequency breathing synchronizes the heart, lungs, and baroreflex at a shared oscillation frequency — typically ~0.1 Hz (one full breath cycle every 10 seconds). At this rate, cardiac oscillation, blood pressure waves, and cerebral blood flow phase-lock into a coherent wave, dramatically increasing HRV during the session. The elevated baseline persists for hours. This is not relaxation; it is network synchronization that reduces autonomic response lag.',
    },
    {
      question: 'How long does HRV biofeedback training take to show results?',
      answer:
        'Short-term effects (elevated HRV, reduced cortisol, improved cognitive switching) appear within a single 10–20 minute resonant frequency breathing session. Structural improvements in vagal tone and resting HRV baseline become measurable after 4–6 weeks of consistent daily practice. Load-followed-by-recovery training — performing biofeedback immediately after high-stress events — accelerates the adaptation timeline.',
    },
  ],
  'longevity-protocol-biological-clock-reset': [
    {
      question: 'What is the Horvath Clock and can it be reversed?',
      answer:
        'The Horvath Clock is a DNA methylation-based biomarker developed by Steve Horvath that measures biological age independently of chronological age. Research shows that behavioral interventions targeting circadian synchronization — combined with specific hormetic stressors — can slow and in some cases partially reverse the methylation age score.',
    },
    {
      question: 'How does the 48-Hour Dark Surge reset the epigenetic clock?',
      answer:
        'The 48-Hour Dark Surge eliminates all artificial blue light after sunset for two consecutive days, maximizing endogenous melatonin production. Beyond its role as a sleep hormone, melatonin functions as the most potent mitochondrial antioxidant — entering mitochondria directly to neutralize reactive oxygen species that drive epigenetic drift and DNA methylation aging.',
    },
    {
      question: 'What is DFA alpha 1 and how is it used in the wind-down protocol?',
      answer:
        'DFA alpha 1 (Detrended Fluctuation Analysis) measures the fractal correlation of heart rate, serving as a real-time indicator of autonomic balance. A value above 1.0 signals parasympathetic dominance and readiness for restorative sleep. In the ONDA Deep Reset protocol, DFA alpha 1 is monitored in the evening; if it remains low, a targeted VNS session (paced breathing at 0.1 Hz) forces the transition within 8–12 minutes.',
    },
  ],
  'ventral-tegmental-core-motivational-salience': [
    {
      question: 'What does the Ventral Tegmental Area (VTA) actually do?',
      answer:
        'The VTA is the brain\'s reactor of motivational salience. It houses dopaminergic neurons (~60%), GABAergic dampeners (~35%) and glutamatergic burst neurons (~5%), and decides where to allocate computational and physical resources by releasing dopamine as a prediction-error signal — not as a reward chemical.',
    },
    {
      question: 'Why does scrolling and sugar break my motivation baseline?',
      answer:
        'High-frequency low-grade stimuli (notifications, refined sugar) overdrive the VTA reactor and trigger receptor desensitization. The dopamine baseline drops, you need exponentially more input for the same drive, and the Acetylcholine Lens loses focal lock — what feels like apathy is reactor jitter.',
    },
    {
      question: 'How do I recalibrate the VTA without medication?',
      answer:
        'Three ONDA protocols: a 24-hour System Reset to remove high-frequency pulse stimuli, hormetic overclocking via cold plunge or intense training to deliver a clean baseline signal, and bypassing external grids by shifting to long deep-work cycles where reward is delayed.',
    },
  ],
  'fascial-tensegrity-protocol-myofascial-noise': [
    {
      question: 'Why does neck and shoulder tension cause brain fog?',
      answer:
        'Trapezius lock and cervical compression strangle the major vascular pathways supplying the brain. The microvasculature constricts, cerebral blood flow drops, and the prefrontal cortex receives less oxygen — degrading the focal definition of the Acetylcholine Lens.',
    },
    {
      question: 'How long should I hold pressure during the trapezius release?',
      answer:
        'Apply moderate, sustained pressure with fingertips or a massage ball for 30 to 45 seconds on each high-tension point along the neck and upper shoulders, until the tissue tension subsides. Combine with the humming exhale for full parasympathetic shift.',
    },
    {
      question: 'Why is humming on the exhale used to activate the vagus nerve?',
      answer:
        'A long, low-frequency humming exhale (8–10 seconds after a 4-second nasal inhale) creates vibration around the vagus pathway and lowers system jitter. It stimulates the vagus, drops resting heart rate and releases residual tension in the jaw and neck.',
    },
  ],
  'vascular-tensegrity-microvascular-mechanics': [
    {
      question: 'What is vascular tensegrity in plain language?',
      answer:
        'It is the principle that vascular walls, cell membranes and skeletal structures are rigid elements floating inside a continuous tension network of fascia, intracellular hydraulic pressure and elastin fibers. When the network is balanced, blood and nutrients reach the cortex with minimal energy and minimal resistance.',
    },
    {
      question: 'How does myofascial tension translate into cerebral hypoxia?',
      answer:
        'Locked masticatory and trapezius muscles compress microvessels, raise hydraulic impedance and slow cerebral blood flow. The cortex becomes starved of oxygen and acetylcholine, and the Acetylcholine Lens loses focal definition — focus collapses before any "mental" cause appears.',
    },
  ],
  'bohr-effect-oxygen-telemetry': [
    {
      question: 'What is the Bohr Effect?',
      answer:
        'The Bohr Effect describes how the binding affinity of hemoglobin depends on the surrounding CO2 concentration. Hemoglobin only releases oxygen to tissues in the presence of CO2 — without enough CO2 it retains oxygen, creating cellular hypoxia even when blood oxygen is high.',
    },
    {
      question: 'Why does shallow stress breathing cause brain fog?',
      answer:
        'Hyperventilation washes out CO2. Without the CO2 trigger, hemoglobin will not unload oxygen at high-demand neural nodes, so the prefrontal cortex slows down. The body also misreads low CO2 as a threat signal and increases adrenaline — producing micro-panic and fog.',
    },
    {
      question: 'How do I train CO2 tolerance safely?',
      answer:
        'Slow, measured breathing with extended exhales and patient pauses before the next inhale. Add brief controlled breath holds (post-exhale or post-inhale) in cycles to gently spike CO2 — this dilates cerebral vessels and stabilizes oxygen delivery to active networks.',
    },
  ],
  'anterior-cingulate-core-coherence-monitoring': [
    {
      question: 'What does the anterior cingulate cortex (ACC) do?',
      answer:
        'The ACC is the system arbiter — it monitors conflict between expected and actual outcomes (prediction error), runs cost–benefit analysis on cognitive control, and signals when a recalibration is needed. It is the node that decides whether to keep pushing or to switch tasks.',
    },
    {
      question: 'What is the difference between dorsal and ventral ACC?',
      answer:
        'The dorsal ACC (dACC) handles cognitive control, action selection and task-switching, keeping the system locked onto deep work. The ventral ACC (vACC) handles emotional appraisal and autonomic regulation, lowering stress and preventing overload during difficult operations.',
    },
  ],
  'acc-calibration-protocol-cognitive-control': [
    {
      question: 'Why does multitasking feel exhausting?',
      answer:
        'Frequent task-switching loads the dorsal ACC heavily — every switch is a conflict the arbiter has to resolve. Over an hour of context-switching the dACC overheats, the error buffer fills with false triggers, and the felt cost is fatigue and frustration even when output is small.',
    },
    {
      question: 'How long should a monotasking block be?',
      answer:
        'In the ONDA ACC Calibration Protocol, set a single Core Vector task and a 50-minute timer of deep work, with notifications off and unnecessary tabs closed. This window is long enough to fully suppress conflict processing and short enough to keep the arbiter inside its working temperature.',
    },
    {
      question: 'What do I do with the urge to check notifications mid-block?',
      answer:
        'Run the Mindfulness Alignment gate: when the urge appears, do not react immediately — pause for 15 to 30 seconds, acknowledge the impulse without acting on it, and return focus to the core task. This trains the vACC to lower its emotional reaction to triggers.',
    },
  ],
  'hydraulic-viscosity-onda-transport-bus': [
    {
      question: 'Why does blood viscosity matter for cognitive performance?',
      answer:
        'According to the Hagen–Poiseuille law, hydraulic resistance is directly proportional to fluid viscosity. The lower the viscosity of blood, the less energy the heart and vascular tone need to spend to deliver oxygen and nutrients to the cortex — and the lower the cerebral perfusion latency.',
    },
    {
      question: 'How does temperature change blood viscosity?',
      answer:
        'At standard body temperature (37 °C) the dynamic viscosity of water is around 0.69 cP, significantly lower than at room temperature. Local warming through metabolism and deep controlled breathing weakens hydrogen bonds in water, drops viscosity and facilitates oxygen delivery — thermal control is a tunable system parameter.',
    },
    {
      question: 'What raises apparent viscosity in real life?',
      answer:
        'Spasms in the masticatory or trapezius muscles compress microvessels, slow local blood flow and cool the surrounding tissue. The combination raises apparent viscosity, increases impedance and delays nutrient delivery to the brain — releasing structural tension is the most direct viscosity hack.',
    },
  ],
}
