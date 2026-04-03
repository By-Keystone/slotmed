"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateDoctorDialog } from "./create-doctor-dialog";

interface Props {
  doctorCount: number;
  sedeId: number;
}

export function DoctorsHeader({ doctorCount, sedeId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctores</h1>
          <p className="mt-1 text-sm text-gray-500">
            {doctorCount} doctor{doctorCount !== 1 ? "es" : ""} en tu sede
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo doctor
        </Button>
      </div>

      {open && (
        <CreateDoctorDialog sedeId={sedeId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
