---
sourceHash: "fed00e9a1b1b"
title: "Wie ONDA die Signale deines Körpers misst und deutet"
metaTitle: "Wie ONDA deine Körpersignale misst und deutet"
metaDescription: "Woher ONDA seine Daten bezieht, wie es deine Baseline und Signale bildet, was auf deinem Handy bleibt und wo die Grenzen jeder angezeigten Zahl liegen."
shortAnswer: >
  ONDA liest Herzfrequenzvariabilität, Ruhepuls und Atemfrequenz aus Apple
  Health und kann mit der iPhone-Kamera den Puls an der Fingerkuppe messen.
  Aus deinen eigenen Nächten bildet es einen persönlichen Korridor und weist
  auf Nächte hin, die deutlich außerhalb liegen. Das sind beschreibende
  Vergleiche, keine Diagnose. ONDA hat keine eigene Studie zu Genauigkeit oder
  Wirksamkeit durchgeführt, und seine Zahlen sind nur so gut wie das Gerät,
  das sie aufgezeichnet hat.
keyPoints:
  - "ONDA liest die Herzfrequenzvariabilität als SDNN, den Ruhepuls und die Atemfrequenz aus Apple Health – geschrieben von der Apple Watch oder einem anderen Gerät, das dorthin synchronisiert; es liest nur und schreibt nie."
  - "Die iPhone-Kamera liefert einen Pulswert und eine Atemschätzung, aber keine Herzfrequenzvariabilität, und der Live-Kohärenzwert funktioniert mit der Kamera nicht."
  - "Deine Baseline und deine Signale vergleichen dich mit deinen eigenen letzten Nächten, nie mit einer Bevölkerungsnorm, und sie bleiben stumm, bis genug Nächte vorliegen."
  - "Ein Signal braucht eine große Veränderung, gemessen an deiner eigenen Streuung, und eine absolute oder relative Mindestveränderung – kleine Schwankungen werden ignoriert."
  - "Baseline, Signale und Berichte werden auf deinem Handy berechnet. Ab Version 1.9.3 bleibt der Übungsfortschritt ohne Konto auf dem Gerät und wird erst nach der Anmeldung synchronisiert, und das Tagebuch bleibt nur auf dem Gerät."
  - "ONDA ist kein Medizinprodukt, hat keine eigene veröffentlichte Studie zu Genauigkeit oder Nutzen und stellt keine Diagnosen."
imageAlt: "Drei Eingangslinien – eine Welle, eine Reihe Striche und eine Reihe Punkte – laufen in einem abgerundeten Rahmen zu einer Linie in einem blassgrünen Band mit markierten Punkten zusammen, die zu einem kleinen Quadrat führt."
evidenceMap:
  - claim: "ONDA liest die Herzfrequenzvariabilität (SDNN) aus Apple Health – geschrieben von der Apple Watch oder einem anderen Gerät, das Herzdaten dorthin synchronisiert."
    limitation: "Beschreibt nur das Verhalten der App; ONDA berechnet die SDNN nicht selbst und kann nicht prüfen, wie gut das aufzeichnende Gerät gemessen hat."
  - claim: "Die iPhone-Kamera liefert einen Ruhepuls und eine Atemschätzung; Herzfrequenzvariabilität erscheint nur mit einer Uhr oder einem anderen Tracker, der sie in Apple Health schreibt."
    limitation: "Beschreibt nur das Verhalten der App; keine Validierung des Kamerawerts."
  - claim: "ONDA bildet eine persönliche Baseline, vergleicht Nächte mit einem persönlichen Korridor, wartet auf genug Nächte und verlangt Mindestveränderungen; die Ampel nutzt einen längeren Korridor."
    limitation: "Produktdokumentation; die Schwellen sind Designentscheidungen von ONDA, keine klinisch validierten Grenzwerte."
  - claim: "ONDA ist kein Medizinprodukt und diagnostiziert oder überwacht keine Erkrankung."
    limitation: "Eine Positionierungsaussage; keine regulatorische Einstufung durch eine Behörde."
  - claim: "Die Variabilität des Pulssignals (PPG) stimmt vor allem in Ruhe und unter kontrollierten Bedingungen mit dem EKG überein und sollte nicht als austauschbar mit dem EKG gelten."
    limitation: "Zehn Studien in der quantitativen Synthese, gesunde Erwachsene, überwiegend in Ruhe; nicht spezifisch für die iPhone-Kamera."
  - claim: "Die Atemfrequenz lässt sich mit vielen verschiedenen Algorithmen aus dem EKG oder dem Pulssignal schätzen."
    limitation: "Eine Methodenübersicht; sie validiert weder ein Verbrauchergerät noch die Schätzung von ONDA."
  - claim: "ONDA begrenzt Abweichungssignale und schickt ruhige Check-ins in einem festen Rhythmus."
    limitation: "Produktdokumentation; die Taktwerte sind Designentscheidungen von ONDA, keine klinischen Empfehlungen."
