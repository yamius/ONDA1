/**
 * "Common questions" block on ONDA Library topic hubs (EN hubs only for now).
 * Rendered after the article grid and emitted as FAQPage JSON-LD by meta-inject.
 * Questions checked 2026-09-28 against GSC queries + Google "People also ask".
 * Each answer: the answer first, short, then links into the hub's own guides/tools.
 */
import type { ArticleTopicSlug } from './article-topics'

export interface HubFaqItem {
  q: string
  a: string
  links: { href: string; label: string }[]
}

const TOPIC_HUB_FAQ_RAW: Partial<Record<ArticleTopicSlug, HubFaqItem[]>> = {
  'hrv-heart-rate': [
    {
      q: 'What is a normal resting heart rate by age?',
      a: 'For adults of every age, a normal resting heart rate is 60 to 100 beats per minute; the big changes happen in childhood, when newborns run at 100–160 bpm and rates settle through the teens. Fit adults often sit lower (often 40–60 bpm), and some research links roughly 50–90 bpm with better long-term health. Within the normal range, your own trend tells you more than the population average.',
      links: [
        { href: '/articles/resting-heart-rate-by-age', label: 'Resting heart rate by age' },
        { href: '/tools/resting-heart-rate', label: 'Resting heart rate calculator' },
      ],
    },
    {
      q: 'Which resting heart rate is healthier, 50 or 80?',
      a: 'Both are within the normal range, but a lower resting heart rate usually reflects better cardiovascular fitness, because a stronger heart moves more blood per beat. In large population studies a resting rate toward the top of the normal range is linked with higher long-term risk. What matters most is where you sit for your age and whether your number is drifting up.',
      links: [{ href: '/articles/resting-heart-rate-by-age', label: 'Resting heart rate by age' }],
    },
    {
      q: 'Is a resting heart rate of 45 good?',
      a: 'In trained endurance athletes, a resting heart rate in the 40s is common and usually a sign of fitness. If you are not very active and your rate is this low — especially with dizziness, fainting, unusual tiredness or shortness of breath — it is worth checking with a doctor.',
      links: [{ href: '/articles/resting-heart-rate-by-age', label: 'Resting heart rate by age' }],
    },
    {
      q: 'What is an unsafe resting heart rate?',
      a: 'A resting rate that stays above 100 bpm (tachycardia), or below 60 bpm (bradycardia) is outside the usual adult range. A low rate is often normal in fit people; it matters mainly when it comes with dizziness, fainting or breathlessness — then see a doctor. Seek care promptly if a very fast or very slow rate comes with chest pain, fainting or breathlessness.',
      links: [{ href: '/articles/talk-to-your-doctor-about-wearable-data', label: 'Talking to your doctor about watch data' }],
    },
    {
      q: 'What is a good HRV?',
      a: 'There is no single good HRV number: it falls with age and differs by device. Median overnight RMSSD is roughly 58 ms in your twenties and about 30 ms in your sixties, with a wide healthy spread. A good HRV is one that is stable or rising against your own baseline.',
      links: [
        { href: '/articles/normal-hrv-by-age', label: 'Normal HRV by age' },
        { href: '/articles/hrv-questions-answered', label: '52 HRV questions, answered' },
        { href: '/tools/hrv', label: 'HRV calculator' },
      ],
    },
    {
      q: 'Why is my resting heart rate higher than usual?',
      a: 'The common causes of a temporary rise are alcohol, a short or broken night, a hard training block, an oncoming illness, dehydration, heat and stress. It usually comes with a lower HRV. If it settles within a few days, it was a normal response; if it stays up, look at recovery first.',
      links: [
        { href: '/articles/what-to-do-after-low-hrv-reading', label: 'What to do after a low HRV reading' },
        { href: '/articles/overtraining-hrv-resting-heart-rate', label: 'Overtraining, HRV and resting heart rate' },
      ],
    },
    {
      q: 'How many days of data do I need to see my real baseline?',
      a: 'About two weeks of consistent readings gives a usable range for resting heart rate and HRV; a month is better. Until then, most of what you see is ordinary day-to-day noise.',
      links: [
        { href: '/articles/your-baseline-knows-first', label: 'Your baseline knows first' },
        { href: '/tools/baseline', label: 'See your two-week range' },
      ],
    },
  ],
  breathing: [
    {
      q: 'What is the best breathing technique for anxiety?',
      a: 'For a sudden spike, the physiological sigh (two inhales through the nose, one long exhale) works within a few breaths. For a few calm minutes, box breathing (4-4-4-4) or 4-7-8 help by slowing you down and lengthening the exhale. The best technique is the one you will actually use when anxiety starts.',
      links: [
        { href: '/articles/physiological-sigh', label: 'The physiological sigh' },
        { href: '/articles/box-breathing-how-it-works', label: 'Box breathing' },
        { href: '/tools/breathing', label: 'Breathing timer' },
      ],
    },
    {
      q: 'How can I calm my nervous system quickly?',
      a: 'Make the exhale longer than the inhale. {{fact:claim.slowExhale}}. Slowing the breath also slows the heart within a minute or two; humming while you exhale is a common addition. Five minutes of slow breathing at about six breaths per minute is enough for most people to feel the shift.',
      links: [
        { href: '/articles/humming-breath-vagus', label: 'Humming breath and the vagus nerve' },
        { href: '/tools/resonance-breathing', label: 'Resonance breathing pacer' },
      ],
    },
    {
      q: 'What is the best breathing technique for sleep?',
      a: '4-7-8 is the most popular: inhale through the nose for 4, hold for 7, exhale through the mouth for 8, for four rounds. Slow breathing at about six breaths per minute for ten minutes in bed also helps many people with insomnia settle. Pick one and keep it the same every night.',
      links: [
        { href: '/articles/4-7-8-breathing', label: '4-7-8 breathing' },
        { href: '/articles/cardiac-coherence-insomnia-sleep', label: 'Cardiac coherence for insomnia' },
      ],
    },
    {
      q: 'What is the military breathing technique for sleep?',
      a: 'The so-called military method relaxes the body part by part — face, shoulders, arms, legs — while you breathe slowly and deeply, then clears the mind with a simple image for about ten seconds. The breathing part is ordinary slow belly breathing; it works best combined with a regular bedtime.',
      links: [
        { href: '/articles/4-7-8-breathing', label: '4-7-8 breathing' },
        { href: '/tools/breathing', label: 'Breathing timer' },
      ],
    },
    {
      q: 'How many minutes a day should I do breathing exercises?',
      a: 'Five minutes a day is a realistic start and is what many studies use. The cardiac coherence routine is three sessions of five minutes, morning, midday and evening. Consistency matters more than length.',
      links: [
        { href: '/articles/short-daily-breathing-routine', label: 'A short daily breathing routine' },
        { href: '/articles/cardiac-coherence-365-method', label: 'The 365 cardiac coherence method' },
      ],
    },
    {
      q: 'What is resonance (coherent) breathing, and how do I find my rate?',
      a: 'Resonance breathing is slow, even breathing — typically about 5.5 seconds in and 5.5 seconds out — at the pace where your heart rate swings most with each breath. For most adults that is about 5.5–6 breaths per minute, with individual rates from about 4.5 to 7; you find yours by trying a few paces and noting which feels and measures calmest.',
      links: [
        { href: '/articles/coherent-breathing-guide', label: 'Coherent breathing guide' },
        { href: '/articles/find-your-resonance-breathing-rate', label: 'Find your resonance rate' },
        { href: '/tools/resonance-breathing', label: 'Resonance breathing pacer' },
      ],
    },
    {
      q: 'Should I breathe through my nose or my mouth?',
      a: 'At rest and during most breathing practice, through the nose: it filters and warms the air and naturally slows the breath. Some techniques, such as 4-7-8, deliberately exhale through the mouth.',
      links: [{ href: '/articles/nose-vs-mouth-breathing', label: 'Nose vs mouth breathing' }],
    },
    {
      q: 'Is Wim Hof or fast breathing safe?',
      a: 'For healthy adults sitting or lying down, usually yes — but never practise it in or near water, while driving, or standing, because the breath holds can cause fainting. People who are pregnant or have epilepsy, heart conditions or uncontrolled high blood pressure should ask a doctor first.',
      links: [
        { href: '/articles/wim-hof-breathing-inflammation', label: 'Wim Hof breathing and inflammation' },
        { href: '/tools/wim-hof', label: 'Wim Hof timer' },
      ],
    },
    {
      q: 'How can I tell if shortness of breath is from anxiety?',
      a: 'Anxiety-related breathlessness usually comes with worry, a racing heart or tingling and eases as you calm down and slow your exhale. You cannot rule out a heart or lung cause yourself: get urgent help for breathlessness with chest pain, fainting, blue lips, or if it is new, severe or getting worse.',
      links: [{ href: '/articles/anxiety-panic-breathing-hrv', label: 'Anxiety, panic and breathing' }],
    },
  ],
  'sleep-body-clock': [
    {
      q: "How much sleep do I need?",
      a: "Most adults need 7–9 hours a night; teens need 8–10 and school-age children 9–11. The American Academy of Sleep Medicine recommends at least 7 hours for adults. People who claim they need only 5 or 6 hours are usually carrying sleep debt without noticing: in one study, two weeks of six-hour nights impaired people as much as two nights without sleep.",
      links: [{ href: "/articles/how-much-sleep-do-you-need", label: "How much sleep do you need?" }, { href: "/tools/sleep-debt", label: "Sleep debt calculator" }],
    },
    {
      q: "Can you catch up on lost sleep on weekends?",
      a: "Only partly. Long weekend lie-ins repay some sleep debt, but they also shift your body clock later, so Monday feels like jet lag. More than 30% of people live with a weekday-to-weekend gap of over two hours. A steady wake time seven days a week does more for your body clock than chasing extra hours on Saturday.",
      links: [{ href: "/articles/social-jet-lag-irregular-sleep", label: "Social jet lag" }, { href: "/tools/sleep-debt", label: "Sleep debt calculator" }],
    },
    {
      q: "How do I know if I am a night owl or a morning person?",
      a: "Look at when you naturally fall asleep and wake on a holiday with no alarm; that timing is the truest sign of your chronotype. Chronotype is largely inherited and changes with age: teenagers shift late, peaking around age 20, and people drift earlier again afterwards. A short questionnaire can place you on the lark-to-owl scale.",
      links: [{ href: "/articles/what-is-my-chronotype", label: "What is your chronotype?" }, { href: "/tools/chronotype", label: "Chronotype quiz" }],
    },
    {
      q: "How can I fall asleep fast when my mind is racing?",
      a: "Give your mind something dull to do. Cognitive shuffling means picturing a stream of random, unrelated neutral words or objects, one every few seconds, which crowds out worry and resembles the drifting thoughts of sleep onset. A long, slow exhale in bed also helps by calming your nervous system.",
      links: [{ href: "/articles/cognitive-shuffling", label: "Cognitive shuffling" }, { href: "/tools/cognitive-shuffle", label: "Cognitive shuffle tool" }],
    },
    {
      q: "What is the fastest way to get over jet lag?",
      a: "Use light at the right time. Bright daylight is the strongest signal to your body clock, and its timing decides whether it shifts earlier or later. Move your sleep about one hour per day towards the destination, starting a day or two before a big trip. For flights east across about five or more time zones, a low dose of melatonin in the destination evening also helps.",
      links: [{ href: "/articles/how-to-beat-jet-lag", label: "How to beat jet lag" }, { href: "/tools/jet-lag", label: "Jet lag planner" }],
    },
    {
      q: "How long are sleep cycles?",
      a: "A sleep cycle lasts roughly 90 minutes, and a full night contains about four to six of them. Waking at the end of a cycle, rather than in deep sleep, usually feels easier, which is why bedtime calculators count back in 90-minute steps from your alarm.",
      links: [{ href: "/tools/sleep-cycle", label: "Sleep cycle calculator" }, { href: "/articles/how-much-sleep-do-you-need", label: "How much sleep do you need?" }],
    },
  ],
  'stress-vagus': [
    {
      q: "How do I calm my nervous system quickly?",
      a: "Breathe with a longer exhale than inhale: in for 4, out for 6, low in the belly, for 3–5 minutes. {{fact:claim.slowExhale}}. Slowing the breath also slows your heart within minutes. Humming on the exhale or splashing cold water on your face for about 30 seconds works as a quick extra lever.",
      links: [{ href: "/articles/calm-your-nervous-system-down", label: "How to calm your nervous system down" }, { href: "/tools/breathing", label: "Breathing timer" }],
    },
    {
      q: "How can I stimulate my vagus nerve?",
      a: "The most reliable way is slow breathing, often with a longer exhale such as 4 in and 6 out. Humming, chanting or gargling for 30–60 seconds are also used — the vagus nerve supplies the vocal cords, so a vibration route is proposed, though the evidence is weaker. Cold water on the face triggers the dive reflex, which slows the heart. If a technique helps you, your HRV tends to rise while you practise.",
      links: [{ href: "/articles/vagus-nerve-exercises", label: "Vagus nerve exercises" }, { href: "/tools/resonance-breathing", label: "Resonance breathing" }],
    },
    {
      q: "How do I lower cortisol naturally?",
      a: "Start with sleep: 7–9 hours on a consistent schedule, because sleep loss disrupts the stress axis and keeps cortisol high. Add regular moderate exercise rather than constant high-intensity training, and a daily calming practice; a meta-analysis of 45 studies found meditation lowers cortisol. The goal is a healthy daily rhythm, high in the morning and low at night, not cortisol that is as low as possible.",
      links: [{ href: "/articles/how-to-lower-cortisol", label: "How to lower cortisol" }],
    },
    {
      q: "What are the signs of chronic stress?",
      a: "The key sign is that your body never fully switches off: you feel wired and tired, struggle to relax in the evening and wake unrefreshed. On a wearable, heart rate variability stays low through the evening and into sleep, so recovery never fully starts. See a doctor about persistent symptoms such as severe fatigue, unexplained weight changes or very high blood pressure.",
      links: [{ href: "/articles/chronic-stress-nervous-system-never-off", label: "The nervous system that never clocks out" }, { href: "/tools/burnout", label: "Burnout self-assessment" }],
    },
    {
      q: "Can you train your nervous system to handle stress better?",
      a: "Yes. Regular practice of slow breathing and other calming skills is associated with higher vagally mediated HRV and a faster return to calm after stress. Like fitness, it builds through short, repeated sessions, and it improves fastest when you can see the effect, for example with live heart-rate feedback.",
      links: [{ href: "/articles/how-to-train-your-nervous-system", label: "How to train your nervous system" }, { href: "/tools/nervous-system", label: "Nervous system check" }],
    },
  ],
  meditation: [
    {
      q: "How long should you meditate each day to see results?",
      a: "About 10 to 12 minutes a day is enough: trials using that dose found measurable changes in stress biology and well-being over 8 to 12 weeks. Consistency beats length — ten minutes daily works better than one long weekly session, and longer assigned sessions make more people drop out. Start with 5 to 10 minutes and grow from there.",
      links: [{ href: "/articles/how-much-meditation-do-you-need", label: "How much meditation do you need to see results?" }],
    },
    {
      q: "How long does it take for meditation to change the brain?",
      a: "Measurable changes start within weeks. Randomized trials found white-matter changes around the anterior and posterior cingulate cortex after 2 to 4 weeks (5 to 10 hours of training), and gray-matter growth in the posterior cingulate after roughly 10 hours. Stress markers such as cortisol and HRV shift over weeks of regular practice.",
      links: [{ href: "/articles/meditation-brain-changes-how-fast", label: "How fast does meditation change your brain?" }],
    },
    {
      q: "Can meditation have negative side effects?",
      a: "Yes. In a survey of 953 regular US meditators, over 10% reported adverse effects with a significant negative impact on their lives, most often anxiety, low mood or unsettling experiences. Risk rises with intensive practice such as long retreats, and in people with or at risk of serious mental illness. For 10–20 minutes of gentle daily practice the risk is low; if symptoms persist, stop and see a doctor.",
      links: [{ href: "/articles/meditation-adverse-effects-safety", label: "The side effects of meditation no one talks about" }],
    },
    {
      q: "Is breathwork better than meditation?",
      a: "Neither is better; they work differently. Breathwork acts in minutes: slow breathing at about six breaths per minute is associated with higher vagally mediated HRV while you practise and calms you fast, so it suits acute stress. Meditation works over weeks to months, building attention control and lower reactivity. Many people use breathwork for the moment and meditation for the long run.",
      links: [{ href: "/articles/meditation-vs-breathwork", label: "Meditation vs breathwork: which should you choose?" }, { href: "/tools/breathing", label: "Breathing exercise tool" }],
    },
    {
      q: "How do I know if meditation is working?",
      a: "Look at trends over weeks, not how one session felt. A rising baseline HRV and a resting heart rate that drifts down are the clearest objective signs. Record a couple of weeks of readings first to know your normal range, then compare; single days bounce with sleep, alcohol and stress.",
      links: [{ href: "/articles/measuring-meditation-progress", label: "How to measure your meditation progress" }, { href: "/tools/hrv", label: "HRV calculator" }],
    },
    {
      q: "Does MBSR actually work?",
      a: "Yes, with real but moderate effects. Mindfulness-Based Stress Reduction is an 8-week course created by Jon Kabat-Zinn in 1979 — weekly group classes, a full-day retreat and about 45 minutes of daily home practice — and it has been tested in hundreds of trials for stress, anxiety, depression and chronic pain. It is the most researched meditation program.",
      links: [{ href: "/articles/mbsr-mindfulness-clinical-evidence", label: "MBSR: does it actually work?" }],
    },
  ],
  'brain-focus-aging': [
    {
      q: "How can I improve my focus and concentration?",
      a: "Set the body state before you start: two minutes of slow, exhale-led breathing moves you toward a calm-alert state, and one slow breath works as a reset whenever attention drifts. Work on a single task with visual clutter removed, and treat each wandering as a rep — notice, breathe, return. Attention is a skill that improves with practice.",
      links: [{ href: "/articles/breathing-for-focus-and-attention", label: "Breathing for focus" }, { href: "/articles/physiological-concentration-flow-state-hardwired", label: "Physiological concentration: the flow state" }],
    },
    {
      q: "What brain chemicals control focus?",
      a: "Three work together: norepinephrine sets arousal and alertness, acetylcholine selects what you attend to, and dopamine supplies the reward signal that keeps you on task instead of switching. Too little arousal feels foggy, too much feels scattered; willpower alone cannot hold the state for long.",
      links: [{ href: "/articles/physiological-concentration-flow-state-hardwired", label: "Physiological concentration: the flow state" }],
    },
    {
      q: "What are alpha brain waves?",
      a: "Alpha waves are brain rhythms at 8 to 12 Hz that are strongest during relaxed, awake rest with the eyes closed, and also rise when attention turns inward. They are best understood as a sign of the brain turning down areas it does not need, not simply as a calm state.",
      links: [{ href: "/articles/neural-bridge-alpha-flow-gateway", label: "Alpha brain waves: calm, creativity and flow" }],
    },
    {
      q: "Do breathing exercises work for older adults?",
      a: "Yes. A 2021 study comparing young and older adults found a single session of slow, deep breathing raised vagally mediated HRV and lowered anxiety in both groups. A 2024 study in older adults found no blood-pressure change after one session, so that benefit, if it comes, builds over weeks. Keep sessions short and gentle — a few minutes is enough.",
      links: [{ href: "/articles/breathing-exercises-older-adults", label: "Do breathing exercises work for older adults?" }, { href: "/tools/resonance-breathing", label: "Resonance breathing tool" }],
    },
    {
      q: "What are the benefits of trataka (candle gazing)?",
      a: "Trataka is a yogic practice of holding your gaze on one point, traditionally a candle flame, and returning whenever attention drifts. It trains concentration, and an Indian study in elderly participants linked it to improved cognitive function. It pairs well with slow breathing before a focus task.",
      links: [{ href: "/articles/trataka-candle-gazing-focus", label: "Trataka (candle gazing)" }],
    },
  ],
  'heart-fitness-metabolism': [
    {
      q: "What is a good VO2 max for my age?",
      a: "It depends on age and sex. For men in their 30s, a good VO2 max is roughly 41–47 ml/kg/min; for women the same age, about 34–39. Without training it falls about 10% per decade after 30. The most reliable way to raise it is intervals: 4 × 4 minutes near 90–95% of max heart rate, with 3 easy minutes between, once or twice a week.",
      links: [{ href: "/articles/vo2max-increase-aerobic-engine", label: "VO₂max: Overclocking Your Aerobic Engine" }, { href: "/tools/vo2max", label: "VO₂max estimator" }],
    },
    {
      q: "What heart rate is zone 2?",
      a: "Zone 2 sits at about 60–70% of your maximum heart rate. The simple test: you can still hold a full conversation, but you would rather not. Aim for 150–180 minutes a week in blocks of 30–60 minutes, kept almost boringly easy — that is what builds the aerobic base.",
      links: [{ href: "/articles/zone-2-training-aerobic-base", label: "Zone 2 Training: Installing Your Aerobic Base Layer" }, { href: "/tools/zone-2", label: "Zone 2 heart rate calculator" }],
    },
    {
      q: "How much protein do I need per day to build muscle?",
      a: "About 1.6 g per kg of body weight per day, the point where muscle gains plateau in a large meta-analysis. The official 0.8 g/kg is only the floor for avoiding deficiency. In a calorie deficit, going toward ~2.2 g/kg better protects lean mass, and splitting protein across 3–4 meals works better than one or two big ones.",
      links: [{ href: "/articles/protein-intake-muscle-protein-synthesis", label: "Protein: Provisioning the Build Queue" }, { href: "/tools/protein", label: "Protein calculator" }],
    },
    {
      q: "How do I calculate my maintenance calories?",
      a: "Estimate your resting burn with a predictive equation, then multiply by an activity factor to get your TDEE — the calories that keep your weight stable. These equations are accurate to about ±10% for most people, so treat the result as a starting point and adjust after two weeks of real weight data. To lose, eat about 15–20% below it.",
      links: [{ href: "/articles/how-to-calculate-maintenance-calories", label: "How to Calculate Your Maintenance Calories (TDEE)" }, { href: "/tools/tdee", label: "TDEE calculator" }],
    },
    {
      q: "Can breathing exercises lower blood pressure?",
      a: "Yes, modestly. Slow breathing at about six breaths per minute trains the baroreflex, the system that steadies blood pressure, and reduces sympathetic drive. A practical dose is ten minutes once a day. It supports, but does not replace, treatment — if you have high blood pressure, keep working with your doctor.",
      links: [{ href: "/articles/high-blood-pressure-slow-breathing", label: "What Slow Breathing Actually Does to Blood Pressure" }, { href: "/tools/resonance-breathing", label: "Resonance breathing" }],
    },
  ],
  lifestyle: [
    {
      q: "How long does caffeine stay in your system?",
      a: "Caffeine has a half-life of about 5–6 hours, so half a dose is still in your blood that long after drinking it, and a quarter remains 10–12 hours later. To protect deep sleep, stop caffeine 8–10 hours before bed — for most people that means an early-afternoon cut-off.",
      links: [{ href: "/articles/caffeine-half-life-sleep-pressure", label: "Caffeine: Hacking the Adenosine Block" }, { href: "/tools/caffeine", label: "Caffeine cut-off calculator" }],
    },
    {
      q: "How long does alcohol stay in your system?",
      a: "Your liver clears about 0.015% blood alcohol per hour — roughly one standard drink per hour — and coffee, food or cold showers do not speed it up. Four drinks can take 5–6 hours or more to clear. Stopping at least 3 hours before bed limits the damage to sleep and HRV.",
      links: [{ href: "/articles/how-long-does-alcohol-stay-in-your-system", label: "How Long Does Alcohol Stay in Your System?" }, { href: "/tools/alcohol", label: "Alcohol calculator" }],
    },
    {
      q: "Does alcohol lower HRV?",
      a: "Yes, and the effect scales with the dose. In aggregate wearable data one drink lowers overnight HRV by about 3–4% and raises sleeping heart rate by 1–3 bpm; four drinks cut HRV by roughly 15%. A low HRV the morning after drinking is an expected response, not a mystery.",
      links: [{ href: "/articles/how-much-alcohol-lowers-hrv", label: "How Much Does Alcohol Lower Your HRV?" }],
    },
    {
      q: "How much water should I drink a day?",
      a: "A practical target is about 35 ml per kg of body weight — roughly 2.4 litres for a 70 kg adult — plus 350–700 ml per hour of exercise, more in heat. About 20% of your water comes from food. Pale-yellow urine is the simplest real-time check that you are drinking enough.",
      links: [{ href: "/articles/how-much-water-should-you-drink", label: "How Much Water Should You Drink a Day?" }, { href: "/tools/water", label: "Water intake calculator" }],
    },
    {
      q: "Does a dopamine detox actually work?",
      a: "Not as the name suggests: you cannot flush or reset dopamine by abstaining for a day, and screens do not deplete it. What does work is the behaviour underneath — stimulus control. Cutting specific high-reward loops for a set window, and changing the cues around them, can make ordinary tasks feel rewarding again.",
      links: [{ href: "/articles/does-dopamine-detox-work", label: "Does a Dopamine Detox Actually Work?" }, { href: "/tools/dopamine-detox", label: "Dopamine reset planner" }],
    },
    {
      q: "How do I get rid of brain fog?",
      a: "Start with sleep, the most common cause: a consistent wake time and 7–9 hours usually brings attention back fast. Then time caffeine early and check hydration, alcohol and long screen stretches. If brain fog persists for weeks despite good sleep, see a doctor to rule out a medical cause.",
      links: [{ href: "/articles/how-to-get-rid-of-brain-fog", label: "How to Get Rid of Brain Fog" }, { href: "/tools/brain-fog", label: "Brain fog check" }],
    },
  ],
  'doctors-your-data': [
    {
      q: "Should I show my doctor my smartwatch data?",
      a: "Yes, if something has changed or you have symptoms — but bring a summary, not your phone. Doctors find trends, context and dates useful: a resting heart rate that rose for weeks, shorter sleep, a dated alert. A single HRV reading or a brand's readiness score means little to them. Watch data is context, never a diagnosis.",
      links: [{ href: "/articles/talk-to-your-doctor-about-wearable-data", label: "How to Talk to Your Doctor About Your Watch Data" }],
    },
    {
      q: "How do I prepare wearable data for a doctor's appointment?",
      a: "Spend about twenty minutes turning it into one page: your baseline over a calm period, what changed and when, two or three dated trend charts covering four to eight weeks, context such as illness, medication or alcohol, your symptoms, and your written questions. One page gets read; forty screenshots don't.",
      links: [{ href: "/articles/talk-to-your-doctor-about-wearable-data", label: "How to Talk to Your Doctor About Your Watch Data" }],
    },
    {
      q: "Which doctor should I see about my heart rate or HRV data?",
      a: "In most healthcare systems, start with your GP: they see your whole history, rule out everyday causes like infection, medication, sleep or alcohol, and refer you on only if needed. A cardiologist comes next for palpitations or a pulse raised for weeks; a sleep specialist for unrefreshing sleep or snoring; a sports doctor for stalled recovery.",
      links: [{ href: "/articles/doctors-and-your-data", label: "Doctors and Your Data" }, { href: "/articles/onda-report-for-your-gp", label: "Showing Your Heart Data to Your GP" }],
    },
    {
      q: "Can a smartwatch detect heart rhythm problems?",
      a: "A heart-rate trend cannot: pulse is not rhythm, and only an ECG-type recording shows the rhythm itself. Some watches have a separately cleared ECG app or irregular rhythm notification — if one fired, bring the date and time. A cardiologist may then use an ECG, a Holter monitor or an event monitor to capture an episode.",
      links: [{ href: "/articles/onda-report-for-your-cardiologist", label: "Showing Your Heart Data to a Cardiologist" }],
    },
    {
      q: "Can my watch tell if I have sleep apnea?",
      a: "No. Nightly breathing rate and heart rate can add weight to the question, especially if you snore or wake unrefreshed, but they don't detect sleep apnea. That takes a home sleep apnea test or an overnight sleep study, which measure breathing, oxygen and sleep stages directly. Some watches have a separately cleared apnea notification — bring any alert with its date.",
      links: [{ href: "/articles/onda-report-for-your-sleep-specialist", label: "Showing Your Night Data to a Sleep Specialist" }],
    },
    {
      q: "When should I stop checking my watch and see a doctor?",
      a: "Immediately, without checking any app, if you have chest pain, fainting or severe breathlessness. Book a normal appointment if a change lasts for weeks rather than days — for example a resting pulse up by about 10 beats — or comes with symptoms like unusual tiredness or palpitations. Never change or stop medication based on watch data.",
      links: [{ href: "/articles/talk-to-your-doctor-about-wearable-data", label: "How to Talk to Your Doctor About Your Watch Data" }, { href: "/articles/doctors-and-your-data", label: "Doctors and Your Data" }],
    },
  ],
  world: [
    {
      q: "Does forest bathing (shinrin-yoku) really work?",
      a: "Measurably, yes. In a Japanese study across 38 forests, time among trees versus in the city lowered cortisol by 12.4%, cut sympathetic activity by 7.0%, lowered blood pressure and heart rate, and raised parasympathetic activity by 55.0%. The effect is a real shift toward calm, driven partly by compounds trees release into the air.",
      links: [{ href: "/articles/forest-bathing-shinrin-yoku-science", label: "Forest Bathing (Shinrin-yoku): What Japanese Research Actually Measured" }],
    },
    {
      q: "What is the 365 method of cardiac coherence?",
      a: "It is France's structured form of slow breathing: 3 times a day, 6 breaths per minute, for 5 minutes. Breathing at about six breaths a minute brings heart rhythm and breath into step and shifts the nervous system toward balance. It is essentially the clinical version of what English sources call coherent or resonance breathing.",
      links: [{ href: "/articles/cardiac-coherence-365-method", label: "Cardiac Coherence and the 365 Method" }, { href: "/tools/resonance-breathing", label: "Resonance breathing" }],
    },
    {
      q: "Does Wim Hof breathing reduce inflammation?",
      a: "Research at Radboud University in the Netherlands suggests it can: trained practitioners blunted their inflammatory response to an injected bacterial toxin. A follow-up study found the breathing technique did the work, while cold exposure alone did not significantly reduce inflammation. If the anti-inflammatory effect is your goal, the ice bath is optional.",
      links: [{ href: "/articles/wim-hof-breathing-inflammation", label: "Wim Hof Breathing and Inflammation" }],
    },
    {
      q: "Does yoga nidra help you sleep?",
      a: "Research suggests it can improve sleep quality. Yoga nidra, or yogic sleep, is guided deep relaxation done lying down that holds you at the edge of sleep, shifting the brain toward slower, sleep-like waves and calming the autonomic nervous system. For people who lie awake with a racing mind, it is a structured, low-risk practice.",
      links: [{ href: "/articles/yoga-nidra-sleep-science", label: "Yoga Nidra for Sleep: The Science of 'Yogic Sleep'" }],
    },
  ],
}

