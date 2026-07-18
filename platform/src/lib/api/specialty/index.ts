import { doFetch } from "../fetch";
import { Specialty } from "./types";

export const tags = {
  organizationSpecialties: (organizationId: string) =>
    `organization-${organizationId}/specialties`,
};

export const specialtyApi = {
  getOrganizationSpecialties: async (
    organizationId: string,
  ): Promise<Specialty[]> => {
    const response = await doFetch(`/${organizationId}/specialties`, {
      method: "GET",
      next: { tags: [tags.organizationSpecialties(organizationId)] },
    });

    const data = await response.json();

    return data.specialties;
  },
};
