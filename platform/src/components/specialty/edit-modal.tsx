"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { SpecialtyBaseForm } from "./base-form";
import { updateSpecialtyAction } from "@/lib/actions/specialty/update-specialty.action";
import { Specialty } from "@/lib/api/specialty/types";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialty: Specialty;
}

const FORM_ID = "edit-specialty-form";

export const EditSpecialtyModal = ({ isOpen, setIsOpen, specialty }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { resourceId } = useParams<{ resourceId: string }>();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const result = await updateSpecialtyAction(
        resourceId,
        specialty.id,
        { status: "idle" },
        formData,
      );

      if (result.status === "success") {
        setIsOpen(false);
        return;
      }
      if (result.status === "error") {
        setError(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent size="S">
        <DialogHeader>
          <DialogTitle>Editar especialidad</DialogTitle>
        </DialogHeader>
        <SpecialtyBaseForm formId={FORM_ID} action={submit} specialty={specialty} />
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button form={FORM_ID} type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
