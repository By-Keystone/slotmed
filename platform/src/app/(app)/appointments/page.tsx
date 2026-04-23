import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/lib/actions/user";
// TODO: implement with DynamoDB
const getAppointmentsBySedeUserId = async (_: any, __?: any, ___?: any): Promise<any[]> => [];
const getAppointmentsByDoctorUserId = async (_: any, __?: any, ___?: any): Promise<any[]> => [];
import { FilterTabs } from "@/components/app/appointments/filter-tabs";
import { UserRole } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-50 text-yellow-700",
  },
  CONFIRMED: {
    label: "Confirmada",
    className: "bg-green-50 text-green-700",
  },
  CANCELLED: {
    label: "Cancelada",
    className: "bg-red-50 text-red-700",
  },
};

function getDateRange(filter: string): { start: string; end: string } {
  const today = new Date();

  function fmt(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  switch (filter) {
    case "yesterday": {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      const s = fmt(d);
      return { start: s, end: s };
    }
    case "tomorrow": {
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      const s = fmt(d);
      return { start: s, end: s };
    }
    case "week": {
      const day = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { start: fmt(monday), end: fmt(sunday) };
    }
    default: {
      const s = fmt(today);
      return { start: s, end: s };
    }
  }
}

export default async function AppointmentsPage({ searchParams }: Props) {
  const { filter = "today" } = await searchParams;

  const supabaseUser = await getUser();
  if (!supabaseUser) redirect("/login");

  const result = await getUserByAuthId(supabaseUser.id);
  if (!result.ok) redirect("/dashboard");

  const { user } = result.data;
  const role = supabaseUser.user_metadata.role as UserRole;
  const { start, end } = getDateRange(filter);

  const isAdmin = role === UserRole.ADMIN;

  const appointments = isAdmin
    ? await getAppointmentsBySedeUserId(user.id, start, end)
    : await getAppointmentsByDoctorUserId(user.id, start, end);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="mt-1 text-sm text-gray-500">
            {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Suspense>
          <FilterTabs />
        </Suspense>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <CalendarDays className="h-6 w-6 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900">No hay citas</p>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron citas para este período
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Paciente
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Doctor
                  </th>
                )}
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Hora
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appointment) => {
                const status =
                  STATUS_LABEL[appointment.status] ?? STATUS_LABEL.PENDING;
                return (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {appointment.patient.name}{" "}
                        {appointment.patient.last_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {appointment.patient.documentType}{" "}
                        {appointment.patient.documentNumber}
                      </p>
                    </td>
                    {isAdmin && "doctor" in appointment && (
                      <td className="px-6 py-4 text-gray-600">
                        {/* @ts-ignore */}
                        Dr. {appointment.doctor.user.name} {/* @ts-ignore */}
                        {appointment.doctor.user.last_name}
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-600">
                      {appointment.scheduled_date}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {appointment.scheduled_time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
