"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Specialty {
  id: string;
  name: string;
}

interface Props {
  specialties: Specialty[];
  onNext: (specialty: Specialty) => void;
}

export function SpecialtyStep({ specialties, onNext }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = specialties.find((s) => s.id === selectedId) ?? null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        ¿Qué especialidad necesitas?
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Elige la especialidad para ver los doctores disponibles.
      </p>

      {specialties.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          Esta clínica todavía no tiene especialidades disponibles.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              type="button"
              onClick={() => setSelectedId(specialty.id)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                selectedId === specialty.id
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
            >
              {specialty.name}
            </button>
          ))}
        </div>
      )}

      <Button
        type="button"
        className="mt-8 w-full"
        disabled={!selected}
        onClick={() => selected && onNext(selected)}
      >
        Siguiente
      </Button>
    </div>
  );
}
