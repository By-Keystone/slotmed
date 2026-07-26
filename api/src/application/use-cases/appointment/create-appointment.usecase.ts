import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const createAppointmentSchema = z.object({
    patientName: z.string(),
    patientLastName: z.string(),
    patientPhone: z.string(),
    patientEmail: z.string(),
    specialty: z.string(),
    durationMinutes: z.string(),
    scheduledAt: z.coerce.date(),
    doctorProfileId: z.string()
})

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

export class CreateApointmentUseCase {
    constructor() { }

    async execute(dto: CreateAppointmentDto) {
        const client = getClient();

        await client.appointment.create({ data: dto })
    }
}