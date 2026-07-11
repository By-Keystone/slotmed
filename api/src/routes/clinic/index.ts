import { NotFound } from "@/application/errors/not-found.error";
import { getClinicDoctorsSchema } from "@/application/queries/clinic/get-clinic-doctors.query";
import { getClinicUsersSchema } from "@/application/queries/clinic/get-clinic-users.query";
import {
  GetDoctorAvailabilityDto,
  getDoctorAvailabilityParamsSchema,
  GetDoctorAvailabilityUseCase,
} from "@/application/use-cases/availability/get-doctor-availability.usecase";
import {
  insertAvailabilityBodySchema,
  InsertAvailabilityDto,
  insertAvailabilityParamsSchema,
  InsertAvailabilityUseCase,
} from "@/application/use-cases/availability/insert-availability.usecase";
import {
  CreateClinicDto,
  createClinicSchema,
  CreateClinicUseCase,
} from "@/application/use-cases/clinic/create-clinic.usecase";
import { GetClinicsUseCase } from "@/application/use-cases/clinic/get-clinics.usecase";
import { IClinicRepository } from "@/domain/repositories/clinic.repository";
import { GetClinicUsersQuery } from "@/infrastructure/postgres/queries/clinic/get-clinic-users.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import { request } from "http";

export interface ClinicRoutesOptions {
  clinicRepository: IClinicRepository;
}

export default async function clinicRoutes(
  fastify: FastifyInstance,
  opts: ClinicRoutesOptions,
) {
  const { clinicRepository } = opts;

  fastify.addHook("preHandler", fastify.requireAccount);
  fastify.addHook("preHandler", fastify.authorize);

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/clinic",
    { schema: { body: createClinicSchema } },
    async (request, reply) => {
      try {
        const useCase = new CreateClinicUseCase(clinicRepository);

        const dto: CreateClinicDto = {
          accountId: request.user.accountId!,
          createdBy: request.user.userId,
          ...request.body,
        };

        const result = await useCase.execute(dto);

        return reply.status(201).send(result);
      } catch (error) {
        console.error("An error occured when creating clinic:", error);

        return reply.internalServerError(
          "An error occured when creating clinic",
        );
      }
    },
  );

  app.get("/clinic", async (request, reply) => {
    try {
      const useCase = new GetClinicsUseCase(clinicRepository);

      const result = await useCase.execute();

      return reply.status(200).send(result);
    } catch (error) {
      console.error(`An error occurred when getting clinics: ${error}`);

      return reply.internalServerError(
        "An error occurredn when getting clinics",
      );
    }
  });

  app.get(
    "/clinic/:resourceId/users",
    { schema: { params: getClinicUsersSchema } },
    async (request, reply) => {
      try {
        const query = new GetClinicUsersQuery();

        const { resourceId } = request.params;

        const users = await query.execute(resourceId);

        return reply.status(200).send(users);
      } catch (error) {
        console.error("Error ocurred when getting clinic users:", error);
        return reply.internalServerError(
          "Error ocurred when getting clinic users",
        );
      }
    },
  );

  app.get(
    "/clinic/:clinicId/availability",
    { schema: { params: getDoctorAvailabilityParamsSchema } },
    async (request, reply) => {
      try {
        const useCase = new GetDoctorAvailabilityUseCase();

        const dto: GetDoctorAvailabilityDto = {
          clinicId: request.params.clinicId,
          userId: request.user.userId,
        };

        const result = await useCase.execute(dto);

        return reply.status(200).send(result);
      } catch (error) {
        console.error("Error getting availabilities for doctor:", error);

        if (error instanceof NotFound) {
          return reply
            .status(error.statusCode)
            .send({ message: error.message, code: error.code });
        }

        return reply.status(500).send({
          message: "Error getting availabilities for doctor",
          code: "INTERNAL_ERROR",
        });
      }
    },
  );

  app.put(
    "/clinic/:clinicId/availability",
    {
      schema: {
        params: insertAvailabilityParamsSchema,
        body: insertAvailabilityBodySchema,
      },
    },
    async (request, reply) => {
      try {
        const usecase = new InsertAvailabilityUseCase();

        const dto: InsertAvailabilityDto = {
          clinicId: request.params.clinicId,
          userId: request.user.userId,
          availabilities: request.body.availabilities,
        };

        await usecase.execute(dto);

        return reply
          .status(201)
          .send({ message: "Availabilities created successfully" });
      } catch (error) {}
    },
  );
}
