"use client";

import { useState, useTransition } from "react";
import { CreateOrganizationForm } from "@/components/organization/create-organization/form";
import { createOrganizationAction } from "@/components/organization/create-organization/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FORM_ID = "create-organization-form";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const CreateOrganizationModal = ({ isOpen, setIsOpen }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const result = await createOrganizationAction(
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
          <DialogTitle>Nueva organización</DialogTitle>
        </DialogHeader>
        <CreateOrganizationForm formId={FORM_ID} action={submit} />
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
