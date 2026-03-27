import { Building2, CalendarDays, UserRound } from "lucide-react";
import { StatCard } from "./statcard";
import { UserRole } from "@/lib/utils";
import { Welcome } from "./welcome";
import db from "@/lib/db";
import { getDoctorCount } from "@/lib/actions/doctor";
import { requireRole } from "@/lib/helpers";
import { getClinicCount } from "@/lib/actions/clinic";

export async function DashboardStatistics() {
  const [doctorCount, clinicCount] = await Promise.all([
    getDoctorCount(),
    getClinicCount(),
  ]);

  console.log({ doctorCount });
  return (
    <>
      <Welcome />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Citas hoy"
          value={0}
          color="blue"
        />
        {doctorCount.ok && (
          <StatCard
            icon={UserRound}
            label="Doctores"
            value={doctorCount?.data?.count}
            color="teal"
          />
        )}

        {clinicCount.ok && (
          <StatCard
            icon={Building2}
            label="Consultorios"
            value={clinicCount.data.count}
            color="purple"
          />
        )}
      </div>
    </>
  );
}
