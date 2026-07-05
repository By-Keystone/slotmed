"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";

export const UsersTopHeader = () => {
  // El formulario de invitación se implementa en WIZ-16.
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-700">Usuarios</h1>
      <Button onClick={() => setInviteModalOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Invitar usuario
      </Button>
      {/* TODO(WIZ-16): renderizar aquí el modal/formulario de invitación */}
    </div>
  );
};
