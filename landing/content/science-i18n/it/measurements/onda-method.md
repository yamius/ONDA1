---
sourceHash: "fed00e9a1b1b"
title: "Come ONDA misura e interpreta i segnali del tuo corpo"
metaTitle: "Come ONDA misura e legge i segnali del tuo corpo"
metaDescription: "Da dove ONDA prende i dati, come costruisce baseline e segnali personali, cosa resta sul telefono e i limiti di ogni numero che mostra."
shortAnswer: >
  ONDA legge da Apple Health la variabilità della frequenza cardiaca, la
  frequenza cardiaca a riposo e la frequenza respiratoria, e può rilevare il
  polso dal polpastrello con la fotocamera dell'iPhone. Costruisce un corridoio
  personale dalle tue notti e indica le notti che ne restano chiaramente fuori.
  Sono confronti descrittivi, non una diagnosi. ONDA non ha condotto studi
  propri sull'accuratezza o sull'efficacia, e i suoi numeri valgono quanto il
  dispositivo che li ha registrati.
keyPoints:
  - "ONDA legge da Apple Health la variabilità della frequenza cardiaca come SDNN, la frequenza cardiaca a riposo e la frequenza respiratoria, scritte da Apple Watch o da un altro dispositivo che vi si sincronizza; si limita a leggere, non scrive mai."
  - "La fotocamera dell'iPhone fornisce una lettura del polso e una stima del respiro, non la variabilità della frequenza cardiaca, e il punteggio di coerenza in tempo reale non funziona con la fotocamera."
  - "La baseline e i segnali ti confrontano con le tue notti recenti, mai con una norma di popolazione, e restano in silenzio finché le notti non sono abbastanza."
  - "Un segnale richiede un cambiamento ampio, misurato sulla tua dispersione personale, e una variazione minima assoluta o relativa: le piccole oscillazioni vengono ignorate."
  - "Baseline, segnali e report si calcolano sul telefono. A partire dalla versione 1.9.3, i progressi delle pratiche restano sul dispositivo senza un account e si sincronizzano solo dopo l'accesso, e il diario resta solo sul dispositivo."
  - "ONDA non è un dispositivo medico, non ha studi propri pubblicati sull'accuratezza o sui benefici e non diagnostica nulla."
imageAlt: "Tre linee in ingresso, un'onda, una fila di tacche e una fila di punti, si fondono dentro una cornice arrotondata in un'unica linea che attraversa una fascia verde pallido con alcuni punti segnati e porta a un piccolo quadrato."
evidenceMap:
  - claim: "ONDA legge la variabilità della frequenza cardiaca (SDNN) da Apple Health, dove la scrive Apple Watch o un altro dispositivo che vi sincronizza i dati cardiaci."
    limitation: "Descrive solo il comportamento dell'app; ONDA non calcola lo SDNN da sé e non può verificare come abbia misurato il dispositivo di registrazione."
  - claim: "La fotocamera dell'iPhone fornisce il polso a riposo e una stima del respiro; la variabilità della frequenza cardiaca compare solo con un orologio o un altro tracker che la scrive in Apple Health."
    limitation: "Descrive solo il comportamento dell'app; non è una validazione della lettura della fotocamera."
  - claim: "ONDA costruisce una baseline personale, confronta le notti con un corridoio personale, attende di avere abbastanza notti e richiede variazioni minime; il semaforo usa un corridoio più lungo."
    limitation: "Documentazione del prodotto; le soglie sono scelte progettuali di ONDA, non valori limite validati clinicamente."
  - claim: "ONDA non è un dispositivo medico e non diagnostica né monitora alcuna condizione."
    limitation: "Dichiarazione di posizionamento; non è una classificazione normativa di alcuna autorità."
  - claim: "La variabilità del segnale del polso (PPG) concorda con l'ECG soprattutto a riposo e in condizioni controllate, e non va considerata intercambiabile con l'ECG."
    limitation: "Dieci studi nella sintesi quantitativa, adulti sani, per lo più a riposo; non riguarda specificamente la fotocamera dell'iPhone."
  - claim: "La frequenza respiratoria si può stimare dall'ECG o dal segnale del polso con molti algoritmi diversi."
    limitation: "Una revisione di metodi; non valida alcun dispositivo di consumo né la stima di ONDA."
  - claim: "ONDA limita i segnali di scostamento e invia i messaggi tranquilli con una cadenza fissa."
    limitation: "Documentazione del prodotto; le cadenze sono scelte progettuali di ONDA, non raccomandazioni cliniche."
