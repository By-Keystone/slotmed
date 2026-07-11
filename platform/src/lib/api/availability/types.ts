/** Un bloque de disponibilidad recurrente del doctor en una clínica. */
export type AvailabilityBlock = {
  dayOfWeek: number; // 0=Domingo ... 6=Sábado
  startTime: string; // "09:00"
  endTime: string; // "17:00"
};
