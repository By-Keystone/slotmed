import type { UserRole } from "@/domain/enums/user-role";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import type { FastifyInstance, preHandlerHookHandler } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyContextConfig {
    requiredRoles?: UserRole[];
    requireConfirmed?: boolean;
    requireOnboarded?: boolean;
  }

  interface FastifyInstance {
    authorize: preHandlerHookHandler;
  }
}

export interface AuthorizationPluginOptions {
  userRepository: IUserRepository;
}

/**
 *
 * This plugin enables different authorization features, such as scoping an
 * endpoint to specific roles, requiring the user to be onboarded, etc.
 *
 * Mutable flags (`requireOnboarded`, `requireConfirmed`) are checked against
 * the DB on each request — they are not present in the JWT.
 */
async function authorizationPlugin(
  fastify: FastifyInstance,
  opts: AuthorizationPluginOptions,
) {
  const { userRepository } = opts;

  fastify.decorate("authorize", async (request) => {
    const config = request.routeOptions.config;

    const needsAuth =
      config.requiredRoles ||
      config.requireConfirmed ||
      config.requireOnboarded;

    if (!needsAuth) return;

    if (!request.user) {
      await fastify.authenticate(request);
    }

    // if (
    //   config.requiredRoles &&
    //   !config.requiredRoles.includes(request.user.role)
    // ) {
    //   throw fastify.httpErrors.forbidden(
    //     "User not authorized to perform this action",
    //   );
    // }

    if (config.requireConfirmed || config.requireOnboarded) {
      const user = await userRepository.findById(request.user.userId);
      if (!user) {
        throw fastify.httpErrors.unauthorized("User not found");
      }

      if (config.requireConfirmed && !user.confirmed) {
        throw fastify.httpErrors.forbidden("Email not confirmed");
      }

      if (config.requireOnboarded && !user.onboardingCompleted) {
        throw fastify.httpErrors.forbidden("Onboarding not completed");
      }
    }
  });
}

export default fp(authorizationPlugin, {
  name: "authorization",
  dependencies: ["auth"],
});
