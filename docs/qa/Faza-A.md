# Faza A — priprema i baza (smoke test)

## Preduvjeti

- **Docker Desktop** radi (`docker --version`).
- **Git** klon repozitorija, grana **`develop`**, zadnji `git pull`.

## 1. Git hook (jednom po klonu)

```powershell
cd C:\put\do\SBIP
git config core.hooksPath .githooks
```

## 2. PostgreSQL u Dockeru

Iz **korijena** repozitorija:

```powershell
docker compose up -d
docker compose ps
```

**Očekivano:** servis `db`, kontejner `spib-postgres`, status **running**, port **5432**.

## 3. Provjera da su shema i seed prošli

```powershell
docker exec spib-postgres psql -U spib -d spib -c "SELECT COUNT(*) AS kategorija FROM kategorijabicikla;"
docker exec spib-postgres psql -U spib -d spib -c "SELECT COUNT(*) AS narudzba FROM narudzba;"
```

**Očekivano (seed iz repozitorija):** kategorija **5**, narudžba **2** (ako nisi mijenjao seed).

## 4. Reset baze (samo ako treba čisti init)

```powershell
docker compose down -v
docker compose up -d
```

> Lozinka u Docker Compose zadanom setupu: korisnik `spib`, lozinka `spib_dev_promijeni_me` (vidi korijenski `.env.example`).

## Kriterij „Faza A OK“

- [ ] `docker compose ps` pokazuje running kontejner  
- [ ] Brojevi u tablicama odgovaraju seedu  
- [ ] Nema kritičnih grešaka u `docker compose logs db --tail 40`
