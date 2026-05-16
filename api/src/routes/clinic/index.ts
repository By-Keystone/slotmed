import { getClinicDoctorsSchema } from "@/application/queries/clinic/get-clinic-doctors.query";
import {
  CreateClinicDto,
  createClinicSchema,
  CreateClinicUseCase,
} from "@/application/use-cases/clinic/create-clinic.usecase";
import { GetClinicsUseCase } from "@/application/use-cases/clinic/get-clinics.usecase";
import { IClinicRepository } from "@/domain/repositories/clinic.repository";
import { GetClinicDoctorsQuery } from "@/infrastructure/postgres/queries/clinic/get-clinic-doctors.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";

export interface ClinicRoutesOptions {
  clinicRepository: IClinicRepository;
}

export default async function clinicRoutes(
  fastify: FastifyInstance,
  opts: ClinicRoutesOptions,
) {
  const { clinicRepository } = opts;

  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.authorize);

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/clinic",
    { schema: { body: createClinicSchema } },
    async (request, reply) => {
      try {
        const useCase = new CreateClinicUseCase(clinicRepository);

        const dto: CreateClinicDto = {
          accountId: request.user.accountId,
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
    "/clinic/:resourceId/doctors",
    { schema: { params: getClinicDoctorsSchema } },
    async (request, reply) => {
      try {
        const query = new GetClinicDoctorsQuery();

        const { resourceId } = request.params;

        const doctors = await query.execute(resourceId);

        return reply.status(200).send(doctors);
      } catch (error) {
        console.error("Error occurred when getting clinic doctors:", error);

        return reply.internalServerError(
          "Error occurred when getting clinic doctors",
        );
      }
    },
  );
}
