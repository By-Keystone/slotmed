import { doFetch } from "@/lib/api/fetch";
import { MembershipRole } from "@/lib/utils";
import { NoMembershipError } from "../errors";
import { UserMembership } from "./types";

export type ClinicAccess = {
  resourceId: string;
  name: string;
  role: MembershipRole;
  accessVia: "INHERITED_FROM_ORG" | "DIRECT";
  membershipId?: string;
  joinedAt?: Date;
};

export type Membership = {
  organization: {
    resourceId: string;
    name: string;
  };
  membership: {
    membershipId: string;
    role: MembershipRole;
    joinedAt: Date;
  } | null;
  accountId: string | null;
  clinics: ClinicAccess[];
};

export const tags = {
  memberships: () => "memberships",
  membershipsForResource: (id: string) => `${id}-memberships`,
};

export const userMembershipsApi = {
  getUserMemberships: async () =>
    doFetch("/user/me/memberships", {
      method: "GET",
      next: { tags: [tags.memberships()] },
    }),
  getMembershipForResource: async (
    resourceId: string,
  ): Promise<UserMembership> => {
    const res = await doFetch(`/user/me/resource/${resourceId}/membership`, {
      next: { tags: [tags.membershipsForResource(resourceId)] },
    });

    const membership = await res.json();

    if (!membership) throw new NoMembershipError();

    return membership;
  },
};
