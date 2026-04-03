import Link from "next/link"
import { Stethoscope } from "lucide-react"

const links = {
  Producto: [
    { label: "Funcionalidades", href: "#features" },
    { label: "Precios",         href: "#pricing" },
    { label: "Cómo funciona",   href: "#how-it-works" },
  ],
  Empresa: [
    { label: "Sobre nosotros", href: "/about" },
    { label: "Contacto",       href: "/contact" },
    { label: "Blog",           href: "/blog" },
  ],
  Legal: [
    { label: "Privacidad",           href: "/privacy" },
    { label: "Términos de servicio", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SlotMed</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-xs">
              Gestión de citas médicas para sedes médicas que quieren
              operar sin fricciones.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {group}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SlotMed. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400">
            Hecho con cuidado para el sector salud.
          </p>
        </div>
      </div>
    </footer>
  )
}
