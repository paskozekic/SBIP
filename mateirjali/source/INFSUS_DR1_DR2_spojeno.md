# Sustav za prodaju i iznajmljivanje bicikala

**Paško Zekić**  
**Lovre Rančev**

---

## Sadržaj

1. [Prijedlog projekta](#prijedlog-projekta)
   - Naziv i kratica projekta
   - Kratki opis projekta
   - Svrha projekta
   - Ciljevi projekta
   - Potencijalni korisnici / tržište
   - Isporuke projekta
   - Kriteriji za mjerenje uspješnosti
2. [Plan projekta](#plan-projekta)
   - Ganttogram
3. [Studija izvedivosti](#studija-izvedivosti)
   - Tri alternative
   - Kriteriji vrednovanja
   - Izračun ponderiranih ocjena
   - Analiza sadašnje vrijednosti troškova
4. [Specifikacija zahtjeva](#specifikacija-zahtjeva)
   - Poslovni zahtjevi
   - Korisnički zahtjevi
   - Funkcionalni zahtjevi
   - Nefunkcionalni zahtjevi
   - Matica sljedivosti zahtjeva
5. [DFD dijagrami u 3 razine](#dfd-dijagrami-u-3-razine)
   - Dijagram konteksta
   - Dijagram glavnih procesa
   - Detaljni dijagram za proces upravljanje iznajmljivanjem
   - Dijagram dekompozicije funkcija
6. [Izvori porijekla zahtjeva](#izvori-porijekla-zahtjeva)
7. [Specifikacija dizajna](#specifikacija-dizajna)
   - Oblikovanje podataka
   - Objektni model

---

# Prijedlog projekta

## Naziv i kratica projekta

**Naziv:** Sustav za prodaju i iznajmljivanje bicikala  
**Kratica:** SPIB

## Kratki opis projekta

Projekt obuhvaća razvoj web-aplikacije koja omogućuje korisnicima pregledavanje, kupnju i iznajmljivanje bicikala putem interneta. Sustav podržava upravljanje katalogom bicikala, obradu narudžbi za kupnju, upravljanje iznajmljivanjem (s evidencijom trajanja i povrata), upravljanje korisnicima te izvještavanje o poslovanju. Namijenjen je trgovinama bicikala koje žele digitalizirati svoje poslovanje i ponuditi usluge online.

## Svrha projekta

Svrha projekta je automatizirati i digitalizirati procese prodaje i iznajmljivanja bicikala, čime se smanjuje ručno administriranje, povećava dostupnost usluge korisnicima te omogućuje bolji uvid u poslovanje kroz izvještaje i statistike.

## Ciljevi projekta

| ID | Cilj |
|----|------|
| C1 | Omogućiti korisnicima online pregledavanje i pretraživanje kataloga bicikala |
| C2 | Omogućiti kupnju bicikala putem web-aplikacije s online plaćanjem |
| C3 | Omogućiti iznajmljivanje bicikala s automatskim praćenjem statusa (iznajmljen, vraćen, kašnjenje) |
| C4 | Osigurati administraciju kataloga, korisnika i transakcija za djelatnike trgovine |
| C5 | Generirati izvještaje o prodaji, iznajmljivanju i prihodima |

## Potencijalni korisnici / tržište

- **Kupci/Iznajmljivači** – fizičke osobe koje žele kupiti ili iznajmiti bicikl online
- **Djelatnici trgovine** – zaposlenici koji upravljaju katalogom, narudžbama i iznajmljivanjima
- **Administrator sustava** – osoba zadužena za tehničko održavanje sustava

**Tržište:** Lokalne i regionalne trgovine bicikala, turistički centri, kampovi i hosteli koji nude iznajmljivanje.

## Isporuke projekta

| Isporuka | Opis |
|----------|------|
| Prijedlog projekta | Dokumentacija s opisom projekta, planom i studijom izvedivosti |
| Specifikacija zahtjeva | Zahtjevi, DFD dijagrami, modeli |
| Specifikacija dizajna | ER dijagram, objektni model, dijagrami aktivnosti, baza podataka |
| Programsko rješenje | Web-aplikacija s CRUD operacijama, master-detail formama, validacijom |
| Testovi | Jedinični i integracijski testovi |
| Automatizacija procesa | Model protoka poslova u Camundi s korisničkim sučeljem |

## Kriteriji za mjerenje uspješnosti

| Br. | Kriterij | Mjera |
|-----|----------|-------|
| K1 | Funkcionalnost kataloga | Korisnik može pregledati, filtrirati i pretraživati bicikle po kategoriji, cijeni i dostupnosti |
| K2 | Kupnja | Uspješno kreirana narudžba s potvrdom u manje od 3 koraka |
| K3 | Iznajmljivanje | Sustav automatski prati status iznajmljivanja i šalje obavijest pri kašnjenju |
| K4 | Administracija | Djelatnik može dodati/urediti/obrisati bicikl i upravljati narudžbama unutar 5 klikova |
| K5 | Izvještaji | Sustav generira mjesečne izvještaje o prodaji i iznajmljivanju |
| K6 | Dostupnost | Sustav je dostupan 99% vremena |

---

# Plan projekta

| Faza | Ključni koraci | Trajanje | Prekretnica (milestone) |
|------|----------------|----------|------------------------|
| Pokretanje projekta | Definiranje opsega, ciljeva i dionika; izrada povelje projekta | Tjedan 1–2 | P1: Odobren prijedlog projekta |
| Analiza zahtjeva | Prikupljanje zahtjeva, definiranje poslovnih, korisničkih, funkcionalnih i nefunkcionalnih zahtjeva; izrada dijagrama, izrada modela funkcija | Tjedan 2–4 | P2: Završena specifikacija zahtjeva |
| Studija izvedivosti | Analiza 3 tehnološke alternative; ponderirano vrednovanje; analiza troškova i koristi (NPV kroz 3 godine) | Tjedan 3–4 | P3: Odobrena studija izvedivosti |
| Oblikovanje sustava | Izrada ER dijagrama (min. 7 entiteta); kreiranje baze podataka i skripti; izrada dijagrama aktivnosti, slučajeva korištenja, CRC kartica i dijagrama razreda | Tjedan 5–7 | P4: Završena specifikacija dizajna |
| Implementacija | Odabir arhitekture; razvoj master-detail forme; razvoj forme šifrarnika; implementacija CRUD operacija, navigacije, validacije, padajućih lista | Tjedan 8–11 | P5: Funkcionalno programsko rješenje |
| Testiranje | Izrada jediničnih testova (prezentacijski, poslovni, podatkovni sloj); izrada integracijskih testova; pokretanje i ispravak grešaka | Tjedan 10–12 | P6: Testirano rješenje |
| Automatizacija procesa | Modeliranje procesa, izrada korisničkog sučelja za demonstraciju procesa | Tjedan 12–14 | P7: Automatiziran poslovni proces |
| Završetak projekta | Finalna dokumentacija; priprema repozitorija s uputama; isporuka ZIP arhive | Tjedan 14–15 | P8: Projekt isporučen |

## Ganttogram

![Ganttogram projekta](images/dr1_image1.png)

---

# Studija izvedivosti

## Tri alternative

| Oznaka | Alternativa | Opis |
|--------|-------------|------|
| A1 | Gotovo rješenje (SaaS) | Korištenje postojeće platforme poput Shopify + plugin za najam (npr. BookThatApp) |
| A2 | Vlastiti razvoj (custom) | Razvoj od nule koristeći React + Node.js + PostgreSQL |
| A3 | Hibridno rješenje | WooCommerce (WordPress) s prilagođenim pluginom za iznajmljivanje |

## Kriteriji vrednovanja

|    | Kriterij | Ponder | A1 | A2 | A3 |
|----|----------|--------|----|----|----|
| K1 | Prilagodljivost poslovnim zahtjevima | 20% | 4 | 9 | 7 |
| K2 | Troškovi razvoja i uvođenja | 15% | 8 | 3 | 6 |
| K3 | Vrijeme do puštanja u rad | 10% | 9 | 3 | 6 |
| K4 | Mogućnost integracije s vanjskim sustavima (banka, dostava) | 10% | 6 | 9 | 7 |
| K5 | Skalabilnost i performanse | 10% | 7 | 9 | 5 |
| K6 | Jednostavnost održavanja | 15% | 8 | 5 | 6 |
| K7 | Kontrola nad podacima i sigurnost | 10% | 4 | 9 | 6 |
| K8 | Podrška za specifičnu logiku iznajmljivanja (trajanje, kašnjenje, povrat) | 10% | 3 | 9 | 6 |

## Izračun ponderiranih ocjena

| # | Kriterij | Ponder | A1 | A1×P | A2 | A2×P | A3 | A3×P |
|---|----------|--------|----|------|----|------|----|------|
| K1 | Prilagodljivost | 0.20 | 4 | 0.80 | 9 | 1.80 | 7 | 1.40 |
| K2 | Troškovi razvoja | 0.15 | 8 | 1.20 | 3 | 0.45 | 6 | 0.90 |
| K3 | Vrijeme do puštanja | 0.10 | 9 | 0.90 | 3 | 0.30 | 6 | 0.60 |
| K4 | Integracija | 0.10 | 6 | 0.60 | 9 | 0.90 | 7 | 0.70 |
| K5 | Skalabilnost | 0.10 | 7 | 0.70 | 9 | 0.90 | 5 | 0.50 |
| K6 | Održavanje | 0.15 | 8 | 1.20 | 5 | 0.75 | 6 | 0.90 |
| K7 | Sigurnost i kontrola | 0.10 | 4 | 0.40 | 9 | 0.90 | 6 | 0.60 |
| K8 | Logika iznajmljivanja | 0.10 | 3 | 0.30 | 9 | 0.90 | 6 | 0.60 |
| **UKUPNO** | | **1.00** | | **6.10** | | **6.90** | | **6.20** |

**A1 – SaaS (Shopify):**
- K1 (4): Ograničena prilagodba – Shopify podržava prodaju, ali logika iznajmljivanja s praćenjem povrata i kašnjenja zahtijeva skupe dodatke koji nisu fleksibilni
- K2 (8): Niski početni troškovi – mjesečna pretplata (~30€/mj), bez troškova razvoja od nule
- K3 (9): Najbrže puštanje – sustav je gotov, potrebna samo konfiguracija i unos podataka
- K7 (4): Podaci su na Shopify poslužiteljima – ograničena kontrola, ovisnost o vanjskom pružatelju
- K8 (3): Shopify nema nativnu podršku za iznajmljivanje – plugini su ograničeni i ne podržavaju složenu logiku kašnjenja/penala

**A2 – Vlastiti razvoj:**
- K1 (9): Potpuna prilagodba – svaka funkcionalnost se razvija prema specifičnim zahtjevima sustava
- K2 (3): Visoki troškovi – potreban tim developera, duže vrijeme razvoja
- K3 (3): Najduže vrijeme – razvoj od nule traje mjesecima
- K5 (9): Potpuna kontrola nad arhitekturom, optimizacija prema potrebi
- K8 (9): Logika iznajmljivanja implementira se točno prema zahtjevima – praćenje statusa, automatske obavijesti, penali za kašnjenje

**A3 – Hibrid (WooCommerce):**
- K1 (7): Dobra prilagodba kroz custom plugin, ali ograničena WordPress arhitekturom
- K5 (5): WordPress nije optimalan za visoko opterećenje; skalabilnost je ograničena
- K6 (6): Održavanje zahtijeva poznavanje WordPress ekosustava i praćenje sigurnosnih zakrpa

> **Zaključak:** Odabrana je alternativa **A2 – vlastiti razvoj** s ponderiranom ocjenom **6.90** jer pruža najveću prilagodljivost i kontrolu nad specifičnom logikom iznajmljivanja bicikala.

## Analiza sadašnje vrijednosti troškova

### Troškovi

|    | Stavka troška | Godina 0 (razvoj) | Godina 1 | Godina 2 | Godina 3 |
|----|--------------|:-----------------:|:--------:|:--------:|:--------:|
| T1 | Razvoj aplikacije (programeri) | 15.000 € | – | – | – |
| T2 | Oblikovanje UI/UX dizajna | 3.000 € | – | – | – |
| T3 | Nabava poslužitelja i infrastrukture | 2.000 € | – | – | – |
| T4 | Hosting i cloud usluge | – | 1.200 € | 1.200 € | 1.200 € |
| T5 | Održavanje i nadogradnje | – | 3.000 € | 3.000 € | 3.000 € |
| T6 | Edukacija zaposlenika | 1.000 € | 500 € | 500 € | 500 € |
| T7 | Sigurnosne revizije i certifikati | – | 1.000 € | 1.000 € | 1.000 € |
| T8 | Marketing i promocija sustava | 2.000 € | 1.500 € | 1.000 € | 1.000 € |
| **Ukupni troškovi** | | **23.000 €** | **7.200 €** | **6.700 €** | **6.700 €** |

### Koristi

|    | Stavka koristi | Godina 0 | Godina 1 | Godina 2 | Godina 3 |
|----|---------------|:--------:|:--------:|:--------:|:--------:|
| B1 | Prihod od online prodaje bicikala | 0 € | 18.000 € | 22.000 € | 26.000 € |
| B2 | Prihod od iznajmljivanja bicikala | 0 € | 8.000 € | 10.000 € | 12.000 € |
| B3 | Ušteda na administrativnom radu | 0 € | 3.000 € | 3.000 € | 3.000 € |
| B4 | Smanjenje pogrešaka u evidenciji najma | 0 € | 1.000 € | 1.500 € | 1.500 € |
| B5 | Povećanje baze korisnika (online dostupnost) | 0 € | 2.000 € | 3.000 € | 4.000 € |
| B6 | Ušteda na tiskanim materijalima i katalozima | 0 € | 500 € | 500 € | 500 € |
| B7 | Prihod od penala za kašnjenje s povratom | 0 € | 500 € | 700 € | 900 € |
| **Ukupne koristi** | | **0 €** | **33.000 €** | **40.700 €** | **47.900 €** |

**Obrazloženje troškova:**
- T1 (15.000€): Procjena za 2 razvojna programera kroz 3 mjeseca rada
- T4 (1.200€/god): Cloud hosting (npr. DigitalOcean/AWS) za web aplikaciju i bazu podataka
- T5 (3.000€/god): Godišnje nadogradnje, popravci bugova, prilagodbe novim zahtjevima
- T8: Marketing je veći u godini 0, zatim pada jer je sustav poznat

**Obrazloženje koristi:**
- B1: Online prodaja raste jer se povećava baza korisnika – godina 1 je konzervativna procjena
- B2: Iznajmljivanje generira stalni prihod, posebno u turističkoj sezoni
- B3: Automatizacija smanjuje potrebu za ručnim unosom podataka – ušteda ~1 radni sat dnevno
- B7: Sustav automatski obračunava penale za kašnjenje, što je danas nemoguće pratiti ručno

> **Zaključak:** Projekt je financijski isplativ s NPV-om od **62.742 €** kroz 3 godine, što potvrđuje opravdanost ulaganja u vlastiti razvoj sustava.

---

# Specifikacija zahtjeva

## Poslovni zahtjevi

| ID | Zahtjev |
|----|---------|
| PZ-01 | Sustav mora omogućiti prodaju bicikala putem interneta kako bi se povećao prihod trgovine za najmanje 20% u prvoj godini. |
| PZ-02 | Sustav mora omogućiti iznajmljivanje bicikala s automatskim praćenjem statusa najma, čime se smanjuje administrativni rad za najmanje 50%. |
| PZ-03 | Sustav mora generirati izvještaje o prodaji i iznajmljivanju radi donošenja poslovnih odluka. |

## Korisnički zahtjevi

| ID | Zahtjev | Korisnik | Prioritet |
|----|---------|----------|-----------|
| KZ-01 | Kao kupac, želim pregledavati katalog bicikala s mogućnošću filtriranja po kategoriji, cijeni i dostupnosti, kako bih brzo pronašao željeni bicikl. | Kupac | Visok |
| KZ-02 | Kao kupac, želim iznajmiti bicikl odabirom datuma početka i kraja najma te odmah vidjeti ukupnu cijenu, kako bih mogao donijeti odluku. | Kupac | Visok |
| KZ-03 | Kao djelatnik, želim imati pregled svih aktivnih iznajmljivanja sa statusom (aktivan, vraćen, kašnjenje), kako bih mogao pravovremeno reagirati. | Djelatnik | Visok |
| KZ-04 | Kao djelatnik, želim upravljati katalogom bicikala (dodavanje, uređivanje, brisanje), kako bi ponuda uvijek bila aktivna. | Djelatnik | Srednji |

## Funkcionalni zahtjevi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| FZ-01 | Sustav mora omogućiti registraciju i prijavu korisnika putem e-mail adrese i lozinke. | Visok |
| FZ-02 | Sustav mora prikazivati katalog bicikala s nazivom, slikom, kategorijom, cijenom prodaje, cijenom najma po danu i statusom dostupnosti. | Visok |
| FZ-03 | Sustav mora omogućiti kreiranje narudžbe za kupnju bicikla s odabirom načina plaćanja i adrese dostave. | Visok |
| FZ-04 | Sustav mora omogućiti kreiranje rezervacije za iznajmljivanje bicikla s odabirom datuma početka i završetka najma. | Visok |
| FZ-05 | Sustav mora automatski izračunavati ukupnu cijenu najma na temelju broja dana i cijene po danu. | Visok |
| FZ-06 | Sustav mora automatski mijenjati status bicikla (dostupan, iznajmljen, prodan, u servisu) nakon svake transakcije. | Visok |
| FZ-07 | Sustav mora omogućiti pretraživanje bicikala po nazivu, kategoriji i rasponu cijena. | Srednji |
| FZ-08 | Sustav mora generirati obavijest djelatniku kada korisnik kasni s povratom iznajmljenog bicikla više od 24 sata. | Srednji |
| FZ-09 | Sustav mora omogućiti odabir kategorije bicikla putem padajuće liste prilikom unosa novog bicikla u katalog. | Srednji |
| FZ-10 | Sustav mora validirati da datum završetka najma ne može biti raniji od datuma početka najma. | Visok |

## Nefunkcionalni zahtjevi

| ID | Zahtjev | Kategorija | Prioritet |
|----|---------|------------|-----------|
| NF-01 | Sustav mora odgovoriti na korisnikov zahtjev u manje od 2 sekunde za 95% zahtjeva pri opterećenju do 100 istovremenih korisnika. | Performanse | Visok |
| NF-02 | Sustav mora biti dostupan najmanje 99% vremena na mjesečnoj razini. | Dostupnost | Visok |
| NF-03 | Svi korisnički podaci moraju biti pohranjeni u skladu s GDPR regulativom, a lozinke kriptirane algoritmom bcrypt. | Sigurnost | Visok |
| NF-04 | Sustav mora podržavati rad na desktop i mobilnim preglednicima (responzivni dizajn). | Upotrebljivost | Srednji |

## Matica sljedivosti zahtjeva

|  | FZ-01 | FZ-02 | FZ-03 | FZ-04 | FZ-05 | FZ-06 | FZ-07 | FZ-08 | FZ-09 | FZ-10 |
|--|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| PZ-01 (prodaja) |  | ✓ | ✓ |  |  | ✓ | ✓ |  | ✓ |  |
| PZ-02 (najam) |  | ✓ |  | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |
| PZ-03 (izvještaji) |  |  |  |  |  |  |  | ✓ |  |  |

---

# DFD dijagrami u 3 razine

## Dijagram konteksta

![Dijagram konteksta](images/dr1_image2.png)

## Dijagram glavnih procesa

![Dijagram glavnih procesa](images/dr1_image3.png)

| Od | Prema | Tok |
|----|-------|-----|
| Kupac | Upravljanje korisnicima | Registracijski podaci, podaci za prijavu |
| Upravljanje korisnicima | Kupac | Potvrda registracije, autentifikacija |
| Upravljanje korisnicima | Korisnici | Pohrana korisničkih podataka |
| Korisnici | Upravljanje korisnicima | Dohvat korisničkih podataka |
| Kupac | Upravljanje katalogom bicikala | Upit za pregled kataloga, kriteriji pretraživanja |
| Upravljanje katalogom bicikala | Kupac | Katalog bicikala, rezultati pretrage |
| Djelatnik | Upravljanje katalogom bicikala | Podaci o novom biciklu, izmjena podataka |
| Upravljanje katalogom bicikala | Bicikli | Pohrana/ažuriranje bicikla |
| Bicikli | Upravljanje katalogom bicikala | Dohvat podataka o biciklima |
| Upravljanje katalogom bicikala | Kategorije bicikala | Dohvat/pohrana kategorija |
| Kategorije bicikala | Upravljanje katalogom bicikala | Popis kategorija |
| Kupac | Obrada narudžbi | Narudžba (bicikl, količina, adresa) |
| Obrada narudžbi | Kupac | Potvrda narudžbe, račun |
| Obrada narudžbi | Narudžbe | Pohrana narudžbe |
| Narudžbe | Obrada narudžbi | Dohvat narudžbi |
| Obrada narudžbi | Bicikli | Ažuriranje statusa bicikla (prodan) |
| Obrada narudžbi | Obrada plaćanja | Zahtjev za plaćanje kupnje |
| Kupac | Upravljanje iznajmljivanjem | Zahtjev za najam (bicikl, datum od, datum do) |
| Upravljanje iznajmljivanjem | Kupac | Potvrda najma, obavijest o kašnjenju |
| Upravljanje iznajmljivanjem | Iznajmljivanja | Pohrana iznajmljivanja |
| Iznajmljivanja | Upravljanje iznajmljivanjem | Dohvat iznajmljivanja |
| Upravljanje iznajmljivanjem | Bicikli | Ažuriranje statusa bicikla (iznajmljen/vraćen) |
| Djelatnik | Upravljanje iznajmljivanjem | Evidencija povrata bicikla |
| Upravljanje iznajmljivanjem | Obrada plaćanja | Zahtjev za plaćanje najma |
| Obrada plaćanja | Bankovni sustav | Zahtjev za naplatu |
| Bankovni sustav | Obrada plaćanja | Potvrda plaćanja |
| Obrada plaćanja | Obrada narudžbi | Potvrda plaćanja kupnje |
| Obrada plaćanja | Upravljanje iznajmljivanjem | Potvrda plaćanja najma |
| Djelatnik | Izvještavanje | Zahtjev za izvještaj |
| Izvještavanje | Djelatnik | Izvještaj o prodaji, izvještaj o najmu |
| Izvještavanje | Narudžbe | Dohvat podataka o narudžbama |
| Izvještavanje | Iznajmljivanja | Dohvat podataka o iznajmljivanjima |
| Administrator | Upravljanje korisnicima | Upravljanje korisničkim računima |

## Detaljni dijagram za proces upravljanje iznajmljivanjem

![Detaljni dijagram – upravljanje iznajmljivanjem](images/dr1_image4.png)

| Od | Prema | Tok |
|----|-------|-----|
| Kupac | Zaprimanje zahtjeva za najam | Zahtjev za najam (bicikl, datum od, datum do) |
| Zaprimanje zahtjeva za najam | Provjera dostupnosti bicikla | Podaci o traženom biciklu i razdoblju |
| Provjera dostupnosti bicikla | Bicikli | Upit o statusu bicikla |
| Bicikli | Provjera dostupnosti bicikla | Status bicikla (dostupan/nedostupan) |
| Provjera dostupnosti bicikla | Kupac | Obavijest o nedostupnosti (ako nije dostupan) |
| Provjera dostupnosti bicikla | Izračun cijene najma | Potvrda dostupnosti, broj dana najma |
| Izračun cijene najma | Bicikli | Dohvat cijene najma po danu |
| Bicikli | Izračun cijene najma | Cijena najma po danu |
| Izračun cijene najma | Kreiranje rezervacije | Izračunata ukupna cijena |
| Kreiranje rezervacije | Iznajmljivanja | Pohrana rezervacije (status: aktivan) |
| Kreiranje rezervacije | Bicikli | Ažuriranje statusa bicikla → "iznajmljen" |
| Kreiranje rezervacije | Kupac | Potvrda najma s ukupnom cijenom |
| Kreiranje rezervacije | Obrada plaćanja | Zahtjev za plaćanje najma |
| Djelatnik | Evidencija povrata bicikla | Evidencija povrata (ID najma, datum povrata) |
| Evidencija povrata bicikla | Iznajmljivanja | Ažuriranje rezervacije (status: vraćen) |
| Evidencija povrata bicikla | Bicikli | Ažuriranje statusa bicikla → "dostupan" |
| Evidencija povrata bicikla | Provjera kašnjenja i obračun penala | Podatak o stvarnom datumu povrata |
| Provjera kašnjenja i obračun penala | Iznajmljivanja | Dohvat planiranog datuma povrata |
| Iznajmljivanja | Provjera kašnjenja i obračun penala | Planirani datum povrata |
| Provjera kašnjenja i obračun penala | Kupac | Obavijest o kašnjenju + iznos penala |
| Provjera kašnjenja i obračun penala | Obrada plaćanja | Zahtjev za naplatu penala |

## Dijagram dekompozicije funkcija

![Dijagram dekompozicije funkcija](images/dr1_image5.png)

---

# Izvori porijekla zahtjeva

## Izvor 1

**Web adresa:** https://www.listnride.com

**Opis:** Peer-to-peer platforma za iznajmljivanje bicikala. Vlasnici objavljuju svoje bicikle, a korisnici ih mogu rezervirati online.

| Funkcionalnost | Objašnjenje | Preslikano u zahtjev |
|----------------|-------------|----------------------|
| Detaljni profil bicikla | Svaki bicikl ima sliku, opis, kategoriju i cijenu po danu | FZ-02 |
| Registracija i prijava | Korisnički račun potreban za rezervaciju | FZ-01 |
| Kalendar dostupnosti | Vizualni prikaz slobodnih datuma za odabrani bicikl | FZ-04, FZ-06 |
| Kategorizacija bicikala | Bicikli su podijeljeni u kategorije (gradski, brdski, električni...) | FZ-09 |

## Izvor 2

**Web adresa:** https://www.bikerent.com

**Opis:** BikeRent je online platforma za iznajmljivanje bicikala koja omogućuje korisnicima pregledavanje dostupnih bicikala po lokaciji, kategoriji i cijeni te online rezervaciju.

| Funkcionalnost | Objašnjenje | Preslikano u naš zahtjev |
|----------------|-------------|--------------------------|
| Katalog s filtrima | Korisnik može filtrirati po tipu bicikla, cijeni i lokaciji | FZ-02, FZ-07 |
| Online rezervacija | Odabir datuma početka i kraja najma s automatskim izračunom cijene | FZ-04, FZ-05 |
| Status dostupnosti | Svaki bicikl ima oznaku "dostupan" ili "iznajmljen" | FZ-06 |
| Korisnički račun | Registracija i prijava za praćenje aktivnih rezervacija | FZ-01 |

## Izvor 3

**Web adresa:** https://www.nextbike.hr

**Opis:** Nextbike je sustav javnih bicikala prisutan u brojnim hrvatskim gradovima (Zagreb, Split, Zadar, Šibenik...). Korisnici putem aplikacije ili web stranice mogu pronaći najbližu stanicu, iznajmiti bicikl i pratiti svoje vožnje.

| Funkcionalnost | Objašnjenje | Preslikano u zahtjev |
|----------------|-------------|----------------------|
| Registracija korisnika | Kreiranje računa putem e-maila za korištenje usluge | FZ-01 |
| Pregled dostupnih bicikala | Mapa s lokacijama i brojem slobodnih bicikala na svakoj stanici | FZ-02, FZ-06 |
| Iznajmljivanje bicikla | Korisnik odabire bicikl i pokreće najam putem aplikacije | FZ-04 |
| Automatski izračun cijene | Cijena se obračunava prema trajanju vožnje | FZ-05 |
| Praćenje statusa najma | Korisnik vidi je li najam aktivan, završen ili u kašnjenju | FZ-06, FZ-08 |
| Povijest vožnji | Pregled svih prošlih iznajmljivanja s datumima i cijenama | KZ-02 |

---

# Specifikacija dizajna

## 1. Oblikovanje podataka

### 1.1 Konceptualni model podataka

Konceptualni model podataka prikazuje glavne entitete sustava za prodaju i iznajmljivanje bicikala te njihove međusobne odnose. Model uključuje entitete poput korisnika, bicikla, narudžbe, najma i plaćanja. U modelu su prikazane i specijalizacije entiteta (npr. korisnik → kupac i djelatnik) te spojni entiteti koji rješavaju M:N veze.

![ER dijagram sustava za prodaju i najam bicikala](images/dr2_image1.png)

### 1.2 Model baze podataka

Na temelju ER modela izrađen je relacijski model baze podataka. Svaki entitet iz konceptualnog modela transformiran je u relaciju (tablicu), dok su veze između entiteta implementirane korištenjem stranih ključeva.

![Relacijska shema baze podataka](images/dr2_image2.png)

### 1.3 Skripta za kreiranje baze podataka

Baza podataka implementirana je u sustavu PostgreSQL. Skripta za kreiranje baze podataka definira sve tablice, primarne ključeve, strane ključeve i ograničenja integriteta. Skripta za punjenje baze i skripta za kreiranje baze se nalaze u zip datoteci.

---

## 2. Objektni model

### 2.1 Dijagram aktivnosti

Dijagram aktivnosti prikazuje tijek procesa iznajmljivanja bicikla u sustavu. Proces započinje pregledom kataloga bicikala, nakon čega korisnik odabire bicikl i unosi trajanje najma. Sustav provjerava dostupnost bicikla, izračunava cijenu najma te omogućuje potvrdu i plaćanje najma.

![Dijagram aktivnosti – proces iznajmljivanja bicikla](images/dr2_image3.png)

### 2.2 Slučajevi korištenja – Iznajmljivanje bicikla

**Sudionici:** Kupac, Sustav, Djelatnik, Bankovni sustav

**Glavni tijek:**

1. Kupac pregledava katalog bicikala.
2. Kupac odabire bicikl za najam.
3. Kupac unosi trajanje najma.
4. Sustav provjerava dostupnost bicikla.
5. Sustav izračunava cijenu najma.
6. Kupac potvrđuje najam.
7. Djelatnik evidentira najam.
8. Kupac izvršava plaćanje.
9. Sustav potvrđuje uspješno iznajmljivanje.

**Alternativni tokovi:**
- A1 – Bicikl nije dostupan: Sustav obavještava korisnika da bicikl nije dostupan.
- A2 – Neuspješno plaćanje: Sustav obavještava korisnika o neuspješnoj transakciji.

### 2.3 Dijagram slučajeva korištenja

![Dijagram slučajeva korištenja sustava](images/dr2_image4.png)

### 2.4 CRC kartice

CRC kartice (Class‑Responsibility‑Collaborator) koriste se za definiranje odgovornosti pojedinih razreda i njihovih međusobnih suradnji.

![CRC kartice razreda sustava](images/dr2_image5.png)

### 2.5 Dijagram razreda

Dijagram razreda prikazuje strukturu objektnog modela sustava. Dijagram uključuje razrede, njihove atribute i veze među razredima.

![Dijagram razreda sustava](images/dr2_image6.png)