/** EN hub FAQs with {{fact:…}} resolved. */
export const TOPIC_HUB_FAQ: Partial<Record<ArticleTopicSlug, HubFaqItem[]>> = resolveFactsDeep(TOPIC_HUB_FAQ_RAW, 'topic-hub-faq')

// ── Localized blocks (src/data/topic-hub-faq-i18n/<lang>.json; en.json mirrors the above) ──
import { resolveFactsDeep, type FactLang } from './science/facts'
import type { Lang } from '../i18n'
import es from './topic-hub-faq-i18n/es.json'
import ru from './topic-hub-faq-i18n/ru.json'
import uk from './topic-hub-faq-i18n/uk.json'
import zh from './topic-hub-faq-i18n/zh.json'
import de from './topic-hub-faq-i18n/de.json'
import fr from './topic-hub-faq-i18n/fr.json'
import it from './topic-hub-faq-i18n/it.json'
import nl from './topic-hub-faq-i18n/nl.json'
import ja from './topic-hub-faq-i18n/ja.json'
import pl from './topic-hub-faq-i18n/pl.json'
import pt from './topic-hub-faq-i18n/pt.json'

type HubFaqFile = { heading: string; hubs: Partial<Record<ArticleTopicSlug, HubFaqItem[]>> }
const LOCALIZED: Partial<Record<Lang, HubFaqFile>> = { es, ru, uk, zh, de, fr, it, nl, ja, pl, pt } as Partial<Record<Lang, HubFaqFile>>

/** The hub's FAQ block in this language, or null (heading has a {topic} placeholder). */
export function hubFaqFor(topic: ArticleTopicSlug, lang: Lang): { heading: string; items: HubFaqItem[] } | null {
  if (lang === 'en') {
    const items = TOPIC_HUB_FAQ[topic]
    return items ? { heading: 'Common questions about {topic}', items } : null
  }
  const f = LOCALIZED[lang]
  const items = f?.hubs[topic]
  return f && items ? { heading: f.heading, items: resolveFactsDeep(items, `topic-hub-faq-i18n/${lang}.${topic}`, lang as FactLang) } : null
}
