---
sourceHash: "f848794fbee9"
title: "SDNN: was dieses HRV-Maß misst und was nicht"
metaTitle: "SDNN: Definition, Bedeutung und Apple Health"
metaDescription: "Die SDNN ist das HRV-Maß, das Apple Health speichert. Was sie misst, wie sie sich von der RMSSD unterscheidet und warum sich beide Zahlen nicht vergleichen lassen."
shortAnswer: >
  Die SDNN ist ein Maß der Herzfrequenzvariabilität: die Standardabweichung
  der Intervalle zwischen normalen Herzschlägen. Sie fasst die Gesamtstreuung
  des Herzrhythmus über eine Aufzeichnung zusammen und wächst mit der
  Messdauer, daher sind Werte aus verschiedenen Geräten, Apps und Messregimen
  nicht direkt vergleichbar. Sie ist das Maß, das Apple Health speichert. Für
  sich genommen belegt sie weder Stress noch Gesundheitszustand oder autonomes
  Gleichgewicht.
keyPoints:
  - "Die SDNN fasst die Gesamtstreuung der Intervalle zwischen normalen Herzschlägen innerhalb einer Aufzeichnung zusammen."
  - "Sie spiegelt die gesamte Variabilität wider: Beide Äste des autonomen Nervensystems und langsamere Rhythmen tragen zu ihr bei."
  - "Die SDNN hängt von der Messdauer ab, daher sind kurze Laborwerte, Ganztagswerte aus dem Langzeit-EKG (Holter) und nächtliche Werte einer Uhr nicht austauschbar."
  - "Apple Health speichert die HRV als SDNN, deshalb lassen sich Werte der Apple Watch nicht direkt mit RMSSD-Werten anderer Wearables vergleichen."
  - "Wearables schätzen die SDNN aus dem Pulssignal, und ihre Übereinstimmung mit dem EKG hängt vom Gerät und den Bedingungen ab."
  - "Ein einzelner SDNN-Wert ist weder eine Diagnose noch eine Stressmessung; dein eigener Verlauf unter vergleichbaren Bedingungen ist aussagekräftiger."
