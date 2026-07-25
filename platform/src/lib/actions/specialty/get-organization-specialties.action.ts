"use server";

import { specialtyApi } from "@/lib/api/specialty";
import { Specialty } from "@/lib/api/specialty/types";

export async function getOrganizationSpecialtiesAction(
  organizationId: string,
): Promise<Specialty[]> {
  return specialtyApi.getOrganizationSpecialties(organizationId);
}
