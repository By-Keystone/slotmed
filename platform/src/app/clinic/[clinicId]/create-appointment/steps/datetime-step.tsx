"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDoctorAvailabilityAction } from "@/lib/actions/doctor-profile/get-availability.action";
import { DoctorAvailability } from "@/lib/api/doctor-profile/types";
import { generateSlotsForDate } from "../lib/generate-slots";
import {
  dayLabel,
  formatWeekRange,
  getWeekDays,
  startOfDay,
  startOfWeek,
  toDateKey,
} from "../lib/week";

interface Props {
  doctorProfileId: string;
  onNext: (selection: { date: string; time: string }) => void;
  onBack: () => void;
}

export function DateTimeStep({ doctorProfileId, onNext, onBack }: Props) {
  const [availabilities, setAvailabilities] = useState<
    DoctorAvailability[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setAvailabilities(null);
    setError(null);
    setWeekOffset(0);
    setSelectedDate(null);
    setTime(null);

    getDoctorAvailabilityAction(doctorProfileId)
      .then(setAvailabilities)
      .catch(() => setError("No se pudo cargar la disponibilidad del doctor."));
  }, [doctorProfileId]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(today);
    weekStart.setDate(weekStart.getDate() + weekOffset * 7);
    return getWeekDays(weekStart);
  }, [today, weekOffset]);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!availabilities) return map;
    for (const date of weekDays) {
      const key = toDateKey(date);
      map.set(key, generateSlotsForDate(key, availabilities));
    }
    return map;
  }, [availabilities, weekDays]);

  const slots = selectedDate ? slotsByDate.get(selectedDate) ?? [] : [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Elige fecha y horario
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Selecciona el día y un horario disponible.
      </p>

      {!availabilities && !error && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando disponibilidad...
        </div>
      )}

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {availabilities && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w - 1)}
              disabled={weekOffset === 0}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {formatWeekRange(weekDays[0], weekDays[6])}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {weekDays.map((date, index) => {
              const key = toDateKey(date);
              const daySlots = slotsByDate.get(key) ?? [];
              const isPast = date < today;
              const disabled = isPast || daySlots.length === 0;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDate(key);
                    setTime(null);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-xs font-medium transition-colors",
                    disabled &&
                      "cursor-not-allowed border-gray-100 text-gray-300",
                    !disabled &&
                      selectedDate === key &&
                      "border-blue-600 bg-blue-50 text-blue-700",
                    !disabled &&
                      selectedDate !== key &&
                      "border-gray-200 text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span>{dayLabel(index)}</span>
                  <span className="text-sm">{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <span className="text-sm font-medium text-gray-700">Horarios</span>
            {!selectedDate ? (
              <p className="mt-2 text-sm text-gray-500">
                Elige un día para ver los horarios disponibles.
              </p>
            ) : slots.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">
                El doctor no tiene horarios disponibles ese día.
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                      time === slot
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-8 flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          Atrás
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!selectedDate || !time}
          onClick={() => selectedDate && time && onNext({ date: selectedDate, time })}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
