/**
 * "Safety first" block for red-light / near-infrared panels and LED face
 * masks (RedLightSafetyBlock). ONE source per language; mirrors the Safety
 * section of content/science/evidence/red-light-therapy.md. Main point: eyes.
 */
import type { Lang } from '../i18n'

/** Review categories that always get the block (panels + masks). */
export const RED_LIGHT_SAFETY_CATEGORIES: ReadonlySet<string> = new Set(['red-light', 'red-light-mask'])

/** Current reviews in those categories (explicit list; category check also covers new ones). */
export const RED_LIGHT_REVIEW_SLUGS: ReadonlySet<string> = new Set([
  'biolight-pro-900',
  'bon-charge-red-light-panel',
  'gembared-vesta',
  'hooga-hg500',
  'infraredi-pro-1500',
  'joovv-solo-3',
  'kineon-move-plus',
  'mito-red-mitopro-1500',
  'platinumled-biomax-600',
  'rubylx-lyra-pro',
  'currentbody-series-2',
  'dr-dennis-gross-spectralite',
  'higherdose-red-light-face-mask',
  'jovs-dpl-photofacial-mask',
  'lightstim-for-wrinkles',
  'lumara-viso',
  'omnilux-contour-face',
  'shark-cryoglow',
  'solawave-wand-4-in-1',
  'theraface-mask',
])

/** Round-ups (comparisons) that get the block. */
export const RED_LIGHT_COMPARISON_SLUGS: ReadonlySet<string> = new Set([
  'best-red-light-therapy-panels-2026',
  'best-red-light-face-masks-2026',
])

/** Articles that give red-light protocols. */
export const RED_LIGHT_ARTICLE_SLUGS: ReadonlySet<string> = new Set([
  'mitochondrial-dna-red-light',
  'mitochondrial-biogenesis-cellular-power-grid',
])

/** Review page: by slug or category. */
export function isRedLightReview(slug: string, category?: string): boolean {
  return RED_LIGHT_REVIEW_SLUGS.has(slug) || (!!category && RED_LIGHT_SAFETY_CATEGORIES.has(category))
}

/** Comparison page: by slug or category. */
export function isRedLightComparison(slug: string, category?: string): boolean {
  return RED_LIGHT_COMPARISON_SLUGS.has(slug) || (!!category && RED_LIGHT_SAFETY_CATEGORIES.has(category))
}

/** Head-to-heads get the block when ANY product in the duel is a red-light review. */
export function hasRedLightProduct(products: readonly { slug: string; category?: string }[]): boolean {
  return products.some((p) => isRedLightReview(p.slug, p.category))
}

export interface RedLightSafetyCopy {
  title: string
  /** Each item: bold lead + rest of the sentence. */
  items: { lead: string; text: string }[]
  note: string
  link: string
}

