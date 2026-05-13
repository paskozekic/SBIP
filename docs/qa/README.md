# QA upute — SPIB (§2 narudžba)

Ovaj folder sadrži **korak-po-korak** provjere za **DZ3 Fazu B, poglavlje 2** (narudžba i stavke). Nakon `git pull` na grani **`develop`**.

## Brzi start

1. `git checkout develop && git pull origin develop`
2. Jednom: `git config core.hooksPath .githooks` (vidi korijenski [`README.md`](../../README.md))
3. Baza: podigni PostgreSQL (`docker compose` iz korijena) — vidi plan u [`../DZ3_FazaB_backend_obrazlozenje.md`](../DZ3_FazaB_backend_obrazlozenje.md)
4. Backend: `cd backend && npm install && npm run dev`

## Datoteke (§2)

| Datoteka | Što pokriva |
|----------|-------------|
| [B-sekcija-2.1-narudzba-dto-api.md](B-sekcija-2.1-narudzba-dto-api.md) | §2.1 — DTO / JSON |
| [B-sekcija-2.2-repozitorij.md](B-sekcija-2.2-repozitorij.md) | §2.2 — repozitorij (indirektno kroz API) |
| [B-sekcija-2.3-servis-validacija.md](B-sekcija-2.3-servis-validacija.md) | §2.3 — zaliha, cijena iz kataloga |
| [B-sekcija-2.4-rest-narudzbe.md](B-sekcija-2.4-rest-narudzbe.md) | §2.4 — REST |

## Što prijaviti ako nešto ne radi

- Grana i commit (`git rev-parse --short HEAD`), korak iz ove mape, očekivano vs. dobiveno (status, tijelo odgovora).
