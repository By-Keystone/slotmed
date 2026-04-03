"use client";

import { OnboardingStep } from "@/lib/utils";
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
import { getSedeByUserId } from "@/lib/actions/sede";

type OnboardingContextType = {
  sedeId?: number;
  step: OnboardingStep;
  isDoctor: boolean;
  hasCompletedOnboarding: boolean;
  setStep: (step: OnboardingStep) => void;
  setSedeId: (id: number) => void;
  setIsDoctor: (value: boolean) => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sedeId, setSedeId] = useState<number>();

  const { supabaseUser, user, updateOnboardingStep } = useAuth();
  const onboardingStep = supabaseUser.user_metadata
    .onboarding_step as OnboardingStep;

  const [step, setStep] = useState<OnboardingStep>(
    onboardingStep ?? OnboardingStep.Registered,
  );
  const [isDoctor, setIsDoctor] = useState<boolean>(
    (supabaseUser.user_metadata.is_doctor as boolean) ?? false,
  );

  useEffect(() => {
    if (onboardingStep) setStep(onboardingStep);
  }, [supabaseUser]);

  const hasCompletedOnboarding = useMemo(
    () =>
      step === OnboardingStep.Completed ||
      onboardingStep === OnboardingStep.Completed,
    [step, supabaseUser],
  );

  useEffect(() => {
    const getSede = async () => {
      if (onboardingStep === OnboardingStep.SedeCreated && supabaseUser) {
        const result = await getSedeByUserId(user.id);
        if (!result.ok) console.error(result.error);
        if (result.ok && !!result.data.sedeId) setSedeId(result.data.sedeId);
      }
    };
    getSede();
  }, [step, onboardingStep, supabaseUser]);

  return (
    <OnboardingContext.Provider
      value={{
        step,
        sedeId,
        isDoctor,
        setStep,
        setSedeId,
        setIsDoctor,
        hasCompletedOnboarding,
      }}
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
