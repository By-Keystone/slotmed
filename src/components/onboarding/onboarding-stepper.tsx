"use client";

import { useActionState, useEffect } from "react";
import { createSede } from "@/lib/actions/sede";
import { createDoctor, createDoctorSelf } from "@/lib/actions/doctor";
import { selectRole } from "@/lib/actions/onboarding";
import { Check } from "lucide-react";
import { OnboardingStep } from "@/lib/utils";
import { CreateClinic } from "./create-clinic/create-clinic";
import { STEPS } from "./utils";
import { CreateDoctor } from "./create-doctor/create-doctor";
import { CreateDoctorSelf } from "./create-doctor-self/create-doctor-self";
import { SelectRole } from "./select-role/select-role";
import { useAuth } from "@/context/auth/auth.context";
import { useOnboardingContext } from "@/context/onboarding/onboarding.context";
import { useRouter } from "next/navigation";

export function OnboardingStepper() {
  const router = useRouter();

  const { step, setSedeId, setStep, setIsDoctor, hasCompletedOnboarding, isDoctor } =
    useOnboardingContext();
  const { user } = useAuth();

  const [roleState, roleAction, rolePending] = useActionState(selectRole, null);
  const [sedeState, sedeAction, sedePending] = useActionState(
    createSede.bind(null, user.id),
    null,
  );
  const [doctorState, doctorAction, doctorPending] = useActionState(
    createDoctor,
    null,
  );
  const [doctorSelfState, doctorSelfAction, doctorSelfPending] = useActionState(
    createDoctorSelf,
    null,
  );

  useEffect(() => {
    if (roleState?.ok === true) {
      setIsDoctor(roleState.data.isDoctor);
      setStep(OnboardingStep.RoleSelected);
    }
  }, [roleState]);

  useEffect(() => {
    if (sedeState?.ok === true && !!sedeState.data.sedeId) {
      setSedeId(sedeState.data.sedeId);
      setStep(OnboardingStep.SedeCreated);
    }
  }, [sedeState]);

  useEffect(() => {
    if (doctorState?.ok === true) setStep(OnboardingStep.Completed);
  }, [doctorState]);

  useEffect(() => {
    if (doctorSelfState?.ok === true) setStep(OnboardingStep.Completed);
  }, [doctorSelfState]);

  useEffect(() => {
    if (hasCompletedOnboarding) router.replace("/dashboard");
  }, [hasCompletedOnboarding]);

  return (
    <div className="w-full max-w-lg">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const num = i + 1;
          const done = STEPS.indexOf(s) > num;
          const active = step === s.value;
          return (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    done
                      ? "border-blue-600 bg-blue-600 text-white"
                      : active
                        ? "border-blue-600 bg-white text-blue-600"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                <span
                  className={`text-xs font-medium ${
                    active
                      ? "text-blue-600"
                      : done
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mb-5 h-px w-20 transition-colors ${
                    STEPS.indexOf(s) > num ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === OnboardingStep.Registered && (
        <SelectRole action={roleAction} pending={rolePending} state={roleState} />
      )}

      {step === OnboardingStep.RoleSelected && (
        <CreateClinic
          action={sedeAction}
          state={sedeState}
          pending={sedePending}
        />
      )}

      {step === OnboardingStep.SedeCreated && isDoctor && (
        <CreateDoctorSelf
          action={doctorSelfAction}
          state={doctorSelfState}
          pending={doctorSelfPending}
        />
      )}

      {step === OnboardingStep.SedeCreated && !isDoctor && (
        <CreateDoctor
          action={doctorAction}
          pending={doctorPending}
          state={doctorState}
        />
      )}
    </div>
  );
}
