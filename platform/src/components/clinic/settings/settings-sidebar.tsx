"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { CalendarClock, UserRound, type LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "@/lib/utils";

type SettingsLink = {
  /** Segmento relativo bajo `.../clinic/:clinicId/profile`. "" es la raíz (Mi Perfil). */
  segment: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const settingsLinks: SettingsLink[] = [
  { segment: "", label: "Mi Perfil", icon: UserRound },
  { segment: "availability", label: "Mi Disponibilidad", icon: CalendarClock },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const params = useParams<{ accountId: string; clinicId: string }>();

  const base = `/account/${params.accountId}/clinic/${params.clinicId}/profile`;

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white px-3 py-6">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Configuración
      </p>
      <nav className="flex flex-col gap-1">
        {settingsLinks.map(({ segment, label, icon: Icon }) => {
          const href = segment ? `${base}/${segment}` : base;
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
