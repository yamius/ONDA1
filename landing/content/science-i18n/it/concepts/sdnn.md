---
sourceHash: "f848794fbee9"
title: "SDNN: cosa misura questa metrica dell'HRV e cosa no"
metaTitle: "SDNN: definizione, significato e il caso Apple"
metaDescription: "Lo SDNN è la metrica dell'HRV che Apple Health memorizza. Cosa misura, in cosa differisce dall'RMSSD e perché i due numeri non si possono confrontare."
shortAnswer: >
  Lo SDNN è una metrica della variabilità della frequenza cardiaca: la
  deviazione standard degli intervalli tra battiti normali. Serve a riassumere
  la dispersione complessiva del ritmo cardiaco in una registrazione e cresce
  con la durata della registrazione, quindi i valori di dispositivi, app e
  modalità di registrazione diversi non sono direttamente confrontabili. È la
  metrica che memorizza Apple Health. Da solo non stabilisce lo stress, lo
  stato di salute né l'equilibrio autonomico.
keyPoints:
  - "Lo SDNN riassume la dispersione complessiva degli intervalli tra battiti normali all'interno di una registrazione."
  - "Riflette la variabilità totale: vi contribuiscono entrambe le branche del sistema nervoso autonomo e i ritmi più lenti."
  - "Lo SDNN dipende dalla durata della registrazione, quindi le brevi letture di laboratorio, i valori Holter di ventiquattro ore e i numeri notturni di un orologio non sono intercambiabili."
  - "Apple Health memorizza l'HRV come SDNN: per questo i numeri di Apple Watch non si possono confrontare direttamente con i valori RMSSD di altri dispositivi indossabili."
  - "I dispositivi indossabili stimano lo SDNN dal segnale del polso, e la concordanza con l'ECG dipende dal dispositivo e dalle condizioni."
  - "Un singolo valore di SDNN non è una diagnosi né una misura dello stress; la tua tendenza in condizioni confrontabili è più informativa."
