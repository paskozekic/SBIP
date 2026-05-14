# DZ3 – plan rada u paru (Osoba 1 / Osoba 2)

**Ažurirani dogovor:** **Dijagrami** (komponenti, detaljni UML) **zanemarujemo** dok gradimo sustav — prednost ima **radi kod**. **Implementaciju** (Faza B backend, Faza C frontend, Faza D testovi u kodu, README/API) u praksi radi **Paško** uz Cursor u ovom repou (**sve što su u zadaći bile Osoba 1 i Osoba 2 u smislu koda**). **Kolega** radi **samo testiranje** (QA) nakon pusha, prema uputama u **`docs/qa/`**. Formalni prilozi predmeta (PDF, screenshotovi **stvarnih** ekrana) rade se kad UI bude dovoljno bogat za predaju.

Ovaj dokument sadrži **komentar na bazu**, **tko što radi u timu** i **što je u repou već napravljeno** naspram planiranih faza DZ3.

---

## 0. Stanje implementacije (što je stvarno u repou)

| Faza | Stanje | Napomena |
|------|--------|----------|
| **A** – priprema | **Gotovo** | `database/` (schema + seed), `docker-compose.yml`, korijenski `README`, `.env.example`, skeleton `backend/` prije API-ja. |
| **B** – backend jezgra | **Gotovo i zatvoreno** | DTO/repo/servis/REST za §2 narudžba + §3 kategorije; `PUT` i **`PATCH`** na kategoriju; **`backend/README.md`** — tablica ruta + **primjeri JSON** + napomena **400** / **409**. Kontrolna lista u `docs/DZ3_FazaB_backend_obrazlozenje.md` §5 označena kao ispunjena. |
| **C** – frontend | **Gotovo (MVP)** | Vite + React + TS + **react-router-dom**: zajednički **layout/meni**, stranica **Narudžbe** (master–detail, CRUD stavki, padajuće liste preko `/api/kupci`, `/api/djelatnici`, `/api/bicikli`), stranica **Kategorije** (pretraga, tablica, CRUD). Početna: health. |
| **D** – testovi u kodu | **Nije započeto** | Mape `backend/tests/**` postoje s `.gitkeep`; **Vitest** i stvarni testovi planirani u `backend/README.md` („Sljedeći koraci“). |
| **E** – dokumentacija / isporuka | **Djelomično** | README + `docs/DZ3_FazaB_backend_obrazlozenje.md` + `docs/qa/` (Faza A/B, §2.1–2.4, §3). **Nema** još PDF-a predmeta niti screenshotova kompletnog UI-ja. |

**QA za kolegu:** [`docs/qa/README.md`](../docs/qa/README.md) (nakon `git pull` na **`develop`**).

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

Baza je **smislena za SPIB** i dovoljno bogata za **master–detail (npr. narudžba + stavke)** i **šifrarnik (npr. kategorije bicikla)**. Shema je **zamrznuta za DZ3**; oko nje su već **API** (Faza B) i **početni frontend** (Faza C u tijeku).

---

## 2. Dogovor (pojednostavljeno)

| Što | Tko |
|-----|-----|
| Grananje, `develop`, Docker, baza, backend, frontend u kodu | Paško (+ Cursor) |
| Ručno QA nakon pusha | Kolega (`docs/qa/`) |
| Dijagrami | *Ne radimo u ovoj iteraciji* |

Popis API ruta: **`backend/README.md`**. Što ručno provjeriti: **`docs/qa/`** i kratki opis u commit poruci / Issueu.

---

## 3. Faze – tko što radi i što je od toga već napravljeno

### Faza A – Priprema

**Osoba 1 (implementacija)** — *gotovo u repou*

- Struktura projekta (`backend/` slojevi, korijenski `README`).
- `database/SPIB_schema.sql`, `SPIB_seed.sql`, lokalno ili `docker compose up -d`.
- `docker-compose.yml`, `.env.example`, upute u korijenskom `README.md`.

**Osoba 2 (samo QA)**

- Ručno: [`docs/qa/Faza-A.md`](../docs/qa/Faza-A.md).

---