imageAlt: "Eine Reihe unterschiedlich langer Herzschlagintervalle über einer Punktverteilung dieser Intervalle, mit einer türkisfarbenen Klammer, die ihre Streuung um den Durchschnitt markiert – die Idee, die die SDNN zusammenfasst."
evidenceMap:
  - claim: "Die SDNN ist die Standardabweichung der Intervalle zwischen normalen Herzschlägen über eine Aufzeichnung."
    limitation: "Ein definitorischer und methodischer Standard; für sich genommen sagt er nichts über den Gesundheitszustand."
  - claim: "Normal bedeutet, dass abnorme und ektope Schläge entfernt werden, bevor die Statistik berechnet wird."
    limitation: "Beschreibt die Datenbereinigung; wie streng Schläge gefiltert werden, unterscheidet sich zwischen Algorithmen und Geräten."
  - claim: "Die SDNN spiegelt alle zyklischen Komponenten wider, die während der Aufzeichnung zur Variabilität beitragen; sie fasst die gesamte Variabilität zusammen statt eines einzelnen Astes des autonomen Nervensystems."
    limitation: "Eine Eigenschaft der Statistik; die Mischung der Rhythmen verschiebt sich mit Messdauer und Bedingungen."
  - claim: "Die SDNN hängt von der Messdauer ab: Längere Aufzeichnungen nehmen langsamere Rhythmen auf und liefern größere Werte, daher lassen sich SDNN-Werte aus unterschiedlich langen Aufzeichnungen nicht vergleichen."
    limitation: "Eine methodische Eigenschaft des Maßes; sie betrifft jeden Vergleich zwischen Apps, Studien und Protokollen."
  - claim: "Normwerte der HRV für Ganztags-, Kurzzeit- und Ultrakurzzeitaufzeichnungen sind nicht austauschbar."
    limitation: "Betrifft Normwerte in gesunden und klinischen Populationen; nächtliche Werte aus Verbrauchergeräten sind ein weiterer, anderer Kontext."
  - claim: "Beide Äste des autonomen Nervensystems tragen zur SDNN bei, und sie hängt eng mit den langsameren Frequenzbändern und der Gesamtleistung zusammen."
    limitation: "Physiologische Überlegung auf Bevölkerungsebene; das Verhältnis der Beiträge verschiebt sich mit den Messbedingungen."
  - claim: "Längere Aufzeichnungen nehmen langsamere Rhythmen auf – wechselnde Belastungen, Konditionierung und zirkadiane Prozesse –, die jeweils zur Streuung beitragen."
    limitation: "Erklärt, warum die Fensterlänge wichtig ist, nicht, was ein einzelnes Fenster über einen Menschen aussagt."
  - claim: "Die RMSSD wird stärker vom parasympathischen Ast beeinflusst als die SDNN, deshalb können sich die beiden Maße unterschiedlich bewegen."
    limitation: "Eine relative Aussage zwischen den Maßen, kein Maß der parasympathischen Aktivität in einem von beiden."
  - claim: "Der Vagustonus lässt sich nicht direkt messen, und die HRV ist kein spezifischer Marker für den sympathischen Ausstrom oder das sympathovagale Gleichgewicht."
    limitation: "Ein methodischer Vorbehalt aus Leitlinien und Übersichtsarbeiten; SDNN-Werte lassen sich nicht in autonome Messwerte übersetzen."
  - claim: "In der klinischen Kardiologie ist die aus Ganztags-EKG berechnete SDNN ein Maß zur Risikostratifizierung in Patientengruppen."
    limitation: "Klinische Populationen mit kontinuierlichem Krankenhaus-EKG; nicht übertragbar auf Werte von Verbraucheruhren."
  - claim: "In kurzen Ruheaufzeichnungen ist die atemgekoppelte Schwankung der Herzfrequenz die dominierende Quelle der SDNN-Variation."
    limitation: "Gilt für das Messfenster; es ist eine Messbeobachtung, kein Beleg für eine dauerhafte Veränderung."
  - claim: "PPG-basierte HRV-Schätzungen von Wearables stimmen unter manchen Bedingungen mit EKG-Werten überein und weichen unter anderen ab; gepoolte Schätzungen sind kein Beleg für Austauschbarkeit."
    limitation: "Die Übereinstimmung hängt von Maß, Gerät und Bedingungen ab; auf dieser Seite werden keine Genauigkeitszahlen genannt."
  - claim: "Unter kontrollierten Ruhebedingungen kann die PPG am Handgelenk EKG-basierte HRV-Indizes eng nachbilden, während die Validierung unter realen Bedingungen begrenzt bleibt."
    limitation: "Validierung eines einzelnen Geräts bei Erwachsenen in Ruhe mit Sinusrhythmus; keine allgemeine Genauigkeitsaussage für Verbraucheruhren."
  - claim: "Apple Health erfasst die HRV als SDNN – berechnet als Standardabweichung der Interbeat-Intervalle zwischen normalen Herzschlägen und automatisch von der Apple Watch aufgezeichnet."
    limitation: "Offizielle Dokumentation; beschreibt, was das System aufzeichnet, nicht, was die Werte für die Gesundheit bedeuten; auf Apples Ökosystem beschränkt."
  - claim: "Neuere Apple-Watch-Modelle mit watchOS zeigen zwei HRV-Varianten – Recovery HRV und Overall HRV – und messen die HRV bis zu alle fünf Minuten."
    limitation: "Herstellerankündigung; auf bestimmte Hardware- und Betriebssystemversionen beschränkt; Apple hat nicht angegeben, wie Recovery HRV berechnet wird."
  - claim: "iOS und watchOS fügen Apple Health einen RMSSD-Datentyp hinzu."
    limitation: "Offizielle Dokumentation; Verfügbarkeit auf bestimmte Betriebssystemversionen beschränkt; was Apps über diesen Typ aufzeichnen, hängt von der jeweiligen App ab."
  - claim: "Im Durchschnitt nimmt die Herzfrequenzvariabilität bei gesunden Erwachsenen mit dem Alter ab, während sich Einzelne stark unterscheiden."
    limitation: "Querschnittliche Bevölkerungsdurchschnitte; große individuelle Unterschiede in jedem Alter; keine Alterstabellen auf dieser Seite."
  - claim: "Messdauer, Umgebung, Atmung und Auswertungsverfahren prägen den Wert und die Sorgfalt seiner Interpretation."
    limitation: "Expertenkonsens über Methoden; die Größe jedes Effekts hängt von Bedingungen und Person ab."
  - claim: "Einzelne Werte erfordern eine vorsichtige, eingeordnete Interpretation, statt isoliert gelesen zu werden."
    limitation: "Expertenkonsens zur Interpretationspraxis, keine direkten experimentellen Daten; der Vergleich mit deinem eigenen Verlauf unter vergleichbaren Bedingungen ist die praktische Folge."
  - claim: "Abnorme Schläge und Rauschen können sich als Variabilität tarnen und den Wert aufblähen."
    limitation: "Ein Hinweis zur Datenqualität; der Umgang mit Artefakten unterscheidet sich zwischen Geräten und Algorithmen."
