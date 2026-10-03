// GENERATED from landing/src/data/hrv-norms.ts by landing/scripts/export-chatgpt-data.ts — do not edit.

// src/data/hrv-norms.ts
var HRV_SOURCES = [
  {
    authors: "Nunan D, Sandercock GRH, Brodie DA",
    year: 2010,
    title: "A quantitative systematic review of normal values for short-term heart rate variability in healthy adults",
    journal: "Pacing and Clinical Electrophysiology, 33(11):1407\u20131417",
    contributes: "Pooled reference RMSSD/SDNN values across 44 studies of healthy adults (pooled resting RMSSD \u2248 42 ms) \u2014 anchors the central tendency.",
    url: "https://doi.org/10.1111/j.1540-8159.2010.02841.x"
  },
  {
    authors: "Umetani K, Singer DH, McCraty R, Atkinson M",
    year: 1998,
    title: "Twenty-four hour time domain heart rate variability and heart rate: relations to age and gender over nine decades",
    journal: "Journal of the American College of Cardiology, 31(3):593\u2013601",
    contributes: "The classic age-decline curve \u2014 time-domain HRV (incl. RMSSD) falling decade by decade \u2014 shapes the per-band shift.",
    url: "https://doi.org/10.1016/S0735-1097(97)00554-8"
  },
  {
    authors: "Voss A, Schroeder R, Heitmann A, Peters A, Perz S",
    year: 2015,
    title: "Short-term heart rate variability \u2014 influence of gender and age in healthy subjects",
    journal: "PLoS ONE, 10(3):e0118308",
    contributes: "Large healthy cohort (n \u2248 1,900; 5-min supine ECG) with age- and sex-stratified short-term HRV. Informs the RMSSD spread (p10\u2013p90 width) and is the direct source of the SDNN (Apple Watch) table: decade means \xB1 SD for women (Table 5) and men (Table 7).",
    url: "https://doi.org/10.1371/journal.pone.0118308"
  },
  {
    authors: "Task Force of the ESC and NASPE",
    year: 1996,
    title: "Heart rate variability: standards of measurement, physiological interpretation, and clinical use",
    journal: "Circulation, 93(5):1043\u20131065",
    contributes: "Foundational definitions of RMSSD/SDNN and measurement standards the literature reports against.",
    url: "https://doi.org/10.1161/01.CIR.93.5.1043"
  }
];
var HRV_METHODOLOGY = "These bands are derived, not copied from a single dataset. Most normative studies report means \xB1 SD or medians by decade for short-term, daytime, seated or supine recordings. We combined those central values (Nunan 2010), applied the decade-by-decade decline (Umetani 1998) and the age/sex spread (Voss 2015), then converted to approximate percentiles accounting for the known right-skew of RMSSD. Crucially, the table is keyed to night-time RMSSD \u2014 the overnight window consumer wearables (Oura, Whoop, Garmin) measure, when parasympathetic tone and RMSSD are at their highest. That is why these medians sit above the ~42 ms pooled daytime figure in Nunan 2010, and why a daytime 5-minute lab reading should not be compared directly against them. Treat the percentile as a rough population anchor, not a clinical cut-off \u2014 your own multi-week trend matters far more.";
var HRV_AGE_BANDS = [
  { minAge: 18, maxAge: 29, label: "18\u201329", p10: 30, p25: 42, p50: 58, p75: 78, p90: 100 },
  { minAge: 30, maxAge: 39, label: "30\u201339", p10: 26, p25: 36, p50: 50, p75: 68, p90: 90 },
  { minAge: 40, maxAge: 49, label: "40\u201349", p10: 22, p25: 30, p50: 42, p75: 56, p90: 75 },
  { minAge: 50, maxAge: 59, label: "50\u201359", p10: 18, p25: 26, p50: 36, p75: 48, p90: 64 },
  { minAge: 60, maxAge: 69, label: "60\u201369", p10: 16, p25: 22, p50: 30, p75: 42, p90: 56 },
  { minAge: 70, maxAge: Infinity, label: "70+", p10: 14, p25: 19, p50: 26, p75: 36, p90: 48 }
];
function bandForAge(age, metric = "rmssd") {
  const bands = metric === "sdnn" ? SDNN_AGE_BANDS : HRV_AGE_BANDS;
  return bands.find((b) => age >= b.minAge && age <= b.maxAge) ?? bands[0];
}
function estimatePercentile(rmssd, b) {
  const pts = [
    [b.p10, 10],
    [b.p25, 25],
    [b.p50, 50],
    [b.p75, 75],
    [b.p90, 90]
  ];
  if (rmssd <= b.p10) return Math.max(1, Math.round(rmssd / b.p10 * 10));
  if (rmssd >= b.p90) return Math.min(99, Math.round(90 + (rmssd - b.p90) / b.p90 * 9));
  for (let i = 0; i < pts.length - 1; i++) {
    const [v0, p0] = pts[i];
    const [v1, p1] = pts[i + 1];
    if (rmssd >= v0 && rmssd <= v1) {
      const t = (rmssd - v0) / (v1 - v0);
      return Math.round(p0 + t * (p1 - p0));
    }
  }
  return 50;
}
var TIERS = [
  { max: 20, tier: "low", label: "Low for your age" },
  { max: 40, tier: "below", label: "Below average" },
  { max: 60, tier: "average", label: "Average" },
  { max: 80, tier: "above", label: "Above average" },
  { max: 100, tier: "excellent", label: "Excellent" }
];
var SDNN_METHODOLOGY = "The SDNN table comes straight from Voss et al. 2015 (n \u2248 1,900 healthy adults, 5-minute resting ECG lying down): we pooled the published decade means \xB1 SD for women (Table 5) and men (Table 7), weighted by group size, and converted them to percentiles with a log-normal fit, because SDNN is right-skewed. The youngest band uses the 25\u201334 data and the oldest the 65\u201374 data. Apple Watch reports SDNN from short (~1 minute) readings taken several times a day and at night, so single values scatter more than a 5-minute lab recording \u2014 compare your weekly average, not one reading.";
var SDNN_AGE_BANDS = [
  { minAge: 18, maxAge: 34, label: "18\u201334", p10: 28, p25: 35, p50: 46, p75: 60, p90: 76 },
  { minAge: 35, maxAge: 44, label: "35\u201344", p10: 25, p25: 32, p50: 42, p75: 54, p90: 69 },
  { minAge: 45, maxAge: 54, label: "45\u201354", p10: 21, p25: 27, p50: 34, p75: 44, p90: 55 },
  { minAge: 55, maxAge: 64, label: "55\u201364", p10: 17, p25: 22, p50: 29, p75: 39, p90: 50 },
  { minAge: 65, maxAge: Infinity, label: "65+", p10: 15, p25: 20, p50: 26, p75: 35, p90: 45 }
];
function bandsFor(metric) {
  return metric === "sdnn" ? SDNN_AGE_BANDS : HRV_AGE_BANDS;
}
function interpretHrv(age, rmssd, metric = "rmssd") {
  const band = bandForAge(age, metric);
  const percentile = estimatePercentile(rmssd, band);
  const t = TIERS.find((x) => percentile <= x.max) ?? TIERS[2];
  const summaryByTier = {
    low: `At ${rmssd} ms you sit in the lower range for ${band.label}. A low single reading is common after poor sleep, alcohol, illness or hard training \u2014 what matters is your own trend over weeks, not one night.`,
    below: `${rmssd} ms is below the typical median (~${band.p50} ms) for ${band.label}. Sleep, alcohol timing, Zone-2 cardio and breathwork are the levers with the most evidence behind them.`,
    average: `${rmssd} ms is around the median (~${band.p50} ms) for ${band.label} \u2014 a healthy, typical resting HRV. Track your own baseline; a rising trend is the goal.`,
    above: `${rmssd} ms is above the median (~${band.p50} ms) for ${band.label} \u2014 a strong sign of parasympathetic (recovery) capacity. Protect it with consistent sleep and recovery.`,
    excellent: `${rmssd} ms is in the top range for ${band.label} \u2014 excellent autonomic flexibility, the kind seen in well-trained, well-recovered individuals.`
  };
  return {
    band,
    percentile,
    tier: t.tier,
    tierLabel: t.label,
    summary: summaryByTier[t.tier],
    barPct: Math.max(2, Math.min(98, percentile))
  };
}
export {
  HRV_AGE_BANDS,
  HRV_METHODOLOGY,
  HRV_SOURCES,
  SDNN_AGE_BANDS,
  SDNN_METHODOLOGY,
  bandForAge,
  bandsFor,
  interpretHrv
};
