# Što je dodano u repozitorij (sažetak za QA)

> Ažuriraj nakon većih isporuka. Zadnji poznati commit na `develop` provjeri s: `git log -1 --oneline`.

## Faza A

- `database/SPIB_schema.sql`, `SPIB_seed.sql`, `database/README.md`
- `docker-compose.yml`, korijenski `.env.example`
- `backend/` — početna mapa slojeva (kasnije pun API)
- `.githooks/commit-msg` + upute u `README.md` (`core.hooksPath`)
- `mateirjali/` — plan, zadaci, komentari, slike, IS05 bilješke (vidljivo na Gitu)

## Faza B (backend + frontend)

- **`backend/`** — Node + TypeScript + Fastify + `pg`
  - Kategorije: CRUD + pretraga + `GET .../za-odabir`
  - Narudžbe: lista + detalj (JOIN imena), POST/PATCH narudžbe, POST/PATCH/DELETE stavki
  - Validacija: zbroj količina stavki po biciklu u narudžbi ne smije prijeći `bicikl.kolicina`; cijena stavke iz kataloga
- **`frontend/`** — Vite + React + TS, početna stranica koja zove `/api/health` i `/api/kategorije`
- **`docs/qa/`** — upute za testiranje (ovaj folder)

## Dokumentacija

- `docs/DZ3_FazaB_backend_obrazlozenje.md` — plan Faze B
- `backend/README.md` — tablica API ruta i naredbe
