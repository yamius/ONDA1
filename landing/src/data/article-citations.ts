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
}
