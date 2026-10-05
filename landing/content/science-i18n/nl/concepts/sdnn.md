---
sourceHash: "f848794fbee9"
title: "SDNN — wat deze HRV-maat meet en wat niet"
metaTitle: "SDNN: definitie, betekenis en de rol van Apple"
metaDescription: "SDNN is de HRV-maat die Apple Health opslaat. Wat ze meet, hoe ze verschilt van RMSSD en waarom je de twee getallen niet met elkaar kunt vergelijken."
shortAnswer: >
  SDNN is een maat voor hartslagvariabiliteit (HRV): de standaarddeviatie van
  de intervallen tussen normale hartslagen. Ze vat de totale spreiding van het
  hartritme over een meting samen en groeit met de meetduur, dus waarden van
  verschillende apparaten, apps en meetregimes zijn niet direct vergelijkbaar.
  Het is de maat die Apple Health opslaat. Op zichzelf stelt ze geen stress,
  gezondheidstoestand of autonome balans vast.
keyPoints:
  - "SDNN vat de totale spreiding samen van de intervallen tussen normale hartslagen binnen een meting."
  - "Ze weerspiegelt de totale variabiliteit: beide takken van het autonome zenuwstelsel en tragere ritmes dragen eraan bij."
  - "SDNN hangt af van de meetduur, dus korte labmetingen, holterwaarden over de hele dag en nachtelijke horlogewaarden zijn niet uitwisselbaar."
  - "Apple Health slaat HRV op als SDNN; daarom zijn Apple Watch-waarden niet direct te vergelijken met RMSSD-waarden van andere wearables."
  - "Wearables schatten SDNN uit het polssignaal, en hoe goed dat met het ecg overeenkomt, hangt af van het apparaat en de omstandigheden."
  - "Eén SDNN-waarde is geen diagnose en geen stressmeting; je eigen trend onder vergelijkbare omstandigheden zegt meer."
