import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-teal-500 py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Tu consultorio merece una agenda que trabaje por ti
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Únete a los consultorios que ya reducen cancelaciones y mejoran la
          experiencia de sus pacientes con SlotMed.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="white" asChild>
            <Link href="/register">
              Comenzar gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="#how-it-works">Ver cómo funciona</Link>
          </Button>
        </div>

        <p className="mt-5 text-sm text-blue-200">
          Sin tarjeta de crédito · Configuración en 5 minutos · Cancela cuando quieras
        </p>
      </div>
    </section>
  )
}
