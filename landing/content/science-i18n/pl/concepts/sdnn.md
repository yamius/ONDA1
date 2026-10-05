---
sourceHash: "f848794fbee9"
title: "SDNN — co mierzy ta miara HRV, a czego nie"
metaTitle: "SDNN: definicja, znaczenie i rola w Apple Health"
metaDescription: "SDNN to miara HRV, którą zapisuje Apple Health. Co mierzy, czym różni się od RMSSD i dlaczego tych dwóch liczb nie można ze sobą porównywać."
shortAnswer: >
  SDNN to miara zmienności rytmu serca (HRV): odchylenie standardowe odstępów
  między prawidłowymi uderzeniami serca. Służy do opisu ogólnego rozrzutu
  rytmu serca w całym zapisie i rośnie wraz z długością zapisu, więc wartości
  z różnych urządzeń, aplikacji i trybów pomiaru nie są bezpośrednio
  porównywalne. To miara, którą zapisuje Apple Health. Sama w sobie nie
  przesądza o stresie, stanie zdrowia ani równowadze autonomicznej.
keyPoints:
  - "SDNN opisuje ogólny rozrzut odstępów między prawidłowymi uderzeniami serca w obrębie zapisu."
  - "Odzwierciedla całkowitą zmienność: składają się na nią obie gałęzie autonomicznego układu nerwowego oraz wolniejsze rytmy."
  - "SDNN zależy od długości zapisu, więc krótkie odczyty laboratoryjne, całodobowe wartości z Holtera i nocne liczby z zegarka nie są wymienne."
  - "Apple Health zapisuje HRV jako SDNN, dlatego liczb z Apple Watch nie można porównywać wprost z wartościami RMSSD z innych urządzeń ubieralnych."
  - "Urządzenia ubieralne szacują SDNN z sygnału tętna, a ich zgodność z EKG zależy od urządzenia i warunków."
  - "Pojedyncza wartość SDNN nie jest diagnozą ani odczytem stresu; więcej mówi twój własny trend z porównywalnych warunków."
