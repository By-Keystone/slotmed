"use client";

import { Button } from "@/components/ui/button";
import { ActionResult } from "@/lib/actions/doctor";
import { useOnboardingContext } from "@/context/onboarding/onboarding.context";
import { Loader2, Stethoscope } from "lucide-react";

interface Props {
  action: (payload: FormData) => void;
  state: ActionResult | null;
  pending: boolean;
}

export const CreateDoctorSelf = ({ action, state, pending }: Props) => {
  const { sedeId } = useOnboardingContext();

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <Stethoscope className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Tu perfil médico</h1>
        <p className="mt-1 text-sm text-gray-500">
          Podrás completar el resto desde tu perfil después
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="sedeId" value={sedeId ?? ""} />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="specialty"
              className="text-sm font-medium text-gray-700"
            >
              Especialidad médica <span className="text-red-500">*</span>
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              required
              placeholder="Medicina General"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {state?.ok === false && (
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
                Guardando...
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
