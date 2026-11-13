---
sourceHash: 68efe2df22d2
title: "Long COVID, POTS e HRV: cosa mostrano le evidenze"
metaTitle: "Long COVID, POTS e HRV"
metaDescription: "Come long COVID e POTS si collegano alla variabilità della frequenza cardiaca, perché i dati aggregati sono incerti e perché la HRV non diagnostica il long COVID."
shortAnswer: >
  Gli studi aggregati mostrano solo una tendenza a una variabilità della
  frequenza cardiaca più bassa nelle persone con long COVID, e la maggior parte
  di questi studi ha un alto rischio di bias. Alcuni studi singoli trovano una
  HRV più bassa a riposo o nella vita quotidiana, ma i gruppi con long COVID
  differiscono, e le persone con POTS mostrano un quadro diverso da chi ha
  altri sintomi. In un piccolo studio con dispositivo indossabile, la HRV di
  giorno in giorno non seguiva i sintomi. La HRV non può diagnosticare il long
  COVID né la POTS.
keyPoints:
  - "Una meta-analisi ha trovato solo una tendenza a una HRV più bassa nel long COVID, con alta eterogeneità e alto rischio di bias nella maggior parte degli studi."
  - "In uno studio la HRV a riposo era più bassa nel long COVID, ma la risposta all’alzarsi in piedi era normale, quindi i risultati dipendono dal test."
  - "I sottogruppi di long COVID, comprese le persone con POTS, non condividono un unico quadro di alterazioni autonomiche."
  - "In uno studio con dispositivi indossabili, la HRV era più bassa nel long COVID nella vita quotidiana e nel sonno e restava più bassa per un giorno dopo uno sforzo più intenso."
  - "In un piccolo studio con dispositivo indossabile, la HRV notturna non seguiva i sintomi da un giorno all’altro, ma differiva tra persone con più e meno sintomi."
  - "I modelli che rilevano il long COVID dai dati cardiaci dei dispositivi indossabili sono strumenti di ricerca, non test diagnostici."
imageAlt: "Una sottile linea turchese del ritmo cardiaco che sale con un gradino breve e ripido e poi si assesta, accanto a una tenue freccia verso l’alto, su sfondo bianco."
evidenceMap:
  - claim: "Nell’insieme degli studi, le persone con condizione post-COVID mostravano solo una tendenza a una HRV più bassa rispetto ai controlli."
    limitation: "Le differenze aggregate non erano statisticamente significative; alta eterogeneità; la maggior parte degli studi inclusi aveva un alto rischio di bias."
  - claim: "Nel long COVID con sintomi ortostatici, la HRV a riposo era più bassa che nei controlli, ma la risposta della HRV all’alzarsi attivamente era simile."
    limitation: "Piccolo studio trasversale, molto tempo dopo l’infezione; i risultati dipendono dal misurare la HRV da sdraiati o in piedi."
  - claim: "I sottogruppi di long COVID, come persone con ipotensione ortostatica iniziale, con POTS o senza anomalie ortostatiche, mostravano quadri autonomici diversi."
    limitation: "Un solo studio trasversale con sottogruppi piccoli; soprattutto donne; misure autonomiche indirette."
  - claim: "In uno studio con dispositivi indossabili, la HRV era più bassa nel long COVID rispetto ai controlli durante le attività quotidiane e il sonno, e restava più bassa per un giorno dopo uno sforzo intorno alla prima soglia ventilatoria e oltre."
    limitation: "Osservazionale; gruppo di controllo piccolo; il legame con il malessere post-sforzo è un’interpretazione degli autori, non una regola verificata."
  - claim: "In un piccolo studio con dispositivo indossabile, la HRV notturna non mostrava associazioni significative giorno per giorno con i sintomi nella stessa persona, ma differiva tra persone con carico di sintomi maggiore e minore."
    limitation: "Quattordici persone; esplorativo; un solo dispositivo commerciale."
  - claim: "Un modello di apprendimento automatico che aggiungeva ai sintomi caratteristiche della frequenza cardiaca dei dispositivi indossabili rilevava il long COVID meglio dei soli sintomi in un set di dati di ricerca."
    limitation: "Modello di ricerca su un solo set di dati; usa caratteristiche della frequenza cardiaca, non è un test diagnostico validato; uso reale non dimostrato."
  - claim: "Durata della registrazione, contesto, respiro e metodo di analisi influenzano i valori di HRV, quindi studi con metodi diversi sono difficili da confrontare."
    limitation: "Linea guida metodologica (consenso di esperti) per le registrazioni di ricerca."
  - claim: "Un singolo valore basso di HRV non significa di per sé che una persona sia stressata o stia male; la HRV non è un marcatore specifico di uno stato (dato claim.hrvNotStress)."
    limitation: "Linea guida metodologica (consenso di esperti), non uno studio sul long COVID."
  - claim: "ONDA costruisce una baseline personale dai valori di Apple Health e confronta i nuovi valori con il corridoio proprio dell’utente (dati baseline.window, baseline.compare)."
    limitation: "Descrive solo il funzionamento dell’app; non è una prova di alcuna affermazione sulla salute."
---

## Che legame c’è tra long COVID, POTS e HRV?

