import cors from "@fastify/cors";
import Fastify from "fastify";
import "dotenv/config";
import { registerApiRoutes } from "./presentation/routes.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(registerApiRoutes, { prefix: "/api" });

const port = Number(process.env.PORT) || 3000;
await app.listen({ port, host: "0.0.0.0" });
app.log.info(`SPIB API http://localhost:${port}/api/health`);