imageAlt: "Rząd odstępów między uderzeniami serca o różnej długości nad rozkładem punktowym tych odstępów, z turkusowym nawiasem zaznaczającym ich rozrzut wokół średniej — to, co streszcza SDNN."
evidenceMap:
  - claim: "SDNN to odchylenie standardowe odstępów między prawidłowymi uderzeniami serca w całym zapisie."
    limitation: "Standard definicyjny i metodologiczny; sam w sobie nie mówi nic o stanie zdrowia."
  - claim: "„Prawidłowe” oznacza, że przed obliczeniem statystyki usuwa się nieprawidłowe i ektopowe pobudzenia."
    limitation: "Opisuje czyszczenie danych; to, jak rygorystycznie filtruje się uderzenia, różni się między algorytmami i urządzeniami."
  - claim: "SDNN odzwierciedla wszystkie składowe cykliczne odpowiedzialne za zmienność w trakcie zapisu; opisuje całkowitą zmienność, a nie jedną gałąź autonomicznego układu nerwowego."
    limitation: "Właściwość statystyki; udział poszczególnych rytmów zmienia się z długością zapisu i warunkami."
  - claim: "SDNN zależy od długości zapisu: dłuższe zapisy obejmują wolniejsze rytmy i dają większe wartości, więc wartości SDNN z zapisów o różnej długości nie można porównywać."
    limitation: "Metodologiczna właściwość miary; dotyczy każdego porównania między aplikacjami, badaniami i protokołami."
  - claim: "Wartości normatywne HRV dla zapisów całodobowych, krótkoterminowych i ultrakrótkoterminowych nie są wymienne."
    limitation: "Dotyczy wartości normatywnych u osób zdrowych i pacjentów; nocne wartości z urządzeń konsumenckich to jeszcze inny kontekst."
  - claim: "Na SDNN składają się obie gałęzie autonomicznego układu nerwowego, a miara jest silnie związana z wolniejszymi pasmami częstotliwości i mocą całkowitą."
    limitation: "Rozumowanie fizjologiczne na poziomie populacji; udział poszczególnych składowych zmienia się z warunkami zapisu."
  - claim: "Dłuższe zapisy obejmują wolniejsze rytmy — zmienne obciążenie, warunkowanie i procesy dobowe — a każdy z nich powiększa rozrzut."
    limitation: "Wyjaśnia, dlaczego długość okna ma znaczenie, ale nie to, co pojedyncze okno mówi o danej osobie."
  - claim: "RMSSD silniej niż SDNN zależy od gałęzi przywspółczulnej, dlatego obie miary mogą zmieniać się różnie."
    limitation: "Porównanie miar między sobą, a nie pomiar aktywności przywspółczulnej w którejkolwiek z nich."
  - claim: "Napięcia nerwu błędnego nie da się zmierzyć bezpośrednio, a HRV nie jest swoistym markerem aktywności współczulnej ani równowagi współczulno-przywspółczulnej."
    limitation: "Ostrożność metodologiczna z wytycznych i przeglądów; wartości SDNN nie przekładają się na odczyty stanu autonomicznego."
  - claim: "W kardiologii klinicznej SDNN obliczane z całodobowych zapisów EKG służy do stratyfikacji ryzyka u pacjentów."
    limitation: "Populacje kliniczne z ciągłym szpitalnym EKG; nie przenosi się na wartości z zegarków konsumenckich."
  - claim: "W krótkich zapisach spoczynkowych dominującym źródłem zmienności SDNN są związane z oddechem wahania częstości serca."
    limitation: "Dotyczy okna pomiaru; to obserwacja pomiarowa, a nie dowód trwałej zmiany."
  - claim: "Szacunki HRV z PPG w urządzeniach ubieralnych zgadzają się z wartościami z EKG w jednych warunkach, a w innych się rozjeżdżają; zbiorcze szacunki nie dowodzą wymienności."
    limitation: "Zgodność zależy od miary, urządzenia i warunków; ta strona nie podaje liczb dotyczących dokładności."
  - claim: "W kontrolowanych warunkach spoczynkowych PPG na nadgarstku może ściśle odtwarzać wskaźniki HRV z EKG, ale walidacja w warunkach codziennych pozostaje ograniczona."
    limitation: "Walidacja jednego urządzenia u dorosłych w spoczynku z rytmem zatokowym; nie jest to ogólne twierdzenie o dokładności zegarków konsumenckich."
  - claim: "Apple Health zapisuje HRV jako SDNN — obliczane jako odchylenie standardowe odstępów między prawidłowymi uderzeniami serca i rejestrowane automatycznie przez Apple Watch."
    limitation: "Oficjalna dokumentacja; opisuje, co system zapisuje, a nie co wartości znaczą dla zdrowia; dotyczy tylko ekosystemu Apple."
  - claim: "Najnowsze modele Apple Watch z watchOS pokazują dwa warianty HRV — Recovery HRV i Overall HRV — i mierzą HRV nawet co pięć minut."
    limitation: "Komunikat producenta; dotyczy konkretnego sprzętu i wersji systemu; Apple nie podało, jak obliczane jest Recovery HRV."
  - claim: "iOS i watchOS dodają do Apple Health typ danych RMSSD."
    limitation: "Oficjalna dokumentacja; dostępność zależy od wersji systemu; to, co aplikacje zapisują w tym typie, zależy od każdej z nich."
  - claim: "Średnio zmienność rytmu serca u zdrowych dorosłych maleje z wiekiem, choć różnice między ludźmi są duże."
    limitation: "Przekrojowe średnie populacyjne; duży rozrzut w każdym wieku; ta strona nie zawiera tabel według wieku."
  - claim: "Długość zapisu, miejsce pomiaru, oddech i metoda analizy kształtują wartość i rzetelność jej interpretacji."
    limitation: "Konsensus ekspertów co do metod; wielkość każdego efektu zależy od warunków i osoby."
  - claim: "Pojedyncze odczyty wymagają ostrożnej interpretacji w kontekście, a nie odczytywania w oderwaniu od niego."
    limitation: "Konsensus ekspertów co do praktyki interpretacji, a nie bezpośrednie dane eksperymentalne; w praktyce oznacza porównanie z własnym trendem z porównywalnych warunków."
  - claim: "Nieprawidłowe pobudzenia i szum mogą udawać zmienność i zawyżać wartość."
    limitation: "Zastrzeżenie dotyczące jakości danych; urządzenia i algorytmy różnie radzą sobie z artefaktami."
