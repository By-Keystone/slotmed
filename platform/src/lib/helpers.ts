import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { UserRole } from "./utils";

export async function requireRole(role: UserRole[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user?.user_metadata?.role !== role) return false;

  return true;
}
