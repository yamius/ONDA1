/**
 * "Safety first" block for mouth-tape / nasal-breathing reviews, round-up and
 * head-to-heads (MouthTapeSafetyBlock). ONE source per language; mirrors the
 * Safety section of content/science/evidence/nasal-breathing.md.
 * `tape*` items are shown only for mouth tape; the dilator variant shows
 * `apnea` + `stop`.
 */
import type { Lang } from '../i18n'

export interface MouthTapeSafetyCopy {
  title: string
  /** Tape only: blocked nose. */
  nose: string
  /** Both variants: possible sleep apnea → doctor first. */
  apnea: string
  /** Tape only. */
  alcohol: string
  /** Tape only. */
  children: string
  /** Tape only. */
  sick: string
  /** Both variants. */
  stop: string
  link: string
}

export const MOUTH_TAPE_SAFETY: Record<Lang, MouthTapeSafetyCopy> = {
  en: {
    title: 'Safety first',
    nose: 'Do not tape your mouth if you cannot breathe freely through your nose — for example with a cold, allergies, nasal polyps or a deviated septum. There is a risk of suffocation.',
    apnea: 'Possible sleep apnea (loud snoring, gasping or choking at night, breathing pauses noticed by a partner, daytime sleepiness)? See a doctor first: mouth tape and nasal dilators can quieten snoring and hide the warning sign without treating the cause.',
    alcohol: 'Not after alcohol or sleeping pills.',
    children: 'Not for children, unless a doctor advises it.',
    sick: 'Not if you feel sick, might vomit or have reflux at night.',
    stop: 'Stop and see a doctor if you wake breathless, panicky or with a headache.',
    link: 'What the evidence shows — and the risks →',
  },
  es: {
    title: 'Primero, la seguridad',
    nose: 'No te tapes la boca si no puedes respirar libremente por la nariz, por ejemplo con un resfriado, alergia, pólipos nasales o el tabique desviado. Hay riesgo de asfixia.',
    apnea: '¿Posible apnea del sueño (ronquidos fuertes, jadeos o atragantamiento por la noche, pausas en la respiración que nota tu pareja, somnolencia durante el día)? Consulta primero a un médico: la cinta bucal y los dilatadores nasales pueden atenuar los ronquidos y ocultar la señal de alarma sin tratar la causa.',
    alcohol: 'No después de beber alcohol ni de tomar somníferos.',
    children: 'No en niños, salvo que lo indique un médico.',
    sick: 'No si tienes náuseas, podrías vomitar o tienes reflujo por la noche.',
    stop: 'Deja de usarla y consulta a un médico si te despiertas con falta de aire, angustia o dolor de cabeza.',
    link: 'Qué muestra la evidencia y cuáles son los riesgos →',
  },
  ru: {
    title: 'Сначала безопасность',
    nose: 'Не заклеивайте рот, если не можете свободно дышать носом — например, при насморке, аллергии, полипах в носу или искривлённой перегородке. Есть риск удушья.',
    apnea: 'Возможно апноэ сна (громкий храп, ночные всхлипы или удушье, остановки дыхания, которые замечает партнёр, дневная сонливость)? Сначала к врачу: лента для рта и носовые расширители могут сделать храп тише и скрыть тревожный признак, не устраняя причину.',
    alcohol: 'Не после алкоголя или снотворного.',
    children: 'Не для детей, если только этого не советует врач.',
    sick: 'Не при тошноте, возможной рвоте или ночном рефлюксе.',
    stop: 'Прекратите и обратитесь к врачу, если просыпаетесь с нехваткой воздуха, паникой или головной болью.',
    link: 'Что показывают исследования — и какие есть риски →',
  },
  uk: {
    title: 'Спершу безпека',
    nose: 'Не заклеюйте рот, якщо не можете вільно дихати носом — наприклад, під час нежитю, алергії, при поліпах у носі чи викривленій перегородці. Є ризик задухи.',
    apnea: 'Можливе апное сну (гучне хропіння, нічні схлипи чи задуха, зупинки дихання, які помічає партнер, денна сонливість)? Спершу до лікаря: стрічка для рота й носові розширювачі можуть зробити хропіння тихішим і приховати тривожну ознаку, не усуваючи причини.',
    alcohol: 'Не після алкоголю чи снодійного.',
    children: 'Не для дітей, хіба що так радить лікар.',
    sick: 'Не тоді, коли нудить, можливе блювання або є нічний рефлюкс.',
    stop: 'Припиніть і зверніться до лікаря, якщо прокидаєтеся з нестачею повітря, панікою чи головним болем.',
    link: 'Що показують дослідження — і які є ризики →',
  },
  zh: {
    title: '安全第一',
    nose: '如果鼻子不能顺畅呼吸——例如感冒、过敏、鼻息肉或鼻中隔偏曲——不要封口睡觉。有窒息风险。',
    apnea: '可能有睡眠呼吸暂停（鼾声很响、夜里喘不过气或憋醒、伴侣注意到呼吸暂停、白天嗜睡）？请先看医生：封口胶带和鼻扩张器可能让鼾声变小，掩盖这一警示信号，却没有治疗病因。',
    alcohol: '饮酒或服用安眠药后不要使用。',
    children: '儿童不要使用，除非医生建议。',
    sick: '感到恶心、可能呕吐或夜间有反流时不要使用。',
    stop: '如果醒来时呼吸困难、惊慌或头痛，请停止使用并咨询医生。',
    link: '证据显示了什么——以及有哪些风险 →',
  },
  de: {
    title: 'Sicherheit zuerst',
    nose: 'Kleben Sie den Mund nicht zu, wenn Sie nicht frei durch die Nase atmen können – etwa bei Erkältung, Allergie, Nasenpolypen oder schiefer Nasenscheidewand. Es besteht Erstickungsgefahr.',
    apnea: 'Mögliche Schlafapnoe (lautes Schnarchen, nächtliches Nach-Luft-Schnappen oder Würgen, Atemaussetzer, die dem Partner auffallen, Tagesmüdigkeit)? Zuerst zum Arzt: Mundtape und Nasendilatatoren können das Schnarchen leiser machen und so das Warnzeichen verdecken, ohne die Ursache zu behandeln.',
    alcohol: 'Nicht nach Alkohol oder Schlaftabletten.',
    children: 'Nicht bei Kindern, außer auf ärztlichen Rat.',
    sick: 'Nicht bei Übelkeit, möglichem Erbrechen oder nächtlichem Reflux.',
    stop: 'Hören Sie auf und gehen Sie zum Arzt, wenn Sie atemlos, panisch oder mit Kopfschmerzen aufwachen.',
    link: 'Was die Studienlage zeigt – und die Risiken →',
  },
  fr: {
    title: 'La sécurité d’abord',
    nose: 'Ne vous scotchez pas la bouche si vous ne pouvez pas respirer librement par le nez, par exemple en cas de rhume, d’allergie, de polypes nasaux ou de cloison nasale déviée. Il y a un risque d’étouffement.',
    apnea: 'Apnée du sommeil possible (ronflement fort, suffocations ou étouffements la nuit, pauses respiratoires remarquées par votre partenaire, somnolence dans la journée) ? Consultez d’abord un médecin : le tape buccal et les dilatateurs nasaux peuvent atténuer le ronflement et masquer ce signal d’alerte sans traiter la cause.',
    alcohol: 'Pas après de l’alcool ou des somnifères.',
    children: 'Pas chez l’enfant, sauf avis médical.',
    sick: 'Pas si vous avez la nausée, risquez de vomir ou avez du reflux la nuit.',
    stop: 'Arrêtez et consultez un médecin si vous vous réveillez essoufflé, paniqué ou avec un mal de tête.',
    link: 'Ce que montrent les données — et les risques →',
  },
  it: {
    title: 'Prima di tutto, la sicurezza',
    nose: 'Non chiudere la bocca con il nastro se non riesci a respirare liberamente dal naso, per esempio con raffreddore, allergia, polipi nasali o setto deviato. C’è rischio di soffocamento.',
    apnea: 'Possibile apnea notturna (russamento forte, risvegli con affanno o soffocamento, pause del respiro notate dal partner, sonnolenza di giorno)? Prima vai dal medico: il nastro per la bocca e i dilatatori nasali possono attenuare il russamento e nascondere il segnale d’allarme senza curarne la causa.',
    alcohol: 'Non dopo alcol o sonniferi.',
    children: 'Non nei bambini, salvo indicazione del medico.',
    sick: 'Non se hai nausea, potresti vomitare o soffri di reflusso notturno.',
    stop: 'Smetti e rivolgiti a un medico se ti svegli senza fiato, in preda al panico o con mal di testa.',
    link: 'Cosa mostrano le evidenze — e quali sono i rischi →',
  },
  pt: {
    title: 'Segurança em primeiro lugar',
    nose: 'Não feche a boca com fita se não consegue respirar livremente pelo nariz, por exemplo com constipação, alergia, pólipos nasais ou desvio de septo. Há risco de asfixia.',
    apnea: 'Possível apneia do sono (ressonar alto, engasgos ou sufoco durante a noite, pausas na respiração notadas pelo parceiro, sonolência durante o dia)? Consulte primeiro um médico: a fita bucal e os dilatadores nasais podem reduzir o ressonar e esconder o sinal de alerta sem tratar a causa.',
    alcohol: 'Não depois de álcool ou comprimidos para dormir.',
    children: 'Não em crianças, salvo indicação médica.',
    sick: 'Não se tiver náuseas, puder vomitar ou tiver refluxo à noite.',
    stop: 'Pare e consulte um médico se acordar sem ar, em pânico ou com dor de cabeça.',
    link: 'O que mostra a evidência — e quais são os riscos →',
  },
  nl: {
    title: 'Veiligheid eerst',
    nose: 'Plak je mond niet af als je niet vrij door je neus kunt ademen, bijvoorbeeld bij een verkoudheid, allergie, neuspoliepen of een scheef neustussenschot. Er is risico op verstikking.',
    apnea: 'Mogelijk slaapapneu (luid snurken, ’s nachts naar adem happen of stikken, ademstops die je partner opmerkt, slaperigheid overdag)? Ga eerst naar een arts: mondtape en neusdilatatoren kunnen snurken stiller maken en zo het waarschuwingssignaal verbergen zonder de oorzaak te behandelen.',
    alcohol: 'Niet na alcohol of slaappillen.',
    children: 'Niet bij kinderen, tenzij een arts het adviseert.',
    sick: 'Niet als je misselijk bent, misschien moet overgeven of ’s nachts reflux hebt.',
    stop: 'Stop en ga naar een arts als je benauwd, in paniek of met hoofdpijn wakker wordt.',
    link: 'Wat het bewijs laat zien — en de risico’s →',
  },
  pl: {
    title: 'Najpierw bezpieczeństwo',
    nose: 'Nie zaklejaj ust, jeśli nie możesz swobodnie oddychać przez nos — na przykład przy przeziębieniu, alergii, polipach nosa lub skrzywionej przegrodzie. Grozi to uduszeniem.',
    apnea: 'Możliwy bezdech senny (głośne chrapanie, nocne łapanie powietrza lub dławienie się, przerwy w oddychaniu zauważone przez partnera, senność w ciągu dnia)? Najpierw idź do lekarza: taśma na usta i rozszerzacze nosa mogą wyciszyć chrapanie i ukryć ten sygnał ostrzegawczy, nie lecząc przyczyny.',
    alcohol: 'Nie po alkoholu ani tabletkach nasennych.',
    children: 'Nie u dzieci, chyba że zaleci to lekarz.',
    sick: 'Nie, gdy masz mdłości, możesz wymiotować lub masz nocny refluks.',
    stop: 'Przerwij i skonsultuj się z lekarzem, jeśli budzisz się z dusznością, w panice lub z bólem głowy.',
    link: 'Co pokazują badania — i jakie są ryzyka →',
  },
  ja: {
    title: '安全を最優先に',
    nose: '鼻で楽に呼吸できないとき（風邪、アレルギー、鼻ポリープ、鼻中隔弯曲など）は口にテープを貼らないでください。窒息のおそれがあります。',
    apnea: '睡眠時無呼吸の可能性（大きないびき、夜間にあえぐ・むせる、パートナーが気づく呼吸の停止、日中の眠気）がある場合は、まず医師に相談してください。口テープや鼻腔拡張器はいびきを静かにして、原因を治療しないまま警告サインを隠してしまうことがあります。',
    alcohol: '飲酒後や睡眠薬の服用後は使わないでください。',
    children: '医師の指示がない限り、子どもには使わないでください。',
    sick: '吐き気がある、吐くかもしれない、夜間に逆流がある場合は使わないでください。',
    stop: '息苦しさ、パニック、頭痛で目が覚めたら使用をやめ、医師に相談してください。',
    link: 'エビデンスが示すこと、そしてリスク →',
  },
}
