import { getDoctorProfileAvailabilityParamsSchema, GetDoctorProfileAvailabilityQuery } from "@/infrastructure/postgres/queries/doctor-profile/get-doctor-profile-availability.query";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";

export default async function doctorProfileRoutes(fastify: FastifyInstance) {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.get('/:doctorProfileId/availability', { schema: { params: getDoctorProfileAvailabilityParamsSchema } }, async (request, reply) => {
        try {
            const command = new GetDoctorProfileAvailabilityQuery();

            const result = await command.execute({ doctorProfileId: request.params.doctorProfileId })

            return reply.status(200).send(result);
        } catch (error) {
            console.error("Ocurrio un error al obtener las disponibilidades del doctor:", error);

            return reply.status(500).send({ message: "Ocurrio un error al obtener las disponibilidades del doctor" })
        }
    })
}