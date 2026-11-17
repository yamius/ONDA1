---
sourceHash: 5c76958df4ce
publishAfter: "2026-12-20"
title: "Wie ONDA Science Forschung prüft und bewertet"
metaTitle: "Wie ONDA Forschung prüft und bewertet"
metaDescription: "Wie ONDA Science jede Quelle prüft, Studien liest, Aussagen bewertet und mit Firmenaussagen, Interessenkonflikten und wackeligen Ergebnissen umgeht."
shortAnswer: >
  ONDA Science sucht jede Fachquelle in Crossref oder PubMed, kopiert für
  jede Aussage ein wörtliches Zitat daraus und ordnet jeder Aussage eine von
  sechs Evidenzklassen zu, von gesichert bis unbekannt. Ein Ergebnis aus
  einer Gruppe wird nie zu einem Urteil über eine einzelne Person. Der
  Zulassungsstatus stammt nur aus amtlichen Datenbanken, Interessenkonflikte
  werden so angegeben, wie sie gefunden wurden, und eine fehlende Erklärung
  gilt nie als fehlender Konflikt.
keyPoints:
  - "Jede Fachquelle auf einer Wissenschaftsseite wird über DOI oder PMID gesucht, und Titel, Autoren und Jahr werden vor der Verwendung mit der Angabe abgeglichen."
  - "Jede Aussage in der Evidenztabelle trägt ein exaktes Zitat aus ihrer Quelle; sagt das Zitat die Aussage nicht, wird sie umgeschrieben oder gestrichen."
  - "Jede Aussage erhält eine Klasse: gesichert, Leitlinie oder Expertenkonsens, kontextabhängig, vorläufig, umstritten oder unbekannt."
  - "Ein Ergebnis in einer Gruppe ist keine Vorhersage für eine einzelne Person."
  - "Tierstudien, Einzelstudien, narrative Übersichten und herstellernahe Studien werden als solche gekennzeichnet und nie als stärkere Evidenz dargestellt."
  - "Der Zulassungsstatus eines Geräts stammt nur aus amtlichen Datenbanken; eine Registrierung bei einer Behörde ist keine Zulassung."
  - "Finanzierung und Interessenkonflikte werden so angegeben, wie sie gefunden wurden; ließ sich die Erklärung nicht lesen, sagt die Seite das, statt keinen Konflikt anzunehmen."
imageAlt: "Eine schmale Lupe über einem kleinen Papierstapel, eine Textzeile unterstrichen und daneben ein kleines Häkchen."
evidenceMap:
  - claim: "Methoden, Analysen und Deutungen der HRV unterscheiden sich stark, und Debatten über ihre Zuverlässigkeit dauern an."
    limitation: "Leitlinie für die Forschung; Expertenkonsens."
  - claim: "Die HRV eignet sich nicht als spezifischer Marker der sympathischen Herzaktivität oder des Gleichgewichts zwischen den beiden Ästen des autonomen Nervensystems."
    limitation: "Leitlinie für die Forschung; Expertenkonsens."
  - claim: "Eingangssignal, Dauer und Ort der Aufzeichnung, Atmung und Analysemethode können HRV-Ergebnisse beeinflussen."
    limitation: "Leitlinie für die Forschung; Expertenkonsens."
  - claim: "HRV-Befunde werden leicht fehlgedeutet, was korrekte Methoden nur teilweise verhindern."
    limitation: "Methodenübersicht für psychophysiologische Forschung."
  - claim: "HRV-Maße reagieren stark auf physiologischen und methodischen Kontext, darunter Aufnahmedauer, Signalqualität, Atmung, Körperhaltung, Tageszeit, Medikamente und Analysemethode."
    limitation: "Narrative Methodenübersicht mit vorgeschlagener Checkliste; nicht frei zugänglich, nur Abstract."
  - claim: "Einzelmaße wie LF/HF werden leicht als direkte Maße des Gleichgewichts der beiden Äste des autonomen Nervensystems überinterpretiert."
    limitation: "Narrative Methodenübersicht mit vorgeschlagener Checkliste; nicht frei zugänglich, nur Abstract."
  - claim: "ONDA bildet eine persönliche Baseline aus HRV, Ruhepuls und Atemfrequenz in Apple Health."
    limitation: "Beschreibt nur die Funktionsweise der App."
  - claim: "ONDA ist kein Medizinprodukt und diagnostiziert keine Erkrankung."
    limitation: "Beschreibt nur den Zweck der App."
---

## Warum ist die Methode bei der Herzratenvariabilität so wichtig?

Die Herzratenvariabilität (HRV) ist leicht aufzuzeichnen und schwer zu lesen. Eine Forschungsleitlinie hält fest, dass Methoden, Analysen und Deutungen in HRV-Studien stark voneinander abweichen und Debatten über ihre Zuverlässigkeit andauern [S1]. Eine Methodenübersicht sagt dasselbe aus Sicht der Psychophysiologie: Wie leicht sich die HRV messen lässt, kann verdecken, wie leicht ihre Befunde fehlgedeutet werden [S2]. ONDA Science ist um dieses Problem herum aufgebaut. Diese Seite legt die Regeln offen, denen jede Seite folgt, damit nachvollziehbar ist, warum ein Satz so formuliert ist.