La [variabilità della frequenza cardiaca](/glossary/heart-rate-variability) (HRV) è la variazione naturale del tempo tra un battito e l’altro. Il long COVID indica sintomi che durano mesi dopo un’infezione da coronavirus, spesso stanchezza, nebbia mentale e difficoltà a stare in piedi. La POTS (sindrome da tachicardia posturale ortostatica) è un quadro presente in alcune persone: la frequenza cardiaca sale molto quando ci si alza. Poiché questi problemi riguardano il sistema nervoso autonomo, è stata studiata la HRV. In breve: i risultati aggregati mostrano solo una tendenza a una HRV più bassa, e sui dettagli gli studi non concordano [S1].

Questa pagina descrive cosa hanno trovato gli studi. Non è una guida alla diagnosi o alla cura e non dà consigli su come dosare l’attività o l’allenamento.

## Come funziona?

Il sistema nervoso autonomo regola di continuo frequenza cardiaca e vasi sanguigni, per esempio quando ti alzi. Misure di HRV come [RMSSD](/science/concepts/rmssd) sono lette come riflesso di variazioni della frequenza cardiaca mediate dal nervo vago. Se un’infezione altera questo controllo, la HRV potrebbe cambiare.

Il quadro è misto. In uno studio, le persone con long COVID e capogiri all’alzarsi avevano una HRV più bassa da sdraiate, ma la loro risposta di HRV all’alzarsi era normale [S2]. Un altro studio ha trovato che i sottogruppi di long COVID differiscono: persone con POTS, persone la cui pressione cala all’alzarsi e persone senza questo problema mostravano quadri autonomici diversi [S3]. Quindi il «long COVID» non è un’unica condizione autonomica.

## Come si misura?

Alcuni studi registrano la HRV in ambulatorio, da sdraiati e poi in piedi [S2, S3]. Altri usano dispositivi indossabili per giorni o settimane nella vita quotidiana e nel sonno [S4, S5]. Misurano cose diverse, e i risultati dipendono dal test. Durata della registrazione, contesto, respiro e analisi influenzano i valori di HRV, rendendo gli studi difficili da confrontare [S7].

## Cosa la influenza?

Stanchezza, sonno scarso, minore attività, forma fisica persa durante la malattia, farmaci e respiro cambiano la HRV, e sono tutti frequenti nel long COVID [S4, S5, S7]. Per questo è difficile dire quanta parte di una HRV più bassa dipenda dalla condizione in sé. I cambiamenti durante e dopo un’infezione sono spiegati in [Malattia e HRV](/science/mechanisms/illness-and-hrv).

## Cosa mostrano le evidenze?

**Studi aggregati — dipende dal contesto, solo una tendenza.** Una meta-analisi di studi che confrontavano persone con condizione post-COVID e controlli sani ha trovato una tendenza a una HRV più bassa, non statisticamente significativa, con alta eterogeneità e alto rischio di bias nella maggior parte degli studi [S1]. Gli autori parlano di una possibile associazione.

**Studi singoli — dipende dal contesto.** In un gruppo con long COVID la HRV a riposo era più bassa, ma la risposta all’alzarsi era normale [S2]. In un altro studio i sottogruppi di long COVID, comprese le persone con POTS, mostravano quadri diversi [S3].

**Vita quotidiana e sforzo — emergente.** In uno studio con dispositivi indossabili, la HRV era più bassa nel long COVID rispetto ai controlli durante le attività quotidiane e il sonno, e restava più bassa per un giorno dopo uno sforzo intorno alla prima soglia ventilatoria e oltre, l’intensità a cui il respiro inizia ad accelerare più rapidamente [S4]. Gli autori lo collegano al malessere post-sforzo, ma è una loro interpretazione.

**Monitoraggio giorno per giorno — emergente.** In un piccolo studio con dispositivo indossabile, la HRV notturna non seguiva i sintomi da un giorno all’altro nella stessa persona; differiva soprattutto tra persone con carico di sintomi maggiore e minore [S5].

**Modelli di rilevamento — fase di ricerca.** Un modello di apprendimento automatico che aggiungeva ai sintomi caratteristiche della frequenza cardiaca dei dispositivi indossabili rilevava il long COVID meglio dei soli sintomi in un set di dati di ricerca [S6]. Non è un test diagnostico validato.

**Sconosciuto.** Se la HRV possa diagnosticare il long COVID o la POTS, orientare la terapia o prevedere chi guarirà.

## Cosa non ti dice

- **Non è una diagnosi.** Nessun valore di HRV indica se qualcuno ha il long COVID o la POTS; la POTS viene diagnosticata da un medico con un test in piedi [S1, S3].
- **Non è un misuratore quotidiano dei sintomi.** In un piccolo studio, la HRV notturna non seguiva i sintomi da un giorno all’altro [S5].
- **Non è una prescrizione di esercizio.** I dati sulla HRV dopo uno sforzo più intenso sono osservazionali e non sono una regola verificata per dosare l’attività [S4].
- **Non parla di una sola notte.** {{fact:claim.hrvNotStress}} [S7].
- **Quando chiedere aiuto.** Se i sintomi durano settimane dopo un’infezione, o quando ti alzi senti di stare per svenire, hai dolore al petto o il cuore che corre, rivolgiti a un medico.

## In ONDA

ONDA costruisce una baseline personale dai valori salvati in Apple Health [S8]. La finestra è di {{fact:baseline.window}}, e {{fact:baseline.compare}}. Un valore fuori dal tuo corridoio descrive un cambiamento nei tuoi dati, non la sua causa. ONDA non diagnostica il long COVID né la POTS e non sostituisce un medico.

> Informazioni a scopo educativo, non una diagnosi né un trattamento medico.
