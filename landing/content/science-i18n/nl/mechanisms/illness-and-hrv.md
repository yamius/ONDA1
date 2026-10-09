---
sourceHash: 26f74cb4722e
title: "Ziekte en HRV: wat een wearable wel en niet kan zien"
metaTitle: "Ziekte en HRV: vroeg signaal, geen diagnose"
metaDescription: "Hoe ontsteking en infectie HRV en rusthartslag verschuiven, wat meldingen van wearables betekenen en waarom ze je niet kunnen vertellen dat je ziek bent."
shortAnswer: >
  Ontsteking en infectie verlagen meestal de hartslagvariabiliteit en verhogen
  de rusthartslag, maar het verband is een onderzoeksbevinding, geen test. De
  best onderzochte vroege waarschuwingen voor een infectie kwamen van een
  stijging van de rusthartslag, niet van de hartslagvariabiliteit. Stress,
  alcohol en reizen leiden tot dezelfde meldingen. Zo'n verandering is hooguit
  een niet-specifiek vroeg signaal dat het lichaam onder druk staat. Met
  klachten ga je naar een arts, niet naar je horloge.
keyPoints:
  - "In studies met wearables ging een lagere hartslagvariabiliteit, vooral SDNN, samen met hogere waarden van de ontstekingsmarker CRP, en de auteurs van de review noemen HRV van wearables een verkennende biomarker, geen diagnostisch hulpmiddel."
  - "De best onderzochte vroege waarschuwingen voor een infectie steunden op de rusthartslag ten opzichte van iemands eigen baseline, samen met stappen en slaap, niet op de hartslagvariabiliteit."
  - "In een prospectieve smartwatchstudie verschenen meldingen bij de meeste geïnfecteerde deelnemers vóór de klachten, maar ook stress, alcohol en reizen leidden tot meldingen."
  - "Na vaccinatie herstelden korte veranderingen in de hartslagvariabiliteit zich in de onderzochte studies binnen enkele dagen, met grotere veranderingen bij vrouwen en jongere mensen."
  - "Na een infectie voegden hartslaggegevens in één onderzoeksstudie maar weinig toe aan de klachten bij het herkennen van long covid."
  - "Een review van het vakgebied stelt dat het vermogen van wearables om virusinfecties in het dagelijks leven op te sporen nog niet is aangetoond."
  - "Een melding van een wearable is een niet-specifiek teken van belasting; ONDA toont je trend ten opzichte van je eigen baseline en herkent geen ziekte."
