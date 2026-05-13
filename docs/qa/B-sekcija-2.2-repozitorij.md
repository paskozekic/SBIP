# Faza B — §2.2 Repozitorij (narudžba)

**Cilj:** repozitorij nema vlastiti HTTP — provjerava se **indirektno**: da API vraća konzistentne podatke iz baze (lista, detalj, CRUD stavki).

## 1. Dohvat jedne narudžbe sa stavkama

```powershell
$r = Invoke-RestMethod -Uri http://localhost:3000/api/narudzbe/1
$r.stavke.Count
$r.stavke[0].bicikl_naziv
```

**Provjeri:**

- [ ] Broj stavki odgovara očekivanju iz seeda (za narudžbu 1: **2** stavke u ugrađenom seedu)
- [ ] `bicikl_naziv` nije prazan gdje seed ima bicikl

## 2. Lista redoslijedom

```powershell
(Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe?limit=10").narudzba_id
```

**Provjeri:** novije narudžbe prve (sort po `datum` silazno) — usporedi datume u odgovoru.

## 3. Nakon dodavanja stavke (vidi §2.4)

Nakon `POST .../stavke`, ponovno `GET /api/narudzbe/{id}` — broj stavki se mora povećati.

## Kriterij „§2.2 OK“

- [ ] Detalj uvijek uključuje **sve** stavke za tu narudžbu  
- [ ] JOIN na bicikl daje **naziv** na stavci  
- [ ] Lista se može ograničiti `?limit=`
