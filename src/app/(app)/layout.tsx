import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/auth/auth.context";
import { Sidebar } from "@/components/app/common/sidebar";

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

  const name = user.user_metadata?.name ?? user.email;

  return (
    <AuthProvider supabaseUser={user}>
      <Sidebar>{children}</Sidebar>
    </AuthProvider>
  );
}
