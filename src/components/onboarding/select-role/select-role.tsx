"use client";

import { ActionResult } from "@/lib/actions/onboarding";
import { Building2, Stethoscope } from "lucide-react";

interface Props {
  action: (payload: FormData) => void;
  pending: boolean;
  state: ActionResult | null;
}

export const SelectRole = ({ action, pending, state }: Props) => {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          ¿Cuál es tu rol?
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Esto nos ayuda a configurar tu cuenta correctamente
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <form action={action}>
          <input type="hidden" name="is_doctor" value="true" />
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Soy médico</p>
              <p className="text-sm text-gray-500">
                Administro mi consultorio y también soy doctor
              </p>
            </div>
          </button>
        </form>

        <form action={action}>
          <input type="hidden" name="is_doctor" value="false" />
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Solo administro</p>
              <p className="text-sm text-gray-500">
                Gestiono la clínica pero no soy médico
              </p>
            </div>
          </button>
        </form>

        {state?.ok === false && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}
      </div>
    </div>
  );
};
