import { doFetch } from "../fetch";
import { AvailabilityBlock } from "./types";

export const tags = {
  clinicAvailability: (clinicId: string) => `clinic-${clinicId}/availability`,
};

export const availabilityApi = {
  /**
   * Disponibilidad del doctor autenticado en una clínica. El backend resuelve
   * el doctor por la sesión + el clinicId.
   */
  getMyAvailability: async (clinicId: string): Promise<AvailabilityBlock[]> => {
    const res = await doFetch(`/clinic/${clinicId}/availability`, {
      method: "GET",
      next: { tags: [tags.clinicAvailability(clinicId)] },
    });

    const data = await res.json();
    return data.availabilities;
  },
};
