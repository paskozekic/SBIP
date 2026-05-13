/** Redak stavke iz baze (repozitorij) */
export type StavkaNarudzbeRow = {
  stavka_id: number;
  kolicina: number;
  cijena: string;
  bicikl_id: number;
  narudzba_id: number;
  bicikl_naziv: string | null;
};

/** Zaglavlje narudžbe + imena korisnika (JOIN u repozitoriju) */
export type NarudzbaListRow = {
  narudzba_id: number;
  datum: string;
  status: string;
  kupac_korisnik_id: number;
  djelatnik_korisnik_id: number | null;
  kupac_ime: string;
  kupac_prezime: string;
};

export type NarudzbaDetaljRow = NarudzbaListRow & {
  djelatnik_ime: string | null;
  djelatnik_prezime: string | null;
  stavke: StavkaNarudzbeRow[];
};
