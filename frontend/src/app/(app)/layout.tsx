import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { logout } from "@/lib/actions/auth"
import { Stethoscope, LayoutDashboard, CalendarDays, UserRound, Building2, LogOut } from "lucide-react"
import { AuthProvider } from "@/context/auth/auth.context"

const navLinks = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/appointments", label: "Citas", icon: CalendarDays },
  { href: "/doctors", label: "Doctores", icon: UserRound },
  { href: "/clinics", label: "Consultorio", icon: Building2 },
]

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: { session } } = await supabase.auth.getSession()
  const name = user.user_metadata?.name ?? user.email

  return (
    <AuthProvider initialSession={session}>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 bg-white px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">SlotMed</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-4">
          <p className="px-3 text-xs text-gray-400 truncate mb-2">{name}</p>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
    </AuthProvider>
  )
}
