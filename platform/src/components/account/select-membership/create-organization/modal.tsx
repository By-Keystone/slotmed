"use client";

import { CreateOrganizationForm } from "@/components/organization/create-organization/form";
import { createOrganizationAction } from "@/lib/actions/organization/create-organization.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormAction } from "@/hooks/useFormAction";

const FORM_ID = "create-organization-form";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface OrganizationFields extends Record<string, unknown> {
  name: string;
}

export const CreateOrganizationModal = ({ isOpen, setIsOpen }: Props) => {
  const { submit, isPending, fieldErrors } = useFormAction<OrganizationFields>(
    (formData) => createOrganizationAction({ status: "idle" }, formData),
    {
      successMessage: "Organización creada",
      onSuccess: () => setIsOpen(false),
    },
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent size="S">
        <DialogHeader>
          <DialogTitle>Nueva organización</DialogTitle>
        </DialogHeader>
        <CreateOrganizationForm
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
