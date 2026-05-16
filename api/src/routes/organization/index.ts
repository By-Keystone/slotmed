import { ApplicationError } from "@/application/errors/application.errors";
import { getOrganizationClinicsSchema } from "@/application/queries/organization/get-organization-clinics.query";
import { getOrganizationsClinicCountSchema } from "@/application/queries/organization/get-organizations-clinic-count.query";
import { getOrganizationsDoctorCountSchema } from "@/application/queries/organization/get-organizations-doctor-count.query";
import { ForbiddenError } from "@/application/use-cases/auth/login.usecase";
import {
  CreateOrganizationDto,
  createOrganizationSchema,
  CreateOrganizationUseCase,
} from "@/application/use-cases/organization/create-organization.use-case";
import { IOrganizationRepository } from "@/domain/repositories/organization.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { GetOrganizationClinicsQuery } from "@/infrastructure/postgres/queries/organization/get-organization-clinics.query";
import { GetOrganizationsClinicCountQuery } from "@/infrastructure/postgres/queries/organization/get-organizations-clinic-count.query";
import { GetOrganizationsDoctorCountQuery } from "@/infrastructure/postgres/queries/organization/get-organizations-doctor-count.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";

export interface OrganizationRoutesOptions {
  organizationRepository: IOrganizationRepository;
  userRepository: IUserRepository;
}

export default async function organizationRoutes(
  fastify: FastifyInstance,
  opts: OrganizationRoutesOptions,
) {
  const { organizationRepository, userRepository } = opts;

  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", fastify.authorize);

  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/organization",
    {
      schema: { body: createOrganizationSchema },
      config: { requiredRoles: ["ADMIN"] },
    },
    async (request, reply) => {
      try {
        const useCase = new CreateOrganizationUseCase(
          organizationRepository,
          userRepository,
        );

        const params = request.params as any;

        console.log(request.user);
        const body: CreateOrganizationDto = {
          accountId: request.user.accountId,
          name: request.body.name,
          userId: request.user.userId,
        };

        const result = await useCase.execute(body, params?.onboarding);

        return reply.status(201).send(result);
      } catch (error) {
        if (error instanceof ApplicationError)
          return reply.status(error.statusCode).send({
            message:
              error.message ?? "Ha ocurrido un error al crear la organización",
          });
        console.error("An error occurred when creating organization:", error);

        return reply.internalServerError(
          "An error occurred when creating organization",
        );
      }
    },
  );

  app.get(
    "/organization/:resourceId/metrics/clinic-count",
    {
      schema: { params: getOrganizationsClinicCountSchema },
    },
    async (request, reply) => {
      try {
        const { resourceId } = request.params;

        const query = new GetOrganizationsClinicCountQuery();

        const result = await query.execute({ resourceId });

        return reply.status(200).send(result);
      } catch (error) {
        console.error(
          "An error occurred when getting organization clinic count metrics:",
          error,
        );

        return reply.internalServerError(
          "An error occurred when getting clinic count metric",
        );
      }
    },
  );

  app.get(
    "/organization/:resourceId/metrics/doctor-count",
    {
      schema: { params: getOrganizationsDoctorCountSchema },
    },
    async (request, reply) => {
      try {
        const { resourceId } = request.params;

        const query = new GetOrganizationsDoctorCountQuery();

        const result = await query.execute({ resourceId });

        return reply.status(200).send(result);
      } catch (error) {
        console.error(
          "An error occurred when getting organizations doctor count: ",
          error,
        );

        return reply.internalServerError(
          "An error occurred when getting organizations doctor count",
        );
      }
    },
  );

  app.get(
    "/organization/:resourceId/clinics",
    { schema: { params: getOrganizationClinicsSchema } },
    async (request, reply) => {
      try {
        const { resourceId } = request.params;

        const query = new GetOrganizationClinicsQuery();

        const clinics = await query.execute({ resourceId });

        return reply.status(200).send(clinics);
      } catch (error) {
        console.error(
          "An error occurred when getting clinics of an organization: ",
          error,
        );
        return reply.internalServerError(
          "An error occurred when getting clinics of an organization",
        );
      }
    },
  );
}