---

## Qual è il metodo di ONDA?

ONDA è un'app di respirazione e biofeedback. Legge segnali già registrati da altri dispositivi, li confronta con la tua storia e ti mostra dove si colloca una notte. Questa pagina descrive il metodo così come è scritto nell'app, compresi i suoi limiti. È la descrizione di un prodotto, non un risultato scientifico, e ogni regola riportata qui sotto è una scelta progettuale, non una soglia clinica validata.

## Da dove vengono i dati?

**Apple Health.** Con il tuo permesso, ONDA legge da Apple Health la variabilità della frequenza cardiaca (HRV), la frequenza cardiaca a riposo e la frequenza respiratoria. L'HRV arriva come SDNN, la forma in cui la memorizza Apple Health, e ONDA non la ricalcola dagli intervalli tra i battiti. I valori li scrive Apple Watch o un altro dispositivo la cui app sincronizza i dati cardiaci con Apple Health [S1]. ONDA si limita a leggere: non scrive mai nulla in Apple Health. Legge anche gli orari del sonno per la vista sulla regolarità del sonno e alcuni singoli valori di contorno alla baseline, come la frequenza cardiaca durante la camminata e una stima della forma aerobica, quando Apple Health li contiene.

**La fotocamera dell'iPhone.** Con un polpastrello appoggiato sulla fotocamera posteriore, ONDA stima il polso dalle variazioni di colore della pelle, e il respiro dal ritmo di quel polso. La fotocamera fornisce il polso, non l'HRV: finché un orologio o un altro tracker non scrive l'HRV in Apple Health, quella parte della baseline resta vuota [S1]. Anche il punteggio di coerenza in tempo reale non è disponibile con la fotocamera: compare solo con un Apple Watch.

**Cosa ONDA non misura.** Non registra ECG, pressione arteriosa, ossigeno nel sangue, temperatura, attività cerebrale, ormoni o marcatori ematici, non assegna punteggi alle fasi del sonno e non fornisce un unico numero di prontezza. L'elenco completo è in [cosa misura ONDA](/measurements).

## Come si costruisce la tua baseline?

La baseline è l'intervallo in cui di solito si trova il tuo corpo. ONDA la costruisce su {{fact:baseline.window}} a partire dai valori notturni di Apple Health [S1, S4]. A partire dalla versione 1.9.3, il grafico dell'HRV mostra l'intera finestra appena concedi l'accesso ad Apple Health, invece di riempirsi notte dopo notte. Le notti con troppo pochi campioni vengono scartate prima di qualsiasi calcolo, e l'HRV si ricava solo dai campioni notturni.

Per i segnali, {{fact:baseline.compare}} [S1]. ONDA resta in silenzio finché non ha almeno {{fact:baseline.minNights}}: nelle prime settimane vedi quindi una baseline ancora in costruzione, non un giudizio. Le variazioni minime richieste sono: {{fact:baseline.floors}}.

Nella modalità semplice la stessa regola guida un semaforo. Il suo corridoio si calcola sulle notti di {{fact:baseline.corridor}}, così che poche notti insolite lo spostino appena. Verde significa che ogni segnale è dentro il tuo corridoio; giallo, una notte fuori; rosso, due o più notti consecutive fuori. Questi colori descrivono la distanza dalla tua storia. Non danno un voto alla tua salute. Per leggere questi confronti, vedi [la tua baseline dell'HRV](/science/concepts/hrv-baseline) e [interpretare l'HRV](/science/concepts/interpreting-hrv).

## Quando ONDA mostra un segnale?

