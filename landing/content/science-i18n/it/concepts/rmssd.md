---
sourceHash: "7b68393346e3"
title: "RMSSD: cosa riflette questa metrica dell'HRV e cosa no"
metaTitle: "RMSSD: definizione, significato e misurazione"
metaDescription: "L'RMSSD è una metrica dell'HRV che riflette le variazioni della frequenza cardiaca mediate dal vago. Cosa misura, come lo stimano i wearable e cosa non dice."
shortAnswer: >
  L'RMSSD è una metrica della variabilità della frequenza cardiaca: la radice
  quadrata della media dei quadrati delle differenze tra battiti successivi.
  Serve a riassumere la variazione da un battito all'altro nelle registrazioni
  brevi e riflette le variazioni della frequenza cardiaca mediate dal vago. È
  influenzato dall'età, dal respiro, dalla postura, dall'ora del giorno e dal
  metodo di registrazione. Da solo non stabilisce lo stress, lo stato di
  salute né il tono vagale.
keyPoints:
  - "L'RMSSD riassume quanto cambia l'intervallo tra i battiti da un battito al successivo."
  - "Riflette le variazioni della frequenza cardiaca mediate dal vago, ed è per questo una metrica standard a breve termine nella ricerca sull'HRV."
  - "Il tono vagale non si può misurare direttamente; l'RMSSD è un indicatore indiretto, e i prodotti che affermano il contrario semplificano."
  - "I dispositivi indossabili stimano l'RMSSD dal segnale del polso, e la concordanza con l'ECG dipende dal dispositivo e dalle condizioni."
  - "I valori dipendono dal contesto: contano il metodo di registrazione, la durata, la postura, il respiro e l'ora del giorno."
  - "Un singolo valore di RMSSD non è una diagnosi né una misura dello stress; le tendenze rispetto alla tua baseline personale sono di solito più informative."
