import type { UserMembership } from "@/application/queries/membership/get-user-membership.query";
import type { MembershipRole } from "@/domain/enums/membership-role";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { GetUserMembership } from "@/infrastructure/postgres/queries/membership/get-user-membership.query";
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";
import fp from "fastify-plugin";

/**
 * Política de acceso de una ruta. Se declara junto a la ruta con `policy()` y
 * la evalúa `fastify.enforcePolicy`.
 *
 * Al ser un tipo cerrado, un campo mal escrito es un error de compilación —
 * a diferencia de `config: { ... }`, que Fastify acepta sin validar.
 */
export interface Policy {
  /** Ruta abierta. Hay que declararlo a propósito: sin política se deniega. */
  public?: boolean;
  /** Exige un tenant resuelto (`accountId` en la sesión). */
  account?: boolean;
  /** Exige email confirmado. */
  confirmed?: boolean;
  /** Exige onboarding completado. */
  onboarded?: boolean;
  /**
   * Exige que el usuario sea miembro del recurso de la petición, con el rol que
   * sea. El recurso se lee siempre de `params.resourceId` y la membership se
   * busca por `(userId, resourceId)`, así que un recurso de otra cuenta no
   * devuelve nada y la petición no pasa.
   *
   * Las rutas que operan sobre un recurso deben nombrar así su parámetro; el
   * nombre del placeholder no forma parte de la URL, así que renombrarlo no
   * afecta a quien consume la API.
   */
  member?: boolean;
  /**
   * Restringe a estos roles sobre el recurso. Implica `member`, porque el rol
   * sale de esa misma membership.
   *
   * `"*"` acepta cualquier rol y equivale a declarar sólo `member: true`; sirve
   * para dejar por escrito que la ruta es de acceso abierto a los miembros, en
   * vez de que se lea como un `roles` que alguien olvidó poner.
   */
  roles?: MembershipRole[] | "*";
}

declare module "fastify" {
  interface FastifyContextConfig {
    policy?: Policy;
  }

  interface FastifyInstance {
    enforcePolicy: preHandlerHookHandler;
  }

  interface FastifyRequest {
    /**
     * Membership sobre `params.resourceId`, resuelta por `member`/`roles`.
     * Queda `undefined` en las rutas cuya política no la resuelve: para leerla
     * en un handler, usa `requireMembership(request)`.
     */
    membership?: UserMembership;
  }
}

/**
 * Declara la política de una ruta. Se esparce sobre las opciones de la ruta:
 *
 * ```ts
 * app.get("/clinic/:resourceId/users", {
 *   schema: { params: getClinicUsersSchema },
 *   ...policy({ account: true, confirmed: true, roles: ["ADMIN"] }),
 * }, handler)
 * ```
 *
 * El hook global de `server.ts` la aplica; la ruta no declara `preHandler`.
 */
export function policy(p: Policy) {
  return { config: { policy: p } };
}

/**
 * Devuelve la membership que resolvió la política de la ruta, ya con tipo
 * no-opcional. Si falta es que la ruta no declaró `member`/`roles`: error de
 * configuración nuestro, no del cliente.
 */
export function requireMembership(request: FastifyRequest): UserMembership {
  if (!request.membership) {
    request.log.error(
      { url: request.url },
      "Handler reads membership but the route policy does not resolve it",
    );
    throw request.server.httpErrors.internalServerError(
      "Misconfigured route policy",
    );
  }

  return request.membership;
}

export interface PolicyPluginOptions {
  userRepository: IUserRepository;
}

async function policyPlugin(
  fastify: FastifyInstance,
  opts: PolicyPluginOptions,
) {
  const { userRepository } = opts;

  // Reservada al arrancar para no cambiar la forma del objeto request en
  // caliente. Queda `undefined` en las rutas cuya política no la resuelve.
  fastify.decorateRequest("membership", undefined);

  fastify.decorate("enforcePolicy", async (request) => {
    const declared = request.routeOptions.config.policy;

    // Sin política declarada se deniega: olvidarla cierra la ruta en vez de
    // dejarla abierta.
    if (!declared) {
      request.log.error(
        { url: request.url },
        "Route reached enforcePolicy without a declared policy",
      );
      throw fastify.httpErrors.unauthorized("Route has no policy declared");
    }

    if (declared.public) return;

    if (!request.user) {
      await fastify.authenticate(request);
    }

    if (declared.account && !request.user.accountId) {
      throw fastify.httpErrors.forbidden("No account associated with user");
    }

    if (declared.confirmed || declared.onboarded) {
      const user = await userRepository.findById(request.user.userId);

      if (!user) {
        throw fastify.httpErrors.unauthorized("User not found");
      }

      if (declared.confirmed && !user.confirmed) {
        throw fastify.httpErrors.forbidden("Email not confirmed");
      }

      if (declared.onboarded && !user.onboardingCompleted) {
        throw fastify.httpErrors.forbidden("Onboarding not completed");
      }
    }

    if (declared.member || declared.roles) {
      const { resourceId } = (request.params ?? {}) as { resourceId?: string };

      if (!resourceId) {
        // La ruta declara la comprobación pero no expone `:resourceId`: error
        // nuestro, no del cliente. Fallamos cerrado en lugar de saltárnosla.
        request.log.error(
          { url: request.url },
          "Policy declares member/roles but the route has no :resourceId param",
        );
        throw fastify.httpErrors.internalServerError(
          "Misconfigured route policy",
        );
      }

      const membership = await new GetUserMembership().execute({
        userId: request.user.userId,
        resourceId,
      });

      // Sin membership no distinguimos "no existe" de "existe pero es de otra
      // cuenta": 404 en ambos casos, para no revelar qué recursos hay en otras
      // cuentas.
      if (!membership) {
        throw fastify.httpErrors.notFound("Resource not found");
      }

      if (
        declared.roles &&
        declared.roles !== "*" &&
        !declared.roles.includes(membership.role)
      ) {
        throw fastify.httpErrors.forbidden(
          "Insufficient role on this resource",
        );
      }

      request.membership = membership;
    }
  });
}

export default fp(policyPlugin, {
  name: "policy",
  dependencies: ["auth"],
});
