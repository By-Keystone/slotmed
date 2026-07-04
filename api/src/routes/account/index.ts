import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { IAccountRepository } from "@/domain/repositories/account.repository";
import { ISubscriptionRepository } from "@/domain/repositories/subscription.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { ITransactionManager } from "@/domain/services/transaction-manager";
import {
  completeAccountSetupSchema,
  CompleteAccountSetupUseCase,
} from "@/application/use-cases/account/complete-account-setup.usecase";
import { BadRequest } from "@/application/errors/bad-request.errors";

interface AccountRoutesOptions {
  userRepository: IUserRepository;
  accountRepository: IAccountRepository;
  subscriptionRepository: ISubscriptionRepository;
  transactionManager: ITransactionManager;
}

export default async function accountRoutes(
  fastify: FastifyInstance,
  opts: AccountRoutesOptions,
) {
  const {
    userRepository,
    accountRepository,
    subscriptionRepository,
    transactionManager,
  } = opts;
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Onboarding: crea el tenant del usuario autenticado (sesión de Better Auth).
  app.post(
    "/account",
    {
      schema: { body: completeAccountSetupSchema },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const useCase = new CompleteAccountSetupUseCase(
          userRepository,
          accountRepository,
          subscriptionRepository,
          transactionManager,
        );
        const result = await useCase.execute(request.user.userId, request.body);
        return reply.status(201).send(result);
      } catch (error) {
        if (error instanceof BadRequest) {
          return reply.status(400).send({ message: error.message });
        }
        throw error;
      }
    },
  );
}
