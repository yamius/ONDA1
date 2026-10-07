/**
 * "Safety first" block for fast breathing / hyperventilation + breath-hold
 * methods (FastBreathingSafetyBlock). ONE source per language; mirrors the
 * Safety section of content/science/evidence/fast-breathing.md.
 * Rendered only on the slug lists below (NOT the whole breathwork-app
 * category — it also holds calm slow-breathing apps).
 */
import type { Lang } from '../i18n'

/** Reviews of products built around fast-breathing / breath-hold rounds. */
export const FAST_BREATHING_REVIEW_SLUGS: ReadonlySet<string> = new Set([
  'wim-hof-method-app',
  'soma-breath',
  'othership',
  'breathwrk',
])

/** Round-ups (comparisons) that get the block. */
export const FAST_BREATHING_COMPARISON_SLUGS: ReadonlySet<string> = new Set([
  'best-breathwork-apps-2026',
])

/** Articles that teach or discuss fast breathing / breath-holds. */
export const FAST_BREATHING_ARTICLE_SLUGS: ReadonlySet<string> = new Set([
  'wim-hof-breathing-inflammation',
  'bhastrika-pranayama-brain-anxiety',
  'fast-vs-slow-pranayama',
  'sudarshan-kriya-yoga-breathing',
  'breathing-altitude-acclimatization',
  'co2-tolerance-expanding-oxygen-limit',
])

/** Head-to-heads get the block when ANY product in the duel is in the review set. */
export function hasFastBreathingProduct(productSlugs: readonly string[]): boolean {
  return productSlugs.some((s) => FAST_BREATHING_REVIEW_SLUGS.has(s))
}

export interface FastBreathingSafetyCopy {
  title: string
  /** Each item: bold lead + rest of the sentence. */
  items: { lead: string; text: string }[]
  note: string
  link: string
}

