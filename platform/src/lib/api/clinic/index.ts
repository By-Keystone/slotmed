import { doFetch } from "../fetch";
import { ClinicUser, ClinicWithUser } from "./types";

export const tags = {
  organizationClinics: (organizationId: string) =>
    `organization-${organizationId}/clinics`,
  clinicUsers: (clinicId: string) => `clinic-${clinicId}/users`,
};

export const clinicApi = {
  getOrganizationClinics: async (organizationId: string): Promise<ClinicWithUser[]> => {
    const response = await doFetch(`/organization/${organizationId}/clinics`, {
      method: "GET",
      next: { tags: [tags.organizationClinics(organizationId)] },
    });

    const data = await response.json();

    return data;
  },
  getClinicUsers: async (clinicId: string): Promise<ClinicUser[]> => {
    const response = await doFetch(`/clinic/${clinicId}/users`, {
      method: "GET",
      next: { tags: [tags.clinicUsers(clinicId)] },
    });

    const data = await response.json();

    return data;
  },
};
