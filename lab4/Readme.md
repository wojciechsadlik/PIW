Laboratorium 4:
Zadania wykorzystujące workery.

Zadanie 1: Symulacja punktu obsługi.

Napisać program w JavaScripcie, który wykorzystując kolejkę zwykłą (FIFO) zasymuluje obsługę kolejki klientów przez trzech urzędników (A, B, C).
Każdy klient w kolejce ma do załatwienia sprawę, która wymaga określonego z góry czasu ti (założyć, że czas ten ma rozkład normlany). Zakłada się, że: - każdy klient trafia na koniec kolejki z czasem „losowym”, w „losowym” momencie (czasu pomiędzy klientami ma rozkład wykładniczy), - klient z czoła kolejki trafia do tego urzędnika, który jest „wolny” (jeśli wielu jest wolnych, decyduje kolejność od A do C). Każdy urzędnik, kolejka i generator klientów  ma być realizowany jako worker. Kolejka ma miec skończoną długość, w przypadku pojawienia się klienta przy maksymalnym rozmiarze kolejki ma być odrzucany. 
Zaimplementuj stosowny algorytm oraz zilustruj jego działanie na ekranie przeglądarki: stan aktulany systemu i stan skumolowany (np. ilość obsłużonych od poczatku, ilośc odczuconych). Pozwól użytkownikowi regulowac parametrami rozkładu i max. długościa  kolejki.

Zadanie 2: Złożony algorytm.

Rozwiązanie zadania:
https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/tree_product/

Napisać jako funkcję i uruchomić jako worker. Dopisać funkcje losujące dane o zadanym rozmiarze.