---

## Was ist die SDNN?

Die SDNN ist eines der Standardmaße der [Herzfrequenzvariabilität](/glossary/heart-rate-variability) (HRV) – der natürlichen Schwankung der Zeit zwischen aufeinanderfolgenden Herzschlägen. In den Messstandards des Fachgebiets ist sie genau definiert: {{fact:hrv.sdnn.definition}} [S1]. Das „NN“ im Namen steht für normal-to-normal: Es zählen nur Intervalle zwischen normalen Herzschlägen, und abnorme Schläge werden entfernt, bevor die Statistik berechnet wird [S2].

Einfach gesagt: Man sammelt alle Intervalle zwischen benachbarten normalen Herzschlägen einer Aufzeichnung, schaut, wie weit sie um ihren Durchschnitt streuen, und drückt diese Streuung als einen einzigen Wert in Millisekunden aus. Ein größerer Wert bedeutet, dass der Rhythmus innerhalb dieses Fensters insgesamt stärker geschwankt hat.

Am häufigsten wird sie mit einem zweiten Zeitbereichsmaß verglichen, der {{fact:hrv.rmssd.definition}} [S1]. Die beiden beantworten unterschiedliche Fragen: Die RMSSD isoliert die Veränderungen zwischen benachbarten Schlägen, die SDNN fasst die Streuung der gesamten Aufzeichnung zusammen. Dieser Unterschied ist der Grund, warum sich SDNN- und RMSSD-Werte nicht direkt vergleichen lassen – und der Grund, warum es beide Maße gibt. Die [Seite zur RMSSD](/science/concepts/rmssd) behandelt die Schlag-zu-Schlag-Seite des Paares; diese Seite handelt von der Streuung.

## Wie funktioniert die SDNN?

Die SDNN ist eine Fensterstatistik: Alles, was den Herzrhythmus während der Aufzeichnung bewegt, trägt zu ihr bei. In einer kurzen Ruheaufzeichnung ist der dominierende Beitrag das atemgekoppelte Auf und Ab der Herzfrequenz – die respiratorische Sinusarrhythmie (RSA) –, daher erhöht langsames, ruhiges Atmen während einer Messung den Wert sichtbar [S2]. In längeren Aufzeichnungen kommen langsamere Rhythmen hinzu: Wechselnde Belastungen, konditionierte Reaktionen und der Schlaf-wach-Rhythmus tragen jeweils ihren Teil zur Streuung bei [S2].

Weil so viele Einflüsse in einer Zahl zusammenfließen, trennt die SDNN die beiden Äste des autonomen Nervensystems nicht – beide tragen bei [S2]. Deshalb lässt sie sich auch nicht als direkte Anzeige eines der beiden Äste lesen. Die Einordnung ist entscheidend. {{fact:claim.vagalTone}} [S2, S7]. Die RMSSD, die aus Differenzen zwischen benachbarten Schlägen gebildet wird, stützt sich stärker auf den schnellen parasympathischen Weg als die SDNN [S2] – ein Grund, warum die beiden Maße über dieselbe Aufzeichnung unterschiedliche Geschichten erzählen können.

Die lange Version des Maßes hat eine klinische Geschichte: Über Ganztags-EKG im Krankenhaus bei kardiologischen Patientinnen und Patienten berechnet, ist die SDNN ein Maß zur Risikostratifizierung [S2]. Diese Evidenz gehört zu einem Messregime – kontinuierliches klinisches EKG in Patientengruppen –, das eine Verbraucheruhr nicht nachbildet; sie sollte daher nicht auf einen nächtlichen Wert einer Uhr übertragen werden.

## Wie wird die SDNN gemessen?

Die Berechnung ist einfach: die Intervalle zwischen normalen Herzschlägen im Messfenster nehmen und ihre Standardabweichung berechnen [S1, S2]. Alles, was die SDNN weiß, hängt von der Genauigkeit dieser Intervalle ab – deshalb zählt die Messmethode mehr als die Arithmetik.

