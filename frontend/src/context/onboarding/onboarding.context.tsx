"use client";

import { OnboardingStatus, OnboardingStep } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../auth/auth.context";
import { useRouter } from "next/navigation";

type OnboardingContextType = {
  clinicId?: string;
  step: OnboardingStep;
  hasCompletedOnboarding: boolean;
  setStep: (step: OnboardingStep) => void;
  setClinicId: (id: string) => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [clinicId, setClinicId] = useState<string>();
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.CreateClinic);

  const { supabaseUser, user, updateSupabaseUserOnboardingStatus } = useAuth();
  const onboardingStep = supabaseUser.user_metadata.onboarding_step;

  useEffect(() => {
    if (onboardingStep == OnboardingStatus.ClinicCreated)
      setStep(OnboardingStep.CreateDoctor);
  }, [supabaseUser]);

  const hasCompletedOnboarding = useMemo(
    () =>
      onboardingStep !== OnboardingStatus.ClinicCreated &&
      onboardingStep !== OnboardingStatus.DoctorCreated &&
      onboardingStep !== OnboardingStatus.RegistrationCompleted,
    [supabaseUser],
  );

  const hasCompletedClinicCreation = useMemo(
    () => onboardingStep === OnboardingStatus.ClinicCreated,
    [supabaseUser],
  );

  const hasCompletedDoctorCreation = useMemo(
    () => onboardingStep === OnboardingStatus.DoctorCreated,
    [supabaseUser],
  );

  useEffect(() => {
    const getClinic = async () => {
      if (hasCompletedClinicCreation && supabaseUser) {
        const res = await fetch(`/api/${user.id}/clinic`);
        const data = await res.json();

        if (data.length === 1) {
          setClinicId(data[0].id);
        }
      }
    };
    getClinic();
  }, [step, hasCompletedClinicCreation, supabaseUser]);

  useEffect(() => {
    if (hasCompletedClinicCreation)
      updateSupabaseUserOnboardingStatus(OnboardingStatus.ClinicCreated);
    else if (hasCompletedDoctorCreation) {
      updateSupabaseUserOnboardingStatus(OnboardingStatus.DoctorCreated);
      router.replace("/dashboard");
    }
  }, [hasCompletedClinicCreation]);

  return (
    <OnboardingContext.Provider
      value={{ step, clinicId, setStep, setClinicId, hasCompletedOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);

  if (!context)
    throw new Error(
      "useOnboardingContext must be used within OnboardingProvider",
    );

  return context;
}
