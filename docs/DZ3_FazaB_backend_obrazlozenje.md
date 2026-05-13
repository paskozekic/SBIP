# DZ3 – Faza B: što točno raditi na backendu (narudžba + kategorije)

Ovaj dokument detaljno objašnjava dio plana iz **Faze B** vezan uz **narudžbu (master–detail)** i **šifrarnik kategorija**. Pretpostavlja se PostgreSQL shema iz `database/SPIB_schema.sql` (i po želji `database/SPIB_seed.sql`) te REST API iznad baze.

> **Napomena:** dijagrami su u timskom dogovoru **izvan trenutnog fokusa**; arhitektura se dokazuje **strukturom mapa u `backend/`** i kodom.

> **Tim u ovom repou:** **Osoba 1** radi **cijelu implementaciju** (i narudžbu u §2 i kategorije u §3). **Osoba 2** radi **isključivo testiranje** nakon pusha, prema uputama u [`docs/qa/README.md`](qa/README.md). Naslovi „Osoba 1“ / „Osoba 2“ u nastavku odgovaraju **logičkoj podjeli predmeta**, ne podjeli na dva programera.

---

## 1. Svrha Faze B

Gradite **API sloj** koji:

- čita i mijenja podatke u bazi kroz **repozitorij**;
- primjenjuje **poslovna pravila** u **servisu**;
- izlaže **REST endpointe** koje kasnije koristi frontend (Postman služi za provjeru prije UI-ja).

U predmetnoj literaturi često: **Osoba 1** — `Narudzba` + `StavkaNarudzbe`; **Osoba 2** — `KategorijaBicikla`. **Kod nas** obje stavke implementira **Osoba 1**; **Osoba 2** samo **QA** (vidi napomenu iznad).

---

## 2. Osoba 1 – Narudžba (master–detail)

### 2.1. Model / DTO za `Narudzba` i `StavkaNarudzbe`

| Pojam | Značenje |
|--------|----------|
| **Model** | Struktura u kodu koja odgovara tablicama (ili je vrlo blizu): polja poput `narudzba_id`, `datum`, `status`, `kupac_korisnik_id`, `djelatnik_korisnik_id` te za stavku `stavka_id`, `kolicina`, `cijena`, `bicikl_id`, `narudzba_id`. |
| **DTO** (*Data Transfer Object*) | Oblik podataka u **JSON-u** koji ulazi u API ili izlazi iz API-ja. Često se razlikuje od „golih“ tablica: npr. za prikaz narudžbe vraćate i **ime i prezime kupca** (dohvaćeno JOIN-om), iako u tablici `Narudzba` stoji samo `kupac_korisnik_id`. |

**Što isporučiti:** klase ili zapise za:

- **Ulaz:** kreiranje / ažuriranje narudžbe; dodavanje / ažuriranje stavke (što frontend šalje).
- **Izlaz:** jedan objekt „narudžba s poljem `stavke: [...]`“ pogodan za master–detail zaslon.

**Implementacija u repou:** tipovi za JSON su u `backend/src/domain/narudzbaDto.ts` (`NarudzbaCreateDto`, `NarudzbaDetaljDto`, `StavkaCreateDto`, …); redci iz baze s JOIN-om u `narudzba.ts` (`NarudzbaListRow`, `NarudzbaDetaljRow`, `StavkaNarudzbeRow`); mapiranje DTO ↔ baza u `narudzbaService.ts`.

---

### 2.2. Repozitorij

Repozitorij je sloj koji **komunicira s bazom** (SQL ili ORM). Ne treba sadržavati složena poslovna pravila (to je servis), nego pouzdane operacije.

| Zadatak | Objašnjenje |
|---------|----------------|
| Dohvat **jedne** narudžbe **sa svim stavkama** | Za zadani `narudzba_id` učitati zaglavlje iz `Narudzba` i sve retke iz `StavkaNarudzbe` koji pripadaju toj narudžbi. |
| **CRUD** nad `Narudzba` | Create / Read (lista ili pojedinačna) / Update / Delete prema odluci tima (brisanje cijele narudžbe često se zamijeni promjenom statusa). |
| **Stavke:** dodaj / izmijeni / obriši | `INSERT` / `UPDATE` / `DELETE` nad `StavkaNarudzbe` uz ispravan `narudzba_id` i FK `bicikl_id`. |

**Kriterij gotovosti:** iz koda možete programski dohvatiti npr. narudžbu `5` sa svim stavkama i izvesti sve dogovorene CRUD operacije nad zaglavljem i stavkama.

---

### 2.3. Servisni sloj i validacija

Servis stoji **između** REST kontrolera i repozitorija. Ovdje implementirate **poslovna pravila** (zadaća traži i „složeniju“ validaciju od same provjere je li polje popunjeno).

Primjeri usklađeni s vašom domenom:

