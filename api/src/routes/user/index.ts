import { getUserMembershipSchema } from "@/application/queries/membership/get-user-membership.query";
import { IDoctorRepository } from "@/domain/repositories/doctor.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { GetUserMembership } from "@/infrastructure/postgres/queries/membership/get-user-membership.query";
import { UserMembershipsQuery } from "@/infrastructure/postgres/queries/membership/get-user-memberships.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import { request } from "http";

interface UserRoutesOptions {
  userRepository: IUserRepository;
  doctorRepository: IDoctorRepository;
}
export default async function userRoutes(
  fastify: FastifyInstance,
  opts: UserRoutesOptions,
) {
  const { doctorRepository, userRepository } = opts;

  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.authorize);

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get("/me/memberships", async (request, reply) => {
    try {
      const query = new UserMembershipsQuery();

      const memberships = await query.execute(
        request.user.userId,
        request.user.accountId,
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
  });

  app.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = await userRepository.findById(request.user.userId);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const doctor = await doctorRepository.getByUserId(user.id);

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        confirmed: user.confirmed,
        isDoctor: !!doctor,
        onboardingCompleted: user.onboardingCompleted,
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
}
