import {
  CreateApointmentUseCase,
  createAppointmentSchema,
} from "@/application/use-cases/appointment/create-appointment.usecase";
import { Prisma } from "@prisma/client";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { FastifyInstance } from "fastify";
import { policy } from "@/plugins/policy";
import { ApplicationError } from "@/application/errors/application.errors";

export default async function appointmentRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "",
    { schema: { body: createAppointmentSchema }, ...policy({ public: true }) },
    async (request, reply) => {
      try {
        const command = new CreateApointmentUseCase();

        await command.execute(request.body);

        // TODO: Send an email afterwards
        return reply.status(200).send({ message: "Cita creada con éxito" });
      } catch (error) {
        // El horario ya fue tomado por otro paciente (choca con el
        // @@unique([doctorProfileId, scheduledAt])).
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply
            .status(409)
            .send({ message: "Ese horario ya no está disponible" });
        } else if (error instanceof ApplicationError)
          return reply
            .status(error.statusCode)
            .send({ message: error.message });

        console.error("Ocurrio un error al crear appointment", error);

        return reply
          .status(500)
          .send({ message: "Ocurrio un error al crear cita" });
      }
    },
  );
}