imageAlt: "Una fila di intervalli tra battiti di lunghezza variabile sopra una distribuzione a punti di quegli stessi intervalli, con una parentesi verde acqua che ne segna la dispersione attorno alla media: l'idea che lo SDNN riassume."
evidenceMap:
  - claim: "Lo SDNN è la deviazione standard degli intervalli tra battiti normali in una registrazione."
    limitation: "Uno standard definitorio e metodologico; da solo non dice nulla sullo stato di salute."
  - claim: "Normale significa che i battiti anomali ed ectopici vengono rimossi prima di calcolare la statistica."
    limitation: "Descrive la pulizia dei dati; quanto rigidamente vengano filtrati i battiti varia tra algoritmi e dispositivi."
  - claim: "Lo SDNN riflette tutte le componenti cicliche responsabili della variabilità durante la registrazione; riassume la variabilità totale e non una sola branca del sistema nervoso autonomo."
    limitation: "Una proprietà della statistica; la combinazione di ritmi cambia con la durata e con le condizioni della registrazione."
  - claim: "Lo SDNN dipende dalla durata della registrazione: le registrazioni più lunghe includono ritmi più lenti e producono valori più alti, quindi i valori di SDNN di registrazioni di durata diversa non si possono confrontare."
    limitation: "Una proprietà metodologica della metrica; riguarda ogni confronto tra app, studi e protocolli."
  - claim: "I valori normativi dell'HRV di ventiquattro ore, a breve termine e ultrabrevi non sono intercambiabili."
    limitation: "Riguarda i valori normativi in popolazioni sane e cliniche; i valori notturni dei dispositivi di consumo sono un contesto ancora diverso."
  - claim: "Entrambe le branche del sistema nervoso autonomo contribuiscono allo SDNN, che è fortemente correlato alle bande di frequenza più lente e alla potenza totale."
    limitation: "Ragionamento fisiologico a livello di popolazione; il peso dei contributi cambia con le condizioni di registrazione."
  - claim: "Le registrazioni più lunghe includono ritmi più lenti (carichi di lavoro che cambiano, condizionamento e processi circadiani), ciascuno dei quali si somma alla dispersione."
    limitation: "Spiega perché conta la durata della finestra, non cosa dica di una persona una singola finestra."
  - claim: "L'RMSSD è più influenzato dello SDNN dalla branca parasimpatica, ed è per questo che le due metriche possono muoversi in modo diverso."
    limitation: "Un confronto relativo tra metriche, non una misura dell'attività parasimpatica in nessuna delle due."
  - claim: "Il tono vagale non si può misurare direttamente, e l'HRV non è un marcatore specifico dell'attività simpatica né dell'equilibrio simpatico-vagale."
    limitation: "Una cautela metodologica tratta da linee guida e revisioni; i valori di SDNN non si traducono in letture autonomiche."
  - claim: "In cardiologia clinica, lo SDNN calcolato da registrazioni ECG di ventiquattro ore è una misura di stratificazione del rischio in popolazioni di pazienti."
    limitation: "Popolazioni cliniche con ECG ospedaliero continuo; non si trasferisce ai valori di un orologio di consumo."
  - claim: "Nelle brevi registrazioni a riposo, la fonte dominante della variazione dello SDNN è l'oscillazione della frequenza cardiaca legata al respiro."
    limitation: "Vale per la finestra di registrazione; è un'osservazione di misura, non la prova di un cambiamento duraturo."
  - claim: "Le stime dell'HRV basate sulla fotopletismografia (PPG) dei dispositivi indossabili concordano con i valori derivati dall'ECG in alcune condizioni e divergono in altre; le stime aggregate non dimostrano l'intercambiabilità."
    limitation: "La concordanza dipende da metrica, dispositivo e condizioni; questa pagina non riporta valori di accuratezza."
  - claim: "In condizioni di riposo controllate, la PPG al polso può riprodurre da vicino gli indici di HRV derivati dall'ECG, mentre la validazione nella vita reale resta limitata."
    limitation: "Validazione di un solo dispositivo in adulti a riposo con ritmo sinusale; non è un'affermazione generale sull'accuratezza degli orologi di consumo."
  - claim: "Apple Health registra l'HRV come SDNN, calcolata come deviazione standard degli intervalli tra battiti normali e registrata automaticamente da Apple Watch."
    limitation: "Documentazione ufficiale; descrive cosa registra il sistema, non cosa significhino i valori per la salute; limitata all'ecosistema Apple."
  - claim: "I modelli recenti di Apple Watch con watchOS mostrano due varianti di HRV, Recovery HRV e Overall HRV, e misurano l'HRV anche ogni cinque minuti."
    limitation: "Annuncio del produttore; limitato a specifici hardware e versioni del sistema operativo; Apple non ha spiegato come si calcola Recovery HRV."
  - claim: "iOS e watchOS aggiungono ad Apple Health un tipo di dato RMSSD."
    limitation: "Documentazione ufficiale; disponibilità limitata a specifiche versioni del sistema operativo; cosa registrino le app con questo tipo dipende da ciascuna app."
  - claim: "In media la variabilità della frequenza cardiaca diminuisce con l'età negli adulti sani, mentre le differenze tra individui sono ampie."
    limitation: "Medie trasversali di popolazione; ampia variazione individuale a ogni età; questa pagina non riporta tabelle per età."
  - claim: "La durata della registrazione, il contesto, il respiro e il metodo di analisi modellano il valore e il rigore della sua interpretazione."
    limitation: "Consenso di esperti sui metodi; l'entità di ciascun effetto dipende dalle condizioni e dalla persona."
  - claim: "Le singole letture richiedono un'interpretazione cauta e contestualizzata, non una lettura isolata."
    limitation: "Consenso di esperti sulla pratica interpretativa, non dati sperimentali diretti; l'estensione pratica è il confronto con la tua tendenza in condizioni confrontabili."
  - claim: "Battiti anomali e rumore possono travestirsi da variabilità e gonfiare il valore."
    limitation: "Una cautela sulla qualità dei dati; la gestione degli artefatti varia tra dispositivi e algoritmi."
