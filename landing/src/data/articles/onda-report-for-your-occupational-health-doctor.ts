import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-occupational-health-doctor',
  title: "Your Work Week in Your Heart Rate: What an Occupational Health Doctor Can Do With Your Data (Shift Work, Burnout)",
  seoTitle: "Shift Work & Burnout: Data for Occupational Health | ONDA Life",
  description:
    "Your body keeps a record of your job. Night shifts, long hours and chronic work stress leave a signature in resting heart rate, HRV and sleep. Here's how an occupational health doctor can use it — and what to know about confidentiality.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-sleep-specialist", "onda-report-for-your-therapist-or-psychiatrist", "chronic-stress-nervous-system-never-off", "social-jet-lag-irregular-sleep"],
  introStyle: 'slate',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Look at a few months of your resting heart rate and HRV and you'll often see your job in it. Workdays look different from days off. Night shifts leave broken, restless nights behind them. A heavy project shows up as a slow slide, and a holiday as a recovery you may not have noticed you needed. That "work-week signature" is exactly what an occupational health doctor is trained to think about: how your work affects your health, and how to adjust work so you can stay well in it. Your data can't diagnose burnout or a sleep disorder. But it can show, in your own numbers, whether your body ever gets to recover.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## What an occupational health doctor does

Occupational health doctors specialise in the link between work and health. They assess fitness for work, advise on adjustments after illness, help plan a return to work, and look at how schedules, shifts and workload affect people. Some work inside large employers; others are independent or part of public health systems.

That puts them in a unique position: unlike most doctors, they can influence the **work itself** — hours, shifts, duties, a phased return — not just treat the consequences.

## The two big patterns: shifts and chronic stress

**Night and rotating shifts.** Working against your body clock is one of the most studied occupational health risks. Night work pushes sleep into the day, when light and noise make it shorter and lighter, and it forces your internal clock to keep adjusting. Over time, shift work is associated with poorer sleep and with higher cardiovascular and metabolic risk. Some people develop shift work sleep disorder: persistent insomnia or excessive sleepiness tied to their schedule.

**Chronic work stress and burnout.** The World Health Organization describes burnout as an occupational phenomenon resulting from chronic workplace stress that hasn't been successfully managed — characterised by exhaustion, mental distance from one's job, and reduced effectiveness. It's not classified as a medical condition in itself, but it's taken seriously precisely because it affects health and work.

Both patterns tend to show up in the body: a nervous system that stays on high alert, sleep that doesn't restore, and recovery that only happens — if at all — away from work.

## How an occupational health doctor can read your report

**Workdays versus days off.** The most revealing comparison. If your resting heart rate is higher and HRV lower on workdays, and both recover on weekends or holidays, your data shows how much your job costs your body — and how much rest gives back. If they *don't* recover even on days off, that's important too.

**The shape of shift weeks.** For shift workers, nights around night shifts, the days after a rotation, and how long it takes to settle again.

**Slow trends.** A baseline that drifts over months during a demanding period can be an early, objective sign that load is outpacing recovery.

**Your notes.** Shift types, long days, deadlines, conflict, sick days, how rested you felt. The link between work events and your body is what makes this data useful here.

## What help an occupational health doctor can offer

**Advise on shift patterns.** Some schedules are easier on the body than others. For example, rotations that move forward — day, then evening, then night — are generally easier to adapt to than rotations that move backward, and enough recovery time between blocks matters. An occupational health doctor can recommend changes to you and, where appropriate, to your employer.

**Recommend work adjustments.** Reduced hours, changed duties, fewer nights or a phased return after sick leave — based on your health, not on guesswork.

**Plan a return after burnout or illness.** Returning gradually tends to work better than going straight back to full load. Your trend can show whether recovery is holding as hours increase.

**Advise on sleep and light for shift work.** Timing light exposure and darkness, protecting daytime sleep, and using anchor sleep can help shift workers — and a doctor can refer to a sleep specialist if a sleep disorder is suspected.

**Coordinate with other care.** Where stress has become anxiety or depression, or sleep has become a disorder, they can work with your GP, a therapist or a sleep specialist.

## A word about confidentiality

This matters with occupational health more than with any other doctor. Depending on your country and your employer, an occupational health doctor may share **conclusions about your fitness for work or recommended adjustments** with your employer — though usually not your detailed medical information. Before you share your data, ask plainly: *"What will be shared with my employer, and what stays between us?"* Then decide what to show. Your data is yours.

## Where watch data stops

- **It can't diagnose burnout, depression or a sleep disorder.** Those need a clinical assessment.
- **Workday differences have many causes** — commuting, caffeine, exercise timing, alcohol on weekends. Look at patterns across many weeks.
- **It shouldn't become another work metric.** If checking your recovery numbers turns into pressure to perform, look less often.

If work stress has left you feeling hopeless or thinking about harming yourself, contact your local emergency number or a crisis line now.

## How to prepare for the appointment

- **Bring 2–3 months** of your report, covering normal weeks and hard ones, and ideally a holiday.
- **Mark shifts, long days and days off** in your notes.
- **Describe sleep, energy and concentration** on workdays and days off.
- **Ask first about confidentiality** and what reaches your employer.
- **Ask:** "What changes to my work would help my body recover?"

## Your work week, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch, marks the days you left your usual range, and lets you note shifts, deadlines and days off. You can export any period as a PDF — generated on your device and shared only by you — so you decide exactly what an occupational health doctor sees.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not diagnose burnout or sleep disorders. This article is general information, not medical or legal advice. If you're in crisis, contact your local emergency number or a crisis line.*
`,
}

export default [article]
