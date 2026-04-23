import { CalendarDays } from "lucide-react";
type AppointmentWithDoctor = any;
type AppointmentOnly = any;

interface Props {
  appointments: AppointmentWithDoctor[] | AppointmentOnly[];
  isAdmin: boolean;
}

function fmt(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Hoy";
  if (date.getTime() === tomorrow.getTime()) return "Mañana";
  return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

export function UpcomingAppointments({ appointments, isAdmin }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 font-semibold text-gray-900">Próximas citas</h2>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">No hay citas para hoy ni mañana</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {appointments.map((appt) => (
            <div key={appt.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">
                  {appt.patient.name} {appt.patient.last_name}
                </p>
                {isAdmin && "doctor" in appt && (
                  <p className="text-xs text-gray-400">
                    Dr. {appt.doctor.user.name} {appt.doctor.user.last_name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">{appt.scheduled_time}</p>
                <p className="text-xs text-gray-400">{fmt(appt.scheduled_date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
