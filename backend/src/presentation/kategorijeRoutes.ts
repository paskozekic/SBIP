import type { FastifyInstance } from "fastify";
import { KategorijaService } from "../application/kategorijaService.js";

const service = new KategorijaService();

export async function registerKategorijeRoutes(app: FastifyInstance): Promise<void> {
  app.get("/kategorije", async (request) => {
    const q = typeof request.query === "object" && request.query && "q" in request.query
      ? String((request.query as { q?: string }).q ?? "")
      : "";
    const rows = await service.list(q || undefined);
    return rows;
  });

  app.get("/kategorije/za-odabir", async () => {
    const rows = await service.list();
    return rows.map((r) => ({ kategorijaId: r.kategorija_id, naziv: r.naziv }));
  });

  app.get<{ Params: { id: string } }>("/kategorije/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) {
      return reply.code(400).send({ error: "Nevaljan id" });
    }
    const row = await service.getById(id);
    if (!row) return reply.code(404).send({ error: "Kategorija nije pronađena" });
    return row;
  });

  app.post<{ Body: { naziv?: string; opis?: string | null } }>("/kategorije", async (request, reply) => {
    try {
      const created = await service.create({
        naziv: request.body?.naziv ?? "",
        opis: request.body?.opis,
      });
      return reply.code(201).send(created);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Greška";
      if (msg.startsWith("VALIDATION:")) {
        return reply.code(400).send({ error: msg.replace("VALIDATION:", "").trim() });
      }
      throw e;
    }
  });

  app.put<{ Params: { id: string }; Body: { naziv?: string; opis?: string | null } }>(
    "/kategorije/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (!Number.isFinite(id)) {
        return reply.code(400).send({ error: "Nevaljan id" });
      }
      try {
        const updated = await service.update(id, {
          naziv: request.body?.naziv ?? "",
          opis: request.body?.opis,
        });
        if (!updated) return reply.code(404).send({ error: "Kategorija nije pronađena" });
        return updated;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Greška";
        if (msg.startsWith("VALIDATION:")) {
          return reply.code(400).send({ error: msg.replace("VALIDATION:", "").trim() });
        }
        throw e;
      }
    },
  );

  app.delete<{ Params: { id: string } }>("/kategorije/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) {
      return reply.code(400).send({ error: "Nevaljan id" });
    }
    const result = await service.delete(id);
    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return reply.code(404).send({ error: "Kategorija nije pronađena" });
      }
      return reply.code(409).send({
        error: "Kategorija se ne može obrisati jer postoje bicikli koji je koriste",
      });
    }
    return reply.code(204).send();
  });
}