imageAlt: "Een dunne turquoise hartritmelijn op een donkere achtergrond wordt naast de vage omtrek van een thermometer een gloeiende oranje golf en keert dan terug naar rustige slagen."
evidenceMap:
  - claim: "In studies met wearables was SDNN meestal lager wanneer de ontstekingsmarker CRP verhoogd was (feiten illness.inflammation.studies, illness.inflammation.sdnnCrp)."
    limitation: "Telling van de richting van uitkomsten over heterogene observationele studies; geen gepoold effect; verbanden, geen oorzaak."
  - claim: "Verbanden tussen RMSSD en ontstekingsbevorderende cytokinen waren inconsistent."
    limitation: "Weinig cytokinestudies; verschillende apparaten en opnameduren."
  - claim: "De auteurs van de review beschouwen HRV van wearables als een verkennende of aanvullende biomarker van ontsteking, niet als een diagnostisch hulpmiddel."
    limitation: "Conclusie van de auteurs; geen enkele studie rapporteerde diagnostische nauwkeurigheid."
  - claim: "In een retrospectieve smartwatchanalyse vertoonden de meeste mensen met COVID veranderingen in hartslag, stappen of slaap, en een waarschuwingssysteem op basis van een stijging van de rusthartslag ten opzichte van de persoonlijke baseline had veel gevallen vóór de klachten kunnen signaleren (feiten illness.mishra.cohort, illness.mishra.realtime)."
    limitation: "Eén studie met weinig geïnfecteerden; retrospectieve simulatie; de detectie gebruikte rusthartslag, stappen en slaap, niet HRV."
  - claim: "In een prospectieve studie signaleerde een realtime waarschuwingssysteem op basis van hartslag en stappen van smartwatches de meeste infecties, meestal enkele dagen vóór de klachten (feiten illness.alavi.cohort, illness.alavi.alerts, illness.alavi.lead)."
    limitation: "Eén cohort van dezelfde groep als de retrospectieve studie; infectie bevestigd met tests, niet door het apparaat; hartslag en stappen, niet HRV."
  - claim: "Ook stress, alcohol, reizen en andere luchtweginfecties leidden tot meldingen, minder vaak dan COVID (feit illness.alavi.otherEvents)."
    limitation: "Oorzaken van gebeurtenissen zelf gerapporteerd in vragenlijsten; de frequentie van meldingen hangt af van het algoritme en de drempels ervan."
  - claim: "Na COVID-vaccinatie veranderde de HRV, vooral RMSSD, kortdurend en herstelde zich binnen enkele dagen (feiten vaccine.kwon.studies, vaccine.kwon.recovery)."
    limitation: "Weinig observationele studies van beperkte kwaliteit; HRV op lange termijn niet gerapporteerd."
  - claim: "In sommige studies was de verandering in RMSSD na vaccinatie groter bij vrouwen dan bij mannen en bij jongere dan bij oudere mensen."
    limitation: "Slechts door een deel van de studies gerapporteerd; kleine steekproeven."
  - claim: "In één cohort verbeterde het toevoegen van hartslagkenmerken van een wearable aan de klachten een machinelearningmodel voor het herkennen van long covid slechts in beperkte mate (feiten longcovid.uwakwe.cohort, longcovid.uwakwe.gain)."
    limitation: "Eén cohort; geen externe validatie; resultaten van machine learning zien er vaak beter uit dan ze in nieuwe gegevens blijken te zijn; onderzoeksinstrument, geen klinische test."
  - claim: "Een review van het vakgebied stelt dat virusinfecties hartslag, ademfrequentie, HRV, temperatuur, activiteit en slaap al vóór de klachten kunnen veranderen."
    limitation: "Narratieve review; vooral studies uit de pandemieperiode; enkele auteurs in dienst van een bedrijf dat wearablegegevens analyseert."
  - claim: "Dezelfde review stelt dat het vermogen van wearables om virusinfecties in een dagelijkse omgeving op te sporen niet is aangetoond."
    limitation: "Geschreven voordat de prospectieve studie hierboven in definitieve vorm verscheen; die studie test geen dagelijks gebruik buiten een onderzoekscohort."
  - claim: "ONDA bouwt zijn baseline op uit nachtelijke Apple Health-waarden en vergelijkt elke nacht met de eigen bandbreedte van de gebruiker (feiten baseline.window, baseline.compare, baseline.floors, onda.signal.cadence)."
    limitation: "Beschrijft alleen het gedrag van de app; geen bewijs voor een gezondheidsclaim."
---

## Waarom kan ziekte HRV verschuiven?

Hartslagvariabiliteit (HRV) is de variatie, van slag tot slag, in de tijd tussen twee hartslagen. Ontsteking, de reactie van het lichaam op infectie of letsel, verschuift vermoedelijk de balans van het autonome zenuwstelsel: minder vagale en meer sympathische activiteit. Daarom onderzoeken wetenschappers of HRV van een wearable ontsteking kan weerspiegelen.

De enige systematische review over deze vraag bracht de richting van de bevindingen uit {{fact:illness.inflammation.studies}} samen [S1]. Als de ontstekingsmarker CRP (C-reactief proteïne) verhoogd was, was SDNN lager in {{fact:illness.inflammation.sdnnCrp}} [S1]. Voor RMSSD en ontstekingsbevorderende cytokinen waren de resultaten wisselend en meestal niet significant [S1]. Apparaten die een ecg opnamen gaven consistentere resultaten dan optische hartslagsensoren [S1].

De auteurs trekken een voorzichtige conclusie. Op dit moment moet HRV van wearables worden gezien als "een verkennende of aanvullende biomarker" [S1]. Geen van de opgenomen studies testte hoe nauwkeurig HRV ontsteking kan herkennen [S1]. Het verband is dus echt op groepsniveau, maar het is een onderzoeksbevinding, geen test.

