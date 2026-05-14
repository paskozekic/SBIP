/**
 * DTO oblici za REST API (JSON) — narudžba + stavke (master–detail).
 * Odvojeni od „golih“ redaka tablice (vidi narudzba.ts za interne tipove ako treba).
 */

/** Odgovor: jedna stavka u detalju narudžbe */
export type StavkaNarudzbeDto = {
  stavka_id: number;
  kolicina: number;
  /** Decimal kao string (JSON) */
  cijena: string;
  jedinica_id: number;
  narudzba_id: number;
  bicikl_naziv: string | null;
  bicikl_inventarni_broj: string | null;
};

/** Odgovor: lista narudžbi (zaglavlje + imena kupca) */
export type NarudzbaListDto = {
  narudzba_id: number;
  datum: string;
  status: string;
  adresa_dostave: string;
  nacin_placanja: string;
  kupac_korisnik_id: number;
  kupac_ime: string;
  kupac_prezime: string;
  djelatnik_korisnik_id: number | null;
  djelatnik_ime: string | null;
  djelatnik_prezime: string | null;
};

/** Odgovor: master–detail — zaglavlje + stavke */
export type NarudzbaDetaljDto = NarudzbaListDto & {
  stavke: StavkaNarudzbeDto[];
};

/** Ulaz: nova narudžba — `status` je jedan od kanonskih kodova (vidi `narudzbaStatus.ts`) */
export type NarudzbaCreateDto = {
  status: string;
  kupac_korisnik_id: number;
  djelatnik_korisnik_id?: number | null;
  adresa_dostave: string;
  nacin_placanja: string;
};

/** Ulaz: ažuriranje zaglavlja — `status` ako je poslan, kanonski kod */
export type NarudzbaUpdateDto = {
  status?: string;
  djelatnik_korisnik_id?: number | null;
  adresa_dostave?: string;
  nacin_placanja?: string;
};

/** Ulaz: nova stavka (cijena se uzima iz kataloga bicikla — poslovno pravilo) */
export type StavkaCreateDto = {
  jedinica_id: number;
  kolicina: number;
};

/** Ulaz: izmjena stavke */
export type StavkaUpdateDto = {
  jedinica_id?: number;
  kolicina?: number;
};
