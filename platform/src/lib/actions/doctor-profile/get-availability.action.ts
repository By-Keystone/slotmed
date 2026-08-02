"use server";

import { doFetchJson } from "@/lib/api/fetch";
import type { DoctorAvailability } from "@/lib/api/doctor-profile/types";

/**
 * Disponibilidad pública de un doctor (usada por el wizard de reserva). Antes
 * era un fetch client-side al rewrite `/api/doctor-profile/*`; ahora pasa por
 * la única vía server-side.
 */
export async function getDoctorAvailabilityAction(
  doctorProfileId: string,
): Promise<DoctorAvailability[]> {
  return doFetchJson(`/doctor-profile/${doctorProfileId}/availability`);
}
