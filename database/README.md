# SPIB – baza podataka (PostgreSQL)

## Datoteke

| Datoteka | Svrha |
|----------|--------|
| `SPIB_schema.sql` | Kreiranje tablica, FK, indeksa i komentara. |
| `SPIB_seed.sql` | Ogledni podaci za razvoj i DZ3 (nakon sheme). |

Stara jedna datoteka u korijenu repozitorija `bazaDZ2.sql` **zamijenjena** je ovim sadržajem; predmet i dalje traži skriptu kreiranja + skriptu punjenja — to su ove dvije.

## Pokretanje (lokalno)

```bash
createdb spib
psql -d spib -f database/SPIB_schema.sql
psql -d spib -f database/SPIB_seed.sql
```

Na Windowsu (ako je `psql` u PATH-u):

```powershell
createdb spib
psql -d spib -f database\SPIB_schema.sql
psql -d spib -f database\SPIB_seed.sql
```

## Docker (iz korijena repozitorija)

Ako koristite `docker-compose.yml` u korijenu:

```powershell
docker compose up -d
```

Pri prvom pokretanju praznog volumena Postgres sam pokreće `SPIB_schema.sql` pa `SPIB_seed.sql`. Za ponovno učitavanje nakon izmjene skripti: `docker compose down -v` pa opet `docker compose up -d`.

## Što je promijenjeno u odnosu na `bazaDZ2.sql`

- **`KategorijaBicikla.naziv`** – `UNIQUE` (šifrarnik bez duplikata naziva).
- **FK ponašanje** – npr. `ON DELETE RESTRICT` na biciklu/kupcu gdje brisanje ne smije ostaviti „siročad“; opcijski `djelatnik` na narudžbi/najmu: `ON DELETE SET NULL`.
- **Indeksi** na čestim upitima (narudžba po datumu/kupcu, stavke po narudžbi, bicikl po nazivu/kategoriji).
- **`COMMENT`** na ključnim tablicama/stupcu cijene stavke.

## Ponovno učitavanje sheme

Skripta **ne briše** postojeće tablice. Za čisti početak:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Zatim ponovo pokrenite `SPIB_schema.sql` i `SPIB_seed.sql`.
