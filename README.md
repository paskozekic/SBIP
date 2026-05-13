# SPIB – Sustav za prodaju i iznajmljivanje bicikala

Studentski projekt (FER, informacijski sustavi).

## DZ3 – pragmatičan dogovor

- **Dijagrami** (UML komponenti itd.): *trenutačno ne radimo* — fokus je **radi kod** (backend, frontend, testovi u repou).
- **Implementacija svih tehničkih faza** (B: API, C: UI, D: testovi, E: README + prilozi kad treba): **ti** uz Cursor u ovom repou (logički i dalje „Osoba 1 + Osoba 2“ posao, ali jedan implementator).
- **Kolega:** **QA** nakon svakog pusha (ručno + Cursor), s jasnom listom „što testirati“.
- Za predmet: screenshotovi **stvarnih** ekrana i opis u PDF/docx kad funkcionalnost postoji; ako asistent zatraži dijagram, dodati **minimalno** kad je kod gotov.

## Tijek rada: implementacija i testiranje

- **Implementacija (ti):** cijeli tehnički opseg DZ3 (backend, UI, baza po potrebi), commit na **`develop`** (ili kratka `feature/*` pa merge).
- **Testiranje (kolega):** nakon što pushaš, javi **hash commita** ili **PR na `develop`**. On lokalno: `git pull`, `git config core.hooksPath .githooks` (jednom), `docker compose up -d`, zatim ručno ili Cursorom provjerava što si naveo u commit poruci / kratkom popisu u chatu ili issueu.

**Praktično:** u poruci commita ili u GitHub **Issue / komentar na PR** napiši 3–6 točaka „što testirati“ (npr. „GET /api/kategorije“, „kreiraj narudžbu s dvije stavke“). Tako Cursor i kolega znaju točno opseg QA-a za tu isporuku.

## Git hookovi (bez `Co-authored-by: Cursor` u commit porukama)

Cursor ponekad doda trailer u commit. U repou je hook `.githooks/commit-msg` koji ga uklanja. **Jednom** nakon klona:

```powershell
git config core.hooksPath .githooks
```

## Baza podataka (PostgreSQL)

Skripte su u mapi **`database/`**:

- `SPIB_schema.sql` – kreiranje sheme  
- `SPIB_seed.sql` – ogledni podaci  

Upute: [`database/README.md`](database/README.md).

### Docker (preporučeno za Fazu A)

Iz korijena repozitorija:

```powershell
docker compose up -d
```

Kontejner `spib-postgres` podiže PostgreSQL 16; pri **prvom** stvaranju praznog volumena automatski se pokreću `01_schema.sql` i `02_seed.sql`.

- Zaustavi: `docker compose down`  
- Reset podataka i ponovno učitaj SQL: `docker compose down -v` pa opet `docker compose up -d`  
- Lozinka zadano: `spib_dev_promijeni_me` (korisnik/baza: `spib`). Svoju postavi u `.env` — vidi [`.env.example`](.env.example).

## Backend (DZ3)

Slojevita struktura i opis mapa: [`backend/README.md`](backend/README.md).

## Dokumentacija

- [`docs/DZ3_FazaB_backend_obrazlozenje.md`](docs/DZ3_FazaB_backend_obrazlozenje.md) – Faza B, backend (narudžba + kategorije)
