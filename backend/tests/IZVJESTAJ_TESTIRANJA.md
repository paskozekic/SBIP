# Izvještaj testiranja

## Opseg

Testno rješenje pokriva backend aplikaciju kroz odvojene jedinične testove po slojevima i integracijski test koji provjerava povezivanje slojeva kroz stvarni HTTP API i bazu podataka.

Testovi se nalaze u mapi `backend/tests`:

```text
backend/tests
  unit
    presentation
    application
    infrastructure
    authService.test.ts
    requestAuth.test.ts
  integration
    currentBackendApi.integration.test.ts
```

## Pokretanje

Iz mape `backend`:

```powershell
npm.cmd run test:unit
npm.cmd run test:integration
```

Može se pokrenuti i osnovni paket jediničnih testova:

```powershell
npm.cmd test
```

Za integracijske testove potrebno je imati pokrenut backend i bazu podataka s aktualnom shemom.

## Jedinični testovi

Jedinični testovi provjeravaju pojedine slojeve izolirano, uz mockove gdje je potrebno. Ne zahtijevaju stvarnu bazu podataka.

### Prezentacijski sloj

Lokacija:

```text
backend/tests/unit/presentation
backend/tests/unit/requestAuth.test.ts
```

Pokriveno:

- zaštita ruta bez Bearer tokena
- provjera uloga korisnika
- zabrana pristupa administratoru javnom katalogu
- rute za narudžbe
- rute za kategorije
- rute za izvještaje
- HTTP statusi poput `401`, `403`, `400` i `404`
- prosljeđivanje zahtjeva iz ruta prema servisima

### Poslovni sloj

Lokacija:

```text
backend/tests/unit/application
backend/tests/unit/authService.test.ts
```

Pokriveno:

- validacija registracije i prijave
- kreiranje JWT tokena
- prijava s ispravnom i neispravnom lozinkom
- pravila za pregled i promjenu narudžbi prema ulozi korisnika
- zabrana promjene stavki narudžbe kroz servis
- potvrda narudžbe od strane djelatnika
- validacija kategorija
- zabrana brisanja kategorije ako postoje povezani bicikli
- kaskadno brisanje uz `force`

### Sloj pristupa podacima

Lokacija:

```text
backend/tests/unit/infrastructure
```

Pokriveno:

- SQL pozivi prema `pool.query`
- dohvat liste narudžbi
- dohvat detalja narudžbe sa stavkama
- ponašanje kada zapis ne postoji
- dohvat i unos kategorija
- trimanje parametara pretrage

## Integracijski testovi

Lokacija:

```text
backend/tests/integration/currentBackendApi.integration.test.ts
```

Integracijski testovi provjeravaju da slojevi rade zajedno:

```text
HTTP ruta -> prezentacijski sloj -> poslovni sloj -> repozitorij -> PostgreSQL
```

Pokriveno:

- `/api/health`
- javni dohvat kategorija
- javni dohvat kataloga bicikala
- registracija kupca
- prijava kupca
- dohvat prijavljenog korisnika preko `/api/auth/ja`
- zaštita narudžbi bez prijave
- zabrana direktnog `POST /api/narudzbe`
- kupnja preko `POST /api/kupnja`
- dohvat narudžbe nakon kupnje
- provjera stavki narudžbe
- zabrana administratoru za javni katalog
- dopušten pristup administratoru na `/api/admin/korisnici`

Integracijski test sam kreira privremenog kupca i privremene podatke potrebne za scenarij. Nakon testa čisti:

- testne narudžbe
- testne stavke narudžbi
- status korištenih jedinica bicikla
- privremenog kupca

Time se testovi mogu pokretati više puta.

## Rezultat zadnjeg pokretanja

Datum provjere: 15. svibnja 2026.

Jedinični testovi:

```text
Test Files  9 passed
Tests       39 passed
```

Integracijski testovi:

```text
Test Files  1 passed
Tests       5 passed
```

## Zaključak

Isporučeno testno rješenje zadovoljava zahtjev za:

- odvojenim jediničnim testovima prezentacijskog sloja
- odvojenim jediničnim testovima poslovnog sloja
- odvojenim jediničnim testovima sloja za pristup podacima
- integracijskim testovima koji dokazuju povezanost slojeva
- ponovljivim pokretanjem testova

