"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteUserForm } from "./form";
import { inviteUserAction } from "@/lib/actions/user/invite-user.action";
import { Specialty } from "@/lib/api/specialty/types";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialties: Specialty[];
}

const FORM_ID = "invite-user-form";

export const InviteUserModal = ({ isOpen, setIsOpen, specialties }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { resourceId, clinicId } = useParams<{
    resourceId: string;
    clinicId: string;
  }>();

  const submit = (formData: FormData) => {
    setError(null);

    const role = formData.get("role");
    const specialtyIds = formData.getAll("specialtyIds");
    if (role === "DOCTOR" && specialtyIds.length === 0) {
      setError("Seleccioná al menos una especialidad");
      return;
    }

    startTransition(async () => {
      const result = await inviteUserAction(clinicId, { status: "idle" }, formData);

      if (result.status === "success") {
        setIsOpen(false);
        return;
      }
      if (result.status === "auth-expired") {
        setError("Tu sesión expiró. Inicia sesión de nuevo.");
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
          <DialogTitle>Invitar usuario</DialogTitle>
        </DialogHeader>
        <InviteUserForm
          formId={FORM_ID}
          action={submit}
          organizationId={resourceId}
          specialties={specialties}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button form={FORM_ID} type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar invitación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