imageAlt: "Een rij hartslagintervallen van wisselende lengte boven een puntenverdeling van die intervallen, met een turquoise haak die hun spreiding rond het gemiddelde markeert — het idee dat SDNN samenvat."
evidenceMap:
  - claim: "SDNN is de standaarddeviatie van de intervallen tussen normale hartslagen over een meting."
    limitation: "Een definitie en methodologische standaard; zegt op zichzelf niets over iemands gezondheid."
  - claim: "Normaal betekent dat afwijkende en ectopische slagen worden verwijderd voordat de statistiek wordt berekend."
    limitation: "Beschrijft het opschonen van gegevens; hoe streng slagen worden gefilterd, verschilt per algoritme en apparaat."
  - claim: "SDNN weerspiegelt alle cyclische componenten die tijdens de meting variabiliteit veroorzaken; ze vat de totale variabiliteit samen in plaats van één tak van het autonome zenuwstelsel."
    limitation: "Een eigenschap van de statistiek; de mix van ritmes verschuift met de meetduur en de omstandigheden."
  - claim: "SDNN hangt af van de meetduur: langere metingen nemen tragere ritmes op en geven hogere waarden, dus SDNN-waarden uit metingen van verschillende duur zijn niet vergelijkbaar."
    limitation: "Een methodologische eigenschap van de maat; ze raakt elke vergelijking tussen apps, studies en protocollen."
  - claim: "Normwaarden voor HRV over de hele dag, korte en ultrakorte metingen zijn niet uitwisselbaar."
    limitation: "Gaat over normwaarden bij gezonde en klinische groepen; nachtelijke waarden van consumentenapparaten zijn nog een andere context."
  - claim: "Beide takken van het autonome zenuwstelsel dragen bij aan SDNN, en ze hangt sterk samen met tragere frequentiebanden en het totale vermogen."
    limitation: "Fysiologische redenering op bevolkingsniveau; de verhouding tussen de bijdragen verschuift met de meetomstandigheden."
  - claim: "Langere metingen nemen tragere ritmes op — wisselende belasting, conditionering en circadiane processen — die elk bijdragen aan de spreiding."
    limitation: "Verklaart waarom de lengte van het venster ertoe doet, niet wat één venster over een persoon zegt."
  - claim: "RMSSD wordt sterker beïnvloed door de parasympathische tak dan SDNN; daarom kunnen de twee maten verschillend bewegen."
    limitation: "Een relatieve uitspraak tussen maten, geen maat voor parasympathische activiteit in een van beide."
  - claim: "Vagale tonus is niet rechtstreeks te meten, en HRV is geen specifieke marker van sympathische activiteit of van de sympathovagale balans."
    limitation: "Methodologische voorzichtigheid uit richtlijnen en reviews; SDNN-waarden zijn niet om te zetten in aflezingen van het autonome zenuwstelsel."
  - claim: "In de klinische cardiologie is SDNN uit ecg-registraties over de hele dag een maat voor risicostratificatie bij patiëntengroepen."
    limitation: "Klinische groepen met continue ecg in het ziekenhuis; niet over te zetten naar waarden van een consumentenhorloge."
  - claim: "In korte rustmetingen is de ademgebonden schommeling van de hartslag de belangrijkste bron van variatie in SDNN."
    limitation: "Geldt voor het meetvenster; het is een meetobservatie, geen bewijs voor een blijvende verandering."
  - claim: "HRV-schattingen van wearables op basis van fotoplethysmografie (PPG) komen onder sommige omstandigheden overeen met waarden uit het ecg en wijken onder andere af; gepoolde schattingen bewijzen geen uitwisselbaarheid."
    limitation: "Overeenstemming hangt af van maat, apparaat en omstandigheden; op deze pagina staan geen nauwkeurigheidscijfers."
  - claim: "Onder gecontroleerde rustomstandigheden kan PPG aan de pols HRV-indices uit het ecg nauwkeurig benaderen, terwijl validatie in het dagelijks leven beperkt blijft."
    limitation: "Validatie van één apparaat bij volwassenen in rust met sinusritme; geen algemene nauwkeurigheidsclaim voor consumentenhorloges."
  - claim: "Apple Health registreert HRV als SDNN — berekend als de standaarddeviatie van de interbeatintervallen tussen normale hartslagen en automatisch vastgelegd door de Apple Watch."
    limitation: "Officiële documentatie; beschrijft wat het systeem vastlegt, niet wat de waarden voor de gezondheid betekenen; beperkt tot het ecosysteem van Apple."
  - claim: "Recente Apple Watch-modellen met watchOS tonen twee HRV-varianten — Recovery HRV en Overall HRV — en meten HRV zo vaak als elke vijf minuten."
    limitation: "Aankondiging van de fabrikant; beperkt tot bepaalde hardware- en OS-versies; Apple heeft niet bekendgemaakt hoe Recovery HRV wordt berekend."
  - claim: "iOS en watchOS voegen een RMSSD-gegevenstype toe aan Apple Health."
    limitation: "Officiële documentatie; beschikbaarheid beperkt tot bepaalde OS-versies; wat apps via dit type vastleggen, verschilt per app."
  - claim: "Gemiddeld neemt de hartslagvariabiliteit bij gezonde volwassenen af met de leeftijd, terwijl mensen onderling sterk verschillen."
    limitation: "Gemiddelden uit dwarsdoorsnedeonderzoek; grote individuele verschillen op elke leeftijd; geen leeftijdstabellen op deze pagina."
  - claim: "De meetduur, de setting, de ademhaling en de analysemethode bepalen allemaal de waarde en de zorgvuldigheid van de interpretatie."
    limitation: "Consensus van experts over methoden; de grootte van elk effect verschilt per situatie en per persoon."
  - claim: "Losse metingen vragen om een voorzichtige interpretatie in context, niet om een geïsoleerde lezing."
    limitation: "Consensus van experts over de interpretatiepraktijk, geen direct experimenteel bewijs; vergelijken met je eigen trend onder vergelijkbare omstandigheden is de praktische vertaling."
  - claim: "Afwijkende slagen en ruis kunnen zich voordoen als variabiliteit en de waarde opdrijven."
    limitation: "Een waarschuwing over datakwaliteit; de omgang met artefacten verschilt per apparaat en algoritme."