imageAlt: "Una sottile traccia color verde acqua del ritmo cardiaco su fondo bianco, con distanze tra i battiti leggermente variabili: un'immagine della variabilità della frequenza cardiaca da un battito all'altro."
evidenceMap:
  - claim: "L'RMSSD è la radice quadrata della media dei quadrati delle differenze successive tra battiti adiacenti; è la metrica preferita per le registrazioni brevi."
    limitation: "Uno standard definitorio e metodologico; da solo non dice nulla sullo stato di salute."
  - claim: "Lo SDNN descrive la dispersione complessiva degli intervalli in una registrazione, mentre l'RMSSD isola le differenze tra battiti adiacenti."
    limitation: "Definizioni; la confrontabilità richiede la stessa durata e le stesse condizioni di registrazione."
  - claim: "L'RMSSD riflette le variazioni della frequenza cardiaca mediate dal vago; il tono vagale non si può misurare direttamente."
    limitation: "Un indicatore indiretto nelle condizioni di misura, non una misura diretta dell'attività parasimpatica."
  - claim: "Il respiro si imprime negli intervalli tra i battiti attraverso l'aritmia sinusale respiratoria, quindi la frequenza e la profondità del respiro durante la registrazione modellano fortemente l'RMSSD."
    limitation: "L'effetto è presente durante la registrazione; i cambiamenti duraturi dopo la pratica sono una questione diversa."
  - claim: "L'RMSSD dipende dal contesto di misura: metodo di registrazione, durata, postura, respiro e ora del giorno."
    limitation: "L'entità e la direzione degli effetti del contesto variano per metrica, condizione e persona; lo confermano dati aggregati sui valori normali e indicazioni metodologiche."
  - claim: "La maggior parte dei valori di riferimento pubblicati proviene da brevi registrazioni diurne, mentre i dispositivi indossabili di consumo riportano soprattutto valori notturni."
    limitation: "Popolazioni di riferimento e protocolli differiscono tra gli studi; non è una norma personale."
  - claim: "L'RMSSD aggregato a riposo da brevi registrazioni diurne è una media diurna aggregata, non un valore notturno né una norma per età."
    limitation: "Aggregato da protocolli a breve termine eterogenei in adulti sani; ampia variazione individuale."
  - claim: "Le stime dell'HRV basate sulla fotopletismografia (PPG) dei dispositivi indossabili concordano con i valori derivati dall'ECG in alcune condizioni e divergono in altre."
    limitation: "La concordanza dipende da metrica, dispositivo e condizioni; questa pagina non riporta valori di accuratezza."
  - claim: "In media l'RMSSD diminuisce con l'età negli adulti sani, mentre le differenze tra individui sono ampie."
    limitation: "Medie trasversali di popolazione; ampia variazione individuale a ogni età."
  - claim: "L'RMSSD differisce tra donne e uomini, e la direzione e l'entità della differenza dipendono dall'età e dalla popolazione."
    limitation: "Dati osservazionali su campioni sani; medie di gruppo, non aspettative individuali."
  - claim: "Le condizioni del giorno possono spostare una singola lettura, ed è per questo che si raccomandano misurazioni ripetute in condizioni confrontabili."
    limitation: "Le risposte individuali variano; l'entità degli effetti dipende dalla persona e dalla dose e qui non è quantificata."
  - claim: "Un RMSSD più alto è in genere associato a un recupero migliore, ma non sempre; alcuni disturbi del ritmo modificano lo schema stesso da battito a battito."
    limitation: "Associazioni a livello di popolazione; non un verdetto personale."
  - claim: "Le tendenze rispetto alla baseline personale, misurate in condizioni confrontabili, sono più informative di una singola lettura."
    limitation: "Indicazione metodologica (consenso di esperti), non dati sperimentali diretti; una raccomandazione sulla pratica interpretativa, non un risultato clinico."
  - claim: "Apple Health registra l'HRV come SDNN, il tipo di dato HealthKit in uso da tempo e registrato automaticamente da Apple Watch."
    limitation: "Documentazione ufficiale; descrive cosa registra il dispositivo, non cosa significhino i valori per la salute; limitata all'ecosistema Apple."
  - claim: "I modelli recenti di Apple Watch con watchOS mostrano due varianti di HRV, Recovery HRV e Overall HRV, e misurano l'HRV anche ogni cinque minuti."
    limitation: "Annuncio del produttore; limitato a specifici hardware e versioni del sistema operativo; Apple non ha spiegato come si calcola Recovery HRV."
  - claim: "iOS e watchOS aggiungono ad Apple Health un tipo di dato RMSSD."
    limitation: "Documentazione ufficiale; disponibilità limitata a specifiche versioni del sistema operativo; cosa registrino le app con questo tipo dipende da ciascuna app."
---

## Che cos'è l'RMSSD?

L'RMSSD è una delle misure standard della [variabilità della frequenza cardiaca](/glossary/heart-rate-variability) (HRV), cioè la naturale variazione del tempo tra battiti consecutivi. Gli standard di misura del settore lo definiscono con precisione. {{fact:hrv.rmssd.definition}} [S1].

In parole semplici: prendi gli intervalli tra battiti adiacenti, guarda quanto ciascuno differisce dal successivo e riassumi queste differenze in un unico valore in millisecondi. Un valore più alto significa che il ritmo cambia di più da un battito all'altro.

Di solito è affiancato da una seconda metrica nel dominio del tempo. {{fact:hrv.sdnn.definition}} [S1]. Le due rispondono a domande diverse: lo SDNN descrive la dispersione complessiva degli intervalli in una registrazione, mentre l'RMSSD isola i cambiamenti da un battito all'altro. Proprio per questa focalizzazione, l'RMSSD è la metrica preferita quando la registrazione è breve [S1, S2].

## Come funziona l'RMSSD?

