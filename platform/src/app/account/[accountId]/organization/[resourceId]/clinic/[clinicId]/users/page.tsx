import { clinicApi } from "@/lib/api/clinic";
import { UsersTable } from "@/components/clinic/users-table";
import { UsersTopHeader } from "@/components/clinic/users-top-header";

interface Props {
  params: Promise<{ clinicId: string }>;
}

export default async function ClinicUsersPage({ params }: Props) {
  const { clinicId } = await params;

  const users = await clinicApi.getClinicUsers(clinicId);

  return (
    <div>
      <UsersTopHeader />
      <UsersTable users={users} />
    </div>
  );
}