Die Referenzmethode ist das EKG, das die elektrische Signatur jedes Herzschlags erfasst. Wearables schätzen die Intervalle stattdessen aus dem Pulssignal an der Haut (Photoplethysmographie, PPG); das Ergebnis wird oft Pulsratenvariabilität (PRV) genannt. Die Übereinstimmung zwischen beiden hängt vom Maß und von den Bedingungen ab – in Ruhe und bei gutem Signal meist enger, bei Bewegung oder schlechtem Hautkontakt schwächer [S5, S6] –, und die bisher gepoolte Evidenz erstreckt sich nicht auf Schlaf oder Alltagsbedingungen [S5].

Die Länge der Aufzeichnung gehört zur Bedeutung des Werts. Eine kurze Laboraufzeichnung, ein Ganztags-Langzeit-EKG (Holter) und die gespeicherten Messungen einer Uhr sind drei verschiedene Messregime: Die SDNN wächst mit der Messdauer, und Werte aus solchen Regimen sind nicht austauschbar [S2]. Aus demselben Grund werden veröffentlichte Normwerte für Ganztags-, Kurzzeit- und Ultrakurzzeitaufzeichnungen als getrennte Welten behandelt [S2].

Hier kommt Apple ins Spiel. Eine praktische Folge für Nutzerinnen und Nutzer der Apple Watch: {{fact:applewatch.hrv.healthkit}} [S8]. Das ist eine Designentscheidung, kein wissenschaftliches Urteil darüber, welches Maß besser ist: Die SDNN ist die Berechnung, die HealthKit schon immer verwendet; die Dokumentation beschreibt sie als Standardabweichung der Interbeat-Intervalle zwischen normalen Herzschlägen, automatisch von der Uhr aufgezeichnet [S8]. Auf neuer Hardware gilt: {{fact:applewatch.hrv.variants2026}} [S9]. Apple hat nicht angegeben, wie Recovery HRV berechnet wird. Außerdem gilt: {{fact:applewatch.hrv.rmssdType}} [S10]; damit können Apps stattdessen einen RMSSD-Wert aus Apple Health auslesen – ein Schritt hin zu saubereren Vergleichen zwischen Geräten, auch wenn die bereits gesammelten Werte SDNN bleiben.

Zur praktischen Einordnung: Der [HRV-Rechner](/tools/hrv) hat einen SDNN-Modus für Werte, die von der Apple Watch stammen; die Alltagsgeschichte, warum Geräte nicht übereinstimmen, steht in [warum deine HRV auf jedem Gerät anders ist](/articles/hrv-different-every-device); und wie du deine eigenen Messungen vergleichbar hältst, erklärt [HRV konsequent gleich messen](/articles/how-to-measure-hrv-consistently).

## Was beeinflusst die SDNN?

- Messdauer. Der entscheidende Faktor für dieses Maß: Längere Fenster sammeln langsamere Rhythmen und größere Werte an, daher beschreiben eine kurze Messung und eine Ganztagsaufzeichnung verschiedene Welten [S2].
- Messbedingungen. Die Länge der Aufzeichnung, die Umgebung – Labor oder Alltag –, die Atmung und das Auswertungsverfahren prägen den Wert und die Sorgfalt jedes Vergleichs [S7].
- Alter. Im Durchschnitt nimmt die Herzfrequenzvariabilität bei gesunden Erwachsenen mit dem Alter ab [S4]; Einzelne unterscheiden sich stark, und Bevölkerungsdurchschnitte sind keine persönlichen Zielwerte. Alterstabellen finden sich im [HRV-Rechner](/tools/hrv) für SDNN-Werte der Apple Watch und im Artikel [normale HRV nach Alter](/articles/normal-hrv-by-age) für die nächtliche RMSSD.
- Atmung. Atemfrequenz und Atemtiefe während der Aufzeichnung verändern den Wert über die atemgekoppelte Schwankung, die sie in den Rhythmus schreiben [S2].
- Signalqualität. Übersehene oder falsch erkannte Schläge verzerren den Wert, und abnorme Schläge können sich als Variabilität tarnen [S2].
- Alltagsbedingungen. Wie bei anderen HRV-Maßen kann ein einzelner Wert aus ganz gewöhnlichen Gründen abweichen; solche Verschiebungen sind Beobachtungen, keine Urteile.

## Was zeigt die Evidenz?

