import type { NajamRowDb } from "../infrastructure/najamRepository.js";
import { BiciklRepository } from "../infrastructure/biciklRepository.js";
import { NajamRepository } from "../infrastructure/najamRepository.js";

function danaUkljucivo(datumPocetka: string, datumZavrsetka: string): number {
  const a = new Date(`${datumPocetka}T12:00:00Z`);
  const b = new Date(`${datumZavrsetka}T12:00:00Z`);
  if (b < a) throw new Error("VALIDATION: datum završetka ne smije biti raniji od početka najma");
  return Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
}

function withPrikaz(row: NajamRowDb): NajamRowDb & {
  prikaz_statusa: "AKTIVAN" | "VRACEN" | "KASNJENJE";
} {
  if (row.status_najma === "VRACEN") return { ...row, prikaz_statusa: "VRACEN" };
  const zavr = new Date(`${row.datum_zavrsetka}T23:59:59Z`);
  const kasno = Date.now() > zavr.getTime() + 24 * 3600 * 1000;
  return { ...row, prikaz_statusa: kasno ? "KASNJENJE" : "AKTIVAN" };
}

export class NajamService {
  constructor(
    private readonly repo = new NajamRepository(),
    private readonly biciklRepo = new BiciklRepository(),
  ) {}

  listZaDjelatnika(): Promise<Array<NajamRowDb & { prikaz_statusa: "AKTIVAN" | "VRACEN" | "KASNJENJE" }>> {
    return this.repo.listAll().then((rows) => rows.map(withPrikaz));
  }

  listObavijestiKasnjenje(): Promise<NajamRowDb[]> {
    return this.repo.listKasnjenjeZaObavijest();
  }

  async kreiraj(
    kupacKorisnikId: number,
    body: { bicikl_id: number; datum_pocetka: string; datum_zavrsetka: string },
  ): Promise<NajamRowDb & { prikaz_statusa: "AKTIVAN" | "VRACEN" | "KASNJENJE" }> {
    const biciklId = Number(body.bicikl_id);
    const dp = body.datum_pocetka?.trim();
    const dz = body.datum_zavrsetka?.trim();
    if (!Number.isFinite(biciklId) || !dp || !dz) {
      throw new Error("VALIDATION: bicikl_id, datum_pocetka i datum_zavrsetka su obavezni");
    }
    const dani = danaUkljucivo(dp, dz);
    const bicikl = await this.biciklRepo.findById(biciklId);
    if (!bicikl) throw new Error("VALIDATION: bicikl ne postoji");
    if (bicikl.status !== "DOSTUPAN") throw new Error("VALIDATION: bicikl nije dostupan za najam");
    if (!bicikl.cijena_najma_po_danu || Number(bicikl.cijena_najma_po_danu) <= 0) {
      throw new Error("VALIDATION: bicikl nema definiranu cijenu najma po danu");
    }
    if (bicikl.kolicina <= 0) throw new Error("VALIDATION: nema raspoloživih jedinica");
    const overlap = await this.repo.countAktivanOverlap(biciklId, dp, dz);
    if (overlap > 0) throw new Error("VALIDATION: u odabranom razdoblju bicikl je već iznajmljen");
    const cijenaPoDanu = Number(bicikl.cijena_najma_po_danu);
    const ukupno = (dani * cijenaPoDanu).toFixed(2);
    const nid = await this.repo.insert({
      datum_pocetka: dp,
      datum_zavrsetka: dz,
      status_najma: "AKTIVAN",
      ukupna_cijena: ukupno,
      bicikl_id: biciklId,
      djelatnik_korisnik_id: null,
      kupac_korisnik_id: kupacKorisnikId,
    });
    await this.biciklRepo.setStatus(biciklId, "IZNAJMLJEN");
    const row = await this.repo.findById(nid);
    if (!row) throw new Error("INTERNAL: najam nije učitan");
    return withPrikaz(row);
  }

  async oznaciVraceno(najamId: number): Promise<NajamRowDb & { prikaz_statusa: "AKTIVAN" | "VRACEN" | "KASNJENJE" } | null> {
    const existing = await this.repo.findById(najamId);
    if (!existing) return null;
    const ok = await this.repo.setVracen(najamId);
    if (!ok) return null;
    const b = await this.biciklRepo.findById(existing.bicikl_id);
    if (b && b.status === "IZNAJMLJEN" && b.kolicina > 0) {
      await this.biciklRepo.setStatus(existing.bicikl_id, "DOSTUPAN");
    }
    const row = await this.repo.findById(najamId);
    return row ? withPrikaz(row) : null;
  }
}
