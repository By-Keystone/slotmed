"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "tomorrow", label: "Mañana" },
  { value: "week", label: "Esta semana" },
] as const;

export function FilterTabs() {
  const searchParams = useSearchParams();
  const current = searchParams.get("filter") ?? "today";

  return (
    <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      {FILTERS.map(({ value, label }) => (
        <Link
          key={value}
          href={`?filter=${value}`}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            current === value
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