---

## Che cos'è lo SDNN?

Lo SDNN è una delle misure standard della [variabilità della frequenza cardiaca](/glossary/heart-rate-variability) (HRV), cioè la naturale variazione del tempo tra battiti consecutivi. Gli standard di misura del settore lo definiscono con precisione. {{fact:hrv.sdnn.definition}} [S1]. La sigla «NN» nel nome significa da normale a normale: contano solo gli intervalli tra battiti normali, e i battiti anomali vengono rimossi prima di calcolare la statistica [S2].

In parole semplici: raccogli tutti gli intervalli tra battiti normali adiacenti in una registrazione, guarda quanto sono dispersi attorno alla loro media ed esprimi questa dispersione con un unico valore in millisecondi. Un valore più alto significa che, nel complesso, il ritmo è variato di più in quella finestra.

Viene confrontato più spesso con una seconda metrica nel dominio del tempo. {{fact:hrv.rmssd.definition}} [S1]. Le due rispondono a domande diverse: l'RMSSD isola i cambiamenti tra battiti adiacenti, mentre lo SDNN riassume la dispersione dell'intera registrazione. Questa differenza è il motivo per cui i valori di SDNN e RMSSD non si possono confrontare direttamente, ed è anche il motivo per cui esistono entrambe le metriche. La [pagina sull'RMSSD](/science/concepts/rmssd) tratta il lato da battito a battito della coppia; questa pagina riguarda la dispersione.

## Come funziona lo SDNN?

Lo SDNN è una statistica di finestra: tutto ciò che muove il ritmo del cuore durante la registrazione vi contribuisce. In una breve registrazione a riposo, il contributo dominante è l'aumento e la diminuzione della frequenza cardiaca legati al respiro, l'aritmia sinusale respiratoria: per questo una respirazione lenta e calma durante la misura alza visibilmente il valore [S2]. Nelle registrazioni più lunghe si aggiungono ritmi più lenti: carichi di lavoro che cambiano, risposte condizionate e il ciclo sonno-veglia aggiungono ciascuno il proprio contributo alla dispersione [S2].

Poiché tante influenze confluiscono in un solo numero, lo SDNN non separa le due branche del sistema nervoso autonomo: vi contribuiscono entrambe [S2]. È anche il motivo per cui non può essere letto come misura diretta dell'una o dell'altra. Il modo di inquadrarlo conta. {{fact:claim.vagalTone}} [S2, S7]. L'RMSSD, costruito dalle differenze tra battiti adiacenti, dipende più dello SDNN dalla rapida via parasimpatica [S2]: uno dei motivi per cui le due metriche possono raccontare storie diverse sulla stessa registrazione.

La versione lunga della metrica ha una storia clinica: calcolato su registrazioni ECG ospedaliere di ventiquattro ore in pazienti cardiologici, lo SDNN è una misura di stratificazione del rischio [S2]. Queste prove appartengono a una modalità di misura, l'ECG clinico continuo in popolazioni di pazienti, che un orologio di consumo non riproduce, quindi non vanno proiettate sul valore notturno di un orologio.

## Come si misura lo SDNN?

Il calcolo è semplice: si prendono gli intervalli tra battiti normali all'interno della finestra di registrazione e se ne calcola la deviazione standard [S1, S2]. Tutto ciò che lo SDNN sa viene dall'accuratezza di quegli intervalli: per questo il metodo di registrazione conta più dell'aritmetica.

Il metodo di riferimento è l'ECG, che rileva la traccia elettrica di ogni battito. I dispositivi indossabili (wearable) stimano invece gli intervalli dal segnale del polso sulla pelle (fotopletismografia, PPG); il risultato viene spesso chiamato variabilità del polso (PRV). La concordanza tra i due dipende dalla metrica e dalle condizioni: in genere è migliore a riposo e con un buon segnale, peggiore con il movimento o un contatto scarso [S5, S6], e finora le prove aggregate non si estendono al sonno né alla vita di tutti i giorni [S5].

La durata della registrazione fa parte del significato del valore. Una breve registrazione in laboratorio, un ECG Holter di ventiquattro ore e i campioni memorizzati da un orologio sono tre modalità di misura diverse: lo SDNN cresce con la durata della registrazione, e i valori di modalità diverse non sono intercambiabili [S2]. Per lo stesso motivo le norme pubblicate per registrazioni di ventiquattro ore, a breve termine e ultrabrevi sono trattate come mondi separati [S2].

Qui entra in gioco Apple. Una conseguenza pratica per chi usa Apple Watch. {{fact:applewatch.hrv.healthkit}} [S8]. Si tratta di una scelta progettuale, non di un verdetto scientifico su quale metrica sia migliore: lo SDNN è il calcolo che HealthKit usa da sempre, descritto nella documentazione come la deviazione standard degli intervalli tra battiti normali, registrata automaticamente dall'orologio [S8]. Sull'hardware recente, {{fact:applewatch.hrv.variants2026}} [S9]. Apple non ha spiegato come si calcola Recovery HRV. Inoltre {{fact:applewatch.hrv.rmssdType}} [S10], il che permette alle app di leggere da Apple Health anche un valore di tipo RMSSD: un passo verso confronti più puliti tra dispositivi, anche se i valori già raccolti restano SDNN.

Per orientarti: il [calcolatore HRV](/tools/hrv) ha una modalità SDNN pensata per i numeri che vengono da Apple Watch; la spiegazione quotidiana del perché i dispositivi non concordano si trova in [perché la tua HRV è diversa su ogni dispositivo](/articles/hrv-different-every-device); e per mantenere confrontabili le tue letture, vedi [come misurare l'HRV in modo coerente](/articles/how-to-measure-hrv-consistently).

## Cosa influenza lo SDNN?

- La durata della registrazione. È il fattore che definisce questa metrica: le finestre più lunghe accumulano ritmi più lenti e valori più alti, quindi una lettura breve e una registrazione di ventiquattro ore descrivono mondi diversi [S2].
- Le condizioni di registrazione. La durata della registrazione, il contesto (laboratorio o vita reale), il respiro e il metodo di analisi modellano il valore e il rigore di qualsiasi confronto [S7].
- L'età. In media la variabilità della frequenza cardiaca diminuisce con l'età negli adulti sani [S4]; le differenze tra individui sono ampie, e le medie della popolazione non sono obiettivi personali. Le tabelle per fasce d'età si trovano nel [calcolatore HRV](/tools/hrv) per i valori SDNN di Apple Watch e nell'articolo sulla [HRV normale per età](/articles/normal-hrv-by-age) per l'RMSSD notturno.
- Il respiro. La frequenza e la profondità del respiro durante la registrazione cambiano il valore, attraverso l'oscillazione legata al respiro che imprimono nel ritmo [S2].
- La qualità del segnale. Battiti mancati o falsi distorcono il valore, e i battiti anomali possono travestirsi da variabilità [S2].
- Le condizioni quotidiane. Come per le altre metriche di HRV, una singola lettura può discostarsi per ragioni ordinarie; considera questi scostamenti come osservazioni, non come verdetti.

## Cosa mostrano le prove?

Accertato. La definizione, il calcolo e il ruolo dello SDNN come misura della variabilità complessiva vengono dagli standard di misura del settore [S1] e dalle revisioni metodologiche [S2, S3]. La dipendenza dalla durata della registrazione è una proprietà metodologica centrale, non una sfumatura [S2]. In cardiologia clinica, lo SDNN di ventiquattro ore da ECG continuo è una misura consolidata di stratificazione del rischio in popolazioni di pazienti [S2]. In media i valori diminuiscono con l'età negli adulti sani, con ampie differenze individuali [S4].

Dipende dal contesto. Stime dei dispositivi indossabili: i valori derivati dalla PPG possono seguire da vicino l'HRV derivata dall'ECG in condizioni di riposo controllate, ma la concordanza peggiora con il movimento e con un segnale scarso, e le stime aggregate non si generalizzano al sonno né alla vita di tutti i giorni [S5, S6]. L'ecosistema Apple memorizza l'HRV come SDNN: un dato sul dispositivo con un ambito preciso, non un'affermazione sulla salute [S8, S9, S10].

Linee guida / consenso di esperti. Le linee guida attuali raccomandano condizioni di registrazione coerenti e un'interpretazione cauta e contestualizzata dei singoli valori, anche quelli dei dispositivi indossabili [S7]. Si tratta di un consenso di esperti su come misurare e interpretare, non di dati sperimentali diretti sullo SDNN in sé.

Cosa resta incerto: quanto fedelmente i valori notturni di tipo SDNN dei dispositivi di consumo seguano lo SDNN derivato dall'ECG nelle condizioni di tutti i giorni (movimento, colore della pelle, aderenza del sensore, fasi del sonno) è ancora in corso di studio [S5, S6]. Ed è una questione aperta quanto delle prove cliniche di ventiquattro ore, costruite su ECG continui in pazienti, si trasferisca ai valori notturni di un orologio nelle persone sane [S7].

## Cosa lo SDNN non ti dice

- Non è intercambiabile con l'RMSSD. Le due metriche riassumono proprietà diverse della stessa registrazione, e i loro valori appartengono a modalità di registrazione diverse; lo SDNN di un orologio e l'RMSSD di un anello non sono due dialetti dello stesso numero [S2, S5].
- Non è un misuratore del tono vagale. {{fact:claim.vagalTone}} [S2, S7]. Lo SDNN dipende dalla rapida via parasimpatica ancora meno dell'RMSSD [S2].
- Non è una diagnosi né una misura dello stress. {{fact:claim.hrvNotStress}} [S1].
- Più alto non significa automaticamente meglio. Una dispersione maggiore può venire da un ritmo più ampio, oppure da battiti anomali e rumore, che si travestono da variabilità e gonfiano il numero [S2].
- I valori non sono intercambiabili tra dispositivi, app e modalità di misura [S5, S7].
- Un singolo valore dice poco. Le indicazioni metodologiche considerano le singole letture dipendenti dal contesto e raccomandano un'interpretazione cauta e contestualizzata [S7]; le tue letture recenti in condizioni confrontabili sono il termine di paragone più informativo.

## In ONDA

Le tabelle dell'HRV per età di ONDA sono tabelle dell'RMSSD notturno, ma il [calcolatore HRV](/tools/hrv) ha una modalità SDNN separata per i numeri che vengono da Apple Watch, con fasce tratte da studi su brevi ECG a riposo in adulti sani. La baseline personale notturna dell'app si basa sui valori di HRV memorizzati in Apple Health, da Apple Watch o da un altro dispositivo che vi sincronizza i dati cardiaci. La documentazione è chiara su questo punto. {{fact:applewatch.hrv.healthkit}} [S8], quindi quel segnale di base si fonda sullo SDNN e non sull'RMSSD. La lettura in tempo reale mostrata durante una pratica è un indicatore surrogato calcolato dalla deviazione standard della frequenza cardiaca, non SDNN né RMSSD, e la fotocamera del telefono rileva il polso, non l'HRV. ONDA descrive e confronta i tuoi numeri; non diagnostica nulla. Vedi [cosa misura ONDA](/measurements).

> Informazioni a scopo educativo, non una diagnosi né un trattamento medico.
