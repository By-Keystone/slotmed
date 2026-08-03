import {
  ClinicAppointment,
  GetClinicAppointmentsDto,
  IGetClinicAppointmentsQuery,
} from "@/application/queries/clinic/get-clinic-appointments.query";
import { getClient } from "../../transaction-context";

export class GetClinicAppointmentsQuery implements IGetClinicAppointmentsQuery {
  async execute(dto: GetClinicAppointmentsDto): Promise<ClinicAppointment[]> {
    // Mismo rango semiabierto que las métricas: [00:00 de hoy, 00:00 de mañana).
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const appointments = await getClient().appointment.findMany({
      where: {
        clinicId: dto.resourceId,
        ...(dto.role === "DOCTOR" && {
          doctorProfile: { userId: dto.userId },
        }),
        scheduledAt: { gte: startOfDay, lt: startOfNextDay },
      },
      orderBy: { scheduledAt: "asc" },
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
        status: true,
        specialty: true,
        patientName: true,
        patientLastName: true,
        patientPhone: true,
        doctorProfile: {
          select: { user: { select: { name: true, lastName: true } } },
        },
      },
    });

    return appointments.map(({ doctorProfile, ...appointment }) => ({
      ...appointment,
      doctor: doctorProfile.user,
    }));
  }
}
