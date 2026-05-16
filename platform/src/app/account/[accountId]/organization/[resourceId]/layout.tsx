import { Sidebar } from "@/components/common/sidebar";
import { AppProvider } from "@/context/app/app.context";
import { userMembershipsApi } from "@/lib/api/memberships";
import { usersApi } from "@/lib/api/user";
import { getActiveResource } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { accountId: string };
}) {
  const { resourceId, resourceType } = await getActiveResource();
  const { accountId } = await params;

  if (!resourceId || !resourceType) redirect(`/account/${accountId}/select`);

  try {
    const [me, membership] = await Promise.all([
      usersApi.getMe(),
      userMembershipsApi.getMembershipForResource(resourceId),
    ]);

    return (
      <AppProvider membership={membership} user={me}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 relative">{children}</main>
        </div>
      </AppProvider>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            No se pudo cargar el workspace
          </h2>
          {error instanceof Error && <p>{error.message}</p>}
        </div>
      </div>
    );
  }
}