## Wie wird jede Quelle geprüft?

- **Identität.** Bevor eine Fachquelle verwendet wird, wird ihre DOI in Crossref oder ihre PMID in PubMed gesucht, und Titel, Autoren und Jahr werden mit der Angabe abgeglichen. Eine Quelle, die nicht passt, wird entfernt.
- **Zitatprüfung auf der ganzen Website.** Auf der gesamten Website — Wissenschaftsseiten, Artikel, Testberichte und Glossar — muss jede PMID, DOI und PMC-Kennung in einem Zitatregister stehen, das aus PubMed und Crossref gefüllt wird. Der Website-Build schlägt fehl, wenn eine Kennung im Register fehlt, nicht existiert oder bekanntermaßen auf eine andere Arbeit zeigt. Stehen Autor und Jahr neben der Kennung, schlägt der Build auch fehl, wenn dieser Autor nicht unter den Autoren ist oder das Jahr um mehr als eins abweicht. Titel vergleicht der Build nicht; das gehört zur Prüfung vor der Verwendung.
- **Text.** Abstracts und, wo frei zugänglich, Volltexte werden über Europe PMC oder den Verlag gelesen. Eine Aussage, die auf einem nicht lesbaren Teil der Arbeit beruht, wird nicht gemacht.
- **Zitat.** Jede Aussage in der Evidenztabelle trägt ein wörtlich kopiertes Zitat aus der Quelle, das vor der Veröffentlichung mit Abstract oder Volltext abgeglichen wird. Drückt das Zitat einen benachbarten Gedanken statt der Aussage aus, wird die Aussage umgeschrieben oder gestrichen.
- **Zahlen.** Jede Zahl auf einer Wissenschaftsseite stammt aus einer einzigen Liste freigegebener Fakten; direkt geschrieben werden nur Jahre, Daten und amtliche Zulassungsbezeichnungen. Jeder Fakt hält seine Quelle und seinen Geltungsbereich fest — Gruppe, Methode, Tageszeit —, und eine neue Zahl wartet vor der Veröffentlichung auf die Freigabe der Redaktion.
- **Dubletten und Ersatz.** Im Register der Kandidatenquellen wird dieselbe zweimal gefundene Studie zu einem Eintrag zusammengeführt, und wenn eine neuere Übersicht eine ältere ersetzt, bleibt der ältere Eintrag als ersetzt markiert, statt still zu verschwinden.

## Wie wird die Stärke einer Aussage bewertet?

Bewertungen gelten für eine bestimmte Aussage, nicht für ein Produkt oder ein Thema. Jede Aussage in der Evidenztabelle trägt genau eine Klasse:

- **Gesichert** — übereinstimmende metaanalytische Evidenz oder seit Langem gefestigte Lehrbuchphysiologie (Anatomie und Grundmechanismen, nicht Wirkungen von Maßnahmen). Eine einzelne kleine Studie wird nie als gesichert bewertet, und Wirkungen von Atmung, Kälte, Praktiken oder Geräten gelten nie allein aufgrund des Lehrbuchs als gesichert.
- **Leitlinie / Expertenkonsens** — eine Empfehlung oder ein methodischer Standard aus einer Leitlinie. Das ist die Stärke der Einigung unter Fachleuten, nicht der Ergebnisdaten.
- **Kontextabhängig** — belegt, aber nur in einer genannten Gruppe, Erkrankung oder Messsituation.
- **Vorläufig** — frühe oder kleine Studien weisen in eine Richtung; die Evidenz ist noch nicht einheitlich.
- **Umstritten** — glaubwürdige Quellen widersprechen sich.
- **Unbekannt** — zu wenig untersucht, um es zu sagen.

Manche Frageseiten fassen die Evidenz zusätzlich in einfachen Worten zusammen: gezeigt, gemischt, nicht gezeigt und keine Daten. Nicht gezeigt heißt, dass Studien nach einem Effekt gesucht und keinen gefunden haben; es beweist nicht, dass es den Effekt nicht gibt. Keine Daten heißt, dass keine Studie es gemessen hat: eine Lücke, keine Widerlegung. Ein Zusammenhang wird nie als Ursache dargestellt.

## Welche Studien zählen, und wofür?

- **Tierstudien.** Ein Befund an Tieren wird als Tierbefund gekennzeichnet und nicht als Evidenz über Menschen dargestellt.
- **Narrative Übersichten.** Eine Übersicht ohne systematische Suche wird in der Evidenztabelle als narrativ gekennzeichnet, und ihre Zusammenfassung wird nie als gepooltes Ergebnis dargestellt. Allein kann sie eine gesicherte Aussage nur für gefestigte Lehrbuchphysiologie stützen, und nur als klassische Referenzübersicht.
- **Einzelstudien.** Das Ergebnis einer Studie wird als eine Studie beschrieben, mit Gruppe und Design, und nie als gesichert bewertet.
- **Herstellernahe Studien.** Eine Studie, die der Hersteller eines Geräts durchgeführt oder finanziert hat, wird gekennzeichnet und hebt eine Aussage nicht in eine stärkere Klasse.
- **Abstract und Volltext.** Widersprechen sich Abstract und Volltext einer Arbeit, gilt der Volltext.

