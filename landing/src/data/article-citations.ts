/**
 * Verified primary sources per article (roadmap 9.1). Each entry was resolved
 * against Crossref/PubMed — first author, year and topic must match the article's
 * claim; unresolvable citations are NOT listed (never invent a DOI).
 *
 * Rendered as the "Sources" block at the end of the article (every language — the
 * references themselves are language-neutral) and emitted as schema.org `citation`
 * (ScholarlyArticle) on the TechArticle JSON-LD. Shipped to the browser inside the
 * article's own body file (scripts/generate-article-chunks.ts), not as a bundle.
 *
 * Filled by: npx tsx scripts/import-citations.ts <dir with <slug>.json results>
 */
export interface StudyCitation {
  title: string
  authors: string
  year: number
  journal?: string
  doi?: string
  pmid?: string
  url: string
}

export const ARTICLE_CITATIONS: Record<string, StudyCitation[]> = {
  "4-7-8-breathing": [
    {
      "title": "Effects of sleep deprivation and 4-7-8 breathing control on heart rate variability, blood pressure, blood glucose, and endothelial function in healthy young adults",
      "authors": "Vierra J et al.",
      "year": 2022,
      "journal": "Physiological Reports",
      "doi": "10.14814/phy2.15389",
      "pmid": "35822447",
      "url": "https://doi.org/10.14814/phy2.15389"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "acc-calibration-protocol-cognitive-control": [
    {
      "title": "Conflict monitoring and anterior cingulate cortex: an update",
      "authors": "Botvinick MM et al.",
      "year": 2004,
      "journal": "Trends in Cognitive Sciences",
      "doi": "10.1016/j.tics.2004.10.003",
      "pmid": "15556023",
      "url": "https://doi.org/10.1016/j.tics.2004.10.003"
    }
  ],
  "active-intervention-vs-passive-tracking": [
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Applied Psychophysiology and Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "ancestral-sync-circadian-anchors": [
    {
      "title": "Meal Timing Regulates the Human Circadian System",
      "authors": "Wehrens SMT et al.",
      "year": 2017,
      "journal": "Current Biology",
      "doi": "10.1016/j.cub.2017.04.059",
      "pmid": "28578930",
      "url": "https://doi.org/10.1016/j.cub.2017.04.059"
    }
  ],
  "anterior-cingulate-core-coherence-monitoring": [
    {
      "title": "Conflict monitoring and anterior cingulate cortex: an update",
      "authors": "Botvinick MM et al.",
      "year": 2004,
      "journal": "Trends in Cognitive Sciences",
      "doi": "10.1016/j.tics.2004.10.003",
      "pmid": "15556023",
      "url": "https://doi.org/10.1016/j.tics.2004.10.003"
    }
  ],
  "anxiety-panic-breathing-hrv": [
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Reports Medicine",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    },
    {
      "title": "The effect of heart rate variability biofeedback training on stress and anxiety: a meta-analysis",
      "authors": "Goessl VC et al.",
      "year": 2017,
      "journal": "Psychological Medicine",
      "doi": "10.1017/S0033291717001003",
      "pmid": "28478782",
      "url": "https://doi.org/10.1017/S0033291717001003"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    }
  ],
  "apple-watch-recovery-hrv-vs-overall-hrv": [
    {
      "title": "Heart rate variability: standards of measurement, physiological interpretation and clinical use",
      "authors": "Task Force of the ESC and NASPE",
      "year": 1996,
      "journal": "Circulation",
      "pmid": "8598068",
      "url": "https://pubmed.ncbi.nlm.nih.gov/8598068/"
    },
    {
      "title": "An Overview of Heart Rate Variability Metrics and Norms",
      "authors": "Shaffer F, Ginsberg JP",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00258",
      "pmid": "29034226",
      "url": "https://doi.org/10.3389/fpubh.2017.00258"
    },
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    },
    {
      "title": "A quantitative systematic review of normal values for short-term heart rate variability in healthy adults",
      "authors": "Nunan D et al.",
      "year": 2010,
      "journal": "Pacing and Clinical Electrophysiology",
      "doi": "10.1111/j.1540-8159.2010.02841.x",
      "pmid": "20663071",
      "url": "https://doi.org/10.1111/j.1540-8159.2010.02841.x"
    }
  ],
  "attention-trainable-skill-meditation": [
    {
      "title": "Long-term meditators self-induce high-amplitude gamma synchrony during mental practice",
      "authors": "Lutz A et al.",
      "year": 2004,
      "journal": "PNAS",
      "doi": "10.1073/pnas.0407401101",
      "pmid": "15534199",
      "url": "https://doi.org/10.1073/pnas.0407401101"
    },
    {
      "title": "Meditation experience is associated with increased cortical thickness",
      "authors": "Lazar SW et al.",
      "year": 2005,
      "journal": "NeuroReport",
      "doi": "10.1097/01.wnr.0000186598.66243.19",
      "pmid": "16272874",
      "url": "https://doi.org/10.1097/01.wnr.0000186598.66243.19"
    }
  ],
  "baroreflex-01hz-shift": [
    {
      "title": "Heart rate variability biofeedback increases baroreflex gain and peak expiratory flow",
      "authors": "Lehrer PM et al.",
      "year": 2003,
      "journal": "Psychosomatic Medicine",
      "doi": "10.1097/01.psy.0000089200.81962.19",
      "pmid": "14508023",
      "url": "https://doi.org/10.1097/01.psy.0000089200.81962.19"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    }
  ],
  "bhastrika-pranayama-brain-anxiety": [
    {
      "title": "Effects of Yoga Respiratory Practice (Bhastrika pranayama) on Anxiety, Affect, and Brain Functional Connectivity and Activity: A Randomized Controlled Trial",
      "authors": "Novaes MM et al.",
      "year": 2020,
      "journal": "Frontiers in Psychiatry",
      "doi": "10.3389/fpsyt.2020.00467",
      "pmid": "32528330",
      "url": "https://doi.org/10.3389/fpsyt.2020.00467"
    }
  ],
  "box-breathing-how-it-works": [
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Reports Medicine",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    }
  ],
  "breathing-exercises-older-adults": [
    {
      "title": "Benefits from one session of deep and slow breathing on vagal tone and anxiety in young and older adults",
      "authors": "Magnon V et al.",
      "year": 2021,
      "journal": "Scientific Reports",
      "doi": "10.1038/s41598-021-98736-9",
      "pmid": "34588511",
      "url": "https://doi.org/10.1038/s41598-021-98736-9"
    }
  ],
  "breathing-for-focus-and-attention": [
    {
      "title": "Nasal Respiration Entrains Human Limbic Oscillations and Modulates Cognitive Function",
      "authors": "Zelano C et al.",
      "year": 2016,
      "journal": "Journal of Neuroscience",
      "doi": "10.1523/JNEUROSCI.2586-16.2016",
      "pmid": "27927961",
      "url": "https://doi.org/10.1523/JNEUROSCI.2586-16.2016"
    },
    {
      "title": "The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults",
      "authors": "Ma X et al.",
      "year": 2017,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2017.00874",
      "pmid": "28626434",
      "url": "https://doi.org/10.3389/fpsyg.2017.00874"
    }
  ],
  "breathing-lowers-stress-hormones": [
    {
      "title": "The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults",
      "authors": "Ma X et al.",
      "year": 2017,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2017.00874",
      "pmid": "28626434",
      "url": "https://doi.org/10.3389/fpsyg.2017.00874"
    }
  ],
  "breathwork-command-line-interface": [
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Rep Med",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Front Hum Neurosci",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "cacao-stem-cells": [
    {
      "title": "Improvement of endothelial function with dietary flavanols is associated with mobilization of circulating angiogenic cells in patients with coronary artery disease",
      "authors": "Heiss C et al.",
      "year": 2010,
      "journal": "J Am Coll Cardiol",
      "doi": "10.1016/j.jacc.2010.03.039",
      "pmid": "20620742",
      "url": "https://doi.org/10.1016/j.jacc.2010.03.039"
    }
  ],
  "caffeine-half-life-sleep-pressure": [
    {
      "title": "Actions of caffeine in the brain with special reference to factors that contribute to its widespread use",
      "authors": "Fredholm BB et al.",
      "year": 1999,
      "journal": "Pharmacol Rev",
      "pmid": "10049999",
      "url": "https://pubmed.ncbi.nlm.nih.gov/10049999/"
    },
    {
      "title": "Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed",
      "authors": "Drake C et al.",
      "year": 2013,
      "journal": "J Clin Sleep Med",
      "doi": "10.5664/jcsm.3170",
      "pmid": "24235903",
      "url": "https://doi.org/10.5664/jcsm.3170"
    }
  ],
  "caffeine-hrv-resting-heart-rate": [
    {
      "title": "Actions of caffeine in the brain with special reference to factors that contribute to its widespread use",
      "authors": "Fredholm BB et al.",
      "year": 1999,
      "journal": "Pharmacol Rev",
      "pmid": "10049999",
      "url": "https://pubmed.ncbi.nlm.nih.gov/10049999/"
    },
    {
      "title": "Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed",
      "authors": "Drake C et al.",
      "year": 2013,
      "journal": "J Clin Sleep Med",
      "doi": "10.5664/jcsm.3170",
      "pmid": "24235903",
      "url": "https://doi.org/10.5664/jcsm.3170"
    }
  ],
  "calm-your-nervous-system-down": [
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Front Hum Neurosci",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Rep Med",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    }
  ],
  "cardiac-coherence-365-method": [
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "cardiac-coherence-insomnia-sleep": [
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "chm-continuous-hormone-monitoring": [
    {
      "title": "Molecularly selective nanoporous membrane-based wearable organic electrochemical device for noninvasive cortisol sensing",
      "authors": "Parlak O, Keene ST, Marais A, Curto VF, Salleo A",
      "year": 2018,
      "journal": "Science Advances",
      "doi": "10.1126/sciadv.aar2904",
      "pmid": "30035216",
      "url": "https://doi.org/10.1126/sciadv.aar2904"
    },
    {
      "title": "Investigation of cortisol dynamics in human sweat using a graphene-based wireless mHealth system",
      "authors": "Torrente-Rodríguez RM et al.",
      "year": 2020,
      "journal": "Matter",
      "doi": "10.1016/j.matt.2020.01.021",
      "pmid": "32266329",
      "url": "https://doi.org/10.1016/j.matt.2020.01.021"
    },
    {
      "title": "Wearable aptamer-field-effect transistor sensing system for noninvasive cortisol monitoring",
      "authors": "Wang B et al.",
      "year": 2022,
      "journal": "Science Advances",
      "doi": "10.1126/sciadv.abk0967",
      "pmid": "34985954",
      "url": "https://doi.org/10.1126/sciadv.abk0967"
    },
    {
      "title": "Stressomic: A wearable microfluidic biosensor for dynamic profiling of multiple stress hormones in sweat",
      "authors": "Tu J et al.",
      "year": 2025,
      "journal": "Science Advances",
      "doi": "10.1126/sciadv.adx6491",
      "pmid": "40768584",
      "url": "https://doi.org/10.1126/sciadv.adx6491"
    },
    {
      "title": "A wearable aptamer nanobiosensor for non-invasive female hormone monitoring",
      "authors": "Ye C, Wang M, Min J, et al.; Gao W",
      "year": 2024,
      "journal": "Nature Nanotechnology",
      "doi": "10.1038/s41565-023-01513-0",
      "pmid": "37770648",
      "url": "https://doi.org/10.1038/s41565-023-01513-0"
    },
    {
      "title": "Accessing analytes in biofluids for peripheral biochemical monitoring",
      "authors": "Heikenfeld J et al.",
      "year": 2019,
      "journal": "Nature Biotechnology",
      "doi": "10.1038/s41587-019-0040-3",
      "pmid": "30804536",
      "url": "https://doi.org/10.1038/s41587-019-0040-3"
    },
    {
      "title": "Free cortisol levels after awakening: a reliable biological marker for the assessment of adrenocortical activity",
      "authors": "Pruessner JC et al.",
      "year": 1997,
      "journal": "Life Sciences",
      "doi": "10.1016/s0024-3205(97)01008-4",
      "pmid": "9416776",
      "url": "https://doi.org/10.1016/s0024-3205(97)01008-4"
    },
    {
      "title": "Assessment of the cortisol awakening response: Expert consensus guidelines",
      "authors": "Stalder T et al.",
      "year": 2016,
      "journal": "Psychoneuroendocrinology",
      "doi": "10.1016/j.psyneuen.2015.10.010",
      "pmid": "26563991",
      "url": "https://doi.org/10.1016/j.psyneuen.2015.10.010"
    },
    {
      "title": "Diurnal cortisol slopes and mental and physical health outcomes: A systematic review and meta-analysis",
      "authors": "Adam EK, Quinn ME, Tavernier R, McQuillan MT, Dahlke KA, Gilbert KE",
      "year": 2017,
      "journal": "Psychoneuroendocrinology",
      "doi": "10.1016/j.psyneuen.2017.05.018",
      "pmid": "28578301",
      "url": "https://doi.org/10.1016/j.psyneuen.2017.05.018"
    },
    {
      "title": "Salivary cortisol as a biomarker in stress research",
      "authors": "Hellhammer DH, Wüst S, Kudielka BM",
      "year": 2009,
      "journal": "Psychoneuroendocrinology",
      "doi": "10.1016/j.psyneuen.2008.10.026",
      "pmid": "19095358",
      "url": "https://doi.org/10.1016/j.psyneuen.2008.10.026"
    },
    {
      "title": "The diagnosis of Cushing's syndrome: an Endocrine Society Clinical Practice Guideline",
      "authors": "Nieman LK et al.",
      "year": 2008,
      "journal": "Journal of Clinical Endocrinology & Metabolism",
      "doi": "10.1210/jc.2008-0125",
      "pmid": "18334580",
      "url": "https://doi.org/10.1210/jc.2008-0125"
    },
    {
      "title": "Diagnosis and Treatment of Primary Adrenal Insufficiency: An Endocrine Society Clinical Practice Guideline",
      "authors": "Bornstein SR et al.",
      "year": 2016,
      "journal": "Journal of Clinical Endocrinology & Metabolism",
      "doi": "10.1210/jc.2015-1710",
      "pmid": "26760044",
      "url": "https://doi.org/10.1210/jc.2015-1710"
    }
  ],
  "chronic-stress-nervous-system-never-off": [
    {
      "title": "Protective and damaging effects of stress mediators",
      "authors": "McEwen BS",
      "year": 1998,
      "journal": "N Engl J Med",
      "doi": "10.1056/NEJM199801153380307",
      "pmid": "9428819",
      "url": "https://doi.org/10.1056/NEJM199801153380307"
    }
  ],
  "chronotherapy-light-dark-timing": [
    {
      "title": "The efficacy of light therapy in the treatment of mood disorders: a review and meta-analysis of the evidence",
      "authors": "Golden RN et al.",
      "year": 2005,
      "journal": "Am J Psychiatry",
      "doi": "10.1176/appi.ajp.162.4.656",
      "pmid": "15800134",
      "url": "https://doi.org/10.1176/appi.ajp.162.4.656"
    },
    {
      "title": "Action spectrum for melatonin regulation in humans: evidence for a novel circadian photoreceptor",
      "authors": "Brainard GC et al.",
      "year": 2001,
      "journal": "J Neurosci",
      "doi": "10.1523/JNEUROSCI.21-16-06405.2001",
      "pmid": "11487664",
      "url": "https://doi.org/10.1523/JNEUROSCI.21-16-06405.2001"
    }
  ],
  "circadian-lighting-dark-therapy": [
    {
      "title": "Action spectrum for melatonin regulation in humans: evidence for a novel circadian photoreceptor",
      "authors": "Brainard GC et al.",
      "year": 2001,
      "journal": "J Neurosci",
      "doi": "10.1523/JNEUROSCI.21-16-06405.2001",
      "pmid": "11487664",
      "url": "https://doi.org/10.1523/JNEUROSCI.21-16-06405.2001"
    },
    {
      "title": "Exposure to room light before bedtime suppresses melatonin onset and shortens melatonin duration in humans",
      "authors": "Gooley JJ et al.",
      "year": 2011,
      "journal": "J Clin Endocrinol Metab",
      "doi": "10.1210/jc.2010-2098",
      "pmid": "21193540",
      "url": "https://doi.org/10.1210/jc.2010-2098"
    }
  ],
  "circadian-reset-mastering-light": [
    {
      "title": "Action spectrum for melatonin regulation in humans: evidence for a novel circadian photoreceptor",
      "authors": "Brainard GC et al.",
      "year": 2001,
      "journal": "J Neurosci",
      "doi": "10.1523/JNEUROSCI.21-16-06405.2001",
      "pmid": "11487664",
      "url": "https://doi.org/10.1523/JNEUROSCI.21-16-06405.2001"
    },
    {
      "title": "Exposure to room light before bedtime suppresses melatonin onset and shortens melatonin duration in humans",
      "authors": "Gooley JJ et al.",
      "year": 2011,
      "journal": "J Clin Endocrinol Metab",
      "doi": "10.1210/jc.2010-2098",
      "pmid": "21193540",
      "url": "https://doi.org/10.1210/jc.2010-2098"
    }
  ],
  "co2-tolerance-expanding-oxygen-limit": [
    {
      "title": "False suffocation alarms, spontaneous panics, and related conditions. An integrative hypothesis",
      "authors": "Klein DF",
      "year": 1993,
      "journal": "Archives of General Psychiatry",
      "doi": "10.1001/archpsyc.1993.01820160076009",
      "pmid": "8466392",
      "url": "https://doi.org/10.1001/archpsyc.1993.01820160076009"
    },
    {
      "title": "Ventilatory responses to hypercapnia in divers and non-divers: effects of posture and immersion",
      "authors": "Delapille P et al.",
      "year": 2001,
      "journal": "European Journal of Applied Physiology",
      "doi": "10.1007/s004210100518",
      "pmid": "11820330",
      "url": "https://doi.org/10.1007/s004210100518"
    },
    {
      "title": "The Buteyko breathing technique for asthma: a review",
      "authors": "Bruton A, Lewith GT",
      "year": 2005,
      "journal": "Complementary Therapies in Medicine",
      "doi": "10.1016/j.ctim.2005.01.003",
      "pmid": "15907677",
      "url": "https://doi.org/10.1016/j.ctim.2005.01.003"
    },
    {
      "title": "A randomised controlled trial of the Buteyko technique as an adjunct to conventional management of asthma",
      "authors": "Cowie RL et al.",
      "year": 2008,
      "journal": "Respiratory Medicine",
      "doi": "10.1016/j.rmed.2007.12.012",
      "pmid": "18249107",
      "url": "https://doi.org/10.1016/j.rmed.2007.12.012"
    },
    {
      "title": "Integration of cerebrovascular CO2 reactivity and chemoreflex control of breathing: mechanisms of regulation, measurement, and interpretation",
      "authors": "Ainslie PN, Duffin J",
      "year": 2009,
      "journal": "American Journal of Physiology - Regulatory, Integrative and Comparative Physiology",
      "doi": "10.1152/ajpregu.91008.2008",
      "pmid": "19211719",
      "url": "https://doi.org/10.1152/ajpregu.91008.2008"
    },
    {
      "title": "The physiology and pathophysiology of human breath-hold diving",
      "authors": "Lindholm P, Lundgren CE",
      "year": 2009,
      "journal": "Journal of Applied Physiology",
      "doi": "10.1152/japplphysiol.90991.2008",
      "pmid": "18974367",
      "url": "https://doi.org/10.1152/japplphysiol.90991.2008"
    },
    {
      "title": "Changes in respiration mediate changes in fear of bodily sensations in panic disorder",
      "authors": "Meuret AE et al.",
      "year": 2009,
      "journal": "Journal of Psychiatric Research",
      "doi": "10.1016/j.jpsychires.2008.08.003",
      "pmid": "18835608",
      "url": "https://doi.org/10.1016/j.jpsychires.2008.08.003"
    },
    {
      "title": "Fatal and nonfatal drowning outcomes related to dangerous underwater breath-holding behaviors - New York State, 1988-2011",
      "authors": "Boyd C et al.",
      "year": 2015,
      "journal": "MMWR Morbidity and Mortality Weekly Report",
      "pmid": "25996093",
      "url": "https://pubmed.ncbi.nlm.nih.gov/25996093/"
    },
    {
      "title": "The magnitude of the Bohr effect profoundly influences the shape and position of the blood oxygen equilibrium curve",
      "authors": "Malte H et al.",
      "year": 2021,
      "journal": "Comp Biochem Physiol A Mol Integr Physiol",
      "doi": "10.1016/j.cbpa.2020.110880",
      "pmid": "33358924",
      "url": "https://doi.org/10.1016/j.cbpa.2020.110880"
    },
    {
      "title": "Body Oxygen Level Test (BOLT) is not associated with exercise performance in highly-trained individuals",
      "authors": "Kowalski T et al.",
      "year": 2024,
      "journal": "Frontiers in Physiology",
      "doi": "10.3389/fphys.2024.1430837",
      "pmid": "39290618",
      "url": "https://doi.org/10.3389/fphys.2024.1430837"
    }
  ],
  "cognitive-architecture-neural-throughput": [
    {
      "title": "Action spectrum for melatonin regulation in humans: evidence for a novel circadian photoreceptor",
      "authors": "Brainard GC et al.",
      "year": 2001,
      "journal": "J Neurosci",
      "doi": "10.1523/JNEUROSCI.21-16-06405.2001",
      "pmid": "11487664",
      "url": "https://doi.org/10.1523/JNEUROSCI.21-16-06405.2001"
    }
  ],
  "cognitive-architecture-nootropic-stacks": [
    {
      "title": "Meta-analysis of randomized controlled trials on cognitive effects of Bacopa monnieri extract",
      "authors": "Kongkeaw C et al.",
      "year": 2014,
      "journal": "J Ethnopharmacol",
      "doi": "10.1016/j.jep.2013.11.008",
      "pmid": "24252493",
      "url": "https://doi.org/10.1016/j.jep.2013.11.008"
    }
  ],
  "cognitive-shuffling": [
    {
      "title": "Towards an integrative design-oriented theory of sleep-onset and insomnolence from which a new cognitive treatment for insomnolence (serial diverse kinesthetic imagining, a form of cognitive shuffling) is proposed for experimentally testing this against alternatives",
      "authors": "Beaudoin L et al.",
      "year": 2019,
      "journal": "Sleep Medicine (conference abstract, vol 64, S29)",
      "doi": "10.1016/j.sleep.2019.11.081",
      "url": "https://doi.org/10.1016/j.sleep.2019.11.081"
    },
    {
      "title": "A cognitive model of insomnia",
      "authors": "Harvey AG",
      "year": 2002,
      "journal": "Behaviour Research and Therapy",
      "doi": "10.1016/s0005-7967(01)00061-4",
      "pmid": "12186352",
      "url": "https://doi.org/10.1016/s0005-7967(01)00061-4"
    },
    {
      "title": "Management of Chronic Insomnia Disorder in Adults: A Clinical Practice Guideline From the American College of Physicians",
      "authors": "Qaseem A et al.",
      "year": 2016,
      "journal": "Annals of Internal Medicine",
      "doi": "10.7326/M15-2175",
      "pmid": "27136449",
      "url": "https://doi.org/10.7326/M15-2175"
    }
  ],
  "coherent-breathing-guide": [
    {
      "title": "Heart Rate Variability Biofeedback Increases Baroreflex Gain and Peak Expiratory Flow",
      "authors": "Lehrer PM et al.",
      "year": 2003,
      "journal": "Psychosomatic Medicine",
      "doi": "10.1097/01.PSY.0000089200.81962.19",
      "pmid": "14508023",
      "url": "https://doi.org/10.1097/01.PSY.0000089200.81962.19"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "The Impact of Resonance Frequency Breathing on Measures of Heart Rate Variability, Blood Pressure, and Mood",
      "authors": "Steffen PR et al.",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00222",
      "pmid": "28890890",
      "url": "https://doi.org/10.3389/fpubh.2017.00222"
    }
  ],
  "cold-exposure-vagus-nerve": [
    {
      "title": "Habituation of the cold shock response: A systematic review and meta-analysis",
      "authors": "Barwood MJ et al.",
      "year": 2024,
      "journal": "J Therm Biol",
      "doi": "10.1016/j.jtherbio.2023.103775",
      "pmid": "38211547",
      "url": "https://doi.org/10.1016/j.jtherbio.2023.103775"
    },
    {
      "title": "Autonomic conflict: a different way to die during cold water immersion?",
      "authors": "Shattock MJ et al.",
      "year": 2012,
      "journal": "J Physiol",
      "doi": "10.1113/jphysiol.2012.229864",
      "pmid": "22547634",
      "url": "https://doi.org/10.1113/jphysiol.2012.229864"
    }
  ],
  "cpg-neural-autopilot": [
    {
      "title": "The CPGs for Limbed Locomotion-Facts and Fiction",
      "authors": "Grillner S et al.",
      "year": 2021,
      "journal": "Int J Mol Sci",
      "doi": "10.3390/ijms22115882",
      "pmid": "34070932",
      "url": "https://doi.org/10.3390/ijms22115882"
    },
    {
      "title": "Central pattern generators and the control of rhythmic movements",
      "authors": "Marder E et al.",
      "year": 2001,
      "journal": "Curr Biol",
      "doi": "10.1016/s0960-9822(01)00581-4",
      "pmid": "11728329",
      "url": "https://doi.org/10.1016/s0960-9822(01)00581-4"
    }
  ],
  "does-dopamine-detox-work": [
    {
      "title": "The dopamine motive system: implications for drug and food addiction",
      "authors": "Volkow ND et al.",
      "year": 2017,
      "journal": "Nature Reviews Neuroscience",
      "doi": "10.1038/nrn.2017.130",
      "pmid": "29142296",
      "url": "https://doi.org/10.1038/nrn.2017.130"
    },
    {
      "title": "Maladaptive or misunderstood? Dopamine fasting as a potential intervention for behavioral addiction",
      "authors": "Fei J et al.",
      "year": 2022,
      "journal": "Lifestyle Medicine",
      "doi": "10.1002/lim2.54",
      "url": "https://doi.org/10.1002/lim2.54"
    }
  ],
  "dopamine-architecture-mastering-desire": [
    {
      "title": "What is the role of dopamine in reward: hedonic impact, reward learning, or incentive salience?",
      "authors": "Berridge KC et al.",
      "year": 1998,
      "journal": "Brain Research Reviews",
      "doi": "10.1016/s0165-0173(98)00019-8",
      "pmid": "9858756",
      "url": "https://doi.org/10.1016/s0165-0173(98)00019-8"
    },
    {
      "title": "A neural substrate of prediction and reward",
      "authors": "Schultz W et al.",
      "year": 1997,
      "journal": "Science",
      "doi": "10.1126/science.275.5306.1593",
      "pmid": "9054347",
      "url": "https://doi.org/10.1126/science.275.5306.1593"
    },
    {
      "title": "The mysterious motivational functions of mesolimbic dopamine",
      "authors": "Salamone JD et al.",
      "year": 2012,
      "journal": "Neuron",
      "doi": "10.1016/j.neuron.2012.10.021",
      "pmid": "23141060",
      "url": "https://doi.org/10.1016/j.neuron.2012.10.021"
    },
    {
      "title": "Neurobiologic Advances from the Brain Disease Model of Addiction",
      "authors": "Volkow ND et al.",
      "year": 2016,
      "journal": "New England Journal of Medicine",
      "doi": "10.1056/NEJMra1511480",
      "pmid": "26816013",
      "url": "https://doi.org/10.1056/NEJMra1511480"
    },
    {
      "title": "Human physiological responses to immersion into water of different temperatures",
      "authors": "Šrámek P et al.",
      "year": 2000,
      "journal": "European Journal of Applied Physiology",
      "doi": "10.1007/s004210050065",
      "pmid": "10751106",
      "url": "https://doi.org/10.1007/s004210050065"
    },
    {
      "title": "Effects of exercise training on older patients with major depression",
      "authors": "Blumenthal JA et al.",
      "year": 1999,
      "journal": "Archives of Internal Medicine",
      "doi": "10.1001/archinte.159.19.2349",
      "pmid": "10547175",
      "url": "https://doi.org/10.1001/archinte.159.19.2349"
    },
    {
      "title": "Impulse control disorders in Parkinson disease: a cross-sectional study of 3090 patients",
      "authors": "Weintraub D et al.",
      "year": 2010,
      "journal": "Archives of Neurology",
      "doi": "10.1001/archneurol.2010.65",
      "pmid": "20457959",
      "url": "https://doi.org/10.1001/archneurol.2010.65"
    }
  ],
  "dysautonomia-long-covid-breathing": [
    {
      "title": "An Overview of Heart Rate Variability Metrics and Norms",
      "authors": "Shaffer F et al.",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00258",
      "url": "https://doi.org/10.3389/fpubh.2017.00258"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "HEART Rate Variability Biofeedback for LOng COVID Dysautonomia (HEARTLOC): Results of a Feasibility Study",
      "authors": "Corrado J et al.",
      "year": 2024,
      "journal": "Advances in Rehabilitation Science and Practice",
      "doi": "10.1177/27536351241227261",
      "pmid": "38298551",
      "url": "https://doi.org/10.1177/27536351241227261"
    }
  ],
  "eating-late-heart-rate-sleep": [
    {
      "title": "Effects of late-night eating of easily-or slowly-digestible meals on sleep, hypothalamo-pituitary-adrenal axis, and autonomic nervous system in healthy young males",
      "authors": "Uçar C et al.",
      "year": 2021,
      "journal": "Stress and Health",
      "doi": "10.1002/smi.3025",
      "pmid": "33426778",
      "url": "https://doi.org/10.1002/smi.3025"
    },
    {
      "title": "Relationship between food intake and sleep pattern in healthy individuals",
      "authors": "Crispim CA et al.",
      "year": 2011,
      "journal": "Journal of Clinical Sleep Medicine",
      "doi": "10.5664/jcsm.1476",
      "pmid": "22171206",
      "url": "https://doi.org/10.5664/jcsm.1476"
    }
  ],
  "electric-medicine-neuromodulation": [
    {
      "title": "Non-invasive vagus nerve stimulation in healthy humans reduces sympathetic nerve activity",
      "authors": "Clancy JA et al.",
      "year": 2014,
      "journal": "Brain Stimulation",
      "doi": "10.1016/j.brs.2014.07.031",
      "pmid": "25164906",
      "url": "https://doi.org/10.1016/j.brs.2014.07.031"
    }
  ],
  "endocrine-social-drive-oxytocin-testosterone": [
    {
      "title": "Oxytocin increases trust in humans",
      "authors": "Kosfeld M et al.",
      "year": 2005,
      "journal": "Nature",
      "doi": "10.1038/nature03701",
      "pmid": "15931222",
      "url": "https://doi.org/10.1038/nature03701"
    }
  ],
  "energy-sensor-leptin": [
    {
      "title": "Positional cloning of the mouse obese gene and its human homologue",
      "authors": "Zhang Y et al.",
      "year": 1994,
      "journal": "Nature",
      "doi": "10.1038/372425a0",
      "pmid": "7984236",
      "url": "https://doi.org/10.1038/372425a0"
    },
    {
      "title": "Serum immunoreactive-leptin concentrations in normal-weight and obese humans",
      "authors": "Considine RV et al.",
      "year": 1996,
      "journal": "N Engl J Med",
      "doi": "10.1056/NEJM199602013340503",
      "pmid": "8532024",
      "url": "https://doi.org/10.1056/NEJM199602013340503"
    },
    {
      "title": "Responses of leptin to short-term fasting and refeeding in humans: a link with ketogenesis but not ketones themselves",
      "authors": "Kolaczynski JW et al.",
      "year": 1996,
      "journal": "Diabetes",
      "doi": "10.2337/diab.45.11.1511",
      "pmid": "8866554",
      "url": "https://doi.org/10.2337/diab.45.11.1511"
    },
    {
      "title": "Congenital leptin deficiency is associated with severe early-onset obesity in humans",
      "authors": "Montague CT et al.",
      "year": 1997,
      "journal": "Nature",
      "doi": "10.1038/43185",
      "pmid": "9202122",
      "url": "https://doi.org/10.1038/43185"
    },
    {
      "title": "Effects of recombinant leptin therapy in a child with congenital leptin deficiency",
      "authors": "Farooqi IS et al.",
      "year": 1999,
      "journal": "N Engl J Med",
      "doi": "10.1056/NEJM199909163411204",
      "pmid": "10486419",
      "url": "https://doi.org/10.1056/NEJM199909163411204"
    },
    {
      "title": "Brief communication: Sleep curtailment in healthy young men is associated with decreased leptin levels, elevated ghrelin levels, and increased hunger and appetite",
      "authors": "Spiegel K et al.",
      "year": 2004,
      "journal": "Ann Intern Med",
      "doi": "10.7326/0003-4819-141-11-200412070-00008",
      "pmid": "15583226",
      "url": "https://doi.org/10.7326/0003-4819-141-11-200412070-00008"
    },
    {
      "title": "Short sleep duration is associated with reduced leptin, elevated ghrelin, and increased body mass index",
      "authors": "Taheri S et al.",
      "year": 2004,
      "journal": "PLoS Med",
      "doi": "10.1371/journal.pmed.0010062",
      "pmid": "15602591",
      "url": "https://doi.org/10.1371/journal.pmed.0010062"
    },
    {
      "title": "Obesity and leptin resistance: distinguishing cause from effect",
      "authors": "Myers MG Jr et al.",
      "year": 2010,
      "journal": "Trends Endocrinol Metab",
      "doi": "10.1016/j.tem.2010.08.002",
      "pmid": "20846876",
      "url": "https://doi.org/10.1016/j.tem.2010.08.002"
    },
    {
      "title": "Adaptive thermogenesis in humans",
      "authors": "Rosenbaum M et al.",
      "year": 2010,
      "journal": "Int J Obes (Lond)",
      "doi": "10.1038/ijo.2010.184",
      "pmid": "20935667",
      "url": "https://doi.org/10.1038/ijo.2010.184"
    },
    {
      "title": "Leptin, Obesity, and Leptin Resistance: Where Are We 25 Years Later?",
      "authors": "Izquierdo AG et al.",
      "year": 2019,
      "journal": "Nutrients",
      "doi": "10.3390/nu11112704",
      "pmid": "31717265",
      "url": "https://doi.org/10.3390/nu11112704"
    }
  ],
  "fast-vs-slow-pranayama": [
    {
      "title": "Effect of short-term practice of breathing exercises on autonomic functions in normal human volunteers",
      "authors": "Pal GK et al.",
      "year": 2004,
      "journal": "Indian Journal of Medical Research",
      "pmid": "15347862",
      "url": "https://pubmed.ncbi.nlm.nih.gov/15347862/"
    }
  ],
  "find-your-resonance-breathing-rate": [
    {
      "title": "Resonant frequency biofeedback training to increase cardiac variability: rationale and manual for training",
      "authors": "Lehrer PM et al.",
      "year": 2000,
      "journal": "Applied Psychophysiology and Biofeedback",
      "doi": "10.1023/a:1009554825745",
      "pmid": "10999236",
      "url": "https://doi.org/10.1023/a:1009554825745"
    }
  ],
  "forest-bathing-shinrin-yoku-science": [
    {
      "title": "The physiological effects of Shinrin-yoku (taking in the forest atmosphere or forest bathing): evidence from field experiments in 24 forests across Japan",
      "authors": "Park BJ et al.",
      "year": 2010,
      "journal": "Environmental Health and Preventive Medicine",
      "doi": "10.1007/s12199-009-0086-9",
      "pmid": "19568835",
      "url": "https://doi.org/10.1007/s12199-009-0086-9"
    },
    {
      "title": "Visiting a forest, but not a city, increases human natural killer activity and expression of anti-cancer proteins",
      "authors": "Li Q et al.",
      "year": 2008,
      "journal": "International Journal of Immunopathology and Pharmacology",
      "doi": "10.1177/039463200802100113",
      "pmid": "18336737",
      "url": "https://doi.org/10.1177/039463200802100113"
    },
    {
      "title": "Therapeutic effect of forest bathing on human hypertension in the elderly",
      "authors": "Mao GX et al.",
      "year": 2012,
      "journal": "Journal of Cardiology",
      "doi": "10.1016/j.jjcc.2012.08.003",
      "pmid": "22948092",
      "url": "https://doi.org/10.1016/j.jjcc.2012.08.003"
    }
  ],
  "glp1-biology-muscle-preservation": [
    {
      "title": "Obesity: the protein leverage hypothesis",
      "authors": "Simpson SJ et al.",
      "year": 2005,
      "journal": "Obesity Reviews",
      "doi": "10.1111/j.1467-789X.2005.00178.x",
      "pmid": "15836464",
      "url": "https://doi.org/10.1111/j.1467-789X.2005.00178.x"
    }
  ],
  "gut-brain-axis-data-link": [
    {
      "title": "The Microbiota-Gut-Brain Axis",
      "authors": "Cryan JF et al.",
      "year": 2019,
      "journal": "Physiological Reviews",
      "doi": "10.1152/physrev.00018.2018",
      "url": "https://doi.org/10.1152/physrev.00018.2018"
    }
  ],
  "heart-rate-recovery-fitness-marker": [
    {
      "title": "Heart-rate recovery immediately after exercise as a predictor of mortality.",
      "authors": "Cole CR et al.",
      "year": 1999,
      "journal": "The New England Journal of Medicine",
      "doi": "10.1056/NEJM199910283411804",
      "pmid": "10536127",
      "url": "https://doi.org/10.1056/NEJM199910283411804"
    }
  ],
  "high-blood-pressure-slow-breathing": [
    {
      "title": "Slow breathing improves arterial baroreflex sensitivity and decreases blood pressure in essential hypertension.",
      "authors": "Joseph CN et al.",
      "year": 2005,
      "journal": "Hypertension",
      "doi": "10.1161/01.HYP.0000179581.68566.7d",
      "pmid": "16129818",
      "url": "https://doi.org/10.1161/01.HYP.0000179581.68566.7d"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing.",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "how-long-does-alcohol-stay-in-your-system": [
    {
      "title": "Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework",
      "authors": "Jones AW",
      "year": 2010,
      "journal": "Forensic Science International",
      "doi": "10.1016/j.forsciint.2010.02.021",
      "pmid": "20304569",
      "url": "https://doi.org/10.1016/j.forsciint.2010.02.021"
    },
    {
      "title": "Ethyl glucuronide",
      "authors": "Walsham NE et al.",
      "year": 2012,
      "journal": "Annals of Clinical Biochemistry",
      "doi": "10.1258/acb.2011.011115",
      "pmid": "22113954",
      "url": "https://doi.org/10.1258/acb.2011.011115"
    },
    {
      "title": "Alcohol and sleep I: effects on normal sleep",
      "authors": "Ebrahim IO et al.",
      "year": 2013,
      "journal": "Alcoholism: Clinical and Experimental Research",
      "doi": "10.1111/acer.12006",
      "pmid": "23347102",
      "url": "https://doi.org/10.1111/acer.12006"
    }
  ],
  "how-much-alcohol-lowers-hrv": [
    {
      "title": "Acute Effect of Alcohol Intake on Cardiovascular Autonomic Regulation During the First Hours of Sleep in a Large Real-World Sample of Finnish Employees: Observational Study",
      "authors": "Pietilä J et al.",
      "year": 2018,
      "journal": "JMIR Mental Health",
      "doi": "10.2196/mental.9519",
      "pmid": "29549064",
      "url": "https://doi.org/10.2196/mental.9519"
    },
    {
      "title": "The Impact of Alcohol on Sleep Physiology: A Prospective Observational Study on Nocturnal Resting Heart Rate Using Smartwatch Technology",
      "authors": "Strüven A et al.",
      "year": 2025,
      "journal": "Nutrients",
      "doi": "10.3390/nu17091470",
      "pmid": "40362779",
      "url": "https://doi.org/10.3390/nu17091470"
    },
    {
      "title": "Time Since Last Drink is Positively Associated with Heart Rate Variability in Outpatients with Alcohol Use Disorder",
      "authors": "Eddie D et al.",
      "year": 2023,
      "journal": "Applied Psychophysiology and Biofeedback",
      "doi": "10.1007/s10484-023-09597-z",
      "pmid": "37436518",
      "url": "https://doi.org/10.1007/s10484-023-09597-z"
    }
  ],
  "how-much-sleep-do-you-need": [
    {
      "title": "The Cumulative Cost of Additional Wakefulness: Dose-Response Effects on Neurobehavioral Functions and Sleep Physiology From Chronic Sleep Restriction and Total Sleep Deprivation",
      "authors": "Van Dongen et al.",
      "year": 2003,
      "journal": "Sleep",
      "doi": "10.1093/sleep/26.2.117",
      "url": "https://doi.org/10.1093/sleep/26.2.117"
    },
    {
      "title": "National Sleep Foundation's sleep time duration recommendations: methodology and results summary",
      "authors": "Hirshkowitz et al.",
      "year": 2015,
      "journal": "Sleep Health",
      "doi": "10.1016/j.sleh.2014.12.010",
      "url": "https://doi.org/10.1016/j.sleh.2014.12.010"
    },
    {
      "title": "Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus Statement of the American Academy of Sleep Medicine and Sleep Research Society",
      "authors": "Watson et al.",
      "year": 2015,
      "journal": "Sleep",
      "doi": "10.5665/sleep.4716",
      "url": "https://doi.org/10.5665/sleep.4716"
    }
  ],
  "how-to-beat-jet-lag": [
    {
      "title": "How To Travel the World Without Jet lag.",
      "authors": "Eastman CI et al.",
      "year": 2009,
      "journal": "Sleep Med Clin",
      "doi": "10.1016/j.jsmc.2009.02.006",
      "pmid": "20204161",
      "url": "https://doi.org/10.1016/j.jsmc.2009.02.006"
    },
    {
      "title": "Melatonin for the prevention and treatment of jet lag.",
      "authors": "Herxheimer A et al.",
      "year": 2002,
      "journal": "Cochrane Database Syst Rev",
      "doi": "10.1002/14651858.CD001520",
      "pmid": "12076414",
      "url": "https://doi.org/10.1002/14651858.CD001520"
    },
    {
      "title": "Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness.",
      "authors": "Chang AM et al.",
      "year": 2015,
      "journal": "Proc Natl Acad Sci U S A",
      "doi": "10.1073/pnas.1418490112",
      "pmid": "25535358",
      "url": "https://doi.org/10.1073/pnas.1418490112"
    }
  ],
  "how-to-calculate-maintenance-calories": [
    {
      "title": "Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review.",
      "authors": "Frankenfield D et al.",
      "year": 2005,
      "journal": "J Am Diet Assoc",
      "doi": "10.1016/j.jada.2005.02.005",
      "pmid": "15883556",
      "url": "https://doi.org/10.1016/j.jada.2005.02.005"
    }
  ],
  "how-to-calculate-one-rep-max": [
    {
      "title": "Strength Testing—Predicting a One-Rep Max from Reps-to-Fatigue",
      "authors": "Brzycki M",
      "year": 1993,
      "journal": "Journal of Physical Education, Recreation & Dance",
      "doi": "10.1080/07303084.1993.10606684",
      "url": "https://doi.org/10.1080/07303084.1993.10606684"
    },
    {
      "title": "The Accuracy of Prediction Equations for Estimating 1-RM Performance in the Bench Press, Squat, and Deadlift",
      "authors": "LeSuer DA et al.",
      "year": 1997,
      "journal": "Journal of Strength and Conditioning Research",
      "doi": "10.1519/1533-4287(1997)011<0211:taopef>2.3.co;2",
      "url": "https://doi.org/10.1519/1533-4287(1997)011<0211:taopef>2.3.co;2"
    }
  ],
  "how-to-get-rid-of-brain-fog": [
    {
      "title": "What is brain fog?",
      "authors": "McWhirter L et al.",
      "year": 2023,
      "journal": "J Neurol Neurosurg Psychiatry",
      "doi": "10.1136/jnnp-2022-329683",
      "pmid": "36600580",
      "url": "https://doi.org/10.1136/jnnp-2022-329683"
    },
    {
      "title": "A meta-analysis of the impact of short-term sleep deprivation on cognitive variables.",
      "authors": "Lim J et al.",
      "year": 2010,
      "journal": "Psychol Bull",
      "doi": "10.1037/a0018883",
      "pmid": "20438143",
      "url": "https://doi.org/10.1037/a0018883"
    },
    {
      "title": "Effects of stress throughout the lifespan on the brain, behaviour and cognition.",
      "authors": "Lupien SJ et al.",
      "year": 2009,
      "journal": "Nat Rev Neurosci",
      "doi": "10.1038/nrn2639",
      "pmid": "19401723",
      "url": "https://doi.org/10.1038/nrn2639"
    }
  ],
  "how-to-lower-cortisol": [
    {
      "title": "Interactions between sleep, stress, and metabolism: From physiological to pathological conditions",
      "authors": "Hirotsu et al.",
      "year": 2015,
      "journal": "Sleep Science",
      "doi": "10.1016/j.slsci.2015.09.002",
      "url": "https://doi.org/10.1016/j.slsci.2015.09.002"
    },
    {
      "title": "Mindfulness mediates the physiological markers of stress: Systematic review and meta-analysis",
      "authors": "Pascoe et al.",
      "year": 2017,
      "journal": "Journal of Psychiatric Research",
      "doi": "10.1016/j.jpsychires.2017.08.004",
      "url": "https://doi.org/10.1016/j.jpsychires.2017.08.004"
    }
  ],
  "how-to-measure-hrv-consistently": [
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring.",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Med",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    }
  ],
  "how-to-raise-hrv-naturally": [
    {
      "title": "Effects of voluntary slow breathing on heart rate and heart rate variability: A systematic review and a meta-analysis.",
      "authors": "Laborde S et al.",
      "year": 2022,
      "journal": "Neurosci Biobehav Rev",
      "doi": "10.1016/j.neubiorev.2022.104711",
      "pmid": "35623448",
      "url": "https://doi.org/10.1016/j.neubiorev.2022.104711"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis.",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "how-to-regulate-emotions": [
    {
      "title": "Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli.",
      "authors": "Lieberman MD et al.",
      "year": 2007,
      "journal": "Psychol Sci",
      "doi": "10.1111/j.1467-9280.2007.01916.x",
      "pmid": "17576282",
      "url": "https://doi.org/10.1111/j.1467-9280.2007.01916.x"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing.",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Front Hum Neurosci",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis.",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "how-to-train-your-nervous-system": [
    {
      "title": "Effects of voluntary slow breathing on heart rate and heart rate variability: A systematic review and a meta-analysis.",
      "authors": "Laborde S et al.",
      "year": 2022,
      "journal": "Neurosci Biobehav Rev",
      "doi": "10.1016/j.neubiorev.2022.104711",
      "pmid": "35623448",
      "url": "https://doi.org/10.1016/j.neubiorev.2022.104711"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis.",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "hpa-axis-control-cortisol-aggression": [
    {
      "title": "Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli.",
      "authors": "Lieberman MD et al.",
      "year": 2007,
      "journal": "Psychol Sci",
      "doi": "10.1111/j.1467-9280.2007.01916.x",
      "pmid": "17576282",
      "url": "https://doi.org/10.1111/j.1467-9280.2007.01916.x"
    },
    {
      "title": "Effects of voluntary slow breathing on heart rate and heart rate variability: A systematic review and a meta-analysis.",
      "authors": "Laborde S et al.",
      "year": 2022,
      "journal": "Neurosci Biobehav Rev",
      "doi": "10.1016/j.neubiorev.2022.104711",
      "pmid": "35623448",
      "url": "https://doi.org/10.1016/j.neubiorev.2022.104711"
    }
  ],
  "hrv-breathing-cold-honest-limits": [
    {
      "title": "The effects of cold exposure (cold water immersion, whole- and partial- body cryostimulation) on cardiovascular and cardiac autonomic control responses in healthy individuals: a systematic review, meta-analysis and meta-regression.",
      "authors": "Jdidi H et al.",
      "year": 2024,
      "journal": "J Therm Biol",
      "doi": "10.1016/j.jtherbio.2024.103857",
      "pmid": "38663342",
      "url": "https://doi.org/10.1016/j.jtherbio.2024.103857"
    },
    {
      "title": "Effects of voluntary slow breathing on heart rate and heart rate variability: A systematic review and a meta-analysis.",
      "authors": "Laborde S et al.",
      "year": 2022,
      "journal": "Neurosci Biobehav Rev",
      "doi": "10.1016/j.neubiorev.2022.104711",
      "pmid": "35623448",
      "url": "https://doi.org/10.1016/j.neubiorev.2022.104711"
    }
  ],
  "hrv-different-every-device": [
    {
      "title": "An Overview of Heart Rate Variability Metrics and Norms",
      "authors": "Shaffer F, Ginsberg JP",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00258",
      "pmid": "29034226",
      "url": "https://doi.org/10.3389/fpubh.2017.00258"
    },
    {
      "title": "Accuracy Assessment of Oura Ring Nocturnal Heart Rate and Heart Rate Variability in Comparison With Electrocardiography in Time and Frequency Domains: Comprehensive Analysis",
      "authors": "Cao R et al.",
      "year": 2022,
      "journal": "Journal of Medical Internet Research",
      "doi": "10.2196/27487",
      "pmid": "35040799",
      "url": "https://doi.org/10.2196/27487"
    }
  ],
  "hrv-harmony-of-rhythms": [
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    }
  ],
  "humming-breath-vagus": [
    {
      "title": "A randomized trial of the immediate effect of Bee-Humming Breathing exercise on blood pressure and heart rate variability in patients with essential hypertension",
      "authors": "Ghati N et al.",
      "year": 2021,
      "journal": "Explore (NY)",
      "doi": "10.1016/j.explore.2020.03.009",
      "pmid": "32620379",
      "url": "https://doi.org/10.1016/j.explore.2020.03.009"
    }
  ],
  "interoceptive-precision-sensor-calibration": [
    {
      "title": "Interoceptive inference, emotion, and the embodied self",
      "authors": "Seth AK",
      "year": 2013,
      "journal": "Trends in Cognitive Sciences",
      "doi": "10.1016/j.tics.2013.09.007",
      "pmid": "24126130",
      "url": "https://doi.org/10.1016/j.tics.2013.09.007"
    }
  ],
  "jhana-meditation-stages": [
    {
      "title": "Intensive whole-brain 7T MRI case study of volitional control of brain activity in deep absorptive meditation states",
      "authors": "Yang WFZ et al.",
      "year": 2024,
      "journal": "Cerebral Cortex",
      "doi": "10.1093/cercor/bhad408",
      "pmid": "37943791",
      "url": "https://doi.org/10.1093/cercor/bhad408"
    },
    {
      "title": "Case study of ecstatic meditation: fMRI and EEG evidence of self-stimulating a reward system",
      "authors": "Hagerty MR et al.",
      "year": 2013,
      "journal": "Neural Plasticity",
      "doi": "10.1155/2013/653572",
      "pmid": "23738149",
      "url": "https://doi.org/10.1155/2013/653572"
    }
  ],
  "mbsr-mindfulness-clinical-evidence": [
    {
      "title": "Mindfulness-based stress reduction for healthy individuals: A meta-analysis",
      "authors": "Khoury B et al.",
      "year": 2015,
      "journal": "J Psychosom Res",
      "doi": "10.1016/j.jpsychores.2015.03.009",
      "pmid": "25818837",
      "url": "https://doi.org/10.1016/j.jpsychores.2015.03.009"
    },
    {
      "title": "Meditation programs for psychological stress and well-being: a systematic review and meta-analysis",
      "authors": "Goyal M et al.",
      "year": 2014,
      "journal": "JAMA Intern Med",
      "doi": "10.1001/jamainternmed.2013.13018",
      "pmid": "24395196",
      "url": "https://doi.org/10.1001/jamainternmed.2013.13018"
    }
  ],
  "measuring-meditation-progress": [
    {
      "title": "Mindfulness practice leads to increases in regional brain gray matter density",
      "authors": "Hölzel BK et al.",
      "year": 2011,
      "journal": "Psychiatry Res",
      "doi": "10.1016/j.pscychresns.2010.08.006",
      "pmid": "21071182",
      "url": "https://doi.org/10.1016/j.pscychresns.2010.08.006"
    },
    {
      "title": "Meditation programs for psychological stress and well-being: a systematic review and meta-analysis",
      "authors": "Goyal M et al.",
      "year": 2014,
      "journal": "JAMA Intern Med",
      "doi": "10.1001/jamainternmed.2013.13018",
      "pmid": "24395196",
      "url": "https://doi.org/10.1001/jamainternmed.2013.13018"
    }
  ],
  "meditation-adverse-effects-safety": [
    {
      "title": "Adverse events in meditation practices and meditation-based therapies: a systematic review",
      "authors": "Farias M et al.",
      "year": 2020,
      "journal": "Acta Psychiatr Scand",
      "doi": "10.1111/acps.13225",
      "pmid": "32820538",
      "url": "https://doi.org/10.1111/acps.13225"
    }
  ],
  "meditation-aging-telomeres": [
    {
      "title": "A meta-analytic review of the effects of mindfulness meditation on telomerase activity",
      "authors": "Schutte NS et al.",
      "year": 2014,
      "journal": "Psychoneuroendocrinology",
      "doi": "10.1016/j.psyneuen.2013.12.017",
      "pmid": "24636500",
      "url": "https://doi.org/10.1016/j.psyneuen.2013.12.017"
    }
  ],
  "meditation-app-with-biofeedback": [
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "meditation-brain-aging-protection": [
    {
      "title": "Forever Young(er): potential age-defying effects of long-term meditation on gray matter atrophy",
      "authors": "Luders E et al.",
      "year": 2014,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2014.01551",
      "pmid": "25653628",
      "url": "https://doi.org/10.3389/fpsyg.2014.01551"
    }
  ],
  "meditation-brain-changes-how-fast": [
    {
      "title": "Short-term meditation induces white matter changes in the anterior cingulate",
      "authors": "Tang YY et al.",
      "year": 2010,
      "journal": "Proc Natl Acad Sci U S A",
      "doi": "10.1073/pnas.1011043107",
      "pmid": "20713717",
      "url": "https://doi.org/10.1073/pnas.1011043107"
    },
    {
      "title": "Mindfulness practice leads to increases in regional brain gray matter density",
      "authors": "Hölzel BK et al.",
      "year": 2011,
      "journal": "Psychiatry Res",
      "doi": "10.1016/j.pscychresns.2010.08.006",
      "pmid": "21071182",
      "url": "https://doi.org/10.1016/j.pscychresns.2010.08.006"
    }
  ],
  "meditation-gamma-waves-experience": [
    {
      "title": "Long-term meditators self-induce high-amplitude gamma synchrony during mental practice",
      "authors": "Lutz A et al.",
      "year": 2004,
      "journal": "Proc Natl Acad Sci U S A",
      "doi": "10.1073/pnas.0407401101",
      "pmid": "15534199",
      "url": "https://doi.org/10.1073/pnas.0407401101"
    }
  ],
  "meditation-neuroscience-expert-monks": [
    {
      "title": "Long-term meditators self-induce high-amplitude gamma synchrony during mental practice",
      "authors": "Lutz A et al.",
      "year": 2004,
      "journal": "Proc Natl Acad Sci U S A",
      "doi": "10.1073/pnas.0407401101",
      "pmid": "15534199",
      "url": "https://doi.org/10.1073/pnas.0407401101"
    },
    {
      "title": "Meditation experience is associated with increased cortical thickness",
      "authors": "Lazar SW et al.",
      "year": 2005,
      "journal": "Neuroreport",
      "doi": "10.1097/01.wnr.0000186598.66243.19",
      "pmid": "16272874",
      "url": "https://doi.org/10.1097/01.wnr.0000186598.66243.19"
    }
  ],
  "meditation-vs-breathwork": [
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Is meditation associated with altered brain structure? A systematic review and meta-analysis of morphometric neuroimaging in meditation practitioners",
      "authors": "Fox KCR et al.",
      "year": 2014,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2014.03.016",
      "url": "https://doi.org/10.1016/j.neubiorev.2014.03.016"
    }
  ],
  "meditation-with-apple-watch": [
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    }
  ],
  "meditation-with-measurable-progress": [
    {
      "title": "Mechanisms of white matter changes induced by meditation",
      "authors": "Tang YY et al.",
      "year": 2012,
      "journal": "Proceedings of the National Academy of Sciences",
      "doi": "10.1073/pnas.1207817109",
      "url": "https://doi.org/10.1073/pnas.1207817109"
    },
    {
      "title": "Mindfulness practice leads to increases in regional brain gray matter density",
      "authors": "Hölzel BK et al.",
      "year": 2011,
      "journal": "Psychiatry Research: Neuroimaging",
      "doi": "10.1016/j.pscychresns.2010.08.006",
      "url": "https://doi.org/10.1016/j.pscychresns.2010.08.006"
    },
    {
      "title": "Is meditation associated with altered brain structure? A systematic review and meta-analysis of morphometric neuroimaging in meditation practitioners",
      "authors": "Fox KCR et al.",
      "year": 2014,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2014.03.016",
      "url": "https://doi.org/10.1016/j.neubiorev.2014.03.016"
    }
  ],
  "metabolic-flexibility-dual-fuel-system": [
    {
      "title": "Fuel selection in human skeletal muscle in insulin resistance: a reexamination",
      "authors": "Kelley DE et al.",
      "year": 2000,
      "journal": "Diabetes",
      "doi": "10.2337/diabetes.49.5.677",
      "pmid": "10905472",
      "url": "https://doi.org/10.2337/diabetes.49.5.677"
    },
    {
      "title": "Metabolic Flexibility in Health and Disease",
      "authors": "Goodpaster BH et al.",
      "year": 2017,
      "journal": "Cell Metabolism",
      "doi": "10.1016/j.cmet.2017.04.015",
      "pmid": "28467922",
      "url": "https://doi.org/10.1016/j.cmet.2017.04.015"
    },
    {
      "title": "Assessment of Metabolic Flexibility by Means of Measuring Blood Lactate, Fat, and Carbohydrate Oxidation Responses to Exercise in Professional Endurance Athletes and Less-Fit Individuals",
      "authors": "San-Millán I et al.",
      "year": 2018,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-017-0751-x",
      "pmid": "28623613",
      "url": "https://doi.org/10.1007/s40279-017-0751-x"
    },
    {
      "title": "Exercise, GLUT4, and skeletal muscle glucose uptake",
      "authors": "Richter EA et al.",
      "year": 2013,
      "journal": "Physiological Reviews",
      "doi": "10.1152/physrev.00038.2012",
      "pmid": "23899560",
      "url": "https://doi.org/10.1152/physrev.00038.2012"
    },
    {
      "title": "The Acute Effects of Interrupting Prolonged Sitting Time in Adults with Standing and Light-Intensity Walking on Biomarkers of Cardiometabolic Health in Adults: A Systematic Review and Meta-analysis",
      "authors": "Buffey AJ et al.",
      "year": 2022,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-022-01649-4",
      "pmid": "35147898",
      "url": "https://doi.org/10.1007/s40279-022-01649-4"
    },
    {
      "title": "Food Order Has a Significant Impact on Postprandial Glucose and Insulin Levels",
      "authors": "Shukla AP et al.",
      "year": 2015,
      "journal": "Diabetes Care",
      "doi": "10.2337/dc15-0429",
      "pmid": "26106234",
      "url": "https://doi.org/10.2337/dc15-0429"
    },
    {
      "title": "Effects of Time-Restricted Eating on Weight Loss and Other Metabolic Parameters in Women and Men With Overweight and Obesity: The TREAT Randomized Clinical Trial",
      "authors": "Lowe DA et al.",
      "year": 2020,
      "journal": "JAMA Internal Medicine",
      "doi": "10.1001/jamainternmed.2020.4153",
      "pmid": "32986097",
      "url": "https://doi.org/10.1001/jamainternmed.2020.4153"
    }
  ],
  "mitochondrial-biogenesis-cellular-power-grid": [
    {
      "title": "Mechanisms Controlling Mitochondrial Biogenesis and Respiration through the Thermogenic Coactivator PGC-1",
      "authors": "Wu Z et al.",
      "year": 1999,
      "journal": "Cell",
      "doi": "10.1016/s0092-8674(00)80611-x",
      "url": "https://doi.org/10.1016/s0092-8674(00)80611-x"
    },
    {
      "title": "Mechanisms and Mitochondrial Redox Signaling in Photobiomodulation",
      "authors": "Hamblin MR",
      "year": 2018,
      "journal": "Photochemistry and Photobiology",
      "doi": "10.1111/php.12864",
      "url": "https://doi.org/10.1111/php.12864"
    }
  ],
  "mitochondrial-dna-red-light": [
    {
      "title": "Mechanisms and Mitochondrial Redox Signaling in Photobiomodulation",
      "authors": "Hamblin MR",
      "year": 2018,
      "journal": "Photochemistry and Photobiology",
      "doi": "10.1111/php.12864",
      "url": "https://doi.org/10.1111/php.12864"
    }
  ],
  "muscle-metabolic-marker": [
    {
      "title": "Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study",
      "authors": "Leong DP et al.",
      "year": 2015,
      "journal": "The Lancet",
      "doi": "10.1016/S0140-6736(14)62000-6",
      "url": "https://doi.org/10.1016/S0140-6736(14)62000-6"
    }
  ],
  "name-it-to-tame-it-affect-labeling": [
    {
      "title": "Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli",
      "authors": "Lieberman MD et al.",
      "year": 2007,
      "journal": "Psychological Science",
      "doi": "10.1111/j.1467-9280.2007.01916.x",
      "pmid": "17576282",
      "url": "https://doi.org/10.1111/j.1467-9280.2007.01916.x"
    },
    {
      "title": "Writing About Emotional Experiences as a Therapeutic Process",
      "authors": "Pennebaker JW",
      "year": 1997,
      "journal": "Psychological Science",
      "doi": "10.1111/j.1467-9280.1997.tb00403.x",
      "url": "https://doi.org/10.1111/j.1467-9280.1997.tb00403.x"
    }
  ],
  "nervous-system-ping-latency": [
    {
      "title": "An Overview of Heart Rate Variability Metrics and Norms",
      "authors": "Shaffer F, Ginsberg JP",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00258",
      "pmid": "29034226",
      "url": "https://doi.org/10.3389/fpubh.2017.00258"
    },
    {
      "title": "Heart Rate Variability and Cardiac Vagal Tone in Psychophysiological Research - Recommendations for Experiment Planning, Data Analysis, and Data Reporting",
      "authors": "Laborde S, Mosley E, Thayer JF",
      "year": 2017,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2017.00213",
      "pmid": "28265249",
      "url": "https://doi.org/10.3389/fpsyg.2017.00213"
    },
    {
      "title": "The LF/HF ratio does not accurately measure cardiac sympatho-vagal balance",
      "authors": "Billman GE",
      "year": 2013,
      "journal": "Frontiers in Physiology",
      "doi": "10.3389/fphys.2013.00026",
      "pmid": "23431279",
      "url": "https://doi.org/10.3389/fphys.2013.00026"
    },
    {
      "title": "Vagal influence on working memory and attention",
      "authors": "Hansen AL, Johnsen BH, Thayer JF",
      "year": 2003,
      "journal": "International Journal of Psychophysiology",
      "doi": "10.1016/s0167-8760(03)00073-4",
      "pmid": "12798986",
      "url": "https://doi.org/10.1016/s0167-8760(03)00073-4"
    },
    {
      "title": "Cognitive performance and heart rate variability: the influence of fitness level",
      "authors": "Luque-Casado A, Zabala M, Morales E, Mateo-March M, Sanabria D",
      "year": 2013,
      "journal": "PLoS One",
      "doi": "10.1371/journal.pone.0056935",
      "pmid": "23437276",
      "url": "https://doi.org/10.1371/journal.pone.0056935"
    },
    {
      "title": "Resting cardiac vagal tone predicts intraindividual reaction time variability during an attention task in a sample of young and healthy adults",
      "authors": "Williams DP, Thayer JF, Koenig J",
      "year": 2016,
      "journal": "Psychophysiology",
      "doi": "10.1111/psyp.12739",
      "pmid": "27658566",
      "url": "https://doi.org/10.1111/psyp.12739"
    },
    {
      "title": "Heart Rate Variability and Cognitive Function: A Systematic Review",
      "authors": "Forte G, Favieri F, Casagrande M",
      "year": 2019,
      "journal": "Frontiers in Neuroscience",
      "doi": "10.3389/fnins.2019.00710",
      "pmid": "31354419",
      "url": "https://doi.org/10.3389/fnins.2019.00710"
    },
    {
      "title": "Heart rate variability and self-control--A meta-analysis",
      "authors": "Zahn D, Adams J, Krohn J, Wenzel M, Mann CG, Gomille LK, Jacobi-Scherbening V, Kubiak T",
      "year": 2016,
      "journal": "Biological Psychology",
      "doi": "10.1016/j.biopsycho.2015.12.007",
      "pmid": "26747415",
      "url": "https://doi.org/10.1016/j.biopsycho.2015.12.007"
    },
    {
      "title": "Heart rate variability indices as bio-markers of top-down self-regulatory mechanisms: A meta-analytic review",
      "authors": "Holzman JB, Bridgett DJ",
      "year": 2017,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2016.12.032",
      "pmid": "28057463",
      "url": "https://doi.org/10.1016/j.neubiorev.2016.12.032"
    },
    {
      "title": "A model of neurovisceral integration in emotion regulation and dysregulation",
      "authors": "Thayer JF, Lane RD",
      "year": 2000,
      "journal": "Journal of Affective Disorders",
      "doi": "10.1016/s0165-0327(00)00338-4",
      "pmid": "11163422",
      "url": "https://doi.org/10.1016/s0165-0327(00)00338-4"
    },
    {
      "title": "Claude Bernard and the heart-brain connection: further elaboration of a model of neurovisceral integration",
      "authors": "Thayer JF, Lane RD",
      "year": 2009,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2008.08.004",
      "pmid": "18771686",
      "url": "https://doi.org/10.1016/j.neubiorev.2008.08.004"
    },
    {
      "title": "A meta-analysis of heart rate variability and neuroimaging studies: implications for heart rate variability as a marker of stress and health",
      "authors": "Thayer JF, Ahs F, Fredrikson M, Sollers JJ 3rd, Wager TD",
      "year": 2012,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2011.11.009",
      "pmid": "22178086",
      "url": "https://doi.org/10.1016/j.neubiorev.2011.11.009"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM, Gevirtz R",
      "year": 2014,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P, Kaur K, Sharma A, Shah K, Huseby R, Bhavsar J, Sgobba P, Zhang Y",
      "year": 2020,
      "journal": "Applied Psychophysiology and Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    },
    {
      "title": "Does Heart Rate Variability Biofeedback Enhance Executive Functions Across the Lifespan? A Systematic Review",
      "authors": "Tinello D, Kliegel M, Zuber S",
      "year": 2022,
      "journal": "Journal of Cognitive Enhancement",
      "doi": "10.1007/s41465-021-00218-3",
      "pmid": "35299845",
      "url": "https://doi.org/10.1007/s41465-021-00218-3"
    }
  ],
  "neural-bridge-alpha-flow-gateway": [
    {
      "title": "Über das Elektrenkephalogramm des Menschen",
      "authors": "Berger H",
      "year": 1929,
      "journal": "Archiv für Psychiatrie und Nervenkrankheiten",
      "doi": "10.1007/BF01797193",
      "url": "https://doi.org/10.1007/BF01797193"
    },
    {
      "title": "EEG differences between eyes-closed and eyes-open resting conditions",
      "authors": "Barry RJ, Clarke AR, Johnstone SJ, Magee CA, Rushby JA",
      "year": 2007,
      "journal": "Clinical Neurophysiology",
      "doi": "10.1016/j.clinph.2007.07.028",
      "pmid": "17911042",
      "url": "https://doi.org/10.1016/j.clinph.2007.07.028"
    },
    {
      "title": "α-band oscillations, attention, and controlled access to stored information",
      "authors": "Klimesch W",
      "year": 2012,
      "journal": "Trends in Cognitive Sciences",
      "doi": "10.1016/j.tics.2012.10.007",
      "pmid": "23141428",
      "url": "https://doi.org/10.1016/j.tics.2012.10.007"
    },
    {
      "title": "Shaping functional architecture by oscillatory alpha activity: gating by inhibition",
      "authors": "Jensen O, Mazaheri A",
      "year": 2010,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2010.00186",
      "pmid": "21119777",
      "url": "https://doi.org/10.3389/fnhum.2010.00186"
    },
    {
      "title": "EEG alpha power and creative ideation",
      "authors": "Fink A, Benedek M",
      "year": 2014,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2012.12.002",
      "pmid": "23246442",
      "url": "https://doi.org/10.1016/j.neubiorev.2012.12.002"
    },
    {
      "title": "Neural activity when people solve verbal problems with insight",
      "authors": "Jung-Beeman M, Bowden EM, Haberman J, Frymiare JL, Arambel-Liu S, Greenblatt R, Reber PJ, Kounios J",
      "year": 2004,
      "journal": "PLoS Biology",
      "doi": "10.1371/journal.pbio.0020097",
      "pmid": "15094802",
      "url": "https://doi.org/10.1371/journal.pbio.0020097"
    },
    {
      "title": "EEG Correlates of the Flow State: A Combination of Increased Frontal Theta and Moderate Frontocentral Alpha Rhythm in the Mental Arithmetic Task",
      "authors": "Katahira K, Yamazaki Y, Yamaoka C, Ozaki H, Nakagawa S, Nagata N",
      "year": 2018,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2018.00300",
      "pmid": "29593605",
      "url": "https://doi.org/10.3389/fpsyg.2018.00300"
    },
    {
      "title": "A systematic review of the neurophysiology of mindfulness on EEG oscillations",
      "authors": "Lomas T, Ivtzan I, Fu CH",
      "year": 2015,
      "journal": "Neuroscience & Biobehavioral Reviews",
      "doi": "10.1016/j.neubiorev.2015.09.018",
      "pmid": "26441373",
      "url": "https://doi.org/10.1016/j.neubiorev.2015.09.018"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A, Piarulli A, Laurino M, Garbella E, Menicucci D, Neri B, Gemignani A",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    },
    {
      "title": "Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis",
      "authors": "Garcia-Argibay M, Santed MA, Reales JM",
      "year": 2019,
      "journal": "Psychological Research",
      "doi": "10.1007/s00426-018-1066-8",
      "pmid": "30073406",
      "url": "https://doi.org/10.1007/s00426-018-1066-8"
    },
    {
      "title": "Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity, and the implications for psychological research and intervention",
      "authors": "Ingendoh RM, Posny ES, Heine A",
      "year": 2023,
      "journal": "PLoS One",
      "doi": "10.1371/journal.pone.0286023",
      "pmid": "37205669",
      "url": "https://doi.org/10.1371/journal.pone.0286023"
    },
    {
      "title": "Neurofeedback of Alpha Activity on Memory in Healthy Participants: A Systematic Review and Meta-Analysis",
      "authors": "Yeh WH, Hsueh JJ, Shaw FZ",
      "year": 2020,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2020.562360",
      "pmid": "33469422",
      "url": "https://doi.org/10.3389/fnhum.2020.562360"
    }
  ],
  "neural-entrainment-meditation-2": [
    {
      "title": "Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis",
      "authors": "Garcia-Argibay et al.",
      "year": 2018,
      "journal": "Psychological Research",
      "doi": "10.1007/s00426-018-1066-8",
      "pmid": "30073406",
      "url": "https://doi.org/10.1007/s00426-018-1066-8"
    }
  ],
  "neural-hydraulics-csf-flow": [
    {
      "title": "Sleep Drives Metabolite Clearance from the Adult Brain",
      "authors": "Xie et al.",
      "year": 2013,
      "journal": "Science",
      "doi": "10.1126/science.1241224",
      "pmid": "24136970",
      "url": "https://doi.org/10.1126/science.1241224"
    },
    {
      "title": "Cerebral Arterial Pulsation Drives Paravascular CSF-Interstitial Fluid Exchange in the Murine Brain",
      "authors": "Iliff et al.",
      "year": 2013,
      "journal": "The Journal of Neuroscience",
      "doi": "10.1523/JNEUROSCI.1592-13.2013",
      "pmid": "24227727",
      "url": "https://doi.org/10.1523/JNEUROSCI.1592-13.2013"
    },
    {
      "title": "Coupled electrophysiological, hemodynamic, and cerebrospinal fluid oscillations in human sleep",
      "authors": "Fultz et al.",
      "year": 2019,
      "journal": "Science",
      "doi": "10.1126/science.aax5440",
      "pmid": "31672896",
      "url": "https://doi.org/10.1126/science.aax5440"
    }
  ],
  "neural-optimizer-estrogen": [
    {
      "title": "Estradiol regulates hippocampal dendritic spine density via an N-methyl-D-aspartate receptor-dependent mechanism",
      "authors": "Woolley CS et al.",
      "year": 1994,
      "journal": "The Journal of Neuroscience",
      "doi": "10.1523/jneurosci.14-12-07680.1994",
      "url": "https://doi.org/10.1523/jneurosci.14-12-07680.1994"
    },
    {
      "title": "Sex differences in Alzheimer risk: Brain imaging of endocrine vs chronologic aging",
      "authors": "Mosconi L et al.",
      "year": 2017,
      "journal": "Neurology",
      "doi": "10.1212/wnl.0000000000004425",
      "url": "https://doi.org/10.1212/wnl.0000000000004425"
    }
  ],
  "neural-signal-to-noise-cleaning-system-channel": [
    {
      "title": "Shaping Functional Architecture by Oscillatory Alpha Activity: Gating by Inhibition",
      "authors": "Jensen O et al.",
      "year": 2010,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2010.00186",
      "url": "https://doi.org/10.3389/fnhum.2010.00186"
    },
    {
      "title": "Appraising the brain's energy budget",
      "authors": "Raichle ME et al.",
      "year": 2002,
      "journal": "Proceedings of the National Academy of Sciences",
      "doi": "10.1073/pnas.172399499",
      "url": "https://doi.org/10.1073/pnas.172399499"
    }
  ],
  "neuroplasticity-flow-overclocking": [
    {
      "title": "A meta-analytic review of the effects of exercise on brain-derived neurotrophic factor",
      "authors": "Szuhany KL et al.",
      "year": 2015,
      "journal": "Journal of Psychiatric Research",
      "doi": "10.1016/j.jpsychires.2014.10.003",
      "pmid": "25455510",
      "url": "https://doi.org/10.1016/j.jpsychires.2014.10.003"
    },
    {
      "title": "Neurocognitive mechanisms underlying the experience of flow",
      "authors": "Dietrich A",
      "year": 2004,
      "journal": "Consciousness and Cognition",
      "doi": "10.1016/j.concog.2004.07.002",
      "pmid": "15522630",
      "url": "https://doi.org/10.1016/j.concog.2004.07.002"
    },
    {
      "title": "A new mechanism of nervous system plasticity: activity-dependent myelination",
      "authors": "Fields RD",
      "year": 2015,
      "journal": "Nature Reviews Neuroscience",
      "doi": "10.1038/nrn4023",
      "pmid": "26585800",
      "url": "https://doi.org/10.1038/nrn4023"
    }
  ],
  "nightly-flush-glymphatic-neural-cache": [
    {
      "title": "A paravascular pathway facilitates CSF flow through the brain parenchyma and the clearance of interstitial solutes, including amyloid β",
      "authors": "Iliff JJ et al.",
      "year": 2012,
      "journal": "Science Translational Medicine",
      "doi": "10.1126/scitranslmed.3003748",
      "pmid": "22896675",
      "url": "https://doi.org/10.1126/scitranslmed.3003748"
    },
    {
      "title": "Sleep drives metabolite clearance from the adult brain",
      "authors": "Xie L et al.",
      "year": 2013,
      "journal": "Science",
      "doi": "10.1126/science.1241224",
      "pmid": "24136970",
      "url": "https://doi.org/10.1126/science.1241224"
    },
    {
      "title": "The Effect of Body Posture on Brain Glymphatic Transport",
      "authors": "Lee H et al.",
      "year": 2015,
      "journal": "Journal of Neuroscience",
      "doi": "10.1523/JNEUROSCI.1625-15.2015",
      "pmid": "26245965",
      "url": "https://doi.org/10.1523/JNEUROSCI.1625-15.2015"
    },
    {
      "title": "β-Amyloid accumulation in the human brain after one night of sleep deprivation",
      "authors": "Shokri-Kojori E et al.",
      "year": 2018,
      "journal": "Proceedings of the National Academy of Sciences",
      "doi": "10.1073/pnas.1721694115",
      "pmid": "29632177",
      "url": "https://doi.org/10.1073/pnas.1721694115"
    },
    {
      "title": "Coupled electrophysiological, hemodynamic, and cerebrospinal fluid oscillations in human sleep",
      "authors": "Fultz NE et al.",
      "year": 2019,
      "journal": "Science",
      "doi": "10.1126/science.aax5440",
      "pmid": "31672896",
      "url": "https://doi.org/10.1126/science.aax5440"
    },
    {
      "title": "Sleep deprivation impairs molecular clearance from the human brain",
      "authors": "Eide PK et al.",
      "year": 2021,
      "journal": "Brain",
      "doi": "10.1093/brain/awaa443",
      "pmid": "33829232",
      "url": "https://doi.org/10.1093/brain/awaa443"
    },
    {
      "title": "Brain clearance is reduced during sleep and anesthesia",
      "authors": "Miao A et al.",
      "year": 2024,
      "journal": "Nature Neuroscience",
      "doi": "10.1038/s41593-024-01638-y",
      "pmid": "38741022",
      "url": "https://doi.org/10.1038/s41593-024-01638-y"
    }
  ],
  "normal-hrv-by-age": [
    {
      "title": "A Quantitative Systematic Review of Normal Values for Short-Term Heart Rate Variability in Healthy Adults",
      "authors": "Nunan et al.",
      "year": 2010,
      "journal": "Pacing and Clinical Electrophysiology",
      "doi": "10.1111/j.1540-8159.2010.02841.x",
      "url": "https://doi.org/10.1111/j.1540-8159.2010.02841.x"
    },
    {
      "title": "Twenty-Four Hour Time Domain Heart Rate Variability and Heart Rate: Relations to Age and Gender Over Nine Decades",
      "authors": "Umetani et al.",
      "year": 1998,
      "journal": "Journal of the American College of Cardiology",
      "doi": "10.1016/S0735-1097(97)00554-8",
      "url": "https://doi.org/10.1016/S0735-1097(97)00554-8"
    },
    {
      "title": "Short-Term Heart Rate Variability—Influence of Gender and Age in Healthy Subjects",
      "authors": "Voss et al.",
      "year": 2015,
      "journal": "PLOS ONE",
      "doi": "10.1371/journal.pone.0118308",
      "url": "https://doi.org/10.1371/journal.pone.0118308"
    }
  ],
  "nose-vs-mouth-breathing": [
    {
      "title": "High nitric oxide production in human paranasal sinuses",
      "authors": "Lundberg JO et al.",
      "year": 1995,
      "journal": "Nature Medicine",
      "doi": "10.1038/nm0495-370",
      "pmid": "7585069",
      "url": "https://doi.org/10.1038/nm0495-370"
    }
  ],
  "om-chanting-brain-vagus": [
    {
      "title": "Neurohemodynamic correlates of OM chanting: A pilot functional magnetic resonance imaging study",
      "authors": "Kalyani BG et al.",
      "year": 2011,
      "journal": "International Journal of Yoga",
      "doi": "10.4103/0973-6131.78171",
      "pmid": "21654968",
      "url": "https://doi.org/10.4103/0973-6131.78171"
    }
  ],
  "overtraining-hrv-resting-heart-rate": [
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Med",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    },
    {
      "title": "Prevention, diagnosis, and treatment of the overtraining syndrome: joint consensus statement of the ECSS and ACSM",
      "authors": "Meeusen R et al.",
      "year": 2013,
      "journal": "Med Sci Sports Exerc",
      "doi": "10.1249/MSS.0b013e318279a10a",
      "pmid": "23247672",
      "url": "https://doi.org/10.1249/MSS.0b013e318279a10a"
    }
  ],
  "phase-locked-acoustic-sleep": [
    {
      "title": "Auditory closed-loop stimulation of the sleep slow oscillation enhances memory",
      "authors": "Ngo HV et al.",
      "year": 2013,
      "journal": "Neuron",
      "doi": "10.1016/j.neuron.2013.03.006",
      "pmid": "23583623",
      "url": "https://doi.org/10.1016/j.neuron.2013.03.006"
    },
    {
      "title": "Sleep drives metabolite clearance from the adult brain",
      "authors": "Xie L et al.",
      "year": 2013,
      "journal": "Science",
      "doi": "10.1126/science.1241224",
      "pmid": "24136970",
      "url": "https://doi.org/10.1126/science.1241224"
    }
  ],
  "physiological-concentration-flow-state-hardwired": [
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Front Hum Neurosci",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "physiological-sigh": [
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Reports Medicine",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    }
  ],
  "pranayama-metabolic-syndrome": [
    {
      "title": "To Study the Effect of Pranayama on Clinical Predictors of Metabolic Syndrome in Medical Students with Raised Body Mass Index and or Elevated Blood Pressure: A Prospective Interventional Trial",
      "authors": "Rana et al.",
      "year": 2026,
      "journal": "International Journal of Current Pharmaceutical Review and Research",
      "doi": "10.25258/ijcpr.18.3.173",
      "url": "https://doi.org/10.25258/ijcpr.18.3.173"
    }
  ],
  "protein-intake-muscle-protein-synthesis": [
    {
      "title": "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults",
      "authors": "Morton RW et al.",
      "year": 2018,
      "journal": "Br J Sports Med",
      "doi": "10.1136/bjsports-2017-097608",
      "pmid": "28698222",
      "url": "https://doi.org/10.1136/bjsports-2017-097608"
    },
    {
      "title": "International Society of Sports Nutrition Position Stand: protein and exercise",
      "authors": "Jäger R et al.",
      "year": 2017,
      "journal": "J Int Soc Sports Nutr",
      "doi": "10.1186/s12970-017-0177-8",
      "pmid": "28642676",
      "url": "https://doi.org/10.1186/s12970-017-0177-8"
    },
    {
      "title": "How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution",
      "authors": "Schoenfeld BJ, Aragon AA",
      "year": 2018,
      "journal": "J Int Soc Sports Nutr",
      "doi": "10.1186/s12970-018-0215-1",
      "pmid": "29497353",
      "url": "https://doi.org/10.1186/s12970-018-0215-1"
    }
  ],
  "protocol-circadian-hard-reset": [
    {
      "title": "Entrainment of the human circadian clock to the natural light-dark cycle",
      "authors": "Wright KP Jr et al.",
      "year": 2013,
      "journal": "Curr Biol",
      "doi": "10.1016/j.cub.2013.06.039",
      "pmid": "23910656",
      "url": "https://doi.org/10.1016/j.cub.2013.06.039"
    },
    {
      "title": "Meal Timing Regulates the Human Circadian System",
      "authors": "Wehrens SMT et al.",
      "year": 2017,
      "journal": "Curr Biol",
      "doi": "10.1016/j.cub.2017.04.059",
      "pmid": "28578930",
      "url": "https://doi.org/10.1016/j.cub.2017.04.059"
    }
  ],
  "rajyoga-open-eye-meditation": [
    {
      "title": "Functional reorganization of the brain in distinct frequency bands during eyes-open meditation.",
      "authors": "Pradeep Kumar G et al.",
      "year": 2023,
      "journal": "Conscious Cogn",
      "doi": "10.1016/j.concog.2023.103590",
      "pmid": "39491426",
      "url": "https://doi.org/10.1016/j.concog.2023.103590"
    },
    {
      "title": "Multiscale cardiorespiratory complexity reveals autonomic signatures of Rajyoga meditation.",
      "authors": "Singh R et al.",
      "year": 2026,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2026.1792917",
      "pmid": "42325329",
      "url": "https://doi.org/10.3389/fpsyg.2026.1792917"
    }
  ],
  "resonant-frequency-system-coherence": [
    {
      "title": "Characteristics of resonance in heart rate variability stimulated by biofeedback.",
      "authors": "Vaschillo EG et al.",
      "year": 2006,
      "journal": "Appl Psychophysiol Biofeedback",
      "doi": "10.1007/s10484-006-9009-3",
      "pmid": "16838124",
      "url": "https://doi.org/10.1007/s10484-006-9009-3"
    },
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    }
  ],
  "respiratory-rate-hidden-signal": [
    {
      "title": "Respiratory rate: the neglected vital sign.",
      "authors": "Cretikos MA et al.",
      "year": 2008,
      "journal": "Med J Aust",
      "doi": "10.5694/j.1326-5377.2008.tb01825.x",
      "pmid": "18513176",
      "url": "https://doi.org/10.5694/j.1326-5377.2008.tb01825.x"
    }
  ],
  "resting-heart-rate-by-age": [
    {
      "title": "Resting pulse rate reference data for children, adolescents, and adults: United States, 1999-2008.",
      "authors": "Ostchega Y et al.",
      "year": 2011,
      "journal": "National Health Statistics Reports (No. 41)",
      "pmid": "21905522",
      "url": "https://pubmed.ncbi.nlm.nih.gov/21905522/"
    }
  ],
  "rhythmic-entrainment-system-frequencies": [
    {
      "title": "Heart rate variability biofeedback: how and why does it work?",
      "authors": "Lehrer PM et al.",
      "year": 2014,
      "journal": "Front Psychol",
      "doi": "10.3389/fpsyg.2014.00756",
      "pmid": "25101026",
      "url": "https://doi.org/10.3389/fpsyg.2014.00756"
    },
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing.",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Front Hum Neurosci",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "short-daily-breathing-routine": [
    {
      "title": "Brief structured respiration practices enhance mood and reduce physiological arousal.",
      "authors": "Balban MY et al.",
      "year": 2023,
      "journal": "Cell Rep Med",
      "doi": "10.1016/j.xcrm.2022.100895",
      "pmid": "36630953",
      "url": "https://doi.org/10.1016/j.xcrm.2022.100895"
    }
  ],
  "social-jet-lag-irregular-sleep": [
    {
      "title": "Social jetlag: misalignment of biological and social time.",
      "authors": "Wittmann M et al.",
      "year": 2006,
      "journal": "Chronobiol Int",
      "doi": "10.1080/07420520500545979",
      "pmid": "16687322",
      "url": "https://doi.org/10.1080/07420520500545979"
    },
    {
      "title": "Association of Social Jetlag With Sleep Quality and Autonomic Cardiac Control During Sleep in Young Healthy Men.",
      "authors": "Sűdy ÁR et al.",
      "year": 2019,
      "journal": "Front Neurosci",
      "doi": "10.3389/fnins.2019.00950",
      "pmid": "31555086",
      "url": "https://doi.org/10.3389/fnins.2019.00950"
    }
  ],
  "spinal-harddrive-cpg-autonomous-scripts": [
    {
      "title": "Current Principles of Motor Control, with Special Reference to Vertebrate Locomotion",
      "authors": "Grillner S et al.",
      "year": 2020,
      "journal": "Physiological Reviews",
      "doi": "10.1152/physrev.00015.2019",
      "pmid": "31512990",
      "url": "https://doi.org/10.1152/physrev.00015.2019"
    }
  ],
  "spinal-intelligence-decentralized-control": [
    {
      "title": "Current Principles of Motor Control, with Special Reference to Vertebrate Locomotion",
      "authors": "Grillner S et al.",
      "year": 2020,
      "journal": "Physiological Reviews",
      "doi": "10.1152/physrev.00015.2019",
      "pmid": "31512990",
      "url": "https://doi.org/10.1152/physrev.00015.2019"
    }
  ],
  "sudarshan-kriya-yoga-breathing": [
    {
      "title": "Antidepressant efficacy of Sudarshan Kriya Yoga (SKY) in melancholia: a randomized comparison with electroconvulsive therapy (ECT) and imipramine",
      "authors": "Janakiramaiah N et al.",
      "year": 2000,
      "journal": "Journal of Affective Disorders",
      "doi": "10.1016/s0165-0327(99)00079-8",
      "pmid": "10708840",
      "url": "https://doi.org/10.1016/s0165-0327(99)00079-8"
    },
    {
      "title": "Breathing-based meditation decreases posttraumatic stress disorder symptoms in U.S. military veterans: a randomized controlled longitudinal study",
      "authors": "Seppälä EM et al.",
      "year": 2014,
      "journal": "Journal of Traumatic Stress",
      "doi": "10.1002/jts.21936",
      "pmid": "25158633",
      "url": "https://doi.org/10.1002/jts.21936"
    }
  ],
  "system-feedback-biometric-loop": [
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    }
  ],
  "system-stability-serotonin": [
    {
      "title": "Indigenous bacteria from the gut microbiota regulate host serotonin biosynthesis",
      "authors": "Yano JM et al.",
      "year": 2015,
      "journal": "Cell",
      "doi": "10.1016/j.cell.2015.02.047",
      "pmid": "25860609",
      "url": "https://doi.org/10.1016/j.cell.2015.02.047"
    }
  ],
  "talk-to-your-doctor-about-wearable-data": [
    {
      "title": "An Overview of Heart Rate Variability Metrics and Norms",
      "authors": "Shaffer F et al.",
      "year": 2017,
      "journal": "Frontiers in Public Health",
      "doi": "10.3389/fpubh.2017.00258",
      "pmid": "29034226",
      "url": "https://doi.org/10.3389/fpubh.2017.00258"
    }
  ],
  "tanden-breathing-serotonin": [
    {
      "title": "Activation of the anterior prefrontal cortex and serotonergic system is associated with improvements in mood and EEG changes induced by Zen meditation practice in novices",
      "authors": "Yu X et al.",
      "year": 2011,
      "journal": "International Journal of Psychophysiology",
      "doi": "10.1016/j.ijpsycho.2011.02.004",
      "pmid": "21333699",
      "url": "https://doi.org/10.1016/j.ijpsycho.2011.02.004"
    }
  ],
  "train-hrv-iphone-camera-no-wearable": [
    {
      "title": "Smartphone-enabled pulse rate variability: an alternative methodology for the collection of heart rate variability in psychophysiological research",
      "authors": "Heathers JA",
      "year": 2013,
      "journal": "International Journal of Psychophysiology",
      "doi": "10.1016/j.ijpsycho.2013.05.017",
      "pmid": "23751411",
      "url": "https://doi.org/10.1016/j.ijpsycho.2013.05.017"
    }
  ],
  "trataka-candle-gazing-focus": [
    {
      "title": "Effect of trataka on cognitive functions in the elderly",
      "authors": "Talwadkar S et al.",
      "year": 2014,
      "journal": "International Journal of Yoga",
      "doi": "10.4103/0973-6131.133872",
      "pmid": "25035618",
      "url": "https://doi.org/10.4103/0973-6131.133872"
    }
  ],
  "vagus-nerve-exercises": [
    {
      "title": "Vagus Nerve as Modulator of the Brain-Gut Axis in Psychiatric and Inflammatory Disorders",
      "authors": "Breit S, Kupferberg A, Rogler G, Hasler G",
      "year": 2018,
      "journal": "Frontiers in Psychiatry",
      "doi": "10.3389/fpsyt.2018.00044",
      "pmid": "29593576",
      "url": "https://doi.org/10.3389/fpsyt.2018.00044"
    },
    {
      "title": "Heart Rate Variability and Cardiac Vagal Tone in Psychophysiological Research – Recommendations for Experiment Planning, Data Analysis, and Data Reporting",
      "authors": "Laborde S, Mosley E, Thayer JF",
      "year": 2017,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2017.00213",
      "pmid": "28265249",
      "url": "https://doi.org/10.3389/fpsyg.2017.00213"
    },
    {
      "title": "Breath of Life: The Respiratory Vagal Stimulation Model of Contemplative Activity",
      "authors": "Gerritsen RJS, Band GPH",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00397",
      "pmid": "30356789",
      "url": "https://doi.org/10.3389/fnhum.2018.00397"
    },
    {
      "title": "The polyvagal theory: New insights into adaptive reactions of the autonomic nervous system",
      "authors": "Porges SW",
      "year": 2009,
      "journal": "Cleveland Clinic Journal of Medicine",
      "doi": "10.3949/ccjm.76.s2.17",
      "pmid": "19376991",
      "url": "https://doi.org/10.3949/ccjm.76.s2.17"
    },
    {
      "title": "Fundamental challenges and likely refutations of the five basic premises of the polyvagal theory",
      "authors": "Grossman P",
      "year": 2023,
      "journal": "Biological Psychology",
      "doi": "10.1016/j.biopsycho.2023.108589",
      "pmid": "37230290",
      "url": "https://doi.org/10.1016/j.biopsycho.2023.108589"
    }
  ],
  "ventral-tegmental-core-motivational-salience": [
    {
      "title": "Dopamine in motivational control: rewarding, aversive, and alerting.",
      "authors": "Bromberg-Martin et al.",
      "year": 2010,
      "journal": "Neuron",
      "doi": "10.1016/j.neuron.2010.11.022",
      "pmid": "21144997",
      "url": "https://doi.org/10.1016/j.neuron.2010.11.022"
    }
  ],
  "vipassana-meditation-attention-brain": [
    {
      "title": "Meditation experience is associated with increased cortical thickness.",
      "authors": "Lazar et al.",
      "year": 2005,
      "journal": "Neuroreport",
      "doi": "10.1097/01.wnr.0000186598.66243.19",
      "pmid": "16272874",
      "url": "https://doi.org/10.1097/01.wnr.0000186598.66243.19"
    }
  ],
  "vo2max-increase-aerobic-engine": [
    {
      "title": "Aerobic high-intensity intervals improve VO2max more than moderate training.",
      "authors": "Helgerud et al.",
      "year": 2007,
      "journal": "Med Sci Sports Exerc",
      "doi": "10.1249/mss.0b013e3180304570",
      "pmid": "17414804",
      "url": "https://doi.org/10.1249/mss.0b013e3180304570"
    },
    {
      "title": "Accelerated longitudinal decline of aerobic capacity in healthy older adults.",
      "authors": "Fleg et al.",
      "year": 2005,
      "journal": "Circulation",
      "doi": "10.1161/CIRCULATIONAHA.105.545459",
      "pmid": "16043637",
      "url": "https://doi.org/10.1161/CIRCULATIONAHA.105.545459"
    }
  ],
  "wearables-train-not-just-track": [
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    },
    {
      "title": "Heart Rate Variability Biofeedback Improves Emotional and Physical Health and Performance: A Systematic Review and Meta Analysis",
      "authors": "Lehrer P et al.",
      "year": 2020,
      "journal": "Applied Psychophysiology and Biofeedback",
      "doi": "10.1007/s10484-020-09466-z",
      "pmid": "32385728",
      "url": "https://doi.org/10.1007/s10484-020-09466-z"
    }
  ],
  "what-is-my-chronotype": [
    {
      "title": "A self-assessment questionnaire to determine morningness-eveningness in human circadian rhythms",
      "authors": "Horne JA, Östberg O",
      "year": 1976,
      "journal": "International Journal of Chronobiology",
      "pmid": "1027738",
      "url": "https://pubmed.ncbi.nlm.nih.gov/1027738/"
    },
    {
      "title": "Life between clocks: daily temporal patterns of human chronotypes",
      "authors": "Roenneberg T et al.",
      "year": 2003,
      "journal": "Journal of Biological Rhythms",
      "doi": "10.1177/0748730402239679",
      "pmid": "12568247",
      "url": "https://doi.org/10.1177/0748730402239679"
    },
    {
      "title": "Circadian typology: a comprehensive review",
      "authors": "Adan A et al.",
      "year": 2012,
      "journal": "Chronobiology International",
      "doi": "10.3109/07420528.2012.719971",
      "pmid": "23004349",
      "url": "https://doi.org/10.3109/07420528.2012.719971"
    }
  ],
  "what-to-do-after-low-hrv-reading": [
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    }
  ],
  "what-your-apple-watch-records": [
    {
      "title": "Accuracy in Wrist-Worn, Sensor-Based Measurements of Heart Rate and Energy Expenditure in a Diverse Cohort",
      "authors": "Shcherbina A et al.",
      "year": 2017,
      "journal": "Journal of Personalized Medicine",
      "doi": "10.3390/jpm7020003",
      "pmid": "28538708",
      "url": "https://doi.org/10.3390/jpm7020003"
    },
    {
      "title": "Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring",
      "authors": "Plews DJ et al.",
      "year": 2013,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-013-0071-8",
      "pmid": "23852425",
      "url": "https://doi.org/10.1007/s40279-013-0071-8"
    }
  ],
  "wim-hof-breathing-inflammation": [
    {
      "title": "Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans",
      "authors": "Kox M et al.",
      "year": 2014,
      "journal": "PNAS",
      "doi": "10.1073/pnas.1322174111",
      "pmid": "24799686",
      "url": "https://doi.org/10.1073/pnas.1322174111"
    },
    {
      "title": "The Effects of Cold Exposure Training and a Breathing Exercise on the Inflammatory Response in Humans: A Pilot Study",
      "authors": "Zwaag J et al.",
      "year": 2022,
      "journal": "Psychosomatic Medicine",
      "doi": "10.1097/PSY.0000000000001065",
      "pmid": "35213875",
      "url": "https://doi.org/10.1097/PSY.0000000000001065"
    }
  ],
  "wind-down-before-sleep-breathing": [
    {
      "title": "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
      "authors": "Zaccaro A et al.",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00353",
      "pmid": "30245619",
      "url": "https://doi.org/10.3389/fnhum.2018.00353"
    }
  ],
  "yoga-breathing-diabetes-blood-sugar": [
    {
      "title": "Effects of 12 Weeks Practice of Yoga on Heart Rate Variability in Males with Type 2 Diabetes Receiving Oral Antidiabetic Drugs: A Randomized Control Trial",
      "authors": "Danasegaran M et al.",
      "year": 2021,
      "journal": "Journal of Alternative and Complementary Medicine",
      "doi": "10.1089/acm.2020.0489",
      "pmid": "34582701",
      "url": "https://doi.org/10.1089/acm.2020.0489"
    },
    {
      "title": "Influence of pranayamas and yoga-asanas on serum insulin, blood glucose and lipid profile in type 2 diabetes",
      "authors": "Singh S et al.",
      "year": 2008,
      "journal": "Indian Journal of Clinical Biochemistry",
      "doi": "10.1007/s12291-008-0080-9",
      "pmid": "23105788",
      "url": "https://doi.org/10.1007/s12291-008-0080-9"
    }
  ],
  "yoga-nidra-sleep-science": [
    {
      "title": "Effect of yoga Nidra (yogic sleep) in sleep disturbances and insomnia: systematic review and metanalysis",
      "authors": "Singh S et al.",
      "year": 2026,
      "journal": "Sleep and Breathing",
      "doi": "10.1007/s11325-026-03685-0",
      "pmid": "42043659",
      "url": "https://doi.org/10.1007/s11325-026-03685-0"
    }
  ],
  "your-baseline-knows-first": [
    {
      "title": "Pre-symptomatic detection of COVID-19 from smartwatch data",
      "authors": "Mishra T et al.",
      "year": 2020,
      "journal": "Nature Biomedical Engineering",
      "doi": "10.1038/s41551-020-00640-6",
      "pmid": "33208926",
      "url": "https://doi.org/10.1038/s41551-020-00640-6"
    },
    {
      "title": "Real-time alerting system for COVID-19 and other stress events using wearable data",
      "authors": "Alavi A et al.",
      "year": 2022,
      "journal": "Nature Medicine",
      "doi": "10.1038/s41591-021-01593-2",
      "pmid": "34845389",
      "url": "https://doi.org/10.1038/s41591-021-01593-2"
    }
  ],
  "zazen-zen-meditation-brain": [
    {
      "title": "An electroencephalographic study on the zen meditation (Zazen)",
      "authors": "Kasamatsu A et al.",
      "year": 1966,
      "journal": "Folia Psychiatrica et Neurologica Japonica",
      "doi": "10.1111/j.1440-1819.1966.tb02646.x",
      "pmid": "6013341",
      "url": "https://doi.org/10.1111/j.1440-1819.1966.tb02646.x"
    }
  ],
  "zen-koans-brain-cognition": [
    {
      "title": "Thinking about not-thinking: neural correlates of conceptual processing during Zen meditation",
      "authors": "Pagnoni G et al.",
      "year": 2008,
      "journal": "PLoS One",
      "doi": "10.1371/journal.pone.0003083",
      "pmid": "18769538",
      "url": "https://doi.org/10.1371/journal.pone.0003083"
    }
  ],
  "zone-2-training-aerobic-base": [
    {
      "title": "Assessment of Metabolic Flexibility by Means of Measuring Blood Lactate, Fat, and Carbohydrate Oxidation Responses to Exercise in Professional Endurance Athletes and Less-Fit Individuals",
      "authors": "San-Millan I et al.",
      "year": 2018,
      "journal": "Sports Medicine",
      "doi": "10.1007/s40279-017-0751-x",
      "pmid": "28623613",
      "url": "https://doi.org/10.1007/s40279-017-0751-x"
    }
  ],
}
