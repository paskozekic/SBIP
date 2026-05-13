# SPIB – backend

Slojevita arhitektura za DZ3 (prezentacija → aplikacija → domena → infrastruktura). **Jezik i framework** (npr. ASP.NET Core, Node/Nest, Python/FastAPI) odaberite u timu; ova mapa daje **fiksnu podjelu odgovornosti** koju mapirate na projekte ili pakete u odabranom stacku.

## Struktura mapa

| Mapa | Uloga |
|------|--------|
| `src/presentation` | HTTP API (rute, kontroleri), DTO zahtjev/odgovor, validacija na rubu. Ne sadrži SQL. |
| `src/application` | Servisi, poslovna pravila, orkestracija. Ovisi o sučeljima repozitorija (definirana u aplikaciji ili domeni). |
| `src/domain` | Entiteti, vrijednosni objekti, pravila koja ne ovise o bazi ni o HTTP-u. |
| `src/infrastructure` | Implementacija pristupa podacima (ADO, EF, Dapper, pg klijent …), mapiranje tablica → modele. |
| `tests/unit` | Jedinični testovi (servisi s mock repozitorijem, domena …). |
| `tests/integration` | Testovi protiv baze ili cijelog API-ja (slojevi povezani). |

## Veza s bazom

- Lokalno: [`../database/README.md`](../database/README.md) ili Docker: [`../README.md`](../README.md) (PostgreSQL u `docker-compose`).
- Connection string (kad dodate API), primjer: `Host=localhost;Port=5432;Database=spib;Username=spib;Password=<iz .env>`.

## Sljedeći korak u implementaciji

1. Inicijalizirajte rješenje u ovoj mapi (npr. `dotnet new`, `npm init` u podmapi `src/SPIB.Api` — kako god vam odgovara).
2. Mapirajte **presentation** na projekt koji pokreće web poslužitelj.
3. Držite **SQL** i klijent biblioteku u **infrastructure**.

Kad dodate prvi stvarni projekt, ažurirajte ovaj README s točnim naredbama (`dotnet run`, `npm run start`, …).
