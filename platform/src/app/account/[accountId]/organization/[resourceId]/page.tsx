import { getActiveResource } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ accountId: string }>;
}
export default async function ({ params }: Props) {
  const { accountId } = await params;

  const { resourceId, resourceType } = await getActiveResource();

  if (!resourceId || !resourceType) redirect(`/account/${accountId}/select`);

  return redirect(
    `/account/${accountId}/${resourceType.toLowerCase()}/${resourceId}/dashboard`,
  );
}
