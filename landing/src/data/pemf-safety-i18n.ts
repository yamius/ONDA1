/**
 * "Safety first" block for PEMF devices (mats, coils, pads) — PemfSafetyBlock.
 * ONE source per language; mirrors the safety notes of
 * content/science/evidence/pemf.md (042_pemf_report.md, safety-block section).
 * Main point: no use with a pacemaker / ICD / other implanted electronic device
 * unless the doctor or device maker says it is safe.
 */
import type { Lang } from '../i18n'

/** Review categories that always get the block. */
export const PEMF_SAFETY_CATEGORIES: ReadonlySet<string> = new Set(['pemf'])

/** Current reviews in that category (explicit list; category check also covers new ones). */
export const PEMF_REVIEW_SLUGS: ReadonlySet<string> = new Set([
  'bemer-classic-evo',
  'curatron-3d',
  'earthpulse-sleep-on-command',
  'healthy-wave-multi-wave',
  'higherdose-pemf-mat',
  'imrs-prime',
  'magnawave-mini',
  'olylife-tera-p90-plus',
  'omi-full-body-mat',
  'pulse-centers-pulse-xl-pro',
  'qi-coil',
  'resona-health-vibe',
])

/** Round-ups (comparisons) that get the block. */
export const PEMF_COMPARISON_SLUGS: ReadonlySet<string> = new Set(['best-pemf-devices-2026'])

/** Head-to-heads with a PEMF product (covered by hasPemfProduct; listed for reference). */
export const PEMF_H2H_SLUGS: ReadonlySet<string> = new Set([
  'bemer-classic-evo-vs-healthy-wave-multi-wave',
  'bemer-classic-evo-vs-healthy-wave-multi-wave-vs-pulse-centers-pulse-xl-pro',
  'bemer-classic-evo-vs-pulse-centers-pulse-xl-pro',
  'healthy-wave-multi-wave-vs-higherdose-pemf-mat',
  'healthy-wave-multi-wave-vs-qi-coil',
  'imrs-prime-vs-omi-full-body-mat',
  'resona-health-vibe-vs-higherdose-pemf-mat',
  'resona-health-vibe-vs-olylife-tera-p90-plus',
])

/** Review page: by slug or category. */
export function isPemfReview(slug: string, category?: string): boolean {
  return PEMF_REVIEW_SLUGS.has(slug) || PEMF_COMPARISON_SLUGS.has(slug) || (!!category && PEMF_SAFETY_CATEGORIES.has(category))
}

/** Comparison page: by slug or category. */
export function isPemfComparison(slug: string, category?: string): boolean {
  return PEMF_COMPARISON_SLUGS.has(slug) || (!!category && PEMF_SAFETY_CATEGORIES.has(category))
}

/** Head-to-heads get the block when ANY product in the duel is a PEMF review. */
export function hasPemfProduct(products: readonly { slug: string; category?: string }[]): boolean {
  return products.some((p) => isPemfReview(p.slug, p.category))
}

export interface PemfSafetyCopy {
  title: string
  /** Each item: bold lead + rest of the sentence. */
  items: { lead: string; text: string }[]
  note: string
  link: string
}

