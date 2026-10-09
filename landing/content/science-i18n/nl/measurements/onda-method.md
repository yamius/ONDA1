---
sourceHash: c9a1794847a3
title: "Hoe ONDA de signalen van je lichaam meet en interpreteert"
metaTitle: "Hoe ONDA je lichaamssignalen meet en leest"
metaDescription: "Waar ONDA zijn gegevens vandaan haalt, hoe het je baseline en signalen opbouwt, wat op je telefoon blijft en waar de grenzen van elk getal liggen."
shortAnswer: >
  ONDA leest hartslagvariabiliteit, rusthartslag en ademfrequentie uit Apple
  Health en kan met de iPhone-camera je pols via je vingertop meten. Uit je eigen
  nachten bouwt het een persoonlijke bandbreedte op, en het wijst op nachten die
  er duidelijk buiten vallen. Dat zijn beschrijvende vergelijkingen, geen
  diagnose. ONDA heeft zelf geen onderzoek naar nauwkeurigheid of werkzaamheid
  gedaan, en zijn getallen zijn maar zo goed als het apparaat dat ze vastlegde.
keyPoints:
  - "ONDA leest hartslagvariabiliteit als SDNN, rusthartslag en ademfrequentie uit Apple Health, vastgelegd door de Apple Watch of een ander apparaat dat daarheen synchroniseert; het leest alleen en schrijft nooit iets weg."
  - "De iPhone-camera geeft een polsmeting en een schatting van de ademhaling, geen hartslagvariabiliteit, en de live coherentiescore werkt niet met de camera."
  - "Je baseline en signalen vergelijken je met je eigen recente nachten, nooit met een bevolkingsnorm, en ze blijven stil tot er genoeg nachten zijn."
  - "Voor een signaal is een grote verandering nodig, gemeten in je eigen spreiding, plus een minimale absolute of relatieve verandering, zodat kleine schommelingen worden genegeerd."
  - "De baseline, de signalen en de rapporten worden op je telefoon berekend. Vanaf versie 1.9.3 blijft je oefenvoortgang zonder account op het apparaat en wordt ze pas gesynchroniseerd nadat je inlogt, en het dagboek blijft alleen op het apparaat."
  - "ONDA is geen medisch hulpmiddel, heeft geen eigen gepubliceerd onderzoek naar nauwkeurigheid of nut en stelt geen enkele diagnose."
imageAlt: "Drie invoerlijnen — een golf, een rij streepjes en een rij stippen — komen samen in een afgerond kader tot één lijn in een lichtgroene band met gemarkeerde punten, die naar een klein vierkant leidt."
evidenceMap:
  - claim: "ONDA leest hartslagvariabiliteit (SDNN) uit Apple Health, vastgelegd door de Apple Watch of een ander apparaat dat hartgegevens daarheen synchroniseert."
    limitation: "Beschrijft alleen het gedrag van de app; ONDA berekent SDNN niet zelf en kan niet nagaan hoe het meetapparaat te werk ging."
  - claim: "De iPhone-camera geeft een rustpols en een schatting van de ademhaling; hartslagvariabiliteit verschijnt pas als een horloge of andere tracker die naar Apple Health schrijft."
    limitation: "Beschrijft alleen het gedrag van de app; geen validatie van de camerameting."
  - claim: "ONDA bouwt een persoonlijke baseline op, vergelijkt nachten met een persoonlijke bandbreedte, wacht op genoeg nachten en vereist minimale veranderingen; het verkeerslicht gebruikt een langere bandbreedte."
    limitation: "Productdocumentatie; de drempels zijn ontwerpkeuzes van ONDA, geen klinisch gevalideerde grenswaarden."
  - claim: "ONDA is geen medisch hulpmiddel en stelt geen diagnose van en bewaakt geen enkele aandoening."
    limitation: "Afbakening van het product; geen regelgevende classificatie door een instantie."
  - claim: "De variabiliteit van het polssignaal (PPG) komt vooral in rust en onder gecontroleerde omstandigheden overeen met het ecg, en mag niet als uitwisselbaar met het ecg worden beschouwd."
    limitation: "Tien studies in de kwantitatieve synthese, gezonde volwassenen, vooral in rust; niet specifiek voor de iPhone-camera."
  - claim: "De ademfrequentie kan met veel verschillende algoritmen uit het ecg of het polssignaal worden geschat."
    limitation: "Een review van methoden; ze valideert geen consumentenapparaat en ook niet de schatting van ONDA."
  - claim: "ONDA beperkt het aantal afwijkingssignalen en stuurt rustige berichten in een vast ritme."
    limitation: "Productdocumentatie; de ritmes zijn ontwerpkeuzes van ONDA, geen klinische aanbevelingen."
