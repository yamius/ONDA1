// GENERATED from landing/src/data/hrv-norms.ts by landing/scripts/export-chatgpt-data.ts — do not edit.

// src/data/hrv-norms.ts
var HRV_AGE_POINTS = [
  { minAge: 20, maxAge: 21, label: "20\u201321", female: { p25: 37, p50: 56, p75: 85 }, male: { p25: 45, p50: 66, p75: 96 } },
  { minAge: 25, maxAge: 26, label: "25\u201326", female: { p25: 32, p50: 48, p75: 73 }, male: { p25: 35, p50: 54, p75: 79 } },
  { minAge: 30, maxAge: 31, label: "30\u201331", female: { p25: 31, p50: 45, p75: 67 }, male: { p25: 34, p50: 49, p75: 71 } },
  { minAge: 35, maxAge: 36, label: "35\u201336", female: { p25: 29, p50: 41, p75: 60 }, male: { p25: 31, p50: 43, p75: 62 } },
  { minAge: 40, maxAge: 41, label: "40\u201341", female: { p25: 26, p50: 37, p75: 52 }, male: { p25: 27, p50: 38, p75: 54 } },
  { minAge: 45, maxAge: 46, label: "45\u201346", female: { p25: 24, p50: 33, p75: 46 }, male: { p25: 25, p50: 34, p75: 48 } },
  { minAge: 50, maxAge: 51, label: "50\u201351", female: { p25: 22, p50: 31, p75: 42 }, male: { p25: 23, p50: 31, p75: 42 } },
  { minAge: 55, maxAge: 56, label: "55\u201356", female: { p25: 22, p50: 29, p75: 40 }, male: { p25: 21, p50: 29, p75: 39 } },
  { minAge: 60, maxAge: 61, label: "60\u201361", female: { p25: 21, p50: 28, p75: 38 }, male: { p25: 20, p50: 27, p75: 37 } }
];
var NATARAJAN_2020 = {
  authors: "Natarajan A, Pantelopoulos A, Emir-Farinas H, Natarajan P",
  year: 2020,
  title: "Heart rate variability with photoplethysmography in 8 million individuals: a cross-sectional study",
  journal: "Lancet Digital Health, 2(12):e650\u2013e657 (Supplementary appendix, Table S3)",
  contributes: "Direct source of the table: RMSSD between 6 and 7 a.m. among about 8 million Fitbit users (wrist optical sensor, still periods), median and 25th\u201375th percentile by age and sex. Three of the four authors were Fitbit employees and Fitbit funded the study.",
  url: "https://doi.org/10.1016/S2589-7500(20)30246-6"
};
var HRV_SOURCES = [
  NATARAJAN_2020,
  {
    authors: "Task Force of the ESC and NASPE",
    year: 1996,
    title: "Heart rate variability: standards of measurement, physiological interpretation, and clinical use",
    journal: "Circulation, 93(5):1043\u20131065",
    contributes: "Definition of RMSSD and the measurement standards the literature reports against.",
    url: "https://doi.org/10.1161/01.CIR.93.5.1043"
  }
];
var HRV_VERDICT_TEXT = {
  lower: "Lower than most Fitbit users your age",
  middle: "Within the middle half of Fitbit users your age",
  higher: "Higher than most Fitbit users your age"
};
var HRV_COMPARISON_DISCLAIMER = "This is a comparison with users of one device, not a medical norm. Your own trend matters more.";
var HRV_POSITION_TEXT = {
  lower: "below the middle half",
  middle: "within the middle half",
  higher: "above the middle half"
};
function nearestAgePoint(age) {
  let best = HRV_AGE_POINTS[0];
  let bestD = Infinity;
  for (const p of HRV_AGE_POINTS) {
    const d = age < p.minAge ? p.minAge - age : age > p.maxAge ? age - p.maxAge : 0;
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return best;
}
function interpretHrv(age, rmssd, sex) {
  const point = nearestAgePoint(age);
  const ref = point[sex];
  const verdict = rmssd < ref.p25 ? "lower" : rmssd > ref.p75 ? "higher" : "middle";
  const first = HRV_AGE_POINTS[0];
  const last = HRV_AGE_POINTS[HRV_AGE_POINTS.length - 1];
  return { point, sex, ref, verdict, outsideAgeRange: age < first.minAge || age > last.maxAge };
}
var HRV_COPY_VARS = Object.fromEntries(
  HRV_AGE_POINTS.flatMap((p) => [
    [`f${p.minAge}`, p.female.p50],
    [`m${p.minAge}`, p.male.p50]
  ])
);
function interpretHrvBoth(age, rmssd) {
  return { female: interpretHrv(age, rmssd, "female"), male: interpretHrv(age, rmssd, "male") };
}
export {
  HRV_AGE_POINTS,
  HRV_COMPARISON_DISCLAIMER,
  HRV_COPY_VARS,
  HRV_POSITION_TEXT,
  HRV_SOURCES,
  HRV_VERDICT_TEXT,
  NATARAJAN_2020,
  interpretHrv,
  interpretHrvBoth,
  nearestAgePoint
};
