/**
 * Camera heart-rate tool (contact PPG via phone camera).
 *
 * Measures pulse from the slight colour pulsation of a fingertip held over the
 * REAR camera + flash — contact photoplethysmography (Allen 2007). Contact
 * fingertip PPG is the more accurate of the smartphone methods, but accuracy
 * still varies a lot between implementations and conditions (Coppetti 2017),
 * so this is framed as a rough, educational estimate — not a medical device and
 * not your wearable's accuracy. We deliberately measure heart RATE only (not
 * HRV), which needs beat-to-beat precision a phone camera can't reliably give.
 *
 * All processing happens on-device in the browser; no video is recorded or sent.
 */

import type { ScienceSource } from './sources'

export const CAMERA_HR_SOURCES: ScienceSource[] = [
  {
    authors: 'Allen J',
    year: 2007,
    title: 'Photoplethysmography and its application in clinical physiological measurement',
    journal: 'Physiological Measurement, 28(3):R1–R39',
    contributes: 'Foundational review of PPG — the optical blood-volume signal this tool reads from your fingertip.',
    url: 'https://doi.org/10.1088/0967-3334/28/3/R01',
  },
  {
    authors: 'Coppetti T, Brauchlin A, Müggler S, et al.',
    year: 2017,
    title: 'Accuracy of smartphone apps for heart rate measurement',
    journal: 'European Journal of Preventive Cardiology, 24(12):1287–1293',
    contributes: 'Found contact (fingertip-on-camera) PPG more accurate than non-contact, but with large variability — why this is an estimate, not a measurement.',
    url: 'https://doi.org/10.1177/2047487317702044',
  },
]
