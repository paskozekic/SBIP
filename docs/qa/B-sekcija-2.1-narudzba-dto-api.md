# Faza B — §2.1 Model / DTO (narudžba + stavke)

**Cilj:** provjeriti da JSON odgovori sadrže polja iz DTO-a (uključujući imena kupca i, na detalju, djelatnika) te strukturu **master–detail** (`stavke`).

## Preduvjet

- Backend radi (`Faza-B-uvod.md`).
- U bazi postoje seed narudžbe (npr. id **1** i **2** — ako ne znaš id, prvo `GET /api/narudzbe`).

## 1. Lista narudžbi — DTO polja

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/narudzbe
```

**Provjeri za svaki element:**

- [ ] `narudzba_id`, `datum`, `status`, `kupac_korisnik_id`, `djelatnik_korisnik_id`
- [ ] **`kupac_ime`**, **`kupac_prezime`** (nisu u tablici `Narudzba` — dolaze JOIN-om)

## 2. Detalj jedne narudžbe — master–detail

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/narudzbe/1
```

**Provjeri:**

- [ ] Ista polja zaglavlja kao na listi + **`djelatnik_ime`**, **`djelatnik_prezime`** (mogu biti `null`)
- [ ] Polje **`stavke`**: niz objekata
- [ ] Svaka stavka: `stavka_id`, `kolicina`, `cijena` (string), `bicikl_id`, `narudzba_id`, **`bicikl_naziv`**

## 3. Nova narudžba (ulazni DTO)

Zamijeni `KUPAC_ID` stvarnim `kupac_korisnik_id` iz seeda (npr. iz `GET /api/narudzbe` ili baze).

```powershell
$body = @{ status = "NOVA"; kupac_korisnik_id = 1; djelatnik_korisnik_id = $null } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/narudzbe -Method POST -Body $body -ContentType "application/json"
```

**Provjeri:**

- [ ] Status **201**
- [ ] Odgovor je **isti oblik** kao `GET /api/narudzbe/:id` (detalj s `stavke` — može biti prazan niz)

## Kriterij „§2.1 OK“

- [ ] Lista i detalj imaju **kupac_ime / kupac_prezime**  
- [ ] Detalj ima **`stavke`** i podatke o biciklu na stavci  
- [ ] **POST** prima polja iz dokumentacije (`status`, `kupac_korisnik_id`, opcionalno `djelatnik_korisnik_id`)