export const FAST_BREATHING_SAFETY: Record<Lang, FastBreathingSafetyCopy> = {
  en: {
    title: 'Safety first: fast breathing and breath-holds',
    items: [
      { lead: 'Never in or near water.', text: 'Not in a pool, the sea, a bath or a cold plunge. Hyperventilating before a breath-hold delays the urge to breathe, and people have died after blacking out underwater without warning.' },
      { lead: 'Never while driving, cycling or standing — or anywhere fainting would be dangerous.', text: 'Sit or lie down on a safe surface; you may feel dizzy or faint.' },
      { lead: 'Talk to a doctor first', text: 'if you have epilepsy (over-breathing can trigger seizures), heart disease or an arrhythmia, high blood pressure, a history of fainting, panic attacks or a psychiatric condition, or if you are pregnant.' },
      { lead: 'Tingling, dizziness or cramps', text: 'mean carbon dioxide has dropped too far. Stop and breathe slowly and normally until they pass.' },
      { lead: 'If you faint, lie down and get help.', text: 'Seek medical help for fainting, chest pain, palpitations with dizziness, or symptoms that do not settle within minutes.' },
    ],
    note: 'Studies of these methods are small; they do not show that fast breathing treats any disease.',
    link: 'What the evidence shows — and the risks →',
  },
  de: {
    title: 'Sicherheit zuerst: schnelles Atmen und Atemanhalten',
    items: [
      { lead: 'Niemals im oder am Wasser.', text: 'Nicht im Schwimmbad, im Meer, in der Badewanne oder im Eisbad. Hyperventilation vor dem Atemanhalten unterdrückt den Atemreiz – Menschen sind gestorben, weil sie unter Wasser ohne Vorwarnung bewusstlos wurden.' },
      { lead: 'Niemals beim Autofahren, Radfahren oder im Stehen – und nirgends, wo eine Ohnmacht gefährlich wäre.', text: 'Setzen oder legen Sie sich auf eine sichere Unterlage; Schwindel oder Ohnmacht sind möglich.' },
      { lead: 'Sprechen Sie vorher mit einer Ärztin oder einem Arzt,', text: 'wenn Sie Epilepsie haben (Hyperventilation kann Anfälle auslösen), eine Herzerkrankung oder Herzrhythmusstörung, Bluthochdruck, frühere Ohnmachtsanfälle, Panikattacken oder eine psychische Erkrankung – oder wenn Sie schwanger sind.' },
      { lead: 'Kribbeln, Schwindel oder Krämpfe', text: 'bedeuten, dass der Kohlendioxidspiegel zu stark gesunken ist. Hören Sie auf und atmen Sie ruhig und normal, bis es vorbei ist.' },
      { lead: 'Bei einer Ohnmacht: hinlegen und Hilfe holen.', text: 'Suchen Sie ärztliche Hilfe bei Ohnmacht, Brustschmerzen, Herzrasen mit Schwindel oder Beschwerden, die nicht innerhalb weniger Minuten abklingen.' },
    ],
    note: 'Die Studien zu diesen Methoden sind klein; sie zeigen nicht, dass schnelles Atmen eine Krankheit behandelt.',
    link: 'Was die Studien zeigen – und welche Risiken es gibt →',
  },
  es: {
    title: 'Primero, la seguridad: respiración rápida y retenciones',
    items: [
      { lead: 'Nunca en el agua ni cerca de ella.', text: 'Ni en la piscina, ni en el mar, ni en la bañera, ni en un baño de hielo. Hiperventilar antes de retener la respiración retrasa las ganas de respirar, y ha habido personas que han muerto al perder el conocimiento bajo el agua sin previo aviso.' },
      { lead: 'Nunca mientras conduces, vas en bicicleta o estás de pie, ni en ningún sitio donde desmayarte sea peligroso.', text: 'Siéntate o túmbate sobre una superficie segura; puedes marearte o desmayarte.' },
      { lead: 'Consulta antes a un médico', text: 'si tienes epilepsia (la hiperventilación puede desencadenar crisis), una enfermedad cardíaca o una arritmia, hipertensión, antecedentes de desmayos, ataques de pánico o un trastorno psiquiátrico, o si estás embarazada.' },
      { lead: 'El hormigueo, el mareo o los calambres', text: 'indican que el dióxido de carbono ha bajado demasiado. Para y respira despacio y con normalidad hasta que pasen.' },
      { lead: 'Si te desmayas, túmbate y pide ayuda.', text: 'Busca atención médica ante un desmayo, dolor en el pecho, palpitaciones con mareo o síntomas que no remitan en pocos minutos.' },
    ],
    note: 'Los estudios sobre estos métodos son pequeños; no demuestran que la respiración rápida trate ninguna enfermedad.',
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  fr: {
    title: 'La sécurité d’abord : respiration rapide et apnées',
    items: [
      { lead: 'Jamais dans l’eau ni à proximité.', text: 'Ni à la piscine, ni en mer, ni dans le bain, ni dans un bain froid. L’hyperventilation avant une apnée retarde le besoin de respirer, et des personnes sont mortes après avoir perdu connaissance sous l’eau sans aucun signe avant-coureur.' },
      { lead: 'Jamais en conduisant, à vélo ou debout — ni nulle part où un malaise serait dangereux.', text: 'Asseyez-vous ou allongez-vous sur une surface sûre : vertiges et évanouissement sont possibles.' },
      { lead: 'Parlez-en d’abord à un médecin', text: 'si vous avez une épilepsie (l’hyperventilation peut déclencher des crises), une maladie cardiaque ou un trouble du rythme, de l’hypertension, des antécédents de malaises, des attaques de panique ou un trouble psychiatrique, ou si vous êtes enceinte.' },
      { lead: 'Fourmillements, vertiges ou crampes', text: 'signifient que le taux de dioxyde de carbone a trop baissé. Arrêtez-vous et respirez lentement et normalement jusqu’à ce qu’ils disparaissent.' },
      { lead: 'En cas d’évanouissement, allongez-vous et demandez de l’aide.', text: 'Consultez un médecin en cas de perte de connaissance, de douleur thoracique, de palpitations avec vertiges ou de symptômes qui ne cèdent pas en quelques minutes.' },
    ],
    note: 'Les études sur ces méthodes sont de petite taille ; elles ne montrent pas que la respiration rapide soigne une maladie.',
    link: 'Ce que montrent les études — et les risques →',
  },
  it: {
    title: 'Prima di tutto la sicurezza: respirazione rapida e apnee',
    items: [
      { lead: 'Mai in acqua o vicino all’acqua.', text: 'Né in piscina, né al mare, né nella vasca da bagno, né in un bagno di ghiaccio. Iperventilare prima di un’apnea ritarda lo stimolo a respirare, e ci sono persone morte dopo aver perso conoscenza sott’acqua senza alcun preavviso.' },
      { lead: 'Mai mentre guidi, vai in bicicletta o stai in piedi, né dove uno svenimento sarebbe pericoloso.', text: 'Siediti o sdraiati su una superficie sicura: potresti avere capogiri o svenire.' },
      { lead: 'Parlane prima con un medico', text: 'se soffri di epilessia (l’iperventilazione può scatenare crisi), di una malattia cardiaca o di un’aritmia, di ipertensione, se hai avuto svenimenti, attacchi di panico o un disturbo psichiatrico, oppure se sei in gravidanza.' },
      { lead: 'Formicolio, capogiri o crampi', text: 'indicano che l’anidride carbonica è scesa troppo. Fermati e respira lentamente e normalmente finché non passano.' },
      { lead: 'Se svieni, sdraiati e chiedi aiuto.', text: 'Rivolgiti a un medico in caso di svenimento, dolore al petto, palpitazioni con capogiri o sintomi che non si attenuano entro pochi minuti.' },
    ],
    note: 'Gli studi su questi metodi sono piccoli; non dimostrano che la respirazione rapida curi alcuna malattia.',
    link: 'Cosa mostrano gli studi — e quali sono i rischi →',
  },
  ja: {
    title: '安全第一：速い呼吸と息止め',
    items: [
      { lead: '水中や水辺では絶対に行わないでください。', text: 'プール、海、浴槽、冷水浴も同様です。息止めの前に過呼吸をすると「息をしたい」という感覚が遅れ、水中で前触れなく意識を失って亡くなった人もいます。' },
      { lead: '運転中、自転車に乗っているとき、立った姿勢では行わないでください。失神すると危険な場所でも同様です。', text: '安全な場所で座るか横になってください。めまいや失神が起こることがあります。' },
      { lead: '事前に医師に相談してください：', text: 'てんかん（過呼吸は発作を誘発することがあります）、心臓病や不整脈、高血圧、失神の既往、パニック発作や精神疾患がある場合、または妊娠中の場合。' },
      { lead: 'しびれ、めまい、筋肉のけいれんは', text: '二酸化炭素が下がりすぎたサインです。すぐにやめ、治まるまでゆっくり普通に呼吸してください。' },
      { lead: '失神したら横になり、助けを求めてください。', text: '失神、胸の痛み、めまいを伴う動悸、数分たっても治まらない症状があれば医療機関を受診してください。' },
    ],
    note: 'これらの方法に関する研究は小規模で、速い呼吸が何らかの病気を治療するとは示されていません。',
    link: '研究でわかっていること、そしてリスク →',
  },
  nl: {
    title: 'Veiligheid voorop: snel ademen en adem inhouden',
    items: [
      { lead: 'Nooit in of bij het water.', text: 'Niet in het zwembad, de zee, het bad of een ijsbad. Hyperventileren vóór het inhouden van de adem stelt de ademprikkel uit, en er zijn mensen overleden die zonder waarschuwing onder water het bewustzijn verloren.' },
      { lead: 'Nooit tijdens het autorijden, fietsen of staand — en nergens waar flauwvallen gevaarlijk is.', text: 'Ga zitten of liggen op een veilige ondergrond; je kunt duizelig worden of flauwvallen.' },
      { lead: 'Overleg eerst met een arts', text: 'als je epilepsie hebt (hyperventilatie kan aanvallen uitlokken), een hartaandoening of hartritmestoornis, hoge bloeddruk, eerder bent flauwgevallen, paniekaanvallen of een psychische aandoening hebt, of als je zwanger bent.' },
      { lead: 'Tintelingen, duizeligheid of krampen', text: 'betekenen dat het koolstofdioxidegehalte te ver is gedaald. Stop en adem rustig en normaal tot ze over zijn.' },
      { lead: 'Val je flauw: ga liggen en haal hulp.', text: 'Zoek medische hulp bij flauwvallen, pijn op de borst, hartkloppingen met duizeligheid of klachten die niet binnen enkele minuten wegtrekken.' },
    ],
    note: 'Onderzoek naar deze methoden is kleinschalig; het laat niet zien dat snel ademen een ziekte behandelt.',
    link: 'Wat het onderzoek laat zien — en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo: szybkie oddychanie i wstrzymywanie oddechu',
    items: [
      { lead: 'Nigdy w wodzie ani w jej pobliżu.', text: 'Ani na basenie, ani w morzu, ani w wannie, ani w zimnej kąpieli. Hiperwentylacja przed wstrzymaniem oddechu opóźnia potrzebę zaczerpnięcia powietrza – zdarzały się zgony osób, które bez ostrzeżenia straciły przytomność pod wodą.' },
      { lead: 'Nigdy podczas jazdy samochodem, na rowerze ani na stojąco – ani tam, gdzie omdlenie byłoby niebezpieczne.', text: 'Usiądź lub połóż się na bezpiecznym podłożu; mogą pojawić się zawroty głowy lub omdlenie.' },
      { lead: 'Najpierw porozmawiaj z lekarzem,', text: 'jeśli masz padaczkę (hiperwentylacja może wywołać napad), chorobę serca lub zaburzenia rytmu, nadciśnienie, omdlenia w przeszłości, napady paniki lub zaburzenie psychiczne albo jeśli jesteś w ciąży.' },
      { lead: 'Mrowienie, zawroty głowy lub skurcze mięśni', text: 'oznaczają, że poziom dwutlenku węgla spadł za bardzo. Przerwij i oddychaj spokojnie i normalnie, aż ustąpią.' },
      { lead: 'Jeśli zemdlejesz, połóż się i wezwij pomoc.', text: 'Zgłoś się po pomoc medyczną w razie omdlenia, bólu w klatce piersiowej, kołatania serca z zawrotami głowy lub objawów, które nie mijają w ciągu kilku minut.' },
    ],
    note: 'Badania tych metod są niewielkie; nie wykazują, że szybkie oddychanie leczy jakąkolwiek chorobę.',
    link: 'Co pokazują badania – i jakie są zagrożenia →',
  },
  pt: {
    title: 'Segurança em primeiro lugar: respiração rápida e apneias',
    items: [
      { lead: 'Nunca dentro ou perto da água.', text: 'Nem na piscina, nem no mar, nem na banheira, nem num banho de gelo. Hiperventilar antes de prender a respiração atrasa a vontade de respirar, e há pessoas que morreram após desmaiar debaixo de água sem qualquer aviso.' },
      { lead: 'Nunca ao conduzir, a andar de bicicleta ou em pé — nem em lugar algum onde um desmaio seja perigoso.', text: 'Sente-se ou deite-se numa superfície segura; pode sentir tonturas ou desmaiar.' },
      { lead: 'Fale primeiro com um médico', text: 'se tiver epilepsia (a hiperventilação pode desencadear crises), doença cardíaca ou arritmia, hipertensão, antecedentes de desmaios, ataques de pânico ou uma doença psiquiátrica, ou se estiver grávida.' },
      { lead: 'Formigueiro, tonturas ou cãibras', text: 'indicam que o dióxido de carbono desceu demasiado. Pare e respire devagar e normalmente até passarem.' },
      { lead: 'Se desmaiar, deite-se e peça ajuda.', text: 'Procure ajuda médica em caso de desmaio, dor no peito, palpitações com tonturas ou sintomas que não passem em poucos minutos.' },
    ],
    note: 'Os estudos sobre estes métodos são pequenos; não mostram que a respiração rápida trate qualquer doença.',
    link: 'O que mostram as evidências — e os riscos →',
  },
  ru: {
    title: 'Сначала безопасность: быстрое дыхание и задержки дыхания',
    items: [
      { lead: 'Никогда в воде или рядом с ней.', text: 'Ни в бассейне, ни в море, ни в ванне, ни в ледяной купели. Гипервентиляция перед задержкой дыхания отодвигает позыв вдохнуть, и люди погибали, потеряв сознание под водой без всякого предупреждения.' },
      { lead: 'Никогда за рулём, на велосипеде или стоя — и вообще там, где обморок опасен.', text: 'Сядьте или лягте на безопасную поверхность: возможны головокружение и обморок.' },
      { lead: 'Сначала посоветуйтесь с врачом,', text: 'если у вас эпилепсия (гипервентиляция может спровоцировать приступ), болезнь сердца или аритмия, повышенное давление, обмороки в прошлом, панические атаки или психическое расстройство, а также при беременности.' },
      { lead: 'Покалывание, головокружение или судороги', text: 'означают, что углекислый газ упал слишком сильно. Остановитесь и дышите медленно и спокойно, пока это не пройдёт.' },
      { lead: 'При обмороке — лягте и позовите на помощь.', text: 'Обратитесь за медицинской помощью при обмороке, боли в груди, сердцебиении с головокружением или симптомах, которые не проходят за несколько минут.' },
    ],
    note: 'Исследования этих методов небольшие; они не показывают, что быстрое дыхание лечит какие-либо болезни.',
    link: 'Что показывают исследования — и какие есть риски →',
  },
  uk: {
    title: 'Спершу безпека: швидке дихання і затримки дихання',
    items: [
      { lead: 'Ніколи у воді чи біля неї.', text: 'Ні в басейні, ні в морі, ні у ванні, ні в крижаній купелі. Гіпервентиляція перед затримкою дихання відсуває потребу вдихнути, і люди гинули, знепритомнівши під водою без жодного попередження.' },
      { lead: 'Ніколи за кермом, на велосипеді чи стоячи — і взагалі там, де непритомність небезпечна.', text: 'Сядьте або ляжте на безпечну поверхню: можливі запаморочення й непритомність.' },
      { lead: 'Спершу порадьтеся з лікарем,', text: 'якщо маєте епілепсію (гіпервентиляція може спровокувати напад), хворобу серця чи аритмію, підвищений тиск, непритомність у минулому, панічні атаки чи психічний розлад, а також під час вагітності.' },
      { lead: 'Поколювання, запаморочення чи судоми', text: 'означають, що вуглекислий газ знизився надто сильно. Зупиніться й дихайте повільно та спокійно, доки це не мине.' },
      { lead: 'Якщо знепритомніли — ляжте й покличте на допомогу.', text: 'Зверніться по медичну допомогу в разі непритомності, болю в грудях, сильного серцебиття із запамороченням або симптомів, що не минають за кілька хвилин.' },
    ],
    note: 'Дослідження цих методів невеликі; вони не показують, що швидке дихання лікує будь-які хвороби.',
    link: 'Що показують дослідження — і які є ризики →',
  },
  zh: {
    title: '安全第一：快速呼吸与屏气',
    items: [
      { lead: '切勿在水中或水边练习。', text: '包括泳池、海里、浴缸和冷水浴。屏气前过度换气会推迟想呼吸的感觉，已有人在水下毫无预兆地昏厥而死亡。' },
      { lead: '切勿在开车、骑车或站立时练习，也不要在任何一旦昏倒就有危险的地方练习。', text: '请在安全的地方坐下或躺下；可能会头晕甚至昏厥。' },
      { lead: '请先咨询医生：', text: '如果您患有癫痫（过度换气可能诱发发作）、心脏病或心律失常、高血压，有晕厥史、惊恐发作或精神疾病，或正在怀孕。' },
      { lead: '出现麻刺感、头晕或抽筋，', text: '说明二氧化碳降得太低。请立即停止，缓慢、正常地呼吸，直到症状消失。' },
      { lead: '如果昏倒，请躺下并寻求帮助。', text: '出现昏厥、胸痛、心悸伴头晕，或症状几分钟内不缓解时，请就医。' },
    ],
    note: '关于这些方法的研究规模都很小，并未证明快速呼吸能治疗任何疾病。',
    link: '研究证据显示了什么——以及有哪些风险 →',
  },
}
