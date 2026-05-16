import { UserRole } from "@/lib/utils";
import { StatisticsWrapper } from "@/components/app/dashboard/stats-wrapper";
import { useApp } from "@/context/app/app.context";
import { OrganizationStats } from "@/components/app/dashboard/organization/stats";
import { userMembershipsApi } from "@/lib/api/memberships";
import { useParams } from "next/navigation";

interface PageProps {
  params: Promise<{ resourceId: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { resourceId } = await params;
  const membership =
    await userMembershipsApi.getMembershipForResource(resourceId);

  return (
    <div>
      <StatisticsWrapper>
        {membership.role === UserRole.ADMIN && (
          <OrganizationStats resourceId={membership.resourceId} />
        )}
      </StatisticsWrapper>
      {/* <UpcomingAppointments appointments={upcoming} isAdmin={isAdmin} /> */}
    </div>
  );
}
