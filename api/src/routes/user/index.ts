import { IEmailService } from "@/application/ports/email-service.port";
import { getUserMembershipSchema } from "@/application/queries/membership/get-user-membership.query";
import { GetUserByEmailQuery, getUserByEmailQueryParamsSchema } from "@/application/queries/user/get-user-by-email.query";
import {
  inviteUserSchema,
  InviteUserUseCase,
} from "@/application/use-cases/user/invite-user.usecase";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { ITransactionManager } from "@/domain/services/transaction-manager";
import { GetUserMembership } from "@/infrastructure/postgres/queries/membership/get-user-membership.query";
import { UserMembershipsQuery } from "@/infrastructure/postgres/queries/membership/get-user-memberships.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { FastifyInstance } from "fastify";

interface UserRoutesOptions {
  userRepository: IUserRepository;
  transactionManager: ITransactionManager;
  emailService: IEmailService;
}
export default async function userRoutes(
  fastify: FastifyInstance,
  opts: UserRoutesOptions,
) {
  const { userRepository, transactionManager, emailService } = opts;

  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.authorize);

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/me/memberships",
    { preHandler: [fastify.requireAccount] },
    async (request, reply) => {
      try {
        const query = new UserMembershipsQuery();

        const memberships = await query.execute(
          request.user.userId,
          request.user.accountId!,
        );

        return reply.status(200).send({ memberships });
      } catch (error) {
        console.error(
          "Unknown error occurred when getting user memberships:",
          error,
        );

        return reply
          .status(500)
          .send({ message: "Could not get user memberships" });
      }
    },
  );

  app.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = await userRepository.findById(request.user.userId);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        confirmed: user.confirmed,
        onboardingCompleted: user.onboardingCompleted,
        accountId: request.user.accountId,
        role: request.user.role,
      });
    },
  );

  app.get(
    "/me/resource/:resourceId/membership",
    { schema: { params: getUserMembershipSchema } },
    async (request, reply) => {
      try {
        const query = new GetUserMembership();
        const { resourceId } = request.params;

        const membership = await query.execute({
          userId: request.user.userId,
          resourceId,
        });

        console.log(JSON.stringify(membership, null, 2));

        return reply.status(200).send(membership);
      } catch (error) {
        console.error("Error occured when getting membership:", error);

        return reply.internalServerError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener membership",
        );
      }
    },
  );

  app.post(
    "/invite",
    {
      schema: { body: inviteUserSchema },
      preHandler: [fastify.requireAccount],
    },
    async (request, reply) => {
      try {
        const useCase = new InviteUserUseCase(transactionManager, {
          emailService,
        });

        await useCase.execute({
          ...request.body,
          createdBy: request.user.userId,
          accountId: request.user.accountId!,
        });

        return reply.status(200).send({ message: "Se ha enviado la invitación al usuario" });
      } catch (error) {
        console.error({ error });
        return reply.status(500).send({ message: "Ha ocurrido un error al invitar al usuario" });
      }
    },
  );

  app.get("/by-email", { preHandler: [fastify.requireAccount], schema: { querystring: getUserByEmailQueryParamsSchema } }, async (request, reply) => {
    try {
      const query = new GetUserByEmailQuery();

      const user = await query.execute({ email: request.query.email });

      return reply.status(200).send({ user })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025")
        return reply.status(404).send({ user: null })

      console.error("Ocurrió un error buscando usuario por correo: ", error);

      return reply.status(500).send({ message: "Ocurrió un error al buscar usuario por correo" })
    }
  })
}
