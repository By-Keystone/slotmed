import type { UserMembership } from "@/application/queries/membership/get-user-membership.query";
import type { User } from "@/domain/entities/user/entity";
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
   * Comprueba que el usuario tenga membership sobre el recurso de la petición,
   * que se lee siempre de `params.resourceId`. La busca por
   * `(userId, resourceId)`, así que un recurso de otra cuenta no devuelve nada
   * y la petición no pasa.
   *
   * Las rutas que operan sobre un recurso deben nombrar así su parámetro; el
   * nombre del placeholder no forma parte de la URL, así que renombrarlo no
   * afecta a quien consume la API.
   */
  checkResource?: boolean;
  /**
   * Roles aceptados sobre ese recurso. Implica `checkResource`, porque el rol
   * sale de la membership que resuelve esa comprobación.
   */
  roles?: MembershipRole[];
}

declare module "fastify" {
  interface FastifyContextConfig {
    policy?: Policy;
  }

  interface FastifyInstance {
    enforcePolicy: preHandlerHookHandler;
  }

  interface FastifyRequest {
    /** Membership resuelta por la regla `membership`, para reusar en el handler. */
    membership?: UserMembership;
  }
}

/**
 * Declara la política de una ruta. Se esparce sobre las opciones de la ruta:
 *
 * ```ts
 * app.get("/clinic/:resourceId/users", {
 *   schema: { params: getClinicUsersSchema },
 *   preHandler: [fastify.enforcePolicy],
 *   ...policy({ account: true, membership: { roles: ["ADMIN"], param: "resourceId" } }),
 * }, handler)
 * ```
 */
export function policy(p: Policy) {
  return { config: { policy: p } };
}

interface PolicyContext {
  request: FastifyRequest;
  policy: Policy;
  fastify: FastifyInstance;
  /** Carga el usuario de BD una sola vez por petición. */
  loadUser: () => Promise<User>;
}

interface PolicyRule {
  name: string;
  /** Si esta política activa la regla. */
  applies: (policy: Policy) => boolean;
  /** Lanza un error HTTP si no se cumple. */
  check: (ctx: PolicyContext) => Promise<void>;
}

const accountRule: PolicyRule = {
  name: "account",
  applies: (policy) => policy.account === true,
  check: async ({ request, fastify }) => {
    if (!request.user.accountId) {
      throw fastify.httpErrors.forbidden("No account associated with user");
    }
  },
};

const userStateRule: PolicyRule = {
  name: "user-state",
  applies: (policy) => policy.confirmed === true || policy.onboarded === true,
  check: async ({ policy, fastify, loadUser }) => {
    const user = await loadUser();

    if (policy.confirmed && !user.confirmed) {
      throw fastify.httpErrors.forbidden("Email not confirmed");
    }

    if (policy.onboarded && !user.onboardingCompleted) {
      throw fastify.httpErrors.forbidden("Onboarding not completed");
    }
  },
};

const resourceRule: PolicyRule = {
  name: "resource",
  applies: (policy) => policy.checkResource === true || policy.roles !== undefined,
  check: async ({ request, policy, fastify }) => {
    const params = request.params as Record<string, unknown> | undefined;
    const resourceId = params?.resourceId;

    if (typeof resourceId !== "string" || !resourceId) {
      // La ruta declara la comprobación pero no expone `:resourceId`: error
      // nuestro, no del cliente. Fallamos cerrado en lugar de saltárnosla.
      request.log.error(
        { url: request.url },
        "Policy declares checkResource but the route has no :resourceId param",
      );
      throw fastify.httpErrors.internalServerError("Misconfigured route policy");
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

    if (policy.roles && !policy.roles.includes(membership.role)) {
      throw fastify.httpErrors.forbidden("Insufficient role on this resource");
    }

    request.membership = membership;
  },
};

/**
 * Orden de evaluación. Para añadir una comprobación nueva: se agrega el campo
 * a `Policy` y su regla a esta lista. Las rutas que no lo declaren no cambian.
 */
const rules: PolicyRule[] = [accountRule, userStateRule, resourceRule];

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

    let cached: User | undefined;
    const loadUser = async () => {
      if (!cached) {
        const user = await userRepository.findById(request.user.userId);
        if (!user) {
          throw fastify.httpErrors.unauthorized("User not found");
        }
        cached = user;
      }
      return cached;
    };

    for (const rule of rules) {
      if (rule.applies(declared)) {
        await rule.check({ request, policy: declared, fastify, loadUser });
      }
    }
  });
}

export default fp(policyPlugin, {
  name: "policy",
  dependencies: ["auth"],
});
