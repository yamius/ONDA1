---
sourceHash: "fed00e9a1b1b"
title: "Jak ONDA mierzy i interpretuje sygnały twojego ciała"
metaTitle: "Jak ONDA mierzy i odczytuje sygnały twojego ciała"
metaDescription: "Skąd ONDA bierze dane, jak buduje twoją osobistą linię bazową i sygnały, co zostaje w telefonie i jakie są granice każdej pokazywanej liczby."
shortAnswer: >
  ONDA odczytuje z Apple Health zmienność rytmu serca, tętno spoczynkowe i
  częstość oddechów, a aparatem iPhone’a może zmierzyć puls z opuszka palca.
  Z twoich własnych nocy buduje osobisty korytarz i wskazuje noce, które
  wyraźnie z niego wychodzą. To opisowe porównania, a nie diagnoza. ONDA nie
  przeprowadziła żadnego własnego badania dokładności ani skuteczności, a jej
  liczby są tylko tak dobre jak urządzenie, które je zarejestrowało.
keyPoints:
  - "ONDA odczytuje z Apple Health zmienność rytmu serca w postaci SDNN, tętno spoczynkowe i częstość oddechów, zapisane przez Apple Watch lub inne urządzenie, które się tam synchronizuje; tylko odczytuje, nigdy nic nie zapisuje."
  - "Aparat iPhone’a daje odczyt pulsu i szacunek częstości oddechów, a nie zmienność rytmu serca, a wynik koherencji na żywo nie działa z aparatem."
  - "Linia bazowa i sygnały porównują cię z twoimi własnymi niedawnymi nocami, nigdy z normą populacyjną, i milczą, dopóki nie zbierze się wystarczająco dużo nocy."
  - "Sygnał wymaga dużej zmiany mierzonej twoim własnym rozrzutem oraz minimalnej zmiany bezwzględnej lub względnej, więc drobne wahania są pomijane."
  - "Linia bazowa, sygnały i raporty są obliczane w twoim telefonie. Od wersji 1.9.3 postępy w praktykach zostają na urządzeniu bez konta i synchronizują się dopiero po zalogowaniu, a dziennik jest przechowywany wyłącznie na urządzeniu."
  - "ONDA nie jest wyrobem medycznym, nie ma własnego opublikowanego badania dokładności ani korzyści i niczego nie diagnozuje."
imageAlt: "Trzy linie wejściowe — fala, rząd kresek i rząd kropek — łączą się wewnątrz zaokrąglonej ramki w jedną linię biegnącą przez bladozielony pas z zaznaczonymi punktami i prowadzącą do małego kwadratu."
evidenceMap:
  - claim: "ONDA odczytuje zmienność rytmu serca (SDNN) z Apple Health, gdzie zapisuje ją Apple Watch lub inne urządzenie synchronizujące tam dane o sercu."
    limitation: "Opisuje wyłącznie działanie aplikacji; ONDA sama nie oblicza SDNN i nie może sprawdzić, jak poradziło sobie urządzenie rejestrujące."
  - claim: "Aparat iPhone’a daje puls spoczynkowy i szacunek częstości oddechów; zmienność rytmu serca pojawia się dopiero wtedy, gdy zegarek lub inny tracker zapisuje ją w Apple Health."
    limitation: "Opisuje wyłącznie działanie aplikacji; nie jest walidacją odczytu z aparatu."
  - claim: "ONDA buduje osobistą linię bazową, porównuje noce z osobistym korytarzem, czeka na wystarczającą liczbę nocy i wymaga minimalnych zmian; sygnalizacja świetlna korzysta z dłuższego korytarza."
    limitation: "Dokumentacja produktu; progi to decyzje projektowe ONDA, a nie klinicznie zwalidowane wartości graniczne."
  - claim: "ONDA nie jest wyrobem medycznym i nie diagnozuje ani nie monitoruje żadnej choroby."
    limitation: "Deklaracja pozycjonująca; nie jest to klasyfikacja regulacyjna nadana przez jakikolwiek organ."
  - claim: "Zmienność sygnału tętna (PPG) zgadza się z EKG głównie w spoczynku i w warunkach kontrolowanych i nie należy traktować jej jako wymiennej z EKG."
    limitation: "Dziesięć badań w syntezie ilościowej, zdrowi dorośli, głównie w spoczynku; nie dotyczy konkretnie aparatu iPhone’a."
  - claim: "Częstość oddechów można szacować z EKG lub z sygnału tętna za pomocą wielu różnych algorytmów."
    limitation: "Przegląd metod; nie waliduje żadnego urządzenia konsumenckiego ani szacunku ONDA."
  - claim: "ONDA ogranicza częstotliwość sygnałów odchylenia i wysyła spokojne wiadomości w stałym rytmie."
    limitation: "Dokumentacja produktu; wartości częstotliwości to decyzje projektowe ONDA, a nie zalecenia kliniczne."
