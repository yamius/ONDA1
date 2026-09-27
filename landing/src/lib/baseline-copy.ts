/**
 * Copy + config for the Baseline tool (onda-life.com/tools/baseline).
 *
 * Ported from the Vallydia bridge (KK 56/57 + 12_ONDA_Watch) and re-framed for the ONDA /tools
 * section: this is an ORGANIC tool a person finds in search — "see what my Apple Watch recorded",
 * "apple health data history" — not the tail of a paid quiz. The mechanism (fragment parser + share
 * card) is identical; the wording is a tool that stands on its own, with the app as an optional
 * "the same thing, live".
 *
 * FIREWALL (app_baseline_spec 7). Never: detects, tracks a condition, warns, diagnoses, screening,
 * risk, abnormal, elevated, low, normal, fine, healthy, safe, early detection, monitoring, symptom.
 * Always: shows, records, collects, your own, your range, trend, summary. If a sentence reads as a
 * statement about the person's body, it is rewritten — a denial ("not a norm") fails the same word
 * search, so it is gone too.
 */

// Vite inlines import.meta.env at build; under tsx (prerender) it is undefined, so read it through a
// guard — the same trap the EMOTON analytics module hit. Never touch import.meta.env at module scope
// without this, or the prerender throws "Cannot read properties of undefined".
const ENV = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {};

/** The iCloud link to the Shortcut itself. Set VITE_BASELINE_SHORTCUT_URL once it is shared. */
export const SHORTCUT_URL = ENV.VITE_BASELINE_SHORTCUT_URL || "";

/** Has the Shortcut link been published yet? The button is not rendered as a dead end without it. */
export const SHORTCUT_READY = SHORTCUT_URL.length > 0;

/**
 * The Shortcut's own name, exactly as it appears in the Shortcuts app. An iCloud link can only ADD a
 * shortcut; `shortcuts://run-shortcut?name=` is the only way to RUN one from the web, and it matches
 * on the NAME — so this must be the real name, character for character, and settled before the first
 * hand-out (renaming breaks the run link for everyone who already installed it).
 */
export const SHORTCUT_NAME = ENV.VITE_BASELINE_SHORTCUT_NAME || "My Baseline";
export const SHORTCUT_RUN_URL = `shortcuts://run-shortcut?name=${encodeURIComponent(SHORTCUT_NAME)}`;

/**
 * The share card's strings. The heading lives on the PAGE, above the card, not on the card: the
 * picture travels into a chat and a headline addressed to the person who just ran the shortcut would
 * arrive without its context. The share text carries the link, because the card shows no address.
 */
export const BASELINE_CARD_UI = {
  pageHeading: "Your pulse is not just beats per minute",
  canvasAlt: "Your two-week figures drawn on a card you can share",
  cardButton: "Share",
  cardFooter: "Ask a friend what rhythm they breathe at.",
  shareButton: "Share my card",
  shareHint: "The picture is made on your phone. Nothing is uploaded.",
  savedNote: "Saved to your device.",
  shareText: "My two weeks, read off my own watch. Yours takes thirty seconds: https://onda-life.com/tools/baseline",
} as const;

export const BASELINE_UI = {
  // ── SEO shell (prerendered, always visible) ─────────────────────────────────────────────────
  h1: "See what your Apple Watch already recorded",
  intro:
    "A free tool that reads two weeks of your own Apple Health — resting pulse, heart-rate " +
    "variability and breathing rate — and shows you the range, not a single number. Everything is " +
    "read on your iPhone; the figures are never sent to us.",

  // ── with data ───────────────────────────────────────────────────────────────────────────────
  title: "Your last two weeks",
  lead: "Read from your own Health data, on your device. These numbers were never sent to us.",
  daysTemplate: "{n} OF {total} DAYS",
  noDataTag: "NO DATA",
  noDataBody: "Nothing recorded for this one in the last two weeks. It usually means no device was writing it.",

  closingOne: "This is your range over two weeks. Just yours, not a comparison with anyone.",
  closingTwo:
    "What it does not show: what happens between these numbers day to day, how they move together, " +
    "and what they did when you changed something. One snapshot is not enough for that — the ONDA " +
    "app is the same reading, live.",
  appButton: "See it live in the app →",

  // ── opened without a fragment (the ordinary /tools arrival) ─────────────────────────────────
  coldTitle: "See what your Apple Watch already recorded",
  coldLead: "A shortcut reads two weeks of your Health data on your iPhone and shows it back to you here — free, nothing to install.",
  coldBody:
    "You add it once, then tap it once — that is the whole thing. It reads your watch on your iPhone, " +
    "and the numbers never leave it: they ride back in the part of the address your browser keeps to itself.",
  coldButton: "Read my watch →",
  coldRunLead: "Added. It does not start on its own — tap once to read your watch:",
  coldRunButton: "Read my watch now →",
  coldRunAgain: "Nothing added? Try again",
  coldSteps: [
    "Tap the button — Apple's Shortcuts app opens.",
    "Tap Add Shortcut.",
    "You are now in the Shortcuts app — tap the shortcut once, right there. That is the step people miss.",
    "Allow your health data once — iOS asks, we never see it.",
    "Your numbers open here.",
  ],
  coldStepsTitle: "What happens next",
  coldTileHint: "Add it, then tap this blue tile once — that is the whole trick.",
  coldAutorun: "Opening Shortcuts…",
  coldAutorunFallback: "Nothing opened? Tap here:",
  notApple:
    "The shortcut needs an iPhone — it reads Apple Health, which only exists there. Open this page on your phone and it will work.",
  privacyNote: "Your figures stay on your device. We never receive them, and this page carries no analytics.",
} as const;

