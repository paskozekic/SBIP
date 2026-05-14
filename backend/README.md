# SPIB – backend (Faza B)

**Stack:** Node.js **20+**, **TypeScript**, **Fastify 5**, **pg** (PostgreSQL).

Slojevi u `src/`:

| Mapa | Sadržaj |
|------|---------|
| `presentation/` | Fastify rute (`routes.ts`, `*Routes.ts`) |
| `application/` | Servisi (`*Service.ts`) — poslovna pravila |
| `infrastructure/` | `pool.ts`, repozitoriji (SQL) |
| `domain/` | Tipovi, uključujući **DTO** za JSON (`narudzbaDto.ts`, `kategorija.ts`, …) |

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
| GET | `/api/kupci` | Lista kupaca (ime, prezime) — za UI padajući izbor |
| GET | `/api/djelatnici` | Lista djelatnika — za UI |
| GET | `/api/bicikli` | Lista bicikala (id, naziv, zaliha, cijena) — za UI stavke |
| GET | `/api/kategorije?q=` | Lista kategorija, opcijski filter po nazivu |
| GET | `/api/kategorije/za-odabir` | Kratki popis za dropdown |
| GET | `/api/kategorije/:id` | Jedna kategorija |
| POST | `/api/kategorije` | JSON `{ "naziv", "opis?" }` |
| PUT | `/api/kategorije/:id` | Ažuriranje (isto tijelo kao **PATCH**) |
| PATCH | `/api/kategorije/:id` | Ažuriranje (isto kao PUT) |
| DELETE | `/api/kategorije/:id` | Brisanje (409 ako postoje bicikli) |
| GET | `/api/narudzbe/statusi` | Dopušteni statusi narudžbe: `{ "kod", "naziv" }[]` (isti skup kao u bazi i validacija) |
| GET | `/api/narudzbe` | Lista narudžbi (JOIN: **ime i prezime kupca**) |
| GET | `/api/narudzbe/:id` | **Master–detail:** zaglavlje + `stavke[]` + imena kupca i djelatnika |
| POST | `/api/narudzbe` | Nova narudžba — `{ "status", "kupac_korisnik_id", "djelatnik_korisnik_id?" }` |
| PATCH | `/api/narudzbe/:id` | Ažuriranje zaglavlja — `{ "status?", "djelatnik_korisnik_id?" }` |
| POST | `/api/narudzbe/:id/stavke` | Nova stavka — `{ "bicikl_id", "kolicina" }`; **cijena** iz kataloga; validacija **zalihe** |
| PATCH | `/api/narudzbe/:id/stavke/:stavkaId` | Izmjena stavke; cijena ponovno iz kataloga |
| DELETE | `/api/narudzbe/:id/stavke/:stavkaId` | Brisanje stavke; odgovor = cijeli detalj narudžbe |

### Status narudžbe (`status`)

Dopušteni **kodovi** (string, velika slova): **`NOVA`**, **`POTVRDJENA`**, **`U_OBRADI`**, **`ZAVRSENA`**, **`OTKAZANA`**. Definicija je u `src/domain/narudzbaStatus.ts`; servis pri **POST/PATCH** odbija ostale vrijednosti (**400**). Popis s hrvatskim **nazivima** za UI: **`GET /api/narudzbe/statusi`**.

**Nova narudžba**

```json
{ "status": "NOVA", "kupac_korisnik_id": 1, "djelatnik_korisnik_id": 3 }
```

**Ažuriranje zaglavlja narudžbe** (`PATCH /api/narudzbe/1`)

```json
{ "status": "U_OBRADI", "djelatnik_korisnik_id": 3 }
```

**Nova stavka** (`POST /api/narudzbe/1/stavke`) — `cijena` se ne šalje; backend ju uzima iz kataloga.

```json
{ "bicikl_id": 2, "kolicina": 1 }
```

**Nova kategorija** (`POST /api/kategorije`)

```json
{ "naziv": "Sklopivi", "opis": "Bicikli za prijevoz." }
```

**Ažuriranje kategorije** (`PUT` ili `PATCH /api/kategorije/1`)

```json
{ "naziv": "Gradski", "opis": "Ažurirani opis." }
```

**Greške:** validacija narudžbe/stavki → **400** s `{ "error": "..." }`. Brisanje kategorije s povezanim biciklima → **409**.

## Kako testirati (PowerShell)

Iz mape `backend/` (ili bilo gdje) uz pokrenut API i bazu:

```powershell
# Smoke
irm http://localhost:3000/api/health
irm http://localhost:3000/api/narudzbe/1
irm http://localhost:3000/api/kategorije/za-odabir
irm http://localhost:3000/api/kupci
irm http://localhost:3000/api/djelatnici
irm http://localhost:3000/api/bicikli

# POST narudžba
$body = '{"status":"NOVA","kupac_korisnik_id":1,"djelatnik_korisnik_id":null}' 
irm http://localhost:3000/api/narudzbe -Method POST -Body $body -ContentType "application/json"

# PATCH kategorije (isto kao PUT)
$kb = '{"naziv":"Gradski","opis":"test opis"}'
irm http://localhost:3000/api/kategorije/1 -Method PATCH -Body $kb -ContentType "application/json"

# 400 — prevelika količina (prilagodi narudzba_id / bicikl_id prema seedu)
$sb = '{"bicikl_id":1,"kolicina":99999}'
try { irm "http://localhost:3000/api/narudzbe/1/stavke" -Method POST -Body $sb -ContentType "application/json" } catch { $_.Exception.Response.StatusCode.value__ }

# 409 — brisanje kategorije koja ima bicikle (npr. id 1)
try { Invoke-WebRequest http://localhost:3000/api/kategorije/1 -Method DELETE } catch { $_.Exception.Response.StatusCode.value__ }
```

Detaljnije scenarije (DTO, zaliha, svi REST koraci): mapi **`docs/qa/`** (datoteke `B-sekcija-*.md`, [`Faza-B-uvod.md`](../docs/qa/Faza-B-uvod.md)).

## Ostalo

- **Build:** `npm run build` → `dist/`, pokretanje `npm start`
- **Typecheck:** `npm run typecheck`

Sljedeći koraci za DZ3: **Vitest** u `tests/` (Faza D).
