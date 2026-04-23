"use server";

// TODO: implement with DynamoDB
const createAppointment = async (_: any): Promise<any> => {};
const getBookedSlots = async (_: any, __?: any): Promise<any[]> => [];

export type AppointmentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function bookAppointment(
  _: unknown,
  formData: FormData,
): Promise<AppointmentActionResult> {
  const doctorId = Number(formData.get("doctorId"));
  const scheduledDate = formData.get("scheduledDate") as string;
  const scheduledTime = formData.get("scheduledTime") as string;
  const patientName = formData.get("patientName") as string;
  const patientLastName = formData.get("patientLastName") as string;
  const documentType = formData.get("documentType") as string;
  const documentNumber = formData.get("documentNumber") as string;
  const patientAge = Number(formData.get("patientAge"));
  const patientEmail = formData.get("patientEmail") as string;
  const patientPhone = formData.get("patientPhone") as string;

  if (
    !doctorId ||
    !scheduledDate ||
    !scheduledTime ||
    !patientName ||
    !patientLastName ||
    !documentType ||
    !documentNumber ||
    !patientAge ||
    !patientEmail ||
    !patientPhone
  ) {
    return { ok: false, error: "Todos los campos son obligatorios" };
  }

  const booked = await getBookedSlots(doctorId, scheduledDate);
  if (booked.includes(scheduledTime)) {
    return {
      ok: false,
      error: "Este horario ya no está disponible. Por favor elige otro.",
    };
  }

  await createAppointment({
    doctorId,
    patientName,
    patientLastName,
    patientDocumentType: documentType,
    patientDocument: documentNumber,
    patientAge,
    patientEmail,
    patientPhone,
    scheduledDate,
    scheduledTime,
  });

  return { ok: true };
}

export type TimeSlot = { time: string; booked: boolean };

export async function getAvailableSlots(
  doctorId: number,
  dateStr: string,
  slotDuration: number,
  schedules: { day: number; start_time: string; end_time: string }[],
): Promise<AppointmentActionResult & { slots?: TimeSlot[] }> {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();

  const daySchedules = schedules.filter((s) => s.day === dayOfWeek);
  if (daySchedules.length === 0) return { ok: true, slots: [] };

  const allSlots = daySchedules.flatMap((s) =>
    generateTimeSlots(s.start_time, s.end_time, slotDuration),
  );

  const booked = await getBookedSlots(doctorId, dateStr);

  return {
    ok: true,
    slots: allSlots.map((time) => ({ time, booked: booked.includes(time) })),
  };
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMin: number,
): string[] {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const slots: string[] = [];
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + durationMin <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    current += durationMin;
  }

  return slots;
}
