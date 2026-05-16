import z from "zod";

export const getOrganizationClinicsSchema = z.object({
  resourceId: z.string(),
});

export type GetOrganizationClinicsDto = z.infer<
  typeof getOrganizationClinicsSchema
>;

export interface GetOrganizationClinicsQueryResult {
  name: string;
  address?: string;
  phone?: string;
  createdBy: {
    name: string;
    lastName: string;
    email: string;
  };
}

export interface IGetOrganizationClinicsQuery {
  execute(
    dto: GetOrganizationClinicsDto,
  ): Promise<GetOrganizationClinicsQueryResult[]>;
}
