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

export const CAMERA_HR_METHODOLOGY =
  'Your fingertip, lit by the camera flash, changes colour very slightly with every heartbeat as blood pulses through it. The camera sees that rhythmic change; the tool averages the red channel of the image frame by frame, filters it, and finds the dominant beat frequency to estimate your heart rate — the same contact-PPG principle behind a clinical pulse oximeter (Allen 2007). Contact fingertip readings are the more reliable smartphone method, but accuracy still varies widely with device, lighting, pressure and stillness (Coppetti 2017), so treat the number as a rough, educational estimate — not a medical device and not the accuracy of a chest strap or a validated wearable. We estimate heart rate only, not HRV, because beat-to-beat variability needs a precision a phone camera can’t dependably deliver. Everything is processed live on your device; no image or video is ever recorded or uploaded.'

export const CAMERA_HR_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How does measuring heart rate with a phone camera work?',
    a: 'It uses contact photoplethysmography (PPG). When you cover the rear camera and flash with your fingertip, the light shines through your skin and the camera detects the tiny colour change as blood pulses with each heartbeat. The tool tracks that rhythm over ~30 seconds and calculates your beats per minute — the same optical principle a pulse oximeter uses (Allen 2007).',
  },
  {
    q: 'How accurate is it?',
    a: 'It’s a rough estimate, not a medical measurement. Studies show contact fingertip-camera readings are the more accurate smartphone method, but accuracy varies a lot with device, lighting, finger pressure and how still you hold (Coppetti 2017). Use it for a ballpark and a fun demo of your own pulse — not for any medical decision. A chest strap or validated wearable is far more reliable.',
  },
  {
    q: 'Why does it only measure heart rate, not HRV?',
    a: 'Heart-rate variability needs the precise timing gap between individual beats, and a phone camera’s frame rate and noise can’t capture that dependably — small timing errors that don’t affect average heart rate wreck the beat-to-beat math. Rather than show a noisy, misleading HRV number, we keep it to heart rate, which the camera can estimate reasonably.',
  },
  {
    q: 'Is my camera footage private?',
    a: 'Yes. All the processing happens in your browser, on your device, in real time. No image or video is recorded, saved or uploaded anywhere — the camera frames are analysed for the colour signal and immediately discarded. When you finish, the camera turns off.',
  },
  {
    q: 'It won’t read / says weak signal — what helps?',
    a: 'Use a phone (the rear camera and flash are key). Cover the camera lens and the flash fully but gently with the pad of your fingertip, keep your hand still, and make sure the flash turns on. Too much pressure cuts off blood flow; too little lets in stray light. If your browser blocks the flash, try in good ambient light. Desktop webcams generally won’t work well.',
  },
]
