"use client";

import { Button } from "@/components/ui/button";
import { ActionResult } from "@/lib/actions/clinic";
import { Building2, Loader2 } from "lucide-react";

interface Props {
  action: (payload: FormData) => void;
  state: ActionResult | null;
  pending: boolean;
}

export const CreateClinic = ({ action, state, pending }: Props) => {
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <Building2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Crea tu consultorio
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Esta información aparecerá en tu página de reservas
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del consultorio <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Consultorio Médico García"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Dirección
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Av. Reforma 123, Col. Centro"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo de contacto
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="contacto@consultorio.com"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {state && state.ok === false && state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando consultorio...
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