export const PEMF_SAFETY: Record<Lang, PemfSafetyCopy> = {
  en: {
    title: 'Safety first: PEMF devices',
    items: [
      { lead: 'Do not use with a pacemaker, implanted defibrillator or other implanted electronic device', text: '(for example a neurostimulator, insulin pump or cochlear implant) unless your doctor or the device maker says it is safe. Pulsed magnetic fields can interfere with implanted electronics.' },
      { lead: 'Pregnancy or epilepsy: talk to a doctor first.', text: 'Safety in pregnancy and in people with seizures has not been studied well.' },
      { lead: 'Metal implants: ask first.', text: 'Check with your surgeon before using a device over plates, screws or joint replacements, and follow the maker’s warnings.' },
      { lead: 'A home mat is not a substitute for medical care.', text: 'A fracture that will not heal, persistent pain, low mood or ongoing insomnia needs a medical assessment.' },
    ],
    note: 'FDA "registered" is not "cleared", and "cleared" is not "approved". A clearance for one non-medical use (for example, general muscle conditioning) says nothing about treating any disease.',
    link: 'What the evidence shows — and the risks →',
  },
  de: {
    title: 'Sicherheit zuerst: PEMF-Geräte',
    items: [
      { lead: 'Nicht verwenden mit Herzschrittmacher, implantiertem Defibrillator oder einem anderen implantierten elektronischen Gerät', text: '(zum Beispiel Neurostimulator, Insulinpumpe oder Cochlea-Implantat), außer dein Arzt oder der Gerätehersteller bestätigt, dass es sicher ist. Gepulste Magnetfelder können implantierte Elektronik stören.' },
      { lead: 'Schwangerschaft oder Epilepsie: sprich zuerst mit deinem Arzt.', text: 'Die Sicherheit in der Schwangerschaft und bei Menschen mit Krampfanfällen ist kaum untersucht.' },
      { lead: 'Metallimplantate: vorher fragen.', text: 'Kläre mit deinem Chirurgen, ob du das Gerät über Platten, Schrauben oder Gelenkprothesen verwenden darfst, und beachte die Warnhinweise des Herstellers.' },
      { lead: 'Eine Matte für zu Hause ersetzt keine ärztliche Behandlung.', text: 'Ein Knochenbruch, der nicht heilt, anhaltende Schmerzen, gedrückte Stimmung oder andauernde Schlaflosigkeit gehören ärztlich abgeklärt.' },
    ],
    note: 'Bei der FDA ist „registriert“ (registered) nicht „freigegeben“ (cleared), und „freigegeben“ ist nicht „zugelassen“ (approved). Eine Freigabe für einen nicht-medizinischen Zweck (etwa allgemeines Muskeltraining) sagt nichts über die Behandlung einer Krankheit aus.',
    link: 'Was die Studien zeigen – und die Risiken →',
  },
  es: {
    title: 'La seguridad primero: dispositivos PEMF',
    items: [
      { lead: 'No lo uses si tienes marcapasos, desfibrilador implantado u otro dispositivo electrónico implantado', text: '(por ejemplo, un neuroestimulador, una bomba de insulina o un implante coclear), salvo que tu médico o el fabricante del dispositivo indiquen que es seguro. Los campos magnéticos pulsados pueden interferir con la electrónica implantada.' },
      { lead: 'Embarazo o epilepsia: consulta primero a un médico.', text: 'La seguridad durante el embarazo y en personas con convulsiones apenas se ha estudiado.' },
      { lead: 'Implantes metálicos: pregunta antes.', text: 'Consulta a tu cirujano antes de usar el dispositivo sobre placas, tornillos o prótesis articulares, y sigue las advertencias del fabricante.' },
      { lead: 'Una esterilla doméstica no sustituye la atención médica.', text: 'Una fractura que no consolida, el dolor persistente, el ánimo bajo o el insomnio continuado requieren una valoración médica.' },
    ],
    note: 'Para la FDA, «registrado» (registered) no es «autorizado» (cleared), y «autorizado» no es «aprobado» (approved). Una autorización para un uso no médico (por ejemplo, acondicionamiento muscular general) no dice nada sobre tratar ninguna enfermedad.',
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  fr: {
    title: 'La sécurité d’abord : appareils PEMF',
    items: [
      { lead: 'Ne pas utiliser avec un stimulateur cardiaque, un défibrillateur implanté ou tout autre dispositif électronique implanté', text: '(par exemple un neurostimulateur, une pompe à insuline ou un implant cochléaire), sauf si votre médecin ou le fabricant du dispositif confirme que c’est sans danger. Les champs magnétiques pulsés peuvent perturber l’électronique implantée.' },
      { lead: 'Grossesse ou épilepsie : parlez-en d’abord à un médecin.', text: 'La sécurité pendant la grossesse et chez les personnes sujettes aux crises a été peu étudiée.' },
      { lead: 'Implants métalliques : demandez avant.', text: 'Consultez votre chirurgien avant d’utiliser l’appareil sur des plaques, des vis ou une prothèse articulaire, et suivez les avertissements du fabricant.' },
      { lead: 'Un tapis à domicile ne remplace pas les soins médicaux.', text: 'Une fracture qui ne consolide pas, une douleur persistante, un moral bas ou une insomnie durable nécessitent un avis médical.' },
    ],
    note: 'Pour la FDA, « enregistré » (registered) n’est pas « autorisé » (cleared), et « autorisé » n’est pas « approuvé » (approved). Une autorisation pour un usage non médical (par exemple le renforcement musculaire général) ne dit rien sur le traitement d’une maladie.',
    link: 'Ce que montrent les études — et les risques →',
  },
  it: {
    title: 'Prima la sicurezza: dispositivi PEMF',
    items: [
      { lead: 'Non usarlo con pacemaker, defibrillatore impiantato o altro dispositivo elettronico impiantato', text: '(per esempio un neurostimolatore, un microinfusore di insulina o un impianto cocleare), a meno che il tuo medico o il produttore del dispositivo non confermi che è sicuro. I campi magnetici pulsati possono interferire con l’elettronica impiantata.' },
      { lead: 'Gravidanza o epilessia: parlane prima con un medico.', text: 'La sicurezza in gravidanza e nelle persone con crisi epilettiche è stata poco studiata.' },
      { lead: 'Impianti metallici: chiedi prima.', text: 'Consulta il tuo chirurgo prima di usare il dispositivo sopra placche, viti o protesi articolari, e segui le avvertenze del produttore.' },
      { lead: 'Un tappetino domestico non sostituisce le cure mediche.', text: 'Una frattura che non guarisce, un dolore persistente, l’umore basso o un’insonnia che dura richiedono una valutazione medica.' },
    ],
    note: 'Per la FDA, «registrato» (registered) non significa «autorizzato» (cleared), e «autorizzato» non significa «approvato» (approved). Un’autorizzazione per un uso non medico (per esempio il condizionamento muscolare generico) non dice nulla sul trattamento di una malattia.',
    link: 'Cosa mostrano le prove — e i rischi →',
  },
  ja: {
    title: '安全第一：PEMF機器',
    items: [
      { lead: 'ペースメーカー、植込み型除細動器、その他の植込み型電子機器がある場合は使用しないでください', text: '（例：神経刺激装置、インスリンポンプ、人工内耳）。主治医または機器メーカーが安全と認めた場合を除きます。パルス磁場は植込み電子機器に干渉する可能性があります。' },
      { lead: '妊娠中・てんかんのある方は、まず医師に相談してください。', text: '妊娠中やけいれん発作のある人での安全性は十分に研究されていません。' },
      { lead: '金属インプラントがある場合は事前に確認を。', text: 'プレート、スクリュー、人工関節の上で使う前に執刀医に相談し、メーカーの警告に従ってください。' },
      { lead: '家庭用マットは医療の代わりにはなりません。', text: '治らない骨折、続く痛み、気分の落ち込み、長引く不眠は医師の診察が必要です。' },
    ],
    note: 'FDAの「登録」（registered）は「クリアランス」（cleared）ではなく、「クリアランス」は「承認」（approved）ではありません。医療目的以外の用途（例：一般的な筋肉コンディショニング）のクリアランスは、病気の治療について何も示しません。',
    link: 'エビデンスが示すこと、そしてリスク →',
  },
  nl: {
    title: 'Veiligheid voorop: PEMF-apparaten',
    items: [
      { lead: 'Niet gebruiken met een pacemaker, geïmplanteerde defibrillator of ander geïmplanteerd elektronisch apparaat', text: '(bijvoorbeeld een neurostimulator, insulinepomp of cochleair implantaat), tenzij je arts of de fabrikant van het apparaat zegt dat het veilig is. Gepulste magnetische velden kunnen geïmplanteerde elektronica verstoren.' },
      { lead: 'Zwanger of epilepsie: overleg eerst met een arts.', text: 'De veiligheid tijdens de zwangerschap en bij mensen met aanvallen is nauwelijks onderzocht.' },
      { lead: 'Metalen implantaten: vraag het eerst.', text: 'Overleg met je chirurg voordat je het apparaat gebruikt boven platen, schroeven of gewrichtsprothesen, en volg de waarschuwingen van de fabrikant.' },
      { lead: 'Een mat voor thuis vervangt geen medische zorg.', text: 'Een breuk die niet geneest, aanhoudende pijn, een sombere stemming of langdurige slapeloosheid vragen om medisch onderzoek.' },
    ],
    note: 'Bij de FDA is „geregistreerd” (registered) niet „toegelaten” (cleared), en „toegelaten” is niet „goedgekeurd” (approved). Een toelating voor één niet-medisch gebruik (bijvoorbeeld algemene spiertraining) zegt niets over het behandelen van een ziekte.',
    link: 'Wat het bewijs laat zien — en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo: urządzenia PEMF',
    items: [
      { lead: 'Nie używaj z rozrusznikiem serca, wszczepionym defibrylatorem ani innym wszczepionym urządzeniem elektronicznym', text: '(np. neurostymulatorem, pompą insulinową czy implantem ślimakowym), chyba że lekarz lub producent urządzenia potwierdzi, że to bezpieczne. Pulsujące pole magnetyczne może zakłócać działanie wszczepionej elektroniki.' },
      { lead: 'Ciąża lub padaczka: najpierw porozmawiaj z lekarzem.', text: 'Bezpieczeństwo w ciąży i u osób z napadami drgawkowymi jest słabo zbadane.' },
      { lead: 'Implanty metalowe: zapytaj wcześniej.', text: 'Zanim użyjesz urządzenia nad płytkami, śrubami lub endoprotezą stawu, skonsultuj się z chirurgiem i stosuj się do ostrzeżeń producenta.' },
      { lead: 'Domowa mata nie zastąpi opieki medycznej.', text: 'Złamanie, które się nie zrasta, uporczywy ból, obniżony nastrój lub przewlekła bezsenność wymagają oceny lekarskiej.' },
    ],
    note: 'W FDA „zarejestrowane” (registered) to nie „dopuszczone” (cleared), a „dopuszczone” to nie „zatwierdzone” (approved). Dopuszczenie do jednego niemedycznego zastosowania (np. ogólnego treningu mięśni) nic nie mówi o leczeniu jakiejkolwiek choroby.',
    link: 'Co pokazują badania — i jakie są ryzyka →',
  },
  pt: {
    title: 'Segurança em primeiro lugar: aparelhos PEMF',
    items: [
      { lead: 'Não use com marca-passo, desfibrilador implantável ou outro dispositivo eletrônico implantado', text: '(por exemplo, neuroestimulador, bomba de insulina ou implante coclear), a menos que seu médico ou o fabricante do dispositivo diga que é seguro. Campos magnéticos pulsados podem interferir em eletrônicos implantados.' },
      { lead: 'Gravidez ou epilepsia: fale primeiro com um médico.', text: 'A segurança na gravidez e em pessoas com convulsões foi pouco estudada.' },
      { lead: 'Implantes metálicos: pergunte antes.', text: 'Consulte seu cirurgião antes de usar o aparelho sobre placas, parafusos ou próteses articulares, e siga os avisos do fabricante.' },
      { lead: 'Um tapete doméstico não substitui o atendimento médico.', text: 'Uma fratura que não consolida, dor persistente, humor deprimido ou insônia contínua precisam de avaliação médica.' },
    ],
    note: 'Na FDA, “registrado” (registered) não é “liberado” (cleared), e “liberado” não é “aprovado” (approved). Uma liberação para um uso não médico (por exemplo, condicionamento muscular geral) não diz nada sobre o tratamento de qualquer doença.',
    link: 'O que as evidências mostram — e os riscos →',
  },
  ru: {
    title: 'Сначала безопасность: PEMF-устройства',
    items: [
      { lead: 'Не используйте при кардиостимуляторе, имплантированном дефибрилляторе или другом имплантированном электронном устройстве', text: '(например, нейростимуляторе, инсулиновой помпе или кохлеарном импланте), если врач или производитель устройства не подтвердил, что это безопасно. Импульсные магнитные поля могут нарушать работу имплантированной электроники.' },
      { lead: 'Беременность или эпилепсия — сначала к врачу.', text: 'Безопасность при беременности и у людей с судорожными приступами почти не изучена.' },
      { lead: 'Металлические импланты — спросите заранее.', text: 'Прежде чем использовать устройство над пластинами, винтами или эндопротезами суставов, посоветуйтесь с хирургом и соблюдайте предупреждения производителя.' },
      { lead: 'Домашний мат не заменяет медицинскую помощь.', text: 'Несрастающийся перелом, стойкая боль, подавленное настроение или затяжная бессонница требуют осмотра врача.' },
    ],
    note: 'Для FDA «зарегистрировано» (registered) — не «допущено» (cleared), а «допущено» — не «одобрено» (approved). Допуск для одного немедицинского применения (например, общего тренинга мышц) ничего не говорит о лечении какой-либо болезни.',
    link: 'Что показывают исследования — и риски →',
  },
  uk: {
    title: 'Спершу безпека: PEMF-пристрої',
    items: [
      { lead: 'Не використовуйте з кардіостимулятором, імплантованим дефібрилятором чи іншим імплантованим електронним пристроєм', text: '(наприклад, нейростимулятором, інсуліновою помпою чи кохлеарним імплантом), якщо лікар або виробник пристрою не підтвердив, що це безпечно. Імпульсні магнітні поля можуть порушувати роботу імплантованої електроніки.' },
      { lead: 'Вагітність чи епілепсія — спершу до лікаря.', text: 'Безпеку під час вагітності та в людей із судомними нападами майже не досліджено.' },
      { lead: 'Металеві імпланти — запитайте заздалегідь.', text: 'Перш ніж використовувати пристрій над пластинами, гвинтами чи ендопротезами суглобів, порадьтеся з хірургом і дотримуйтеся попереджень виробника.' },
      { lead: 'Домашній мат не замінює медичну допомогу.', text: 'Перелом, що не зростається, стійкий біль, пригнічений настрій чи тривале безсоння потребують огляду лікаря.' },
    ],
    note: 'Для FDA «зареєстровано» (registered) — не «допущено» (cleared), а «допущено» — не «схвалено» (approved). Допуск для одного немедичного застосування (наприклад, загального тренування м’язів) нічого не каже про лікування будь-якої хвороби.',
    link: 'Що показують дослідження — і ризики →',
  },
  zh: {
    title: '安全第一：PEMF 设备',
    items: [
      { lead: '如果你装有心脏起搏器、植入式除颤器或其他植入式电子设备，请不要使用', text: '（例如神经刺激器、胰岛素泵或人工耳蜗），除非医生或设备制造商确认安全。脉冲磁场可能干扰植入的电子设备。' },
      { lead: '怀孕或癫痫：请先咨询医生。', text: '孕期以及有癫痫发作人群的安全性研究很少。' },
      { lead: '有金属植入物：请先询问。', text: '在钢板、螺钉或人工关节上方使用前，请先咨询你的外科医生，并遵守制造商的警告。' },
      { lead: '家用垫子不能代替医疗。', text: '骨折迟迟不愈合、持续疼痛、情绪低落或长期失眠，都需要就医评估。' },
    ],
    note: '在 FDA 体系中，“注册”（registered）不等于“许可”（cleared），“许可”也不等于“批准”（approved）。针对某一非医疗用途（例如一般肌肉调理）的许可，并不说明它能治疗任何疾病。',
    link: '证据显示了什么——以及风险 →',
  },
}
