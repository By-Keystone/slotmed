import { ClinicBaseForm } from "../base-form";
import type { FieldErrors } from "@/lib/actions/types";

interface ClinicFields extends Record<string, unknown> {
  name: string;
  phone: string;
  address: string;
}

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  fieldErrors?: FieldErrors<ClinicFields>;
}
export function CreateClinicForm({ formId, action, fieldErrors }: Props) {
  return (
    <ClinicBaseForm formId={formId} action={action} fieldErrors={fieldErrors} />
  );
}
