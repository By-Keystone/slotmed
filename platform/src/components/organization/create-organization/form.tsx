"use client";

import { Input } from "@/components/common/form/input";
import { fieldError, type FieldErrors } from "@/lib/actions/types";

interface OrganizationFields extends Record<string, unknown> {
  name: string;
}

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  fieldErrors?: FieldErrors<OrganizationFields>;
}

export const CreateOrganizationForm = ({
  formId,
  action,
  fieldErrors,
}: Props) => {
  return (
    <form id={formId} action={action}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="name">Nombre</label>
        <Input name="name" error={fieldError(fieldErrors, "name")} />
      </div>
    </form>
  );
};