---

## Czym jest SDNN?

SDNN to jedna ze standardowych miar [zmienności rytmu serca](/glossary/heart-rate-variability) (HRV) — naturalnych wahań czasu między kolejnymi uderzeniami serca. Standardy pomiarowe tej dziedziny definiują ją precyzyjnie: {{fact:hrv.sdnn.definition}} [S1]. „NN” w nazwie oznacza normal-to-normal: liczą się tylko odstępy między prawidłowymi uderzeniami serca, a nieprawidłowe pobudzenia usuwa się przed obliczeniem statystyki [S2].

Mówiąc prościej: zbierasz wszystkie odstępy między sąsiednimi prawidłowymi uderzeniami serca w zapisie, sprawdzasz, jak bardzo są rozrzucone wokół swojej średniej, i wyrażasz ten rozrzut jedną wartością w milisekundach. Większa wartość oznacza, że rytm w tym oknie zmieniał się ogółem bardziej.

Najczęściej porównuje się ją z drugą miarą w dziedzinie czasu: {{fact:hrv.rmssd.definition}} [S1]. Obie odpowiadają na różne pytania: RMSSD wyodrębnia zmiany między sąsiednimi uderzeniami, a SDNN opisuje rozrzut całego zapisu. Ta różnica jest powodem, dla którego liczb SDNN i RMSSD nie można porównywać wprost — i powodem, dla którego istnieją obie miary. [Strona o RMSSD](/science/concepts/rmssd) omawia stronę „z uderzenia na uderzenie”; ta strona dotyczy rozrzutu.

## Jak działa SDNN?

SDNN to statystyka okna: wszystko, co porusza rytmem serca w trakcie zapisu, ma w niej swój udział. W krótkim zapisie spoczynkowym dominuje związane z oddechem wznoszenie się i opadanie częstości serca — oddechowa niemiarowość zatokowa — dlatego wolny, spokojny oddech podczas pomiaru wyraźnie podnosi wartość [S2]. W dłuższych zapisach dołączają wolniejsze rytmy: zmienne obciążenie, reakcje warunkowe i cykl snu i czuwania — a każde z nich dokłada do rozrzutu własny udział [S2].

Ponieważ tak wiele wpływów spływa do jednej liczby, SDNN nie rozdziela dwóch gałęzi autonomicznego układu nerwowego — obie mają w niej udział [S2]. Dlatego też nie można jej odczytywać jako bezpośredniego wskaźnika żadnej z nich. Sformułowanie ma tu znaczenie. {{fact:claim.vagalTone}} [S2, S7]. RMSSD, zbudowane z różnic między sąsiednimi uderzeniami, silniej niż SDNN zależy od szybkiej drogi przywspółczulnej [S2] — to jeden z powodów, dla których obie miary mogą opowiadać różne historie o tym samym zapisie.

Długa wersja tej miary ma historię kliniczną: obliczane z całodobowych szpitalnych zapisów EKG u pacjentów kardiologicznych SDNN jest miarą stratyfikacji ryzyka [S2]. Te dane należą do trybu pomiaru — ciągłego klinicznego EKG w populacjach pacjentów — którego zegarek konsumencki nie odtwarza, więc nie należy ich przenosić na nocną wartość z zegarka.

## Jak mierzy się SDNN?

Obliczenie jest proste: bierzesz odstępy między prawidłowymi uderzeniami serca w oknie zapisu i obliczasz ich odchylenie standardowe [S1, S2]. Wszystko, co „wie” SDNN, zależy od dokładności tych odstępów — dlatego metoda zapisu ma większe znaczenie niż arytmetyka.

