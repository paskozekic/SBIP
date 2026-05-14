import type { NarudzbaDetaljRow, NarudzbaListRow, StavkaNarudzbeRow } from "../domain/narudzba.js";
import { pool } from "./pool.js";

export type BiciklKatalogRow = {
  bicikl_id: number;
  cijena: string;
  kolicina: number;
  naziv: string;
};

export class NarudzbaRepository {
  async findAll(limit = 50): Promise<NarudzbaListRow[]> {
    const res = await pool.query<NarudzbaListRow>(
      `SELECT n.narudzba_id,
              n.datum::text AS datum,
              n.status,
              n.adresa_dostave,
              n.nacin_placanja,
              n.prodaja_obradena,
              n.kupac_korisnik_id,
              n.djelatnik_korisnik_id,
              k.ime AS kupac_ime,
              k.prezime AS kupac_prezime
       FROM narudzba n
       JOIN kupac ku ON ku.korisnik_id = n.kupac_korisnik_id
       JOIN korisnik k ON k.korisnik_id = ku.korisnik_id
       ORDER BY n.datum DESC
       LIMIT $1`,
      [limit],
    );
    return res.rows;
  }

  async findAllZaKupca(kupacKorisnikId: number, limit = 50): Promise<NarudzbaListRow[]> {
    const res = await pool.query<NarudzbaListRow>(
      `SELECT n.narudzba_id,
              n.datum::text AS datum,
              n.status,
              n.adresa_dostave,
              n.nacin_placanja,
              n.prodaja_obradena,
              n.kupac_korisnik_id,
              n.djelatnik_korisnik_id,
              k.ime AS kupac_ime,
              k.prezime AS kupac_prezime
       FROM narudzba n
       JOIN kupac ku ON ku.korisnik_id = n.kupac_korisnik_id
       JOIN korisnik k ON k.korisnik_id = ku.korisnik_id
       WHERE n.kupac_korisnik_id = $1
       ORDER BY n.datum DESC
       LIMIT $2`,
      [kupacKorisnikId, limit],
    );
    return res.rows;
  }

  async findByIdWithStavke(id: number): Promise<NarudzbaDetaljRow | null> {
    type Head = {
      narudzba_id: number;
      datum: string;
      status: string;
      adresa_dostave: string;
      nacin_placanja: string;
      prodaja_obradena: boolean;
      kupac_korisnik_id: number;
      djelatnik_korisnik_id: number | null;
      kupac_ime: string;
      kupac_prezime: string;
      djelatnik_ime: string | null;
      djelatnik_prezime: string | null;
    };
    const head = await pool.query<Head>(
      `SELECT n.narudzba_id,
              n.datum::text AS datum,
              n.status,
              n.adresa_dostave,
              n.nacin_placanja,
              n.prodaja_obradena,
              n.kupac_korisnik_id,
              n.djelatnik_korisnik_id,
              k.ime AS kupac_ime,
              k.prezime AS kupac_prezime,
              d.ime AS djelatnik_ime,
              d.prezime AS djelatnik_prezime
       FROM narudzba n
       JOIN kupac ku ON ku.korisnik_id = n.kupac_korisnik_id
       JOIN korisnik k ON k.korisnik_id = ku.korisnik_id
       LEFT JOIN djelatnik dj ON dj.korisnik_id = n.djelatnik_korisnik_id
       LEFT JOIN korisnik d ON d.korisnik_id = dj.korisnik_id
       WHERE n.narudzba_id = $1`,
      [id],
    );
    const h = head.rows[0];
    if (!h) return null;

    const st = await pool.query<StavkaNarudzbeRow>(
      `SELECT sn.stavka_id,
              sn.kolicina,
              sn.cijena::text AS cijena,
              sn.bicikl_id,
              sn.narudzba_id,
              b.naziv AS bicikl_naziv
       FROM stavkanarudzbe sn
       JOIN bicikl b ON b.bicikl_id = sn.bicikl_id
       WHERE sn.narudzba_id = $1
       ORDER BY sn.stavka_id`,
      [id],
    );

    return { ...h, stavke: st.rows };
  }

