/**
 * "Safety first" block for saunas (traditional, infrared cabins, blankets)
 * and heat protocols (SaunaSafetyBlock). ONE source per language; mirrors the
 * safety notes of content/science/evidence/sauna-heat-exposure.md.
 * Main point: no alcohol (the main factor in sauna deaths).
 */
import type { Lang } from '../i18n'

/** Review categories that always get the block (cabins, blankets, Finnish). */
export const SAUNA_SAFETY_CATEGORIES: ReadonlySet<string> = new Set(['sauna'])

/** Current reviews in that category (explicit list; category check also covers new ones). */
export const SAUNA_REVIEW_SLUGS: ReadonlySet<string> = new Set([
  'almost-heaven-salem',
  'clearlight-sanctuary-2',
  'finnleo-hallmark',
  'higherdose-blanket-v4',
  'jnh-lifestyles-joyous',
  'relax-sauna-portable',
  'saunaspace-faraday',
  'sun-home-equinox',
  'sunlighten-mpulse',
  'therasage-thera-sauna-personal',
])

/** Round-ups (comparisons) that get the block. */
export const SAUNA_COMPARISON_SLUGS: ReadonlySet<string> = new Set(['best-infrared-sauna-2026'])

/** Articles that give sauna / heat protocols. */
export const SAUNA_ARTICLE_SLUGS: ReadonlySet<string> = new Set([
  'mitochondrial-biogenesis-cellular-power-grid',
  'longevity-hardware-cellular-cleanup',
  'adaptation-hack-range-fractionation',
  'ancestral-sync-circadian-anchors',
])

/** Review page: by slug or category. */
export function isSaunaReview(slug: string, category?: string): boolean {
  return SAUNA_REVIEW_SLUGS.has(slug) || (!!category && SAUNA_SAFETY_CATEGORIES.has(category))
}

/** Comparison page: by slug or category. */
export function isSaunaComparison(slug: string, category?: string): boolean {
  return SAUNA_COMPARISON_SLUGS.has(slug) || (!!category && SAUNA_SAFETY_CATEGORIES.has(category))
}

/** Head-to-heads get the block when ANY product in the duel is a sauna review. */
export function hasSaunaProduct(products: readonly { slug: string; category?: string }[]): boolean {
  return products.some((p) => isSaunaReview(p.slug, p.category))
}

export interface SaunaSafetyCopy {
  title: string
  /** Each item: bold lead + rest of the sentence. */
  items: { lead: string; text: string }[]
  note: string
  link: string
}

