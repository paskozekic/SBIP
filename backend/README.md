# SPIB – backend (Faza B)

**Stack:** Node.js **20+**, **TypeScript**, **Fastify 5**, **pg** (PostgreSQL).

Slojevi u `src/`:

| Mapa | Sadržaj |
|------|---------|
| `presentation/` | Fastify rute (`routes.ts`, `*Routes.ts`) |
| `application/` | Servisi (`*Service.ts`) — poslovna pravila |
| `infrastructure/` | `pool.ts`, repozitoriji (SQL) |
| `domain/` | Tipovi, uključujući **DTO** za JSON (`narudzbaDto.ts`, …) |

## Priprema

```powershell
cd backend
copy .env.example .env
# prilagodi DATABASE_URL ako treba
npm install
```

Baza mora biti podignuta (`docker compose` iz korijena repozitorija ili lokalni PostgreSQL + `database/SPIB_*.sql`).

## Pokretanje

```powershell
npm run dev
```

API sluša na **http://localhost:3000** (ili `PORT` iz `.env`).

## Rute (inicialni skup)

| Metoda | Put | Opis |
|--------|-----|------|
| GET | `/api/health` | Provjera da API radi |
| GET | `/api/narudzbe` | Lista narudžbi (JOIN: **ime i prezime kupca**) |
| GET | `/api/narudzbe/:id` | **Master–detail:** zaglavlje + `stavke[]` + imena kupca i djelatnika |
| POST | `/api/narudzbe` | Nova narudžba — `{ "status", "kupac_korisnik_id", "djelatnik_korisnik_id?" }` |
| PATCH | `/api/narudzbe/:id` | Ažuriranje zaglavlja — `{ "status?", "djelatnik_korisnik_id?" }` |
| POST | `/api/narudzbe/:id/stavke` | Nova stavka — `{ "bicikl_id", "kolicina" }`; **cijena** iz kataloga; validacija **zalihe** |
| PATCH | `/api/narudzbe/:id/stavke/:stavkaId` | Izmjena stavke; cijena ponovno iz kataloga |
| DELETE | `/api/narudzbe/:id/stavke/:stavkaId` | Brisanje stavke; odgovor = cijeli detalj narudžbe |

## Ostalo

- **Build:** `npm run build` → `dist/`, pokretanje `npm start`
- **Typecheck:** `npm run typecheck`

Sljedeći koraci za DZ3: **Vitest** u `tests/`, UI master–detail na frontendu.
