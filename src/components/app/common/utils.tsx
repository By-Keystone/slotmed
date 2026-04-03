import { UserRole } from "@/lib/utils";
import {
  Building2,
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
};

const userNavLinks: NavLink[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/appointments", label: "Citas", icon: CalendarDays },
];

const adminNavLinks: NavLink[] = [
  { href: "/doctors", label: "Doctores", icon: UserRound },
  {
    href: "/clinics",
    label: "Sede",
    icon: Building2,
  },
];

const doctorNavLinks: NavLink[] = [
  { href: "/profile", label: "Configuración", icon: Settings },
];

export function getNavLinks({
  role,
  isDoctor,
}: {
  role: string;
  isDoctor: boolean;
}): NavLink[] {
  const navLinks: NavLink[] = [...userNavLinks];

  if (role === UserRole.ADMIN) {
    navLinks.push(...adminNavLinks);
  }

  console.log({ isDoctor });

  if (isDoctor) navLinks.push(...doctorNavLinks);

  return navLinks;
}
