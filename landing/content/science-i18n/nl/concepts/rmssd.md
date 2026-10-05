---
sourceHash: "7b68393346e3"
title: "RMSSD — wat deze HRV-maat weerspiegelt en wat niet"
metaTitle: "RMSSD: definitie, betekenis en meting"
metaDescription: "RMSSD is een HRV-maat die vagaal gemedieerde veranderingen in de hartslag weerspiegelt. Wat ze meet, hoe wearables haar schatten en wat ze niet zegt."
shortAnswer: >
  RMSSD is een maat voor hartslagvariabiliteit (HRV): de wortel van het
  gemiddelde van de gekwadrateerde verschillen tussen opeenvolgende hartslagen.
  Ze wordt gebruikt om de variatie van slag tot slag in korte metingen samen te
  vatten en weerspiegelt vagaal gemedieerde veranderingen in de hartslag. Ze
  wordt beïnvloed door leeftijd, ademhaling, lichaamshouding, tijdstip van de dag
  en meetmethode. Op zichzelf stelt ze geen stress, gezondheidstoestand of
  vagale tonus vast.
keyPoints:
  - "RMSSD vat samen hoeveel het interval tussen hartslagen van de ene slag op de volgende verandert."
  - "Ze weerspiegelt vagaal gemedieerde veranderingen in de hartslag en is daardoor een standaardmaat voor korte metingen in HRV-onderzoek."
  - "Vagale tonus is niet rechtstreeks te meten; RMSSD is een indirecte benadering, en producten die iets anders beweren, vereenvoudigen."
  - "Wearables schatten RMSSD uit het polssignaal, en hoe goed dat met het ecg overeenkomt, hangt af van het apparaat en de omstandigheden."
  - "Waarden hangen af van de context: meetmethode, meetduur, lichaamshouding, ademhaling en tijdstip doen er allemaal toe."
  - "Eén RMSSD-waarde is geen diagnose en geen stressmeting; trends ten opzichte van je persoonlijke baseline zeggen meestal meer."
