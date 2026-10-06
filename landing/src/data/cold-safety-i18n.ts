/**
 * "Safety first" block for cold-plunge reviews/compare/h2h and cold-protocol
 * articles (ColdSafetyBlock). ONE source per language; mirrors the Safety
 * section of content/science/evidence/cold-exposure.md.
 */
import type { Lang } from '../i18n'

export interface ColdSafetyCopy {
  title: string
  shock: string
  items: string[]
  link: string
}

export const COLD_SAFETY: Record<Lang, ColdSafetyCopy> = {
  en: {
    title: 'Safety first',
    shock: 'Cold shock can kill in the first minutes — before the body has time to cool: a gasp reflex, fast uncontrolled breathing and heart-rhythm problems.',
    items: [
      'Never go into cold open water alone.',
      'Never after alcohol.',
      'Talk to a doctor first if you have heart disease, an arrhythmia, high blood pressure, Raynaud’s phenomenon or another circulation problem, or if you are pregnant.',
      'Stop and seek help for chest pain, palpitations or fainting.',
    ],
    link: 'What the evidence shows — and the risks →',
  },
  es: {
    title: 'Primero, la seguridad',
    shock: 'El choque por frío puede matar en los primeros minutos, antes de que el cuerpo llegue a enfriarse: jadeo involuntario, respiración rápida e incontrolada y alteraciones del ritmo cardíaco.',
    items: [
      'Nunca entres solo en aguas abiertas frías.',
      'Nunca después de beber alcohol.',
      'Consulta antes a un médico si tienes una enfermedad cardíaca, una arritmia, hipertensión, fenómeno de Raynaud u otro problema de circulación, o si estás embarazada.',
      'Detente y pide ayuda si notas dolor en el pecho, palpitaciones o desmayo.',
    ],
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  ru: {
    title: 'Сначала безопасность',
    shock: 'Холодовой шок может убить в первые минуты — ещё до того, как тело успеет остыть: рефлекторный вдох, частое неконтролируемое дыхание и нарушения сердечного ритма.',
    items: [
      'Никогда не заходите в холодную открытую воду в одиночку.',
      'Никогда — после алкоголя.',
      'Сначала посоветуйтесь с врачом, если у вас болезнь сердца, аритмия, повышенное давление, феномен Рейно или другие проблемы с кровообращением, а также при беременности.',
      'Прекратите и обратитесь за помощью при боли в груди, сердцебиении или обмороке.',
    ],
    link: 'Что показывают исследования — и какие есть риски →',
  },
  uk: {
    title: 'Спершу безпека',
    shock: 'Холодовий шок може вбити в перші хвилини — ще до того, як тіло встигне охолонути: рефлекторний вдих, часте неконтрольоване дихання та порушення серцевого ритму.',
    items: [
      'Ніколи не заходьте в холодну відкриту воду самі.',
      'Ніколи — після алкоголю.',
      'Спершу порадьтеся з лікарем, якщо маєте хворобу серця, аритмію, підвищений тиск, феномен Рейно чи інші проблеми з кровообігом, а також під час вагітності.',
      'Зупиніться й зверніться по допомогу в разі болю в грудях, сильного серцебиття чи непритомності.',
    ],
    link: 'Що показують дослідження — і які є ризики →',
  },
  zh: {
    title: '安全第一',
    shock: '冷休克可能在最初几分钟内致命——身体还来不及降温：会出现喘息反射、急促失控的呼吸和心律问题。',
    items: [
      '切勿独自进入寒冷的开放水域。',
      '饮酒后切勿下水。',
      '如果你有心脏病、心律失常、高血压、雷诺现象或其他循环问题，或正在怀孕，请先咨询医生。',
      '如出现胸痛、心悸或晕厥，立即停止并寻求帮助。',
    ],
    link: '研究证据与风险 →',
  },
  de: {
    title: 'Sicherheit zuerst',
    shock: 'Der Kälteschock kann in den ersten Minuten tödlich sein – noch bevor der Körper auskühlt: reflexartiges Luftschnappen, schnelle unkontrollierte Atmung und Herzrhythmusstörungen.',
    items: [
      'Gehen Sie nie allein in kaltes offenes Gewässer.',
      'Nie nach Alkohol.',
      'Sprechen Sie vorher mit einer Ärztin oder einem Arzt, wenn Sie eine Herzerkrankung, Herzrhythmusstörungen, Bluthochdruck, das Raynaud-Syndrom oder eine andere Durchblutungsstörung haben oder schwanger sind.',
      'Bei Brustschmerzen, Herzrasen oder Ohnmacht sofort aufhören und Hilfe holen.',
    ],
    link: 'Was die Forschung zeigt – und die Risiken →',
  },
  fr: {
    title: 'La sécurité d’abord',
    shock: 'Le choc dû au froid peut tuer dans les premières minutes, avant même que le corps ait eu le temps de se refroidir : réflexe de suffocation, respiration rapide et incontrôlée, troubles du rythme cardiaque.',
    items: [
      'N’allez jamais seul dans une eau froide en milieu naturel.',
      'Jamais après avoir bu de l’alcool.',
      'Parlez-en d’abord à un médecin si vous avez une maladie cardiaque, une arythmie, une hypertension, un syndrome de Raynaud ou un autre trouble circulatoire, ou si vous êtes enceinte.',
      'Arrêtez et demandez de l’aide en cas de douleur thoracique, de palpitations ou d’évanouissement.',
    ],
    link: 'Ce que montrent les données — et les risques →',
  },
  it: {
    title: 'Prima la sicurezza',
    shock: 'Lo shock da freddo può uccidere nei primi minuti, prima ancora che il corpo si raffreddi: riflesso di boccheggiamento, respirazione rapida e incontrollata e disturbi del ritmo cardiaco.',
    items: [
      'Non entrare mai da solo in acque libere fredde.',
      'Mai dopo aver bevuto alcol.',
      'Parlane prima con un medico se hai una malattia cardiaca, un’aritmia, la pressione alta, il fenomeno di Raynaud o un altro problema di circolazione, oppure se sei incinta.',
      'Fermati e chiedi aiuto in caso di dolore al petto, palpitazioni o svenimento.',
    ],
    link: 'Cosa dicono le evidenze, e i rischi →',
  },
  pt: {
    title: 'Segurança em primeiro lugar',
    shock: 'O choque pelo frio pode matar nos primeiros minutos, antes de o corpo ter tempo de arrefecer: reflexo de arquejo, respiração rápida e descontrolada e alterações do ritmo cardíaco.',
    items: [
      'Nunca entre sozinho em águas abertas frias.',
      'Nunca depois de beber álcool.',
      'Fale primeiro com um médico se tiver doença cardíaca, arritmia, pressão alta, fenómeno de Raynaud ou outro problema de circulação, ou se estiver grávida.',
      'Pare e procure ajuda se sentir dor no peito, palpitações ou desmaio.',
    ],
    link: 'O que as evidências mostram — e os riscos →',
  },
  nl: {
    title: 'Veiligheid eerst',
    shock: 'Een koudeshock kan in de eerste minuten dodelijk zijn, nog vóór het lichaam is afgekoeld: een reflexmatige hap naar lucht, snelle ongecontroleerde ademhaling en hartritmestoornissen.',
    items: [
      'Ga nooit alleen koud open water in.',
      'Nooit na alcohol.',
      'Overleg eerst met een arts als je een hartziekte, een hartritmestoornis, hoge bloeddruk, het fenomeen van Raynaud of een ander doorbloedingsprobleem hebt, of als je zwanger bent.',
      'Stop en zoek hulp bij pijn op de borst, hartkloppingen of flauwvallen.',
    ],
    link: 'Wat het onderzoek laat zien – en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo',
    shock: 'Szok zimna może zabić w pierwszych minutach, zanim ciało zdąży się wychłodzić: odruchowy wdech, szybki niekontrolowany oddech i zaburzenia rytmu serca.',
    items: [
      'Nigdy nie wchodź sam do zimnej otwartej wody.',
      'Nigdy po alkoholu.',
      'Najpierw porozmawiaj z lekarzem, jeśli masz chorobę serca, arytmię, nadciśnienie, objaw Raynauda lub inny problem z krążeniem albo jesteś w ciąży.',
      'Przerwij i wezwij pomoc, jeśli pojawi się ból w klatce piersiowej, kołatanie serca lub omdlenie.',
    ],
    link: 'Co pokazują badania — i jakie są ryzyka →',
  },
  ja: {
    title: '安全を最優先に',
    shock: '寒冷ショックは、体が冷え切る前の最初の数分で命に関わることがあります。反射的にあえぐ呼吸、速く制御できない呼吸、心拍リズムの異常が起こります。',
    items: [
      '冷たい自然の水域に一人で入らないでください。',
      '飲酒後は絶対に入らないでください。',
      '心臓病、不整脈、高血圧、レイノー現象などの循環器の問題がある方、妊娠中の方は、事前に医師に相談してください。',
      '胸の痛み、動悸、失神があれば中止し、助けを求めてください。',
    ],
    link: '研究で分かっていること、そしてリスク →',
  },
}
