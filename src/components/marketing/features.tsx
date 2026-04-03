import { Calendar, MessageCircle, Building2, Clock } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
    title: "Agenda personalizada",
    description:
      "Cada médico define sus bloques de disponibilidad. Tus pacientes solo ven los turnos realmente libres, sin conflictos ni errores.",
  },
  {
    icon: MessageCircle,
    color: "bg-teal-100 text-teal-600",
    title: "Confirmación por WhatsApp",
    description:
      "Enviamos un recordatorio automático antes de cada cita. El paciente confirma o cancela con un mensaje — sin que tengas que llamar a nadie.",
  },
  {
    icon: Building2,
    color: "bg-indigo-100 text-indigo-600",
    title: "Múltiples sedes",
    description:
      "Gestiona todas tus sedes desde un solo panel. Cada sede tiene sus propios médicos, horarios y configuración.",
  },
  {
    icon: Clock,
    color: "bg-orange-100 text-orange-600",
    title: "Disponible 24/7",
    description:
      "Tus pacientes reservan cuando quieren, desde cualquier dispositivo. Tu agenda se actualiza en tiempo real.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Funcionalidades
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que tu sede necesita
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Diseñado para simplificar la operación diaria de médicos independientes
            y sedes pequeñas y medianas.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="group transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
