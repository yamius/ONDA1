import type { Article } from './types'

/**
 * Estrogen and the brain / perimenopause brain fog investigation.
 * Estradiol shapes hippocampal synapses in animals (Woolley & McEwen 1992).
 * Brain fog in the transition is real but mostly temporary: SWAN found a
 * missing practice-effect in perimenopause that returned after menopause
 * (Greendale 2009); imaging shows brain changes that partly recover
 * (Mosconi 2021, small study). Hot flushes last a median 7.4 years (Avis
 * 2015). Mood risk rises in the transition (Freeman 2006).
 * Treatment: hormone therapy is the most effective treatment for hot flushes;
 * favourable for most healthy women under 60 / within 10 years of menopause,
 * but NOT for preventing dementia (NAMS 2022); started at 65+ it raised
 * dementia risk (Shumaker 2003 WHIMS); started early it neither helped nor
 * harmed cognition (Gleason 2015 KEEPS); breast-cancer risk depends on type
 * and duration (Collaborative Group 2019). Non-hormone options: CBT,
 * hypnosis, SSRIs/SNRIs, gabapentin, fezolinetant (NAMS 2023; Lederman 2023
 * SKYLIGHT 1); supplements, paced breathing and cooling tricks not
 * recommended for hot flushes (NAMS 2023); soy isoflavones modest (Taku
 * 2012). Strength and impact training for bone (Watson 2017 LIFTMOR).
 * Removed from the old version: "estrogen is the brain's lubricant",
 * "processor at lower clock speeds", "degradation", "estrogen increases
 * leptin sensitivity", phyto-inquiry patch, high-dose omega-3 shield,
 * "cold exposure for hot flashes", "magnesium reload", no mention of HT.
 * Honest firewall: ONDA does not measure hormones and does not treat
 * menopause symptoms; breathing practice is for calm, not a hot-flush cure.
 */
