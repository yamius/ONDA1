/**
 * Hand-written SERP titles/descriptions for EN pages that already rank on
 * Google page 1 but get few clicks (GSC near_top, 2026-09-01..28). They replace
 * the generated title/description in meta-inject; everything else (schema,
 * canonical, OG image) stays generated. Keep titles <= 60 chars including the
 * " | ONDA Life" suffix, descriptions <= 155 chars, and every fact in sync with
 * the page itself (price, score, verdict). Re-check against GSC after ~4 weeks.
 */
export const SERP_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  // --- CGM reviews ---
  '/reviews/lingo': {
    title: 'Lingo Review 2026: $54 CGM, No Prescription | ONDA Life',
    description:
      'Abbott’s over-the-counter CGM on Libre 3 hardware: $54 per 2-week sensor, no prescription needed. Who Lingo suits, its limits, and how it compares with Stelo.',
  },
  '/reviews/levels': {
    title: 'Levels Review 2026: New Plans, Worth It? | ONDA Life',
    description:
      'Levels now sells tiered memberships, from an app-only plan to yearly plans with CGM and lab tests. What each plan includes, who it suits, cheaper options.',
  },
  '/reviews/stelo': {
    title: 'Stelo Review 2026: Dexcom CGM, No Prescription | ONDA Life',
    description:
      'Stelo puts Dexcom G7 hardware in an over-the-counter CGM for non-diabetics: $99 for about 30 days. Accuracy, app limits and how it compares with Lingo.',
  },
  // --- breathing apps ---
  '/reviews/breathe-to-relax': {
    title: 'Breathe2Relax Review: Free App, Worth It? | ONDA Life',
    description:
      'A completely free breathing app built by US military telehealth for stress and PTSD. Strong clinical roots, dated design. Our verdict and better options.',
  },
  '/reviews/prana-breath': {
    title: 'Prana Breath Review 2026: Pros, Cons, Price | ONDA Life',
    description:
      'The most customisable pattern-based breathing app: mostly free, $10 one-time premium, Android-first. What it does well, where it feels dated, alternatives.',
  },
  '/compare/apps-combining-breathing-hrv-realtime-feedback': {
    title: 'Best Breathing Apps With Live HRV Feedback | ONDA Life',
    description:
      'Most apps either guide your breathing or read your HRV. These do both and show the feedback live. Ranked with honest pros and cons, including free options.',
  },
  // --- wearables ---
  '/reviews/ultrahuman-ring-air': {
    title: 'Ultrahuman Ring Air Review: Battery, US Ban | ONDA Life',
    description:
      'A light, subscription-free smart ring with good sleep tracking, but widespread battery failure reports and no longer sold in the US. What to buy instead.',
  },
  '/reviews/vs/apple-watch-series-12-vs-whoop-5-0': {
    title: 'Apple Watch 12 vs Whoop 5.0: Which Is Better? | ONDA Life',
    description:
      'No-subscription smartwatch vs subscription-only recovery band. We compare HRV accuracy, sleep, recovery scores, battery and total cost to help you choose.',
  },
  '/reviews/vs/apple-watch-series-12-vs-oura-ring-4': {
    title: 'Apple Watch 12 vs Oura Ring 4: Which to Buy? | ONDA Life',
    description:
      'Watch or ring? Apple Watch Series 12 vs Oura Ring 4 for HRV, sleep, recovery, comfort, battery and subscription cost, compared point by point.',
  },
  '/reviews/vs/whoop-5-0-vs-garmin-venu-4': {
    title: 'Whoop 5.0 vs Garmin Venu 4: Which Is Better? | ONDA Life',
    description:
      'Subscription recovery coach vs do-everything training watch. HRV, sleep, training load, battery and total cost compared, and who should pick which.',
  },
  '/reviews/vs/whoop-5-0-vs-polar-h10': {
    title: 'Whoop 5.0 vs Polar H10: HRV Accuracy Compared | ONDA Life',
    description:
      'A 24/7 recovery band vs the ECG chest strap used as a research reference. Which gives better HRV data, when each makes sense, and total cost.',
  },
  '/reviews/vs/oura-ring-4-vs-whoop-5-0-vs-garmin-venu-4': {
    title: 'Oura vs Whoop vs Garmin (2026): Which to Buy? | ONDA Life',
    description:
      'Ring, recovery band or training watch? Oura Ring 4, Whoop 5.0 and Garmin Venu 4 compared on HRV, sleep, battery, subscription and who each one suits.',
  },
  '/reviews/vs/apple-watch-series-11-vs-fitbit-charge-6': {
    title: 'Apple Watch 11 vs Fitbit Charge 6: Which? | ONDA Life',
    description:
      'Premium smartwatch vs budget fitness tracker. HRV, sleep, heart-rate accuracy, battery and price compared, and when the cheaper Fitbit is enough.',
  },
  '/reviews/vs/amazfit-helio-ring-vs-ringconn-gen-2': {
    title: 'Amazfit Helio vs RingConn Gen 2 Rings | ONDA Life',
    description:
      'Two budget smart rings with no subscription. Price, battery life, sizing, sleep and HRV tracking compared, and which one we would buy.',
  },
  // --- neurotech, light, recovery ---
  '/reviews/neurosity-crown': {
    title: 'Neurosity Crown Review 2026: Is It Worth $1,499? | ONDA Life',
    description:
      'An 8-electrode EEG headset with an open SDK and raw data, no subscription. What it does for focus, who it suits, and cheaper EEG alternatives.',
  },
  '/reviews/sens-ai': {
    title: 'Sens.ai Review 2026: Is It Worth $1,250? | ONDA Life',
    description:
      'Sens.ai combines EEG neurofeedback, photobiomodulation and HRV training in one $1,250 headset plus a membership. What the evidence says and who it suits.',
  },
  '/reviews/omnilux-contour-face': {
    title: 'Omnilux Contour Face Review 2026: Worth $395? | ONDA Life',
    description:
      'Flexible red and near-infrared light mask, FDA-cleared for wrinkles, but with no trial of the mask itself. Price, results to expect and cheaper alternatives.',
  },
  '/reviews/kineon-move-plus': {
    title: 'Kineon Move+ Review 2026: Red Light for Joints | ONDA Life',
    description:
      'A $499 wrap-around laser and LED device for knees, elbows and other joints. What the evidence shows, how to use it and how it compares with panels.',
  },
  '/reviews/resona-health-vibe': {
    title: 'Resona Health VIBE Reviews: Worth $299? | ONDA Life',
    description:
      'A wearable PEMF device with 130+ built-in programmes, no app and no mat to set up, for $299. What reviews can and cannot tell you, pros, cons and alternatives.',
  },
  '/reviews/hypervolt-3-pro': {
    title: 'Hypervolt 3 Pro Review: vs Theragun (2026) | ONDA Life',
    description:
      'Hyperice’s 2026 flagship: 70 lbs stall force, quieter motor, 4-hour battery, $349. How it compares with Theragun PRO Plus and the Hypervolt 2 Pro.',
  },
  '/reviews/compare/best-massage-guns-2026': {
    title: 'Best Massage Guns 2026: Ranked and Compared | ONDA Life',
    description:
      'Hypervolt 3 Pro, Theragun PRO Plus, Theragun Elite and budget picks ranked on power, noise, battery and price, with who each massage gun suits.',
  },
  // --- 3-way duels whose generated titles collided with the 2-way pages ---
  "/reviews/vs/joovv-solo-3-vs-mito-red-mitopro-1500-vs-platinumled-biomax-600": {
    title: "Joovv vs Mito Red vs PlatinumLED BioMax | ONDA Life",
  },
  "/reviews/vs/theragun-pro-plus-vs-hypervolt-2-pro-vs-achedaway-pro": {
    title: "Theragun vs Hypervolt vs Achedaway Pro | ONDA Life",
  },
  // --- round 2: GSC ctr_gap 2026-10-07..11-03 (owner 2026-11-05). /<lang>/ keys are applied by the prerender final pass ---
  '/tools/alcohol': {
    title: 'How Long Until Sober? Alcohol & BAC Calculator | ONDA Life',
    description:
      'Free, no sign-up: add your drinks, weight and sex to estimate your blood alcohol and the hours until it\'s back to zero. Educational — never drink and drive.',
  },
  '/articles/apple-watch-recovery-hrv-vs-overall-hrv': {
    title: 'Apple Watch Recovery vs Overall HRV, Explained | ONDA Life',
    description:
      'Since September 2026 Apple Watch shows two HRV numbers. What Recovery HRV and Overall HRV each measure, why they differ and which one to follow.',
  },
  '/glossary/mutual-inhibition': {
    title: 'Mutual Inhibition: Definition in Plain Words | ONDA Life',
    description:
      'Mutual inhibition: two neurons or networks that suppress each other in turn, creating a rhythm like a biological pendulum. Short plain-language definition.',
  },
  '/glossary/emotional-osmosis': {
    title: 'Emotional Osmosis (Emotional Contagion) Meaning | ONDA Life',
  },
  '/connect/amazfit': {
    title: 'Amazfit / Zepp HRV: How to Read Your Numbers | ONDA Life',
  },
  '/reviews/morozko-forge': {
    title: 'Morozko Forge Review: $10K Ice Bath, Worth It? | ONDA Life',
    description:
      'The cold plunge Morozko says can freeze the water surface at 33°F. Wim Hof-affiliated, $10,000+. Who it suits, who it is overkill for, and what to buy instead.',
  },
  '/reviews/renu-therapy-cold-stoic': {
    title: 'Renu Cold Stoic Review: Quiet Indoor Cold Plunge | ONDA Life',
    description:
      'Premium cold-plunge tub with one of the quietest chillers: holds 40°F, 3-year warranty, built for indoor installs. Pros, cons and how it compares.',
  },
  '/reviews/bluecube-cold-plunge': {
    title: 'BlueCube Cold Plunge Review: Commercial-Grade | ONDA Life',
    description:
      'The highest-capacity chiller we reviewed, ozone + UV, 5-year warranty on most parts. Overkill for one person, right for gyms, clinics and busy homes.',
  },
  '/reviews/eight-sleep-pod-6': {
    title: 'Eight Sleep Pod 6 Review: Price & Membership | ONDA Life',
    description:
      'Hub 50% smaller, 18 sensors, Solo sizes from $1,999, queen $2,899 — plus a mandatory Autopilot membership ($199–$399/yr). Is the Pod 6 worth it?',
  },
  '/reviews/air-purifiers': {
    title: 'Best Air Purifiers 2026: 10 Reviewed & Scored | ONDA Life',
  },
  '/reviews/vs/muse-s-athena-vs-neurosity-crown': {
    title: 'Muse S Athena vs Neurosity Crown: Which EEG? | ONDA Life',
  },
  '/reviews/vs/omnilux-contour-face-vs-higherdose-red-light-face-mask': {
    title: 'Omnilux vs HigherDOSE Mask: $395 vs $349 | ONDA Life',
  },
  '/reviews/vs/luna-ring-vs-amazfit-helio-ring': {
    title: 'Luna Ring vs Amazfit Helio: $300 vs $199 | ONDA Life',
    description:
      'Two subscription-free budget smart rings. Helio is cheaper and lighter; Luna Gen 2 has more sizes and a charging case for longer battery. Which to buy.',
  },
  '/reviews/vs/lightstim-for-wrinkles-vs-solawave-wand-4-in-1': {
    title: 'LightStim vs Solawave: $249 vs $169 Compared | ONDA Life',
    description:
      'LED-only LightStim (FDA-cleared since 2009) vs Solawave\'s LED + microcurrent wand. Price, light, evidence and which one fits you.',
  },
  '/nl/articles/normal-hrv-by-age': {
    title: 'Normale HRV per leeftijd: tabel man/vrouw | ONDA Life',
    description:
      'Tabel per leeftijd en geslacht (ca. 8 miljoen Fitbit-gebruikers): zoek je eigen waarde op en lees waarom je HRV vooral met je eigen gemiddelde telt.',
  },
  '/pl/articles/normal-hrv-by-age': {
    title: 'Prawidłowe HRV według wieku: tabela K/M | ONDA Life',
    description:
      'Tabela HRV według wieku i płci (ok. 8 mln użytkowników Fitbit): sprawdź swój wynik i dowiedz się, dlaczego HRV najlepiej porównywać z własną normą.',
  },
  '/it/articles/normal-hrv-by-age': {
    title: 'HRV normale per età: tabella uomini e donne | ONDA Life',
    description:
      'Tabella dell\'HRV per età e sesso (circa 8 milioni di utenti Fitbit): trova il tuo valore e scopri perché conta soprattutto il confronto con la tua media.',
  },
  '/es/articles/normal-hrv-by-age': {
    title: 'HRV normal por edad: tabla hombres y mujeres | ONDA Life',
    description:
      'Tabla de HRV por edad y sexo (unos 8 millones de usuarios de Fitbit): busca tu valor y descubre por qué lo que más cuenta es compararlo con tu propia media.',
  },
  '/ja/articles/normal-hrv-by-age': {
    title: '年齢別の正常なHRV：男女別の表 | ONDA Life',
    description:
      '約800万人のFitbitデータによる年齢・性別ごとのHRV表。自分の値を探し、HRVは他人より「自分のふだんの値」と比べることが大切な理由を解説。',
  },
  '/es/tools/alcohol': {
    title: '¿Cuándo vuelves a 0,0? Calculadora de alcohol | ONDA Life',
    description:
      'Gratis, sin registro: añade bebidas, peso y sexo y mira tu alcoholemia estimada y las horas hasta volver a cero. Orientativa: nunca conduzcas tras beber.',
  },
  '/es/tools/resting-heart-rate': {
    title: '¿Es normal tu pulso en reposo? Test por edad | ONDA Life',
    description:
      'Introduce edad, sexo y pulso y ve al instante tu percentil frente a la tabla CDC de tu edad. Gratis, sin registro, con valores para hombres y mujeres.',
  },
  '/it/tools/resting-heart-rate': {
    title: 'Battito a riposo normale? Test per età e sesso | ONDA Life',
    description:
      'Inserisci età, sesso e battiti a riposo e scopri subito il tuo percentile rispetto alle tabelle CDC per la tua età. Gratis e senza registrazione.',
  },
  '/ja/tools/resting-heart-rate': {
    title: '安静時心拍数は正常？年齢・性別でチェック | ONDA Life',
    description:
      '年齢・性別・安静時心拍数を入れるだけで、同年代の中での位置（パーセンタイル）がすぐわかる無料ツール。登録不要、CDCデータに基づく男女別の表つき。',
  },
  '/es/tools/hrv': {
    title: '¿Tu HRV es normal? Compárala con tu edad | ONDA Life',
    description:
      'Introduce edad, sexo y tu RMSSD de la mañana y mira tu posición frente a unos 8 millones de usuarios de Fitbit de tu edad. Gratis y sin registro.',
  },
  '/nl/tools/hrv': {
    title: 'Is je HRV normaal? Vergelijk met je leeftijd | ONDA Life',
    description:
      'Vul leeftijd, geslacht en je ochtend-RMSSD in en zie meteen waar je staat tussen ca. 8 miljoen Fitbit-gebruikers van jouw leeftijd. Gratis, zonder account.',
  },
  '/ru/tools/caffeine': {
    title: 'До скольки можно пить кофе? Калькулятор | ONDA Life',
    description:
      'Укажите напиток и время отхода ко сну — калькулятор покажет, когда выпить последнюю чашку, чтобы кофеин не мешал сну. Бесплатно, без регистрации.',
  },
  '/de/tools/caffeine': {
    title: 'Bis wann Kaffee trinken? Koffein-Rechner | ONDA Life',
    description:
      'Getränk und Schlafenszeit wählen – der Rechner zeigt, bis wann du Kaffee trinken kannst, damit Koffein deinen Schlaf nicht stört. Kostenlos, ohne Anmeldung.',
  },
  '/ru/articles/world-mental-health-day-2026-lived-experience': {
    title: 'День психического здоровья 2026: тема и смысл | ONDA Life',
    description:
      'Тема Всемирного дня психического здоровья 10 октября 2026 — «Живой опыт услышан». Что она значит простыми словами и как лучше слушать других и себя.',
  },
  '/it/articles/resting-heart-rate-by-age': {
    title: 'Battito a riposo normale per età: tabella | ONDA Life',
    description:
      'Normale negli adulti: 60–100 bpm. Tabella per età con le mediane CDC (circa 67–69 bpm negli uomini, 70–74 nelle donne) e come leggere il tuo valore.',
  },
  '/nl/articles/how-long-does-alcohol-stay-in-your-system': {
    title: 'Hoe lang blijft alcohol in je lichaam? Per glas | ONDA Life',
    description:
      'Je lichaam breekt ongeveer één glas per uur af en niets versnelt dat. Zo schat je wanneer je weer op 0 zit, en wat alcohol met je slaap en herstel doet.',
  },
  '/nl/articles/how-much-alcohol-lowers-hrv': {
    title: 'Hoeveel verlaagt één drankje je HRV? De data | ONDA Life',
    description:
      'Elk extra drankje verlaagt je HRV en verhoogt je hartslag \'s nachts verder. Wat alcohol je herstel kost, glas per glas, volgens wearable-data en studies.',
  },
  '/pl/articles/how-much-alcohol-lowers-hrv': {
    title: 'Ile jeden drink obniża HRV? Dane | ONDA Life',
    description:
      'Każdy kolejny drink bardziej obniża HRV i podnosi nocne tętno. Ile alkohol kosztuje twoją regenerację, drink po drinku — dane z urządzeń i badań.',
  },
  '/fr/articles/how-much-alcohol-lowers-hrv': {
    title: 'Alcool et HRV : combien de baisse par verre ? | ONDA Life',
    description:
      'Chaque verre en plus fait baisser la HRV et monter le pouls nocturne. Ce que l\'alcool coûte à votre récupération, verre par verre, d\'après les données.',
  },
  '/de/articles/eating-late-heart-rate-sleep': {
    title: 'Spät essen: Was passiert mit Puls und Schlaf? | ONDA Life',
    description:
      'Ein schweres spätes Essen kann den Schlaf stören und das Morgen-Cortisol erhöhen; der Effekt auf den Puls ist klein. Was Studien zeigen und wie du es testest.',
  },
  '/pl/articles/nicotine-vaping-hrv-heart-rate': {
    title: 'Nikotyna i e-papieros: tętno i HRV | ONDA Life',
    description:
      'Nikotyna podnosi tętno i ciśnienie i obniża HRV — także z e-papierosa. Dlaczego mimo to wydaje się relaksować i jak rzucić.',
  },
  '/ru/articles/alternate-nostril-breathing': {
    title: 'Попеременное дыхание ноздрями: как делать | ONDA Life',
    description:
      'Нади Шодхана пошагово: как дышать попеременно через ноздри, в каком темпе, почему важен медленный ритм и что говорят исследования о давлении и стрессе.',
  },
  '/ru/science/questions/why-is-my-hrv-low': {
    title: 'Почему у меня низкий HRV и что делать | ONDA Life',
  },
  '/de/articles/cardiac-coherence-365-method': {
    title: 'Herzkohärenz 365: 3× täglich 5 Minuten | ONDA Life',
  },
  '/it/articles/co2-tolerance-expanding-oxygen-limit': {
    title: 'Tolleranza alla CO₂ e test BOLT: come farlo | ONDA Life',
  },
  '/tools/sleep-cycle': {
    title: 'Sleep Cycle Calculator: Best Time to Wake Up | ONDA Life',
    description:
      'Enter when you go to bed or need to wake up and get times that land at the end of a 90-minute sleep cycle, so you wake up less groggy. Free, no sign-up.',
  },
  '/ru/articles/alpha-brain-waves': {
    title: 'Альфа-волны мозга: что это и что они значат | ONDA Life',
  },
  '/uk/articles/alpha-brain-waves': {
    title: 'Альфа-хвилі мозку: що це і що вони означають | ONDA Life',
  },
  '/es/articles/alpha-brain-waves': {
    title: 'Ondas alfa cerebrales: qué son y qué significan | ONDA Life',
  },
  '/pt/articles/alpha-brain-waves': {
    title: 'Ondas alfa cerebrais: o que são e o que indicam | ONDA Life',
  },
  '/fr/articles/alpha-brain-waves': {
    title: 'Ondes alpha cérébrales : définition et rôle | ONDA Life',
  },
  '/de/articles/alpha-brain-waves': {
    title: 'Alphawellen im Gehirn: was sie bedeuten | ONDA Life',
  },
  '/it/articles/alpha-brain-waves': {
    title: 'Onde alfa cerebrali: cosa sono e cosa indicano | ONDA Life',
  },
  '/nl/articles/alpha-brain-waves': {
    title: 'Alfagolven in de hersenen: wat ze betekenen | ONDA Life',
  },
  '/pl/articles/alpha-brain-waves': {
    title: 'Fale alfa w mózgu: czym są i co oznaczają | ONDA Life',
  },
}
