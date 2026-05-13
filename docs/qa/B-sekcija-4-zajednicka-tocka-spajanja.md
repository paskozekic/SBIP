# Faza B — §4 Zajednička točka spajanja (iz plana)

Ovaj dokument odgovara **§4** u [`../DZ3_FazaB_backend_obrazlozenje.md`](../DZ3_FazaB_backend_obrazlozenje.md). Sadrži **što mora biti istinito** prije nego se Faza B smatra spremnom za merge/predaju backend dijela, i **kako to provjeriti** — bez ponavljanja cijelog tehničkog opisa (on je u §2, §3 i u kodu).

## Preduvjeti (što je već trebalo biti gotovo)

1. **Narudžba + stavke** — funkcionalan CRUD kroz REST (lista, detalj, zaglavlje, stavke), vidi §2 u planu i `docs/qa/B-sekcija-2.1` … `2.4`.
2. **Kategorije** — funkcionalan CRUD, pretraga, dropdown ruta; vidi §3 i [`B-sekcija-3-kategorije.md`](B-sekcija-3-kategorije.md).

## Točka spajanja (proces)

1. **Grana:** sav backend rada na **`develop`** (ili merge `feature/*` → `develop` po dogovoru tima).
2. **Dokumentacija kontrakta:** popis ruta i primjeri JSON-a — [`../../backend/README.md`](../../backend/README.md) (tablica ruta, sekcije *Primjeri JSON* i *Kako testirati*).
3. **Ručna provjera:** Postman **ili** PowerShell (`irm` / `Invoke-RestMethod`) — minimalno prolazak kroz [`Faza-B-uvod.md`](Faza-B-uvod.md) i po potrebi datoteke `B-sekcija-*.md` u ovoj mapi.

## Kriterij „§4 OK“

- [ ] `develop` sadrži obje cjeline (narudžba + kategorije) bez poznatih blokera.
- [ ] `backend/README.md` je ažuran s rutama i načinom testiranja.
- [ ] Barem jedan član tima (npr. QA / kolega) može ponoviti osnovne GET/POST/PATCH/DELETE scenarije prema uputama.

Kad su svi kućici gore označeni, pređi na kontrolnu listu: [`B-sekcija-5-kontrolna-lista.md`](B-sekcija-5-kontrolna-lista.md).