const article: Article = {
  slug: 'neural-optimizer-estrogen',
  title: 'Estrogen and the Brain: Is Perimenopause Brain Fog Real — and What Helps?',
  subtitle:
    'Why memory and focus can slip during the menopause transition, whether it lasts, and which treatments for brain fog, hot flushes and low mood have real evidence.',
  seoTitle: 'Estrogen and Brain Fog in Perimenopause: What Helps | ONDA Life',
  description:
    'Brain fog in perimenopause is real but usually temporary. How estrogen affects the brain, what hormone therapy can and cannot do, and other options that work.',
  category: 'Biological Software',
  relatedSlugs: [
    'hippocampus',
    'neuroplasticity',
    'hypothalamus',
    'serotonin',
    'bdnf',
  ],
  introStyle: 'indigo',
  image: '/images/articles/neural-optimizer-estrogen.webp',
  imageAlt:
    'Illustration of neural connections in the brain, representing how estrogen affects memory and focus during the menopause transition.',
  imageTitle: 'Estrogen and the brain',
  imageCaption:
    'Estrogen influences brain areas involved in memory, mood and body temperature. That is why the menopause transition can affect all three.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Do hormones really control how you feel? What the science shows about hormones, brain chemicals and mood.',
    link: '/articles/molecular-psychology-hormonal-firmware',
    linkText: 'Do Hormones Control Your Mood? →',
  },
  howToSteps: [
    {
      name: 'Track symptoms for a few weeks',
      text: 'Note hot flushes, night sweats, sleep, mood, forgetfulness and your cycle dates. A written record makes a doctor’s visit much more useful.',
      protocolId: 'estrogen-symptom-log',
    },
    {
      name: 'Discuss treatment options with a doctor',
      text: 'Ask about hormone therapy and about non-hormone options such as CBT, certain antidepressants, gabapentin or fezolinetant. The right choice depends on your age, symptoms and health history.',
      protocolId: 'estrogen-treatment-talk',
    },
    {
      name: 'Protect sleep and train your muscles and bones',
      text: 'Keep regular sleep times, a cool bedroom, and do strength training and some impact exercise most weeks, ideally with guidance if you have low bone density.',
      protocolId: 'estrogen-sleep-strength',
    },
  ],
  content: `
## [ CASE FILE: THE FOGGY TRANSITION ]

> "A popular article says estrogen is the brain's 'lubricant'. When it drops, your brain runs at a lower 'clock speed' and starts to degrade. The fix: soy, flaxseed, high-dose fish oil, cold exposure for hot flushes and magnesium.

> Many women in their 40s and 50s do notice they forget words or lose their train of thought. But is the brain really declining? Does it last? And why does the article never mention the treatment that works best?"

---

## Section 1: How does estrogen affect the brain?

Estrogen — mainly estradiol before menopause — acts on many brain areas, including the hippocampus (memory), the prefrontal cortex (planning and attention) and the hypothalamus (body temperature and sleep).

In female rats, the number of connections between nerve cells in the hippocampus rises and falls with estradiol across the cycle (Woolley & McEwen 1992). This is one reason scientists think estrogen supports memory. But animal findings do not translate into simple rules like "more estrogen, better brain".

Estrogen matters for men too: in men it is made from testosterone and helps protect bone and metabolism.

---

## Section 2: Is perimenopause brain fog real?

Yes — but it is usually mild and temporary.

In the large US SWAN study, women were tested repeatedly over several years. Normally people score a little better each time they repeat a test. During perimenopause that improvement disappeared for memory and processing speed; after menopause it came back (Greendale 2009). In other words, most women did not lose abilities — they temporarily stopped improving.

Brain scans tell a similar story. A small imaging study found changes in brain structure and energy use across the transition, with partial recovery after menopause (Mosconi 2021).

Poor sleep, night sweats and low mood also make it harder to focus, so part of the fog comes from these symptoms rather than from estrogen directly. Depressed mood becomes more likely during the transition, even in women with no history of depression (Freeman 2006).

---

## Section 3: How long do hot flushes and other symptoms last?

Often longer than people expect. In SWAN, hot flushes and night sweats lasted a median of 7.4 years, and longer in women whose symptoms started early in perimenopause (Avis 2015).

Hot flushes come from the brain's temperature control centre in the hypothalamus, which becomes more sensitive when estrogen falls.

---

## Section 4: Does hormone therapy help brain fog and hot flushes?

For hot flushes, hormone therapy (HT) is the most effective treatment. For memory, it is not a proven fix.

- **Hot flushes and night sweats.** According to the North American Menopause Society, HT is the most effective treatment. For most healthy women under 60 or within 10 years of menopause, the benefits usually outweigh the risks (NAMS 2022).
- **Memory.** In the KEEPS trial, HT started soon after menopause neither improved nor harmed thinking over four years (Gleason 2015). Better sleep and fewer night sweats may still make you feel sharper.
- **Dementia.** HT should not be used to prevent dementia (NAMS 2022). In women who started estrogen plus progestin at 65 or older, dementia risk was about twice as high (Shumaker 2003).
- **Risks.** Combined HT slightly raises breast cancer risk, depending on the type and how long it is used (Collaborative Group 2019). Blood clot and stroke risk depends on the form and your health. These are personal decisions to make with a doctor.

---

## Section 5: What are the non-hormone options?

If you cannot or do not want to take hormones, several options have good evidence for hot flushes (NAMS 2023):

- **Cognitive behavioural therapy (CBT)** and clinical hypnosis — they reduce how much hot flushes bother you and improve sleep.
- **Certain antidepressants** (SSRIs and SNRIs) and **gabapentin**.
- **Fezolinetant**, a newer medicine that acts directly on the brain's temperature centre. In a phase 3 trial it reduced the number and severity of hot flushes compared with placebo (Lederman 2023). It needs liver blood tests.

---

## Section 6: Do soy, supplements, cold exposure or breathing help?

Mostly not enough to count on.

- **Soy isoflavones** reduced hot flushes modestly in a meta-analysis (Taku 2012), but results vary, and NAMS does not recommend them as treatment (NAMS 2023).
- **Herbal and other supplements**, including high-dose fish oil, are not recommended for hot flushes (NAMS 2023). Some interact with medicines.
- **Paced breathing and cooling tricks** are also not recommended as treatments for hot flushes (NAMS 2023). A fan and a cool bedroom can still make nights more comfortable.
- **Strength and impact training** is worth doing for other reasons. Estrogen loss speeds up bone loss, and a supervised high-intensity strength and impact programme improved bone density in postmenopausal women with low bone mass (Watson 2017).

**Myth-check:**

- *"Estrogen loss makes your brain degrade."* — For most women, memory changes are small and improve after menopause.
- *"Cold exposure and magnesium fix hot flushes."* — There is no good evidence for this.
- *"Fish oil protects the brain during menopause."* — Not supported as a treatment.
- *"Hormone therapy is always dangerous."* — Risks are real but depend on age, type and health; for many women under 60 benefits outweigh them.

---

## Section 7: Can ONDA help during perimenopause?

ONDA does not measure hormones and does not treat menopause symptoms.

With an Apple Watch, ONDA reads heart rate variability (HRV), resting heart rate and sleep data from Apple Health. Night sweats and poor sleep often show up as worse sleep and recovery signals, so these trends can help you describe your nights to a doctor. ONDA's guided breathing practices can help you calm down, for example when you wake at night — but they are not a treatment for hot flushes.

---

## Section 8: When should you see a doctor?

See a doctor if menopause symptoms affect your sleep, work or relationships; if low mood or anxiety lasts more than two weeks; or if you want to discuss hormone or non-hormone treatment.

**See a doctor promptly** if memory problems are getting steadily worse, if others notice them, or if you get lost in familiar places — this is not typical of menopause. Also get checked for any bleeding after menopause, or very heavy or irregular bleeding during perimenopause.

If you have thoughts of harming yourself, contact emergency services or a crisis line right away (in the US, call or text 988).
`,
}

export default [article]
