import type { BiciklOption, DjelatnikOption, KupacOption } from "../domain/referenceData.js";
import { pool } from "./pool.js";

export class ReferenceDataRepository {
  async listKupci(): Promise<KupacOption[]> {
    const res = await pool.query<KupacOption>(
      `SELECT k.korisnik_id, k.ime, k.prezime
       FROM kupac ku
       JOIN korisnik k ON k.korisnik_id = ku.korisnik_id
       ORDER BY k.prezime, k.ime`,
    );
    return res.rows;
  }

  async listDjelatnici(): Promise<DjelatnikOption[]> {
    const res = await pool.query<DjelatnikOption>(
      `SELECT k.korisnik_id, k.ime, k.prezime
       FROM djelatnik d
       JOIN korisnik k ON k.korisnik_id = d.korisnik_id
       ORDER BY k.prezime, k.ime`,
    );
    return res.rows;
  }

  async listBicikli(): Promise<BiciklOption[]> {
    const res = await pool.query<BiciklOption>(
      `SELECT bicikl_id,
              naziv,
              kolicina,
              cijena::text AS cijena,
              cijena_najma_po_danu::text AS cijena_najma_po_danu
       FROM bicikl
       ORDER BY naziv`,
    );
    return res.rows;
  }
}
