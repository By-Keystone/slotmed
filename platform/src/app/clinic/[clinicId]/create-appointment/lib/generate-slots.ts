import { DoctorAvailability } from "@/lib/api/doctor-profile/types";

export const SLOT_DURATION_MINUTES = 30;

/**
 * Genera los horarios reservables para una fecha a partir de la disponibilidad
 * semanal recurrente del doctor (día de semana + rango horario). No hay forma
 * de excluir horarios ya reservados todavía (no existe persistencia de citas),
 * así que todo lo que cae dentro del rango del doctor para ese día se muestra.
 */
export function generateSlotsForDate(
  date: string, // "YYYY-MM-DD"
  availabilities: DoctorAvailability[],
): string[] {
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

  const slots: string[] = [];

  for (const availability of availabilities) {
    if (availability.dayOfWeek !== dayOfWeek) continue;

    const [startHour, startMinute] = availability.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);

    let current = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    while (current < end) {
      const hour = Math.floor(current / 60)
        .toString()
        .padStart(2, "0");
      const minute = (current % 60).toString().padStart(2, "0");
      slots.push(`${hour}:${minute}`);
      current += SLOT_DURATION_MINUTES;
    }
  }

  return slots.sort();
}
