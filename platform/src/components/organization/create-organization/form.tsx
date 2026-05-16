"use client";

import { Input } from "@/components/common/form/input";

interface Props {
  formId: string;
  action: (formData: FormData) => void;
}

export const CreateOrganizationForm = ({ formId, action }: Props) => {
  return (
    <form id={formId} action={action}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="name">Nombre</label>
        <Input name="name" />
      </div>
    </form>
  );
};
