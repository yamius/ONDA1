import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-gynecologist',
  title: "Your Cycle in Your Heart Rate: What a Gynecologist Can Do With Your Data (Cycle, Pregnancy, Menopause)",
  seoTitle: "Your Cycle in Your Heart Rate: Data for a Gynecologist | ONDA Life",
  description:
    "Resting heart rate and HRV shift across the menstrual cycle, through pregnancy and in the years around menopause. Here's how a gynecologist can use that history, what it can't tell them, and how to share it on your terms.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-gp", "onda-report-for-your-sleep-specialist", "onda-report-for-your-endocrinologist", "femtech-cyclical-architecture"],
  introStyle: 'rose',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
For many women, resting heart rate and HRV aren't steady numbers — they move with hormones. Across the menstrual cycle, resting heart rate tends to rise a few beats after ovulation and HRV tends to dip; in pregnancy, resting heart rate climbs steadily; around menopause, hot flashes and night sweats can show up as restless, elevated nights. That's why a flat "normal range" can be misleading, and why your own history is more useful than any chart. A gynecologist can read those patterns alongside your symptoms — to make sense of cycle-related changes, spot things worth testing, and talk through options in perimenopause. Your watch doesn't diagnose anything here, and it isn't a contraceptive or fertility tool. But it can turn "I feel different at certain times of the month" into a dated, visible pattern.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Why hormones show up in your heart rate

Sex hormones influence the autonomic nervous system and body temperature. After ovulation, rising progesterone raises body temperature slightly and, on average, resting heart rate goes up by a few beats while HRV goes down, until the next period begins. Studies using wearables have seen this rhythm clearly across large groups — though the size of the shift varies a lot between women, and some, especially on hormonal contraception, see little change.

The practical lesson: if you menstruate, a higher resting heart rate or lower HRV in the second half of your cycle is often **normal for you**, not a sign that something's wrong. Your personal pattern over several cycles is the reference that matters.

## Across the menstrual cycle

A gynecologist can use a few months of data to:

- **See your cyclical pattern**, so normal monthly shifts aren't mistaken for illness or poor recovery.
- **Link symptoms to cycle phase** — low mood, poor sleep, fatigue or palpitations that consistently arrive at the same point may point toward premenstrual conditions worth discussing.
- **Notice when the pattern breaks** — a rhythm that changes or disappears, alongside irregular periods, can be a reason to look further.
- **Spot possible anaemia.** Heavy periods can lead to iron deficiency, which can raise resting heart rate and cause tiredness. A rising baseline with heavy bleeding and fatigue is a good reason for a blood test.

Add cycle days and symptoms to your notes; that's what makes these patterns readable.

## During pregnancy

In pregnancy, resting heart rate normally rises gradually as blood volume and the heart's workload increase, and HRV tends to fall. Seeing this on your watch is expected, not alarming in itself.

Your data can be a calm, informative record to share with your midwife or obstetrician — especially notes on sleep, palpitations or dizziness. But it's **not a pregnancy monitoring tool.** Your prenatal checks, blood pressure measurements and tests are what keep you and your baby safe. If you want to practise breathing exercises, gentle slow breathing is usually well tolerated; ask your provider, and avoid breath-holding or forceful techniques.

Seek care promptly in pregnancy for chest pain, severe breathlessness, fainting, a severe headache or vision changes, bleeding, or anything that feels seriously wrong.

## Around menopause

Perimenopause — the years before periods stop — often brings changes that show up in data:

- **Hot flashes and night sweats** can appear as nights with elevated heart rate and broken sleep.
- **Palpitations** are common and usually harmless, but worth mentioning.
- **Sleep becomes lighter** and more fragmented for many women.

A gynecologist can use dated nights and symptoms to judge how much menopause is affecting your sleep and daily life, and to talk through management options — from lifestyle measures to treatments such as hormone therapy, which is a decision made together with your doctor based on your history. Your trend can also show how your nights change after starting a treatment.

## Where watch data stops

- **It can't diagnose gynecological or hormonal conditions.** Examination, blood tests and ultrasound do that.
- **It isn't contraception or a fertility method.** Don't use heart-rate or HRV patterns to decide when you can or can't conceive. (Some watches have separate cycle and temperature-based features; ONDA does not predict ovulation.)
- **It isn't pregnancy monitoring.** Follow your prenatal care plan.
- **Palpitations need proper assessment** if they're frequent, prolonged or come with dizziness, fainting or chest pain.

## Your data, your choice

Reproductive health is private. With ONDA, your data and notes stay on your device, and nothing is shared unless you choose to export it. You decide which period to include and whether to add cycle notes at all.

## How to prepare for the appointment

- **Bring 2–3 cycles** of your report (or the relevant months in pregnancy or perimenopause).
- **Mark cycle days, bleeding and symptoms** in your notes.
- **Note sleep and night symptoms**, such as sweats or waking.
- **List contraception, hormone treatments and supplements** with dates.
- **Ask:** "Is this pattern normal for my cycle, or worth checking?"

## Your rhythm, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch, marks the days you left your usual range, and lets you add notes — including cycle days and symptoms, if you choose. You can export any period as a PDF, generated on your device and shared only by you, so a gynecologist can see your own rhythm over several months.

*ONDA is a breathing and HRV biofeedback app, not a medical device. It is not a contraceptive, fertility or pregnancy monitoring tool. This article is general information, not medical advice. If you have warning symptoms in pregnancy, seek care promptly.*
`,
}

export default [article]
