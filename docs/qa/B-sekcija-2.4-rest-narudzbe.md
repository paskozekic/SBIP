# Faza B — §2.4 REST — narudžbe i stavke

**Baza URL:** `http://localhost:3000`  
**Prefiks:** `/api`

## Pregled ruta

| Metoda | Put |
|--------|-----|
| GET | `/api/narudzbe` |
| GET | `/api/narudzbe/:id` |
| POST | `/api/narudzbe` |
| PATCH | `/api/narudzbe/:id` |
| POST | `/api/narudzbe/:id/stavke` |
| PATCH | `/api/narudzbe/:id/stavke/:stavkaId` |
| DELETE | `/api/narudzbe/:id/stavke/:stavkaId` |

---

## A) Lista i detalj

```powershell
Invoke-RestMethod http://localhost:3000/api/narudzbe
Invoke-RestMethod http://localhost:3000/api/narudzbe/1
```

---

## B) Nova narudžba

```powershell
$body = @{ status = "NOVA"; kupac_korisnik_id = 1; djelatnik_korisnik_id = $null } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/narudzbe -Method POST -Body $body -ContentType "application/json"
```

Zapamti `narudzba_id` iz odgovora kao `NID`.

---

## C) Nova stavka

```powershell
$NID = 3   # stavi stvarni id
$body = @{ bicikl_id = 1; kolicina = 1 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe/$NID/stavke" -Method POST -Body $body -ContentType "application/json"
```

**Očekivano:** **201**, tijelo = cijeli detalj narudžbe (uključujući `stavke`).

---

## D) Izmjena stavke

```powershell
$NID = 3; $SID = 1
$body = @{ kolicina = 2 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe/$NID/stavke/$SID" -Method PATCH -Body $body -ContentType "application/json"
```

---

## E) Brisanje stavke

```powershell
$NID = 3; $SID = 1
Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe/$NID/stavke/$SID" -Method DELETE
```

**Očekivano:** **200** s JSON tijelom = detalj narudžbe nakon brisanja.

---

## F) PATCH zaglavlja narudžbe

```powershell
$NID = 1
$body = @{ status = "U_OBRADI" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe/$NID" -Method PATCH -Body $body -ContentType "application/json"
```

---

## Kriterij „§2.4 OK“

- [ ] Scenarij: **POST narudžba** → **POST stavka** → **GET detalj** → **PATCH stavka** → **DELETE stavka** prolazi bez 500  
- [ ] Pogrešan `id` → **404** gdje je predviđeno  
- [ ] Nevaš unos (zaliha) → **400**  

*Za Postman: isti URL-i i JSON tijela; Authorization trenutačno nije uključen.*
