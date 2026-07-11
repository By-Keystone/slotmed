import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ accountId: string; clinicId: string }>;
}

export default async function ClinicIndexPage({ params }: Props) {
  const { accountId, clinicId } = await params;

  redirect(`/account/${accountId}/clinic/${clinicId}/dashboard`);
}
