import { Building2, CalendarDays, UserRound } from "lucide-react";
import { Welcome } from "./welcome";
import { ReactNode } from "react";
import { useApp } from "@/context/app/app.context";

interface Props {
  children: ReactNode;
}

export function StatisticsWrapper({ children}: Props) {
  return (
    <>
      <Welcome />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
        {/* <StatCard
          icon={CalendarDays}
          label="Citas este mes"
          value={appointmentCount}
          color="blue"
        /> */}
        {/* {doctorCount?.ok && (
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
        )} */}
      </div>
    </>
  );
}