Un segnale compare quando nell'ultima notte la frequenza cardiaca a riposo è salita, l'HRV è scesa o la frequenza respiratoria è salita oltre sia la soglia di dispersione sia la variazione minima descritte sopra. Se si sono mossi più segnali, ONDA mostra solo il più ampio. La frequenza dei segnali è limitata: {{fact:onda.signal.cadence}}. La notifica non contiene numeri; i numeri sono nell'app.

Quando le tue notti restano dentro il corridoio, ONDA invia invece un messaggio tranquillo: {{fact:onda.checkin.steadyCadence}}, con {{fact:onda.checkin.dailyCap}}. Senza dati da un orologio, i messaggi tranquilli arrivano {{fact:onda.checkin.noWatchCadence}}. Puoi disattivarli nelle Impostazioni.

I valori notturni si muovono per motivi ordinari, come alcol, una cena tardiva, l'allenamento, un viaggio o una notte breve: per questo una sola notte non viene mai letta come un verdetto. Vedi [perché l'HRV cambia da un giorno all'altro](/science/mechanisms/hrv-day-to-day).

## Cosa vedi durante una pratica?

{{fact:onda.practice.livePulse}}. Con un orologio, ONDA mostra anche un punteggio di coerenza: quanto la tua frequenza cardiaca sale e scende insieme al respiro in una finestra mobile. È una metrica di feedback per la pratica, non un biomarcatore clinico, e non è confrontabile tra persone diverse. Il valore del respiro in tempo reale è una stima ricavata dal ritmo del polso. La forma d'onda in tempo reale non è HRV nel senso di RMSSD o SDNN.

## Cosa viene salvato, e dove?

Baseline, segnali, semaforo e messaggi tranquilli si calcolano sul telefono. I fotogrammi della fotocamera usati per il polso vengono elaborati in memoria e non vengono salvati né inviati. A partire dalla versione 1.9.3, i progressi delle pratiche restano sul dispositivo anche senza un account; se accedi, vengono sincronizzati anche con il tuo account, così sopravvivono a una reinstallazione. A partire dalla versione 1.9.3, il diario, comprese le note vocali e le misurazioni del polso con la fotocamera salvate al suo interno, resta solo sul dispositivo e non viene sincronizzato. Un report PDF o HTML viene generato sul telefono e ne esce solo se sei tu a condividerlo.

## Cosa non ti dice

ONDA non ha pubblicato studi propri sull'accuratezza delle sue letture né sul fatto che le sue pratiche cambino gli esiti di salute. Ciò che ONDA sa sull'accuratezza viene da studi sulle tecnologie di base, non su ONDA.

L'accuratezza dipende dal dispositivo che ha registrato i dati e dalle condizioni. La variabilità ricavata dal polso concorda con l'ECG soprattutto a riposo e in condizioni controllate, e le prove non permettono di considerare le due misure intercambiabili [S2]. La frequenza respiratoria si può stimare dal segnale del polso, ma con molti algoritmi diversi e con prestazioni diverse [S3]. Una lettura della fotocamera dal polpastrello risente più di un ECG toracico del movimento, della pressione e della luce: considerala una stima. Per le differenze tra dispositivi, vedi [la variabilità della frequenza cardiaca come misura](/science/measurements/heart-rate-variability), [frequenza cardiaca a riposo](/science/measurements/resting-heart-rate) e [frequenza respiratoria](/science/measurements/respiratory-rate).

La baseline e i segnali sono confronti statistici con il tuo passato. Non sono una diagnosi, e ONDA non è un dispositivo medico: non diagnostica, non tratta e non monitora alcuna condizione [S1]. Una luce verde non significa che stai bene, e una rossa non significa che sei malato. Se ti senti male, hai dolore al petto, svenimenti o grave mancanza di fiato, rivolgiti a un medico, qualunque cosa mostri l'app.

## Come tratta le prove ONDA?

La sezione [ONDA Science](/science) spiega la fisiologia alla base di questi segnali. Le sue pagine citano fonti verificate su PubMed o Crossref, usano formulazioni approvate per i numeri e per le affermazioni su ONDA e distinguono i risultati accertati da quelli emergenti o dibattuti. Le pagine sono curate da [Yakiv Bilenko](/people/yakiv-bilenko).

> Informazioni a scopo educativo, non una diagnosi né un trattamento medico.
