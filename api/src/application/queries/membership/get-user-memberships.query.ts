import { UserRole } from "@/domain/enums/user-role";
import { z } from "zod";

export const getUserMembershipsSchema = z.object({
  userId: z.string(),
});

export type UserMembershipsDTO = z.infer<typeof getUserMembershipsSchema>;

export type ClinicAccess = {
  resourceId: string;
  name: string;
  role: UserRole;
  accessVia: "DIRECT" | "INHERITED_FROM_ORG";
  membershipId?: string;
  joinedAt?: Date;
};

export type OrganizationGroup = {
  organization: {
    resourceId: string;
    name: string;
  };
  accountId: string | null;
  membership: {
    membershipId: string;
    role: UserRole;
    joinedAt: Date;
  } | null;
  clinics: ClinicAccess[];
};

export interface IUserMembershipsQuery {
  execute(userId: string, accountId: string): Promise<OrganizationGroup[]>;
}
