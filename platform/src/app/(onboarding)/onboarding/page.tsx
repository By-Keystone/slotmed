"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createAccountAction, type CreateAccountState } from "./actions";

const initialState: CreateAccountState = { status: "idle" };

export default function OnboardingPage() {
  const [state, createAccount, isPending] = useActionState(
    createAccountAction,
    initialState,
  );

  return (
    <div className="w-full max-w-md flex justify-self-center h-dvh items-center">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Crea tu cuenta
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configura tu cuenta en WizyDoc para empezar a gestionar tus citas.
          </p>
        </div>

        <form className="flex flex-col gap-4" action={createAccount}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre de la cuenta
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoFocus
              placeholder="Mi consultorio"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {state.status === "error" && !!state.fieldErrors?.name && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          {state.status === "error" && !state.fieldErrors && (
            <p className="text-sm text-red-500" role="alert">
              {state.message}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Creando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
