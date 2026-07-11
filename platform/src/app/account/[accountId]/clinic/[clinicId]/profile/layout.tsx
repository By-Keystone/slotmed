import { ReactNode } from "react";
import { SettingsSidebar } from "@/components/clinic/settings/settings-sidebar";

export default function ClinicSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="-m-6 flex min-h-full md:-m-8">
      <SettingsSidebar />
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}
