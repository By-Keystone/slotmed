import {
  ClinicMetrics,
  GetClinicMetricsDto,
  IGetClinicMetricsQuery,
} from "@/application/queries/clinic/get-clinic-metrics.query";
import { getClient } from "../../transaction-context";

export class GetClinicMetricsQuery implements IGetClinicMetricsQuery {
  async execute(dto: GetClinicMetricsDto): Promise<ClinicMetrics> {
    const client = getClient();

    // Citas de hoy: rango semiabierto [00:00 de hoy, 00:00 de mañana). Comparar
    // `scheduledAt` con un instante concreto no casaría con ninguna fila.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const [appointments, doctors, memberships] = await Promise.all([
      client.appointment.count({
        where: {
          doctorProfile: {
            clinicId: dto.resourceId,
            ...(dto.role === "DOCTOR" && { userId: dto.userId }),
          },
          scheduledAt: { gte: startOfDay, lt: startOfNextDay },
        },
      }),
      client.doctorProfile.count({ where: { clinicId: dto.resourceId } }),
      client.userResourceMembership.count({
        where: { resourceId: dto.resourceId, deletedAt: null },
      }),
    ]);

    return {
      appointments,
      ...(dto.role === "ADMIN" ? { doctors } : {}),
      ...(dto.role === "ADMIN" ? { memberships } : {}),
    };
  }
}
