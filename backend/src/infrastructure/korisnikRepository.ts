import { pool } from "./pool.js";

export type KorisnikAuthRow = {
  korisnik_id: number;
  lozinka: string;
  uloga: "kupac" | "djelatnik";
};

export class KorisnikRepository {
  async findByEmailForAuth(email: string): Promise<KorisnikAuthRow | null> {
    const res = await pool.query<KorisnikAuthRow>(
      `SELECT k.korisnik_id,
              k.lozinka,
              CASE WHEN d.korisnik_id IS NOT NULL THEN 'djelatnik'::text ELSE 'kupac'::text END AS uloga
       FROM korisnik k
       LEFT JOIN djelatnik d ON d.korisnik_id = k.korisnik_id
       WHERE lower(k.email) = lower($1)`,
      [email.trim()],
    );
    const row = res.rows[0];
    if (!row) return null;
    return {
      korisnik_id: row.korisnik_id,
      lozinka: row.lozinka,
      uloga: row.uloga === "djelatnik" ? "djelatnik" : "kupac",
    };
  }

  async insertKorisnik(ime: string, prezime: string, email: string, lozinkaHash: string): Promise<number> {
    const res = await pool.query<{ korisnik_id: number }>(
      `INSERT INTO korisnik (ime, prezime, email, lozinka)
       VALUES ($1, $2, $3, $4)
       RETURNING korisnik_id`,
      [ime, prezime, email.trim().toLowerCase(), lozinkaHash],
    );
    return res.rows[0]!.korisnik_id;
  }

  async insertKupac(korisnikId: number): Promise<void> {
    await pool.query(`INSERT INTO kupac (korisnik_id) VALUES ($1)`, [korisnikId]);
  }

  async emailExists(email: string): Promise<boolean> {
    const res = await pool.query<{ c: string }>(
      `SELECT count(*)::text AS c FROM korisnik WHERE lower(email) = lower($1)`,
      [email.trim()],
    );
    return Number(res.rows[0]?.c ?? 0) > 0;
  }

  async findProfil(korisnikId: number): Promise<{ ime: string; prezime: string; email: string } | null> {
    const res = await pool.query<{ ime: string; prezime: string; email: string }>(
      `SELECT ime, prezime, email FROM korisnik WHERE korisnik_id = $1`,
      [korisnikId],
    );
    return res.rows[0] ?? null;
  }
}
