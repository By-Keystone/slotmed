import {
  GetUserMembershipDto,
  IGetUserMembership,
  UserMembership,
} from "@/application/queries/membership/get-user-membership.query";
import { UserRole } from "@/domain/enums/user-role";
import { getClient } from "../../transaction-context";

const ROLE_RANK: Record<UserRole, number> = {
  ADMIN: 100,
  USER: 10,
};

function maxRole(a: UserRole, b: UserRole): UserRole {
  return ROLE_RANK[a] >= ROLE_RANK[b] ? a : b;
}

export class GetUserMembership implements IGetUserMembership {
  constructor() {}

  async execute({
    resourceId,
    userId,
  }: GetUserMembershipDto): Promise<UserMembership | undefined> {
    const direct = await getClient().userResourceMembership.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
      include: {
        resource: {
          include: {
            organization: true,
            clinic: { include: { organization: true } },
          },
        },
      },
    });

    if (direct?.resource.type === "ORGANIZATION") {
      const org = direct.resource.organization!;
      return {
        membershipId: direct.id,
        resourceId,
        resourceName: org.name,
        resourceType: "ORGANIZATION",
        role: direct.role as UserRole,
      };
    }

    let clinic = direct?.resource.clinic ?? null;
    if (!clinic) {
      clinic = await getClient().clinic.findUnique({
        where: { resourceId },
        include: { organization: true },
      });
    }

    if (!clinic) return;

    const inherited = await getClient().userResourceMembership.findUnique({
      where: {
        userId_resourceId: { userId, resourceId: clinic.organizationId },
      },
    });

    if (!direct && !inherited) return;

    const directRole = direct ? (direct.role as UserRole) : null;
    const inheritedRole = inherited ? (inherited.role as UserRole) : null;

    let role: UserRole;
    let accessVia: "DIRECT" | "INHERITED_FROM_ORG";
    let membershipId: string | null;

    if (directRole && inheritedRole) {
      role = maxRole(directRole, inheritedRole);
      if (role === inheritedRole && role !== directRole) {
        accessVia = "INHERITED_FROM_ORG";
        membershipId = null;
      } else {
        accessVia = "DIRECT";
        membershipId = direct!.id;
      }
    } else if (directRole) {
      role = directRole;
      accessVia = "DIRECT";
      membershipId = direct!.id;
    } else {
      role = inheritedRole!;
      accessVia = "INHERITED_FROM_ORG";
      membershipId = null;
    }

    return {
      membershipId,
      resourceId,
      resourceName: clinic.name,
      resourceType: "CLINIC",
      parentOrganization: {
        resourceId: clinic.organization.resourceId,
        name: clinic.organization.name,
      },
      role,
      accessVia,
    };
  }
}
