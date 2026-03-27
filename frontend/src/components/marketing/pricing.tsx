import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

const plans = [
  {
    name: "Básico",
    price: "Gratis",
    period: "para siempre",
    description: "Ideal para médicos independientes que quieren empezar.",
    badge: null,
    highlight: false,
    features: [
      "1 consultorio",
      "Hasta 2 médicos",
      "15 citas al mes",
      "Horarios personalizados",
      "Reserva en línea para pacientes",
    ],
    cta: "Empezar gratis",
    href: "/auth/register",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ mes",
    description: "Para consultorios con mayor volumen o varios médicos.",
    badge: "Más popular",
    highlight: true,
    features: [
      "Hasta 3 consultorios",
      "Médicos ilimitados",
      "Citas ilimitadas",
      "Confirmación por WhatsApp",
      "Panel de administración",
      "Todo lo del plan Básico",
    ],
    cta: "Suscribirse",
    href: "/auth/register?plan=pro",
  },
  {
    name: "Clínica",
    price: "$79",
    period: "/ mes",
    description: "Para clínicas medianas que necesitan escala y soporte.",
    badge: null,
    highlight: false,
    features: [
      "Consultorios ilimitados",
      "Médicos ilimitados",
      "Citas ilimitadas",
      "Confirmación por WhatsApp",
      "Reportes y estadísticas",
      "Soporte prioritario",
      "Todo lo del plan Pro",
    ],
    cta: "Hablar con ventas",
    href: "/contact",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Precios
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Un plan para cada necesidad
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Comienza gratis y crece a tu ritmo. Sin permanencia. Cancela cuando quieras.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlight
                ? "relative border-blue-600 shadow-xl ring-2 ring-blue-600"
                : ""}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="blue" className="shadow-sm px-3 py-1 text-xs">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className={plan.highlight ? "pt-8" : ""}>
                <p className="text-sm font-semibold text-gray-500">{plan.name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  variant={plan.highlight ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