imageAlt: "Een dunne turquoise hartritmelijn op een witte achtergrond, met een licht wisselende afstand tussen de slagen — een beeld van hartslagvariabiliteit van slag tot slag."
evidenceMap:
  - claim: "RMSSD is de wortel van het gemiddelde van de gekwadrateerde opeenvolgende verschillen tussen naburige hartslagen; het is de voorkeursmaat voor korte metingen."
    limitation: "Een definitie en methodologische standaard; zegt op zichzelf niets over iemands gezondheid."
  - claim: "SDNN beschrijft de totale spreiding van de intervallen in een meting, terwijl RMSSD de verschillen tussen naburige slagen isoleert."
    limitation: "Definities; vergelijkbaarheid vraagt om dezelfde meetduur en dezelfde omstandigheden."
  - claim: "RMSSD weerspiegelt vagaal gemedieerde veranderingen in de hartslag; vagale tonus is niet rechtstreeks te meten."
    limitation: "Een indirecte benadering onder de meetomstandigheden, geen directe maat voor parasympathische activiteit."
  - claim: "De ademhaling schrijft zich via respiratoire sinusaritmie in de intervallen van slag tot slag, dus ademfrequentie en ademdiepte tijdens de meting bepalen RMSSD sterk."
    limitation: "Het effect treedt op tijdens de meting; blijvende veranderingen na oefenen zijn een aparte vraag."
  - claim: "RMSSD hangt af van de meetcontext: meetmethode, meetduur, lichaamshouding, ademhaling en tijdstip van de dag."
    limitation: "Grootte en richting van contexteffecten verschillen per maat, situatie en persoon; ondersteund door gepoolde normwaarden en methodologische richtlijnen."
  - claim: "De meeste gepubliceerde referentiewaarden komen uit korte metingen overdag, terwijl wearables voor consumenten vooral nachtelijke waarden tonen."
    limitation: "Referentiegroepen en protocollen verschillen tussen studies; geen persoonlijke norm."
  - claim: "Gepoolde RMSSD in rust uit korte metingen overdag is een gepoold daggemiddelde, geen nachtelijke waarde en geen leeftijdsnorm."
    limitation: "Gepoold uit heterogene korte protocollen bij gezonde volwassenen; grote individuele verschillen."
  - claim: "HRV-schattingen van wearables op basis van fotoplethysmografie (PPG) komen onder sommige omstandigheden overeen met waarden uit het ecg en wijken onder andere af."
    limitation: "Overeenstemming hangt af van maat, apparaat en omstandigheden; op deze pagina staan geen nauwkeurigheidscijfers."
  - claim: "Gemiddeld daalt RMSSD bij gezonde volwassenen met de leeftijd, terwijl mensen onderling sterk verschillen."
    limitation: "Gemiddelden uit dwarsdoorsnedeonderzoek; grote individuele verschillen op elke leeftijd."
  - claim: "RMSSD verschilt tussen vrouwen en mannen, waarbij richting en grootte van het verschil afhangen van leeftijd en populatie."
    limitation: "Observationele gegevens bij gezonde groepen; groepsgemiddelden, geen individuele verwachtingen."
  - claim: "Alledaagse omstandigheden kunnen één meting verschuiven; daarom worden herhaalde metingen onder vergelijkbare omstandigheden aangeraden."
    limitation: "Individuele reacties verschillen; effectgroottes hangen af van persoon en dosis en worden hier niet gekwantificeerd."
  - claim: "Een hogere RMSSD gaat doorgaans samen met beter herstel, maar niet altijd; sommige ritmestoornissen veranderen het patroon van slag tot slag zelf."
    limitation: "Verbanden op bevolkingsniveau; geen persoonlijk oordeel."
  - claim: "Trends ten opzichte van iemands persoonlijke baseline, gemeten onder vergelijkbare omstandigheden, zeggen meer dan één meting."
    limitation: "Methodologische richtlijn (consensus van experts), geen direct experimenteel bewijs; een aanbeveling voor de interpretatiepraktijk, geen klinische bevinding."
  - claim: "Apple Health registreert HRV als SDNN — het al lang bestaande HealthKit-type dat de Apple Watch automatisch vastlegt."
    limitation: "Officiële documentatie; beschrijft wat het apparaat vastlegt, niet wat de waarden voor de gezondheid betekenen; beperkt tot het ecosysteem van Apple."
  - claim: "Recente Apple Watch-modellen met watchOS tonen twee HRV-varianten — Recovery HRV en Overall HRV — en meten HRV zo vaak als elke vijf minuten."
    limitation: "Aankondiging van de fabrikant; beperkt tot bepaalde hardware- en OS-versies; Apple heeft niet bekendgemaakt hoe Recovery HRV wordt berekend."
  - claim: "iOS en watchOS voegen een RMSSD-gegevenstype toe aan Apple Health."
    limitation: "Officiële documentatie; beschikbaarheid beperkt tot bepaalde OS-versies; wat apps via dit type vastleggen, verschilt per app."
---

## Wat is RMSSD?

RMSSD is een van de standaardmaten voor [hartslagvariabiliteit](/glossary/heart-rate-variability) (HRV) — de natuurlijke variatie in de tijd tussen opeenvolgende hartslagen. In de meetstandaarden van het vakgebied is ze precies gedefinieerd: {{fact:hrv.rmssd.definition}} [S1].

In gewone taal: neem de intervallen tussen naburige hartslagen, kijk hoeveel elk interval van het volgende verschilt, en vat die verschillen samen in één waarde in milliseconden. Een grotere waarde betekent dat het ritme meer verandert van slag tot slag.

Meestal staat ze naast een tweede tijdsdomeinmaat — {{fact:hrv.sdnn.definition}} [S1]. De twee beantwoorden verschillende vragen: SDNN beschrijft de totale spreiding van de intervallen in een meting, terwijl RMSSD de veranderingen van slag tot slag isoleert. Door die focus is RMSSD de voorkeursmaat bij korte metingen [S1, S2].

## Hoe werkt RMSSD?

