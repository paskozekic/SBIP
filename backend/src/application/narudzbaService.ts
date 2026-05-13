import type {
  NarudzbaCreateDto,
  NarudzbaDetaljDto,
  NarudzbaListDto,
  NarudzbaUpdateDto,
  StavkaCreateDto,
  StavkaNarudzbeDto,
  StavkaUpdateDto,
} from "../domain/narudzbaDto.js";
import type { NarudzbaDetaljRow, NarudzbaListRow } from "../domain/narudzba.js";
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

  async list(limit?: number): Promise<NarudzbaListDto[]> {
    const rows = await this.repo.findAll(limit ?? 50);
    return rows.map(mapListRow);
  }

  async getById(id: number): Promise<NarudzbaDetaljDto | null> {
    const row = await this.repo.findByIdWithStavke(id);
    return row ? mapDetalj(row) : null;
  }

  async create(body: NarudzbaCreateDto): Promise<NarudzbaDetaljDto> {
    const status = body.status?.trim();
    if (!status) throw new Error("VALIDATION: status je obavezan");
    const kid = Number(body.kupac_korisnik_id);
    if (!Number.isFinite(kid)) throw new Error("VALIDATION: kupac_korisnik_id je obavezan");
    const did =
      body.djelatnik_korisnik_id === undefined || body.djelatnik_korisnik_id === null
        ? null
        : Number(body.djelatnik_korisnik_id);
    if (did !== null && !Number.isFinite(did)) {
      throw new Error("VALIDATION: nevaljan djelatnik_korisnik_id");
    }
    const nid = await this.repo.insertNarudzba(status, kid, did);
    const full = await this.repo.findByIdWithStavke(nid);
    if (!full) throw new Error("INTERNAL: narudžba nije učitana nakon inserta");
    return mapDetalj(full);
  }

  async update(id: number, body: NarudzbaUpdateDto): Promise<NarudzbaDetaljDto | null> {
    const patch: { status?: string; djelatnik_korisnik_id?: number | null } = {};
    if (body.status !== undefined) {
      const s = body.status.trim();
      if (!s) throw new Error("VALIDATION: status ne smije biti prazan");
      patch.status = s;
    }
    if (body.djelatnik_korisnik_id !== undefined) {
      patch.djelatnik_korisnik_id =
        body.djelatnik_korisnik_id === null ? null : Number(body.djelatnik_korisnik_id);
      if (patch.djelatnik_korisnik_id !== null && !Number.isFinite(patch.djelatnik_korisnik_id)) {
        throw new Error("VALIDATION: nevaljan djelatnik_korisnik_id");
      }
    }
    if (Object.keys(patch).length === 0) {
      return this.getById(id);
    }
    const ok = await this.repo.updateNarudzba(id, patch);
    if (!ok) return null;
    return this.getById(id);
  }

  /** Zbroj količina za bicikl u narudžbi ne smije prijeći zalihe u katalogu (DZ3). */
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

  async addStavka(narudzbaId: number, body: StavkaCreateDto): Promise<NarudzbaDetaljDto | null> {
    const biciklId = Number(body.bicikl_id);
    const kol = Number(body.kolicina);
    if (!Number.isFinite(biciklId) || !Number.isFinite(kol) || kol <= 0) {
      throw new Error("VALIDATION: bicikl_id i pozitivna kolicina su obavezni");
    }
    const nar = await this.repo.findByIdWithStavke(narudzbaId);
    if (!nar) return null;

    const bicikl = await this.repo.getBicikl(biciklId);
    if (!bicikl) throw new Error("VALIDATION: bicikl ne postoji");

    await this.assertZalihaDovoljna(narudzbaId, biciklId, kol);

    await this.repo.insertStavka(narudzbaId, biciklId, kol, bicikl.cijena);
    return this.getById(narudzbaId);
  }

  async updateStavka(
    narudzbaId: number,
    stavkaId: number,
    body: StavkaUpdateDto,
  ): Promise<NarudzbaDetaljDto | null> {
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
    return this.getById(narudzbaId);
  }

  async removeStavka(narudzbaId: number, stavkaId: number): Promise<NarudzbaDetaljDto | null> {
    const ok = await this.repo.deleteStavka(stavkaId, narudzbaId);
    if (!ok) return null;
    return this.getById(narudzbaId);
  }
}
