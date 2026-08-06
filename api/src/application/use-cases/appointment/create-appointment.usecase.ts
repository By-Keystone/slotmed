import { NotFound } from "@/application/errors/not-found.error";
import { IEmailService } from "@/application/ports/email-service.port";
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
  scheduledAt: z.coerce.date(),
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

    const appointment = await client.appointment.create({
      data: { ...dto, clinicId: clinic.resourceId },
    });

    const scheduledAt = new Intl.DateTimeFormat("es", {
      dateStyle: "full",
      timeStyle: "short",
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