/**
 * Explainer + FAQ shown below the tool (task: make /tools/baseline a full page for search and AI
 * answers). Rendered in BOTH phases, prerendered, script-free. Same FIREWALL as above — every line
 * describes what is recorded and shown, never what it means for the body. The FAQ here is the single
 * source for the on-page FAQ and the FAQPage JSON-LD (meta-inject), so they never drift.
 */
export const BASELINE_SEO = {
  metaTitle: "See Your Apple Watch Data: 2-Week Baseline | ONDA Life",
  metaDescription:
    "Free tool: read two weeks of your own Apple Health — resting heart rate, HRV and breathing rate — on your iPhone and see your range. Nothing is uploaded, no app needed.",
  unavailable:
    "The shortcut link is being prepared and will appear here. Until then, the ONDA app shows the same reading from your Apple Watch, live.",
  unavailableButton: "Open the ONDA app →",
  sections: [
    {
      h2: "What the Baseline shows",
      paras: [
        "Three things your Apple Watch already writes to Apple Health, over the last 14 days: resting heart rate, heart rate variability (HRV) and breathing rate. For each one you see your own range — the smallest and the largest daily value — plus your average and how many of the 14 days have a reading.",
        "Resting heart rate is the figure Apple Watch records while you are still. HRV is recorded by Apple as SDNN, from short readings the watch takes in the background during the day and night. Breathing rate is recorded while you sleep with sleep tracking on.",
      ],
    },
    {
      h2: "Why two weeks and a range, not one number",
      paras: [
        "A single day moves with sleep, training, travel, a late meal or a glass of wine. Fourteen days are enough to show your usual span — the band your own figures move in — and that band is far more useful to look at than any one reading.",
        "The Baseline is only about you: it shows your own figures side by side, with no comparison with anyone else and no score.",
      ],
    },
    {
      h2: "How it works, step by step",
      steps: [
        "On your iPhone, tap \"Read my watch\" — Apple's Shortcuts app opens with the shortcut.",
        "Tap Add Shortcut. This is a one-time step.",
        "In the Shortcuts app, tap the shortcut once to run it.",
        "iOS asks once for permission to read your Health data. You decide; we never see it.",
        "The shortcut reads the last 14 days on your iPhone and opens this page with your figures.",
      ],
    },
    {
      h2: "Where your numbers go: nowhere",
      paras: [
        "The shortcut reads Apple Health on your iPhone and passes the figures back in the part of the web address after the # sign — the URL fragment. Browsers never send the fragment to a server, so the numbers reach this page without reaching us.",
        "The page removes them from the address bar the moment they are read, so they are not left in your history or a screenshot. This page carries no analytics, no advertising pixels and no third-party scripts, and it records nothing about your visit.",
      ],
    },
    {
      h2: "What you need",
      paras: [
        "An iPhone with Apple Health, and an Apple Watch (or another device that writes heart data to Health) worn for at least part of the last two weeks. The Shortcuts app is built into iOS. There is no account and nothing to pay; the ONDA app is optional.",
        "It does not work on Android or on a computer, because it reads Apple Health, which only exists on iPhone.",
      ],
    },
  ] as Array<{ h2: string; paras?: string[]; steps?: string[] }>,
  faqTitle: "Apple Watch Baseline — common questions",
  faq: [
    { q: "How do I see my Apple Watch heart data from the last two weeks?", a: "In the Health app on your iPhone (Browse → Heart), or with this free Baseline tool, which reads resting heart rate, HRV and breathing rate for the last 14 days and shows each as your own range on one page." },
    { q: "What does the Baseline tool show?", a: "Two weeks of your resting heart rate, heart rate variability and breathing rate from your own Apple Health — the smallest and largest daily value, your average and how many days have a reading." },
    { q: "Is my Apple Health data sent anywhere?", a: "No. The figures are read on your iPhone and travel back in the URL fragment, which browsers never send to a server. The page carries no analytics or third-party scripts." },
    { q: "Why does it say no data for one of the figures?", a: "Nothing was recorded for it in the last two weeks. Breathing rate, for example, is only recorded while you sleep with sleep tracking on." },
    { q: "Do I need an Apple Watch?", a: "An Apple Watch gives the fullest reading. Figures written to Health by other devices are shown too, and anything that was not recorded shows as no data." },
    { q: "Which HRV does Apple Watch record?", a: "SDNN, in milliseconds, from short readings the watch takes in the background. Oura, Whoop and Garmin use RMSSD, so their numbers are not directly comparable." },
    { q: "Does it work on Android?", a: "No. It reads Apple Health, which only exists on iPhone. Open the page on an iPhone and it works." },
  ],
  relatedTitle: "Related",
  related: [
    { label: "What your Apple Watch records over two weeks", href: "/articles/what-your-apple-watch-records" },
    { label: "Apple Watch HRV: two numbers explained", href: "/articles/apple-watch-recovery-hrv-vs-overall-hrv" },
    { label: "HRV Calculator by Age", href: "/tools/hrv" },
    { label: "Resting heart rate by age", href: "/tools/resting-heart-rate" },
  ],
} as const;
