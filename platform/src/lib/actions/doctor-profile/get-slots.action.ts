"use server";

import { doFetchJson } from "@/lib/api/fetch";
import type { DoctorSlots } from "@/lib/api/doctor-profile/types";

/**
 * Horarios libres de un doctor entre dos fechas (ambas inclusive). El wizard la
 * llama cada vez que el paciente cambia de semana, para que los huecos ya
 * reservados no lleguen a mostrarse.
 */
export async function getDoctorSlotsAction(
  doctorProfileId: string,
  from: string,
  to: string,
): Promise<DoctorSlots> {
  const search = new URLSearchParams({ from, to });

  return doFetchJson(
    `/doctor-profile/${doctorProfileId}/slots?${search.toString()}`,
    { cache: "no-store" },
  );
}
