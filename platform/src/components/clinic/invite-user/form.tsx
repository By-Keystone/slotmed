import { Input } from "@/components/common/form/input";

interface Props {
  formId: string;
  action: (formData: FormData) => void;
}

export const InviteUserForm = ({ formId, action }: Props) => {
  return (
    <form id={formId} action={action} className="flex flex-col gap-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="name">Nombre</label>
          <Input name="name" />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="lastName">Apellido</label>
          <Input name="lastName" />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Correo electrónico</label>
        <Input name="email" />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="phone">Teléfono</label>
        <Input name="phone" />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          defaultValue="USER"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="USER">Usuario</option>
          <option value="DOCTOR">Doctor</option>
        </select>
      </div>
    </form>
  );
};
