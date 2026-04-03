export const dynamic = "force-dynamic";

import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/lib/actions/user";
import { UserRole } from "@/lib/utils";
import { DashboardStatistics } from "@/components/app/dashboard/stats";
import { UpcomingAppointments } from "@/components/app/dashboard/upcoming-appointments";
import {
  getMonthlyAppointmentCountBySedeUserId,
  getMonthlyAppointmentCountByDoctorUserId,
  getUpcomingAppointmentsBySedeUserId,
  getUpcomingAppointmentsByDoctorUserId,
} from "@/lib/repository/booking.repository";

export default async function DashboardPage() {
  const supabaseUser = await getUser();
  if (!supabaseUser) redirect("/login");

  const result = await getUserByAuthId(supabaseUser.id);
  if (!result.ok) redirect("/login");

  const { user } = result.data;
  const role = supabaseUser.user_metadata.role as UserRole;
  const isAdmin = role === UserRole.ADMIN;

  const [appointmentCount, upcoming] = await Promise.all([
    isAdmin
      ? getMonthlyAppointmentCountBySedeUserId(user.id)
      : getMonthlyAppointmentCountByDoctorUserId(user.id),
    isAdmin
      ? getUpcomingAppointmentsBySedeUserId(user.id)
      : getUpcomingAppointmentsByDoctorUserId(user.id),
  ]);

  return (
    <div>
      <DashboardStatistics appointmentCount={appointmentCount} isAdmin={isAdmin} />
      <UpcomingAppointments appointments={upcoming} isAdmin={isAdmin} />
    </div>
  );
}
