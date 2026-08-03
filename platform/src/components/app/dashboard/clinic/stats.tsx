import { CalendarDays, UserRound, Users } from "lucide-react";
import { clinicApi } from "@/lib/api/clinic";
import { StatCard } from "../statcard";

interface Props {
  resourceId: string;
}

export async function ClinicStats({ resourceId }: Props) {
  const { appointments, doctors, memberships } =
    await clinicApi.getMetrics(resourceId);

  return (
    <>
      <StatCard
        icon={CalendarDays}
        label="Citas de hoy"
        value={appointments}
        color="blue"
      />

      {doctors !== undefined && (
        <StatCard
          icon={UserRound}
          label="Doctores"
          value={doctors}
          color="teal"
        />
      )}

      {memberships !== undefined && (
        <StatCard
          icon={Users}
          label="Usuarios"
          value={memberships}
          color="purple"
        />
      )}
    </>
  );
}