---

## Na czym polega metoda ONDA?

ONDA to aplikacja do ćwiczeń oddechowych i biofeedbacku. Odczytuje sygnały, które zarejestrowały już inne urządzenia, porównuje je z twoją własną historią i pokazuje, gdzie wypada dana noc. Ta strona opisuje tę metodę tak, jak jest zapisana w aplikacji, łącznie z jej granicami. To opis produktu, a nie wynik naukowy, a każda opisana niżej reguła jest decyzją projektową, a nie zwalidowanym progiem klinicznym.

## Skąd pochodzą dane?

**Apple Health.** Za twoją zgodą ONDA odczytuje z Apple Health zmienność rytmu serca (HRV), tętno spoczynkowe i częstość oddechów. HRV trafia do aplikacji jako SDNN — w tej postaci przechowuje je Apple Health — a ONDA nie przelicza tej wartości na nowo z odstępów między uderzeniami. Wartości zapisuje Apple Watch lub inne urządzenie, którego aplikacja synchronizuje dane o sercu z Apple Health [S1]. ONDA tylko odczytuje; nigdy niczego nie zapisuje w Apple Health. Odczytuje też pory snu na potrzeby widoku regularności snu oraz kilka pojedynczych wartości uzupełniających linię bazową, takich jak tętno podczas marszu i szacunkowa wydolność tlenowa, jeśli Apple Health je zawiera.

**Aparat iPhone’a.** Gdy przyłożysz opuszek palca do tylnego aparatu, ONDA szacuje twój puls na podstawie zmian koloru skóry, a częstość oddechów — na podstawie rytmu tego pulsu. Aparat daje puls, a nie HRV: dopóki zegarek lub inny tracker nie zapisze HRV w Apple Health, ta część linii bazowej pozostaje pusta [S1]. Wynik koherencji na żywo również nie jest dostępny z aparatem; pojawia się tylko z Apple Watch.

**Czego ONDA nie mierzy.** Nie rejestruje EKG, ciśnienia krwi, saturacji krwi tlenem, temperatury, aktywności mózgu, hormonów ani markerów we krwi, nie ocenia faz snu i nie podaje jednej liczby gotowości. Pełny wykaz znajdziesz na stronie [co mierzy ONDA](/measurements).

## Jak powstaje twoja linia bazowa?

Linia bazowa to zakres, w którym zwykle mieści się twój organizm. ONDA buduje ją z nocnych wartości w Apple Health z okresu {{fact:baseline.window}} [S1, S4]. Od wersji 1.9.3 wykres HRV pokazuje całe to okno od razu po przyznaniu dostępu do Apple Health, zamiast wypełniać się noc po nocy. Noce ze zbyt małą liczbą próbek są odrzucane przed jakimikolwiek obliczeniami, a HRV jest brane wyłącznie z próbek nocnych.

W przypadku sygnałów {{fact:baseline.compare}} [S1]. ONDA milczy, dopóki nie ma co najmniej {{fact:baseline.minNights}}, więc w pierwszych tygodniach widzisz linię bazową, która dopiero powstaje, a nie ocenę. Wymagane minimalne zmiany to: {{fact:baseline.floors}}.

W trybie prostym ta sama reguła steruje sygnalizacją świetlną. Jej korytarz obejmuje noce z okresu {{fact:baseline.corridor}}, więc kilka nietypowych nocy ledwo go przesuwa. Zielony oznacza, że każdy sygnał mieści się w twoim korytarzu; żółty — jedną noc poza nim; czerwony — dwie lub więcej nocy z rzędu poza nim. Te kolory opisują odległość od twojej własnej historii. Nie oceniają twojego zdrowia. Jak czytać takie porównania, wyjaśniają strony [twoja linia bazowa HRV](/science/concepts/hrv-baseline) i [interpretacja HRV](/science/concepts/interpreting-hrv).

## Kiedy ONDA pokazuje sygnał?

Sygnał pojawia się, gdy ostatniej nocy tętno spoczynkowe wzrosło, HRV spadło albo częstość oddechów wzrosła ponad oba opisane wyżej progi: próg rozrzutu i minimalną zmianę. Jeśli przesunęło się kilka sygnałów, ONDA pokazuje tylko największy z nich. Częstotliwość sygnałów jest ograniczona: {{fact:onda.signal.cadence}}, a powiadomienie nie zawiera liczb; liczby są w aplikacji.