Gesichert. Definition, Berechnung und die Rolle der SDNN als Maß der Gesamtvariabilität stammen aus den Messstandards des Fachgebiets [S1] und methodischen Übersichtsarbeiten [S2, S3]. Ihre Abhängigkeit von der Messdauer ist eine zentrale methodische Eigenschaft, keine Nebensache [S2]. In der klinischen Kardiologie ist die Ganztags-SDNN aus kontinuierlichem EKG in Patientengruppen ein etabliertes Maß zur Risikostratifizierung [S2]. Im Durchschnitt sinken die Werte bei gesunden Erwachsenen mit dem Alter, bei großen individuellen Unterschieden [S4].

Kontextabhängig. Schätzungen von Wearables: PPG-basierte Werte können der EKG-basierten HRV unter kontrollierten Ruhebedingungen eng folgen, doch bei Bewegung und schlechtem Signal lässt die Übereinstimmung nach, und gepoolte Schätzungen lassen sich nicht auf Schlaf oder Alltagsbedingungen verallgemeinern [S5, S6]. Apples Ökosystem speichert die HRV als SDNN – eine Gerätetatsache mit eigenem Geltungsbereich, keine Gesundheitsaussage [S8, S9, S10].

Leitlinie / Expertenkonsens. Aktuelle Leitlinien empfehlen gleichbleibende Messbedingungen und eine vorsichtige, eingeordnete Interpretation einzelner Werte, auch von Wearables [S7]. Das ist Expertenkonsens darüber, wie man misst und interpretiert – keine direkten experimentellen Daten über die SDNN selbst.

Was offen bleibt: Wie eng nächtliche SDNN-Werte von Verbrauchergeräten der EKG-basierten SDNN unter Alltagsbedingungen folgen – bei Bewegung, unterschiedlichen Hauttönen, Sitz des Sensors, Schlafphasen –, wird noch untersucht [S5, S6]. Und wie viel der klinischen Ganztagsevidenz, die auf kontinuierlichem EKG bei Patientinnen und Patienten beruht, sich auf nächtliche Werte einer Uhr bei gesunden Menschen übertragen lässt, ist eine offene Frage [S7].

## Was die SDNN dir nicht sagt

- Sie ist nicht mit der RMSSD austauschbar. Die beiden Maße fassen unterschiedliche Eigenschaften derselben Aufzeichnung zusammen, und ihre Werte gehören zu verschiedenen Messregimen; eine SDNN von der Uhr und eine RMSSD vom Ring sind nicht zwei Dialekte derselben Zahl [S2, S5].
- Sie ist kein Messgerät für den Vagustonus. {{fact:claim.vagalTone}} [S2, S7]. Die SDNN stützt sich noch weniger auf den schnellen parasympathischen Weg als die RMSSD [S2].
- Sie ist weder eine Diagnose noch eine Stressmessung. {{fact:claim.hrvNotStress}} [S1].
- Höher ist nicht automatisch besser. Eine größere Streuung kann von einem kräftigeren Rhythmus stammen – oder von abnormen Schlägen und Rauschen, die sich als Variabilität tarnen und die Zahl aufblähen [S2].
- Die Werte sind zwischen Geräten, Apps und Messregimen nicht austauschbar [S5, S7].
- Ein einzelner Wert sagt wenig. Methodische Leitlinien behandeln einzelne Werte als kontextabhängig und empfehlen eine vorsichtige, eingeordnete Interpretation [S7]; deine eigenen jüngsten Werte unter vergleichbaren Bedingungen sind der aussagekräftigere Vergleich.

## In ONDA

Die altersbezogenen HRV-Tabellen von ONDA sind Tabellen der nächtlichen RMSSD, doch der [HRV-Rechner](/tools/hrv) hat einen eigenen SDNN-Modus für Werte, die von der Apple Watch stammen, mit Bereichen aus kurzen Ruhe-EKG-Studien an gesunden Erwachsenen. Die nächtliche Baseline der App beruht auf den HRV-Werten, die in Apple Health gespeichert sind – von der Apple Watch oder von einem anderen Gerät, das Herzdaten dorthin synchronisiert. Die Dokumentation sagt das klar: {{fact:applewatch.hrv.healthkit}} [S8] – dieses Baseline-Signal beruht also auf der SDNN und nicht auf der RMSSD. Der Live-Wert während einer Übung ist ein Ersatzmaß, berechnet aus der Standardabweichung der Herzfrequenz – weder SDNN noch RMSSD –, und die Handykamera liefert den Puls, nicht die HRV. ONDA beschreibt und vergleicht deine eigenen Werte; es stellt keine Diagnosen. Siehe [was ONDA misst](/measurements).

> Bildungsinformation, keine Diagnose und keine medizinische Behandlung.
