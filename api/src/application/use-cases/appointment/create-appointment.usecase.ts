import { NotFound } from "@/application/errors/not-found.error";
import { IEmailService } from "@/application/ports/email-service.port";
import { CLINIC_TIME_ZONE, toInstant } from "@/domain/services/clinic-time";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import { renderTemplate } from "@/infrastructure/services/email-service/template-renderer";
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
  /**
   * Hora de reloj de la clínica, sin zona: `"2026-08-06T09:00"`. Es el hueco
   * que el paciente eligió, y el api lo convierte al instante que le
   * corresponde según el huso de la clínica.
   */
  scheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
    error: "scheduledAt debe tener formato YYYY-MM-DDTHH:mm",
  }),
  doctorProfileId: z.string(),
  clinicId: z.string(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

interface Props {
  readonly emailService: IEmailService;
}
export class CreateApointmentUseCase {
  constructor(private readonly props: Props) {}

  async execute(dto: CreateAppointmentDto) {
    const client = getClient();

    const clinic = await client.clinic.findFirst({
      where: { resourceId: dto.clinicId },
    });

    const profile = await client.doctorProfile.findUnique({
      where: { id: dto.doctorProfileId },
      select: { user: { select: { name: true, lastName: true } } },
    });

    if (!clinic) throw new NotFound("Resource does not exist");
    if (!profile) throw new NotFound("User is not a doctor");

    const [date, time] = dto.scheduledAt.split("T");

    const appointment = await client.appointment.create({
      data: {
        ...dto,
        scheduledAt: toInstant(date, time),
        clinicId: clinic.resourceId,
      },
    });

    const scheduledAt = new Intl.DateTimeFormat("es", {
      dateStyle: "full",
      timeStyle: "short",
      // Sin esto el correo mostraría la hora del servidor, que en producción es
      // UTC y no coincide con la que el paciente eligió.
      timeZone: CLINIC_TIME_ZONE,
    }).format(appointment.scheduledAt);

    const html = await renderTemplate("confirm-appointment", {
      patientName: appointment.patientName,
      patientLastName: appointment.patientLastName,
      scheduledAt,
      durationMinutes: appointment.durationMinutes,
      specialty: appointment.specialty,
      doctorName: `${profile.user.name} ${profile.user.lastName}`,
      clinicName: clinic.name,
      clinicAddress: clinic.address,
    });

    await this.props.emailService.send({
      subject: `Tu cita en ${clinic.name} está reservada`,
      to: dto.patientEmail,
      html,
    });
  }
}
