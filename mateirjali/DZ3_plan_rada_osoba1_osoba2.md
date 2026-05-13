# DZ3 – plan rada u paru (Osoba 1 / Osoba 2)

**Ažurirani dogovor:** **Dijagrami** (komponenti, detaljni UML) **zanemarujemo** dok gradimo sustav — prednost ima **radi kod**. **Implementaciju** (Faza B backend, Faza C frontend, Faza D testovi u kodu, README/API) u praksi radi **Paško** uz Cursor u ovom repou (**sve što su bile Osoba 1 i Osoba 2**). **Kolega** radi **samo testiranje** (QA) nakon svakog pusha, s listom „što testirati“. Formalni prilozi predmeta (PDF, screenshotovi **stvarnih** ekrana) rade se kad funkcionalnost postoji.

Dokument ispod: **komentar na bazu** i **checklistu faza** (narudžba vs. kategorije) — kao redoslijed implementacije, ne podjelu na dvoje implementatora.

---

## 1. Komentar na bazu (kako se čini)

### Što je dobro

- **Jasna podjela uloga:** `Korisnik` + specijalizacije `Kupac` / `Djelatnik` (1:1 na korisnika) odgovaraju SPIB domeni i olakšavaju FK na narudžbe i najmove.
- **Koncept narudžbe:** `Narudzba` + `StavkaNarudzbe` s **snimljenom cijenom** na stavci ispravno modelira „cijena u trenutku kupnje“, ne samo trenutnu cijenu iz kataloga.
- **Ograničenja u bazi:** `CHECK` na cijenama, količinama, datumu najma (`datum_zavrsetka >= datum_pocetka`) – dobar temelj da se dio pravila ne može slučajno „obiti“ samo u UI-ju.
- **Plaćanje:** generički `Placanje` + veze `PlacanjeNarudzbe` / `PlacanjeNajma` s **UNIQUE** na `narudzba_id` / `najam_id` jasno govori „jedna glavna transakcija plaćanja po narudžbi/najmu“ (za MVP u redu).

### Što bi profesor ili reviewer mogao zamjeriti (nije nužno blokirajuće, ali vrijedi znati)

- **Uloge korisnika:** shema dopušta da isti `korisnik_id` postoji i u `Kupac` i u `Djelatnik` (nema baze koja to zabranjuje). Ako u aplikaciji želite „ili-ili“, to treba **pravilo u poslovnom sloju** ili dodatna ograničenja (npr. trigger / posebna tablica uloga).
- **Statusi kao slobodan tekst:** `status`, `status_najma`, `status_placanja`, `metoda` su `VARCHAR` bez šifrarnika u bazi. Za DZ3 je to prilika: **šifrarnik u aplikaciji** može mapirati na ove stupce, a kasnije po želji `CHECK` ili lookup tablice.
- **Zaliha vs. najam:** `Bicikl.kolicina` ne povezuje se automatski s `Najam` – smanjenje zalihe i „bicikl iznajmljen“ moraju živjeti u **poslovnoj logici** (i složenija validacija iz zadaće može biti upravo ovdje: preklapanje datuma najma za isti bicikl, dostupnost i sl.).
- **Lozinka u tablici:** `lozinka` kao običan string – za pravu sigurnost trebao bi biti **hash**; za fakultetski demo često prolazi, ali u dokumentaciji možete napomenuti „demo, nije produkcijski“.
- **Nedostaju indeksi:** za pretraživanje (email, naziv bicikla, datum narudžbe) kasnije dodajte **indekse** kad vidite upite – nije obavezno za prvu verziju.

### Zaključak

Baza je **smislena za SPIB** i dovoljno bogata za **master–detail (npr. narudžba + stavke)** i **šifrarnik (npr. kategorije bicikla)**. Sljedeći korak u implementaciji nije „preraditi sve“, nego **zamrznuti shemu za DZ3** i oko nje graditi API, UI i testove.

---

## 2. Dogovor (pojednostavljeno)

| Što | Tko |
|-----|-----|
| Grananje, `develop`, Docker, baza | Paško (već u repou) |
| Sav backend + frontend + automatizirani testovi (DZ3) | Paško (+ Cursor) |
| Ručno / Cursor QA nakon isporuke | Kolega |
| Dijagrami | *Ne radimo u ovoj iteraciji* |

Lista API ruta i „što testirati“ piše se u **`README.md`** ili GitHub Issue/PR kad je isporuka gotova.

---

## 3. Faze – tko što radi

### Faza A – Priprema (paralelno, 1 dan)

**Osoba 1 (sva implementacija u repou)**

