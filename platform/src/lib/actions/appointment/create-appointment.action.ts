"use server";

import { doFetchJson } from "@/lib/api/fetch";
import { ApiError } from "@/lib/api/errors";
import { toActionState } from "@/lib/actions/to-action-state";
import type { ActionState } from "@/lib/actions/types";
import type { CreateAppointmentInput } from "@/lib/api/appointments/types";

export async function createAppointmentAction(
  input: CreateAppointmentInput,
): Promise<ActionState> {
  try {
    await doFetchJson("/appointment", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { status: "error", message: "Ese horario ya no está disponible" };
    }
    return toActionState(error);
  }
}