Het hart is geen metronoom. Het interval tussen twee slagen wordt voortdurend bijgestuurd door het autonome zenuwstelsel, en de snelste van die aanpassingen — de vagale (parasympathische) invloed op het hart — werkt van de ene slag op de volgende [S2, S3]. RMSSD vangt precies die tijdschaal: hoeveel het ritme verandert tussen naburige slagen.

Daarom wordt RMSSD gelezen als een venster op vagaal gemedieerde veranderingen in de hartslag. De formulering doet ertoe. {{fact:claim.vagalTone}} [S2, S3].

De ademhaling laat in hetzelfde venster een sterke afdruk achter. Bij elke inademing versnelt het hart een beetje, bij elke uitademing vertraagt het — een verschijnsel dat respiratoire sinusaritmie (RSA) heet [S2, S3]. Langzaam, rustig ademen verdiept deze golf, en een meting tijdens zo'n oefening valt meestal hoger uit dan een meting bij een snelle ademfrequentie. Dat is een meetobservatie over waarop de waarde reageert — geen bewijs dat er iets blijvends is getraind.

## Hoe wordt RMSSD gemeten?

De berekening is eenvoudig. Uit een reeks intervallen van slag tot slag: neem het verschil tussen elk paar naburige intervallen, kwadrateer die verschillen, neem het gemiddelde en trek daar de wortel uit [S1]. Alles wat RMSSD weet, hangt af van de nauwkeurigheid van die intervallen — daarom doet de meetmethode er meer toe dan het rekenwerk.

De referentiemethode is een ecg, dat de elektrische afdruk van elke hartslag registreert. Wearables schatten de intervallen in plaats daarvan uit het polssignaal aan de huid (fotoplethysmografie, PPG); het resultaat heet vaak polsslagvariabiliteit. De overeenstemming tussen de twee hangt af van de maat en de omstandigheden — meestal beter in rust en bij een goed signaal, zwakker bij beweging of slecht contact [S6, S7]. Een praktisch detail voor wie een Apple Watch draagt: {{fact:applewatch.hrv.healthkit}} [S9]. Op recente hardware geldt: {{fact:applewatch.hrv.variants2026}} [S10]. Apple heeft niet bekendgemaakt hoe Recovery HRV wordt berekend. Daarnaast geldt: {{fact:applewatch.hrv.rmssdType}} [S11], waardoor apps een waarde van het type RMSSD uit Apple Health kunnen lezen.

De context hoort bij de meting. RMSSD hangt af van lichaamshouding, ademhaling, tijdstip van de dag en de meetduur [S5, S8]. De meeste gepubliceerde referentiewaarden zijn verzameld in korte metingen overdag onder gecontroleerde omstandigheden [S5], terwijl wearables voor consumenten vooral nachtgemiddelden tonen — verschillende contexten, waarvan de waarden niet direct uitwisselbaar zijn. Ter vergelijking: gepoolde RMSSD in rust uit korte metingen overdag bedraagt {{fact:hrv.pooled.daytime}} [S5] — een gepoold daggemiddelde, geen nachtelijke waarde en geen leeftijdsnorm. De tabellen per leeftijdsgroep die ONDA publiceert, zijn tabellen met nachtelijke RMSSD en staan in het artikel [normale HRV per leeftijd](/articles/normal-hrv-by-age). Voor een consequente persoonlijke meetroutine is de praktische kant te vinden in de gids [HRV consequent meten](/articles/how-to-measure-hrv-consistently).

## Wat beïnvloedt RMSSD?

- Leeftijd. {{fact:hrv.age.trend}} [S4, S5]. Mensen verschillen op elke leeftijd sterk; medianen van de bevolking zijn geen persoonlijke doelen. De volledige tabellen staan in het artikel [normale HRV per leeftijd](/articles/normal-hrv-by-age).
- Geslacht. Studies melden verschillen tussen vrouwen en mannen, waarbij richting en grootte afhangen van leeftijd en populatie [S4].
- Ademhaling. De belangrijkste factor op korte termijn, via respiratoire sinusaritmie: ademfrequentie en ademdiepte tijdens de meting veranderen de waarde [S2, S3].
- Omstandigheden. Lichaamshouding, tijdstip van de dag en slapen of wakker zijn veranderen allemaal wat hetzelfde hart tijdens de meting doet [S5, S8].
- Alledaagse omstandigheden. Eén meting kan van de ene dag of nacht op de andere verschuiven; daarom worden herhaalde metingen onder vergelijkbare omstandigheden aangeraden [S2, S8].

