import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const slots = ["09:00", "09:30", "10:30", "11:00", "11:30", "12:00"]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 sm:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">

          {/* Copy */}
          <div className="max-w-xl">
            <Badge variant="teal" className="mb-5">
              Confirmación automática por WhatsApp
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              La agenda de tu{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                consultorio
              </span>
              , en piloto automático.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-500">
              WizyDoc ayuda a médicos y clínicas a gestionar citas, definir
              horarios y confirmar asistencias por WhatsApp. Todo desde un solo lugar.
            </p>

            <ul className="mt-6 flex flex-col gap-2">
              {[
                "Tus pacientes reservan en línea 24/7",
                "Recordatorio automático antes de cada cita",
                "Sin llamadas. Sin cancelaciones de último minuto.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 shrink-0 text-teal-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Comenzar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Ver cómo funciona</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Sin tarjeta de crédito. Empieza en menos de 5 minutos.
            </p>
          </div>

          {/* App mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating WhatsApp notification */}
            <div className="absolute -top-4 -left-4 z-10 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 shadow-lg">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <p className="text-xs font-medium text-green-700">
                Cita confirmada por WhatsApp ✓
              </p>
            </div>

            {/* Main card */}
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              {/* Doctor header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400">Reservar cita</p>
                  <p className="mt-0.5 font-semibold text-gray-900">Dr. García</p>
                  <p className="text-xs text-teal-600">Medicina General</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm font-bold text-blue-600">MG</span>
                </div>
              </div>

              {/* Date */}
              <div className="mt-5">
                <p className="mb-3 text-xs font-medium text-gray-400">
                  Martes, 15 de abril — Horarios disponibles
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                        slot === "09:30"
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient data */}
              <div className="mt-5 rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Paciente</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">María Rodríguez</p>
                <p className="text-xs text-gray-400">+52 55 1234 5678</p>
              </div>

              {/* Confirm button */}
              <button className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Confirmar cita — 09:30
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Se enviará confirmación por WhatsApp
              </p>
            </div>

            {/* Floating stat */}
            <div className="absolute -bottom-4 -right-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-xs text-gray-500">tasa de confirmación</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