  async insertNarudzba(
    status: string,
    kupacKorisnikId: number,
    djelatnikKorisnikId: number | null,
    adresaDostave: string,
    nacinPlacanja: string,
  ): Promise<number> {
    const res = await pool.query<{ narudzba_id: number }>(
      `INSERT INTO narudzba (status, kupac_korisnik_id, djelatnik_korisnik_id, adresa_dostave, nacin_placanja)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING narudzba_id`,
      [status, kupacKorisnikId, djelatnikKorisnikId, adresaDostave, nacinPlacanja],
    );
    return res.rows[0]!.narudzba_id;
  }

  /**
   * Ažuriranje zaglavlja; prijelaz u ZAVRSENA u istoj transakciji primjenjuje prodaju (zaliha + status bicikla).
   */
  async updateNarudzba(
    id: number,
    patch: {
      status?: string;
      djelatnik_korisnik_id?: number | null;
      adresa_dostave?: string;
      nacin_placanja?: string;
    },
  ): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const cur = await client.query<{ status: string; prodaja_obradena: boolean }>(
        `SELECT status, prodaja_obradena FROM narudzba WHERE narudzba_id = $1 FOR UPDATE`,
        [id],
      );
      if (cur.rows.length === 0) {
        await client.query("ROLLBACK");
        return false;
      }
      const oldStatus = cur.rows[0]!.status;
      const newStatus = patch.status !== undefined ? patch.status : oldStatus;
      const becomesZavrsena = newStatus === "ZAVRSENA" && oldStatus !== "ZAVRSENA";

      if (becomesZavrsena) {
        if (cur.rows[0]!.prodaja_obradena) {
          await client.query("ROLLBACK");
          throw new Error("VALIDATION: prodaja je već obrađena za ovu narudžbu");
        }
        const lines = await client.query<{ bicikl_id: number; kolicina: number }>(
          `SELECT bicikl_id, kolicina FROM stavkanarudzbe WHERE narudzba_id = $1`,
          [id],
        );
        if (lines.rowCount === 0) {
          await client.query("ROLLBACK");
          throw new Error("VALIDATION: narudžba mora imati barem jednu stavku prije završetka");
        }
        for (const ln of lines.rows) {
          await client.query(`UPDATE bicikl SET kolicina = kolicina - $1 WHERE bicikl_id = $2`, [
            ln.kolicina,
            ln.bicikl_id,
          ]);
          const br = await client.query<{ kolicina: number }>(
            `SELECT kolicina FROM bicikl WHERE bicikl_id = $1`,
            [ln.bicikl_id],
          );
          const nk = Number(br.rows[0]?.kolicina ?? -1);
          if (nk < 0) {
            await client.query("ROLLBACK");
            throw new Error("VALIDATION: prodaja premašuje zalihu na skladištu");
          }
          if (nk === 0) {
            await client.query(`UPDATE bicikl SET status = 'PRODAN' WHERE bicikl_id = $1`, [ln.bicikl_id]);
          } else {
            await client.query(
              `UPDATE bicikl
               SET status = CASE WHEN status IN ('U_SERVISU', 'NEDOSTUPAN') THEN status ELSE 'DOSTUPAN' END
               WHERE bicikl_id = $1`,
              [ln.bicikl_id],
            );
          }
        }
      }

