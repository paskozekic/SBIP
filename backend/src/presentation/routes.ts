import type { FastifyInstance } from "fastify";
import { registerNarudzbeRoutes } from "./narudzbeRoutes.js";

export async function registerApiRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({ status: "ok", service: "spib-backend" }));

  await app.register(registerNarudzbeRoutes);
}
