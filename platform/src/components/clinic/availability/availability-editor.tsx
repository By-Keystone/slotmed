"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvailabilityBlock } from "@/lib/api/availability/types";
import { saveAvailability } from "@/lib/actions/availability/save-availability.action";

const DAYS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 0 },
];

type Slot = { startTime: string; endTime: string };
type ScheduleByDay = Record<number, Slot[]>;

function toScheduleByDay(blocks: AvailabilityBlock[]): ScheduleByDay {
  return blocks.reduce<ScheduleByDay>((acc, b) => {
    (acc[b.dayOfWeek] ??= []).push({
      startTime: b.startTime,
      endTime: b.endTime,
    });
    return acc;
  }, {});
}

interface Props {
  initial: AvailabilityBlock[];
}

export function AvailabilityEditor({ initial }: Props) {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [schedule, setSchedule] = useState<ScheduleByDay>(
    toScheduleByDay(initial),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function addSlot(day: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] ?? []), { startTime: "09:00", endTime: "17:00" }],
    }));
  }

  function removeSlot(day: number, index: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] ?? []).filter((_, i) => i !== index),
    }));
  }

  function updateSlot(
    day: number,
    index: number,
    field: keyof Slot,
    value: string,
  ) {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] ?? []).map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  }

  async function handleSave() {
    setPending(true);
    setError(null);
    setSuccess(false);

    const blocks: AvailabilityBlock[] = Object.entries(schedule).flatMap(
      ([day, slots]) =>
        slots.map((slot) => ({
          dayOfWeek: Number(day),
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
    );

    const result = await saveAvailability(clinicId, blocks);
    setPending(false);

    if (result.status === "success") {
      setSuccess(true);
      return;
    }
    if (result.status === "auth-expired") {
      setError("Tu sesión expiró. Inicia sesión de nuevo.");
      return;
    }
    if (result.status === "error") {
      setError(result.message);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Mi Disponibilidad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Define tus horarios de atención en esta clínica. Puedes agregar varios
          rangos por día (por ejemplo, mañana y tarde).
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {DAYS.map(({ label, value }) => (
          <div key={value} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => addSlot(value)}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
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
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(value, i, "startTime", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm text-gray-400">—</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateSlot(value, i, "endTime", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlot(value, i)}
                      className="text-gray-400 transition-colors hover:text-red-500"
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
          Disponibilidad guardada correctamente.
        </p>
      )}

      <Button onClick={handleSave} disabled={pending} className="mt-6">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar disponibilidad"
        )}
      </Button>
    </div>
  );
}
