import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import {
  acceptInvitationParamsSchema,
  AcceptInvitationUseCase,
} from "@/application/use-cases/user-invitation/accept-invitation.usecase";
import {
  setPasswordSchema,
  SetPasswordUseCase,
} from "@/application/use-cases/user-invitation/set-password.usecase";
import {
  verifyInvitationTokenParamsSchema,
  VerifyInvitationTokenUseCase,
} from "@/application/use-cases/user-invitation/verify-invitation-token.usecase";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import { request } from "http";
import auth from "@/infrastructure/vendors/auth/better-auth/auth";

interface UserInvitationRoutesOptions {}

export default async function userInvitationRoutes(
  fastify: FastifyInstance,
  opts: UserInvitationRoutesOptions,
) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/:token",
    { schema: { params: verifyInvitationTokenParamsSchema } },
    async (request, reply) => {
      try {
        const usecase = new VerifyInvitationTokenUseCase();

        const result = await usecase.execute({ token: request.params.token });

        return reply
          .status(200)
          .send({ message: "Invitation successfully verified", data: result });
      } catch (error) {
        console.log(`[verify-invitation]: Error: ${error}`);

        if (error instanceof UnprocessableEntity)
          return reply
            .status(422)
            .send({ message: "User already accepted invitation" });
        return reply.status(500).send(error);
      }
    },
  );

  app.post(
    "/:token/accept",
    { schema: { params: acceptInvitationParamsSchema } },
    async (request, reply) => {
      try {
        const usecase = new AcceptInvitationUseCase();

        const result = await usecase.execute({ token: request.params.token });

        return reply
          .status(200)
          .send({ message: "Invitation accepted", data: result });
      } catch (error) {
        console.log(`[accept-invitation]: Error ${error}`);

        if (error instanceof UnprocessableEntity)
          return reply
            .status(422)
            .send({ message: "User already accepted invitation" });

        return reply.status(500).send(error);
      }
    },
  );

  app.post(
    "/set-password",
    { schema: { body: setPasswordSchema } },
    async (request, reply) => {
      try {
        const usecase = new SetPasswordUseCase();

        const result = await usecase.execute(request.body);

        const { headers } = await auth.api.signInEmail({
          body: { email: result.email, password: request.body.password },
          returnHeaders: true,
        });

        const setCookie = headers.get('set-cookie');

        if(setCookie) reply.header('set-cookie', setCookie);
        
        const { email, ...rest } = result;

        return reply
          .status(200)
          .send({ message: "Password successfully set", data: rest });
      } catch (error) {
        console.error(`[set-password]: Error ${error}`);

        return reply.status(500).send(error);
      }
    },
  );
}
