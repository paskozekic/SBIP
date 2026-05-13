# Faza B — §3 Šifrarnik kategorija (3.1–3.4)

## Rute

| Metoda | Put |
|--------|-----|
| GET | `/api/kategorije?q=` |
| GET | `/api/kategorije/za-odabir` |
| GET | `/api/kategorije/:id` |
| POST | `/api/kategorije` |
| PUT | `/api/kategorije/:id` |
| PATCH | `/api/kategorije/:id` |
| DELETE | `/api/kategorije/:id` |

---

## 3.1–3.2 Lista, pretraga, CRUD

```powershell
Invoke-RestMethod "http://localhost:3000/api/kategorije?q=grad"
Invoke-RestMethod http://localhost:3000/api/kategorije/1
```

**Nova kategorija (privremeni naziv — obriši poslije ili koristi jedinstven naziv):**

```powershell
$body = @{ naziv = "QA-test-kat"; opis = "privremeno" } | ConvertTo-Json
Invoke-RestMethod http://localhost:3000/api/kategorije -Method POST -Body $body -ContentType "application/json"
```

**Izmjena** (`PUT` ili `PATCH` — isto tijelo):

```powershell
$id = 6   # id novokreirane
$body = @{ naziv = "QA-test-kat2"; opis = "uredeno" } | ConvertTo-Json
Invoke-RestMethod "http://localhost:3000/api/kategorije/$id" -Method PUT -Body $body -ContentType "application/json"
# ili: -Method PATCH
```

---

## 3.3 Brisanje kada postoje bicikli (409)

Pokušaj obrisati kategoriju koja ima bicikle (npr. id **1** — Gradski):

```powershell
try {
  Invoke-WebRequest -Uri "http://localhost:3000/api/kategorije/1" -Method DELETE
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

**Očekivano:** **409** i poruka da se kategorija ne može obrisati.

---

## 3.4 Dropdown

```powershell
Invoke-RestMethod http://localhost:3000/api/kategorije/za-odabir
```

**Provjeri:** niz objekata s **`kategorijaId`** i **`naziv`** (kompaktni oblik za padajuće liste).

---

## Kriterij „§3 OK“

- [ ] Pretraga `?q=` vraća podskup  
- [ ] POST / PUT / **PATCH** / GET / DELETE ponašaju se očekivano  
- [ ] DELETE zaštićen ako postoje bicikli (**409**)  
- [ ] `/za-odabir` vraća skraćeni JSON  
