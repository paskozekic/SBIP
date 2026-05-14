import type { FastifyInstance, FastifyReply } from "fastify";
import { BiciklService } from "../application/biciklService.js";
import { requireDjelatnik } from "./requestAuth.js";

const service = new BiciklService();

function err(reply: FastifyReply, code: number, msg: string) {
  return reply.code(code).send({ error: msg });
}

export async function registerBiciklRoutes(app: FastifyInstance): Promise<void> {
  app.get("/katalog/bicikli", async (request) => {
    const q = typeof request.query === "object" && request.query ? (request.query as Record<string, string>) : {};
    const f = {
      q: q.q,
      kategorija_id: q.kategorija_id ? Number(q.kategorija_id) : undefined,
      cijena_od: q.cijena_od ? Number(q.cijena_od) : undefined,
      cijena_do: q.cijena_do ? Number(q.cijena_do) : undefined,
      samo_dostupni: q.samo_dostupni === "1" || q.samo_dostupni === "true",
    };
    return service.katalog(f);
  });

  app.get<{ Params: { id: string } }>("/bicikli/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) return err(reply, 400, "Nevaljan id");
    const row = await service.getById(id);
    if (!row) return err(reply, 404, "Bicikl nije pronađen");
    return row;
  });

  app.post<{ Body: Record<string, unknown> }>("/bicikli", async (request, reply) => {
    try {
      requireDjelatnik(request);
    } catch (e) {
      const sc = (e as Error & { statusCode?: number }).statusCode ?? 401;
      return err(reply, sc, e instanceof Error ? e.message : "Greška");
    }
    const b = request.body as Record<string, unknown>;
    try {
      const id = await service.create({
        naziv: String(b.naziv ?? ""),
        cijena: String(b.cijena ?? ""),
        kolicina: Number(b.kolicina),
        status: String(b.status ?? "DOSTUPAN"),
        kategorija_id: Number(b.kategorija_id),
        cijena_najma_po_danu: b.cijena_najma_po_danu != null ? String(b.cijena_najma_po_danu) : null,
      });
      const row = await service.getById(id);
      return reply.code(201).send(row);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Greška";
      if (msg.startsWith("VALIDATION:")) return err(reply, 400, msg.replace("VALIDATION:", "").trim());
      throw e;
    }
  });

  app.patch<{ Params: { id: string }; Body: Record<string, unknown> }>("/bicikli/:id", async (request, reply) => {
    try {
      requireDjelatnik(request);
    } catch (e) {
      const sc = (e as Error & { statusCode?: number }).statusCode ?? 401;
      return err(reply, sc, e instanceof Error ? e.message : "Greška");
    }
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) return err(reply, 400, "Nevaljan id");
    const b = request.body as Record<string, unknown>;
    try {
      const ok = await service.update(id, {
        naziv: String(b.naziv ?? ""),
        cijena: String(b.cijena ?? ""),
        kolicina: Number(b.kolicina),
        status: String(b.status ?? "DOSTUPAN"),
        kategorija_id: Number(b.kategorija_id),
        cijena_najma_po_danu: b.cijena_najma_po_danu != null ? String(b.cijena_najma_po_danu) : null,
      });
      if (!ok) return err(reply, 404, "Bicikl nije pronađen");
      return service.getById(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Greška";
      if (msg.startsWith("VALIDATION:")) return err(reply, 400, msg.replace("VALIDATION:", "").trim());
      throw e;
    }
  });

  app.delete<{ Params: { id: string } }>("/bicikli/:id", async (request, reply) => {
    try {
      requireDjelatnik(request);
    } catch (e) {
      const sc = (e as Error & { statusCode?: number }).statusCode ?? 401;
      return err(reply, sc, e instanceof Error ? e.message : "Greška");
    }
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) return err(reply, 400, "Nevaljan id");
    const r = await service.remove(id);
    if (!r.ok) {
      if (r.reason === "NOT_FOUND") return err(reply, 404, "Bicikl nije pronađen");
      return err(reply, 409, "Bicikl se ne može obrisati jer postoje stavke narudžbe ili najmovi");
    }
    return reply.code(204).send();
  });
}
