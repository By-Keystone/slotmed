import { Building2, CalendarDays, UserRound } from "lucide-react";
import { StatCard } from "./statcard";
import { Welcome } from "./welcome";
import { getDoctorCount } from "@/lib/actions/doctor";
import { getSedeCount } from "@/lib/actions/sede";
import { UserRole } from "@/lib/utils";

interface Props {
  appointmentCount: number;
  isAdmin: boolean;
}

export async function DashboardStatistics({
  appointmentCount,
  isAdmin,
}: Props) {
  const [doctorCount, sedeCount] = await Promise.all([
    isAdmin ? getDoctorCount() : null,
    isAdmin ? getSedeCount() : null,
  ]);

  return (
    <>
      <Welcome />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Citas este mes"
          value={appointmentCount}
          color="blue"
        />
        {doctorCount?.ok && (
          <StatCard
            icon={UserRound}
            label="Doctores"
            value={doctorCount.data?.count}
            color="teal"
          />
        )}
        {sedeCount?.ok && (
          <StatCard
            icon={Building2}
            label="Sedes"
            value={sedeCount.data.count}
            color="purple"
          />
        )}
      </div>
    </>
  );
}
