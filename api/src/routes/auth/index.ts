import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { registerSchema, RegisterUseCase, ConflictError } from "../../application/auth/register.usecase.js";
import { loginSchema, LoginUseCase, UnauthorizedError, ForbiddenError } from "../../application/auth/login.usecase.js";
import { RefreshTokenUseCase } from "../../application/auth/refresh-token.usecase.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/user.repository.js";
import { PrismaRefreshTokenRepository } from "../../infrastructure/prisma/refresh-token.repository.js";

const userRepo = new PrismaUserRepository();
const refreshTokenRepo = new PrismaRefreshTokenRepository();

export default async function authRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post("/auth/register", { schema: { body: registerSchema } }, async (request, reply) => {
    try {
      const useCase = new RegisterUseCase(userRepo);
      const result = await useCase.execute(request.body);
      return reply.status(201).send(result);
    } catch (error) {
      if (error instanceof ConflictError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });

  app.post("/auth/login", { schema: { body: loginSchema } }, async (request, reply) => {
    try {
      const useCase = new LoginUseCase(userRepo, refreshTokenRepo);
      const result = await useCase.execute(request.body);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      return reply.send({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return reply.status(401).send({ message: error.message });
      }
      if (error instanceof ForbiddenError) {
        return reply.status(403).send({ message: error.message });
      }
      throw error;
    }
  });

  fastify.post("/auth/refresh", async (request, reply) => {
    const token = request.cookies.refresh_token;
    if (!token) {
      return reply.status(401).send({ message: "No refresh token" });
    }

    try {
      const useCase = new RefreshTokenUseCase(userRepo, refreshTokenRepo);
      const result = await useCase.execute(token);

      reply.setCookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60,
      });

      return reply.send({ accessToken: result.accessToken });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        reply.clearCookie("refresh_token", { path: "/auth/refresh" });
        return reply.status(401).send({ message: error.message });
      }
      throw error;
    }
  });

  fastify.post("/auth/logout", async (request, reply) => {
    const token = request.cookies.refresh_token;
    if (token) {
      await refreshTokenRepo.deleteByToken(token).catch(() => {});
    }
    reply.clearCookie("refresh_token", { path: "/auth/refresh" });
    return reply.send({ message: "Logged out" });
  });
}
