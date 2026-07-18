import { Input } from "../common/form/input";
import { Specialty } from "@/lib/api/specialty/types";

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  specialty?: Specialty;
}

export const SpecialtyBaseForm = ({ formId, action, specialty }: Props) => {
  return (
    <form id={formId} action={action} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name">Nombre de la especialidad</label>
        <Input name="name" value={specialty?.name} />
      </div>
    </form>
  );
};
