# SPIB – baza podataka (PostgreSQL)

## Datoteke

| Datoteka | Svrha |
|----------|--------|
| `SPIB_schema.sql` | Kreiranje tablica, FK, indeksa i komentara. |
| `SPIB_seed.sql` | Ogledni podaci za razvoj i DZ3 (nakon sheme). |
| `SPIB_migrate_from_pre_spec.sql` | Jednokratno na **staroj** bazi: stupci + uklanjanje `url_slike`; za bicikle DOSTUPAN s zalihom bez cijene najma postavlja procjenu od prodajne cijene (5 %). |

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

Ako ne želite brisati volumen, a backend javlja greške tipa „column … does not exist“, pokrenite migraciju:

```powershell
psql -U spib -d spib -h localhost -f database\SPIB_migrate_from_pre_spec.sql
```

(lozinka u `POSTGRES_PASSWORD` iz `.env` ili zadana u `docker-compose.yml`).

## Što je promijenjeno u odnosu na `bazaDZ2.sql`

- **`Narudzba.status`** – `CHECK` na pet kanonskih kodova (`NOVA`, `POTVRDJENA`, `U_OBRADI`, `ZAVRSENA`, `OTKAZANA`); usklađeno s backend validacijom. Ako već imate bazu kreiranu starom shemom bez ovog ograničenja, trebate je **ponovno inicijalizirati** (npr. `docker compose down -v`) ili ručno `ALTER TABLE … ADD CONSTRAINT …` nakon što su svi retci u skupu dopuštenih vrijednosti.
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