---

## Wat is de methode van ONDA?

ONDA is een app voor ademhaling en biofeedback. Het leest signalen die andere apparaten al hebben vastgelegd, vergelijkt ze met je eigen geschiedenis en laat zien waar een nacht staat. Deze pagina beschrijft die methode zoals ze in de app is geprogrammeerd, inclusief waar ze ophoudt. Het is een beschrijving van een product, geen wetenschappelijke bevinding, en elke regel hieronder is een ontwerpkeuze, geen gevalideerde klinische drempel.

## Waar komen de gegevens vandaan?

**Apple Health.** Met je toestemming leest ONDA hartslagvariabiliteit (HRV), rusthartslag en ademfrequentie uit Apple Health. HRV komt binnen als SDNN, de vorm waarin Apple Health haar opslaat, en ONDA berekent haar niet opnieuw uit de intervallen tussen hartslagen. De waarden worden vastgelegd door de Apple Watch of door een ander apparaat waarvan de app hartgegevens naar Apple Health synchroniseert [S1]. ONDA leest alleen; het schrijft nooit iets naar Apple Health. Het leest ook de slaaptijden voor zijn weergave van slaapregelmaat, en een paar losse waarden rond de baseline, zoals de wandelhartslag en een geschatte waarde voor je aerobe conditie, als Health die heeft.

**De iPhone-camera.** Leg je je vingertop op de achtercamera, dan schat ONDA je pols uit de kleurveranderingen in de huid, en je ademhaling uit het ritme van die pols. De camera geeft een pols, geen HRV: zolang geen horloge of andere tracker HRV naar Apple Health schrijft, blijft dat deel van de baseline leeg [S1]. Ook de live coherentiescore is met de camera niet beschikbaar; die verschijnt alleen met een Apple Watch.

**Wat ONDA niet meet.** Het neemt geen ecg op en meet geen bloeddruk, zuurstofverzadiging, temperatuur, hersenactiviteit, hormonen of bloedwaarden, en het geeft geen score voor slaapfasen en geen los getal voor je paraatheid. Het volledige overzicht staat op [wat ONDA meet](/measurements).

## Hoe wordt je baseline opgebouwd?

De baseline is het bereik waarin je eigen lichaam zich gewoonlijk bevindt. ONDA bouwt haar op over {{fact:baseline.window}} aan nachtelijke waarden uit Apple Health [S1, S4]. Vanaf versie 1.9.3 toont de HRV-grafiek dat hele venster zodra je toegang tot Apple Health geeft, in plaats van zich nacht voor nacht te vullen. Nachten met te weinig metingen vallen weg voordat er iets wordt berekend, en HRV wordt alleen uit nachtelijke metingen genomen.

Voor signalen geldt: {{fact:baseline.compare}} [S1]. ONDA blijft stil tot er minstens {{fact:baseline.minNights}} zijn, dus in de eerste weken zie je een baseline die nog wordt opgebouwd, geen oordeel. De minimale veranderingen die het vereist, zijn: {{fact:baseline.floors}}.

In de eenvoudige modus stuurt dezelfde regel een verkeerslicht aan. De bandbreedte daarvan wordt berekend over {{fact:baseline.corridor}}, zodat een paar ongewone nachten haar nauwelijks verschuiven. Groen betekent dat elk signaal binnen je bandbreedte valt; geel betekent één nacht erbuiten; rood betekent twee of meer nachten op rij erbuiten. Deze kleuren beschrijven de afstand tot je eigen geschiedenis. Ze geven geen cijfer voor je gezondheid. Hoe je zulke vergelijkingen leest, staat op [je HRV-baseline](/science/concepts/hrv-baseline) en [HRV interpreteren](/science/concepts/interpreting-hrv).

## Wanneer toont ONDA een signaal?

Een signaal verschijnt als afgelopen nacht je rusthartslag steeg, je HRV daalde of je ademfrequentie steeg, voorbij zowel de drempel van de spreiding als de minimale verandering die hierboven is beschreven. Bewogen er meerdere signalen, dan toont ONDA alleen het grootste. Je krijgt {{fact:onda.signal.cadence}}, en de melding bevat geen getallen; die staan in de app.

