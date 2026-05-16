"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateOrganizationModal } from "./create-organization/modal";

export function TopHeader() {
  const [modalCreateOrganizationOpen, setModalCreateOrganizationOpen] =
    useState<boolean>(false);

  return (
    <div className="text-right">
      <Button onClick={() => setModalCreateOrganizationOpen(true)}>
        Crear organización
      </Button>
      <CreateOrganizationModal
        isOpen={modalCreateOrganizationOpen}
        setIsOpen={setModalCreateOrganizationOpen}
      />
    </div>
  );
}