## Wat heeft een infectie vroeg opgepikt?

Dit is de kern van deze pagina: de best onderzochte vroege waarschuwingen voor een infectie draaiden niet op HRV. Ze draaiden op de rusthartslag vergeleken met iemands eigen baseline, samen met dagelijkse stappen en slaap ([rusthartslag](/science/measurements/resting-heart-rate)).

Een retrospectieve analyse uit Stanford bekeek smartwatchgegevens van {{fact:illness.mishra.cohort}} [S2]. De meesten van hen hadden rond de ziekte veranderingen in hartslag, dagelijkse stappen of slaapduur [S2]. Een waarschuwingssysteem op basis van een sterke stijging van de rusthartslag ten opzichte van de persoonlijke baseline had {{fact:illness.mishra.realtime}} kunnen signaleren voordat de klachten begonnen [S2]. Dit is één studie met weinig geïnfecteerden, en de meldingen werden achteraf gesimuleerd, niet in realtime verstuurd.

Dezelfde groep testte daarna realtime meldingen in een prospectieve studie met {{fact:illness.alavi.cohort}} [S3]. Het systeem gebruikte hartslag en stappen van smartwatches [S3]. Het stuurde meldingen vóór of zonder klachten bij {{fact:illness.alavi.alerts}}, en de eerste signalen kwamen {{fact:illness.alavi.lead}} [S3]. De infectie werd met tests bevestigd, niet door het horloge.

Dit zijn drie studies van één onderzoeksgroep, dus ze bevestigen elkaar niet onafhankelijk. Bij de eerste studie promootte Fitbit het onderzoek en schonk het apparaten, en de senior auteur van alle drie de studies heeft meerdere gezondheidstechnologiebedrijven mede opgericht en adviseert die [S2] [S3] [S4]. Studies met wearables naar de ademfrequentie tijdens COVID wijzen in een vergelijkbare richting ([ademfrequentie](/science/measurements/respiratory-rate)).

## Wat betekent een melding eigenlijk?

<!-- myth-debunk -->
Een veelgehoorde overtuiging is dat een daling van je HRV of een melding van je apparaat betekent dat je ziek wordt. De prospectieve studie laat zien waarom dat niet volgt. Andere luchtweginfecties, en ook gebeurtenissen zonder enige infectie, zoals stress, alcohol en reizen, leidden eveneens tot meldingen [S3]. De melding ging dus ook af bij mensen die niet met het coronavirus besmet waren, al minder vaak: gemiddeld {{fact:illness.alavi.otherEvents}} [S3]. Een melding zegt dat iets afwijkt van je gebruikelijke patroon, niet wat de oorzaak is.

Een nacht na het drinken is een typisch voorbeeld: HRV daalt en de rusthartslag stijgt, zonder dat er ziekte in het spel is ([alcohol en HRV](/science/mechanisms/alcohol-and-hrv)). Kort slapen, een late maaltijd, zware training en reizen bewegen dezelfde waarden ([waarom HRV van dag tot dag verandert](/science/mechanisms/hrv-day-to-day); [HRV en hartslag tijdens de slaap](/science/mechanisms/sleep-and-hrv)). {{fact:claim.hrvNotStress}}.

## En vaccinatie?

Een vaccin is een geplande uitdaging voor het immuunsysteem, dus het laat zien wat een korte immuunreactie met HRV doet. Een systematische review vond {{fact:vaccine.kwon.studies}} die HRV na COVID-vaccinatie hadden gemeten [S5]. De HRV, vooral RMSSD, veranderde kortdurend en herstelde zich {{fact:vaccine.kwon.recovery}} na de vaccinatie [S5]. In sommige studies was de verandering groter bij vrouwen dan bij mannen, en bij jongere dan bij oudere mensen [S5]. Er waren weinig studies, van beperkte kwaliteit, en HRV op lange termijn werd niet gerapporteerd [S5]. Een korte daling in de dagen na een vaccinatie past bij dit patroon. De review beoordeelt vaccinatie zelf niet, en deze pagina doet dat ook niet.

## En de periode na een ziekte?

