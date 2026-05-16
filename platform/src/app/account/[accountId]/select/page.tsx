import { MembershipsList } from "@/components/account/select-membership/memberships-list";
import { TopHeader } from "@/components/account/select-membership/top-header";
import { type Membership, userMembershipsApi } from "@/lib/api/memberships";

export default async function SelectPage() {
  const response = await userMembershipsApi.getUserMemberships();
  const json = await response.json().catch(() => ({ memberships: [] }));
  const memberships: Membership[] = json.memberships ?? [];

  return (
    <div className="px-8 py-4 flex flex-col">
      <TopHeader />
      <MembershipsList memberships={memberships} />
    </div>
  );
}
