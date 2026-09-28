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
      "title": "Exercise, GLUT4, and Skeletal Muscle Glucose Uptake",
      "authors": "Richter EA et al.",
      "year": 2013,
      "journal": "Physiological Reviews",
      "doi": "10.1152/physrev.00038.2012",
      "url": "https://doi.org/10.1152/physrev.00038.2012"
    },
    {
      "title": "Metabolic Flexibility in Health and Disease",
      "authors": "Goodpaster BH et al.",
      "year": 2017,
      "journal": "Cell Metabolism",
      "doi": "10.1016/j.cmet.2017.04.015",
      "url": "https://doi.org/10.1016/j.cmet.2017.04.015"
    }
  ],
  "metabolic-redundancy-hybrid-power-architecture": [
    {
      "title": "Metabolic Flexibility in Health and Disease",
      "authors": "Goodpaster BH et al.",
      "year": 2017,
      "journal": "Cell Metabolism",
      "doi": "10.1016/j.cmet.2017.04.015",
      "url": "https://doi.org/10.1016/j.cmet.2017.04.015"
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
  "nightly-flush-glymphatic-neural-cache": [
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
  "quiet-mode-alpha-cortisol-buffer": [
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
      "title": "Heart Rate Variability and Cardiac Vagal Tone in Psychophysiological Research – Recommendations for Experiment Planning, Data Analysis, and Data Reporting",
      "authors": "Laborde S et al.",
      "year": 2017,
      "journal": "Frontiers in Psychology",
      "doi": "10.3389/fpsyg.2017.00213",
      "url": "https://doi.org/10.3389/fpsyg.2017.00213"
    },
    {
      "title": "The polyvagal theory: New insights into adaptive reactions of the autonomic nervous system",
      "authors": "Porges SW",
      "year": 2009,
      "journal": "Cleveland Clinic Journal of Medicine",
      "doi": "10.3949/ccjm.76.s2.17",
      "url": "https://doi.org/10.3949/ccjm.76.s2.17"
    },
    {
      "title": "Breath of Life: The Respiratory Vagal Stimulation Model of Contemplative Activity",
      "authors": "Gerritsen RJS, Band GPH",
      "year": 2018,
      "journal": "Frontiers in Human Neuroscience",
      "doi": "10.3389/fnhum.2018.00397",
      "url": "https://doi.org/10.3389/fnhum.2018.00397"
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
