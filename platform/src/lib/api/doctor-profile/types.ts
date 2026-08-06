export type DoctorAvailability = {
  id: string;
  dayOfWeek: number; // 0=domingo ... 6=sábado
  startTime: string; // "09:00"
  endTime: string; // "17:00"
};

/**
 * Huecos reservables de un rango de días, ya sin los que ocupan otras citas.
 * Los calcula el api: el cliente no conoce ni la duración del hueco ni qué
 * horas están tomadas.
 */
export type DoctorSlots = {
  durationMinutes: number;
  days: Record<string, string[]>; // "YYYY-MM-DD" → ["09:00", "09:30"]
};
