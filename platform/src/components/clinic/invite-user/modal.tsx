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

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const FORM_ID = "invite-user-form";

export const InviteUserModal = ({ isOpen, setIsOpen }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { clinicId } = useParams<{ clinicId: string }>();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
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
        <InviteUserForm formId={FORM_ID} action={submit} />
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
