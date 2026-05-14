import type {
  NarudzbaCreateDto,
  NarudzbaDetaljDto,
  NarudzbaListDto,
  NarudzbaUpdateDto,
  StavkaCreateDto,
  StavkaNarudzbeDto,
  StavkaUpdateDto,
} from "../domain/narudzbaDto.js";
import type { AuthUser } from "../domain/authTypes.js";
import type { NarudzbaDetaljRow, NarudzbaListRow } from "../domain/narudzba.js";
import { assertNacinPlacanja } from "../domain/biciklEnums.js";
import { assertNarudzbaStatus } from "../domain/narudzbaStatus.js";
import { NarudzbaRepository } from "../infrastructure/narudzbaRepository.js";

function mapStavka(r: NarudzbaDetaljRow["stavke"][0]): StavkaNarudzbeDto {
  return {
    stavka_id: r.stavka_id,
    kolicina: r.kolicina,
    cijena: r.cijena,
    bicikl_id: r.bicikl_id,
    narudzba_id: r.narudzba_id,
    bicikl_naziv: r.bicikl_naziv,
  };
}

function mapListRow(r: NarudzbaListRow): NarudzbaListDto {
  return {
    narudzba_id: r.narudzba_id,
    datum: r.datum,
    status: r.status,
    adresa_dostave: r.adresa_dostave,
    nacin_placanja: r.nacin_placanja,
    kupac_korisnik_id: r.kupac_korisnik_id,
    kupac_ime: r.kupac_ime,
    kupac_prezime: r.kupac_prezime,
    djelatnik_korisnik_id: r.djelatnik_korisnik_id,
  };
}

function mapDetalj(r: NarudzbaDetaljRow): NarudzbaDetaljDto {
  return {
    ...mapListRow(r),
    djelatnik_ime: r.djelatnik_ime,
    djelatnik_prezime: r.djelatnik_prezime,
    stavke: r.stavke.map(mapStavka),
  };
}

export class NarudzbaService {
  constructor(private readonly repo = new NarudzbaRepository()) {}

  private assertNarudzbaPristup(n: NarudzbaDetaljRow, auth: AuthUser): void {
    if (auth.role === "djelatnik") return;
    if (n.kupac_korisnik_id !== auth.korisnik_id) {
      throw new Error("VALIDATION: nije vaša narudžba");
    }
  }

  async list(auth: AuthUser, limit?: number): Promise<NarudzbaListDto[]> {
    const lim = limit ?? 50;
    const rows =
      auth.role === "kupac"
        ? await this.repo.findAllZaKupca(auth.korisnik_id, lim)
        : await this.repo.findAll(lim);
    return rows.map(mapListRow);
  }

  private detaljIzRetka(row: NarudzbaDetaljRow): NarudzbaDetaljDto {
    return mapDetalj(row);
  }

  private async detaljNakonPromjene(id: number): Promise<NarudzbaDetaljDto | null> {
    const row = await this.repo.findByIdWithStavke(id);
    return row ? this.detaljIzRetka(row) : null;
  }

  async getById(id: number, auth: AuthUser): Promise<NarudzbaDetaljDto | null> {
    const row = await this.repo.findByIdWithStavke(id);
    if (!row) return null;
    try {
      this.assertNarudzbaPristup(row, auth);
    } catch {
      return null;
    }
    return this.detaljIzRetka(row);
  }

  async create(body: NarudzbaCreateDto, auth: AuthUser): Promise<NarudzbaDetaljDto> {
    const status = body.status?.trim();
    if (!status) throw new Error("VALIDATION: status je obavezan");
    assertNarudzbaStatus(status);
    let kid = Number(body.kupac_korisnik_id);
    if (auth.role === "kupac") {
      kid = auth.korisnik_id;
    } else if (!Number.isFinite(kid)) {
      throw new Error("VALIDATION: kupac_korisnik_id je obavezan za narudžbu u ime kupca");
    }
    const did =
      body.djelatnik_korisnik_id === undefined || body.djelatnik_korisnik_id === null
        ? null
        : Number(body.djelatnik_korisnik_id);
    if (did !== null && !Number.isFinite(did)) {
      throw new Error("VALIDATION: nevaljan djelatnik_korisnik_id");
    }
    const adresa = body.adresa_dostave?.trim();
    if (!adresa) throw new Error("VALIDATION: adresa dostave je obavezna");
    const nacin = assertNacinPlacanja(body.nacin_placanja ?? "");
    const nid = await this.repo.insertNarudzba(status, kid, did, adresa, nacin);
    const full = await this.repo.findByIdWithStavke(nid);
    if (!full) throw new Error("INTERNAL: narudžba nije učitana nakon inserta");
    return mapDetalj(full);
  }

