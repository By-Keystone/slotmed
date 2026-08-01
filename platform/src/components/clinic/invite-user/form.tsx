"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/common/form/input";
import { Specialty } from "@/lib/api/specialty/types";
import {
  LookedUpUser,
  lookupUserByEmailAction,
} from "@/lib/actions/user/lookup-user-by-email.action";
import { SpecialtyMultiSelect } from "./specialty-multi-select";
import { fieldError, type FieldErrors } from "@/lib/actions/types";

interface InviteUserFields extends Record<string, unknown> {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialtyIds: string[];
}

interface Props {
  formId: string;
  action: (formData: FormData) => void;
  organizationId: string;
  specialties: Specialty[];
  fieldErrors?: FieldErrors<InviteUserFields>;
}

export const InviteUserForm = ({
  formId,
  action,
  organizationId,
  specialties,
  fieldErrors,
}: Props) => {
  const [role, setRole] = useState<"USER" | "DOCTOR">("USER");
  const [existingUser, setExistingUser] = useState<LookedUpUser | null>(null);
  const [isLookingUp, startLookup] = useTransition();

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (!email) {
      setExistingUser(null);
      return;
    }

    startLookup(async () => {
      const user = await lookupUserByEmailAction(email);
      setExistingUser(user);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    action(new FormData(e.currentTarget));
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Correo electrónico</label>
        <Input
          name="email"
          onBlur={handleEmailBlur}
          error={fieldError(fieldErrors, "email")}
        />
        {isLookingUp && (
          <p className="text-xs text-gray-400">Buscando usuario...</p>
        )}
        {existingUser && (
          <p className="text-xs text-blue-600">
            Usuario existente: {existingUser.name} {existingUser.lastName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="name">Nombre</label>
          <Input
            key={`name-${existingUser?.id ?? "new"}`}
            name="name"
            value={existingUser?.name}
            error={fieldError(fieldErrors, "name")}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="lastName">Apellido</label>
          <Input
            key={`lastName-${existingUser?.id ?? "new"}`}
            name="lastName"
            value={existingUser?.lastName}
            error={fieldError(fieldErrors, "lastName")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="phone">Teléfono</label>
        <Input
          key={`phone-${existingUser?.id ?? "new"}`}
          name="phone"
          value={existingUser?.phone}
          error={fieldError(fieldErrors, "phone")}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as "USER" | "DOCTOR")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="USER">Usuario</option>
          <option value="DOCTOR">Doctor</option>
        </select>
      </div>

      {role === "DOCTOR" && (
        <SpecialtyMultiSelect
          organizationId={organizationId}
          initialSpecialties={specialties}
        />
      )}
    </form>
  );
};
