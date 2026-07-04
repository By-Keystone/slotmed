import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { fromNodeHeaders } from "better-auth/node";
import auth from "@/infrastructure/vendors/auth/better-auth/auth";

/**
 * Identidad resuelta desde la sesión de Better Auth e inyectada en la request.
 * `accountId` puede ser `null` hasta que el usuario completa el onboarding;
 * usa `requireAccount` en rutas que necesiten un tenant garantizado.
 */
export interface UserClaims {
  userId: string;
  email: string;
  accountId: string | null;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: UserClaims;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
    requireAccount: (request: FastifyRequest) => Promise<void>;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw fastify.httpErrors.unauthorized("Missing or invalid session");
    }

    const sessionUser = session.user as {
      id: string;
      email: string;
      accountId?: string | null;
      role?: string | null;
    };

    request.user = {
      userId: sessionUser.id,
      email: sessionUser.email,
      accountId: sessionUser.accountId ?? null,
      role: sessionUser.role ?? "USER",
    };
  });

  fastify.decorate("requireAccount", async (request: FastifyRequest) => {
    if (!request.user) {
      await fastify.authenticate(request);
    }
    if (!request.user.accountId) {
      throw fastify.httpErrors.forbidden("No account associated with user");
    }
  });
}

export default fp(authPlugin, { name: "auth" });