      const parts: string[] = [];
      const vals: unknown[] = [];
      let i = 1;
      if (patch.status !== undefined) {
        parts.push(`status = $${i++}`);
        vals.push(patch.status);
      }
      if (patch.djelatnik_korisnik_id !== undefined) {
        parts.push(`djelatnik_korisnik_id = $${i++}`);
        vals.push(patch.djelatnik_korisnik_id);
      }
      if (patch.adresa_dostave !== undefined) {
        parts.push(`adresa_dostave = $${i++}`);
        vals.push(patch.adresa_dostave);
      }
      if (patch.nacin_placanja !== undefined) {
        parts.push(`nacin_placanja = $${i++}`);
        vals.push(patch.nacin_placanja);
      }
      if (becomesZavrsena) {
        parts.push(`prodaja_obradena = TRUE`);
      }
      if (parts.length === 0) {
        await client.query("COMMIT");
        return true;
      }
      vals.push(id);
      await client.query(`UPDATE narudzba SET ${parts.join(", ")} WHERE narudzba_id = $${i}`, vals);
      await client.query("COMMIT");
      return true;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async getBicikl(biciklId: number): Promise<BiciklKatalogRow | null> {
    const res = await pool.query<BiciklKatalogRow>(
      `SELECT bicikl_id, cijena::text AS cijena, kolicina, naziv FROM bicikl WHERE bicikl_id = $1`,
      [biciklId],
    );
    return res.rows[0] ?? null;
  }

  async sumKolicinaZaBiciklUNarudzbi(
    narudzbaId: number,
    biciklId: number,
    excludeStavkaId?: number,
  ): Promise<number> {
    const res = await pool.query<{ s: string }>(
      `SELECT COALESCE(SUM(kolicina), 0)::text AS s
       FROM stavkanarudzbe
       WHERE narudzba_id = $1 AND bicikl_id = $2
         AND ($3::int IS NULL OR stavka_id <> $3::int)`,
      [narudzbaId, biciklId, excludeStavkaId ?? null],
    );
    return Number(res.rows[0]?.s ?? 0);
  }

  async insertStavka(
    narudzbaId: number,
    biciklId: number,
    kolicina: number,
    cijena: string,
  ): Promise<StavkaNarudzbeRow> {
    const res = await pool.query<StavkaNarudzbeRow>(
      `INSERT INTO stavkanarudzbe AS sn (kolicina, cijena, bicikl_id, narudzba_id)
       VALUES ($1, $2, $3, $4)
       RETURNING sn.stavka_id,
                 sn.kolicina,
                 sn.cijena::text AS cijena,
                 sn.bicikl_id,
                 sn.narudzba_id,
                 (SELECT b.naziv FROM bicikl b WHERE b.bicikl_id = sn.bicikl_id) AS bicikl_naziv`,
      [kolicina, cijena, biciklId, narudzbaId],
    );
    return res.rows[0]!;
  }

  async updateStavka(
    stavkaId: number,
    narudzbaId: number,
    biciklId: number,
    kolicina: number,
    cijena: string,
  ): Promise<StavkaNarudzbeRow | null> {
    const res = await pool.query<StavkaNarudzbeRow>(
      `UPDATE stavkanarudzbe AS sn
       SET bicikl_id = $3, kolicina = $4, cijena = $5
       WHERE sn.stavka_id = $1 AND sn.narudzba_id = $2
       RETURNING sn.stavka_id,
                 sn.kolicina,
                 sn.cijena::text AS cijena,
                 sn.bicikl_id,
                 sn.narudzba_id,
                 (SELECT b.naziv FROM bicikl b WHERE b.bicikl_id = sn.bicikl_id) AS bicikl_naziv`,
      [stavkaId, narudzbaId, biciklId, kolicina, cijena],
    );
    return res.rows[0] ?? null;
  }

  async deleteStavka(stavkaId: number, narudzbaId: number): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM stavkanarudzbe WHERE stavka_id = $1 AND narudzba_id = $2`,
      [stavkaId, narudzbaId],
    );
    return (res.rowCount ?? 0) > 0;
  }

  async getStavka(stavkaId: number, narudzbaId: number): Promise<{ bicikl_id: number; kolicina: number } | null> {
    const res = await pool.query<{ bicikl_id: number; kolicina: number }>(
      `SELECT bicikl_id, kolicina FROM stavkanarudzbe WHERE stavka_id = $1 AND narudzba_id = $2`,
      [stavkaId, narudzbaId],
    );
    return res.rows[0] ?? null;
  }
}