## Warum ist ein Gruppenergebnis kein persönliches Urteil?

Fast jede Studie berichtet Durchschnittswerte von Gruppen. Ein gepoolter Effekt sagt, was in einer Gruppe wie der untersuchten typischerweise geschieht; er sagt nicht, was mit einer einzelnen Person geschieht, und lässt sich nicht auf eine andere Altersgruppe, Sportart oder Erkrankung übertragen. Die Seiten nennen jedes Mal die Gruppe und halten etwa Ergebnisse bei Älteren getrennt von Aussagen über Jüngere.

## Wie werden Aussagen zu Geräten und Zulassungen behandelt?

- **Nur amtliche Quellen.** Der Zulassungsstatus eines Geräts stammt aus der Datenbank der Behörde selbst, nicht von der Website des Herstellers. Eine Registrierung bei einer Behörde ist nicht dasselbe wie eine Zulassung oder Freigabe.
- **Gerätedokumentation.** Unterlagen von Hersteller und Behörde werden nur dafür zitiert, was ein Gerät aufzeichnet oder was eine Zulassung abdeckt, nie für eine Gesundheits- oder Wirksamkeitsaussage.
- **Validierungsstudien.** Vergleicht eine Studie bestimmte Uhren mit einer Referenz, wird das Ergebnis als Befund über diese Modelle in dieser Situation berichtet, nicht als Empfehlung.

## Wie nutzen Testberichte diese Evidenz?

Gerätetests bei ONDA folgen denselben Evidenzregeln, mit einer eigenen Bewertungsebene. Studien, die der Hersteller durchgeführt oder finanziert hat, gelten nicht als unabhängige Validierung. Zulassungsangaben des Herstellers werden mit dem Status des Produkts in amtlichen Datenbanken abgeglichen: Registrierung oder Zulassung bringen keine Punkte, eine falsche Darstellung kostet Punkte. Behaupten Herstellerunterlagen klinische Belege oder Studien, die es für dieses Produkt nicht gibt, sinkt die Bewertung, und der Test zitiert die Worte des Herstellers. Die vollständigen Bewertungsregeln stehen auf der Seite zur [Testmethodik](/reviews/methodology).

## Wie werden Finanzierung und Interessenkonflikte angegeben?

Finanzierung und erklärte Interessenkonflikte werden aus der Arbeit gelesen und mit der Quelle vermerkt. Firmenfinanzierung oder Beteiligung eines Herstellers wird im Text genannt, wenn sie die Aussage betrifft. Ließ sich die Erklärung nicht lesen — etwa hinter einer Bezahlschranke —, vermerkt die Quellenangabe, dass sie nicht geprüft werden konnte. Eine fehlende Erklärung wird nie als fehlender Konflikt dargestellt.

## Wo liegen die Grenzen von HRV-Maßen?

HRV-Maße reagieren stark auf den Kontext: Aufnahmedauer, Signalqualität, Atmung, Körperhaltung, Tageszeit, Medikamente und Analysemethode verändern die Zahlen [S3]. Auch das Eingangssignal — ein EKG oder ein Pulssensor an Handgelenk oder Finger — und der Ort der Aufzeichnung zählen [S1]. Deshalb vergleicht ONDA Science Ergebnisse nur unter ähnlichen Aufnahmebedingungen und nennt die Bedingungen jeder Studie.

Zwei Vorbehalte ziehen sich durch jede Seite. Die HRV ist kein spezifischer Marker sympathischer Aktivität oder des Gleichgewichts der beiden Äste des autonomen Nervensystems [S1]. Einzelne Frequenzmaße, allen voran das LF/HF-Verhältnis, werden leicht überinterpretiert und nur als das berichtet, was die Studie gemessen hat, mit diesem Vorbehalt [S3].

## Was es dir nicht sagt

- **Eine geprüfte Quelle ist keine bewiesene Aussage.** Die Prüfung bestätigt, dass die Arbeit existiert und das Zitierte sagt; die Stärke der Aussage legt ihre Evidenzklasse fest.
- **Nicht gezeigt ist kein Beweis der Abwesenheit.**
- **Diese Regeln machen ONDA nicht zu einem medizinischen Dienst.** Sie regeln, wie der Wissenschaftsbereich geschrieben wird.

## In ONDA

Dieselben Regeln gelten für das, was die Seiten über ONDA selbst sagen: ONDA bildet eine persönliche Baseline aus HRV, Ruhepuls und Atemfrequenz in Apple Health und beschreibt, wie deine neuesten Werte zu deinem eigenen Bereich stehen [S4]. ONDA ist kein Medizinprodukt und stellt keine Diagnosen [S4], und Aussagen über die App werden damit abgeglichen, wie sie tatsächlich funktioniert. Wie ONDAs eigene Messungen funktionieren, steht unter [wie ONDA deine Signale misst und deutet](/science/measurements/onda-method).

> Bildungsinformation, keine Diagnose und keine medizinische Behandlung.