### Faza B – Backend jezgra *(Paško — oba područja u kodu)*

**Narudžba (master–detail)** — *gotovo (REST + servis + repozitorij)*

- Model/DTO, repozitorij (detalj sa stavkama, JOIN imena), servis (zaliha, cijena iz kataloga), REST (lista, detalj, POST/PATCH zaglavlja, CRUD stavki). Brisanje cijele narudžbe u API-ju namjerno nije (dovoljan je status po dogovoru u planu).

**Šifrarnik kategorija** — *gotovo*

- Model/DTO, repozitorij + servis (lista, `ILIKE` pretraga, CRUD, blokada brisanja ako postoje bicikli), REST uključujući **`GET /api/kategorije/za-odabir`**, **`PUT` i `PATCH`** na `/api/kategorije/:id`.

**Točka spajanja (plan):** oba CRUD-a kroz API + README (uključujući primjere JSON) — **ispunjeno**; push na `develop`.

> **Zatvaranje Faze B (backend):** implementacija i dokumentacija su usklađene s DZ3 §4–§5; ručni QA ostaje u `docs/qa/`.

---

### Faza C – Frontend *(Paško — isporučeno u repou)*

**Narudžba + stavke**

- Master–detail: lista narudžbi, odabir, zaglavlje (status, djelatnik), **PATCH**; tablica stavki s **dodaj / uredi / obriši**; **POST** nova narudžba (kupac, djelatnik, status).
- Padajuće liste: podaci s **`GET /api/kupci`**, **`/api/djelatnici`**, **`/api/bicikli`** (read-only rute dodane za Fazu C).
- Osnovna obrada grešaka (`ApiError`, poruka korisniku).

**Kategorija bicikla (šifrarnik)**

- Pretraga (`q` uživo), tablica, forma za **POST/PUT**, **DELETE** s potvrdom; poruke o uspjehu/grešci.

**Zajednički UI**

- **`react-router-dom`**: rute `/`, `/narudzbe`, `/kategorije`; zajednički layout s navigacijom.

**Točka spajanja (plan):** `npm run dev` u `frontend/` + backend — **obje** stranice dostupne. Vidi [`docs/qa/Faza-C-uvod.md`](../docs/qa/Faza-C-uvod.md).

---

### Faza D – Testiranje u kodu *(planirano — Paško)*

- Integracijski testovi API-ja narudžbe + stavki.
- Jedinični testovi servisa (validacija).
- Testovi repozitorija kategorija + po želji prezentacijskog sloja.
- Barem jedan integracijski test kroz slojeve (npr. kategorija → API → baza).
- Ponovljivost (test baza / reset Docker volumena po potrebi).

**Kolega:** i dalje ručni QA prema `docs/qa/` (to **nije** zamjena za Vitest).

---

### Faza E – Dokumentacija i isporuka

**Paško**

- README (baza, backend, frontend, env) — *uglavnom gotovo*; dopuniti kad budu testovi u Fazi D.
- PDF/docx predmeta: screenshotovi **stvarnih** ekrana kad Faza C donese master–detail i šifrarnik u UI-ju.

**Kolega**

- QA izvještaj (što je provjereno, bugovi) — po dogovoru.

**Zajedno pri predaji**

- Pregled rubrike DZ3; predaja prema uputama asistenta (ZIP / GitHub).

---

## 4. Brza referenca

| Područje | Tko |
|----------|-----|
| Sav kod (BE, FE), baza, Docker, README u repou | Paško (+ Cursor) |
| Ručno QA nakon pusha | Kolega |
| Dijagrami | *Ne u ovoj iteraciji* |

---

## 5. Ako netko zapne – minimalni „fallback“ opseg

Već je isporučeno: **API** master–detail za narudžbu, **šifrarnik kategorija** na backendu, **validator** (zaliha + cijena iz kataloga), **React UI** (narudžbe + kategorije, layout). Za zatvaranje DZ3 po predmetu tipično još: **Vitest** (Faza D), **prilozi** (PDF/screenshotovi stvarnih ekrana). Ostalo (najam, plaćanje u UI-ju) može čekati ako nije u obvezi — provjera s asistentom.
