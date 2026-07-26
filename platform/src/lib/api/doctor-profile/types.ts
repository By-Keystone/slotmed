export type DoctorAvailability = {
  id: string;
  dayOfWeek: number; // 0=domingo ... 6=sábado
  startTime: string; // "09:00"
  endTime: string; // "17:00"
};
