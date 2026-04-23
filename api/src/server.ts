import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import sensible from "@fastify/sensible";
import {
  serializerCompiler,
  validatorCompiler,
} from "@fastify/type-provider-zod";
import authPlugin from "./plugins/auth.js";
import authRoutes from "./routes/auth/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

async function start() {
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  await fastify.register(cookie);
  await fastify.register(sensible);
  await fastify.register(authPlugin);
  await fastify.register(authRoutes);

  fastify.get("/health", async () => ({ status: "ok" }));

  const port = Number(process.env.PORT) || 4000;
  const host = process.env.HOST || "0.0.0.0";

  await fastify.listen({ port, host });
  console.log(`Server running at http://${host}:${port}`);
}

start().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
