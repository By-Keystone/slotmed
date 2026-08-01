"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { SpecialtyBaseForm } from "./base-form";
import { createSpecialtyAction } from "@/lib/actions/specialty/create-specialty.action";
import { useFormAction } from "@/hooks/useFormAction";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface SpecialtyFields extends Record<string, unknown> {
  name: string;
}

const FORM_ID = "create-specialty-form";

export const CreateSpecialtyModal = ({ isOpen, setIsOpen }: Props) => {
  const { resourceId } = useParams<{ resourceId: string }>();

  const { submit, isPending, fieldErrors } = useFormAction<SpecialtyFields>(
    (formData) =>
      createSpecialtyAction(resourceId, { status: "idle" }, formData),
    {
      successMessage: "Especialidad creada",
      onSuccess: () => setIsOpen(false),
    },
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent size="S">
        <DialogHeader>
          <DialogTitle>Nueva especialidad</DialogTitle>
        </DialogHeader>
        <SpecialtyBaseForm
          formId={FORM_ID}
          action={submit}
          fieldErrors={fieldErrors}
        />
        <DialogFooter>
          <Button form={FORM_ID} type="submit" disabled={isPending}>
            {isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
