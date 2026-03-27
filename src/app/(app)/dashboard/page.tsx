export const dynamic = "force-dynamic";

import { DashboardStatistics } from "@/components/app/dashboard/stats";
import { CalendarDays } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div>
      <DashboardStatistics />
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Próximas citas</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">
            No hay citas programadas por ahora
          </p>
        </div>
      </div>
    </div>
  );
}
