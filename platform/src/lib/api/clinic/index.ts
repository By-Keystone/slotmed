import { doFetch } from "../fetch";
import { ClinicWithUser } from "./types";

export const tags = {
  organizationClinics: (organizationId: string) =>
    `organization-${organizationId}/clinics`,
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
};
