/**
 * "What a headset measures" note (HeadsetMeasuresNote) for EEG / fNIRS /
 * neurofeedback reviews, their round-ups and head-to-heads. Not a safety block:
 * the risk is misreading the numbers. ONE source per language; mirrors
 * content/science/evidence/eeg-neurofeedback.md.
 */
import type { Lang } from '../i18n'

/** Review categories that always get the note. */
export const HEADSET_MEASURES_CATEGORIES: ReadonlySet<string> = new Set(['eeg-headset'])

/** Current reviews in that category (explicit list; category check also covers new ones). */
export const HEADSET_REVIEW_SLUGS: ReadonlySet<string> = new Set([
  'emotiv-insight-2',
  'focuscalm',
  'mendi',
  'muse-2',
  'muse-s-athena',
  'myndlift',
  'neurosity-crown',
  'neurosky-mindwave-mobile-2',
  'sens-ai',
])

/** Round-ups (comparisons) that get the note. */
export const HEADSET_COMPARISON_SLUGS: ReadonlySet<string> = new Set(['best-eeg-headsets-2026'])

/** Review page: by slug or category. */
/** Not recording devices (e.g. tDCS stimulation headsets) — the note would mislead there. */
export const HEADSET_EXCLUDED_SLUGS: ReadonlySet<string> = new Set(['flow-neuroscience'])

export function isHeadsetReview(slug: string, category?: string): boolean {
  if (HEADSET_EXCLUDED_SLUGS.has(slug)) return false
  return HEADSET_REVIEW_SLUGS.has(slug) || (!!category && HEADSET_MEASURES_CATEGORIES.has(category))
}

/** Comparison page: by slug or category. */
export function isHeadsetComparison(slug: string, category?: string): boolean {
  return HEADSET_COMPARISON_SLUGS.has(slug) || (!!category && HEADSET_MEASURES_CATEGORIES.has(category))
}

/** Head-to-heads get the note when ANY product in the duel is a headset review. */
export function hasHeadsetProduct(products: readonly { slug: string; category?: string }[]): boolean {
  return products.some((p) => isHeadsetReview(p.slug, p.category))
}

export interface HeadsetMeasuresCopy {
  title: string
  items: { lead: string; text: string }[]
  link: string
}

