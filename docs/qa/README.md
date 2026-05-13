# QA upute — SPIB (za testera / kolegu)

Ovaj folder sadrži **korak-po-korak** što provjeriti nakon `git pull` na grani **`develop`**.  
**Dogovor u timu:** **Osoba 2** (kolega) radi **samo ovo ručno testiranje**; sav kod, baza i dokumentacija u repou — **Osoba 1**.

Glavna tehnička dokumentacija zadatka: [`../DZ3_FazaB_backend_obrazlozenje.md`](../DZ3_FazaB_backend_obrazlozenje.md).

## Brzi start

1. `git checkout develop && git pull origin develop`
2. Jednom: `git config core.hooksPath .githooks` (vidi korijenski [`README.md`](../../README.md))
3. Baza: [`Faza-A.md`](Faza-A.md)
4. Backend + (opcionalno) frontend: [`Faza-B-uvod.md`](Faza-B-uvod.md)

## Datoteke (mapiranje na plan)

| Datoteka | Što pokriva |
|----------|-------------|
| [Faza-A.md](Faza-A.md) | Docker / Postgres, smoke test baze |
| [STO-DODANO.md](STO-DODANO.md) | Kratak popis što je u repou (za brzi pregled) |
| [Faza-B-uvod.md](Faza-B-uvod.md) | Pokretanje API-ja i frontenda |
| [B-sekcija-2.1-narudzba-dto-api.md](B-sekcija-2.1-narudzba-dto-api.md) | DZ3 Faza B §2.1 — DTO / JSON odgovori narudžbe |
| [B-sekcija-2.2-repozitorij.md](B-sekcija-2.2-repozitorij.md) | §2.2 — podaci i JOIN (indirektno kroz API) |
| [B-sekcija-2.3-servis-validacija.md](B-sekcija-2.3-servis-validacija.md) | §2.3 — zaliha, cijena iz kataloga |
| [B-sekcija-2.4-rest-narudzbe.md](B-sekcija-2.4-rest-narudzbe.md) | §2.4 — REST narudžbe (Postman / curl) |
| [B-sekcija-3-kategorije.md](B-sekcija-3-kategorije.md) | §3 — šifrarnik kategorija (3.1–3.4) |

## Što prijaviti ako nešto ne radi

- **Grana i commit:** npr. `develop` @ `<hash>` (`git rev-parse --short HEAD`)
- **Korak** iz koje datoteke u `docs/qa/`
- **Očekivano vs. dobiveno** (status kod, tijelo odgovora, screenshot ako je UI)