Il cuore non è un metronomo. L'intervallo tra due battiti è regolato di continuo dal sistema nervoso autonomo, e la più rapida di queste regolazioni, l'influenza vagale (parasimpatica) sul cuore, agisce da un battito all'altro [S2, S3]. L'RMSSD coglie esattamente questa scala temporale: quanto cambia il ritmo tra battiti adiacenti.

Per questo l'RMSSD viene letto come una finestra sulle variazioni della frequenza cardiaca mediate dal vago. Il modo di inquadrarlo conta. {{fact:claim.vagalTone}} [S2, S3].

Il respiro lascia una firma marcata nella stessa finestra. A ogni inspirazione il cuore accelera leggermente, a ogni espirazione rallenta: è il fenomeno chiamato aritmia sinusale respiratoria (RSA) [S2, S3]. Una respirazione lenta e calma accentua quest'onda, e una lettura presa durante una pratica di questo tipo è di solito più alta di una presa con una frequenza respiratoria elevata. È un'osservazione di misura su ciò a cui il valore risponde, non la prova che si sia allenato qualcosa di permanente.

## Come si misura l'RMSSD?

Il calcolo è semplice. Da una serie di intervalli tra battiti: si prende la differenza tra ogni coppia di intervalli adiacenti, si elevano al quadrato le differenze, se ne fa la media e si estrae la radice quadrata [S1]. Tutto ciò che l'RMSSD sa viene dall'accuratezza di quegli intervalli: per questo il metodo di registrazione conta più dell'aritmetica.

Il metodo di riferimento è l'ECG, che rileva la traccia elettrica di ogni battito. I dispositivi indossabili (wearable) stimano invece gli intervalli dal segnale del polso sulla pelle (fotopletismografia, PPG); il risultato viene spesso chiamato variabilità del polso (PRV). La concordanza tra i due dipende dalla metrica e dalle condizioni: in genere è migliore a riposo e con un buon segnale, peggiore con il movimento o un contatto scarso [S6, S7]. Un dettaglio pratico per chi usa Apple Watch. {{fact:applewatch.hrv.healthkit}} [S9]. Sull'hardware recente, {{fact:applewatch.hrv.variants2026}} [S10]. Apple non ha spiegato come si calcola Recovery HRV. Inoltre {{fact:applewatch.hrv.rmssdType}} [S11], il che permette alle app di leggere da Apple Health un valore di tipo RMSSD.

Il contesto fa parte della misura. L'RMSSD dipende dalla postura, dal respiro, dall'ora del giorno e dalla durata della registrazione [S5, S8]. La maggior parte dei valori di riferimento pubblicati è stata raccolta con brevi registrazioni diurne in condizioni controllate [S5], mentre i dispositivi indossabili di consumo riportano soprattutto medie notturne: contesti diversi, i cui valori non sono direttamente intercambiabili. Come ordine di grandezza, l'RMSSD aggregato a riposo da brevi registrazioni diurne è di {{fact:hrv.pooled.daytime}} [S5]: una media diurna aggregata, non un valore notturno né una norma per età. Le tabelle per fasce d'età pubblicate da ONDA sono tabelle dell'RMSSD notturno e si trovano nell'articolo sull'[HRV normale per età](/articles/normal-hrv-by-age). Per una routine di misurazione personale coerente, il lato pratico è nella guida [come misurare l'HRV in modo coerente](/articles/how-to-measure-hrv-consistently).

## Cosa influenza l'RMSSD?

- L'età. {{fact:hrv.age.trend}} [S4, S5]. Le differenze tra individui sono ampie a ogni età; le mediane della popolazione non sono obiettivi personali. Le tabelle complete si trovano nell'articolo sull'[HRV normale per età](/articles/normal-hrv-by-age).
- Il sesso. Gli studi riportano differenze tra donne e uomini, con direzione ed entità che dipendono dall'età e dalla popolazione [S4].
- Il respiro. È il fattore dominante a breve termine, attraverso l'aritmia sinusale respiratoria: la frequenza e la profondità del respiro durante la registrazione cambiano il valore [S2, S3].
- Le condizioni. Postura, ora del giorno e sonno o veglia cambiano tutti ciò che lo stesso cuore fa durante la misura [S5, S8].
- Le condizioni del giorno. Una singola lettura può spostarsi da un giorno o da una notte all'altra, ed è per questo che si raccomandano misurazioni ripetute in condizioni confrontabili [S2, S8].

