"use client";

import { useActionState, useEffect, useState } from "react";
import {
  MapPin,
  Stethoscope,
  Building2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { BookingCalendar } from "./booking-calendar";
import { bookAppointment, getAvailableSlots, TimeSlot } from "@/lib/actions/appointment";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES, DocumentType } from "@/lib/utils";

type Schedule = {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  doctor_id: number;
};

interface Props {
  doctor: {
    id: number;
    specialty: string;
    slot_duration: number;
    user: { name: string; last_name: string };
    sede: { name: string; address: string };
    schedules: Schedule[];
  };
}

export function ScheduleAppointment({ doctor }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [state, action, pending] = useActionState(bookAppointment, null);

  const availableDays = [...new Set(doctor.schedules.map((s) => s.day))];

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
    setLoadingSlots(true);

    const dateStr = selectedDate.toISOString().split("T")[0];
    getAvailableSlots(
      doctor.id,
      dateStr,
      doctor.slot_duration,
      doctor.schedules,
    ).then((result) => {
      if (result.ok) setAvailableSlots(result.slots ?? []);
      setLoadingSlots(false);
    });
  }, [selectedDate]);

  if (state?.ok === true) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">¡Cita agendada!</h2>
        <p className="mt-2 text-gray-500">
          Recibirás un correo de confirmación con los detalles de tu cita.
        </p>
      </div>
    );
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Doctor card */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Stethoscope className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Dr. {doctor.user.name} {doctor.user.last_name}
          </h2>
          <p className="mt-1 text-sm font-medium text-blue-600">
            {doctor.specialty}
          </p>

          <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-700">{doctor.sede.name}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-700">
                {doctor.sede.address}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-700">
                Citas de {doctor.slot_duration} minutos
              </span>
            </div>
          </div>

          {doctor.schedules.length > 0 && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Horarios de atención
              </p>
              <ul className="space-y-1.5">
                {doctor.schedules.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>{DAY_NAMES[s.day]}</span>
                    <span className="text-gray-500">
                      {s.start_time} – {s.end_time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Booking form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Date */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">
            1. Selecciona una fecha
          </h3>
          {availableDays.length === 0 ? (
            <p className="text-sm text-gray-400">
              Este doctor aún no tiene horarios configurados.
            </p>
          ) : (
            <BookingCalendar
              availableDays={availableDays}
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          )}
        </div>

        {/* Step 2: Time */}
        {selectedDate && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-semibold text-gray-900">
              2. Selecciona un horario
            </h3>
            <p className="mb-4 text-sm capitalize text-gray-500">
              {formattedDate}
            </p>

            {loadingSlots ? (
              <p className="text-sm text-gray-400">Cargando horarios...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-gray-400">
                No hay horarios disponibles para este día.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSlots.map(({ time, booked }) => (
                  <button
                    key={time}
                    disabled={booked}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      booked
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                        : selectedTime === time
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Patient info */}
        {selectedDate && selectedTime && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">3. Tus datos</h3>

            <form action={action} className="flex flex-col gap-4">
              <input type="hidden" name="doctorId" value={doctor.id} />
              <input
                type="hidden"
                name="scheduledDate"
                value={selectedDate.toISOString().split("T")[0]}
              />
              <input type="hidden" name="scheduledTime" value={selectedTime} />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="patientName"
                    type="text"
                    required
                    placeholder="Ana"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="patientLastName"
                    type="text"
                    required
                    placeholder="García"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de documento <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOCUMENT_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600 has-[:checked]:text-white"
                    >
                      <input
                        type="radio"
                        name="documentType"
                        value={type}
                        defaultChecked={type === DocumentType.DNI}
                        required
                        className="sr-only"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Número de documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="documentNumber"
                    type="text"
                    required
                    placeholder="12345678"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Edad <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="patientAge"
                    type="number"
                    required
                    min={1}
                    max={120}
                    placeholder="35"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  name="patientEmail"
                  type="email"
                  required
                  placeholder="ana@correo.com"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  name="patientPhone"
                  type="tel"
                  required
                  placeholder="+51 999 888 777"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {state?.ok === false && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {state.error}
                </p>
              )}

              <div className="mt-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Cita con{" "}
                <strong>
                  Dr. {doctor.user.name} {doctor.user.last_name}
                </strong>{" "}
                el <strong className="capitalize">{formattedDate}</strong> a las{" "}
                <strong>{selectedTime}</strong>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={pending}
              >
                {pending ? "Agendando..." : "Agendar cita"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const DAY_NAMES: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};
