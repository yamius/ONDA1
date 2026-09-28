/**
 * Small shared UI strings that used to be hard-coded in English inside
 * components rendered on every language (framework disclaimer, review promo,
 * glossary "ONDA term" notes). {placeholders} are filled by the component.
 */
import type { Lang } from '../i18n'

interface UiStrings {
  efnLabel: string
  /** {science} and {measures} are links. */
  efnBody: string
  efnScience: string
  efnMeasures: string
  beforeYouBuy: string
  /** {tool} is the "Apple Watch Baseline" link. */
  baselinePromo: string
  ondaTermNote: string
  ondaTermTitle: string
  scientificTerm: string
  latest: string
}

export const UI_I18N: Record<Lang, UiStrings> = {
  en: {
    efnLabel: 'Experiential framework — not a medical claim',
    efnBody: 'The ONDA Path — its levels, stages and higher-state language — is an experiential framework: a practice and a way of describing subjective experience, not a hierarchy of clinically validated biological states. The evidence-backed part of ONDA is HRV biofeedback and paced breathing — see {science} and {measures}.',
    efnScience: 'the science behind ONDA',
    efnMeasures: 'what ONDA measures',
    beforeYouBuy: 'Before you buy',
    baselinePromo: 'You may already own the data. Our free {tool} tool reads two weeks of your resting heart rate, HRV and breathing off your own Apple Health — the range, not one number — on your iPhone, with nothing uploaded.',
    ondaTermNote: 'This is ONDA Life’s own terminology — a metaphor from the ONDA model, not an established scientific term.',
    ondaTermTitle: 'ONDA Life’s own terminology, not an established scientific term',
    scientificTerm: 'SCIENTIFIC TERM',
    latest: 'latest',
  },
  es: {
    efnLabel: 'Marco experiencial — no es una afirmación médica',
    efnBody: 'El Camino ONDA — sus niveles, etapas y su lenguaje de estados superiores — es un marco experiencial: una práctica y una forma de describir la experiencia subjetiva, no una jerarquía de estados biológicos validados clínicamente. La parte de ONDA respaldada por evidencia es el biofeedback de VFC y la respiración pautada — consulta {science} y {measures}.',
    efnScience: 'la ciencia detrás de ONDA',
    efnMeasures: 'lo que mide ONDA',
    beforeYouBuy: 'Antes de comprar',
    baselinePromo: 'Puede que ya tengas los datos. Nuestra herramienta gratuita {tool} lee dos semanas de tu frecuencia cardíaca en reposo, VFC y respiración desde tu propia app Salud — el rango, no un solo número — en tu iPhone, sin subir nada.',
    ondaTermNote: 'Esta es terminología propia de ONDA Life — una metáfora del modelo ONDA, no un término científico establecido.',
    ondaTermTitle: 'Terminología propia de ONDA Life, no un término científico establecido',
    scientificTerm: 'TÉRMINO CIENTÍFICO',
    latest: 'lo último',
  },
  ru: {
    efnLabel: 'Практическая модель — не медицинское утверждение',
    efnBody: 'Путь ONDA — его уровни, этапы и язык высших состояний — это практическая модель: практика и способ описывать субъективный опыт, а не иерархия клинически подтверждённых биологических состояний. Научно обоснованная часть ONDA — это биофидбек ВСР и дыхание в заданном ритме: см. {science} и {measures}.',
    efnScience: 'научную основу ONDA',
    efnMeasures: 'что измеряет ONDA',
    beforeYouBuy: 'Перед покупкой',
    baselinePromo: 'Возможно, данные у вас уже есть. Наш бесплатный инструмент {tool} читает две недели вашего пульса в покое, ВСР и частоты дыхания из Apple Health — диапазон, а не одно число — прямо на iPhone, ничего не загружая.',
    ondaTermNote: 'Это собственная терминология ONDA Life — метафора из модели ONDA, а не устоявшийся научный термин.',
    ondaTermTitle: 'Собственная терминология ONDA Life, не устоявшийся научный термин',
    scientificTerm: 'НАУЧНЫЙ ТЕРМИН',
    latest: 'новое',
  },
  uk: {
    efnLabel: 'Практична модель — не медичне твердження',
    efnBody: 'Шлях ONDA — його рівні, етапи та мова вищих станів — це практична модель: практика і спосіб описувати суб’єктивний досвід, а не ієрархія клінічно підтверджених біологічних станів. Науково обґрунтована частина ONDA — це біофідбек ВСР і дихання в заданому ритмі: див. {science} і {measures}.',
    efnScience: 'наукову основу ONDA',
    efnMeasures: 'що вимірює ONDA',
    beforeYouBuy: 'Перед покупкою',
    baselinePromo: 'Можливо, дані у вас уже є. Наш безкоштовний інструмент {tool} читає два тижні вашого пульсу в спокої, ВСР і частоти дихання з Apple Health — діапазон, а не одне число — просто на iPhone, нічого не завантажуючи.',
    ondaTermNote: 'Це власна термінологія ONDA Life — метафора з моделі ONDA, а не усталений науковий термін.',
    ondaTermTitle: 'Власна термінологія ONDA Life, не усталений науковий термін',
    scientificTerm: 'НАУКОВИЙ ТЕРМІН',
    latest: 'нове',
  },
  zh: {
    efnLabel: '体验式框架 — 并非医学声明',
    efnBody: 'ONDA 之路——它的层级、阶段和关于更高状态的语言——是一个体验式框架：一种练习，也是一种描述主观体验的方式，而不是经临床验证的生物状态等级。ONDA 中有证据支持的部分是 HRV 生物反馈和节律呼吸——参见{science}和{measures}。',
    efnScience: 'ONDA 背后的科学',
    efnMeasures: 'ONDA 测量什么',
    beforeYouBuy: '购买之前',
    baselinePromo: '你可能已经拥有这些数据。我们的免费工具 {tool} 会在你的 iPhone 上读取你 Apple 健康中两周的静息心率、HRV 和呼吸数据——给出范围而不是单个数字——不上传任何内容。',
    ondaTermNote: '这是 ONDA Life 自己的术语——来自 ONDA 模型的比喻，并非既定的科学术语。',
    ondaTermTitle: 'ONDA Life 自己的术语，并非既定的科学术语',
    scientificTerm: '科学术语',
    latest: '最新',
  },
  de: {
    efnLabel: 'Erfahrungsmodell — keine medizinische Aussage',
    efnBody: 'Der ONDA-Weg — seine Level, Stufen und die Sprache höherer Zustände — ist ein Erfahrungsmodell: eine Praxis und eine Art, subjektives Erleben zu beschreiben, keine Hierarchie klinisch validierter biologischer Zustände. Der evidenzbasierte Teil von ONDA ist HRV-Biofeedback und geführtes Atmen — siehe {science} und {measures}.',
    efnScience: 'die Wissenschaft hinter ONDA',
    efnMeasures: 'was ONDA misst',
    beforeYouBuy: 'Vor dem Kauf',
    baselinePromo: 'Vielleicht hast du die Daten schon. Unser kostenloses Tool {tool} liest zwei Wochen deines Ruhepulses, deiner HRV und Atmung aus deiner eigenen Health-App — den Bereich, nicht eine einzelne Zahl — auf deinem iPhone, ohne etwas hochzuladen.',
    ondaTermNote: 'Dies ist eigene Terminologie von ONDA Life — eine Metapher aus dem ONDA-Modell, kein etablierter wissenschaftlicher Begriff.',
    ondaTermTitle: 'Eigene Terminologie von ONDA Life, kein etablierter wissenschaftlicher Begriff',
    scientificTerm: 'WISSENSCHAFTLICHER BEGRIFF',
    latest: 'neueste',
  },
  fr: {
    efnLabel: 'Cadre expérientiel — pas une allégation médicale',
    efnBody: 'Le Chemin ONDA — ses niveaux, ses étapes et son langage des états supérieurs — est un cadre expérientiel : une pratique et une façon de décrire l’expérience subjective, pas une hiérarchie d’états biologiques validés cliniquement. La partie d’ONDA fondée sur des preuves, c’est le biofeedback de VFC et la respiration rythmée — voir {science} et {measures}.',
    efnScience: 'la science derrière ONDA',
    efnMeasures: 'ce que mesure ONDA',
    beforeYouBuy: 'Avant d’acheter',
    baselinePromo: 'Vous avez peut-être déjà les données. Notre outil gratuit {tool} lit deux semaines de votre fréquence cardiaque au repos, de votre VFC et de votre respiration depuis votre app Santé — la plage, pas un seul chiffre — sur votre iPhone, sans rien envoyer.',
    ondaTermNote: 'Il s’agit d’une terminologie propre à ONDA Life — une métaphore issue du modèle ONDA, pas un terme scientifique établi.',
    ondaTermTitle: 'Terminologie propre à ONDA Life, pas un terme scientifique établi',
    scientificTerm: 'TERME SCIENTIFIQUE',
    latest: 'récents',
  },
  it: {
    efnLabel: 'Modello esperienziale — non un’affermazione medica',
    efnBody: 'Il Percorso ONDA — i suoi livelli, le sue fasi e il linguaggio degli stati superiori — è un modello esperienziale: una pratica e un modo di descrivere l’esperienza soggettiva, non una gerarchia di stati biologici validati clinicamente. La parte di ONDA supportata da evidenze è il biofeedback HRV e la respirazione guidata — vedi {science} e {measures}.',
    efnScience: 'la scienza dietro ONDA',
    efnMeasures: 'cosa misura ONDA',
    beforeYouBuy: 'Prima di comprare',
    baselinePromo: 'Forse hai già i dati. Il nostro strumento gratuito {tool} legge due settimane di frequenza cardiaca a riposo, HRV e respirazione dalla tua app Salute — l’intervallo, non un solo numero — sul tuo iPhone, senza caricare nulla.',
    ondaTermNote: 'Questa è terminologia propria di ONDA Life — una metafora del modello ONDA, non un termine scientifico consolidato.',
    ondaTermTitle: 'Terminologia propria di ONDA Life, non un termine scientifico consolidato',
    scientificTerm: 'TERMINE SCIENTIFICO',
    latest: 'più recenti',
  },
  nl: {
    efnLabel: 'Ervaringsmodel — geen medische claim',
    efnBody: 'Het ONDA-pad — de niveaus, fasen en de taal van hogere toestanden — is een ervaringsmodel: een praktijk en een manier om subjectieve ervaring te beschrijven, geen hiërarchie van klinisch gevalideerde biologische toestanden. Het wetenschappelijk onderbouwde deel van ONDA is HRV-biofeedback en begeleid ademen — zie {science} en {measures}.',
    efnScience: 'de wetenschap achter ONDA',
    efnMeasures: 'wat ONDA meet',
    beforeYouBuy: 'Voordat je koopt',
    baselinePromo: 'Misschien heb je de gegevens al. Onze gratis tool {tool} leest twee weken van je rusthartslag, HRV en ademhaling uit je eigen Gezondheid-app — het bereik, niet één getal — op je iPhone, zonder iets te uploaden.',
    ondaTermNote: 'Dit is eigen terminologie van ONDA Life — een metafoor uit het ONDA-model, geen gevestigde wetenschappelijke term.',
    ondaTermTitle: 'Eigen terminologie van ONDA Life, geen gevestigde wetenschappelijke term',
    scientificTerm: 'WETENSCHAPPELIJKE TERM',
    latest: 'nieuwste',
  },
  ja: {
    efnLabel: '体験的なフレームワーク — 医学的な主張ではありません',
    efnBody: 'ONDA パス——そのレベル、段階、高次の状態を表す言葉——は体験的なフレームワークです。実践であり主観的な体験を表す方法であって、臨床的に検証された生物学的状態の階層ではありません。ONDA のうちエビデンスに基づく部分は HRV バイオフィードバックと一定のリズムの呼吸です。{science}と{measures}をご覧ください。',
    efnScience: 'ONDA の科学的根拠',
    efnMeasures: 'ONDA が測定するもの',
    beforeYouBuy: '購入する前に',
    baselinePromo: 'データはすでに手元にあるかもしれません。無料ツール {tool} は、あなたのヘルスケアから安静時心拍数・HRV・呼吸数の2週間分を iPhone 上で読み取り、1つの数字ではなく範囲で示します。何もアップロードしません。',
    ondaTermNote: 'これは ONDA Life 独自の用語です。ONDA モデルの比喩であり、確立された科学用語ではありません。',
    ondaTermTitle: 'ONDA Life 独自の用語（確立された科学用語ではありません）',
    scientificTerm: '科学用語',
    latest: '最新',
  },
  pl: {
    efnLabel: 'Model doświadczeniowy — nie jest to twierdzenie medyczne',
    efnBody: 'Ścieżka ONDA — jej poziomy, etapy i język wyższych stanów — to model doświadczeniowy: praktyka i sposób opisywania subiektywnego doświadczenia, a nie hierarchia klinicznie potwierdzonych stanów biologicznych. Częścią ONDA opartą na dowodach jest biofeedback HRV i oddychanie w zadanym rytmie — zobacz {science} i {measures}.',
    efnScience: 'naukowe podstawy ONDA',
    efnMeasures: 'co mierzy ONDA',
    beforeYouBuy: 'Zanim kupisz',
    baselinePromo: 'Być może masz już te dane. Nasze darmowe narzędzie {tool} odczytuje dwa tygodnie Twojego tętna spoczynkowego, HRV i oddechu z aplikacji Zdrowie — zakres, a nie jedną liczbę — na Twoim iPhonie, bez wysyłania czegokolwiek.',
    ondaTermNote: 'To własna terminologia ONDA Life — metafora z modelu ONDA, a nie ugruntowany termin naukowy.',
    ondaTermTitle: 'Własna terminologia ONDA Life, nie ugruntowany termin naukowy',
    scientificTerm: 'TERMIN NAUKOWY',
    latest: 'najnowsze',
  },
  pt: {
    efnLabel: 'Modelo experiencial — não é uma afirmação médica',
    efnBody: 'O Caminho ONDA — seus níveis, etapas e a linguagem dos estados superiores — é um modelo experiencial: uma prática e uma forma de descrever a experiência subjetiva, não uma hierarquia de estados biológicos validados clinicamente. A parte da ONDA baseada em evidências é o biofeedback de VFC e a respiração ritmada — veja {science} e {measures}.',
    efnScience: 'a ciência por trás da ONDA',
    efnMeasures: 'o que a ONDA mede',
    beforeYouBuy: 'Antes de comprar',
    baselinePromo: 'Talvez você já tenha os dados. Nossa ferramenta gratuita {tool} lê duas semanas da sua frequência cardíaca em repouso, VFC e respiração do seu app Saúde — a faixa, não um único número — no seu iPhone, sem enviar nada.',
    ondaTermNote: 'Esta é uma terminologia própria da ONDA Life — uma metáfora do modelo ONDA, não um termo científico estabelecido.',
    ondaTermTitle: 'Terminologia própria da ONDA Life, não um termo científico estabelecido',
    scientificTerm: 'TERMO CIENTÍFICO',
    latest: 'mais recentes',
  },
}

export function ui(lang: Lang): UiStrings {
  return UI_I18N[lang] ?? UI_I18N.en
}

/** Split "... {a} ... {b} ..." into text parts around the placeholders, in order. */
export function splitAt(s: string, ...keys: string[]): string[] {
  return s.split(new RegExp(keys.map((k) => `\\{${k}\\}`).join('|')))
}
