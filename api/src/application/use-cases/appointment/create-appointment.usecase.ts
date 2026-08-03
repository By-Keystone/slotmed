import { NotFound } from "@/application/errors/not-found.error";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const createAppointmentSchema = z.object({
  patientName: z.string(),
  patientLastName: z.string(),
  patientPhone: z.string(),
  patientEmail: z.string(),
  specialty: z.string(),
  durationMinutes: z
    .number()
    .gt(0, { error: "durationMinutes needs to be greater than 0" }),
  scheduledAt: z.coerce.date(),
  doctorProfileId: z.string(),
  clinicId: z.string(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

export class CreateApointmentUseCase {
  constructor() {}

  async execute(dto: CreateAppointmentDto) {
    const client = getClient();

    const clinic = await client.clinic.findFirst({
      where: { resourceId: dto.clinicId },
    });

    if (!clinic) throw new NotFound("Resource does not exist");

    await client.appointment.create({
      data: { ...dto, clinicId: clinic.resourceId },
    });
  }
}