- Postavi repozitorij: struktura projekta (**`backend/`** slojevi + `README` u korijenu) — *gotovo u repou*.
- Pokreni `database/SPIB_schema.sql` pa `database/SPIB_seed.sql` lokalno **ili** `docker compose up -d` (isti SQL u kontejneru pri prvom volumenu) — *gotovo*.
- **`docker-compose.yml`** za Postgres + **`.env.example`** — *gotovo*; upute u korijenskom `README.md`.

**Osoba 2 (kolega — samo QA, nema implementacije u Fazi A)**

- Nakon što Osoba 1 pusha: ručno provjeri okolinu prema [`docs/qa/Faza-A.md`](../docs/qa/Faza-A.md) kad bude aktualno.
- ~~Dijagram komponenti, issue lista, skica pravila~~ — **ne radimo sada**; pravilo će biti u **kodu** (servis + test).

---

### Faza B – Backend jezgra *(implementacija: Paško — oba područja)*

**Narudžba (master–detail)**

- Model/DTO za `Narudzba` i `StavkaNarudzbe`.
- Repozitorij: dohvat jedne narudžbe sa stavkama; CRUD narudžbe; dodavanje/izmjena/brisanje stavki.
- Servisni sloj: pravilo validacije (npr. zabrana stavke ako nema zalihe).
- REST: endpointi (lista, detalj, create/update/delete).

**Šifrarnik kategorija**

- Model/DTO za `KategorijaBicikla`.
- Repozitorij + servis: lista s **pretragom** (po `naziv`), CRUD.
- REST za kategorije.
- Endpoint **liste kategorija za dropdown**.

**Tocka spajanja:** oba CRUD-a rade (Postman/curl) i rute su u `README` → push na `develop`.

---

### Faza C – Frontend *(implementacija: Paško — oba zaslona)*

**Narudžba + stavke**

- Zaslon **Narudžba + stavke**: odabir ili kreiranje narudžbe, tablica stavki, padajuće liste (`kupac`, `djelatnik`, `bicikl` na stavci).
- Povezivanje s API-jem; osnovna obrada grešaka.

**Kategorija bicikla (šifrarnik)**

- Tablica, filter/pretraga, forma za CRUD.
- Zajednički **layout/meni** (navigacija na obje stranice).

**Tocka spajanja:** jedan projekt koji se `npm run dev` / `dotnet run` pokreće i prikazuje obje stranice.

---

### Faza D – Testiranje u kodu *(implementacija: Paško)*

- **Integracijski testovi** za API narudžbe + stavke.
- **Jedinični testovi poslovnog sloja** (validacija narudžbe/stavki).
- **Jedinični testovi repozitorija** kategorija (CRUD + pretraga).
- **Jedinični / integracijski testovi prezentacijskog sloja** (kontroleri ili rute s mock servisom, ovisno o stacku).
- Barem **jedan integracijski test** koji dokazuje povezanost slojeva (npr. kategorija → API → baza).
- Testovi se moraju **moći pokrenuti više puta** (test baza, transakcije, `docker compose` reset po potrebi).

**Kolega (QA):** ručno prolazi listu „što testirati“ uz svaku isporuku.

---

### Faza E – Dokumentacija i isporuka

**Paško**

- README: baza, backend, frontend, testovi, env varijable.
- PDF/docx za predmet: screenshotovi **stvarnih** ekrana (master–detail, šifrarnik), opis validacije i testova.
- ~~Dijagram komponenti~~ — *ne radimo u ovoj iteraciji*; ako asistent ipak traži, dodati minimalnu skicu kad je kod stabilan.

**Kolega**

- QA izvještaj (što je provjereno, eventualni bugovi) — po dogovoru u Issueu, mailu ili PDF dodatku.

**Oba** (u smislu: Osoba 1 isporuči artefakte, Osoba 2 potvrdi QA kad treba)

- Pregled rubrike DZ3 (checkbox); ZIP/GitHub prema predmetu.

---

## 4. Brza referenca

| Područje | Tko |
|----------|-----|
| Sav kod (BE, FE, testovi u repou), baza, Docker, README | Paško (+ Cursor) |
| Ručno / Cursor QA nakon pusha | Kolega |
| Dijagrami | *Ne u ovoj iteraciji* |

---

## 5. Ako netko zapne – minimalni „fallback“ opseg

Ako vrijeme fali: **mora** raditi master–detail za narudžbu + šifrarnik za kategoriju + jedan složeniji validator + testovi po slojevima i barem jedan integracijski. Ostalo (najam, plaćanje) može čekati ako nije u obvezi DZ3 za vašu isporuku – provjerite s asistentom ako je sumnja.
