import type { FastifyInstance } from "fastify";
import { registerKategorijeRoutes } from "./kategorijeRoutes.js";
import { registerNarudzbeRoutes } from "./narudzbeRoutes.js";
import { registerReferenceDataRoutes } from "./referenceDataRoutes.js";

export async function registerApiRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({ status: "ok", service: "spib-backend" }));

  await app.register(registerReferenceDataRoutes);
  await app.register(registerKategorijeRoutes);
  await app.register(registerNarudzbeRoutes);
}
