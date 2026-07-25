import { getClinicDoctorsParamsSchema } from "@/application/queries/clinic/get-clinic-doctors.query";
import { GetClinicDoctorsQuery } from "@/infrastructure/postgres/queries/clinic/get-clinic-doctors.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";

export default async function clinicPublicRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/clinic/:clinicId/doctors",
    { schema: { params: getClinicDoctorsParamsSchema } },
    async (request, reply) => {
      try {
        const query = new GetClinicDoctorsQuery();

        const result = await query.execute(request.params.clinicId);

        return reply.status(200).send(result);
      } catch (error) {
        console.error("Error obteniendo doctores de una clinica", error);

        return reply
          .status(500)
          .send({ message: "Error obteniendo doctores de la clínica" });
      }
    },
  );
}
