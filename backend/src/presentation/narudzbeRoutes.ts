import type { FastifyInstance, FastifyReply } from "fastify";
import { NarudzbaService } from "../application/narudzbaService.js";

const service = new NarudzbaService();

function validationReply(reply: FastifyReply, e: unknown): unknown | null {
  if (e instanceof Error && e.message.startsWith("VALIDATION:")) {
    return reply
      .code(400)
      .send({ error: e.message.replace("VALIDATION:", "").trim() });
  }
  return null;
}

export async function registerNarudzbeRoutes(app: FastifyInstance): Promise<void> {
  app.get("/narudzbe", async (request) => {
    const lim = typeof request.query === "object" && request.query && "limit" in request.query
      ? Number((request.query as { limit?: string }).limit)
      : 50;
    return service.list(Number.isFinite(lim) ? lim : 50);
  });

  app.post<{ Body: Record<string, unknown> }>("/narudzbe", async (request, reply) => {
    try {
      const b = request.body as {
        status?: string;
        kupac_korisnik_id?: number;
        djelatnik_korisnik_id?: number | null;
      };
      const created = await service.create({
        status: b.status ?? "",
        kupac_korisnik_id: Number(b.kupac_korisnik_id),
        djelatnik_korisnik_id: b.djelatnik_korisnik_id,
      });
      return reply.code(201).send(created);
    } catch (e) {
      const v = validationReply(reply, e);
      if (v !== null) return v;
      throw e;
    }
  });

  app.get<{ Params: { id: string } }>("/narudzbe/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (!Number.isFinite(id)) {
      return reply.code(400).send({ error: "Nevaljan id" });
    }
    const row = await service.getById(id);
    if (!row) return reply.code(404).send({ error: "Narudžba nije pronađena" });
    return row;
  });

  app.patch<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/narudzbe/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (!Number.isFinite(id)) {
        return reply.code(400).send({ error: "Nevaljan id" });
      }
      try {
        const b = request.body as {
          status?: string;
          djelatnik_korisnik_id?: number | null;
        };
        const updated = await service.update(id, {
          status: b.status,
          djelatnik_korisnik_id: b.djelatnik_korisnik_id,
        });
        if (!updated) return reply.code(404).send({ error: "Narudžba nije pronađena" });
        return updated;
      } catch (e) {
        const v = validationReply(reply, e);
        if (v !== null) return v;
        throw e;
      }
    },
  );

  app.post<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/narudzbe/:id/stavke",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (!Number.isFinite(id)) {
        return reply.code(400).send({ error: "Nevaljan id" });
      }
      try {
        const b = request.body as { bicikl_id?: number; kolicina?: number };
        const det = await service.addStavka(id, {
          bicikl_id: Number(b.bicikl_id),
          kolicina: Number(b.kolicina),
        });
        if (!det) return reply.code(404).send({ error: "Narudžba nije pronađena" });
        return reply.code(201).send(det);
      } catch (e) {
        const v = validationReply(reply, e);
        if (v !== null) return v;
        throw e;
      }
    },
  );

  app.patch<{ Params: { id: string; stavkaId: string }; Body: Record<string, unknown> }>(
    "/narudzbe/:id/stavke/:stavkaId",
    async (request, reply) => {
      const narId = Number(request.params.id);
      const stId = Number(request.params.stavkaId);
      if (!Number.isFinite(narId) || !Number.isFinite(stId)) {
        return reply.code(400).send({ error: "Nevaljan id" });
      }
      try {
        const b = request.body as { bicikl_id?: number; kolicina?: number };
        const det = await service.updateStavka(narId, stId, {
          bicikl_id: b.bicikl_id,
          kolicina: b.kolicina,
        });
        if (!det) return reply.code(404).send({ error: "Narudžba ili stavka nije pronađena" });
        return det;
      } catch (e) {
        const v = validationReply(reply, e);
        if (v !== null) return v;
        throw e;
      }
    },
  );

  app.delete<{ Params: { id: string; stavkaId: string } }>(
    "/narudzbe/:id/stavke/:stavkaId",
    async (request, reply) => {
      const narId = Number(request.params.id);
      const stId = Number(request.params.stavkaId);
      if (!Number.isFinite(narId) || !Number.isFinite(stId)) {
        return reply.code(400).send({ error: "Nevaljan id" });
      }
      const det = await service.removeStavka(narId, stId);
      if (!det) return reply.code(404).send({ error: "Narudžba ili stavka nije pronađena" });
      return det;
    },
  );
}
