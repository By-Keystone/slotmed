import { ClinicStats } from "@/components/app/dashboard/clinic/stats";
import { TodayAppointments } from "@/components/app/dashboard/clinic/today-appointments";
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

      <TodayAppointments resourceId={clinicId} />
    </div>
  );
}
