import { UserRole } from "@/domain/enums/user-role";
import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { JWTPayload, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production",
);

/**
 * An extension of the JWTPayload after verifying the token from the `Authorization` header.
 *
 * Mantenemos el JWT minimal — solo identidad inmutable. Cualquier flag mutable
 * (onboardingCompleted, isDoctor, etc.) debe leerse del DB a través de
 * `requireOnboarded` o consultando el repo directamente.
 */
export interface UserClaims extends JWTPayload {
  userId: string;
  email: string;
  accountId: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: UserClaims;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

/**
 *
 * This plugin verifies the token sent in the `Authorization` header and also injects the token info in the request
 *
 * See `UserClaims` for additional information about the token payload.
 */
async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    const authHeader = request.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing authorization token");
      throw fastify.httpErrors.unauthorized("Missing authorization token");
    }

    const token = authHeader.split("Bearer")[1].trim();

    try {
      const { payload } = await jwtVerify<UserClaims>(token, JWT_SECRET);
      request.user = payload;
    } catch {
      console.error("Invalid or expired token");
      throw fastify.httpErrors.unauthorized("Invalid or expired token");
    }
  });
}

export default fp(authPlugin, { name: "auth" });
