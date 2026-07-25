import { doFetch } from "../fetch"
import { ClinicDoctor } from "./types";

export const doctorsApi = {
    // Endpoint público (sin sesión) — usado por el wizard de reserva.
    getDoctorsByResourceId: async (resourceId: string): Promise<ClinicDoctor[]> => {
        const res = await doFetch(`/clinic/${resourceId}/doctors`);

        const data = await res.json();

        return data;
    }
}