- količina na stavci **ne smije** biti veća od trenutne **zalihe** (`Bicikl.kolicina`) za odabrani bicikl;
- narudžba mora imati **barem jednu stavku** prije nego što je smijete označiti određenim statusom (ako tako definirate životni ciklus);
- **cijena na stavci** mora u trenutku dodavanja odgovarati kataloškoj cijeni bicikla (ako tako dogovorite s timom).

Ako pravilo nije zadovoljeno, servis **ne zove** upis u repozitorij, nego signalizira grešku (npr. HTTP 400 s jasnom porukom na hrvatskom ili engleskom, dosljedno cijelom API-ju).

---

### 2.4. REST endpointi (primjer imenovanja)

Imena su ilustrativna — prilagodite konvenciji projekta.

| Metoda | Ruta (primjer) | Svrha |
|--------|----------------|--------|
| `GET` | `/api/narudzbe` | Lista narudžbi (paginacija po želji). |
| `GET` | `/api/narudzbe/{id}` | Detalj: zaglavlje + **lista stavki** (master–detail u jednom odgovoru ili dogovoreno na dva poziva). |
| `POST` | `/api/narudzbe` | Nova narudžba. |
| `PUT` / `PATCH` | `/api/narudzbe/{id}` | Ažuriranje zaglavlja. |
| `POST` | `/api/narudzbe/{id}/stavke` | Nova stavka. |
| `PUT` / `PATCH` | `/api/narudzbe/{id}/stavke/{stavkaId}` | Izmjena stavke. |
| `DELETE` | `/api/narudzbe/{id}/stavke/{stavkaId}` | Brisanje stavke. |

**Kriterij gotovosti:** u `README` ili Postman kolekciji imate popis ruta; ručno možete proći scenarij: kreiraj narudžbu → dodaj stavke → izmijeni → dohvati detalj.

---

## 3. Osoba 2 – Šifrarnik kategorija (`KategorijaBicikla`)

Šifrarnik ovdje znači: **referentni podaci** koje djelatnik održava (pregled, pretraga, CRUD), a ostatak sustava koristi preko **id**-a i padajućih lista.

### 3.1. Model / DTO

Tablica tipično sadrži: `kategorija_id`, `naziv`, `opis`. U kodu: model + DTO za unos (npr. samo `naziv`, `opis`) i za odgovor (uključujući `kategorija_id`).

---

### 3.2. Repozitorij + servis

| Zadatak | Objašnjenje |
|---------|-------------|
| **Lista** | Dohvat svih kategorija ili podskupa. |
| **Pretraga po `nazivu`** | Filtar kada korisnik upiše dio naziva (npr. u PostgreSQLu `ILIKE '%tekst%'`). |
| **CRUD** | Dodavanje, čitanje pojedinačne, ažuriranje, brisanje. |

**Poslovno pravilo u servisu (važno):** ako postoje bicikli s `kategorija_id` koji pokazuje na kategoriju, **brisanje** kategorije može biti zabranjeno (poruka korisniku) umjesto da baza baci nepreglednu grešku zbog FK — to odlučite i implementirate u servisu.

---

### 3.3. REST za kategorije

| Metoda | Ruta (primjer) | Svrha |
|--------|----------------|--------|
| `GET` | `/api/kategorije?q=grad` | Lista s opcijskim upitom za pretragu. |
| `GET` | `/api/kategorije/{id}` | Jedna kategorija. |
| `POST` | `/api/kategorije` | Nova kategorija. |
| `PUT` / `PATCH` | `/api/kategorije/{id}` | Ažuriranje. |
| `DELETE` | `/api/kategorije/{id}` | Brisanje (uz pravilo iz servisa ako postoje ovisni bicikli). |

---

### 3.4. Endpoint za padajući izbor (dropdown)

Frontendu za forme (npr. bicikl, kasnije) treba **kratak popis**: npr. `{ "kategorijaId": 1, "naziv": "Gradski" }`.

- Može biti **ista** `GET /api/kategorije` s jednostavnim poljima u JSON-u.
- Ili zasebna ruta, npr. `GET /api/kategorije/za-odabir`, koja vraća samo id + naziv radi jasnoće i manjeg prometa.

**Veza s Osobom 1:** čak i ako u prvoj iteraciji ne radite formu bicikla, endpoint treba biti **dostupan i dokumentiran** da ga Osoba 1 (ili UI kasnije) može odmah koristiti za `kategorija_id`.

---

## 4. Zajednička točka spajanja (iz plana)

Cjeloviti opis kriterija i koraka za merge, README i ručnu provjeru nalazi se u zasebnoj datoteci (ne duplicirati ovdje):

**[`qa/B-sekcija-4-zajednicka-tocka-spajanja.md`](qa/B-sekcija-4-zajednicka-tocka-spajanja.md)**

---

## 5. Kratka kontrolna lista

Tablica checkliste s mapiranjem na datoteke u repou:

**[`qa/B-sekcija-5-kontrolna-lista.md`](qa/B-sekcija-5-kontrolna-lista.md)**

---

*Dokument nadovezuje se na `mateirjali/DZ3_plan_rada_osoba1_osoba2.md` (Faza B).*
