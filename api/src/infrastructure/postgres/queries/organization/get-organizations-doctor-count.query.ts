import { getClient } from "../../transaction-context";
import {
  IGetOrganizationsDoctorCountQuery,
  GetOrganizationsDoctorCountDto,
  GetOrganizationsDoctorCountQueryResult,
} from "../../../../application/queries/organization/get-organizations-doctor-count.query";

export class GetOrganizationsDoctorCountQuery implements IGetOrganizationsDoctorCountQuery {
  constructor() {}

  async execute(
    dto: GetOrganizationsDoctorCountDto,
  ): Promise<GetOrganizationsDoctorCountQueryResult> {
    const doctorCount = await getClient().doctor.count({
      where: {
        user: {
          resourceMemberships: {
            some: { resource: { clinic: { organizationId: dto.resourceId } } },
          },
        },
      },
    });

    return { doctorCount };
  }
}
