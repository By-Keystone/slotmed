import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/auth/auth.context";
import { Sidebar } from "@/components/app/common/sidebar";
import { NotificationBell } from "@/components/app/common/notification-bell";
import { getSettings } from "@/lib/utils";
import { getSession } from "@/lib/cognito/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { NOTIFICATIONS_ENABLED } = getSettings();

  return (
    <AuthProvider session={session}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 relative">
          {NOTIFICATIONS_ENABLED && <NotificationBell />}
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
