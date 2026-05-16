import { Input } from "../common/form/input";

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  clinic?: any;
}

export const ClinicBaseForm = ({ formId, action, clinic }: Props) => {
  return (
    <form id={formId} action={action} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name">Nombre de la clínica</label>
        <Input name="name" value={clinic?.name} />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="phone">Teléfono</label>
        <Input name="phone" />
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="address">Dirección</label>
        <Input name="address" />
      </div>
    </form>
  );
};