Gdy twoje noce pozostają w korytarzu, zamiast sygnałów obowiązuje inny rytm: {{fact:onda.checkin.steadyCadence}}, {{fact:onda.checkin.dailyCap}}. Bez danych z zegarka spokojne wiadomości przychodzą {{fact:onda.checkin.noWatchCadence}}. Spokojne wiadomości można wyłączyć w Ustawieniach.

Wartości nocne zmieniają się z codziennych powodów, takich jak alkohol, późny posiłek, trening, podróż czy krótka noc — dlatego jedna noc nigdy nie jest traktowana jak werdykt. Zobacz, [dlaczego HRV zmienia się z dnia na dzień](/science/mechanisms/hrv-day-to-day).

## Co widzisz podczas praktyki?

{{fact:onda.practice.livePulse}}. Z zegarkiem ONDA pokazuje też wynik koherencji: jak silnie twoje tętno rośnie i spada w rytm oddechu w kroczącym oknie. To wskaźnik informacji zwrotnej dla praktyki, a nie kliniczny biomarker, i nie można go porównywać między ludźmi. Częstość oddechów na żywo to szacunek z rytmu pulsu. Wykres fali na żywo nie jest HRV w rozumieniu RMSSD ani SDNN.

## Co jest przechowywane i gdzie?

Linia bazowa, sygnały, sygnalizacja świetlna i spokojne wiadomości są obliczane w twoim telefonie. Klatki z aparatu używane do pomiaru pulsu są przetwarzane w pamięci i nie są zapisywane ani wysyłane. Od wersji 1.9.3 twoje postępy w praktykach są przechowywane na urządzeniu nawet bez konta; jeśli się zalogujesz, są też synchronizowane z twoim kontem, więc przetrwają ponowną instalację. Od wersji 1.9.3 dziennik, łącznie z zapisanymi w nim notatkami głosowymi i pomiarami pulsu aparatem, jest przechowywany wyłącznie na urządzeniu i nie jest synchronizowany. Raport PDF lub HTML powstaje w telefonie i opuszcza go tylko wtedy, gdy sam go udostępnisz.

## Czego ci to nie powie

ONDA nie opublikowała własnego badania dokładności swoich odczytów ani tego, czy jej praktyki zmieniają wyniki zdrowotne. To, co ONDA wie o dokładności, pochodzi z badań technologii, na których się opiera, a nie z badań samej ONDA.

Dokładność zależy od urządzenia, które zarejestrowało dane, i od warunków. Zmienność oparta na tętnie zgadza się z EKG głównie w spoczynku i w warunkach kontrolowanych, a dane nie uzasadniają traktowania obu pomiarów jako wymiennych [S2]. Częstość oddechów można szacować z sygnału tętna, ale za pomocą wielu różnych algorytmów o różnej skuteczności [S3]. Odczyt z aparatu przy opuszku palca jest bardziej wrażliwy na ruch, nacisk i światło niż EKG z klatki piersiowej, więc traktuj go jako szacunek. O różnicach między urządzeniami przeczytasz na stronach [HRV jako pomiar](/science/measurements/heart-rate-variability), [tętno spoczynkowe](/science/measurements/resting-heart-rate) i [częstość oddechów](/science/measurements/respiratory-rate).

Linia bazowa i sygnały to statystyczne porównania z twoją własną przeszłością. Nie są diagnozą, a ONDA nie jest wyrobem medycznym: nie diagnozuje, nie leczy ani nie monitoruje żadnej choroby [S1]. Zielone światło nie oznacza, że jesteś zdrowy, a czerwone — że jesteś chory. Jeśli źle się czujesz, masz ból w klatce piersiowej, omdlenia lub silną duszność, zwróć się o pomoc medyczną bez względu na to, co pokazuje aplikacja.

## Jak ONDA traktuje dane naukowe?

Dział [ONDA Science](/science) wyjaśnia fizjologię stojącą za tymi sygnałami. Jego strony cytują źródła sprawdzone w PubMed lub Crossref, używają zatwierdzonych sformułowań dla liczb i twierdzeń o ONDA oraz oddzielają ustalone wyniki od wstępnych lub spornych. Strony redaguje [Yakiv Bilenko](/people/yakiv-bilenko).

> Informacje edukacyjne, a nie diagnoza ani leczenie.
