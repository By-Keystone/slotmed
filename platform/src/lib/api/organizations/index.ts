import { doFetch } from "../fetch";
import { GetDoctorCountResult, GetClinicCountResult } from "./types";

export const organizationsApi = {
  getClinicCount: async (resourceId: string): Promise<GetClinicCountResult> => {
    const res = await doFetch(
      `/organization/${resourceId}/metrics/clinic-count`,
    );

    const json = await res.json();

    return json;
  },
  getDoctorCount: async (resourceId: string): Promise<GetDoctorCountResult> => {
    const res = await doFetch(
      `/organization/${resourceId}/metrics/doctor-count`,
    );

    const json = await res.json();

    return json;
  },
};
