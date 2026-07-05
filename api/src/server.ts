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
import { PrismaUserRepository } from "./infrastructure/postgres/repositories/user.repository";
import { SESEmailService } from "./infrastructure/services/email-service/ses.service";
import { ClinicRepository } from "./infrastructure/postgres/repositories/clinic.repository";
import clinicRoutes from "./routes/clinic/index";
import { DoctorRepository } from "./infrastructure/postgres/repositories/doctor.repository";
import { OrganizationRepository } from "./infrastructure/postgres/repositories/organization.repository";
import organizationRoutes from "./routes/organization/index";
import userRoutes from "./routes/user/index";
import accountRoutes from "./routes/account/index";
import { AccountRepository } from "./infrastructure/postgres/repositories/account.repository";
import { SubscriptionRepository } from "./infrastructure/postgres/repositories/subscription.repository";
import { PostgresTransactionManager } from "./infrastructure/postgres/transaction-manager";
import { fromNodeHeaders } from "better-auth/node";
import auth from "./infrastructure/vendors/auth/better-auth/auth";
import userInvitationRoutes from "./routes/user-invitation";

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

  fastify.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = fromNodeHeaders(request.headers);
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        fastify.log.error(`Authentication Error: ${error}`);
        return reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
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
    transactionManager,
    emailService
  });

  await fastify.register(accountRoutes, {
    userRepository,
    accountRepository,
    subscriptionRepository,
    transactionManager,
  });

  await fastify.register(userInvitationRoutes, { 
    prefix: '/invitations'
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