  async update(id: number, body: NarudzbaUpdateDto, auth: AuthUser): Promise<NarudzbaDetaljDto | null> {
    const cur = await this.repo.findByIdWithStavke(id);
    if (!cur) return null;
    this.assertNarudzbaPristup(cur, auth);
    const patch: {
      status?: string;
      djelatnik_korisnik_id?: number | null;
      adresa_dostave?: string;
      nacin_placanja?: string;
    } = {};
    if (body.status !== undefined) {
      const s = body.status.trim();
      if (!s) throw new Error("VALIDATION: status ne smije biti prazan");
      patch.status = assertNarudzbaStatus(s);
    }
    if (body.djelatnik_korisnik_id !== undefined) {
      patch.djelatnik_korisnik_id =
        body.djelatnik_korisnik_id === null ? null : Number(body.djelatnik_korisnik_id);
      if (patch.djelatnik_korisnik_id !== null && !Number.isFinite(patch.djelatnik_korisnik_id)) {
        throw new Error("VALIDATION: nevaljan djelatnik_korisnik_id");
      }
    }
    if (body.adresa_dostave !== undefined) {
      const a = body.adresa_dostave.trim();
      if (!a) throw new Error("VALIDATION: adresa ne smije biti prazna");
      patch.adresa_dostave = a;
    }
    if (body.nacin_placanja !== undefined) {
      patch.nacin_placanja = assertNacinPlacanja(body.nacin_placanja);
    }
    if (Object.keys(patch).length === 0) {
      return this.detaljIzRetka(cur);
    }
    try {
      const ok = await this.repo.updateNarudzba(id, patch);
      if (!ok) return null;
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("VALIDATION:")) throw e;
      throw e;
    }
    return this.detaljNakonPromjene(id);
  }

  private async assertZalihaDovoljna(
    narudzbaId: number,
    biciklId: number,
    novaKolicina: number,
    excludeStavkaId?: number,
  ): Promise<void> {
    const bicikl = await this.repo.getBicikl(biciklId);
    if (!bicikl) throw new Error("VALIDATION: bicikl ne postoji");
    const vec = await this.repo.sumKolicinaZaBiciklUNarudzbi(narudzbaId, biciklId, excludeStavkaId);
    if (vec + novaKolicina > bicikl.kolicina) {
      throw new Error(
        `VALIDATION: nema dovoljno zalihe (bicikl ${biciklId}, na zalihi ${bicikl.kolicina}, već u narudžbi ${vec}, traženo još ${novaKolicina})`,
      );
    }
  }

  async addStavka(narudzbaId: number, body: StavkaCreateDto, auth: AuthUser): Promise<NarudzbaDetaljDto | null> {
    const nar = await this.repo.findByIdWithStavke(narudzbaId);
    if (!nar) return null;
    this.assertNarudzbaPristup(nar, auth);
    const biciklId = Number(body.bicikl_id);
    const kol = Number(body.kolicina);
    if (!Number.isFinite(biciklId) || !Number.isFinite(kol) || kol <= 0) {
      throw new Error("VALIDATION: bicikl_id i pozitivna kolicina su obavezni");
    }
    const bicikl = await this.repo.getBicikl(biciklId);
    if (!bicikl) throw new Error("VALIDATION: bicikl ne postoji");

    await this.assertZalihaDovoljna(narudzbaId, biciklId, kol);

    await this.repo.insertStavka(narudzbaId, biciklId, kol, bicikl.cijena);
    return this.detaljNakonPromjene(narudzbaId);
  }

  async updateStavka(
    narudzbaId: number,
    stavkaId: number,
    body: StavkaUpdateDto,
    auth: AuthUser,
  ): Promise<NarudzbaDetaljDto | null> {
    const nar = await this.repo.findByIdWithStavke(narudzbaId);
    if (!nar) return null;
    this.assertNarudzbaPristup(nar, auth);
    const existing = await this.repo.getStavka(stavkaId, narudzbaId);
    if (!existing) return null;

    const biciklId = body.bicikl_id !== undefined ? Number(body.bicikl_id) : existing.bicikl_id;
    const kol = body.kolicina !== undefined ? Number(body.kolicina) : existing.kolicina;

    if (!Number.isFinite(biciklId) || !Number.isFinite(kol) || kol <= 0) {
      throw new Error("VALIDATION: nevaljana količina ili bicikl");
    }

    const bicikl = await this.repo.getBicikl(biciklId);
    if (!bicikl) throw new Error("VALIDATION: bicikl ne postoji");

    await this.assertZalihaDovoljna(narudzbaId, biciklId, kol, stavkaId);

    const row = await this.repo.updateStavka(stavkaId, narudzbaId, biciklId, kol, bicikl.cijena);
    if (!row) return null;
    return this.detaljNakonPromjene(narudzbaId);
  }

  async removeStavka(narudzbaId: number, stavkaId: number, auth: AuthUser): Promise<NarudzbaDetaljDto | null> {
    const nar = await this.repo.findByIdWithStavke(narudzbaId);
    if (!nar) return null;
    this.assertNarudzbaPristup(nar, auth);
    const ok = await this.repo.deleteStavka(stavkaId, narudzbaId);
    if (!ok) return null;
    return this.detaljNakonPromjene(narudzbaId);
  }
}