---

## Wat is SDNN?

SDNN is een van de standaardmaten voor [hartslagvariabiliteit](/glossary/heart-rate-variability) (HRV) — de natuurlijke variatie in de tijd tussen opeenvolgende hartslagen. In de meetstandaarden van het vakgebied is ze precies gedefinieerd: {{fact:hrv.sdnn.definition}} [S1]. De letters „NN” in de naam staan voor normal-to-normal: alleen intervallen tussen normale hartslagen tellen mee, en afwijkende slagen worden verwijderd voordat de statistiek wordt berekend [S2].

In gewone taal: verzamel alle intervallen tussen naburige normale hartslagen in een meting, kijk hoe ver ze rond hun gemiddelde uiteenliggen, en druk die spreiding uit in één waarde in milliseconden. Een grotere waarde betekent dat het ritme binnen dat venster in totaal meer varieerde.

Ze wordt meestal vergeleken met een tweede tijdsdomeinmaat — {{fact:hrv.rmssd.definition}} [S1]. De twee beantwoorden verschillende vragen: RMSSD isoleert de veranderingen tussen naburige slagen, terwijl SDNN de spreiding van de hele meting samenvat. Dat verschil is de reden waarom SDNN- en RMSSD-waarden niet direct vergelijkbaar zijn — en de reden waarom beide maten bestaan. De [RMSSD-pagina](/science/concepts/rmssd) behandelt de kant van slag tot slag; deze pagina gaat over de spreiding.

## Hoe werkt SDNN?

SDNN is een vensterstatistiek: alles wat het hartritme tijdens de meting beweegt, draagt eraan bij. In een korte rustmeting komt de grootste bijdrage van het ademgebonden stijgen en dalen van de hartslag — respiratoire sinusaritmie — dus langzaam, rustig ademen tijdens een meting verhoogt de waarde zichtbaar [S2]. In langere metingen doen tragere ritmes mee: wisselende belasting, geconditioneerde reacties en het slaap-waakritme voegen elk hun eigen bijdrage aan de spreiding toe [S2].

Omdat zoveel invloeden in één getal samenkomen, scheidt SDNN de twee takken van het autonome zenuwstelsel niet — beide dragen bij [S2]. Daarom kan ze ook niet worden gelezen als directe aflezing van een van beide takken. De formulering doet ertoe. {{fact:claim.vagalTone}} [S2, S7]. RMSSD, opgebouwd uit verschillen tussen naburige slagen, leunt sterker op de snelle parasympathische route dan SDNN [S2] — een van de redenen waarom de twee maten over dezelfde meting een ander verhaal kunnen vertellen.

De lange versie van de maat heeft een klinische geschiedenis: berekend over ecg-registraties van een hele dag in het ziekenhuis bij hartpatiënten is SDNN een maat voor risicostratificatie [S2]. Dat bewijs hoort bij een meetregime — continue klinische ecg bij patiëntengroepen — dat een consumentenhorloge niet nabootst, dus het mag niet op een nachtelijke horlogewaarde worden geprojecteerd.

## Hoe wordt SDNN gemeten?

De berekening is eenvoudig: neem de intervallen tussen normale hartslagen binnen het meetvenster en bereken hun standaarddeviatie [S1, S2]. Alles wat SDNN weet, hangt af van de nauwkeurigheid van die intervallen — daarom doet de meetmethode er meer toe dan het rekenwerk.

