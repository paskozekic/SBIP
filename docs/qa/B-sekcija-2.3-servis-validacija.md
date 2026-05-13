# Faza B — §2.3 Servis i validacija

**Cilj:** provjeriti **poslovna pravila** — zaliha i **cijena iz kataloga** na stavci.

## 1. Cijena stavke = kataloška cijena bicikla

1. Uzmi `bicikl_id` i `cijena` iz `GET` detalja postojeće narudžbe (stavka).
2. U bazi (ili kroz novi API ako ga dodate) usporedi s tabelom `bicikl` — **mora se podudarati** s trenutnom kataloškom cijenom u trenutku **dodavanja / izmjene** stavke.

Brza provjera kroz API nakon dodavanja stavke (vidi §2.4): u odgovoru `stavke[].cijena` mora odgovarati trenutnoj cijeni tog bicikla u katalogu.

## 2. Validacija zalihe (ne smije preći `bicikl.kolicina`)

Odaberi bicikl iz seeda s **malom zalihom** (npr. `kolicina` 1 ili 2 — provjeri u bazi ili kroz postojeće stavke).

Pokušaj dodati stavku s **prevelikom** `kolicina`:

```powershell
$bid = 3   # prilagodi bicikl_id
$nid = 1   # prilagodi narudzba_id
$body = @{ bicikl_id = $bid; kolicina = 9999 } | ConvertTo-Json
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/narudzbe/$nid/stavke" -Method POST -Body $body -ContentType "application/json"
} catch {
  $_.Exception.Response.StatusCode.value__
  $_
}
```

**Očekivano:** HTTP **400**, poruka sadrži znak da **nema dovoljno zalihe** / slično.

## 3. Više stavki istog bicikla u istoj narudžbi

Dodaj dvije stavke istog `bicikl_id` tako da **zbroj** količina ostane ≤ zaliha. Treći pokušaj koji prelazi zalihu → opet **400**.

## Kriterij „§2.3 OK“

- [ ] Prekoračenje zalihe → **400**, nema „tihog“ inserta  
- [ ] Cijena na novoj/izmijenjenoj stavci odgovara **katalogu** u trenutku operacije  
