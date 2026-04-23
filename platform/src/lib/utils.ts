import { config } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
import { COOKIE_NAMES } from "./cognito/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
}

export enum DocumentType {
  DNI = "DNI",
}

export enum UserType {
  DOCTOR = "DOCTOR",
  USER = "USER",
}
export const DOCUMENT_TYPES = Object.values(DocumentType);

export const getSettings = () => {
  const env = process.env.NODE_ENV;

  return config[env];
};