---

## Was ist die Methode von ONDA?

ONDA ist eine App für Atemübungen und Biofeedback. Sie liest Signale, die andere Geräte bereits aufgezeichnet haben, vergleicht sie mit deinem eigenen Verlauf und zeigt dir, wo eine Nacht steht. Diese Seite beschreibt die Methode so, wie sie in der App umgesetzt ist – einschließlich ihrer Grenzen. Sie beschreibt ein Produkt, keinen wissenschaftlichen Befund, und jede Regel unten ist eine Designentscheidung, kein validierter klinischer Schwellenwert.

## Woher kommen die Daten?

**Apple Health.** Mit deiner Erlaubnis liest ONDA Herzfrequenzvariabilität (HRV), Ruhepuls und Atemfrequenz aus Apple Health. Die HRV kommt als SDNN an – in der Form, in der Apple Health sie speichert –, und ONDA berechnet sie nicht aus den Schlagintervallen neu. Die Werte schreibt die Apple Watch oder ein anderes Gerät, dessen App Herzdaten mit Apple Health synchronisiert [S1]. ONDA liest nur; es schreibt nie etwas in Apple Health. Außerdem liest es die Schlafzeiten für seine Ansicht zur Schlafregelmäßigkeit und einige Einzelwerte rund um die Baseline, etwa die Herzfrequenz beim Gehen und einen geschätzten Wert der aeroben Fitness, sofern Health sie enthält.

**Die iPhone-Kamera.** Liegt eine Fingerkuppe auf der rückseitigen Kamera, schätzt ONDA deinen Puls aus den Farbveränderungen der Haut und die Atmung aus dem Rhythmus dieses Pulses. Die Kamera liefert einen Puls, keine HRV: Bis eine Uhr oder ein anderer Tracker HRV in Apple Health schreibt, bleibt dieser Teil der Baseline leer [S1]. Auch der Live-Kohärenzwert ist mit der Kamera nicht verfügbar; er erscheint nur mit einer Apple Watch.

**Was ONDA nicht misst.** Es zeichnet kein EKG auf und misst weder Blutdruck noch Blutsauerstoff, Temperatur, Hirnaktivität, Hormone oder Blutwerte; es bewertet keine Schlafphasen und gibt keine einzelne Bereitschaftszahl aus. Die vollständige Übersicht findest du unter [Was ONDA misst](/measurements).

## Wie entsteht deine Baseline?

Die Baseline ist der Bereich, in dem sich dein Körper üblicherweise bewegt. ONDA bildet sie über {{fact:baseline.window}} aus nächtlichen Werten in Apple Health [S1, S4]. Ab Version 1.9.3 zeigt das HRV-Diagramm dieses ganze Fenster, sobald der Zugriff auf Apple Health erlaubt ist, statt sich Nacht für Nacht zu füllen. Nächte mit zu wenigen Messpunkten werden vor jeder Berechnung verworfen, und die HRV wird nur aus nächtlichen Messpunkten genommen.

Für Signale gilt: {{fact:baseline.compare}} [S1]. ONDA bleibt stumm, bis mindestens {{fact:baseline.minNights}} vorliegen; in den ersten Wochen siehst du daher eine Baseline, die noch entsteht, kein Urteil. Die geforderten Mindestveränderungen sind: {{fact:baseline.floors}}.

Im einfachen Modus steuert dieselbe Regel eine Ampel. Ihr Korridor umfasst {{fact:baseline.corridor}}, sodass ein paar ungewöhnliche Nächte ihn kaum verschieben. Grün heißt, dass jedes Signal in deinem Korridor liegt; Gelb heißt, dass eine Nacht außerhalb liegt; Rot heißt, dass zwei oder mehr Nächte hintereinander außerhalb liegen. Diese Farben beschreiben den Abstand zu deinem eigenen Verlauf. Sie benoten nicht deine Gesundheit. Wie man solche Vergleiche liest, erklären [deine HRV-Baseline](/science/concepts/hrv-baseline) und [HRV richtig deuten](/science/concepts/interpreting-hrv).

## Wann zeigt ONDA ein Signal?

Ein Signal erscheint, wenn in der letzten Nacht der Ruhepuls gestiegen, die HRV gesunken oder die Atemfrequenz gestiegen ist – und zwar über die Streuungsschwelle und die oben beschriebene Mindestveränderung hinaus. Haben sich mehrere Werte bewegt, zeigt ONDA nur das größte Signal. Es gibt {{fact:onda.signal.cadence}}, und die Benachrichtigung enthält keine Zahlen; die Zahlen stehen in der App.

