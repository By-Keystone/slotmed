"use client";

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
import { useFormAction } from "@/hooks/useFormAction";
import { toast } from "@/lib/toast";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialties: Specialty[];
}

interface InviteUserFields extends Record<string, unknown> {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialtyIds: string[];
}

const FORM_ID = "invite-user-form";

export const InviteUserModal = ({ isOpen, setIsOpen, specialties }: Props) => {
  const { resourceId, clinicId } = useParams<{
    resourceId: string;
    clinicId: string;
  }>();

  const {
    submit: runInvite,
    isPending,
    fieldErrors,
  } = useFormAction<InviteUserFields>(
    (formData) => inviteUserAction(clinicId, { status: "idle" }, formData),
    {
      successMessage: "Invitación enviada",
      onSuccess: () => setIsOpen(false),
    },
  );

  const submit = (formData: FormData) => {
    const role = formData.get("role");
    const specialtyIds = formData.getAll("specialtyIds");
    if (role === "DOCTOR" && specialtyIds.length === 0) {
      toast.error("Selecciona al menos una especialidad");
      return;
    }
    runInvite(formData);
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
          fieldErrors={fieldErrors}
        />
        <DialogFooter>
          <Button form={FORM_ID} type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar invitación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
