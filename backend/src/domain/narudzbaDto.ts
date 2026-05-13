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
  bicikl_id: number;
  narudzba_id: number;
  bicikl_naziv: string | null;
};

/** Odgovor: lista narudžbi (zaglavlje + imena kupca) */
export type NarudzbaListDto = {
  narudzba_id: number;
  datum: string;
  status: string;
  kupac_korisnik_id: number;
  kupac_ime: string;
  kupac_prezime: string;
  djelatnik_korisnik_id: number | null;
};

/** Odgovor: master–detail — zaglavlje + stavke + imena kupca i djelatnika */
export type NarudzbaDetaljDto = NarudzbaListDto & {
  djelatnik_ime: string | null;
  djelatnik_prezime: string | null;
  stavke: StavkaNarudzbeDto[];
};

/** Ulaz: nova narudžba */
export type NarudzbaCreateDto = {
  status: string;
  kupac_korisnik_id: number;
  djelatnik_korisnik_id?: number | null;
};

/** Ulaz: ažuriranje zaglavlja */
export type NarudzbaUpdateDto = {
  status?: string;
  djelatnik_korisnik_id?: number | null;
};

/** Ulaz: nova stavka (cijena se uzima iz kataloga bicikla — poslovno pravilo) */
export type StavkaCreateDto = {
  bicikl_id: number;
  kolicina: number;
};

/** Ulaz: izmjena stavke */
export type StavkaUpdateDto = {
  bicikl_id?: number;
  kolicina?: number;
};