export const HEADSET_MEASURES: Record<Lang, HeadsetMeasuresCopy> = {
  en: {
    title: 'What a headset measures',
    items: [
      { lead: 'A few channels, dry electrodes.', text: 'Consumer EEG headsets record electrical brain activity from a few dry electrodes on the scalp. Blinks, jaw tension and movement add noise that can swamp the signal.' },
      { lead: '“Focus”, “calm” and “meditation” scores are the maker’s own formulas,', text: 'not a validated measurement of concentration or relaxation.' },
      { lead: 'fNIRS is a different signal.', text: 'fNIRS devices (such as Mendi) measure blood oxygenation in the forehead, not electrical activity.' },
      { lead: 'Not a diagnosis, not a treatment.', text: 'A recording headset does not diagnose or treat ADHD, depression or epilepsy.' },
    ],
    link: 'What the evidence on EEG and neurofeedback shows →',
  },
  de: {
    title: 'Was ein Headset misst',
    items: [
      { lead: 'Wenige Kanäle, trockene Elektroden.', text: 'Consumer-EEG-Headsets zeichnen die elektrische Hirnaktivität über wenige trockene Elektroden auf der Kopfhaut auf. Blinzeln, Kieferspannung und Bewegung erzeugen Störsignale, die das Signal überdecken können.' },
      { lead: 'Werte für „Fokus“, „Ruhe“ oder „Meditation“ sind eigene Formeln des Herstellers,', text: 'keine validierte Messung von Konzentration oder Entspannung.' },
      { lead: 'fNIRS ist ein anderes Signal.', text: 'fNIRS-Geräte (etwa Mendi) messen die Sauerstoffsättigung des Blutes in der Stirn, nicht die elektrische Aktivität.' },
      { lead: 'Keine Diagnose, keine Behandlung.', text: 'Ein Headset, das nur aufzeichnet, kann ADHS, Depression oder Epilepsie weder diagnostizieren noch behandeln.' },
    ],
    link: 'Was die Studien zu EEG und Neurofeedback zeigen →',
  },
  es: {
    title: 'Qué mide un casco',
    items: [
      { lead: 'Pocos canales, electrodos secos.', text: 'Los cascos de EEG de consumo registran la actividad eléctrica del cerebro con unos pocos electrodos secos sobre el cuero cabelludo. Los parpadeos, la tensión de la mandíbula y el movimiento añaden ruido que puede tapar la señal.' },
      { lead: 'Las puntuaciones de “concentración”, “calma” o “meditación” son fórmulas propias del fabricante,', text: 'no una medición validada de la concentración ni de la relajación.' },
      { lead: 'fNIRS es otra señal.', text: 'Los dispositivos fNIRS (como Mendi) miden la oxigenación de la sangre en la frente, no la actividad eléctrica.' },
      { lead: 'No es un diagnóstico ni un tratamiento.', text: 'Un casco que solo registra no diagnostica ni trata el TDAH, la depresión ni la epilepsia.' },
    ],
    link: 'Qué muestra la evidencia sobre EEG y neurofeedback →',
  },
  fr: {
    title: 'Ce que mesure un casque',
    items: [
      { lead: 'Quelques canaux, des électrodes sèches.', text: 'Les casques EEG grand public enregistrent l’activité électrique du cerveau avec quelques électrodes sèches posées sur le cuir chevelu. Les clignements, la tension de la mâchoire et les mouvements ajoutent du bruit qui peut masquer le signal.' },
      { lead: 'Les scores « concentration », « calme » ou « méditation » sont des formules propres au fabricant,', text: 'pas une mesure validée de la concentration ou de la détente.' },
      { lead: 'La fNIRS est un autre signal.', text: 'Les appareils fNIRS (comme Mendi) mesurent l’oxygénation du sang dans le front, pas l’activité électrique.' },
      { lead: 'Ni diagnostic, ni traitement.', text: 'Un casque qui se contente d’enregistrer ne diagnostique ni ne traite le TDAH, la dépression ou l’épilepsie.' },
    ],
    link: 'Ce que montrent les études sur l’EEG et le neurofeedback →',
  },
  it: {
    title: 'Cosa misura una cuffia',
    items: [
      { lead: 'Pochi canali, elettrodi a secco.', text: 'Le cuffie EEG consumer registrano l’attività elettrica del cervello con pochi elettrodi a secco sul cuoio capelluto. Battiti di ciglia, tensione della mandibola e movimenti aggiungono rumore che può coprire il segnale.' },
      { lead: 'I punteggi di “concentrazione”, “calma” o “meditazione” sono formule proprie del produttore,', text: 'non una misura validata della concentrazione o del rilassamento.' },
      { lead: 'La fNIRS è un segnale diverso.', text: 'I dispositivi fNIRS (come Mendi) misurano l’ossigenazione del sangue nella fronte, non l’attività elettrica.' },
      { lead: 'Non è una diagnosi né una terapia.', text: 'Una cuffia che si limita a registrare non diagnostica né cura ADHD, depressione o epilessia.' },
    ],
    link: 'Cosa mostrano gli studi su EEG e neurofeedback →',
  },
  ja: {
    title: 'ヘッドセットが測っているもの',
    items: [
      { lead: '少数のチャンネルと乾式電極。', text: '一般向けEEGヘッドセットは、頭皮に当てた少数の乾式電極で脳の電気活動を記録します。まばたき、あごの緊張、体の動きはノイズとなり、信号をかき消すことがあります。' },
      { lead: '「集中」「落ち着き」「瞑想」のスコアはメーカー独自の計算式であり、', text: '集中力やリラックスを検証済みの方法で測定したものではありません。' },
      { lead: 'fNIRSは別の信号です。', text: 'fNIRSデバイス（Mendiなど）は電気活動ではなく、額の血液の酸素化を測定します。' },
      { lead: '診断でも治療でもありません。', text: '記録するだけのヘッドセットは、ADHD、うつ病、てんかんを診断・治療するものではありません。' },
    ],
    link: 'EEGとニューロフィードバックの研究でわかっていること →',
  },
  nl: {
    title: 'Wat een headset meet',
    items: [
      { lead: 'Een paar kanalen, droge elektroden.', text: 'Consumenten-EEG-headsets registreren de elektrische hersenactiviteit met een paar droge elektroden op de hoofdhuid. Knipperen, kaakspanning en beweging voegen ruis toe die het signaal kan overstemmen.' },
      { lead: 'Scores voor “focus”, “rust” of “meditatie” zijn eigen formules van de fabrikant,', text: 'geen gevalideerde meting van concentratie of ontspanning.' },
      { lead: 'fNIRS is een ander signaal.', text: 'fNIRS-apparaten (zoals Mendi) meten de zuurstofverzadiging van het bloed in het voorhoofd, niet de elektrische activiteit.' },
      { lead: 'Geen diagnose, geen behandeling.', text: 'Een headset die alleen registreert, stelt geen diagnose van ADHD, depressie of epilepsie en behandelt die ook niet.' },
    ],
    link: 'Wat het onderzoek naar EEG en neurofeedback laat zien →',
  },
  pl: {
    title: 'Co mierzy opaska',
    items: [
      { lead: 'Kilka kanałów, suche elektrody.', text: 'Konsumenckie opaski EEG rejestrują elektryczną aktywność mózgu za pomocą kilku suchych elektrod na skórze głowy. Mruganie, napięcie żuchwy i ruch dodają zakłóceń, które mogą zagłuszyć sygnał.' },
      { lead: 'Wyniki „skupienia”, „spokoju” czy „medytacji” to własne wzory producenta,', text: 'a nie zwalidowany pomiar koncentracji ani relaksu.' },
      { lead: 'fNIRS to inny sygnał.', text: 'Urządzenia fNIRS (np. Mendi) mierzą utlenowanie krwi w czole, a nie aktywność elektryczną.' },
      { lead: 'To nie diagnoza ani leczenie.', text: 'Opaska, która tylko rejestruje sygnał, nie diagnozuje ani nie leczy ADHD, depresji czy padaczki.' },
    ],
    link: 'Co pokazują badania nad EEG i neurofeedbackiem →',
  },
  pt: {
    title: 'O que um headset mede',
    items: [
      { lead: 'Poucos canais, eletrodos secos.', text: 'Os headsets de EEG de consumo registram a atividade elétrica do cérebro com alguns eletrodos secos no couro cabeludo. Piscadas, tensão na mandíbula e movimento adicionam ruído que pode encobrir o sinal.' },
      { lead: 'As pontuações de “foco”, “calma” ou “meditação” são fórmulas próprias do fabricante,', text: 'não uma medida validada de concentração ou relaxamento.' },
      { lead: 'fNIRS é outro sinal.', text: 'Os dispositivos fNIRS (como o Mendi) medem a oxigenação do sangue na testa, não a atividade elétrica.' },
      { lead: 'Não é diagnóstico nem tratamento.', text: 'Um headset que apenas registra não diagnostica nem trata TDAH, depressão ou epilepsia.' },
    ],
    link: 'O que as evidências sobre EEG e neurofeedback mostram →',
  },
  ru: {
    title: 'Что измеряет гарнитура',
    items: [
      { lead: 'Несколько каналов, сухие электроды.', text: 'Потребительские EEG-гарнитуры записывают электрическую активность мозга через несколько сухих электродов на коже головы. Моргание, напряжение челюсти и движения добавляют помехи, которые могут заглушить сигнал.' },
      { lead: 'Баллы «фокуса», «спокойствия» или «медитации» — собственные формулы производителя,', text: 'а не валидированное измерение концентрации или расслабления.' },
      { lead: 'fNIRS — другой сигнал.', text: 'Устройства fNIRS (например, Mendi) измеряют насыщение крови кислородом в области лба, а не электрическую активность.' },
      { lead: 'Это не диагноз и не лечение.', text: 'Гарнитура, которая только записывает сигнал, не диагностирует и не лечит СДВГ, депрессию или эпилепсию.' },
    ],
    link: 'Что показывают исследования EEG и нейрофидбека →',
  },
  uk: {
    title: 'Що вимірює гарнітура',
    items: [
      { lead: 'Кілька каналів, сухі електроди.', text: 'Споживчі EEG-гарнітури записують електричну активність мозку через кілька сухих електродів на шкірі голови. Кліпання, напруження щелепи та рухи додають завади, які можуть заглушити сигнал.' },
      { lead: 'Бали «фокусу», «спокою» чи «медитації» — власні формули виробника,', text: 'а не валідоване вимірювання концентрації чи розслаблення.' },
      { lead: 'fNIRS — інший сигнал.', text: 'Пристрої fNIRS (наприклад, Mendi) вимірюють насичення крові киснем у ділянці чола, а не електричну активність.' },
      { lead: 'Це не діагноз і не лікування.', text: 'Гарнітура, яка лише записує сигнал, не діагностує й не лікує СДУГ, депресію чи епілепсію.' },
    ],
    link: 'Що показують дослідження EEG і нейрофідбеку →',
  },
  zh: {
    title: '头戴设备测量的是什么',
    items: [
      { lead: '通道很少，使用干电极。', text: '消费级EEG头戴设备通过头皮上的少数几个干电极记录大脑的电活动。眨眼、下颌紧绷和身体移动都会带来噪声，可能淹没信号。' },
      { lead: '“专注”“平静”“冥想”评分是厂商自己的算法，', text: '并不是经过验证的注意力或放松程度测量。' },
      { lead: 'fNIRS是另一种信号。', text: 'fNIRS设备（例如Mendi）测量的是前额血液的氧合程度，而不是电活动。' },
      { lead: '不是诊断，也不是治疗。', text: '仅用于记录的头戴设备不能诊断或治疗ADHD、抑郁症或癫痫。' },
    ],
    link: 'EEG与神经反馈的研究证据显示了什么 →',
  },
}
