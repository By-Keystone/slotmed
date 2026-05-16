import { UserRole } from "@/lib/utils";
import {
  Building2,
  Building2Icon,
  CalendarDays,
  LayoutDashboard,
  LucideProps,
  Settings,
  UserRound,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type NavLink = {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  roles?: UserRole[];
};

const clinicNavLinks: NavLink[] = [
  {
    href: "dashboard",
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "appointments",
    label: "Citas",
    icon: CalendarDays,
  },
  {
    href: "doctors",
    label: "Doctores",
    icon: UserRound,
    roles: [UserRole.ADMIN],
  },
  {
    href: "profile",
    label: "Configuración",
    icon: Settings,
    roles: [UserRole.USER],
  },
];

const orgNavLinks: NavLink[] = [
  { href: "users", label: "Usuarios", icon: UserRound },
  { href: "clinics", label: "Clínicas", icon: Building2Icon },
];

export function getNavLinks({
  role,
  resourceType,
}: {
  role: UserRole;
  resourceType: "ORGANIZATION" | "CLINIC";
}): NavLink[] {
  const base = resourceType === "ORGANIZATION" ? orgNavLinks : clinicNavLinks;

  return base.filter((link) =>
    !!link.roles ? link.roles.includes(role) : true,
  );
}