De referentiemethode is een ecg, dat de elektrische afdruk van elke hartslag registreert. Wearables schatten de intervallen in plaats daarvan uit het polssignaal aan de huid (fotoplethysmografie, PPG); het resultaat heet vaak polsslagvariabiliteit. De overeenstemming tussen de twee hangt af van de maat en de omstandigheden — meestal beter in rust en bij een goed signaal, zwakker bij beweging of slecht contact [S5, S6] — en het gepoolde bewijs reikt tot nu toe niet tot slaap of het dagelijks leven [S5].

De meetduur hoort bij de betekenis van de waarde. Een korte labmeting, een holter-ecg over de hele dag en de opgeslagen metingen van een horloge zijn drie verschillende meetregimes: SDNN groeit met de meetduur, en waarden uit zulke regimes zijn niet uitwisselbaar [S2]. Om dezelfde reden worden gepubliceerde normen voor metingen over de hele dag, korte en ultrakorte metingen als aparte werelden behandeld [S2].

Hier komt Apple in beeld. Een praktisch gevolg voor wie een Apple Watch draagt: {{fact:applewatch.hrv.healthkit}} [S8]. Die keuze is een ontwerpbeslissing, geen wetenschappelijk oordeel over welke maat beter is: SDNN is de berekening die HealthKit altijd heeft gebruikt, in de documentatie beschreven als de standaarddeviatie van de interbeatintervallen tussen normale hartslagen, automatisch vastgelegd door het horloge [S8]. Op recente hardware geldt: {{fact:applewatch.hrv.variants2026}} [S9]. Apple heeft niet bekendgemaakt hoe Recovery HRV wordt berekend. Daarnaast geldt: {{fact:applewatch.hrv.rmssdType}} [S10], waardoor apps in plaats daarvan een waarde van het type RMSSD uit Apple Health kunnen lezen — een stap naar zuiverdere vergelijkingen tussen apparaten, al blijven de waarden die al zijn verzameld SDNN.

Voor de praktische kant: de [HRV-calculator](/tools/hrv) heeft een SDNN-modus voor getallen die van de Apple Watch komen; het alledaagse verhaal over waarom apparaten het oneens zijn, staat in [waarom je HRV op elk apparaat anders is](/articles/hrv-different-every-device); en om je eigen metingen vergelijkbaar te houden, zie [HRV consequent meten](/articles/how-to-measure-hrv-consistently).

## Wat beïnvloedt SDNN?

- Meetduur. De bepalende factor voor deze maat: langere vensters nemen tragere ritmes op en geven hogere waarden, dus een korte meting en een registratie over de hele dag beschrijven verschillende werelden [S2].
- Meetomstandigheden. De meetduur, de setting — lab of dagelijks leven — de ademhaling en de analysemethode bepalen allemaal de waarde en de zorgvuldigheid van elke vergelijking [S7].
- Leeftijd. Gemiddeld neemt de hartslagvariabiliteit bij gezonde volwassenen af met de leeftijd [S4]; mensen verschillen onderling sterk, en bevolkingsgemiddelden zijn geen persoonlijke doelen. Tabellen per leeftijdsgroep staan in de [HRV-calculator](/tools/hrv) voor SDNN-waarden van de Apple Watch en in het artikel [normale HRV per leeftijd](/articles/normal-hrv-by-age) voor nachtelijke RMSSD.
- Ademhaling. Ademfrequentie en ademdiepte tijdens de meting veranderen de waarde, via de ademgebonden schommeling die ze in het ritme schrijven [S2].
- Signaalkwaliteit. Gemiste of valse slagen vertekenen de waarde, en afwijkende slagen kunnen zich voordoen als variabiliteit [S2].
- Alledaagse omstandigheden. Net als bij andere HRV-maten kan één meting om gewone redenen afwijken; zie zulke verschuivingen als observaties, niet als oordelen.

## Wat laat het bewijs zien?

Vastgesteld. De definitie, de berekening en de rol van SDNN als maat voor de totale variabiliteit komen uit de meetstandaarden van het vakgebied [S1] en uit methodologische reviews [S2, S3]. Haar afhankelijkheid van de meetduur is een kerneigenschap van de methode, geen nuance [S2]. In de klinische cardiologie is SDNN over de hele dag uit continue ecg een vastgestelde maat voor risicostratificatie bij patiëntengroepen [S2]. Gemiddeld dalen de waarden bij gezonde volwassenen met de leeftijd, met grote individuele verschillen [S4].

