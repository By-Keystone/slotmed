import { Input } from "../common/form/input";
import { Specialty } from "@/lib/api/specialty/types";
import { fieldError, type FieldErrors } from "@/lib/actions/types";

interface SpecialtyFields extends Record<string, unknown> {
  name: string;
}

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  specialty?: Specialty;
  fieldErrors?: FieldErrors<SpecialtyFields>;
}

export const SpecialtyBaseForm = ({
  formId,
  action,
  specialty,
  fieldErrors,
}: Props) => {
  return (
    <form id={formId} action={action} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name">Nombre de la especialidad</label>
        <Input
          name="name"
          value={specialty?.name}
          error={fieldError(fieldErrors, "name")}
        />
      </div>
    </form>
  );
};
