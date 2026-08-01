import { ApiError, AuthExpiredError } from "@/lib/api/errors";
import type { ActionState } from "./types";

/**
 * Convierte un error lanzado por la capa de API en el `ActionState` que
 * consume el frontend. Úsalo en el `catch` de las server actions para no
 * repetir el mapeo de errores en cada una.
 */
export function toActionState(error: unknown): ActionState {
  if (error instanceof AuthExpiredError) {
    return { status: "auth-expired" };
  }
  if (error instanceof ApiError) {
    return { status: "error", message: error.message };
  }
  if (error instanceof Error) {
    return { status: "error", message: error.message };
  }
  return { status: "error", message: "Ha ocurrido un error" };
}
