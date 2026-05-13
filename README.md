# SPIB – Sustav za prodaju i iznajmljivanje bicikala

Studentski projekt (FER, informacijski sustavi).

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