Metodą referencyjną jest EKG, które wykrywa elektryczny ślad każdego uderzenia serca. Urządzenia ubieralne (wearable) szacują natomiast odstępy z sygnału tętna na skórze (fotopletyzmografia, PPG); wynik często nazywa się zmiennością tętna. Zgodność obu metod zależy od miary i warunków — zwykle jest lepsza w spoczynku przy dobrym sygnale, a słabsza przy ruchu lub złym kontakcie [S5, S6] — a dotychczasowe zbiorcze dane nie obejmują snu ani warunków codziennego życia [S5].

Długość zapisu jest częścią znaczenia wartości. Krótki zapis laboratoryjny, całodobowe EKG metodą Holtera i próbki zapisane przez zegarek to trzy różne tryby pomiaru: SDNN rośnie wraz z długością zapisu, a wartości z różnych trybów nie są wymienne [S2]. Z tego samego powodu publikowane normy dla zapisów całodobowych, krótkoterminowych i ultrakrótkoterminowych traktuje się jak osobne światy [S2].

Tu pojawia się Apple. Praktyczna konsekwencja dla użytkowników Apple Watch: {{fact:applewatch.hrv.healthkit}} [S8]. To decyzja projektowa, a nie naukowy werdykt o tym, która miara jest lepsza: SDNN to obliczenie, którego HealthKit używa od zawsze, opisane w dokumentacji jako odchylenie standardowe odstępów między prawidłowymi uderzeniami serca, rejestrowane automatycznie przez zegarek [S8]. W nowszym sprzęcie: {{fact:applewatch.hrv.variants2026}} [S9]. Apple nie podało, jak obliczane jest Recovery HRV. Niezależnie od tego {{fact:applewatch.hrv.rmssdType}} [S10], co pozwala aplikacjom odczytywać z Apple Health zamiast tego wartość typu RMSSD — to krok w stronę czystszego porównywania między urządzeniami, choć wartości już zebrane pozostają wartościami SDNN.

W praktyce: [kalkulator HRV](/tools/hrv) ma tryb SDNN przeznaczony dla liczb z Apple Watch; codzienne wyjaśnienie, dlaczego urządzenia się nie zgadzają, znajdziesz w artykule [dlaczego twoje HRV jest inne na każdym urządzeniu](/articles/hrv-different-every-device); a o tym, jak zachować porównywalność własnych odczytów, przeczytasz w poradniku [jak mierzyć HRV w spójny sposób](/articles/how-to-measure-hrv-consistently).

## Co wpływa na SDNN?

- Długość zapisu. Czynnik definiujący tę miarę: dłuższe okna gromadzą wolniejsze rytmy i większe wartości, więc krótki odczyt i zapis całodobowy opisują różne światy [S2].
- Warunki zapisu. Długość zapisu, miejsce pomiaru — laboratorium czy codzienne życie — oddech i metoda analizy kształtują wartość i rzetelność każdego porównania [S7].
- Wiek. Średnio zmienność rytmu serca u zdrowych dorosłych maleje z wiekiem [S4]; różnice między ludźmi są duże, a średnie populacyjne nie są osobistymi celami. Tabele według przedziałów wiekowych znajdziesz w [kalkulatorze HRV](/tools/hrv) dla wartości SDNN z Apple Watch oraz w artykule o [prawidłowym HRV według wieku](/articles/normal-hrv-by-age) dla nocnego RMSSD.
- Oddech. Częstość i głębokość oddechu podczas zapisu zmieniają wartość przez związane z oddechem wahania, które odciskają się w rytmie [S2].
- Jakość sygnału. Pominięte lub fałszywe uderzenia zniekształcają wartość, a nieprawidłowe pobudzenia mogą udawać zmienność [S2].
- Codzienne okoliczności. Jak w przypadku innych miar HRV, pojedynczy odczyt może odbiegać od twoich typowych wartości z całkiem zwyczajnych powodów; traktuj takie przesunięcia jako obserwacje, a nie werdykty.

## Co pokazują dane?

