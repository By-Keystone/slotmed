import { OnboardingStep } from "@/lib/utils";
import { Building2, UserRound } from "lucide-react";

export const SLOT_OPTIONS = [
  { label: "15 minutos", value: 15 },
  { label: "20 minutos", value: 20 },
  { label: "30 minutos", value: 30 },
  { label: "45 minutos", value: 45 },
  { label: "60 minutos", value: 60 },
];

export const STEPS = [
  {
    label: "Consultorio",
    icon: Building2,
    value: OnboardingStep.CreateClinic,
  },
  { label: "Doctor", icon: UserRound, value: OnboardingStep.CreateDoctor },
];
