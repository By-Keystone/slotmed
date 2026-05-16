import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import sensible from "@fastify/sensible";
import {
  serializerCompiler,
  validatorCompiler,
} from "@fastify/type-provider-zod";
import authPlugin from "./plugins/auth";
import authorizationPlugin from "./plugins/authorization";
import authRoutes from "./routes/auth/index";
import { PrismaUserRepository } from "./infrastructure/postgres/repositories/user.repository";
import { PrismaRefreshTokenRepository } from "./infrastructure/postgres/repositories/refresh-token.repository";
import { SESEmailService } from "./infrastructure/services/email-service/ses.service";
import { ClinicRepository } from "./infrastructure/postgres/repositories/clinic.repository";
import clinicRoutes from "./routes/clinic/index";
import { DoctorRepository } from "./infrastructure/postgres/repositories/doctor.repository";
import { OrganizationRepository } from "./infrastructure/postgres/repositories/organization.repository";
import organizationRoutes from "./routes/organization/index";
import userRoutes from "./routes/user/index";
import { AccountRepository } from "./infrastructure/postgres/repositories/account.repository";
import { SubscriptionRepository } from "./infrastructure/postgres/repositories/subscription.repository";
import { PostgresTransactionManager } from "./infrastructure/postgres/transaction-manager";
import { AuthStepResolver } from "./infrastructure/auth/auth-step-resolver";
import { JwtSessionTokenSigner } from "./infrastructure/auth/jwt-session-token-signer";
import { JwtAuthTokenService } from "./infrastructure/auth/jwt-auth-token-service";
import { FinalizeAuth } from "./application/use-cases/auth/_shared/finalize-auth";

const fastify = Fastify({
  logger:
    process.env.NODE_ENV === "production"
      ? true
      : {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss.l",
              ignore: "pid,hostname",
            },
          },
        },
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

async function start() {
  const userRepository = new PrismaUserRepository();
  const refreshTokenRepo = new PrismaRefreshTokenRepository();
  const emailService = new SESEmailService({
    region: process.env.AWS_REGION!,
    from: process.env.EMAIL_FROM!,
  });
  const clinicRepository = new ClinicRepository();
  const doctorRepository = new DoctorRepository();
  const organizationRepository = new OrganizationRepository();
  const accountRepository = new AccountRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const transactionManager = new PostgresTransactionManager();

  const jwtSecret = process.env.JWT_SECRET!;
  const jwtSecretBytes = new TextEncoder().encode(jwtSecret);
  const sessionTokenSigner = new JwtSessionTokenSigner(jwtSecretBytes);
  const authTokenService = new JwtAuthTokenService(
    jwtSecretBytes,
    refreshTokenRepo,
    accountRepository,
  );
  const authStepResolver = new AuthStepResolver();
  const finalizeAuth = new FinalizeAuth(
    authStepResolver,
    authTokenService,
    sessionTokenSigner,
  );

  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  await fastify.register(cookie);
  await fastify.register(sensible);
  await fastify.register(authPlugin);
  await fastify.register(authorizationPlugin, {
    userRepository,
  });
  await fastify.register(authRoutes, {
    userRepo: userRepository,
    refreshTokenRepo,
    emailService,
    doctorRepository,
    accountRepository,
    subscriptionRepository,
    transactionManager,
    finalizeAuth,
    sessionTokenSigner,
    jwtSecret,
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  });
  await fastify.register(clinicRoutes, {
    clinicRepository,
  });
  await fastify.register(organizationRoutes, {
    organizationRepository,
    userRepository,
  });

  await fastify.register(userRoutes, {
    prefix: "/user",
    userRepository,
    doctorRepository,
  });

  fastify.get("/health", async () => ({ status: "ok" }));

  const port = Number(process.env.PORT) || 4000;
  const host = process.env.HOST || "0.0.0.0";

  await fastify.listen({ port, host });
  console.log(`Server running at http://${host}:${port}`);
}

start().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
