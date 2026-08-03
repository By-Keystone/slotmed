import { AppointmentStatus, MembershipRole } from "@prisma/client";
import z from "zod";

export const getClinicAppointmentsParamsSchema = z.object({
  resourceId: z.string(),
});

export type GetClinicAppointmentsDto = z.infer<
  typeof getClinicAppointmentsParamsSchema
> & { role: MembershipRole; userId: string };

/**
 * Cita de la agenda del día. Un DOCTOR sólo recibe las suyas; el resto de roles
 * con membership ven las de toda la clínica, igual que en las métricas.
 */
export interface ClinicAppointment {
  id: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  specialty: string;
  patientName: string;
  patientLastName: string;
  patientPhone: string;
  doctor: {
    name: string;
    lastName: string;
  };
}

export interface IGetClinicAppointmentsQuery {
  execute(dto: GetClinicAppointmentsDto): Promise<ClinicAppointment[]>;
}
