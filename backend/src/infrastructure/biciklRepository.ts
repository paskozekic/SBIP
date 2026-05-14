import { pool } from "./pool.js";

export type BiciklRow = {
  bicikl_id: number;
  naziv: string;
  cijena: string;
  kolicina: number;
  status: string;
  kategorija_id: number;
  kategorija_naziv: string | null;
  cijena_najma_po_danu: string | null;
};

export type BiciklKatalogFilter = {
  q?: string;
  kategorija_id?: number;
  cijena_od?: number;
  cijena_do?: number;
  /** ako true, samo DOSTUPAN + kolicina > 0 */
  samo_dostupni?: boolean;
};

export class BiciklRepository {
  async findKatalog(f: BiciklKatalogFilter): Promise<BiciklRow[]> {
    const cond: string[] = ["1=1"];
    const vals: unknown[] = [];
    let i = 1;
    if (f.q?.trim()) {
      cond.push(`b.naziv ILIKE $${i++}`);
      vals.push(`%${f.q.trim()}%`);
    }
    if (f.kategorija_id !== undefined && Number.isFinite(f.kategorija_id)) {
      cond.push(`b.kategorija_id = $${i++}`);
      vals.push(f.kategorija_id);
    }
    if (f.cijena_od !== undefined && Number.isFinite(f.cijena_od)) {
      cond.push(`b.cijena >= $${i++}`);
      vals.push(f.cijena_od);
    }
    if (f.cijena_do !== undefined && Number.isFinite(f.cijena_do)) {
      cond.push(`b.cijena <= $${i++}`);
      vals.push(f.cijena_do);
    }
    if (f.samo_dostupni) {
      cond.push(`b.status = 'DOSTUPAN' AND b.kolicina > 0`);
    }
    const res = await pool.query<BiciklRow>(
      `SELECT b.bicikl_id,
              b.naziv,
              b.cijena::text AS cijena,
              b.kolicina,
              b.status,
              b.kategorija_id,
              kb.naziv AS kategorija_naziv,
              b.cijena_najma_po_danu::text AS cijena_najma_po_danu
       FROM bicikl b
       JOIN kategorijabicikla kb ON kb.kategorija_id = b.kategorija_id
       WHERE ${cond.join(" AND ")}
       ORDER BY b.naziv`,
      vals,
    );
    return res.rows;
  }

  async findById(id: number): Promise<BiciklRow | null> {
    const res = await pool.query<BiciklRow>(
      `SELECT b.bicikl_id,
              b.naziv,
              b.cijena::text AS cijena,
              b.kolicina,
              b.status,
              b.kategorija_id,
              kb.naziv AS kategorija_naziv,
              b.cijena_najma_po_danu::text AS cijena_najma_po_danu
       FROM bicikl b
       JOIN kategorijabicikla kb ON kb.kategorija_id = b.kategorija_id
       WHERE b.bicikl_id = $1`,
      [id],
    );
    return res.rows[0] ?? null;
  }

  async insert(row: {
    naziv: string;
    cijena: string;
    kolicina: number;
    status: string;
    kategorija_id: number;
    cijena_najma_po_danu: string | null;
  }): Promise<number> {
    const res = await pool.query<{ bicikl_id: number }>(
      `INSERT INTO bicikl (naziv, cijena, kolicina, status, kategorija_id, cijena_najma_po_danu)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING bicikl_id`,
      [
        row.naziv,
        row.cijena,
        row.kolicina,
        row.status,
        row.kategorija_id,
        row.cijena_najma_po_danu,
      ],
    );
    return res.rows[0]!.bicikl_id;
  }

  async update(
    id: number,
    row: {
      naziv: string;
      cijena: string;
      kolicina: number;
      status: string;
      kategorija_id: number;
      cijena_najma_po_danu: string | null;
    },
  ): Promise<boolean> {
    const res = await pool.query(
      `UPDATE bicikl
       SET naziv = $1, cijena = $2, kolicina = $3, status = $4, kategorija_id = $5, cijena_najma_po_danu = $6
       WHERE bicikl_id = $7`,
      [
        row.naziv,
        row.cijena,
        row.kolicina,
        row.status,
        row.kategorija_id,
        row.cijena_najma_po_danu,
        id,
      ],
    );
    return (res.rowCount ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const res = await pool.query(`DELETE FROM bicikl WHERE bicikl_id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async countStavke(biciklId: number): Promise<number> {
    const r = await pool.query<{ c: string }>(
      `SELECT count(*)::text AS c FROM stavkanarudzbe WHERE bicikl_id = $1`,
      [biciklId],
    );
    return Number(r.rows[0]?.c ?? 0);
  }

  async countNajmovi(biciklId: number): Promise<number> {
    const r = await pool.query<{ c: string }>(
      `SELECT count(*)::text AS c FROM najam WHERE bicikl_id = $1`,
      [biciklId],
    );
    return Number(r.rows[0]?.c ?? 0);
  }

  async setStatus(biciklId: number, status: string): Promise<void> {
    await pool.query(`UPDATE bicikl SET status = $1 WHERE bicikl_id = $2`, [status, biciklId]);
  }

  async adjustKolicina(biciklId: number, delta: number): Promise<void> {
    await pool.query(`UPDATE bicikl SET kolicina = kolicina + $1 WHERE bicikl_id = $2`, [delta, biciklId]);
  }

  async getKolicina(biciklId: number): Promise<number | null> {
    const r = await pool.query<{ k: number }>(`SELECT kolicina FROM bicikl WHERE bicikl_id = $1`, [biciklId]);
    return r.rows[0]?.k ?? null;
  }
}
