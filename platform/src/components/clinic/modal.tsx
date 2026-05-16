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
import { CreateClinicForm } from "./create-clinic/form";
import { createClinicAction } from "./create-clinic/action";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const FORM_ID = "create-clinic-form";

export const CreateClinicModal = ({ isOpen, setIsOpen }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { resourceId } = useParams<{ resourceId: string }>();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const result = await createClinicAction(
        resourceId,
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
          <DialogTitle>Nueva clínica</DialogTitle>
        </DialogHeader>
        <CreateClinicForm formId={FORM_ID} action={submit} />
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button form={FORM_ID} type="submit" disabled={isPending}>
            {isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
