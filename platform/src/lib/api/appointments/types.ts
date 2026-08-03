export type CreateAppointmentInput = {
  doctorProfileId: string;
  specialty: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  patientName: string;
  patientLastName: string;
  patientPhone: string;
  patientEmail: string;
  clinicId: string;
};