Blijven je nachten binnen de bandbreedte, dan stuurt ONDA in plaats daarvan {{fact:onda.checkin.steadyCadence}} — {{fact:onda.checkin.dailyCap}}. Zonder gegevens van een horloge komen ze {{fact:onda.checkin.noWatchCadence}}. Rustige berichten kun je uitzetten in de instellingen.

Nachtelijke waarden bewegen om gewone redenen, zoals alcohol, een late maaltijd, training, reizen of een korte nacht; daarom wordt één nacht nooit als oordeel gelezen. Zie [waarom HRV van dag tot dag verandert](/science/mechanisms/hrv-day-to-day). Specifiek over alcohol, zie [alcohol en HRV](/science/mechanisms/alcohol-and-hrv).

## Wat zie je tijdens een oefening?

{{fact:onda.practice.livePulse}}. Met een horloge toont ONDA ook een coherentiescore: hoe sterk je hartslag met je ademhaling meestijgt en -daalt over een meelopend venster. Het is een feedbackmaat voor de oefening, geen klinische biomarker, en ze is niet vergelijkbaar tussen mensen. De live ademwaarde is een schatting uit het ritme van de pols. De live golfvorm is geen HRV in de zin van RMSSD of SDNN.

## Wat wordt bewaard, en waar?

De baseline, de signalen, het verkeerslicht en de rustige berichten worden op je telefoon berekend. De camerabeelden voor de pols worden in het geheugen verwerkt en niet bewaard of verstuurd. Vanaf versie 1.9.3 wordt je oefenvoortgang ook zonder account op het apparaat bewaard; log je in, dan wordt ze ook met je account gesynchroniseerd, zodat ze een herinstallatie overleeft. Vanaf versie 1.9.3 blijft het dagboek, inclusief spraaknotities en polsmetingen met de camera die erin zijn opgeslagen, alleen op het apparaat en wordt het niet gesynchroniseerd. Een rapport als pdf of HTML wordt op de telefoon gemaakt en verlaat die alleen als je het zelf deelt.

## Wat het je niet vertelt

ONDA heeft geen eigen onderzoek gepubliceerd naar de nauwkeurigheid van zijn metingen of naar de vraag of zijn oefeningen gezondheidsuitkomsten veranderen. Wat ONDA over nauwkeurigheid weet, komt uit onderzoek naar de onderliggende technieken, niet naar ONDA.

De nauwkeurigheid hangt af van het apparaat dat de gegevens vastlegde en van de omstandigheden. Variabiliteit op basis van de pols komt vooral in rust en onder gecontroleerde omstandigheden overeen met het ecg, en het bewijs rechtvaardigt niet om de twee als uitwisselbaar te behandelen [S2]. De ademfrequentie kan uit het polssignaal worden geschat, maar met veel verschillende algoritmen die verschillend presteren [S3]. Een camerameting via de vingertop is gevoeliger voor beweging, druk en licht dan een ecg op de borst, dus zie haar als een schatting. Over verschillen tussen apparaten lees je meer op [hartslagvariabiliteit als meting](/science/measurements/heart-rate-variability), [rusthartslag](/science/measurements/resting-heart-rate) en [ademfrequentie](/science/measurements/respiratory-rate).

De baseline en de signalen zijn statistische vergelijkingen met je eigen verleden. Ze zijn geen diagnose, en ONDA is geen medisch hulpmiddel: het stelt geen diagnoses, behandelt niets en bewaakt geen enkele aandoening [S1]. Groen betekent niet dat je gezond bent, en rood betekent niet dat je ziek bent. Voel je je niet goed, of heb je pijn op de borst, val je flauw of ben je ernstig kortademig, zoek dan medische zorg, wat de app ook laat zien.

## Hoe gaat ONDA om met bewijs?

Het onderdeel [ONDA Science](/science) legt de fysiologie achter deze signalen uit. De pagina's citeren bronnen die zijn gecontroleerd in PubMed of Crossref, gebruiken goedgekeurde formuleringen voor getallen en voor uitspraken over ONDA, en houden vastgestelde bevindingen gescheiden van opkomende of omstreden bevindingen. De pagina's worden geredigeerd door [Yakiv Bilenko](/people/yakiv-bilenko).

> Educatieve informatie, geen diagnose of medische behandeling.
