"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
type DoctorSchedule = any;
import { saveSchedule } from "@/lib/actions/schedule";

const DAYS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 0 },
];

type ScheduleSlot = { id?: number; start_time: string; end_time: string };
type ScheduleByDay = Record<number, ScheduleSlot[]>;

function buildScheduleByDay(schedules: DoctorSchedule[]): ScheduleByDay {
  return schedules.reduce<ScheduleByDay>((acc, s) => {
    if (!acc[s.day]) acc[s.day] = [];
    acc[s.day].push({
      id: s.id,
      start_time: s.start_time,
      end_time: s.end_time,
    });
    return acc;
  }, {});
}

interface Props {
  doctorId: number;
  schedules: DoctorSchedule[];
}

export function ScheduleConfig({ doctorId, schedules }: Props) {
  const [schedule, setSchedule] = useState<ScheduleByDay>(
    buildScheduleByDay(schedules),
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  function addSlot(day: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] ?? []), { start_time: "09:00", end_time: "17:00" }],
    }));
  }

  function removeSlot(day: number, index: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  }

  function updateSlot(
    day: number,
    index: number,
    field: "start_time" | "end_time",
    value: string,
  ) {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  }

  async function handleSave() {
    setIsPending(true);
    setError(undefined);
    setSuccess(false);

    const slots = Object.entries(schedule).flatMap(([day, slots]) =>
      slots.map((slot) => ({
        day: Number(day),
        start_time: slot.start_time,
        end_time: slot.end_time,
      })),
    );

    const result = await saveSchedule(doctorId, slots);

    if (!result.ok) setError(result.error);
    else setSuccess(true);

    setIsPending(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm w-full">
      <div className="flex flex-col gap-6 ">
        {DAYS.map(({ label, value }) => (
          <div key={value}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => addSlot(value)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-3 w-3" />
                Agregar rango
              </button>
            </div>

            {!schedule[value]?.length ? (
              <p className="text-xs text-gray-400">Sin disponibilidad</p>
            ) : (
              <div className="flex flex-col gap-2">
                {schedule[value].map((slot, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) =>
                        updateSlot(value, i, "start_time", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-gray-400">—</span>
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) =>
                        updateSlot(value, i, "end_time", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlot(value, i)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
          Schedule guardado correctamente
        </p>
      )}

      <Button onClick={handleSave} disabled={isPending} className="mt-6 w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar horarios"
        )}
      </Button>
    </div>
  );
}
