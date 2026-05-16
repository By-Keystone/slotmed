"use client";

import { LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo } from "react";
import { getNavLinks } from "./utils";
import { logout } from "@/app/account/actions";
import { useApp } from "@/context/app/app.context";
import { useParams } from "next/navigation";

export function Sidebar() {
  const { membership } = useApp();
  const params = useParams<{ accountId: string }>();

  const { resourceType, resourceId, role } = membership;

  const lowerResourceType = resourceType.toLowerCase();

  const navLinks = useMemo(
    () =>
      getNavLinks({
        role: role,
        resourceType: resourceType,
      }),
    [membership],
  );

  const signOut = async (e: FormEvent) => {
    e.stopPropagation();
    await logout();
  };
  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <Link
        href={`/account/${params.accountId}/${lowerResourceType}/${resourceId}/dashboard`}
        className="flex items-center gap-2 px-2 mb-8"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Stethoscope className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">WizyDoc</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={`/account/${params.accountId}/${lowerResourceType}/${resourceId}/${href}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <p className="px-3 text-xs text-gray-400 truncate mb-2"></p>
        <button
          type="submit"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
