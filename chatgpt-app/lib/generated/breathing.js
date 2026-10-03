// GENERATED from landing/src/data/breathing.ts by landing/scripts/export-chatgpt-data.ts — do not edit.

// src/data/breathing.ts
var FULL = 1;
var EMPTY = 0.42;
var BREATHING_PATTERNS = [
  {
    id: "box",
    phases: [
      { kind: "in", seconds: 4, scale: FULL },
      { kind: "hold", seconds: 4, scale: FULL },
      { kind: "out", seconds: 4, scale: EMPTY },
      { kind: "hold", seconds: 4, scale: EMPTY }
    ]
  },
  {
    id: "478",
    phases: [
      { kind: "in", seconds: 4, scale: FULL },
      { kind: "hold", seconds: 7, scale: FULL },
      { kind: "out", seconds: 8, scale: EMPTY }
    ]
  },
  {
    id: "coherent",
    phases: [
      { kind: "in", seconds: 5.5, scale: FULL },
      { kind: "out", seconds: 5.5, scale: EMPTY }
    ]
  },
  {
    id: "calming",
    phases: [
      { kind: "in", seconds: 4, scale: FULL },
      { kind: "out", seconds: 6, scale: EMPTY }
    ]
  },
  {
    // Physiological sigh / cyclic sighing (Balban 2023): a full nasal inhale,
    // a short second "top-up" inhale, then a long slow exhale.
    id: "sigh",
    phases: [
      { kind: "in", seconds: 2.5, scale: 0.85 },
      { kind: "topup", seconds: 1, scale: FULL },
      { kind: "out", seconds: 6, scale: EMPTY }
    ]
  }
];
var BREATHING_SOURCES = [
  {
    authors: "Zaccaro A, Piarulli A, Laurino M, et al.",
    year: 2018,
    title: "How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing",
    journal: "Frontiers in Human Neuroscience, 12:353",
    contributes: "Systematic review linking slow breathing to higher HRV, parasympathetic shift and reduced arousal.",
    url: "https://doi.org/10.3389/fnhum.2018.00353"
  },
  {
    authors: "Lehrer PM, Gevirtz R",
    year: 2014,
    title: "Heart rate variability biofeedback: how and why does it work?",
    journal: "Frontiers in Psychology, 5:756",
    contributes: "Explains the ~0.1 Hz (\u22486 breaths/min) resonance frequency and baroreflex mechanism behind coherent breathing.",
    url: "https://doi.org/10.3389/fpsyg.2014.00756"
  },
  {
    authors: "Balban MY, Neri E, Kogon MM, et al.",
    year: 2023,
    title: "Brief structured respiration practices enhance mood and reduce physiological arousal",
    journal: "Cell Reports Medicine, 4(1):100895",
    contributes: "RCT: 5 minutes a day of exhale-emphasised breathing \u2014 cyclic sighing most of all \u2014 improved mood and lowered resting breathing rate more than mindfulness meditation.",
    url: "https://doi.org/10.1016/j.xcrm.2022.100895"
  }
];
export {
  BREATHING_PATTERNS,
  BREATHING_SOURCES
};
