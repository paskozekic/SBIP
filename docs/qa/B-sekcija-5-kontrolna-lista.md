# Faza B — §5 Kratka kontrolna lista (iz plana)

Ovaj dokument odgovara **§5** u [`../DZ3_FazaB_backend_obrazlozenje.md`](../DZ3_FazaB_backend_obrazlozenje.md). U repou je implementaciju radio **jedan implementator** (Paško); u zadaći su to bile **Osoba 1** (narudžba) i **Osoba 2** (kategorije) — checklist ostaje pod tim nazivima radi predaje.

## Osoba 1 (narudžba + stavke)

| Stavka | Stanje | Gdje u repou (kratko) |
|--------|--------|------------------------|
| DTO / modeli za narudžbu i stavku | [x] | `backend/src/domain/narudzbaDto.ts`, `narudzba.ts` |
| Repozitorij: detalj s stavkama, CRUD zaglavlja i stavki | [x] | `narudzbaRepository.ts` |
| Servis: barem jedno **složenije** poslovno pravilo | [x] | `narudzbaService.ts` — zaliha, cijena iz kataloga |
| REST rute dokumentirane i isprobane | [x] | `narudzbeRoutes.ts`, `backend/README.md`, `docs/qa/B-sekcija-2.*` |

## Osoba 2 (kategorije)

| Stavka | Stanje | Gdje u repou (kratko) |
|--------|--------|------------------------|
| DTO / modeli za kategoriju | [x] | `backend/src/domain/kategorija.ts` |
| Repozitorij + servis: lista, pretraga, CRUD, zaštita brisanja | [x] | `kategorijaRepository.ts`, `kategorijaService.ts` |
| REST + odgovor za **dropdown** | [x] | `kategorijeRoutes.ts`, `GET .../za-odabir` |
| README ili kontrakt API-ja | [x] | `backend/README.md` |

## Napomena

- Kontrolna lista u glavnom obrazloženju (`DZ3_FazaB_backend_obrazlozenje.md`) sinkronizirana je s ovom datotekom (oznake **[x]**).
- Za **točku spajanja** i redoslijed provjere vidi [`B-sekcija-4-zajednicka-tocka-spajanja.md`](B-sekcija-4-zajednicka-tocka-spajanja.md).
