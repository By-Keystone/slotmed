"use server";

import { doFetch } from "@/lib/api/fetch";
import { tags } from "@/lib/api/availability";
import { AvailabilityBlock } from "@/lib/api/availability/types";
import { getSession } from "@/lib/auth/session";
import { revalidateTag } from "next/cache";

export type SaveAvailabilityState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string }
  | { status: "auth-expired" };

/**
 * Reemplaza toda la disponibilidad del doctor autenticado en una clínica
 * (replace-all). El backend resuelve el doctor por la sesión + el clinicId.
 */
export async function saveAvailability(
  clinicId: string,
  blocks: AvailabilityBlock[],
): Promise<SaveAvailabilityState> {
  const session = await getSession();
  if (!session) return { status: "auth-expired" };

  console.log({ blocks });

  // return { status: "success" };

  try {
    const response = await doFetch(`/clinic/${clinicId}/availability`, {
      method: "PUT",
      body: JSON.stringify({ availabilities: blocks }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : "No se pudo guardar la disponibilidad";
      return { status: "error", message };
    }

    revalidateTag(tags.clinicAvailability(clinicId));
    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ha ocurrido un error",
    };
  }
}