Ustalone. Definicja, sposób obliczania i rola SDNN jako miary całkowitej zmienności pochodzą ze standardów pomiarowych dziedziny [S1] i przeglądów metodologicznych [S2, S3]. Zależność od długości zapisu to podstawowa właściwość metodologiczna, a nie niuans [S2]. W kardiologii klinicznej całodobowe SDNN z ciągłego EKG jest uznaną miarą stratyfikacji ryzyka w populacjach pacjentów [S2]. Średnio wartości u zdrowych dorosłych maleją z wiekiem, przy dużym rozrzucie indywidualnym [S4].

Zależy od kontekstu. Szacunki z urządzeń ubieralnych: wartości z PPG mogą ściśle odpowiadać HRV z EKG w kontrolowanych warunkach spoczynkowych, ale zgodność słabnie przy ruchu i słabym sygnale, a zbiorczych szacunków nie można uogólniać na sen ani warunki codziennego życia [S5, S6]. Ekosystem Apple zapisuje HRV jako SDNN — to fakt dotyczący urządzenia o własnym zakresie, a nie twierdzenie zdrowotne [S8, S9, S10].

Wytyczne / konsensus ekspertów. Aktualne wytyczne zalecają spójne warunki zapisu oraz ostrożną interpretację pojedynczych wartości w kontekście, także tych z urządzeń ubieralnych [S7]. To konsensus ekspertów co do tego, jak mierzyć i interpretować — a nie bezpośrednie dane eksperymentalne o samym SDNN.

Co pozostaje niepewne: na ile konsumenckie nocne wartości typu SDNN odpowiadają SDNN z EKG w codziennych warunkach — przy ruchu, różnym kolorze skóry, dopasowaniu czujnika, w różnych fazach snu — wciąż jest badane [S5, S6]. Otwarte pozostaje też pytanie, na ile kliniczne dane całodobowe, zbudowane na ciągłym EKG u pacjentów, przenoszą się na nocne wartości z zegarka u zdrowych użytkowników [S7].

## Czego SDNN ci nie powie

- Nie jest wymienna z RMSSD. Obie miary opisują różne właściwości tego samego zapisu, a ich wartości należą do różnych trybów pomiaru; SDNN z zegarka i RMSSD z pierścienia to nie dwa dialekty jednej liczby [S2, S5].
- To nie jest miernik napięcia nerwu błędnego. {{fact:claim.vagalTone}} [S2, S7]. SDNN zależy od szybkiej drogi przywspółczulnej jeszcze słabiej niż RMSSD [S2].
- To nie jest diagnoza ani odczyt stresu. {{fact:claim.hrvNotStress}} [S1].
- Wyżej nie znaczy automatycznie lepiej. Większy rozrzut może wynikać z silniejszego rytmu — albo z nieprawidłowych pobudzeń i szumu, które udają zmienność i zawyżają liczbę [S2].
- Wartości nie są wymienne między urządzeniami, aplikacjami i trybami pomiaru [S5, S7].
- Pojedyncza wartość mówi niewiele. Wytyczne metodologiczne traktują pojedyncze odczyty jako zależne od kontekstu i zalecają ich ostrożną interpretację w kontekście [S7]; więcej mówi porównanie z twoimi niedawnymi odczytami z porównywalnych warunków.

## W ONDA

Tabele HRV według wieku w ONDA to tabele nocnego RMSSD, ale [kalkulator HRV](/tools/hrv) ma osobny tryb SDNN dla liczb z Apple Watch, z przedziałami z badań krótkich spoczynkowych zapisów EKG u zdrowych dorosłych. Nocna osobista linia bazowa w samej aplikacji opiera się na wartościach HRV zapisanych w Apple Health — z Apple Watch lub z innego urządzenia, które synchronizuje tam dane o sercu. Dokumentacja mówi to wprost: {{fact:applewatch.hrv.healthkit}} [S8] — więc ten sygnał opiera się na SDNN, a nie na RMSSD. Odczyt na żywo w trakcie praktyki to wskaźnik zastępczy obliczany z odchylenia standardowego tętna, a nie SDNN ani RMSSD, a aparat telefonu podaje tętno, nie HRV. ONDA opisuje i porównuje twoje własne wyniki; niczego nie diagnozuje. Zobacz, [co mierzy ONDA](/measurements).

> Informacje edukacyjne, a nie diagnoza ani leczenie.
