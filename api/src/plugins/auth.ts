import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { JWTPayload, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production",
);

export interface UserClaims extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  onboardingCompleted: boolean;
}

declare module "fastify" {
  interface FastifyRequest {
    user: UserClaims;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw fastify.httpErrors.unauthorized("Missing authorization token");
    }

    const token = authHeader.split("Bearer")[1].trim();

    try {
      const { payload } = await jwtVerify<UserClaims>(token, JWT_SECRET);
      request.user = payload;
    } catch {
      throw fastify.httpErrors.unauthorized("Invalid or expired token");
    }
  });
}

export default fp(authPlugin, { name: "auth" });
