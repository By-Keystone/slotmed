import { createClient } from "@/lib/supabase/server"
import { CalendarDays, UserRound, Building2, Clock } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.name ?? "Usuario"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hola, {name} 👋</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido a tu panel de SlotMed
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Citas hoy" value="—" color="blue" />
        <StatCard icon={Clock} label="Pendientes" value="—" color="yellow" />
        <StatCard icon={UserRound} label="Doctores" value="—" color="teal" />
        <StatCard icon={Building2} label="Consultorios" value="—" color="purple" />
      </div>

      {/* Próximas citas */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Próximas citas</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarDays className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No hay citas programadas por ahora</p>
        </div>
      </div>
    </div>
  )
}

const colorMap = {
  blue:   "bg-blue-50 text-blue-600",
  yellow: "bg-yellow-50 text-yellow-600",
  teal:   "bg-teal-50 text-teal-600",
  purple: "bg-purple-50 text-purple-600",
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: keyof typeof colorMap
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className={`inline-flex rounded-lg p-2 ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
