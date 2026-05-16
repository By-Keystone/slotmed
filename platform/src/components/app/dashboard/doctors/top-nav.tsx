"use client";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app/app.context";
import { UserRole } from "@/lib/utils";
import { useState } from "react";

export const TopNav = () => {
  const { membership } = useApp();

  const [isCreateDoctorModalOpen, setIsCreateDoctorModalOpen] =
    useState<boolean>(false);

  return (
    <div className="flex justify-between items-center">
      <h2>Lista de doctores</h2>
      {membership.resourceType === "ORGANIZATION" &&
        membership.role === UserRole.ADMIN && (
          <Button onClick={() => setIsCreateDoctorModalOpen(true)}>
            Invitar nuevo doctor
          </Button>
        )}
    </div>
  );
};