Bleiben deine Nächte im Korridor, schickt ONDA stattdessen einen ruhigen Check-in – {{fact:onda.checkin.steadyCadence}}, dabei {{fact:onda.checkin.dailyCap}}. Ohne Daten einer Uhr kommen Check-ins {{fact:onda.checkin.noWatchCadence}}. Ruhige Check-ins lassen sich in den Einstellungen ausschalten.

Nächtliche Werte bewegen sich aus gewöhnlichen Gründen wie Alkohol, einer späten Mahlzeit, Training, Reisen oder einer kurzen Nacht – deshalb gilt eine einzelne Nacht nie als Urteil. Siehe [warum sich die HRV von Tag zu Tag ändert](/science/mechanisms/hrv-day-to-day).

## Was siehst du während einer Übung?

{{fact:onda.practice.livePulse}}. Mit einer Uhr zeigt ONDA zusätzlich einen Kohärenzwert: wie stark deine Herzfrequenz über ein gleitendes Fenster mit deiner Atmung steigt und fällt. Er ist eine Feedback-Kennzahl für die Übung, kein klinischer Biomarker, und lässt sich nicht zwischen Menschen vergleichen. Der Live-Atemwert ist eine Schätzung aus dem Pulsrhythmus. Die Live-Kurve ist keine HRV im Sinne von RMSSD oder SDNN.

## Was wird gespeichert, und wo?

Baseline, Signale, Ampel und Check-ins werden auf deinem Handy berechnet. Die Kamerabilder für den Puls werden im Arbeitsspeicher verarbeitet und weder gespeichert noch gesendet. Ab Version 1.9.3 bleibt dein Übungsfortschritt auch ohne Konto auf dem Gerät; wenn du dich anmeldest, wird er zusätzlich mit deinem Konto synchronisiert, damit er eine Neuinstallation übersteht. Ab Version 1.9.3 bleibt das Tagebuch – einschließlich Sprachnotizen und darin gespeicherter Kamera-Pulsmessungen – nur auf dem Gerät und wird nicht synchronisiert. Ein PDF- oder HTML-Bericht wird auf dem Handy erstellt und verlässt es nur, wenn du ihn selbst teilst.

## Was sie dir nicht sagt

ONDA hat keine eigene Studie dazu veröffentlicht, wie genau seine Messwerte sind oder ob seine Übungen gesundheitliche Ergebnisse verändern. Was ONDA über Genauigkeit weiß, stammt aus Studien zu den zugrunde liegenden Technologien, nicht zu ONDA.

Die Genauigkeit hängt vom aufzeichnenden Gerät und von den Bedingungen ab. Pulsbasierte Variabilität stimmt vor allem in Ruhe und unter kontrollierten Bedingungen mit dem EKG überein, und die Evidenz spricht nicht dafür, beide als austauschbar zu behandeln [S2]. Die Atemfrequenz lässt sich aus dem Pulssignal schätzen, allerdings mit vielen verschiedenen Algorithmen, die unterschiedlich gut abschneiden [S3]. Eine Messung mit der Kamera an der Fingerkuppe reagiert empfindlicher auf Bewegung, Druck und Licht als ein Brust-EKG – betrachte sie daher als Schätzung. Zu den Unterschieden zwischen Geräten siehe [Herzfrequenzvariabilität als Messung](/science/measurements/heart-rate-variability), [Ruhepuls](/science/measurements/resting-heart-rate) und [Atemfrequenz](/science/measurements/respiratory-rate).

Baseline und Signale sind statistische Vergleiche mit deiner eigenen Vergangenheit. Sie sind keine Diagnose, und ONDA ist kein Medizinprodukt: Es diagnostiziert, behandelt oder überwacht keine Erkrankung [S1]. Grün heißt nicht, dass es dir gut geht, und Rot heißt nicht, dass du krank bist. Wenn du dich unwohl fühlst, Brustschmerzen hast, ohnmächtig wirst oder starke Atemnot hast, such ärztliche Hilfe – ganz gleich, was die App anzeigt.

## Wie geht ONDA mit Evidenz um?

Der Bereich [ONDA Science](/science) erklärt die Physiologie hinter diesen Signalen. Seine Seiten zitieren Quellen, die mit PubMed oder Crossref abgeglichen sind, verwenden freigegebene Formulierungen für Zahlen und für Aussagen über ONDA und trennen gesicherte Befunde von vorläufigen oder umstrittenen. Die Seiten redigiert [Yakiv Bilenko](/people/yakiv-bilenko).

> Bildungsinformation, keine Diagnose und keine medizinische Behandlung.