## Wat laat het bewijs zien?

Vastgesteld. De definitie, de berekening en de rol van RMSSD als HRV-maat voor korte metingen komen uit de meetstandaarden van het vakgebied [S1]. De lezing ervan als weerspiegeling van vagaal gemedieerde veranderingen in de hartslag — waarbij de vagale tonus zelf niet rechtstreeks te meten is — is de standaardinterpretatie in methodologische reviews [S2, S3]. De meetcontext is een hoofdfactor, geen voetnoot: methode, meetduur, lichaamshouding, ademhaling en tijdstip bepalen allemaal de waarde [S5, S8]. Gemiddeld daalt RMSSD bij gezonde volwassenen met de leeftijd [S4, S5].

Afhankelijk van de context. Schattingen van wearables: waarden uit PPG kunnen onder gunstige omstandigheden de HRV uit het ecg volgen, en de twee lopen uiteen bij beweging, slecht contact of een zwak signaal [S6, S7]. Referentiewaarden: de meeste klassieke bereiken komen uit korte metingen overdag, niet uit de nachtelijke waarden die consumentenapparaten tonen [S5].

Methodologische richtlijnen. Actuele richtlijnen voor zorgvuldig HRV-onderzoek raden gestandaardiseerde, herhaalbare meetomstandigheden aan en een voorzichtige interpretatie van losse waarden [S8]. Dat is consensus van experts over meten en interpreteren — geen direct experimenteel bewijs over RMSSD zelf.

Wat nog onzeker is: hoe nauw waarden van het type RMSSD uit consumentenapparaten de RMSSD uit het ecg volgen onder alledaagse omstandigheden — beweging, huidskleur, pasvorm van de sensor, slaapfasen — wordt nog in kaart gebracht [S6, S7]. En hoeveel van het langetermijnbeeld uit onderzoek, grotendeels gebouwd op ecg in gecontroleerde settings, over te zetten is naar nachtelijke consumentenwaarden bij gezonde gebruikers, is een open vraag [S8].

## Wat RMSSD je niet vertelt

- Het is geen meter voor vagale tonus. {{fact:claim.vagalTone}} [S2, S3].
- Het is geen diagnose en geen stressmeting. {{fact:claim.hrvNotStress}} [S1].
- Hoger is niet vanzelf beter. Een hogere RMSSD gaat doorgaans samen met beter herstel, maar sommige ritmestoornissen veranderen het patroon van slag tot slag zelf, en een hoge waarde betekent in die situatie iets anders [S2].
- Waarden zijn niet uitwisselbaar tussen apparaten, apps en meetomstandigheden [S6, S8].
- Eén waarde zegt weinig. Methodologische richtlijnen raden aan metingen te vergelijken met je persoonlijke baseline, gemeten onder vergelijkbare omstandigheden, in plaats van betekenis te lezen in één losse waarde [S8].

## In ONDA

ONDA gebruikt nachtelijke RMSSD als referentiemaat in zijn HRV-normtabellen en in de [HRV-calculator](/tools/hrv). De nachtelijke persoonlijke baseline van de app zelf leest echter de HRV-waarden die Apple Health opslaat, en {{fact:applewatch.hrv.healthkit}} [S9] — dus dat baselinesignaal is gebaseerd op SDNN en niet op RMSSD. De live-waarde tijdens een oefening is een vervangende maat, berekend uit de standaarddeviatie van de hartslag — geen RMSSD en geen SDNN — en de telefooncamera geeft je polsslag, geen HRV. ONDA beschrijft en vergelijkt je eigen getallen; het stelt geen diagnoses. Zie [wat ONDA meet](/measurements).

> Educatieve informatie, geen diagnose of medische behandeling.