## Cosa mostrano le prove?

Accertato. La definizione, il calcolo e il ruolo dell'RMSSD come metrica dell'HRV a breve termine vengono dagli standard di misura del settore [S1]. La sua lettura come riflesso delle variazioni della frequenza cardiaca mediate dal vago, con il tono vagale in sé non misurabile direttamente, è l'interpretazione standard nelle revisioni metodologiche [S2, S3]. Il contesto di misura è un fattore di primo piano, non una nota a margine: metodo, durata, postura, respiro e ora del giorno modellano tutti il valore [S5, S8]. In media l'RMSSD diminuisce con l'età negli adulti sani [S4, S5].

Dipende dal contesto. Stime dei dispositivi indossabili: i valori derivati dalla PPG possono seguire l'HRV derivata dall'ECG in condizioni favorevoli, e i due divergono con il movimento, un contatto scarso o un segnale debole [S6, S7]. Valori di riferimento: la maggior parte degli intervalli classici proviene da brevi registrazioni diurne, non dai valori notturni riportati dai dispositivi di consumo [S5].

Linee guida / consenso di esperti. Le linee guida attuali per una ricerca rigorosa sull'HRV raccomandano condizioni di registrazione standardizzate e ripetibili e un'interpretazione cauta dei singoli valori [S8]. Si tratta di un consenso di esperti su come misurare e interpretare, non di dati sperimentali diretti sull'RMSSD in sé.

Cosa resta incerto: quanto fedelmente i valori di tipo RMSSD dei dispositivi di consumo seguano l'RMSSD derivato dall'ECG nelle condizioni di tutti i giorni (movimento, colore della pelle, aderenza del sensore, fasi del sonno) è ancora in corso di studio [S6, S7]. Ed è una questione aperta quanto del quadro della ricerca a lungo termine, costruito soprattutto con l'ECG in condizioni controllate, si trasferisca ai valori notturni dei dispositivi di consumo nelle persone sane [S8].

## Cosa l'RMSSD non ti dice

- Non è un misuratore del tono vagale. {{fact:claim.vagalTone}} [S2, S3].
- Non è una diagnosi né una misura dello stress. {{fact:claim.hrvNotStress}} [S1].
- Più alto non significa automaticamente meglio. Un RMSSD più alto è in genere associato a un recupero migliore, ma alcuni disturbi del ritmo modificano lo schema stesso da battito a battito, e in quel caso un valore alto ha un significato diverso [S2].
- I valori non sono intercambiabili tra dispositivi, app e condizioni di misura [S6, S8].
- Un singolo valore dice poco. Le indicazioni metodologiche raccomandano di confrontare le letture con la tua baseline personale, misurata in condizioni confrontabili, invece di attribuire un significato a un singolo valore [S8].

## In ONDA

ONDA usa l'RMSSD notturno come metrica di riferimento nelle sue tabelle normative dell'HRV e nel [calcolatore HRV](/tools/hrv). La baseline personale notturna dell'app, però, legge i valori di HRV memorizzati da Apple Health, e {{fact:applewatch.hrv.healthkit}} [S9]: quel segnale di base si fonda quindi sullo SDNN e non sull'RMSSD. La lettura in tempo reale mostrata durante una pratica è un indicatore surrogato calcolato dalla deviazione standard della frequenza cardiaca, non RMSSD né SDNN, e la fotocamera del telefono rileva il polso, non l'HRV. ONDA descrive e confronta i tuoi numeri; non diagnostica nulla. Vedi [cosa misura ONDA](/measurements).

> Informazioni a scopo educativo, non una diagnosi né un trattamento medico.
