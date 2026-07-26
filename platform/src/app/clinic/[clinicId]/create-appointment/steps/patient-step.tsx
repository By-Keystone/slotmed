"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface BookingPatient {
  name: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
}

interface Props {
  specialtyName: string;
  doctorName: string;
  date: string;
  time: string;
  onNext: (patient: BookingPatient) => void;
  onBack: () => void;
}

export function PatientStep({
  specialtyName,
  doctorName,
  date,
  time,
  onNext,
  onBack,
}: Props) {
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.currentTarget);

    onNext({
      name: formData.get("name") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Tus datos</h2>
      <p className="mt-1 text-sm text-gray-500">
        Completa tus datos para confirmar la cita.
      </p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-900">{specialtyName}</span>{" "}
          con <span className="font-medium text-gray-900">{doctorName}</span>
        </p>
        <p className="mt-0.5">
          {date} a las {time}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email (opcional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            Atrás
          </Button>
          <Button type="submit" className="flex-1" disabled={pending}>
            Confirmar reserva
          </Button>
        </div>
      </form>
    </div>
  );
}
