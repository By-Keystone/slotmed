import { CreateAppointmentInput } from "./types";

export class SlotTakenError extends Error {
  constructor() {
    super("Ese horario ya no está disponible");
  }
}

// Se llama desde el cliente (al confirmar la reserva), por eso pega contra
// el rewrite same-origin `/api/appointment` en vez de la API directamente.
export const appointmentsApi = {
  create: async (input: CreateAppointmentInput): Promise<void> => {
    const res = await fetch(`/api/appointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.status === 409) {
      throw new SlotTakenError();
    }

    if (!res.ok) {
      throw new Error("No se pudo crear la cita");
    }
  },
};
