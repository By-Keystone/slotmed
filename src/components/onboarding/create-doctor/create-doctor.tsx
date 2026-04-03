"use client";

import { Loader2, UserRound } from "lucide-react";
import { SLOT_OPTIONS } from "../utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useOnboardingContext } from "@/context/onboarding/onboarding.context";
import { ActionResult, skipCreateDoctor } from "@/lib/actions/doctor";
import { twMerge } from "tailwind-merge";
import { useActionState } from "react";

interface Props {
  state: ActionResult | null;
  action: (payload: FormData) => void;
  pending: boolean;
}

export const CreateDoctor = ({ action, state, pending }: Props) => {
  const { sedeId } = useOnboardingContext();

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
        <form action={action} className="flex flex-col gap-4">
          <input
            type="hidden"
            id="sedeId"
            name="sedeId"
            value={sedeId ?? ""}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="given-name"
                placeholder="Ana"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="García"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Especialidad Médica
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              required
              placeholder="Ingrese su especialidad médica"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ana@consultorio.com"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Celular
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              autoComplete="phone"
              placeholder="999888777"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {state?.ok === false && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {state.error}
            </p>
          )}
          <div className="flex gap-x-4">
            <Button type="submit" className="mt-2 w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando doctor...
                </>
              ) : (
                "Crear doctor"
              )}
            </Button>
            <Button
              type="button"
              className={twMerge(
                "mt-2 w-full",
                buttonVariants({ variant: "outline" }),
              )}
              onClick={skipCreateDoctor}
            >
              Omitir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
