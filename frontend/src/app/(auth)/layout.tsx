import Link from "next/link"
import { Stethoscope } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">SlotMed</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SlotMed. Todos los derechos reservados.
      </footer>
    </div>
  )
}
