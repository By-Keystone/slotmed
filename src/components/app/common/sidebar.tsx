"use client";

import { useAuth } from "@/context/auth/auth.context";
import { logout } from "@/lib/actions/auth";
import { LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { getNavLinks } from "./utils";

export function Sidebar() {
  const { user, isDoctor } = useAuth();

  const navLinks = useMemo(
    () =>
      getNavLinks({
        role: user.role,
        isDoctor,
      }),
    [user, isDoctor],
  );

  return (
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
        <p className="px-3 text-xs text-gray-400 truncate mb-2">
          {user.name ?? user.email}
        </p>
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
  );
}
