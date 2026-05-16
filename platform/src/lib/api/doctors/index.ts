import { doFetch } from "../fetch"
import { Doctor } from "./types";

export const doctorsApi = { 
    getDoctorsByResourceId: async (resourceId: string): Promise<Doctor[]> => {
        const res = await doFetch(`/clinic/${resourceId}/doctors`);

        const data = await res.json();

        return data;
    }
}