import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum OnboardingStatus {
  RegistrationCompleted = "RegistrationCompleted",
  ClinicCreated = "ClinicCreated",
  DoctorCreated = "DoctorCreated",
}

export enum OnboardingStep {
  CreateClinic = "CreateClinic",
  CreateDoctor = "CreateDoctor",
  Completed = "Completed",
}
