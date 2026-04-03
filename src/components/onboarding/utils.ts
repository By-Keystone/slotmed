import { OnboardingStep } from "@/lib/utils";
import { Building2, Stethoscope, UserRound } from "lucide-react";

export const SLOT_OPTIONS = [
  { label: "15 minutos", value: 15 },
  { label: "20 minutos", value: 20 },
  { label: "30 minutos", value: 30 },
  { label: "45 minutos", value: 45 },
  { label: "60 minutos", value: 60 },
];

export const STEPS = [
  { label: "Rol", icon: Stethoscope, value: OnboardingStep.Registered },
  { label: "Sede", icon: Building2, value: OnboardingStep.RoleSelected },
  { label: "Doctor", icon: UserRound, value: OnboardingStep.SedeCreated },
];
