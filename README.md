# SPIB – Sustav za prodaju i iznajmljivanje bicikala

Studentski projekt (FER, informacijski sustavi).

## Tijek rada: implementacija i testiranje

- **Implementacija (ti):** radiš posao i za „Osobu 1“ i za „Osobu 2“ (backend, UI, baza po potrebi), commitaš na **`develop`** (ili kratkotrajna `feature/*` grana pa merge u `develop`).
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