export const RED_LIGHT_SAFETY: Record<Lang, RedLightSafetyCopy> = {
  en: {
    title: 'Safety first: red and near-infrared light',
    items: [
      { lead: 'Protect your eyes.', text: 'Wear the goggles supplied (or ones rated for these wavelengths) and never look into the LEDs. Near-infrared light is invisible and does not trigger the blink reflex, so a panel can look dim while its output is high.' },
      { lead: 'Follow the maker’s distance and time.', text: 'More light is not better: a stronger or longer session does not add benefit, and light therapy often shows a “less can be more” dose response.' },
      { lead: 'Talk to a doctor first', text: 'if you are pregnant, take medicines or use skin products that make you sensitive to light, have a light-sensitive condition, recently had a peel, laser treatment or surgery, or have a changing mole, an undiagnosed skin lesion or a history of skin cancer.' },
      { lead: 'Stop if the skin becomes painfully hot or red.', text: 'Seek medical advice if redness, pain or eye discomfort does not settle.' },
    ],
    note: 'FDA “registered” is not “cleared”, and “cleared” is not “approved”: registration says nothing about whether a device works. A home panel or mask is not a substitute for medical care.',
    link: 'What the evidence shows — and the risks →',
  },
  de: {
    title: 'Sicherheit zuerst: Rot- und Nahinfrarotlicht',
    items: [
      { lead: 'Schütze deine Augen.', text: 'Trag die mitgelieferte Schutzbrille (oder eine für diese Wellenlängen geeignete) und blick nie in die LEDs. Nahinfrarotlicht ist unsichtbar und löst keinen Lidschlussreflex aus – ein Panel kann schwach wirken, obwohl seine Leistung hoch ist.' },
      { lead: 'Halte Abstand und Dauer laut Hersteller ein.', text: 'Mehr Licht ist nicht besser: Eine stärkere oder längere Sitzung bringt keinen Zusatznutzen, und bei Lichttherapie gilt oft „weniger kann mehr sein“.' },
      { lead: 'Sprich vorher mit einer Ärztin oder einem Arzt,', text: 'wenn du schwanger bist, lichtsensibilisierende Medikamente oder Hautprodukte verwendest, eine lichtempfindliche Erkrankung hast, kürzlich ein Peeling, eine Laserbehandlung oder Operation hattest oder ein sich veränderndes Muttermal, eine unklare Hautveränderung oder Hautkrebs in der Vorgeschichte hast.' },
      { lead: 'Brich ab, wenn die Haut schmerzhaft heiß oder rot wird.', text: 'Hol dir ärztlichen Rat, wenn Rötung, Schmerzen oder Augenbeschwerden nicht abklingen.' },
    ],
    note: 'Bei der FDA „registriert“ heißt nicht „freigegeben“ (cleared), und „freigegeben“ heißt nicht „zugelassen“ (approved): Eine Registrierung sagt nichts darüber, ob ein Gerät wirkt. Ein Panel oder eine Maske für zu Hause ersetzt keine ärztliche Behandlung.',
    link: 'Was die Studien zeigen – und welche Risiken es gibt →',
  },
  es: {
    title: 'Primero, la seguridad: luz roja e infrarroja cercana',
    items: [
      { lead: 'Protege tus ojos.', text: 'Usa las gafas incluidas (u otras adecuadas para estas longitudes de onda) y nunca mires directamente a los LED. La luz infrarroja cercana es invisible y no activa el reflejo de parpadeo, así que un panel puede parecer tenue aunque emita mucha potencia.' },
      { lead: 'Respeta la distancia y el tiempo que indica el fabricante.', text: 'Más luz no es mejor: una sesión más intensa o más larga no aporta más beneficio, y en fototerapia a menudo «menos es más».' },
      { lead: 'Consulta antes a un médico', text: 'si estás embarazada, tomas medicamentos o usas productos para la piel que aumentan la sensibilidad a la luz, tienes una enfermedad fotosensible, te has hecho recientemente un peeling, un tratamiento láser o una cirugía, o tienes un lunar que cambia, una lesión cutánea sin diagnosticar o antecedentes de cáncer de piel.' },
      { lead: 'Para si la piel se calienta hasta doler o se enrojece.', text: 'Consulta a un médico si el enrojecimiento, el dolor o las molestias oculares no desaparecen.' },
    ],
    note: 'Que un dispositivo esté «registrado» ante la FDA no significa que esté «autorizado» (cleared), y «autorizado» no significa «aprobado»: el registro no dice nada sobre si funciona. Un panel o una mascarilla de uso doméstico no sustituyen la atención médica.',
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  fr: {
    title: 'La sécurité d’abord : lumière rouge et proche infrarouge',
    items: [
      { lead: 'Protégez vos yeux.', text: 'Portez les lunettes fournies (ou des lunettes adaptées à ces longueurs d’onde) et ne regardez jamais les LED. Le proche infrarouge est invisible et ne déclenche pas le réflexe de clignement : un panneau peut sembler faible alors que sa puissance est élevée.' },
      { lead: 'Respectez la distance et la durée indiquées par le fabricant.', text: 'Plus de lumière n’est pas mieux : une séance plus intense ou plus longue n’apporte pas davantage de bénéfice, et en photothérapie, « moins peut être plus ».' },
      { lead: 'Parlez-en d’abord à un médecin', text: 'si vous êtes enceinte, prenez des médicaments ou utilisez des produits cutanés photosensibilisants, avez une maladie photosensible, avez récemment eu un peeling, un traitement laser ou une chirurgie, ou présentez un grain de beauté qui change, une lésion cutanée non diagnostiquée ou des antécédents de cancer de la peau.' },
      { lead: 'Arrêtez si la peau devient douloureusement chaude ou rouge.', text: 'Consultez un médecin si la rougeur, la douleur ou une gêne oculaire ne disparaît pas.' },
    ],
    note: 'Un appareil « enregistré » auprès de la FDA n’est pas « autorisé » (cleared), et « autorisé » ne veut pas dire « approuvé » : l’enregistrement ne dit rien de son efficacité. Un panneau ou un masque à domicile ne remplace pas un suivi médical.',
    link: 'Ce que montrent les études — et les risques →',
  },
  it: {
    title: 'Prima di tutto la sicurezza: luce rossa e infrarosso vicino',
    items: [
      { lead: 'Proteggi gli occhi.', text: 'Indossa gli occhiali forniti (o altri adatti a queste lunghezze d’onda) e non guardare mai i LED. L’infrarosso vicino è invisibile e non provoca il riflesso di ammiccamento: un pannello può sembrare debole anche quando la sua potenza è alta.' },
      { lead: 'Rispetta la distanza e i tempi indicati dal produttore.', text: 'Più luce non è meglio: una seduta più intensa o più lunga non dà benefici in più, e nella terapia con la luce spesso “meno è meglio”.' },
      { lead: 'Parlane prima con un medico', text: 'se sei in gravidanza, assumi farmaci o usi prodotti per la pelle fotosensibilizzanti, hai una malattia fotosensibile, hai fatto di recente un peeling, un trattamento laser o un intervento, oppure hai un neo che cambia, una lesione cutanea non diagnosticata o una storia di tumore della pelle.' },
      { lead: 'Interrompi se la pelle diventa dolorosamente calda o arrossata.', text: 'Rivolgiti a un medico se arrossamento, dolore o fastidio agli occhi non passano.' },
    ],
    note: 'Un dispositivo “registrato” presso la FDA non è “autorizzato” (cleared), e “autorizzato” non significa “approvato”: la registrazione non dice nulla sulla sua efficacia. Un pannello o una maschera per uso domestico non sostituiscono le cure mediche.',
    link: 'Cosa mostrano gli studi — e quali sono i rischi →',
  },
  ja: {
    title: '安全第一：赤色光と近赤外線',
    items: [
      { lead: '目を守ってください。', text: '付属のゴーグル（またはこの波長に対応したもの）を着用し、LEDを直接見ないでください。近赤外線は目に見えず、まばたき反射も起こさないため、暗く見えても出力が高いことがあります。' },
      { lead: 'メーカー指定の距離と時間を守ってください。', text: '光は多ければ良いわけではありません。強く、長く照射しても効果は増えず、光療法では「少ないほうが良い」用量反応がしばしば見られます。' },
      { lead: '事前に医師に相談してください：', text: '妊娠中の場合、光線過敏を起こす薬やスキンケア製品を使用している場合、光線過敏症がある場合、最近ピーリング・レーザー治療・手術を受けた場合、変化しているほくろや診断されていない皮膚病変、皮膚がんの既往がある場合。' },
      { lead: '肌が痛いほど熱くなったり赤くなったりしたら中止してください。', text: '赤み、痛み、目の不快感が治まらない場合は医療機関を受診してください。' },
    ],
    note: 'FDAへの「登録（registered）」は「クリアランス（cleared）」ではなく、「クリアランス」は「承認（approved）」ではありません。登録は機器に効果があるかどうかを何も示しません。家庭用パネルやマスクは医療の代わりにはなりません。',
    link: '研究でわかっていること、そしてリスク →',
  },
  nl: {
    title: 'Veiligheid voorop: rood en nabij-infrarood licht',
    items: [
      { lead: 'Bescherm je ogen.', text: 'Draag de meegeleverde bril (of een bril die geschikt is voor deze golflengtes) en kijk nooit in de leds. Nabij-infrarood licht is onzichtbaar en lokt geen knipperreflex uit, dus een paneel kan zwak lijken terwijl het vermogen hoog is.' },
      { lead: 'Houd je aan de afstand en tijd van de fabrikant.', text: 'Meer licht is niet beter: een sterkere of langere sessie levert geen extra voordeel op, en bij lichttherapie geldt vaak “minder kan meer zijn”.' },
      { lead: 'Overleg eerst met een arts', text: 'als je zwanger bent, medicijnen of huidproducten gebruikt die je gevoelig maken voor licht, een lichtgevoelige aandoening hebt, onlangs een peeling, laserbehandeling of operatie hebt gehad, of een veranderende moedervlek, een niet-gediagnosticeerde huidafwijking of huidkanker in de voorgeschiedenis hebt.' },
      { lead: 'Stop als de huid pijnlijk heet of rood wordt.', text: 'Zoek medisch advies als roodheid, pijn of oogklachten niet overgaan.' },
    ],
    note: 'Bij de FDA “geregistreerd” is niet “cleared”, en “cleared” is niet “goedgekeurd” (approved): registratie zegt niets over of een apparaat werkt. Een paneel of masker voor thuis is geen vervanging voor medische zorg.',
    link: 'Wat het onderzoek laat zien — en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo: światło czerwone i bliska podczerwień',
    items: [
      { lead: 'Chroń oczy.', text: 'Zakładaj dołączone okulary (lub okulary przeznaczone do tych długości fali) i nigdy nie patrz w diody LED. Bliska podczerwień jest niewidoczna i nie wywołuje odruchu mrugania, więc panel może wydawać się słaby, choć jego moc jest duża.' },
      { lead: 'Przestrzegaj odległości i czasu zalecanych przez producenta.', text: 'Więcej światła nie znaczy lepiej: mocniejsza lub dłuższa sesja nie daje dodatkowej korzyści, a w terapii światłem często „mniej znaczy więcej”.' },
      { lead: 'Najpierw porozmawiaj z lekarzem,', text: 'jeśli jesteś w ciąży, przyjmujesz leki lub stosujesz kosmetyki zwiększające wrażliwość na światło, masz chorobę związaną z nadwrażliwością na światło, niedawno przeszłaś/przeszedłeś peeling, zabieg laserowy lub operację albo masz zmieniające się znamię, niezdiagnozowaną zmianę skórną lub raka skóry w wywiadzie.' },
      { lead: 'Przerwij, jeśli skóra staje się boleśnie gorąca lub zaczerwieniona.', text: 'Zgłoś się do lekarza, jeśli zaczerwienienie, ból lub dyskomfort oczu nie ustępują.' },
    ],
    note: 'Urządzenie „zarejestrowane” w FDA nie jest „dopuszczone” (cleared), a „dopuszczone” nie znaczy „zatwierdzone” (approved): rejestracja nic nie mówi o tym, czy urządzenie działa. Panel czy maska do użytku domowego nie zastąpią opieki medycznej.',
    link: 'Co pokazują badania – i jakie są zagrożenia →',
  },
  pt: {
    title: 'Segurança em primeiro lugar: luz vermelha e infravermelho próximo',
    items: [
      { lead: 'Proteja os olhos.', text: 'Use os óculos fornecidos (ou outros adequados a estes comprimentos de onda) e nunca olhe diretamente para os LED. O infravermelho próximo é invisível e não desencadeia o reflexo de pestanejar, por isso um painel pode parecer fraco embora a sua potência seja elevada.' },
      { lead: 'Siga a distância e o tempo indicados pelo fabricante.', text: 'Mais luz não é melhor: uma sessão mais intensa ou mais longa não traz benefício adicional, e na terapia com luz muitas vezes «menos é mais».' },
      { lead: 'Fale primeiro com um médico', text: 'se estiver grávida, tomar medicamentos ou usar produtos de pele fotossensibilizantes, tiver uma doença fotossensível, tiver feito recentemente um peeling, um tratamento a laser ou uma cirurgia, ou tiver uma pinta que está mudando, uma lesão de pele não diagnosticada ou antecedentes de câncer de pele.' },
      { lead: 'Pare se a pele ficar dolorosamente quente ou vermelha.', text: 'Procure aconselhamento médico se a vermelhidão, a dor ou o desconforto nos olhos não passarem.' },
    ],
    note: 'Um dispositivo "registrado" na FDA não está "autorizado" (cleared), e "autorizado" não significa "aprovado": o registro nada diz sobre se o dispositivo funciona. Um painel ou máscara de uso doméstico não substitui cuidados médicos.',
    link: 'O que mostram as evidências — e os riscos →',
  },
  ru: {
    title: 'Сначала безопасность: красный и ближний инфракрасный свет',
    items: [
      { lead: 'Берегите глаза.', text: 'Надевайте очки из комплекта (или очки, рассчитанные на эти длины волн) и никогда не смотрите на светодиоды. Ближний инфракрасный свет невидим и не вызывает мигательного рефлекса, поэтому панель может казаться тусклой при высокой мощности.' },
      { lead: 'Соблюдайте расстояние и время, указанные производителем.', text: 'Больше света — не лучше: более мощный или долгий сеанс не даёт дополнительной пользы, а в светотерапии часто действует принцип «меньше может быть лучше».' },
      { lead: 'Сначала посоветуйтесь с врачом,', text: 'если вы беременны, принимаете лекарства или пользуетесь средствами для кожи, повышающими чувствительность к свету, у вас есть заболевание с фоточувствительностью, вы недавно делали пилинг, лазерную процедуру или операцию, либо у вас меняющаяся родинка, невыясненное образование на коже или рак кожи в анамнезе.' },
      { lead: 'Прекратите, если кожа стала болезненно горячей или покраснела.', text: 'Обратитесь к врачу, если покраснение, боль или неприятные ощущения в глазах не проходят.' },
    ],
    note: '«Зарегистрировано» в FDA — не то же самое, что «допущено» (cleared), а «допущено» — не то же самое, что «одобрено» (approved): регистрация ничего не говорит о том, работает ли устройство. Домашняя панель или маска не заменяют медицинскую помощь.',
    link: 'Что показывают исследования — и какие есть риски →',
  },
  uk: {
    title: 'Спершу безпека: червоне і ближнє інфрачервоне світло',
    items: [
      { lead: 'Бережіть очі.', text: 'Надягайте окуляри з комплекту (або окуляри, розраховані на ці довжини хвиль) і ніколи не дивіться на світлодіоди. Ближнє інфрачервоне світло невидиме й не викликає мигального рефлексу, тож панель може здаватися тьмяною за високої потужності.' },
      { lead: 'Дотримуйтеся відстані й часу, указаних виробником.', text: 'Більше світла — не краще: потужніший або довший сеанс не дає додаткової користі, а у світлотерапії часто діє принцип «менше може бути краще».' },
      { lead: 'Спершу порадьтеся з лікарем,', text: 'якщо ви вагітні, приймаєте ліки чи користуєтеся засобами для шкіри, що підвищують чутливість до світла, маєте захворювання з фоточутливістю, нещодавно робили пілінг, лазерну процедуру чи операцію, або маєте родимку, що змінюється, нез’ясоване утворення на шкірі чи рак шкіри в анамнезі.' },
      { lead: 'Припиніть, якщо шкіра стала болісно гарячою або почервоніла.', text: 'Зверніться до лікаря, якщо почервоніння, біль чи неприємні відчуття в очах не минають.' },
    ],
    note: '«Зареєстровано» у FDA — не те саме, що «допущено» (cleared), а «допущено» — не те саме, що «схвалено» (approved): реєстрація нічого не каже про те, чи працює пристрій. Домашня панель чи маска не замінюють медичної допомоги.',
    link: 'Що показують дослідження — і які є ризики →',
  },
  zh: {
    title: '安全第一：红光与近红外光',
    items: [
      { lead: '保护眼睛。', text: '请佩戴随附的护目镜（或适用于这些波长的护目镜），切勿直视LED灯珠。近红外光肉眼不可见，也不会引起眨眼反射，因此面板看起来暗淡时输出功率可能仍然很高。' },
      { lead: '遵守厂家规定的距离和时长。', text: '光并非越多越好：更强或更长的照射不会带来额外益处，光疗常呈现“少即是多”的剂量反应。' },
      { lead: '请先咨询医生：', text: '如果您正在怀孕，正在服用会增加光敏性的药物或使用此类护肤品，患有光敏性疾病，近期做过换肤（刷酸）、激光治疗或手术，或有正在变化的痣、未确诊的皮肤病变或皮肤癌病史。' },
      { lead: '如果皮肤灼热到疼痛或发红，请立即停止。', text: '若发红、疼痛或眼部不适持续不退，请就医。' },
    ],
    note: '在FDA“注册”（registered）不等于“许可”（cleared），“许可”也不等于“批准”（approved）：注册并不能说明设备是否有效。家用面板或面罩不能替代医疗。',
    link: '研究证据显示了什么——以及有哪些风险 →',
  },
}
