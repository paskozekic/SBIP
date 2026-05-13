# Faza B — uvod: što je u repou i kako pokrenuti

## Što je dodano (sažetak)

| Dio | Lokacija | Napomena |
|-----|-----------|----------|
| Baza | `database/SPIB_schema.sql`, `SPIB_seed.sql` | + `docker-compose.yml` |
| Backend API | `backend/` | Node + TypeScript + **Fastify** + `pg` |
| Frontend | `frontend/` | **Vite + React + TypeScript**; dev proxy `/api` → port **3000** |
| Materijali / plan | `mateirjali/` | Zadaci, plan, slike DR1/DR2 |
| QA upute | `docs/qa/` | Ovaj folder |

## Pokretanje backend API-ja

```powershell
cd backend
copy .env.example .env
# DATABASE_URL treba pokazivati na Postgres (Docker: localhost:5432, db spib, user spib)
npm install
npm run dev
```

**Očekivano u konzoli:** poruka da API sluša na `http://localhost:3000`.

## Pokretanje frontenda (opcionalno za UI smoke)

**Drugi terminal:**

```powershell
cd frontend
npm install
npm run dev
```

Otvori **http://localhost:5173** — stranica zove `/api/health` i `/api/kategorije` (proxy na backend).

## Brza provjera bez frontenda

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/health
Invoke-RestMethod -Uri http://localhost:3000/api/kategorije
```

## Kriterij „Faza B okolina OK“

- [ ] Baza radi (Faza-A)  
- [ ] `npm run dev` u `backend/` bez crasha  
- [ ] `GET /api/health` vraća JSON sa `status: ok`  
- [ ] `GET /api/kategorije` vraća niz kategorija  

Detaljne provjere po podpoglavljima: **2.1–2.4** i **§3** u susjednim datotekama u ovoj mapi.

## Zatvaranje Faze B (backend)

Kad su gornji „okolina OK“ koraci prošli i po želji dodatne provjere iz `B-sekcija-*.md`, **backend Faza B** smatra se zatvorenom — sljedeći veći korak u planu je **Faza C** (UI) i **Faza D** (Vitest).
