import { KategorijaRepository } from "../infrastructure/kategorijaRepository.js";
import type { BiciklKatalogFilter, BiciklRow } from "../infrastructure/biciklRepository.js";
import { BiciklRepository } from "../infrastructure/biciklRepository.js";
import { assertBiciklStatus } from "../domain/biciklEnums.js";

export type BiciklDto = BiciklRow;

export class BiciklService {
  constructor(
    private readonly repo = new BiciklRepository(),
    private readonly katRepo = new KategorijaRepository(),
  ) {}

  katalog(f: BiciklKatalogFilter): Promise<BiciklDto[]> {
    return this.repo.findKatalog(f);
  }

  async getById(id: number): Promise<BiciklDto | null> {
    return this.repo.findById(id);
  }

  async create(body: {
    naziv: string;
    cijena: string;
    kolicina: number;
    status: string;
    kategorija_id: number;
    cijena_najma_po_danu?: string | null;
  }): Promise<number> {
    const naziv = body.naziv?.trim();
    if (!naziv) throw new Error("VALIDATION: naziv je obavezan");
    const kid = Number(body.kategorija_id);
    if (!Number.isFinite(kid)) throw new Error("VALIDATION: kategorija_id je obavezan");
    const kat = await this.katRepo.findById(kid);
    if (!kat) throw new Error("VALIDATION: kategorija ne postoji");
    const kol = Number(body.kolicina);
    if (!Number.isFinite(kol) || kol < 0) throw new Error("VALIDATION: nevaljana količina");
    const cijena = String(body.cijena ?? "").trim();
    if (!cijena) throw new Error("VALIDATION: cijena je obavezna");
    const status = assertBiciklStatus(body.status?.trim() || "DOSTUPAN");
    const cnd = body.cijena_najma_po_danu?.trim();
    const cijenaNajma = cnd && cnd.length > 0 ? cnd : null;
    return this.repo.insert({
      naziv,
      cijena,
      kolicina: kol,
      status,
      kategorija_id: kid,
      cijena_najma_po_danu: cijenaNajma,
    });
  }

  async update(
    id: number,
    body: {
      naziv: string;
      cijena: string;
      kolicina: number;
      status: string;
      kategorija_id: number;
      cijena_najma_po_danu?: string | null;
    },
  ): Promise<boolean> {
    const naziv = body.naziv?.trim();
    if (!naziv) throw new Error("VALIDATION: naziv je obavezan");
    const kid = Number(body.kategorija_id);
    if (!Number.isFinite(kid)) throw new Error("VALIDATION: kategorija_id je obavezan");
    const kat = await this.katRepo.findById(kid);
    if (!kat) throw new Error("VALIDATION: kategorija ne postoji");
    const kol = Number(body.kolicina);
    if (!Number.isFinite(kol) || kol < 0) throw new Error("VALIDATION: nevaljana količina");
    const cijena = String(body.cijena ?? "").trim();
    if (!cijena) throw new Error("VALIDATION: cijena je obavezna");
    const status = assertBiciklStatus(body.status?.trim() || "DOSTUPAN");
    const cnd = body.cijena_najma_po_danu?.trim();
    const cijenaNajma = cnd && cnd.length > 0 ? cnd : null;
    return this.repo.update(id, {
      naziv,
      cijena,
      kolicina: kol,
      status,
      kategorija_id: kid,
      cijena_najma_po_danu: cijenaNajma,
    });
  }

  async remove(id: number): Promise<{ ok: true } | { ok: false; reason: "NOT_FOUND" | "IN_USE" }> {
    const existing = await this.repo.findById(id);
    if (!existing) return { ok: false, reason: "NOT_FOUND" };
    const s = await this.repo.countStavke(id);
    const n = await this.repo.countNajmovi(id);
    if (s > 0 || n > 0) return { ok: false, reason: "IN_USE" };
    const ok = await this.repo.delete(id);
    return ok ? { ok: true } : { ok: false, reason: "NOT_FOUND" };
  }
}