Sommige mensen houden maandenlang klachten na een infectie; dat heet long covid. De groep uit Stanford bouwde machinelearningmodellen met hartslaggegevens van {{fact:longcovid.uwakwe.cohort}} [S4]. Het toevoegen van hartslagkenmerken aan de klachten gaf {{fact:longcovid.uwakwe.gain}} [S4]. De auteurs zien hierin een mogelijke objectieve biomarker [S4]. Het is één cohort zonder test bij nieuwe mensen, dus het resultaat is een onderzoeksrichting, geen manier om long covid met een horloge te herkennen.

## Wat laat het bewijs zien?

**Wat we niet weten.** Een review van het vakgebied, geschreven door onderzoekers die met wearablegegevens werken, stelt dat virusinfecties hartslag, ademfrequentie, HRV, temperatuur, activiteit en slaap al vóór de klachten kunnen veranderen [S6]. Ze stelt ook dat "het vermogen van wearables om virusinfecties in een dagelijkse omgeving op te sporen nog moet worden aangetoond" [S6]. Drie van de auteurs waren in dienst van physIQ, een bedrijf dat wearablegegevens analyseert [S6].

**Per bewijsklasse.**

- **Opkomend.** SDNN van wearables is meestal lager als CRP verhoogd is [S1]. Een stijging van de rusthartslag ten opzichte van de persoonlijke baseline ging in onderzoekscohorten bij veel infecties vooraf aan de klachten [S2] [S3]. Stress, alcohol en reizen leiden tot dezelfde meldingen [S3]. Veranderingen in HRV na vaccinatie zijn kort en herstellen binnen dagen [S5]. Hartslaggegevens voegden in één studie weinig toe aan de klachten voor long covid [S4].
- **Onbekend.** Of een consumentenwearable een virusinfectie in het dagelijks leven betrouwbaar kan opsporen [S6].

## Wat het je niet vertelt

- **Een wearable stelt geen infectie vast.** De auteurs van de review noemen HRV van wearables een verkennende biomarker [S1], en opsporing in het dagelijks leven is niet aangetoond [S6].
- **Een melding vertelt je de oorzaak niet.** Infectie, stress, alcohol en reizen kunnen dezelfde verandering geven [S3].
- **HRV was niet het belangrijkste vroege signaal.** De best onderzochte vroege waarschuwingen steunden op rusthartslag, stappen en slaap [S2] [S3].
- **Een normale waarde sluit ziekte niet uit.** Veel geïnfecteerde mensen in de studies kregen geen melding [S3].
- **Het geeft geen advies over tests, behandeling of vaccinatie.**
- **Populatiegegevens zijn geen voorspelling voor jou.** De studies beschrijven groepen mensen; je eigen patroon kan anders zijn.

## Wat kun je doen bij een duidelijke daling?

Ligt je HRV een paar dagen achter elkaar duidelijk onder je gebruikelijke bereik en is je rusthartslag hoger, zie het dan als een niet-specifiek vroeg signaal dat je lichaam onder druk staat. Het is een reden om rust te nemen en te letten op hoe je je voelt. Heb je klachten, ga dan naar een arts in plaats van op je horloge te vertrouwen. Eén lage nacht is meestal geen reden tot zorg ([HRV interpreteren](/science/concepts/interpreting-hrv)).

## In ONDA

ONDA bouwt een persoonlijke baseline op uit nachtelijke waarden die in Apple Health zijn opgeslagen — van een Apple Watch of een ander apparaat dat hartgegevens daarheen synchroniseert [S7]. Het venster is {{fact:baseline.window}}, en {{fact:baseline.compare}}: {{fact:baseline.floors}}, met {{fact:onda.signal.cadence}}. {{fact:applewatch.hrv.healthkit}}, dus de HRV-trend van ONDA is een SDNN-trend ([je HRV-baseline](/science/concepts/hrv-baseline)). Zo'n signaal is beschrijvend: het zegt dat een nacht buiten je eigen bandbreedte valt, niet waarom. Een infectie, een korte nacht, alcohol of reizen kunnen het allemaal veroorzaken. ONDA herkent geen ziekte, stelt geen diagnose van welke aandoening dan ook en vervangt geen arts.

> Educatieve informatie, geen diagnose of medische behandeling.
