import { UserRole } from "@/lib/utils";

export interface OrganizationMembership {
  membershipId: string;
  resourceId: string;
  resourceName: string;
  resourceType: "ORGANIZATION";
  role: UserRole;
}

export interface ClinicMembership {
  membershipId: string | null;
  resourceId: string;
  resourceName: string;
  resourceType: "CLINIC";
  parentOrganization: {
    resourceId: string;
    name: string;
  };
  role: UserRole;
  accessVia: "DIRECT" | "INHERITED_FROM_ORG";
}

export type UserMembership = OrganizationMembership | ClinicMembership;

const tags = {
  membersjips: () => ''
}