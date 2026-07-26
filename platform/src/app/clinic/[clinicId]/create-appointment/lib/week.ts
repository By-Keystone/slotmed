const DAY_LABELS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTH_LABELS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Lunes de la semana que contiene `date`. */
export function startOfWeek(date: Date): Date {
  const result = startOfDay(date);
  const day = result.getDay(); // 0=domingo..6=sábado
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  return result;
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });
}

export function dayLabel(index: number): string {
  return DAY_LABELS[index];
}

export function formatWeekRange(start: Date, end: Date): string {
  const startLabel = `${start.getDate()} ${MONTH_LABELS[start.getMonth()]}`;
  const endLabel = `${end.getDate()} ${MONTH_LABELS[end.getMonth()]}`;
  return `${startLabel} – ${endLabel}`;
}