Afhankelijk van de context. Schattingen van wearables: waarden uit PPG kunnen onder gecontroleerde rustomstandigheden de HRV uit het ecg nauw volgen, maar de overeenstemming neemt af bij beweging en een zwak signaal, en gepoolde schattingen zijn niet te veralgemenen naar slaap of het dagelijks leven [S5, S6]. Het ecosysteem van Apple slaat HRV op als SDNN — een apparaatfeit met een eigen reikwijdte, geen gezondheidsclaim [S8, S9, S10].

Methodologische richtlijnen. Actuele richtlijnen raden consequente meetomstandigheden aan en een voorzichtige interpretatie in context van losse waarden, ook die van wearables [S7]. Dat is consensus van experts over meten en interpreteren — geen direct experimenteel bewijs over SDNN zelf.

Wat nog onzeker is: hoe nauw nachtelijke waarden van het type SDNN uit consumentenapparaten de SDNN uit het ecg volgen onder alledaagse omstandigheden — beweging, huidskleur, pasvorm van de sensor, slaapfasen — wordt nog in kaart gebracht [S5, S6]. En hoeveel van het klinische bewijs over de hele dag, gebouwd op continue ecg bij patiënten, over te zetten is naar nachtelijke horlogewaarden bij gezonde gebruikers, is een open vraag [S7].

## Wat SDNN je niet vertelt

- Het is niet uitwisselbaar met RMSSD. De twee maten vatten verschillende eigenschappen van dezelfde meting samen, en hun waarden horen bij verschillende meetregimes; een SDNN van een horloge en een RMSSD van een ring zijn geen twee dialecten van één getal [S2, S5].
- Het is geen meter voor vagale tonus. {{fact:claim.vagalTone}} [S2, S7]. SDNN leunt nog minder op de snelle parasympathische route dan RMSSD [S2].
- Het is geen diagnose en geen stressmeting. {{fact:claim.hrvNotStress}} [S1].
- Hoger is niet vanzelf beter. Een grotere spreiding kan komen van een sterker ritme — of van afwijkende slagen en ruis, die zich voordoen als variabiliteit en het getal opdrijven [S2].
- Waarden zijn niet uitwisselbaar tussen apparaten, apps en meetregimes [S5, S7].
- Eén waarde zegt weinig. Methodologische richtlijnen behandelen losse metingen als contextafhankelijk en raden een voorzichtige interpretatie in context aan [S7]; je eigen recente metingen onder vergelijkbare omstandigheden vormen de zinvollere vergelijking.

## In ONDA

De HRV-tabellen per leeftijd van ONDA zijn tabellen met nachtelijke RMSSD, maar de [HRV-calculator](/tools/hrv) heeft een aparte SDNN-modus voor getallen die van de Apple Watch komen, met bereiken uit korte ecg-rustmetingen bij gezonde volwassenen. De nachtelijke persoonlijke baseline van de app zelf is gebaseerd op de HRV-waarden die in Apple Health zijn opgeslagen — van de Apple Watch of van een ander apparaat dat hartgegevens daarheen synchroniseert. De documentatie is daar duidelijk over: {{fact:applewatch.hrv.healthkit}} [S8] — dus dat baselinesignaal is gebaseerd op SDNN en niet op RMSSD. De live-waarde tijdens een oefening is een vervangende maat, berekend uit de standaarddeviatie van de hartslag — geen SDNN en geen RMSSD — en de telefooncamera geeft je polsslag, geen HRV. ONDA beschrijft en vergelijkt je eigen getallen; het stelt geen diagnoses. Zie [wat ONDA meet](/measurements).

> Educatieve informatie, geen diagnose of medische behandeling.
