import { IGetOrganizationsClinicCountQuery } from "@/application/queries/organization/get-organizations-clinic-count.query";
import {
  GetOrganizationsClinicCountQueryResult,
  GetOrganizationsClinicCountDto,
} from "../../../../application/queries/organization/get-organizations-clinic-count.query";
import { getClient } from "../../transaction-context";

export class GetOrganizationsClinicCountQuery implements IGetOrganizationsClinicCountQuery {
  constructor() {}

  async execute(
    dto: GetOrganizationsClinicCountDto,
  ): Promise<GetOrganizationsClinicCountQueryResult> {
    const clinicCount = await getClient().clinic.count({
      where: { organizationId: dto.resourceId },
    });

    return { clinicCount };
  }
}
