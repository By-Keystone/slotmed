import { Input } from "../common/form/input";
import { fieldError, type FieldErrors } from "@/lib/actions/types";

interface ClinicFields extends Record<string, unknown> {
  name: string;
  phone: string;
  address: string;
}

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  clinic?: any;
  fieldErrors?: FieldErrors<ClinicFields>;
}

export const ClinicBaseForm = ({
  formId,
  action,
  clinic,
  fieldErrors,
}: Props) => {
  return (
    <form id={formId} action={action} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name">Nombre de la clínica</label>
        <Input
          name="name"
          value={clinic?.name}
          error={fieldError(fieldErrors, "name")}
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="phone">Teléfono</label>
        <Input name="phone" error={fieldError(fieldErrors, "phone")} />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="address">Dirección</label>
        <Input name="address" error={fieldError(fieldErrors, "address")} />
      </div>
    </form>
  );
};
