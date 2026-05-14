# Što je dodano u repozitorij (sažetak za QA)

> Ažuriraj nakon većih isporuka. Zadnji poznati commit na `develop` provjeri s: `git log -1 --oneline`.

## Faza A

- `database/SPIB_schema.sql`, `SPIB_seed.sql`, `database/README.md`
- `docker-compose.yml`, korijenski `.env.example`
- `backend/` — početna mapa slojeva (kasnije pun API)
- `.githooks/commit-msg` + upute u `README.md` (`core.hooksPath`)
- `mateirjali/` — plan, zadaci, komentari, slike, IS05 bilješke (vidljivo na Gitu)

## Faza B (backend API)

- **`backend/`** — Node + TypeScript + Fastify + `pg`
  - Kategorije: CRUD + pretraga + `GET .../za-odabir`
  - Narudžbe: lista + detalj (JOIN imena), POST/PATCH narudžbe, POST/PATCH/DELETE stavki
  - Validacija: zbroj količina stavki po biciklu u narudžbi ne smije prijeći `bicikl.kolicina`; cijena stavke iz kataloga
  - **Faza C podrška:** `GET /api/kupci`, `/api/djelatnici`, `/api/bicikli` (read-only za padajuće liste u UI-ju)

## Faza C (frontend)

- **`frontend/`** — Vite + React + TS + **react-router-dom**
  - Layout + navigacija: `/`, `/narudzbe`, `/kategorije`
  - Narudžbe: master–detail, CRUD stavki, nova narudžba
  - Kategorije: pretraga, tablica, CRUD

## Dokumentacija

- `docs/DZ3_FazaB_backend_obrazlozenje.md` — plan Faze B
- `docs/qa/Faza-C-uvod.md` — Faza C (pokretanje, rute)
- `backend/README.md` — tablica API ruta i naredbe
- **`docs/qa/`** — upute za testiranje (ovaj folder)
