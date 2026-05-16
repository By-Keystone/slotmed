import type { FastifyInstance, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { IEmailService } from "../../application/ports/email-service.port.js";
import type { IUserRepository } from "../../domain/repositories/user.repository.js";
import type { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.js";
import {
  registerSchema,
  RegisterUseCase,
  ConflictError,
} from "../../application/use-cases/auth/register.usecase.js";
import {
  loginSchema,
  LoginUseCase,
  UnauthorizedError,
  ForbiddenError,
} from "../../application/use-cases/auth/login.usecase.js";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh-token.usecase.js";
import {
  confirmUserSchema,
  ConfirmUserUseCase,
} from "@/application/use-cases/auth/confirm-user.usecase.js";
import {
  completeAccountSetupSchema,
  CompleteAccountSetupUseCase,
} from "@/application/use-cases/auth/complete-account-setup.usecase.js";
import { NotFound } from "@/application/errors/not-found.error.js";
import { BadRequest } from "@/application/errors/bad-request.errors.js";
import { IDoctorRepository } from "@/domain/repositories/doctor.repository.js";
import { IAccountRepository } from "@/domain/repositories/account.repository.js";
import { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.js";
import { ITransactionManager } from "@/domain/services/transaction-manager.js";
import { ISessionTokenSigner } from "@/domain/services/session-token-signer.js";
import { FinalizeAuth } from "@/application/use-cases/auth/_shared/finalize-auth.js";
import type { LoginResult } from "@/application/use-cases/auth/_shared/login-result.js";

export interface AuthRoutesOptions {
  userRepo: IUserRepository;
  refreshTokenRepo: IRefreshTokenRepository;
  emailService: IEmailService;
  doctorRepository: IDoctorRepository;
  accountRepository: IAccountRepository;
  subscriptionRepository: ISubscriptionRepository;
  transactionManager: ITransactionManager;
  finalizeAuth: FinalizeAuth;
  sessionTokenSigner: ISessionTokenSigner;
  jwtSecret: string;
  frontendUrl: string;
}

const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function setRefreshCookie(reply: FastifyReply, refreshToken: string) {
  reply.setCookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

function serializeLoginResult(reply: FastifyReply, result: LoginResult) {
  if (result.status === "authenticated") {
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({
      status: result.status,
      accessToken: result.accessToken,
    });
  }
  return reply.send({
    status: result.status,
    sessionToken: result.sessionToken,
  });
}

export default async function authRoutes(
  fastify: FastifyInstance,
  opts: AuthRoutesOptions,
) {
  const {
    userRepo,
    refreshTokenRepo,
    emailService,
    jwtSecret,
    frontendUrl,
    doctorRepository,
    accountRepository,
    subscriptionRepository,
    transactionManager,
    finalizeAuth,
    sessionTokenSigner,
  } = opts;
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/auth/register",
    { schema: { body: registerSchema } },
    async (request, reply) => {
      try {
        const useCase = new RegisterUseCase(userRepo, emailService, {
          jwtSecret,
          frontendUrl,
        });
        const result = await useCase.execute(request.body);
        return reply.status(201).send(result);
      } catch (error) {
        if (error instanceof ConflictError) {
          return reply.status(409).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  app.post(
    "/auth/login",
    { schema: { body: loginSchema } },
    async (request, reply) => {
      try {
        const useCase = new LoginUseCase(userRepo, finalizeAuth);
        const result = await useCase.execute(request.body);
        return serializeLoginResult(reply, result);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return reply.status(401).send({ message: error.message });
        }
        if (error instanceof ForbiddenError) {
          return reply.status(403).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  app.post(
    "/auth/complete-account",
    { schema: { body: completeAccountSetupSchema } },
    async (request, reply) => {
      try {
        const useCase = new CompleteAccountSetupUseCase(
          userRepo,
          accountRepository,
          subscriptionRepository,
          sessionTokenSigner,
          finalizeAuth,
          transactionManager,
        );
        const result = await useCase.execute(request.body);
        return serializeLoginResult(reply, result);
      } catch (error) {
        if (error instanceof BadRequest) {
          return reply.status(400).send({ message: error.message });
        }
        if (error instanceof NotFound) {
          return reply.status(404).send({ message: error.message });
        }
        throw error;
      }
    },
  );

  fastify.post("/auth/refresh", async (request, reply) => {
    const token = request.cookies.refresh_token;
    if (!token) {
      return reply.status(401).send({ message: "No refresh token" });
    }

    try {
      const useCase = new RefreshTokenUseCase(userRepo, refreshTokenRepo);
      const result = await useCase.execute(token);

      return reply.send({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      console.error({ error });
      if (error instanceof UnauthorizedError) {
        reply.clearCookie("refresh_token", { path: "/" });
        return reply
          .status(401)
          .send({ message: error.message, code: "INVALID_TOKEN" });
      }
      throw error;
    }
  });

  fastify.get(
    "/auth/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = await userRepo.findById(request.user.userId);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const [doctor, account] = await Promise.all([
        doctorRepository.getByUserId(user.id),
        accountRepository.findByOwnerId(user.id),
      ]);

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        confirmed: user.confirmed,
        isDoctor: !!doctor,
        onboardingCompleted: user.onboardingCompleted,
        accountId: account?.id ?? null,
      });
    },
  );

  fastify.post("/auth/logout", async (request, reply) => {
    const token = request.cookies.refresh_token;
    if (token) {
      await refreshTokenRepo.deleteByToken(token).catch(() => {});
    }
    reply.clearCookie("refresh_token", { path: "/" });
    return reply.send({ message: "Logged out" });
  });

  app.post(
    "/auth/confirm",
    { schema: { body: confirmUserSchema } },
    async (request, reply) => {
      try {
        const useCase = new ConfirmUserUseCase(userRepo, { jwtSecret });
        await useCase.execute(request.body);

        return reply
          .status(200)
          .send({ message: "User confirmed successfully!" });
      } catch (error) {
        if (error instanceof UnauthorizedError)
          return reply.unauthorized(error.message);
        else if (error instanceof NotFound)
          return reply.notFound(error.message);
        else if (error instanceof BadRequest)
          return reply.badRequest(error.message);

        return reply.internalServerError(
          "An error occurred when confirming user",
        );
      }
    },
  );
}
