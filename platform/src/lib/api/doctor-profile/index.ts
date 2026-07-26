import { DoctorAvailability } from "./types";

// A diferencia de `doFetch` (server-only), esto se llama desde el cliente
// (cuando el paciente elige un doctor en el wizard), por eso pega contra el
// rewrite same-origin `/api/doctor-profile/*` en vez de la API directamente.
export const doctorProfileApi = {
  getAvailability: async (
    doctorProfileId: string,
  ): Promise<DoctorAvailability[]> => {
    const res = await fetch(`/api/doctor-profile/${doctorProfileId}/availability`);

    if (!res.ok) {
      throw new Error("No se pudo obtener la disponibilidad del doctor");
    }

    return res.json();
  },
};
