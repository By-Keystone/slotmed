"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { InviteUserModal } from "./invite-user/modal";

export const UsersTopHeader = () => {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-700">Usuarios</h1>
      <Button onClick={() => setInviteModalOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Invitar usuario
      </Button>
      <InviteUserModal
        isOpen={inviteModalOpen}
        setIsOpen={setInviteModalOpen}
      />
    </div>
  );
};
