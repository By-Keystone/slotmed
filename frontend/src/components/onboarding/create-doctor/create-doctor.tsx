"use client";

import { Loader2, UserRound } from "lucide-react";
import { SLOT_OPTIONS } from "../utils";
import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/context/onboarding/onboarding.context";
import { ActionResult } from "@/lib/actions/doctor";

interface Props {
  state: ActionResult | null;
  action: (payload: FormData) => void;
  pending: boolean;
}

export const CreateDoctor = ({ action, state, pending }: Props) => {
  const { clinicId } = useOnboardingContext();

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <UserRound className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Agrega tu primer doctor
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Puedes agregar más desde el panel después
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <form action={action} className="flex flex-col gap-5">
          {clinicId && <input type="hidden" name="clinicId" value={clinicId} />}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="doctor-name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              id="doctor-name"
              name="name"
              type="text"
              required
              placeholder="Dr. Juan García"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="specialty"
              className="text-sm font-medium text-gray-700"
            >
              Especialidad
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              placeholder="Medicina General"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doctor-phone"
                className="text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                id="doctor-phone"
                name="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doctor-email"
                className="text-sm font-medium text-gray-700"
              >
                Correo
              </label>
              <input
                id="doctor-email"
                name="email"
                type="email"
                placeholder="doctor@consultorio.com"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {state?.ok === false && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar y entrar al panel"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
