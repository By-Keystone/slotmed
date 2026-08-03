import { ClinicStats } from "@/components/app/dashboard/clinic/stats";
import { StatisticsWrapper } from "@/components/app/dashboard/stats-wrapper";

interface Props {
  params: Promise<{ clinicId: string }>;
}

export default async function ClinicDashboardPage({ params }: Props) {
  const { clinicId } = await params;

  return (
    <div>
      <StatisticsWrapper>
        <ClinicStats resourceId={clinicId} />
      </StatisticsWrapper>
    </div>
  );
}
