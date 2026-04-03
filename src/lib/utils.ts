import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum OnboardingStep {
  Registered = "Registered",
  RoleSelected = "RoleSelected",
  SedeCreated = "SedeCreated",
  Completed = "Completed",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum DocumentType {
  DNI = "DNI",
}

export const DOCUMENT_TYPES = Object.values(DocumentType);