export const SAUNA_SAFETY: Record<Lang, SaunaSafetyCopy> = {
  en: {
    title: 'Safety first: sauna and heat',
    items: [
      { lead: 'No alcohol before or during a sauna.', text: 'Alcohol is the main factor in sauna deaths: it lowers blood pressure and dulls the warning signs of overheating.' },
      { lead: 'Drink water before and after.', text: 'You lose fluid fast in the heat, and dehydration adds to dizziness. Keep sessions short at first.' },
      { lead: 'Get up slowly.', text: 'Blood pressure drops in the heat, so fainting is most likely when you stand up and leave. Take care on steps and wet floors.' },
      { lead: 'Talk to a doctor first', text: 'if you have heart disease (a recent heart attack, unstable angina, severe aortic stenosis), uncontrolled blood pressure, take medicines that affect blood pressure, or are pregnant (avoid overheating, especially in early pregnancy).' },
      { lead: 'No sauna with a fever or acute illness.', text: 'Children only under supervision, with shorter and milder sessions.' },
      { lead: 'Leave if you feel dizzy or unwell.', text: 'Seek help for chest pain, palpitations, fainting or confusion.' },
    ],
    note: 'Alternating with cold water or an ice bath adds the cold shock response, which has its own risks. Results from Finnish saunas do not automatically apply to infrared cabins or blankets.',
    link: 'What the evidence shows — and the risks →',
  },
  de: {
    title: 'Sicherheit zuerst: Sauna und Hitze',
    items: [
      { lead: 'Kein Alkohol vor oder während der Sauna.', text: 'Alkohol ist der wichtigste Faktor bei Todesfällen in der Sauna: Er senkt den Blutdruck und dämpft die Warnzeichen der Überhitzung.' },
      { lead: 'Trink vorher und nachher Wasser.', text: 'In der Hitze verlierst du schnell Flüssigkeit, und Flüssigkeitsmangel verstärkt Schwindel. Halte die Sitzungen anfangs kurz.' },
      { lead: 'Steh langsam auf.', text: 'In der Hitze sinkt der Blutdruck, daher kommt es am ehesten beim Aufstehen und Hinausgehen zu einer Ohnmacht. Vorsicht auf Stufen und nassen Böden.' },
      { lead: 'Sprich vorher mit einer Ärztin oder einem Arzt,', text: 'wenn du eine Herzerkrankung hast (kürzlicher Herzinfarkt, instabile Angina pectoris, schwere Aortenklappenstenose), einen nicht eingestellten Blutdruck hast, blutdruckwirksame Medikamente nimmst oder schwanger bist (Überhitzung vermeiden, besonders in der Frühschwangerschaft).' },
      { lead: 'Keine Sauna bei Fieber oder akuter Erkrankung.', text: 'Kinder nur unter Aufsicht, mit kürzeren und milderen Sitzungen.' },
      { lead: 'Geh hinaus, wenn dir schwindlig wird oder du dich unwohl fühlst.', text: 'Hol Hilfe bei Brustschmerzen, Herzrasen, Ohnmacht oder Verwirrtheit.' },
    ],
    note: 'Der Wechsel mit kaltem Wasser oder einem Eisbad bringt zusätzlich die Kälteschockreaktion mit eigenen Risiken. Ergebnisse aus finnischen Saunen lassen sich nicht automatisch auf Infrarotkabinen oder -decken übertragen.',
    link: 'Was die Studien zeigen – und welche Risiken es gibt →',
  },
  es: {
    title: 'Primero, la seguridad: sauna y calor',
    items: [
      { lead: 'Nada de alcohol antes ni durante la sauna.', text: 'El alcohol es el principal factor en las muertes en la sauna: baja la presión arterial y enmascara las señales de alarma del sobrecalentamiento.' },
      { lead: 'Bebe agua antes y después.', text: 'Con el calor se pierde líquido rápidamente, y la deshidratación aumenta el mareo. Al principio, haz sesiones cortas.' },
      { lead: 'Levántate despacio.', text: 'La presión arterial baja con el calor, así que el desmayo es más probable al ponerte de pie y salir. Ten cuidado con los escalones y el suelo mojado.' },
      { lead: 'Consulta antes a un médico', text: 'si tienes una enfermedad cardíaca (un infarto reciente, angina inestable, estenosis aórtica grave), presión arterial no controlada, tomas medicamentos que afectan la presión arterial o estás embarazada (evita el sobrecalentamiento, sobre todo al inicio del embarazo).' },
      { lead: 'No uses la sauna con fiebre o una enfermedad aguda.', text: 'Los niños, solo bajo supervisión y con sesiones más cortas y suaves.' },
      { lead: 'Sal si te mareas o te encuentras mal.', text: 'Pide ayuda ante dolor en el pecho, palpitaciones, desmayo o confusión.' },
    ],
    note: 'Alternar con agua fría o un baño de hielo añade la respuesta de choque por frío, que tiene sus propios riesgos. Los resultados de las saunas finlandesas no se aplican automáticamente a las cabinas o mantas de infrarrojos.',
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  fr: {
    title: 'La sécurité d’abord : sauna et chaleur',
    items: [
      { lead: 'Pas d’alcool avant ni pendant le sauna.', text: 'L’alcool est le principal facteur des décès au sauna : il fait baisser la tension artérielle et masque les signaux d’alerte de la surchauffe.' },
      { lead: 'Buvez de l’eau avant et après.', text: 'On perd vite du liquide à la chaleur, et la déshydratation aggrave les vertiges. Commencez par des séances courtes.' },
      { lead: 'Levez-vous lentement.', text: 'La tension baisse à la chaleur : le malaise survient surtout au moment de se lever et de sortir. Attention aux marches et aux sols mouillés.' },
      { lead: 'Parlez-en d’abord à un médecin', text: 'si vous avez une maladie cardiaque (infarctus récent, angor instable, rétrécissement aortique sévère), une hypertension non contrôlée, prenez des médicaments qui agissent sur la tension artérielle ou êtes enceinte (évitez la surchauffe, surtout en début de grossesse).' },
      { lead: 'Pas de sauna en cas de fièvre ou de maladie aiguë.', text: 'Les enfants uniquement sous surveillance, avec des séances plus courtes et plus douces.' },
      { lead: 'Sortez si vous avez des vertiges ou vous sentez mal.', text: 'Demandez de l’aide en cas de douleur thoracique, de palpitations, de malaise ou de confusion.' },
    ],
    note: 'Alterner avec de l’eau froide ou un bain glacé ajoute la réponse de choc au froid, qui comporte ses propres risques. Les résultats obtenus dans les saunas finlandais ne s’appliquent pas automatiquement aux cabines ou couvertures infrarouges.',
    link: 'Ce que montrent les études — et les risques →',
  },
  it: {
    title: 'Prima di tutto la sicurezza: sauna e calore',
    items: [
      { lead: 'Niente alcol prima o durante la sauna.', text: 'L’alcol è il principale fattore nei decessi in sauna: abbassa la pressione e attenua i segnali d’allarme del surriscaldamento.' },
      { lead: 'Bevi acqua prima e dopo.', text: 'Con il calore si perdono liquidi rapidamente, e la disidratazione aumenta le vertigini. All’inizio fai sedute brevi.' },
      { lead: 'Alzati lentamente.', text: 'Con il calore la pressione scende, quindi lo svenimento è più probabile quando ti alzi ed esci. Fai attenzione a gradini e pavimenti bagnati.' },
      { lead: 'Parlane prima con un medico', text: 'se hai una malattia cardiaca (infarto recente, angina instabile, stenosi aortica grave), pressione non controllata, assumi farmaci che agiscono sulla pressione o sei in gravidanza (evita il surriscaldamento, soprattutto all’inizio della gravidanza).' },
      { lead: 'Niente sauna con febbre o malattia acuta.', text: 'I bambini solo sotto supervisione, con sedute più brevi e più miti.' },
      { lead: 'Esci se hai le vertigini o non ti senti bene.', text: 'Chiedi aiuto in caso di dolore al petto, palpitazioni, svenimento o confusione.' },
    ],
    note: 'Alternare con acqua fredda o un bagno nel ghiaccio aggiunge la risposta da shock da freddo, che ha i suoi rischi. I risultati delle saune finlandesi non valgono automaticamente per cabine o coperte a infrarossi.',
    link: 'Cosa mostrano gli studi — e quali sono i rischi →',
  },
  ja: {
    title: '安全第一：サウナと高温',
    items: [
      { lead: 'サウナの前と最中は飲酒しないでください。', text: 'アルコールはサウナでの死亡の最大の要因です。血圧を下げ、体が熱くなりすぎている警告サインを感じにくくします。' },
      { lead: '前後に水を飲んでください。', text: '高温では水分が急速に失われ、脱水はめまいを強めます。最初は短時間から始めてください。' },
      { lead: 'ゆっくり立ち上がってください。', text: '高温で血圧が下がるため、失神は立ち上がって出るときに最も起こりやすくなります。段差や濡れた床に注意してください。' },
      { lead: '事前に医師に相談してください：', text: '心臓病（最近の心筋梗塞、不安定狭心症、重度の大動脈弁狭窄症）、コントロールされていない血圧がある場合、血圧に影響する薬を服用している場合、妊娠中の場合（特に妊娠初期は体温の上がりすぎを避けてください）。' },
      { lead: '発熱や急性の病気のときはサウナを使わないでください。', text: '子どもは必ず大人の見守りのもとで、短く穏やかなセッションにしてください。' },
      { lead: 'めまいや気分の悪さを感じたらすぐに出てください。', text: '胸の痛み、動悸、失神、意識の混乱があれば助けを求めてください。' },
    ],
    note: '冷水や氷風呂との交互浴では寒冷ショック反応が加わり、それ自体にリスクがあります。フィンランド式サウナの研究結果は、赤外線キャビンやブランケットにそのまま当てはまるわけではありません。',
    link: '研究でわかっていること、そしてリスク →',
  },
  nl: {
    title: 'Veiligheid voorop: sauna en hitte',
    items: [
      { lead: 'Geen alcohol vóór of tijdens de sauna.', text: 'Alcohol is de belangrijkste factor bij sterfgevallen in de sauna: het verlaagt de bloeddruk en dempt de waarschuwingssignalen van oververhitting.' },
      { lead: 'Drink water vooraf en achteraf.', text: 'In de hitte verlies je snel vocht, en uitdroging maakt duizeligheid erger. Houd de sessies in het begin kort.' },
      { lead: 'Sta langzaam op.', text: 'In de hitte daalt de bloeddruk, dus flauwvallen gebeurt het vaakst bij het opstaan en naar buiten gaan. Let op bij treden en natte vloeren.' },
      { lead: 'Overleg eerst met een arts', text: 'als je een hartaandoening hebt (een recent hartinfarct, instabiele angina pectoris, ernstige aortaklepstenose), een onbehandelde of slecht ingestelde bloeddruk, medicijnen gebruikt die de bloeddruk beïnvloeden, of zwanger bent (vermijd oververhitting, vooral vroeg in de zwangerschap).' },
      { lead: 'Geen sauna bij koorts of een acute ziekte.', text: 'Kinderen alleen onder toezicht, met kortere en mildere sessies.' },
      { lead: 'Ga eruit als je duizelig wordt of je niet goed voelt.', text: 'Zoek hulp bij pijn op de borst, hartkloppingen, flauwvallen of verwardheid.' },
    ],
    note: 'Afwisselen met koud water of een ijsbad voegt de koudeshockreactie toe, die eigen risico’s heeft. Resultaten uit Finse sauna’s gelden niet automatisch voor infraroodcabines of -dekens.',
    link: 'Wat het onderzoek laat zien — en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo: sauna i wysoka temperatura',
    items: [
      { lead: 'Żadnego alkoholu przed sauną ani w jej trakcie.', text: 'Alkohol to główny czynnik zgonów w saunie: obniża ciśnienie krwi i tłumi sygnały ostrzegawcze przegrzania.' },
      { lead: 'Pij wodę przed i po.', text: 'W wysokiej temperaturze szybko tracisz płyny, a odwodnienie nasila zawroty głowy. Na początku rób krótkie sesje.' },
      { lead: 'Wstawaj powoli.', text: 'W gorącu ciśnienie spada, więc do omdlenia najczęściej dochodzi przy wstawaniu i wychodzeniu. Uważaj na stopnie i mokrą podłogę.' },
      { lead: 'Najpierw porozmawiaj z lekarzem,', text: 'jeśli masz chorobę serca (niedawny zawał, niestabilna dławica piersiowa, ciężkie zwężenie zastawki aortalnej), nieuregulowane ciśnienie krwi, przyjmujesz leki wpływające na ciśnienie lub jesteś w ciąży (unikaj przegrzania, zwłaszcza we wczesnej ciąży).' },
      { lead: 'Nie korzystaj z sauny przy gorączce lub ostrej chorobie.', text: 'Dzieci tylko pod nadzorem, z krótszymi i łagodniejszymi sesjami.' },
      { lead: 'Wyjdź, jeśli kręci ci się w głowie lub źle się czujesz.', text: 'Wezwij pomoc przy bólu w klatce piersiowej, kołataniu serca, omdleniu lub splątaniu.' },
    ],
    note: 'Przeplatanie sauny z zimną wodą lub kąpielą w lodzie dokłada reakcję szoku zimnowego, która niesie własne ryzyko. Wyniki z fińskich saun nie przenoszą się automatycznie na kabiny ani koce na podczerwień.',
    link: 'Co pokazują badania – i jakie są zagrożenia →',
  },
  pt: {
    title: 'Segurança em primeiro lugar: sauna e calor',
    items: [
      { lead: 'Nada de álcool antes ou durante a sauna.', text: 'O álcool é o principal fator nas mortes em sauna: ele baixa a pressão arterial e mascara os sinais de alerta do superaquecimento.' },
      { lead: 'Beba água antes e depois.', text: 'No calor você perde líquido rápido, e a desidratação aumenta a tontura. No começo, faça sessões curtas.' },
      { lead: 'Levante-se devagar.', text: 'A pressão arterial cai no calor, então o desmaio é mais provável na hora de levantar e sair. Cuidado com degraus e piso molhado.' },
      { lead: 'Fale primeiro com um médico', text: 'se você tem doença cardíaca (infarto recente, angina instável, estenose aórtica grave), pressão arterial não controlada, toma remédios que afetam a pressão ou está grávida (evite o superaquecimento, principalmente no início da gravidez).' },
      { lead: 'Nada de sauna com febre ou doença aguda.', text: 'Crianças só com supervisão, em sessões mais curtas e mais leves.' },
      { lead: 'Saia se sentir tontura ou mal-estar.', text: 'Peça ajuda em caso de dor no peito, palpitações, desmaio ou confusão.' },
    ],
    note: 'Alternar com água fria ou banho de gelo acrescenta a resposta de choque pelo frio, que tem seus próprios riscos. Os resultados das saunas finlandesas não valem automaticamente para cabines ou mantas de infravermelho.',
    link: 'O que mostram as evidências — e os riscos →',
  },
  ru: {
    title: 'Сначала безопасность: сауна и жар',
    items: [
      { lead: 'Никакого алкоголя до и во время сауны.', text: 'Алкоголь — главный фактор смертей в сауне: он снижает давление и притупляет сигналы перегрева.' },
      { lead: 'Пейте воду до и после.', text: 'В жаре быстро теряется жидкость, а обезвоживание усиливает головокружение. Начинайте с коротких сеансов.' },
      { lead: 'Вставайте медленно.', text: 'В жаре давление падает, поэтому обморок чаще всего случается, когда вы встаёте и выходите. Осторожно на ступенях и мокром полу.' },
      { lead: 'Сначала посоветуйтесь с врачом,', text: 'если у вас болезнь сердца (недавний инфаркт, нестабильная стенокардия, тяжёлый аортальный стеноз), неконтролируемое давление, вы принимаете лекарства, влияющие на давление, или беременны (избегайте перегрева, особенно в начале беременности).' },
      { lead: 'Не ходите в сауну с температурой или при остром заболевании.', text: 'Дети — только под присмотром, с более короткими и мягкими сеансами.' },
      { lead: 'Выходите, если закружилась голова или стало плохо.', text: 'Обращайтесь за помощью при боли в груди, сердцебиении, обмороке или спутанности сознания.' },
    ],
    note: 'Чередование с холодной водой или ледяной ванной добавляет реакцию холодового шока, у которой свои риски. Результаты финских саун не переносятся автоматически на инфракрасные кабины и одеяла.',
    link: 'Что показывают исследования — и какие есть риски →',
  },
  uk: {
    title: 'Спершу безпека: сауна і жар',
    items: [
      { lead: 'Жодного алкоголю до і під час сауни.', text: 'Алкоголь — головний чинник смертей у сауні: він знижує тиск і притуплює сигнали перегріву.' },
      { lead: 'Пийте воду до і після.', text: 'У жарі швидко втрачається рідина, а зневоднення посилює запаморочення. Починайте з коротких сеансів.' },
      { lead: 'Вставайте повільно.', text: 'У жарі тиск падає, тож непритомність найчастіше трапляється, коли ви встаєте й виходите. Обережно на сходинках і мокрій підлозі.' },
      { lead: 'Спершу порадьтеся з лікарем,', text: 'якщо у вас хвороба серця (нещодавній інфаркт, нестабільна стенокардія, тяжкий аортальний стеноз), неконтрольований тиск, ви приймаєте ліки, що впливають на тиск, або вагітні (уникайте перегріву, особливо на початку вагітності).' },
      { lead: 'Не ходіть у сауну з температурою чи при гострій хворобі.', text: 'Діти — лише під наглядом, з коротшими й м’якшими сеансами.' },
      { lead: 'Виходьте, якщо запаморочилося або стало погано.', text: 'Звертайтеся по допомогу при болю в грудях, серцебитті, непритомності чи сплутаності свідомості.' },
    ],
    note: 'Чергування з холодною водою чи крижаною ванною додає реакцію холодового шоку, що має власні ризики. Результати фінських саун не переносяться автоматично на інфрачервоні кабіни й ковдри.',
    link: 'Що показують дослідження — і які є ризики →',
  },
  zh: {
    title: '安全第一：桑拿与高温',
    items: [
      { lead: '桑拿前和桑拿中不要饮酒。', text: '酒精是桑拿死亡的首要因素：它会降低血压，并掩盖过热的警示信号。' },
      { lead: '前后都要喝水。', text: '高温下体液流失很快，脱水会加重头晕。刚开始时请缩短时间。' },
      { lead: '慢慢起身。', text: '高温会使血压下降，因此起身离开时最容易晕厥。注意台阶和湿滑地面。' },
      { lead: '请先咨询医生：', text: '如果您患有心脏病（近期心肌梗死、不稳定型心绞痛、重度主动脉瓣狭窄）、血压未得到控制、正在服用影响血压的药物，或正在怀孕（避免体温过高，尤其是孕早期）。' },
      { lead: '发烧或急性疾病期间不要蒸桑拿。', text: '儿童须在成人看护下使用，时间更短、温度更温和。' },
      { lead: '如感到头晕或不适，请立即离开。', text: '出现胸痛、心悸、晕厥或意识混乱时请寻求帮助。' },
    ],
    note: '与冷水或冰浴交替会叠加冷休克反应，而冷休克本身也有风险。芬兰式桑拿的研究结果不能直接套用到红外线桑拿房或桑拿毯上。',
    link: '研究证据显示了什么——以及有哪些风险 →',
  },
}
