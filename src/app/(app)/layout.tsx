import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/auth/auth.context";
import { Sidebar } from "@/components/app/common/sidebar";
import { NotificationBell } from "@/components/app/common/notification-bell";
import { useHasFeatures } from "@/hooks/useHasFeatures.hook";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { NOTIFICATIONS_ENABLED } = useHasFeatures();

  return (
    <AuthProvider supabaseUser={user}>
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
